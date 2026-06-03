import type { NextRequest } from "next/server";
import type { z } from "zod";
import { successResponse } from "@/lib/api-response";
import { ApiError } from "@/lib/api-error";
import { requireAdmin } from "@/lib/auth";
import { assertCanManageContent } from "@/lib/utils/admin-access";
import { assertRateLimit, getRateLimitKey } from "@/lib/utils/rate-limit";
import { getAiUnavailableMessage, LongCatUnavailableError } from "@/lib/services/longcat";
import { isLongCatConfigured } from "@/lib/env";

export async function handleAdminAiRoute<T extends z.ZodType>(
  request: NextRequest,
  schema: T,
  generate: (data: z.infer<T>, adminId: string) => Promise<Record<string, unknown>>,
  message: string,
) {
  const admin = await requireAdmin(request);
  assertCanManageContent(admin.role);

  assertRateLimit({
    key: getRateLimitKey("admin-ai", admin.id),
    limit: 30,
    windowMs: 60 * 60 * 1000,
  });

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw new ApiError("Invalid AI request", 400, parsed.error.flatten());
  }

  if (!isLongCatConfigured()) {
    const draft = await generate(parsed.data, admin.id);
    return successResponse(
      { ...draft, aiNotice: getAiUnavailableMessage() },
      `${message} (fallback template)`,
    );
  }

  try {
    const draft = await generate(parsed.data, admin.id);
    const notice =
      "_aiFallback" in draft && draft._aiFallback
        ? getAiUnavailableMessage()
        : undefined;

    const { _aiFallback, ...data } = draft;
    void _aiFallback;

    return successResponse(
      notice ? { ...data, aiNotice: notice } : data,
      message,
    );
  } catch (error) {
    if (error instanceof LongCatUnavailableError) {
      const draft = await generate(parsed.data, admin.id);
      const { _aiFallback, ...data } = draft;
      void _aiFallback;
      return successResponse(
        { ...data, aiNotice: getAiUnavailableMessage() },
        `${message} (fallback template)`,
      );
    }
    throw error;
  }
}

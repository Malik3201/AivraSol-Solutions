import type { NextRequest } from "next/server";
import { successResponse } from "@/lib/api-response";
import { ApiError } from "@/lib/api-error";
import { contactAssistSchema } from "@/lib/validators/ai.validator";
import { generateContactMessage } from "@/lib/services/longcat";
import { assertRateLimit, getRateLimitKey } from "@/lib/utils/rate-limit";
import { getClientIp } from "@/lib/utils/request-ip";

export async function handleContactAssist(request: NextRequest) {
  assertRateLimit({
    key: getRateLimitKey("contact-assist", getClientIp(request)),
    limit: 10,
    windowMs: 15 * 60 * 1000,
  });

  const body = await request.json();
  const parsed = contactAssistSchema.safeParse(body);
  if (!parsed.success) {
    throw new ApiError("Invalid assist request", 400, parsed.error.flatten());
  }

  const result = await generateContactMessage(parsed.data);

  return successResponse(
    { generatedMessage: result.generatedMessage },
    "Message draft generated",
  );
}

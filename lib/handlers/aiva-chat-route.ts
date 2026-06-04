import type { NextRequest } from "next/server";
import { successResponse } from "@/lib/api-response";
import { ApiError } from "@/lib/api-error";
import { asyncHandler } from "@/lib/utils/async-handler";
import { aivaChatSchema } from "@/lib/validators/ai.validator";
import { aivaChat } from "@/lib/services/longcat";
import { assertRateLimit, getRateLimitKey } from "@/lib/utils/rate-limit";
import { getClientIp } from "@/lib/utils/request-ip";

export const handleAivaChatPost = asyncHandler(async (request: NextRequest) => {
  const body = await request.json();
  const parsed = aivaChatSchema.safeParse(body);
  if (!parsed.success) {
    throw new ApiError("Invalid chat message", 400, parsed.error.flatten());
  }

  const rateKey = parsed.data.sessionId
    ? getRateLimitKey("aiva", parsed.data.sessionId)
    : getRateLimitKey("aiva", getClientIp(request));

  assertRateLimit({
    key: rateKey,
    limit: 20,
    windowMs: 10 * 60 * 1000,
  });

  const result = await aivaChat(parsed.data);

  return successResponse(
    {
      reply: result.reply,
      suggestedActions: result.suggestedActions,
      leadIntent: result.leadIntent,
      recommendedServiceSlug: result.recommendedServiceSlug,
    },
    "AIVA reply generated",
  );
});

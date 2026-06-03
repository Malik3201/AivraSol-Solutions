import type { NextRequest } from "next/server";
import { successResponse } from "@/lib/api-response";
import { ApiError } from "@/lib/api-error";
import { asyncHandler } from "@/lib/utils/async-handler";
import { contactFormSchema } from "@/lib/validators/contact.validator";
import { saveContactLead } from "@/lib/services/contact";
import { assertRateLimit, getRateLimitKey } from "@/lib/utils/rate-limit";
import { getClientIp } from "@/lib/utils/request-ip";

export const POST = asyncHandler(async (request: NextRequest) => {
  assertRateLimit({
    key: getRateLimitKey("contact", getClientIp(request)),
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });

  const body = await request.json();
  const parsed = contactFormSchema.safeParse(body);
  if (!parsed.success) {
    throw new ApiError("Invalid contact form", 400, parsed.error.flatten());
  }

  const lead = await saveContactLead(parsed.data);

  return successResponse(
    { lead },
    "Thank you for reaching out. Our team will respond shortly.",
    undefined,
    201,
  );
});

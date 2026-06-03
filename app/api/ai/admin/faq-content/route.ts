import type { NextRequest } from "next/server";
import { asyncHandler } from "@/lib/utils/async-handler";
import { handleAdminAiRoute } from "@/lib/utils/admin-ai-handler";
import { faqContentAiSchema } from "@/lib/validators/ai.validator";
import { generateFAQContent } from "@/lib/services/longcat";

export const POST = asyncHandler(async (request: NextRequest) => {
  return handleAdminAiRoute(
    request,
    faqContentAiSchema,
    (data, adminId) => generateFAQContent(data, adminId),
    "FAQ content draft generated",
  );
});

import type { NextRequest } from "next/server";
import { asyncHandler } from "@/lib/utils/async-handler";
import { handleAdminAiRoute } from "@/lib/utils/admin-ai-handler";
import { seoContentAiSchema } from "@/lib/validators/ai.validator";
import { generateSEOContent } from "@/lib/services/longcat";

export const POST = asyncHandler(async (request: NextRequest) => {
  return handleAdminAiRoute(
    request,
    seoContentAiSchema,
    (data, adminId) => generateSEOContent(data, adminId),
    "SEO content draft generated",
  );
});

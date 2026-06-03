import type { NextRequest } from "next/server";
import { asyncHandler } from "@/lib/utils/async-handler";
import { handleAdminAiRoute } from "@/lib/utils/admin-ai-handler";
import { blogContentAiSchema } from "@/lib/validators/ai.validator";
import { generateBlogContent } from "@/lib/services/longcat";

export const POST = asyncHandler(async (request: NextRequest) => {
  return handleAdminAiRoute(
    request,
    blogContentAiSchema,
    (data, adminId) => generateBlogContent(data, adminId),
    "Blog content draft generated",
  );
});

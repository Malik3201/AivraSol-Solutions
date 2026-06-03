import type { NextRequest } from "next/server";
import { asyncHandler } from "@/lib/utils/async-handler";
import { handleAdminAiRoute } from "@/lib/utils/admin-ai-handler";
import { projectContentAiSchema } from "@/lib/validators/ai.validator";
import { generateProjectContent } from "@/lib/services/longcat";

export const POST = asyncHandler(async (request: NextRequest) => {
  return handleAdminAiRoute(
    request,
    projectContentAiSchema,
    (data, adminId) => generateProjectContent(data, adminId),
    "Project content draft generated",
  );
});

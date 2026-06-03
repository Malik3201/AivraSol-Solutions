import type { NextRequest } from "next/server";
import { asyncHandler } from "@/lib/utils/async-handler";
import { handleAdminAiRoute } from "@/lib/utils/admin-ai-handler";
import { serviceContentAiSchema } from "@/lib/validators/ai.validator";
import { generateServiceContent } from "@/lib/services/longcat";

export const POST = asyncHandler(async (request: NextRequest) => {
  return handleAdminAiRoute(
    request,
    serviceContentAiSchema,
    (data, adminId) => generateServiceContent(data, adminId),
    "Service content draft generated",
  );
});

import type { NextRequest } from "next/server";
import { successResponse } from "@/lib/api-response";
import { ApiError } from "@/lib/api-error";
import { asyncHandler } from "@/lib/utils/async-handler";
import { getCurrentAdminFromRequest } from "@/lib/auth";

export const GET = asyncHandler(async (request) => {
  const admin = await getCurrentAdminFromRequest(request as NextRequest);
  if (!admin) {
    throw new ApiError("Unauthorized", 401);
  }

  return successResponse({ admin }, "Session active");
});

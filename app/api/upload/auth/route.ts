import type { NextRequest } from "next/server";
import { successResponse } from "@/lib/api-response";
import { ApiError } from "@/lib/api-error";
import { asyncHandler } from "@/lib/utils/async-handler";
import { requireAdmin } from "@/lib/auth";
import { getAuthenticationParameters } from "@/lib/services/imagekit";
import { isImageKitConfigured } from "@/lib/env";

export const GET = asyncHandler(async (request: NextRequest) => {
  await requireAdmin(request);

  if (!isImageKitConfigured()) {
    throw new ApiError("ImageKit is not configured", 503);
  }

  return successResponse(
    getAuthenticationParameters(),
    "ImageKit auth parameters",
  );
});

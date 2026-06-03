import type { NextRequest } from "next/server";
import { successResponse } from "@/lib/api-response";
import { ApiError } from "@/lib/api-error";
import { asyncHandler } from "@/lib/utils/async-handler";
import type { RouteContext } from "@/lib/utils/async-handler";
import { requireAdmin } from "@/lib/auth";
import {
  assertCanDeleteContent,
  assertCanManageContent,
} from "@/lib/utils/admin-access";
import { updateDocument, withId } from "@/lib/services/admin-crud";
import { deleteMediaAssetById } from "@/lib/services/imagekit";
import { MediaAsset } from "@/lib/models/MediaAsset";
import { mediaUpdateSchema } from "@/lib/validators/upload.validator";

export const PATCH = asyncHandler(async (request: NextRequest, context?: RouteContext) => {
  const admin = await requireAdmin(request);
  assertCanManageContent(admin.role);
  const { id } = await context!.params;

  const body = await request.json();
  const parsed = mediaUpdateSchema.safeParse(body);
  if (!parsed.success) {
    throw new ApiError("Invalid media update", 400, parsed.error.flatten());
  }

  const doc = await updateDocument(MediaAsset, id, parsed.data, "Media not found");
  return successResponse(withId(doc), "Media updated");
});

export const DELETE = asyncHandler(async (request: NextRequest, context?: RouteContext) => {
  const admin = await requireAdmin(request);
  assertCanDeleteContent(admin.role);
  const { id } = await context!.params;

  await deleteMediaAssetById(id);
  return successResponse(null, "Media deleted");
});

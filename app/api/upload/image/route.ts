import type { NextRequest } from "next/server";
import { successResponse } from "@/lib/api-response";
import { ApiError } from "@/lib/api-error";
import { asyncHandler } from "@/lib/utils/async-handler";
import { requireAdmin } from "@/lib/auth";
import { uploadImage } from "@/lib/services/imagekit";
import { isImageKitConfigured } from "@/lib/env";
import {
  IMAGEKIT_FOLDERS,
  uploadImageSchema,
} from "@/lib/validators/upload.validator";
import { withId } from "@/lib/services/admin-crud";

export const POST = asyncHandler(async (request: NextRequest) => {
  const admin = await requireAdmin(request);

  if (!isImageKitConfigured()) {
    throw new ApiError("ImageKit is not configured", 503);
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    throw new ApiError("File is required", 400);
  }

  const folderRaw = formData.get("folder")?.toString();
  const altText = formData.get("altText")?.toString();

  const parsed = uploadImageSchema.safeParse({
    folder: folderRaw && IMAGEKIT_FOLDERS.includes(folderRaw as (typeof IMAGEKIT_FOLDERS)[number])
      ? folderRaw
      : undefined,
    altText,
  });

  if (!parsed.success) {
    throw new ApiError("Invalid upload options", 400, parsed.error.flatten());
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const asset = await uploadImage(
    buffer,
    {
      mimeType: file.type,
      size: file.size,
      originalName: file.name,
    },
    {
      folder: parsed.data.folder,
      altText: parsed.data.altText,
      uploadedBy: admin.id,
    },
  );

  return successResponse(withId(asset), "Image uploaded", undefined, 201);
});

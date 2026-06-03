import type { NextRequest } from "next/server";
import { successResponse } from "@/lib/api-response";
import { ApiError } from "@/lib/api-error";
import { asyncHandler } from "@/lib/utils/async-handler";
import { requireAdmin } from "@/lib/auth";
import { uploadMultiple } from "@/lib/services/imagekit";
import { isImageKitConfigured } from "@/lib/env";
import {
  IMAGEKIT_FOLDERS,
  uploadMultipleSchema,
} from "@/lib/validators/upload.validator";

export const POST = asyncHandler(async (request: NextRequest) => {
  const admin = await requireAdmin(request);

  if (!isImageKitConfigured()) {
    throw new ApiError("ImageKit is not configured", 503);
  }

  const formData = await request.formData();
  const folderRaw = formData.get("folder")?.toString();

  const parsed = uploadMultipleSchema.safeParse({
    folder: folderRaw && IMAGEKIT_FOLDERS.includes(folderRaw as (typeof IMAGEKIT_FOLDERS)[number])
      ? folderRaw
      : undefined,
  });

  if (!parsed.success) {
    throw new ApiError("Invalid upload options", 400, parsed.error.flatten());
  }

  const fileEntries = formData.getAll("files[]");
  const files =
    fileEntries.length > 0
      ? fileEntries
      : formData.getAll("files");

  if (!files.length) {
    throw new ApiError("At least one file is required", 400);
  }

  const payloads = await Promise.all(
    files
      .filter((f): f is File => f instanceof File)
      .map(async (file) => ({
        buffer: Buffer.from(await file.arrayBuffer()),
        mimeType: file.type,
        size: file.size,
        originalName: file.name,
      })),
  );

  if (!payloads.length) {
    throw new ApiError("No valid files provided", 400);
  }

  const result = await uploadMultiple(payloads, {
    folder: parsed.data.folder,
    uploadedBy: admin.id,
  });

  return successResponse(result, "Batch upload completed");
});

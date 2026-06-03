import ImageKit from "imagekit";
import { connectDB } from "@/lib/db";
import { isImageKitConfigured } from "@/lib/env";
import { MediaAsset } from "@/lib/models/MediaAsset";
import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_UPLOAD_BYTES,
  type ImageKitFolder,
} from "@/lib/validators/upload.validator";
import { ApiError } from "@/lib/api-error";

let client: ImageKit | null = null;

export function getImageKitClient(): ImageKit {
  if (!isImageKitConfigured()) {
    throw new ApiError("ImageKit is not configured", 503);
  }

  if (!client) {
    client = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
    });
  }

  return client;
}

export function getImageKitUrlEndpoint(): string | null {
  return (
    process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT ??
    process.env.IMAGEKIT_URL_ENDPOINT ??
    null
  );
}

export function getAuthenticationParameters() {
  const ik = getImageKitClient();
  const params = ik.getAuthenticationParameters();
  return {
    ...params,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: getImageKitUrlEndpoint(),
  };
}

export function validateUploadFile(file: {
  type: string;
  size: number;
  name: string;
}): void {
  if (file.type === "image/svg+xml") {
    throw new ApiError("SVG uploads are not allowed for security reasons", 400);
  }

  if (
    !ALLOWED_IMAGE_MIME_TYPES.includes(
      file.type as (typeof ALLOWED_IMAGE_MIME_TYPES)[number],
    )
  ) {
    throw new ApiError(
      "Invalid file type. Allowed: JPEG, PNG, WebP, AVIF",
      400,
    );
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new ApiError("File exceeds maximum size of 5MB", 400);
  }
}

export interface UploadImageOptions {
  folder?: ImageKitFolder;
  altText?: string;
  uploadedBy?: string;
  fileName?: string;
}

export async function uploadImage(
  file: Buffer,
  meta: { mimeType: string; size: number; originalName: string },
  options: UploadImageOptions = {},
) {
  validateUploadFile({
    type: meta.mimeType,
    size: meta.size,
    name: meta.originalName,
  });

  const ik = getImageKitClient();
  const folder = options.folder ?? "/aivrasol/general";
  const fileName =
    options.fileName ??
    `${Date.now()}-${meta.originalName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

  const result = await ik.upload({
    file,
    fileName,
    folder,
    useUniqueFileName: true,
  });

  await connectDB();

  const thumbnailUrl = buildThumbnailUrl(result.url, { width: 400, height: 400 });

  const asset = await MediaAsset.create({
    originalName: meta.originalName,
    fileId: result.fileId,
    url: result.url,
    thumbnailUrl,
    mimeType: meta.mimeType,
    size: meta.size,
    width: result.width,
    height: result.height,
    folder,
    uploadedBy: options.uploadedBy,
    altText: options.altText,
  });

  return asset.toObject();
}

export async function uploadMultiple(
  files: Array<{
    buffer: Buffer;
    mimeType: string;
    size: number;
    originalName: string;
  }>,
  options: UploadImageOptions = {},
) {
  const uploaded: unknown[] = [];
  const failed: Array<{ name: string; error: string }> = [];

  for (const file of files) {
    try {
      const asset = await uploadImage(file.buffer, file, options);
      uploaded.push({
        id: String((asset as { _id: unknown })._id),
        url: (asset as { url: string }).url,
        fileId: (asset as { fileId: string }).fileId,
      });
    } catch (error) {
      failed.push({
        name: file.originalName,
        error:
          error instanceof Error ? error.message : "Upload failed",
      });
    }
  }

  return { uploaded, failed };
}

export async function deleteImage(fileId: string): Promise<void> {
  const ik = getImageKitClient();
  await ik.deleteFile(fileId);
}

export function buildThumbnailUrl(
  url: string,
  options: { width?: number; height?: number } = {},
): string {
  const endpoint = getImageKitUrlEndpoint();
  if (!endpoint || !url.includes("ik.imagekit.io")) {
    return url;
  }

  const width = options.width ?? 400;
  const height = options.height ?? 400;
  const path = url.replace(endpoint, "");
  return `${endpoint}/tr:w-${width},h-${height},c-at_max${path}`;
}

export async function deleteMediaAssetById(
  id: string,
): Promise<{ deleted: boolean }> {
  await connectDB();
  const asset = await MediaAsset.findById(id);
  if (!asset) {
    throw new ApiError("Media asset not found", 404);
  }

  try {
    await deleteImage(asset.fileId);
  } catch (error) {
    console.error("[imagekit] delete remote file failed");
    if (process.env.NODE_ENV !== "production") {
      throw error instanceof Error
        ? new ApiError(error.message, 502)
        : new ApiError("Failed to delete remote file", 502);
    }
  }

  await MediaAsset.findByIdAndDelete(id);
  return { deleted: true };
}

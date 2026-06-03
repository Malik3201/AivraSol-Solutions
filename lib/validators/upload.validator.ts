import { z } from "zod";

export const IMAGEKIT_FOLDERS = [
  "/aivrasol/services",
  "/aivrasol/projects",
  "/aivrasol/team",
  "/aivrasol/blog",
  "/aivrasol/brand",
  "/aivrasol/general",
] as const;

export type ImageKitFolder = (typeof IMAGEKIT_FOLDERS)[number];

export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5MB

export const uploadImageSchema = z.object({
  folder: z.enum(IMAGEKIT_FOLDERS).optional().default("/aivrasol/general"),
  altText: z.string().max(300).optional(),
});

export const uploadMultipleSchema = z.object({
  folder: z.enum(IMAGEKIT_FOLDERS).optional().default("/aivrasol/general"),
});

export const mediaUpdateSchema = z.object({
  altText: z.string().max(300).optional(),
  folder: z.enum(IMAGEKIT_FOLDERS).optional(),
});

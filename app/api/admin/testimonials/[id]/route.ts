import type { NextRequest } from "next/server";
import { successResponse } from "@/lib/api-response";
import { ApiError } from "@/lib/api-error";
import { asyncHandler } from "@/lib/utils/async-handler";
import { requireAdmin } from "@/lib/auth";
import {
  assertCanDeleteContent,
  assertCanManageContent,
} from "@/lib/utils/admin-access";
import {
  deleteDocument,
  getDocumentById,
  updateDocument,
  withId,
} from "@/lib/services/admin-crud";
import { Testimonial } from "@/lib/models/Testimonial";
import { testimonialUpdateSchema } from "@/lib/validators/content.validator";

type Ctx = { params: Promise<{ id: string }> };

export const GET = asyncHandler(async (request: NextRequest, ctx?: Ctx) => {
  const admin = await requireAdmin(request);
  assertCanManageContent(admin.role);
  const { id } = await ctx!.params;
  const doc = await getDocumentById(Testimonial, id, "Testimonial not found");
  return successResponse(withId(doc), "Testimonial fetched");
});

export const PATCH = asyncHandler(async (request: NextRequest, ctx?: Ctx) => {
  const admin = await requireAdmin(request);
  assertCanManageContent(admin.role);
  const { id } = await ctx!.params;

  const body = await request.json();
  const parsed = testimonialUpdateSchema.safeParse(body);
  if (!parsed.success) {
    throw new ApiError("Invalid testimonial data", 400, parsed.error.flatten());
  }

  const doc = await updateDocument(Testimonial, id, parsed.data, "Testimonial not found");
  return successResponse(withId(doc), "Testimonial updated");
});

export const DELETE = asyncHandler(async (request: NextRequest, ctx?: Ctx) => {
  const admin = await requireAdmin(request);
  assertCanDeleteContent(admin.role);
  const { id } = await ctx!.params;
  await deleteDocument(Testimonial, id, "Testimonial not found");
  return successResponse(null, "Testimonial deleted");
});

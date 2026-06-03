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
import { FAQ } from "@/lib/models/FAQ";
import { faqUpdateSchema } from "@/lib/validators/content.validator";

type Ctx = { params: Promise<{ id: string }> };

export const GET = asyncHandler(async (request: NextRequest, ctx?: Ctx) => {
  const admin = await requireAdmin(request);
  assertCanManageContent(admin.role);
  const { id } = await ctx!.params;
  const doc = await getDocumentById(FAQ, id, "FAQ not found");
  return successResponse(withId(doc), "FAQ fetched");
});

export const PATCH = asyncHandler(async (request: NextRequest, ctx?: Ctx) => {
  const admin = await requireAdmin(request);
  assertCanManageContent(admin.role);
  const { id } = await ctx!.params;

  const body = await request.json();
  const parsed = faqUpdateSchema.safeParse(body);
  if (!parsed.success) {
    throw new ApiError("Invalid FAQ data", 400, parsed.error.flatten());
  }

  const doc = await updateDocument(FAQ, id, parsed.data, "FAQ not found");
  return successResponse(withId(doc), "FAQ updated");
});

export const DELETE = asyncHandler(async (request: NextRequest, ctx?: Ctx) => {
  const admin = await requireAdmin(request);
  assertCanDeleteContent(admin.role);
  const { id } = await ctx!.params;
  await deleteDocument(FAQ, id, "FAQ not found");
  return successResponse(null, "FAQ deleted");
});

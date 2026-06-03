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
  resolveSlug,
  updateDocument,
  withId,
} from "@/lib/services/admin-crud";
import { BlogPost } from "@/lib/models/BlogPost";
import { blogPostUpdateSchema } from "@/lib/validators/content.validator";

type Ctx = { params: Promise<{ id: string }> };

export const GET = asyncHandler(async (request: NextRequest, ctx?: Ctx) => {
  const admin = await requireAdmin(request);
  assertCanManageContent(admin.role);
  const { id } = await ctx!.params;
  const doc = await getDocumentById(BlogPost, id, "Blog post not found");
  return successResponse(withId(doc), "Blog post fetched");
});

export const PATCH = asyncHandler(async (request: NextRequest, ctx?: Ctx) => {
  const admin = await requireAdmin(request);
  assertCanManageContent(admin.role);
  const { id } = await ctx!.params;

  const body = await request.json();
  const parsed = blogPostUpdateSchema.safeParse(body);
  if (!parsed.success) {
    throw new ApiError("Invalid blog post data", 400, parsed.error.flatten());
  }

  const data: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.title || parsed.data.slug) {
    data.slug = await resolveSlug(BlogPost, parsed.data, id);
  }

  const doc = await updateDocument(BlogPost, id, data, "Blog post not found");
  return successResponse(withId(doc), "Blog post updated");
});

export const DELETE = asyncHandler(async (request: NextRequest, ctx?: Ctx) => {
  const admin = await requireAdmin(request);
  assertCanDeleteContent(admin.role);
  const { id } = await ctx!.params;
  await deleteDocument(BlogPost, id, "Blog post not found");
  return successResponse(null, "Blog post deleted");
});

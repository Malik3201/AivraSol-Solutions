import type { NextRequest } from "next/server";
import { successResponse } from "@/lib/api-response";
import { ApiError } from "@/lib/api-error";
import { asyncHandler } from "@/lib/utils/async-handler";
import { requireAdmin } from "@/lib/auth";
import { assertCanManageContent } from "@/lib/utils/admin-access";
import {
  blogSort,
  createDocument,
  listDocuments,
  mapWithIds,
  resolveSlug,
  withId,
} from "@/lib/services/admin-crud";
import { BlogPost } from "@/lib/models/BlogPost";
import { blogPostCreateSchema } from "@/lib/validators/content.validator";
import { getQueryParams } from "@/lib/utils/parse-query";
import { parsePagination } from "@/lib/utils/pagination";

export const GET = asyncHandler(async (request: NextRequest) => {
  const admin = await requireAdmin(request);
  assertCanManageContent(admin.role);

  const q = getQueryParams(request);
  const { page, limit, skip } = parsePagination(
    { page: Number(q.page), limit: Number(q.limit) },
    { defaultLimit: 20, maxLimit: 100 },
  );

  const filter = q.status ? { status: q.status } : undefined;

  const { items, meta } = await listDocuments(BlogPost, {
    page,
    limit,
    skip,
    search: q.search,
    searchFields: ["title", "excerpt", "slug"],
    filter,
    sort: blogSort,
  });

  return successResponse(mapWithIds(items), "Blog posts fetched", meta);
});

export const POST = asyncHandler(async (request: NextRequest) => {
  const admin = await requireAdmin(request);
  assertCanManageContent(admin.role);

  const body = await request.json();
  const parsed = blogPostCreateSchema.safeParse(body);
  if (!parsed.success) {
    throw new ApiError("Invalid blog post data", 400, parsed.error.flatten());
  }

  const slug = await resolveSlug(BlogPost, parsed.data);
  const doc = await createDocument(BlogPost, {
    ...parsed.data,
    slug,
    status: parsed.data.status ?? "draft",
  });
  return successResponse(withId(doc), "Blog post created", undefined, 201);
});

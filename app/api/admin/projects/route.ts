import type { NextRequest } from "next/server";
import { successResponse } from "@/lib/api-response";
import { ApiError } from "@/lib/api-error";
import { asyncHandler } from "@/lib/utils/async-handler";
import { requireAdmin } from "@/lib/auth";
import { assertCanManageContent } from "@/lib/utils/admin-access";
import {
  contentSort,
  createDocument,
  listDocuments,
  mapWithIds,
  resolveSlug,
  withId,
} from "@/lib/services/admin-crud";
import { Project } from "@/lib/models/Project";
import { projectCreateSchema } from "@/lib/validators/content.validator";
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

  const { items, meta } = await listDocuments(Project, {
    page,
    limit,
    skip,
    search: q.search,
    searchFields: ["title", "clientName", "industry", "slug"],
    sort: contentSort,
  });

  return successResponse(mapWithIds(items), "Projects fetched", meta);
});

export const POST = asyncHandler(async (request: NextRequest) => {
  const admin = await requireAdmin(request);
  assertCanManageContent(admin.role);

  const body = await request.json();
  const parsed = projectCreateSchema.safeParse(body);
  if (!parsed.success) {
    throw new ApiError("Invalid project data", 400, parsed.error.flatten());
  }

  const slug = await resolveSlug(Project, parsed.data);
  const doc = await createDocument(Project, { ...parsed.data, slug });
  return successResponse(withId(doc), "Project created", undefined, 201);
});

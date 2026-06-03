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
  withId,
} from "@/lib/services/admin-crud";
import { FAQ } from "@/lib/models/FAQ";
import { faqCreateSchema } from "@/lib/validators/content.validator";
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

  const filter = q.category ? { category: q.category } : undefined;

  const { items, meta } = await listDocuments(FAQ, {
    page,
    limit,
    skip,
    search: q.search,
    searchFields: ["question", "answer", "category"],
    filter,
    sort: contentSort,
  });

  return successResponse(mapWithIds(items), "FAQs fetched", meta);
});

export const POST = asyncHandler(async (request: NextRequest) => {
  const admin = await requireAdmin(request);
  assertCanManageContent(admin.role);

  const body = await request.json();
  const parsed = faqCreateSchema.safeParse(body);
  if (!parsed.success) {
    throw new ApiError("Invalid FAQ data", 400, parsed.error.flatten());
  }

  const doc = await createDocument(FAQ, parsed.data);
  return successResponse(withId(doc), "FAQ created", undefined, 201);
});

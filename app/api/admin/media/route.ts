import type { NextRequest } from "next/server";
import { successResponse } from "@/lib/api-response";
import { asyncHandler } from "@/lib/utils/async-handler";
import { requireAdmin } from "@/lib/auth";
import { assertCanManageContent } from "@/lib/utils/admin-access";
import { listDocuments, mapWithIds } from "@/lib/services/admin-crud";
import { MediaAsset } from "@/lib/models/MediaAsset";
import { getQueryParams } from "@/lib/utils/parse-query";
import { parsePagination } from "@/lib/utils/pagination";

export const GET = asyncHandler(async (request: NextRequest) => {
  const admin = await requireAdmin(request);
  assertCanManageContent(admin.role);

  const q = getQueryParams(request);
  const { page, limit, skip } = parsePagination(
    { page: Number(q.page), limit: Number(q.limit) },
    { defaultLimit: 24, maxLimit: 100 },
  );

  const filter: Record<string, unknown> = {};
  if (q.folder) filter.folder = q.folder;
  if (q.mimeType) filter.mimeType = q.mimeType;

  const { items, meta } = await listDocuments(MediaAsset, {
    page,
    limit,
    skip,
    search: q.search,
    searchFields: ["originalName", "altText", "folder"],
    filter,
    sort: { createdAt: -1 },
  });

  return successResponse(mapWithIds(items), "Media library fetched", meta);
});

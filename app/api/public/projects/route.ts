import type { NextRequest } from "next/server";
import { successResponse } from "@/lib/api-response";
import { asyncHandler } from "@/lib/utils/async-handler";
import { listPublicProjects } from "@/lib/services/public-content";
import { getQueryBoolean, getQueryParams } from "@/lib/utils/parse-query";
import { parsePagination } from "@/lib/utils/pagination";

export const GET = asyncHandler(async (request: NextRequest) => {
  const q = getQueryParams(request);
  const { page, limit } = parsePagination(
    { page: Number(q.page), limit: Number(q.limit) },
    { defaultLimit: 12, maxLimit: 50 },
  );

  const { items, meta } = await listPublicProjects({
    page,
    limit,
    search: q.search,
    technology: q.technology,
    service: q.service,
    featured: getQueryBoolean(q.featured),
  });

  return successResponse(items, "Projects fetched", meta);
});

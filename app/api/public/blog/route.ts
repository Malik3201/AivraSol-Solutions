import type { NextRequest } from "next/server";
import { successResponse } from "@/lib/api-response";
import { asyncHandler } from "@/lib/utils/async-handler";
import { listPublicBlog } from "@/lib/services/public-content";
import { getQueryBoolean, getQueryParams } from "@/lib/utils/parse-query";
import { parsePagination } from "@/lib/utils/pagination";

export const GET = asyncHandler(async (request: NextRequest) => {
  const q = getQueryParams(request);
  const { page, limit } = parsePagination(
    { page: Number(q.page), limit: Number(q.limit) },
    { defaultLimit: 10, maxLimit: 50 },
  );

  const { items, meta } = await listPublicBlog({
    page,
    limit,
    search: q.search,
    tag: q.tag,
    featured: getQueryBoolean(q.featured),
  });

  return successResponse(items, "Blog posts fetched", meta);
});

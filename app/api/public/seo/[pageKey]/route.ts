import type { NextRequest } from "next/server";
import { successResponse } from "@/lib/api-response";
import { ApiError } from "@/lib/api-error";
import { asyncHandler } from "@/lib/utils/async-handler";
import { getPageSeo } from "@/lib/services/public-content";
import { SEO_PAGE_KEYS } from "@/lib/services/seo";

type Ctx = { params: Promise<{ pageKey: string }> };

export const GET = asyncHandler(async (_req: NextRequest, ctx?: Ctx) => {
  const { pageKey } = await ctx!.params;

  if (!SEO_PAGE_KEYS.includes(pageKey as (typeof SEO_PAGE_KEYS)[number])) {
    throw new ApiError("Invalid SEO page key", 400);
  }

  const seo = await getPageSeo(pageKey as (typeof SEO_PAGE_KEYS)[number]);
  return successResponse(seo, "SEO data fetched");
});

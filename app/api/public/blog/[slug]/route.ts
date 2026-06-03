import type { NextRequest } from "next/server";
import { successResponse } from "@/lib/api-response";
import { asyncHandler } from "@/lib/utils/async-handler";
import { getPublicBlogBySlug } from "@/lib/services/public-content";

type Ctx = { params: Promise<{ slug: string }> };

export const GET = asyncHandler(async (_req: NextRequest, ctx?: Ctx) => {
  const { slug } = await ctx!.params;
  const data = await getPublicBlogBySlug(slug);
  return successResponse(data, "Blog post fetched");
});

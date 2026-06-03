import type { NextRequest } from "next/server";
import { successResponse } from "@/lib/api-response";
import { asyncHandler } from "@/lib/utils/async-handler";
import { listPublicFaqs } from "@/lib/services/public-content";
import { getQueryParams } from "@/lib/utils/parse-query";

export const GET = asyncHandler(async (request: NextRequest) => {
  const q = getQueryParams(request);
  const items = await listPublicFaqs(q.category);
  return successResponse(items, "FAQs fetched");
});

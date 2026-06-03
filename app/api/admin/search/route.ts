import type { NextRequest } from "next/server";
import { successResponse } from "@/lib/api-response";
import { ApiError } from "@/lib/api-error";
import { asyncHandler } from "@/lib/utils/async-handler";
import { requireAdmin } from "@/lib/auth";
import { assertCanManageContent } from "@/lib/utils/admin-access";
import { adminSearch } from "@/lib/services/public-content";

export const GET = asyncHandler(async (request: NextRequest) => {
  const admin = await requireAdmin(request);
  assertCanManageContent(admin.role);

  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q) {
    throw new ApiError("Search query is required", 400);
  }

  const results = await adminSearch(q);
  return successResponse(results, "Search results fetched");
});

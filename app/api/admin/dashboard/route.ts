import type { NextRequest } from "next/server";
import { successResponse } from "@/lib/api-response";
import { asyncHandler } from "@/lib/utils/async-handler";
import { requireAdmin } from "@/lib/auth";
import { assertCanManageContent } from "@/lib/utils/admin-access";
import { getAdminDashboardStats } from "@/lib/services/public-content";

export const GET = asyncHandler(async (request: NextRequest) => {
  const admin = await requireAdmin(request);
  assertCanManageContent(admin.role);
  const stats = await getAdminDashboardStats();
  return successResponse(stats, "Dashboard stats fetched");
});

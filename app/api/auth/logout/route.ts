import { successResponse } from "@/lib/api-response";
import { asyncHandler } from "@/lib/utils/async-handler";
import { clearAdminSessionCookie } from "@/lib/auth";

export const POST = asyncHandler(async () => {
  await clearAdminSessionCookie();
  return successResponse(null, "Logged out successfully");
});

import { successResponse } from "@/lib/api-response";
import { asyncHandler } from "@/lib/utils/async-handler";
import { listPublicTeam } from "@/lib/services/public-content";

export const GET = asyncHandler(async () => {
  const items = await listPublicTeam();
  return successResponse(items, "Team members fetched");
});

import { successResponse } from "@/lib/api-response";
import { asyncHandler } from "@/lib/utils/async-handler";
import { getPublicSettingsMap } from "@/lib/services/public-content";

export const GET = asyncHandler(async () => {
  const settings = await getPublicSettingsMap();
  return successResponse(settings, "Public settings fetched");
});

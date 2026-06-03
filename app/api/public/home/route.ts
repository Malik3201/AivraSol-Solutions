import { successResponse } from "@/lib/api-response";
import { asyncHandler } from "@/lib/utils/async-handler";
import { getHomepageData } from "@/lib/services/public-content";

export const GET = asyncHandler(async () => {
  const data = await getHomepageData();
  return successResponse(data, "Homepage data fetched");
});

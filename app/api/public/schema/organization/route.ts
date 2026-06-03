import { successResponse } from "@/lib/api-response";
import { asyncHandler } from "@/lib/utils/async-handler";
import { getPublicSettingsMap } from "@/lib/services/public-content";
import { buildOrganizationSchema } from "@/lib/services/seo";

export const GET = asyncHandler(async () => {
  const settings = await getPublicSettingsMap();
  const schema = buildOrganizationSchema(settings);

  return successResponse(
    { schema, "@context": schema["@context"] },
    "Organization schema fetched",
  );
});

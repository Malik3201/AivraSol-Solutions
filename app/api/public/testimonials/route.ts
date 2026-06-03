import { successResponse } from "@/lib/api-response";
import { asyncHandler } from "@/lib/utils/async-handler";
import { listPublicTestimonials } from "@/lib/services/public-content";

export const GET = asyncHandler(async () => {
  const items = await listPublicTestimonials();
  return successResponse(items, "Testimonials fetched");
});

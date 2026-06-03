import type { NextRequest } from "next/server";
import { asyncHandler } from "@/lib/utils/async-handler";
import { handleContactAssist } from "@/lib/utils/contact-assist-handler";

export const POST = asyncHandler(async (request: NextRequest) => {
  return handleContactAssist(request);
});

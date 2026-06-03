import { successResponse } from "@/lib/api-response";
import {
  isDbConfigured,
  isImageKitConfigured,
  isLongCatConfigured,
} from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET() {
  return successResponse(
    {
      appName: "AIVRASOL",
      status: "ok",
      timestamp: new Date().toISOString(),
      dbConfigured: isDbConfigured(),
      imagekitConfigured: isImageKitConfigured(),
      longcatConfigured: isLongCatConfigured(),
      environment: process.env.NODE_ENV ?? "development",
    },
    "AIVRASOL API is healthy",
  );
}

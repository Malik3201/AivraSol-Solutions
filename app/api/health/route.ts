import { successResponse } from "@/lib/api-response";
import { connectDB } from "@/lib/db";
import { Project } from "@/lib/models/Project";
import { Service } from "@/lib/models/Service";
import {
  isDbConfigured,
  isImageKitConfigured,
  isGroqConfigured,
} from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET() {
  let dbConnected = false;
  let activeServices = 0;
  let activeProjects = 0;
  let dbError: string | undefined;

  if (isDbConfigured()) {
    try {
      await connectDB();
      dbConnected = true;
      [activeServices, activeProjects] = await Promise.all([
        Service.countDocuments({ isActive: true }),
        Project.countDocuments({ isActive: true }),
      ]);
    } catch (error) {
      dbError =
        error instanceof Error ? error.message : "Database connection failed";
    }
  }

  return successResponse(
    {
      appName: "AIVRASOL",
      status: dbConnected ? "ok" : isDbConfigured() ? "degraded" : "ok",
      timestamp: new Date().toISOString(),
      dbConfigured: isDbConfigured(),
      dbConnected,
      activeServices,
      activeProjects,
      dbError,
      imagekitConfigured: isImageKitConfigured(),
      groqConfigured: isGroqConfigured(),
      aiConfigured: isGroqConfigured(),
      environment: process.env.NODE_ENV ?? "development",
    },
    "AIVRASOL API is healthy",
  );
}

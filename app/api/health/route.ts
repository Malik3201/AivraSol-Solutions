import { successResponse } from "@/lib/api-response";
import { connectDB } from "@/lib/db";
import { getDatabaseDiagnostics } from "@/lib/db-info";
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
  let totalServices = 0;
  let totalProjects = 0;
  let dbError: string | undefined;
  let database: Awaited<ReturnType<typeof getDatabaseDiagnostics>> | undefined;

  if (isDbConfigured()) {
    try {
      await connectDB();
      database = await getDatabaseDiagnostics();
      dbConnected = true;
      [totalServices, activeServices, totalProjects, activeProjects] =
        await Promise.all([
          Service.countDocuments(),
          Service.countDocuments({ isActive: true }),
          Project.countDocuments(),
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
      database,
      totalServices,
      activeServices,
      totalProjects,
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

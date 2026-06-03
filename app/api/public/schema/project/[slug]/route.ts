import type { NextRequest } from "next/server";
import { successResponse } from "@/lib/api-response";
import { ApiError } from "@/lib/api-error";
import { asyncHandler } from "@/lib/utils/async-handler";
import type { RouteContext } from "@/lib/utils/async-handler";
import { connectDB } from "@/lib/db";
import { Project } from "@/lib/models/Project";
import {
  buildBreadcrumbSchema,
  buildProjectSchema,
} from "@/lib/services/seo";

export const GET = asyncHandler(async (_req: NextRequest, context?: RouteContext) => {
  const { slug } = await context!.params;
  await connectDB();

  const project = await Project.findOne({ slug, isActive: true }).lean();
  if (!project) {
    throw new ApiError("Project not found", 404);
  }

  const projectSchema = buildProjectSchema({
    title: project.title,
    slug: project.slug,
    shortDescription: project.shortDescription ?? undefined,
    description: project.description ?? undefined,
    clientName: project.clientName ?? undefined,
    industry: project.industry ?? undefined,
    coverImage: project.coverImage ?? undefined,
    liveUrl: project.liveUrl ?? undefined,
  });

  const breadcrumb = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: project.title, path: `/projects/${project.slug}` },
  ]);

  return successResponse(
    { project: projectSchema, breadcrumb },
    "Project schema fetched",
  );
});

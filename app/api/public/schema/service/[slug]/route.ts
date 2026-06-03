import type { NextRequest } from "next/server";
import { successResponse } from "@/lib/api-response";
import { ApiError } from "@/lib/api-error";
import { asyncHandler } from "@/lib/utils/async-handler";
import type { RouteContext } from "@/lib/utils/async-handler";
import { connectDB } from "@/lib/db";
import { Service } from "@/lib/models/Service";
import {
  buildBreadcrumbSchema,
  buildServiceSchema,
} from "@/lib/services/seo";

export const GET = asyncHandler(async (_req: NextRequest, context?: RouteContext) => {
  const { slug } = await context!.params;
  await connectDB();

  const service = await Service.findOne({ slug, isActive: true }).lean();
  if (!service) {
    throw new ApiError("Service not found", 404);
  }

  const serviceSchema = buildServiceSchema({
    title: service.title,
    slug: service.slug,
    shortDescription: service.shortDescription ?? undefined,
    description: service.description ?? undefined,
    coverImage: service.coverImage ?? undefined,
  });

  const breadcrumb = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: service.title, path: `/services/${service.slug}` },
  ]);

  return successResponse(
    { service: serviceSchema, breadcrumb },
    "Service schema fetched",
  );
});

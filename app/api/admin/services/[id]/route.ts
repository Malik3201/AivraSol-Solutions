import type { NextRequest } from "next/server";
import { successResponse } from "@/lib/api-response";
import { ApiError } from "@/lib/api-error";
import { asyncHandler } from "@/lib/utils/async-handler";
import { requireAdmin } from "@/lib/auth";
import {
  assertCanDeleteContent,
  assertCanManageContent,
} from "@/lib/utils/admin-access";
import {
  deleteDocument,
  getDocumentById,
  resolveSlug,
  updateDocument,
  withId,
} from "@/lib/services/admin-crud";
import { withServiceLegacyName } from "@/lib/db/legacy-indexes";
import { Service } from "@/lib/models/Service";
import { serviceUpdateSchema } from "@/lib/validators/content.validator";
import type { RouteContext } from "@/lib/utils/async-handler";

export const GET = asyncHandler(async (request: NextRequest, context?: RouteContext) => {
  const admin = await requireAdmin(request);
  assertCanManageContent(admin.role);
  const { id } = await context!.params;
  const doc = await getDocumentById(Service, id, "Service not found");
  return successResponse(withId(doc), "Service fetched");
});

export const PATCH = asyncHandler(async (request: NextRequest, context?: RouteContext) => {
  const admin = await requireAdmin(request);
  assertCanManageContent(admin.role);
  const { id } = await context!.params;

  const body = await request.json();
  const parsed = serviceUpdateSchema.safeParse(body);
  if (!parsed.success) {
    throw new ApiError("Invalid service data", 400, parsed.error.flatten());
  }

  const existing = await getDocumentById(Service, id, "Service not found");

  const data: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.title || parsed.data.slug) {
    data.slug = await resolveSlug(Service, parsed.data, id);
  }

  const title =
    (typeof parsed.data.title === "string" && parsed.data.title.trim()) ||
    (typeof existing.title === "string" && existing.title.trim()) ||
    "";
  if (title) {
    data.name = title;
  }

  const doc = await updateDocument(
    Service,
    id,
    withServiceLegacyName(data),
    "Service not found",
  );
  return successResponse(withId(doc), "Service updated");
});

export const DELETE = asyncHandler(async (request: NextRequest, context?: RouteContext) => {
  const admin = await requireAdmin(request);
  assertCanDeleteContent(admin.role);
  const { id } = await context!.params;
  await deleteDocument(Service, id, "Service not found");
  return successResponse(null, "Service deleted");
});

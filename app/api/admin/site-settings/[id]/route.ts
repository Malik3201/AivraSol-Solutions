import type { NextRequest } from "next/server";
import { successResponse } from "@/lib/api-response";
import { ApiError } from "@/lib/api-error";
import { asyncHandler } from "@/lib/utils/async-handler";
import { requireAdmin } from "@/lib/auth";
import { assertCanManageSettings } from "@/lib/utils/admin-access";
import {
  deleteDocument,
  getDocumentById,
  updateDocument,
  withId,
} from "@/lib/services/admin-crud";
import { SiteSetting } from "@/lib/models/SiteSetting";
import { siteSettingUpdateSchema } from "@/lib/validators/content.validator";

type Ctx = { params: Promise<{ id: string }> };

export const PATCH = asyncHandler(async (request: NextRequest, ctx?: Ctx) => {
  const admin = await requireAdmin(request);
  assertCanManageSettings(admin.role);
  const { id } = await ctx!.params;

  const body = await request.json();
  const parsed = siteSettingUpdateSchema.safeParse(body);
  if (!parsed.success) {
    throw new ApiError("Invalid site setting data", 400, parsed.error.flatten());
  }

  const doc = await updateDocument(SiteSetting, id, parsed.data, "Site setting not found");
  return successResponse(withId(doc), "Site setting updated");
});

export const DELETE = asyncHandler(async (request: NextRequest, ctx?: Ctx) => {
  const admin = await requireAdmin(request);
  assertCanManageSettings(admin.role);
  const { id } = await ctx!.params;
  await deleteDocument(SiteSetting, id, "Site setting not found");
  return successResponse(null, "Site setting deleted");
});

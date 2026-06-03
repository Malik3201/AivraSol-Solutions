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
import { TeamMember } from "@/lib/models/TeamMember";
import { teamMemberUpdateSchema } from "@/lib/validators/content.validator";

type Ctx = { params: Promise<{ id: string }> };

export const GET = asyncHandler(async (request: NextRequest, ctx?: Ctx) => {
  const admin = await requireAdmin(request);
  assertCanManageContent(admin.role);
  const { id } = await ctx!.params;
  const doc = await getDocumentById(TeamMember, id, "Team member not found");
  return successResponse(withId(doc), "Team member fetched");
});

export const PATCH = asyncHandler(async (request: NextRequest, ctx?: Ctx) => {
  const admin = await requireAdmin(request);
  assertCanManageContent(admin.role);
  const { id } = await ctx!.params;

  const body = await request.json();
  const parsed = teamMemberUpdateSchema.safeParse(body);
  if (!parsed.success) {
    throw new ApiError("Invalid team member data", 400, parsed.error.flatten());
  }

  const data: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.name || parsed.data.slug) {
    data.slug = await resolveSlug(TeamMember, parsed.data, id);
  }

  const doc = await updateDocument(TeamMember, id, data, "Team member not found");
  return successResponse(withId(doc), "Team member updated");
});

export const DELETE = asyncHandler(async (request: NextRequest, ctx?: Ctx) => {
  const admin = await requireAdmin(request);
  assertCanDeleteContent(admin.role);
  const { id } = await ctx!.params;
  await deleteDocument(TeamMember, id, "Team member not found");
  return successResponse(null, "Team member deleted");
});

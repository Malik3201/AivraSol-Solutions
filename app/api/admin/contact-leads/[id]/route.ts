import type { NextRequest } from "next/server";
import { successResponse } from "@/lib/api-response";
import { ApiError } from "@/lib/api-error";
import { asyncHandler } from "@/lib/utils/async-handler";
import { requireAdmin } from "@/lib/auth";
import {
  assertCanDeleteLeads,
  assertCanViewLeads,
} from "@/lib/utils/admin-access";
import {
  deleteDocument,
  getDocumentById,
  updateDocument,
  withId,
} from "@/lib/services/admin-crud";
import { ContactLead } from "@/lib/models/ContactLead";
import { contactLeadUpdateSchema } from "@/lib/validators/contact.validator";

type Ctx = { params: Promise<{ id: string }> };

export const GET = asyncHandler(async (request: NextRequest, ctx?: Ctx) => {
  const admin = await requireAdmin(request);
  assertCanViewLeads(admin.role);
  const { id } = await ctx!.params;
  const doc = await getDocumentById(ContactLead, id, "Contact lead not found");
  return successResponse(withId(doc), "Contact lead fetched");
});

export const PATCH = asyncHandler(async (request: NextRequest, ctx?: Ctx) => {
  const admin = await requireAdmin(request);
  assertCanViewLeads(admin.role);
  const { id } = await ctx!.params;

  const body = await request.json();
  const parsed = contactLeadUpdateSchema.safeParse(body);
  if (!parsed.success) {
    throw new ApiError("Invalid lead update", 400, parsed.error.flatten());
  }

  const doc = await updateDocument(ContactLead, id, parsed.data, "Contact lead not found");
  return successResponse(withId(doc), "Contact lead updated");
});

export const DELETE = asyncHandler(async (request: NextRequest, ctx?: Ctx) => {
  const admin = await requireAdmin(request);
  assertCanDeleteLeads(admin.role);
  const { id } = await ctx!.params;
  await deleteDocument(ContactLead, id, "Contact lead not found");
  return successResponse(null, "Contact lead deleted");
});

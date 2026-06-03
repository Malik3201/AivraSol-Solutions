import type { NextRequest } from "next/server";
import { successResponse } from "@/lib/api-response";
import { asyncHandler } from "@/lib/utils/async-handler";
import { requireAdmin } from "@/lib/auth";
import { assertCanViewLeads } from "@/lib/utils/admin-access";
import { listDocuments, mapWithIds } from "@/lib/services/admin-crud";
import { ContactLead } from "@/lib/models/ContactLead";
import { getQueryParams } from "@/lib/utils/parse-query";
import { parsePagination } from "@/lib/utils/pagination";

export const GET = asyncHandler(async (request: NextRequest) => {
  const admin = await requireAdmin(request);
  assertCanViewLeads(admin.role);

  const q = getQueryParams(request);
  const { page, limit, skip } = parsePagination(
    { page: Number(q.page), limit: Number(q.limit) },
    { defaultLimit: 20, maxLimit: 100 },
  );

  const filter: Record<string, unknown> = {};
  if (q.status) filter.status = q.status;
  if (q.serviceInterest) filter.serviceInterest = q.serviceInterest;

  const { items, meta } = await listDocuments(ContactLead, {
    page,
    limit,
    skip,
    search: q.search,
    searchFields: ["name", "email", "company", "message"],
    filter,
    sort: { createdAt: -1 },
  });

  return successResponse(mapWithIds(items), "Contact leads fetched", meta);
});

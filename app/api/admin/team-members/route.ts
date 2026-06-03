import type { NextRequest } from "next/server";
import { successResponse } from "@/lib/api-response";
import { ApiError } from "@/lib/api-error";
import { asyncHandler } from "@/lib/utils/async-handler";
import { requireAdmin } from "@/lib/auth";
import { assertCanManageContent } from "@/lib/utils/admin-access";
import {
  contentSort,
  createDocument,
  listDocuments,
  mapWithIds,
  resolveSlug,
  withId,
} from "@/lib/services/admin-crud";
import { TeamMember } from "@/lib/models/TeamMember";
import { teamMemberCreateSchema } from "@/lib/validators/content.validator";
import { getQueryParams } from "@/lib/utils/parse-query";
import { parsePagination } from "@/lib/utils/pagination";

export const GET = asyncHandler(async (request: NextRequest) => {
  const admin = await requireAdmin(request);
  assertCanManageContent(admin.role);

  const q = getQueryParams(request);
  const { page, limit, skip } = parsePagination(
    { page: Number(q.page), limit: Number(q.limit) },
    { defaultLimit: 20, maxLimit: 100 },
  );

  const { items, meta } = await listDocuments(TeamMember, {
    page,
    limit,
    skip,
    search: q.search,
    searchFields: ["name", "role", "slug"],
    sort: contentSort,
  });

  return successResponse(mapWithIds(items), "Team members fetched", meta);
});

export const POST = asyncHandler(async (request: NextRequest) => {
  const admin = await requireAdmin(request);
  assertCanManageContent(admin.role);

  const body = await request.json();
  const parsed = teamMemberCreateSchema.safeParse(body);
  if (!parsed.success) {
    throw new ApiError("Invalid team member data", 400, parsed.error.flatten());
  }

  const slug = await resolveSlug(TeamMember, parsed.data);
  const doc = await createDocument(TeamMember, { ...parsed.data, slug });
  return successResponse(withId(doc), "Team member created", undefined, 201);
});

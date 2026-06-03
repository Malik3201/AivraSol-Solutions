import type { NextRequest } from "next/server";
import { successResponse } from "@/lib/api-response";
import { ApiError } from "@/lib/api-error";
import { asyncHandler } from "@/lib/utils/async-handler";
import { requireAdmin } from "@/lib/auth";
import { assertCanManageSettings } from "@/lib/utils/admin-access";
import {
  createDocument,
  listDocuments,
  mapWithIds,
  withId,
} from "@/lib/services/admin-crud";
import { SiteSetting } from "@/lib/models/SiteSetting";
import { siteSettingCreateSchema } from "@/lib/validators/content.validator";
import { getQueryParams } from "@/lib/utils/parse-query";
import { parsePagination } from "@/lib/utils/pagination";

export const GET = asyncHandler(async (request: NextRequest) => {
  const admin = await requireAdmin(request);
  assertCanManageSettings(admin.role);

  const q = getQueryParams(request);
  const { page, limit, skip } = parsePagination(
    { page: Number(q.page), limit: Number(q.limit) },
    { defaultLimit: 50, maxLimit: 200 },
  );

  const filter = q.group ? { group: q.group } : undefined;

  const { items, meta } = await listDocuments(SiteSetting, {
    page,
    limit,
    skip,
    search: q.search,
    searchFields: ["key", "label", "group"],
    filter,
    sort: { group: 1, key: 1 },
  });

  return successResponse(mapWithIds(items), "Site settings fetched", meta);
});

export const POST = asyncHandler(async (request: NextRequest) => {
  const admin = await requireAdmin(request);
  assertCanManageSettings(admin.role);

  const body = await request.json();
  const parsed = siteSettingCreateSchema.safeParse(body);
  if (!parsed.success) {
    throw new ApiError("Invalid site setting data", 400, parsed.error.flatten());
  }

  const doc = await createDocument(SiteSetting, parsed.data);
  return successResponse(withId(doc), "Site setting created", undefined, 201);
});

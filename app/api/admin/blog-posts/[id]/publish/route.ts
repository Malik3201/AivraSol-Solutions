import type { NextRequest } from "next/server";
import { successResponse } from "@/lib/api-response";
import { asyncHandler } from "@/lib/utils/async-handler";
import { requireAdmin } from "@/lib/auth";
import { assertCanManageContent } from "@/lib/utils/admin-access";
import { updateDocument, withId } from "@/lib/services/admin-crud";
import { BlogPost } from "@/lib/models/BlogPost";

type Ctx = { params: Promise<{ id: string }> };

export const PATCH = asyncHandler(async (request: NextRequest, ctx?: Ctx) => {
  const admin = await requireAdmin(request);
  assertCanManageContent(admin.role);
  const { id } = await ctx!.params;

  const doc = await updateDocument(
    BlogPost,
    id,
    { status: "published", publishedAt: new Date() },
    "Blog post not found",
  );

  return successResponse(withId(doc), "Blog post published");
});

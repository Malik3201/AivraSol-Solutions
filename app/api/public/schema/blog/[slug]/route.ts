import type { NextRequest } from "next/server";
import { successResponse } from "@/lib/api-response";
import { ApiError } from "@/lib/api-error";
import { asyncHandler } from "@/lib/utils/async-handler";
import type { RouteContext } from "@/lib/utils/async-handler";
import { connectDB } from "@/lib/db";
import { BlogPost } from "@/lib/models/BlogPost";
import {
  buildBreadcrumbSchema,
  buildBlogSchema,
} from "@/lib/services/seo";

export const GET = asyncHandler(async (_req: NextRequest, context?: RouteContext) => {
  const { slug } = await context!.params;
  await connectDB();

  const post = await BlogPost.findOne({ slug, status: "published" }).lean();
  if (!post) {
    throw new ApiError("Blog post not found", 404);
  }

  const blogSchema = buildBlogSchema({
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? undefined,
    content: post.content ?? undefined,
    coverImage: post.coverImage ?? undefined,
    author: post.author ?? undefined,
    publishedAt: post.publishedAt ?? undefined,
    tags: post.tags,
  });

  const breadcrumb = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ]);

  return successResponse(
    { blog: blogSchema, breadcrumb },
    "Blog schema fetched",
  );
});

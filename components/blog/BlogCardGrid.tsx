"use client";

import { BlogCard } from "@/components/blog/BlogCard";
import { ResponsiveCardGrid } from "@/components/site/ResponsiveCardGrid";
import type { PublicBlogPost } from "@/lib/api/types";

export function BlogCardGrid({
  posts,
  ariaLabel = "Blog articles",
}: {
  posts: PublicBlogPost[];
  ariaLabel?: string;
}) {
  return (
    <ResponsiveCardGrid
      items={posts}
      keyExtractor={(p) => p.id}
      ariaLabel={ariaLabel}
      gridClassName="grid-cols-1 sm:grid-cols-2"
      slideClassName="w-[min(88vw,420px)] sm:w-[min(82vw,440px)]"
      renderItem={(post) => <BlogCard post={post} />}
    />
  );
}

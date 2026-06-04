import { BlogCard } from "@/components/blog/BlogCard";
import type { PublicBlogPost } from "@/lib/api/types";
import { PAGE_GRID } from "@/lib/page-layout";

export function RelatedPosts({ posts }: { posts: PublicBlogPost[] }) {
  if (!posts.length) return null;

  return (
    <div className={PAGE_GRID}>
      {posts.map((p) => (
        <div key={p.id} className="col-span-12 sm:col-span-6">
          <BlogCard post={p} />
        </div>
      ))}
    </div>
  );
}

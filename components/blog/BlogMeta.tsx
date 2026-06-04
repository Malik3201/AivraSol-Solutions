import type { PublicBlogPost } from "@/lib/api/types";

function formatDate(iso?: string) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return null;
  }
}

export function BlogMeta({ post }: { post: PublicBlogPost }) {
  const date = formatDate(post.publishedAt);

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
      {post.author ? <span>{post.author}</span> : null}
      {date ? <span>{date}</span> : null}
      {post.tags?.map((t) => (
        <span
          key={t}
          className="rounded-full border border-white/10 px-2.5 py-0.5 text-xs"
        >
          {t}
        </span>
      ))}
    </div>
  );
}

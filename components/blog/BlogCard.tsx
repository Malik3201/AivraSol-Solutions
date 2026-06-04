import { RemoteImage } from "@/components/site/RemoteImage";
import Link from "next/link";
import type { PublicBlogPost } from "@/lib/api/types";
import { cn } from "@/lib/utils";

function formatDate(iso?: string) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return null;
  }
}

export function BlogCard({
  post,
  featured = false,
}: {
  post: PublicBlogPost;
  featured?: boolean;
}) {
  const date = formatDate(post.publishedAt);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-[rgba(10,16,14,0.6)] transition-colors hover:border-primary/25",
      )}
    >
      <div className="relative aspect-[16/9] overflow-hidden border-b border-white/[0.06] bg-[#0a100e]">
        {post.coverImage ? (
          <RemoteImage
            src={post.coverImage}
            alt=""
            fill
            className="object-cover transition-transform group-hover:scale-[1.02]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-[#0a1210] to-background" />
        )}
      </div>
      <div className={cn("flex flex-1 flex-col p-6", featured && "md:p-8")}>
        {date ? <p className="text-xs text-muted-foreground">{date}</p> : null}
        <h3 className={cn("mt-2 font-semibold", featured ? "text-2xl" : "text-lg")}>
          {post.title}
        </h3>
        {post.excerpt ? (
          <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
            {post.excerpt}
          </p>
        ) : null}
        {post.tags?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}
        <span className="mt-5 text-sm font-medium text-primary">Read article →</span>
      </div>
    </Link>
  );
}

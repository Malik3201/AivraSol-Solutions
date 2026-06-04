import { BlogCard } from "@/components/blog/BlogCard";
import { BlogCardGrid } from "@/components/blog/BlogCardGrid";
import { PageHero } from "@/components/site/PageHero";
import { PageSection } from "@/components/site/PageSection";
import { EmptyState } from "@/components/site/EmptyState";
import { fetchBlogList } from "@/lib/public-data";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Blog",
  description:
    "Insights from AIVRASOL on digital systems, AI workflows, UX, automation, and scalable product delivery.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await fetchBlogList();
  const featured = posts.find((p) => p.isFeatured) ?? posts[0];
  const rest = posts.filter((p) => p.id !== featured?.id);

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Ideas on digital systems, AI, and growth."
        description="Practical thinking from AIVRASOL on websites, automation, user experience, AI workflows, and scalable product systems."
      />

      {!posts.length ? (
        <PageSection background="minimal">
          <EmptyState
            title="Articles coming soon"
            description="We are preparing editorial content on strategy, engineering, and intelligent product delivery."
            actionLabel="Contact us"
            actionHref="/contact"
          />
        </PageSection>
      ) : (
        <>
          {featured ? (
            <PageSection background="editorial" title="Featured">
              <div className="max-w-4xl">
                <BlogCard post={featured} featured />
              </div>
            </PageSection>
          ) : null}
          <PageSection background="minimal" title="Recent articles">
            <BlogCardGrid posts={rest} />
          </PageSection>
        </>
      )}
    </>
  );
}

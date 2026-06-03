import { PageHero } from "@/components/site/PageHero";
import { ContentPlaceholder } from "@/components/site/ContentPlaceholder";
import { CTASection } from "@/components/site/CTASection";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Blog",
  description:
    "Insights on AI, product engineering, and digital growth from the AIVRASOL team.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Ideas at the edge of AI and craft."
        description="Editorial articles on product strategy, intelligent systems, and the future of premium digital delivery."
      />
      <ContentPlaceholder
        eyebrow="Journal"
        title="Thought leadership, not filler."
        description="Paginated blog with tags, featured posts, and SEO-rich article templates."
        items={["AI Strategy", "Product", "Automation"]}
      />
      <CTASection primaryLabel="Subscribe via Contact" primaryHref="/contact" />
    </>
  );
}

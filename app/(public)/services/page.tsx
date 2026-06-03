import { PageHero } from "@/components/site/PageHero";
import { ContentPlaceholder } from "@/components/site/ContentPlaceholder";
import { CTASection } from "@/components/site/CTASection";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Services",
  description:
    "Explore AIVRASOL services — AI products, intelligent automation, and premium digital platforms.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="End-to-end AI and digital capability."
        description="From intelligent products to automation systems and growth-ready platforms — designed with strategic clarity and engineering rigor."
      />
      <ContentPlaceholder
        eyebrow="Catalog"
        title="Service lines tuned for outcomes."
        description="Filterable service grid with rich detail pages, SEO metadata, and related project proof."
        items={["AI Engineering", "Product Design", "Automation", "Advisory"]}
      />
      <CTASection primaryLabel="Discuss Your Initiative" />
    </>
  );
}

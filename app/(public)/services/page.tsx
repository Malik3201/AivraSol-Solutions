import { ServicesCardGrid } from "@/components/services/ServicesCardGrid";
import { PageCTA } from "@/components/site/PageCTA";
import { PageHero } from "@/components/site/PageHero";
import { PageSection } from "@/components/site/PageSection";
import { ServiceShapeGrid } from "@/components/services/ServiceShapeGrid";
import { fetchServicesList } from "@/lib/public-data";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Services",
  description:
    "Explore AIVRASOL capabilities — premium web platforms, automation systems, AI assistants, and strategic digital delivery.",
  path: "/services",
});

const SHAPE_ITEMS = [
  "Scope and success metrics",
  "Strategy and information architecture",
  "UI/UX and interface systems",
  "Backend, APIs, and integrations",
  "AI automation and assistants",
  "SEO, performance, and launch",
];

export default async function ServicesPage() {
  const services = await fetchServicesList();
  const featuredId =
    services.find((s) => s.isFeatured)?.id ?? services[0]?.id;

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Capabilities built for modern digital growth."
        description="From premium web platforms to AI automation, AIVRASOL designs systems that help businesses operate, convert, and scale with confidence."
      />

      <PageSection background="bento" title="Service lines" description="Explore how we help teams build and scale.">
        <ServicesCardGrid services={services} featuredId={featuredId} />
      </PageSection>

      <PageSection
        background="editorial"
        title="How we shape services"
        description="Every capability is delivered as a connected system — not isolated deliverables."
      >
        <ServiceShapeGrid items={SHAPE_ITEMS} />
      </PageSection>

      <PageCTA
        title="Not sure what you need yet?"
        description="Share your goals — we will recommend the right mix of platform, automation, and AI work."
        primaryLabel="Talk to AIVRASOL"
        primaryHref="/contact"
      />
    </>
  );
}

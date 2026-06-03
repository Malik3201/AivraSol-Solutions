import { PageHero } from "@/components/site/PageHero";
import { ContentPlaceholder } from "@/components/site/ContentPlaceholder";
import { CTASection } from "@/components/site/CTASection";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Projects",
  description:
    "AIVRASOL case studies and selected work across AI, automation, and digital product delivery.",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="Projects"
        title="Proof over promises."
        description="Case studies that show how we think, build, and deliver — with context, craft, and measurable intent."
      />
      <ContentPlaceholder
        eyebrow="Portfolio"
        title="Work that earns trust."
        description="Project archive with industry filters, technology tags, and immersive case study layouts."
        items={["Featured Builds", "Enterprise", "Growth Products"]}
      />
      <CTASection secondaryLabel="Explore Services" secondaryHref="/services" />
    </>
  );
}

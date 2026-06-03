import { PageHero } from "@/components/site/PageHero";
import { ContentPlaceholder } from "@/components/site/ContentPlaceholder";
import { CTASection } from "@/components/site/CTASection";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "About",
  description:
    "Discover AIVRASOL — a premium AI and digital studio built for ambitious product and brand teams.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Built for brands that refuse to look generic."
        description="AIVRASOL combines strategy, engineering, and AI craft into one premium delivery studio focused on clarity, performance, and long-term product value."
        size="large"
      />
      <ContentPlaceholder
        eyebrow="Studio"
        title="Mission, method, and standards."
        description="Editorial story sections, values, and process narrative will be managed from site settings and CMS modules."
        items={["Our Philosophy", "How We Work", "Why AIVRASOL"]}
      />
      <CTASection
        title="Let's define your next chapter."
        description="Whether you're launching an AI product or modernizing a digital platform, we'll help you move with precision."
      />
    </>
  );
}

import { PageHero } from "@/components/site/PageHero";
import { ContentPlaceholder } from "@/components/site/ContentPlaceholder";
import { CTASection } from "@/components/site/CTASection";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Team",
  description:
    "Meet the AIVRASOL team — strategists, engineers, and AI specialists behind the work.",
  path: "/team",
});

export default function TeamPage() {
  return (
    <>
      <PageHero
        eyebrow="Team"
        title="Specialists behind the experience."
        description="A multidisciplinary studio of strategists, engineers, and designers focused on premium AI-led delivery."
      />
      <ContentPlaceholder
        eyebrow="People"
        title="Profiles with depth and credibility."
        description="Team member cards with roles, bios, skills, and social links — fully managed in admin."
        items={["Leadership", "Engineering", "Design & AI"]}
      />
      <CTASection title="Work with our team." />
    </>
  );
}

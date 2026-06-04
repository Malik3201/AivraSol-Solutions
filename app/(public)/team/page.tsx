import { TeamMembersSection } from "@/components/team/TeamMembersSection";
import { PageCTA } from "@/components/site/PageCTA";
import { PageHero } from "@/components/site/PageHero";
import { PageSection } from "@/components/site/PageSection";
import { PremiumCard } from "@/components/site/PremiumCard";
import { PAGE_GRID } from "@/lib/page-layout";
import { fetchTeamList } from "@/lib/public-data";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Team",
  description:
    "Meet the AIVRASOL team — design, engineering, and applied AI specialists building intelligent digital systems.",
  path: "/team",
});

const COLLAB = [
  { title: "Design clarity", text: "Interfaces and narratives that reduce friction for users and stakeholders." },
  { title: "Engineering discipline", text: "Scalable platforms, APIs, and integrations built for long-term maintenance." },
  { title: "Business context", text: "Decisions anchored in how your organisation sells, operates, and grows." },
];

export default async function TeamPage() {
  const members = await fetchTeamList();

  return (
    <>
      <PageHero
        eyebrow="Team"
        title="People behind the systems you ship."
        description="AIVRASOL brings together design thinking, engineering discipline, and applied AI to build digital products that feel clear and work reliably."
      />

      <PageSection
        background="calm"
        title="The studio"
        description="Meet the specialists behind AIVRASOL — strategy, design, engineering, and applied intelligence."
      >
        <TeamMembersSection members={members} columns="three" />
      </PageSection>

      <PageSection background="editorial" title="How we collaborate">
        <div className={PAGE_GRID}>
          {COLLAB.map((c) => (
            <PremiumCard key={c.title} className="col-span-12 md:col-span-4">
              <h3 className="text-lg font-semibold">{c.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{c.text}</p>
            </PremiumCard>
          ))}
        </div>
      </PageSection>

      <PageCTA title="Work with our team" primaryLabel="Start a Project" />
    </>
  );
}

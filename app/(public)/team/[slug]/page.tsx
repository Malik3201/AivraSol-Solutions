import { notFound } from "next/navigation";
import { TeamProfileHero } from "@/components/team/TeamProfileHero";
import { SkillCloud } from "@/components/team/SkillCloud";
import { PageCTA } from "@/components/site/PageCTA";
import { PageSection } from "@/components/site/PageSection";
import { PremiumCard } from "@/components/site/PremiumCard";
import { fetchTeamDetail } from "@/lib/public-data";
import { createPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const data = await fetchTeamDetail(slug);
  if (!data) {
    return createPageMetadata({ title: "Team", path: `/team/${slug}` });
  }
  return createPageMetadata({
    title: data.seo.title,
    description: data.seo.description,
    path: `/team/${slug}`,
    image: data.seo.image,
  });
}

export default async function TeamMemberPage({ params }: Props) {
  const { slug } = await params;
  const data = await fetchTeamDetail(slug);
  if (!data) notFound();

  const { member } = data;

  return (
    <>
      <TeamProfileHero member={member} />

      <PageSection background="editorial" title="About">
        <PremiumCard>
          <p className="text-base leading-relaxed text-muted-foreground">
            {member.bio ??
              `${member.name} contributes to AIVRASOL deliveries across strategy, design, engineering, and intelligent product layers.`}
          </p>
        </PremiumCard>
      </PageSection>

      <PageSection background="minimal" title="Focus areas">
        <SkillCloud skills={member.skills} />
      </PageSection>

      <PageCTA title="Work with AIVRASOL" primaryLabel="Contact us" primaryHref="/contact" />
    </>
  );
}

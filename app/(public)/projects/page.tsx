import { ProjectsCardGrid } from "@/components/projects/ProjectsCardGrid";
import { PageCTA } from "@/components/site/PageCTA";
import { PageHero } from "@/components/site/PageHero";
import { PageSection } from "@/components/site/PageSection";
import { fetchProjectsList } from "@/lib/public-data";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Projects",
  description:
    "Explore AIVRASOL work — digital platforms, automation systems, and AI-enabled experiences with measurable outcomes.",
  path: "/projects",
});

export default async function ProjectsPage() {
  const projects = await fetchProjectsList();
  const featuredId =
    projects.find((p) => p.isFeatured)?.id ?? projects[0]?.id;

  return (
    <>
      <PageHero
        eyebrow="Work"
        title="Work shaped around measurable outcomes."
        description="Explore digital platforms, automation systems, and AI-enabled experiences designed to solve real business problems."
      />

      <PageSection
        background="stage"
        title="Case studies"
        description="Selected work across industries — strategy, build, and measurable results."
      >
        <ProjectsCardGrid projects={projects} featuredId={featuredId} />
      </PageSection>

      <PageCTA title="Have a project in mind?" primaryLabel="Start a Project" />
    </>
  );
}

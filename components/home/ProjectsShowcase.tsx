import { ProjectsCardGrid } from "@/components/projects/ProjectsCardGrid";
import { AivaDock } from "@/components/home/AivaDock";
import { AivaGuide } from "@/components/home/aiva/AivaGuide";
import { AivaWaypoint } from "@/components/home/aiva/AivaWaypoint";
import { HomeSection } from "@/components/home/HomeSection";
import { AIVA_WAYPOINT_MESSAGES } from "@/lib/aiva-waypoints";
import type { PublicProject } from "@/lib/api/types";
import { MagneticButton } from "@/components/site/MagneticButton";
import { cn } from "@/lib/utils";

export function FeaturedProjectsSection({
  projects,
}: {
  projects: PublicProject[];
}) {
  if (!projects.length) return null;

  const featuredId =
    projects.find((p) => p.isFeatured)?.id ?? projects[0]?.id;

  return (
    <AivaWaypoint id="projects">
      <HomeSection
        id="featured-projects"
        background="stage"
        eyebrow="Featured Projects"
        title="Where strategy becomes measurable product."
        description="All featured case studies — the carousel auto-advances; hover to pause."
      >
        <AivaGuide message={AIVA_WAYPOINT_MESSAGES.projects} className="mb-6 md:mb-8" />
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Auto-playing carousel · hover to pause
          </p>
          <MagneticButton
            href="/projects"
            variant="outline"
            size="default"
            className="w-full sm:ml-auto sm:w-auto"
          >
            View all projects
          </MagneticButton>
        </div>
        <div className="relative">
          <AivaDock id="projects" className="bottom-[20%] left-[50%] top-auto -translate-x-1/2" />
          <ProjectsCardGrid
            projects={projects}
            featuredId={featuredId}
            variant="featured"
            ariaLabel="Featured projects"
          />
        </div>
      </HomeSection>
    </AivaWaypoint>
  );
}

/** @deprecated Use FeaturedProjectsSection */
export const ProjectsShowcase = FeaturedProjectsSection;

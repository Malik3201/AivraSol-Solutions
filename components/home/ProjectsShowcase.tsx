import Link from "next/link";
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
  const list = projects.slice(0, 4);
  const featuredId =
    list.find((p) => p.isFeatured)?.id ?? list[0]?.id;

  if (!list.length) return null;

  return (
    <AivaWaypoint id="projects">
      <HomeSection
        id="featured-projects"
        background="stage"
        eyebrow="Featured Projects"
        title="Where strategy becomes measurable product."
        description="Selected case studies across industries — swipe on mobile to explore recent work."
      >
        <AivaGuide message={AIVA_WAYPOINT_MESSAGES.projects} className="mb-6 md:mb-8" />
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground md:hidden">
            Swipe to browse featured projects
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
            projects={list}
            featuredId={featuredId}
            ariaLabel="Featured projects"
          />
        </div>
        <p className="mt-6 text-center md:hidden">
          <Link href="/projects" className="text-sm text-primary">
            View all projects →
          </Link>
        </p>
      </HomeSection>
    </AivaWaypoint>
  );
}

/** @deprecated Use FeaturedProjectsSection */
export const ProjectsShowcase = FeaturedProjectsSection;

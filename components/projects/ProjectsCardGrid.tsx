"use client";

import { ProjectCard } from "@/components/projects/ProjectCard";
import { ResponsiveCardGrid } from "@/components/site/ResponsiveCardGrid";
import type { PublicProject } from "@/lib/api/types";

type Props = {
  projects: PublicProject[];
  featuredId?: string;
  ariaLabel?: string;
};

export function ProjectsCardGrid({
  projects,
  featuredId,
  ariaLabel = "Projects",
}: Props) {
  return (
    <ResponsiveCardGrid
      items={projects}
      keyExtractor={(p) => p.id}
      ariaLabel={ariaLabel}
      gridClassName="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
      renderItem={(project, index) => (
        <ProjectCard
          project={project}
          index={index}
          featured={
            featuredId ? project.id === featuredId : index === 0
          }
        />
      )}
    />
  );
}

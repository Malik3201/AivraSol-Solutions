import { ProjectsCardGrid } from "@/components/projects/ProjectsCardGrid";
import type { PublicProject } from "@/lib/api/types";

export function RelatedProjects({ projects }: { projects: PublicProject[] }) {
  if (!projects.length) return null;

  return (
    <ProjectsCardGrid
      projects={projects}
      ariaLabel="Related projects"
    />
  );
}

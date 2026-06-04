import type { PublicProject } from "@/lib/api/types";

export function getProjectHeroLead(project: PublicProject): string {
  return (
    project.shortDescription?.trim() ||
    project.description?.trim()?.slice(0, 220) ||
    "A strategy-led case study delivered with premium craft, measurable outcomes, and long-term platform thinking."
  );
}

export function getProjectOverviewBody(project: PublicProject): string {
  const description = project.description?.trim() ?? "";
  const short = project.shortDescription?.trim() ?? "";
  if (description && description !== short) return description;
  if (description) return description;
  if (short) return short;
  return "This engagement combined discovery, design, engineering, and iteration into one cohesive delivery—built to perform in production and scale with the business.";
}

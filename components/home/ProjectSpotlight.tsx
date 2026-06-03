import Link from "next/link";
import { ProjectVisualPanel } from "@/components/home/ProjectVisualPanel";
import { HOME_GRID } from "@/components/home/home-layout";
import type { PublicProject } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const RESULT_CHIPS = ["Faster ops", "Clear UX", "Measurable ROI"];
const TECH_CHIPS = ["Next.js", "Automation", "AI layer"];

function FeaturedCard({ project }: { project: PublicProject }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group col-span-12 flex flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-[rgba(10,16,14,0.65)] transition-colors hover:border-primary/25 md:col-span-7"
    >
      <div className="grid flex-1 gap-6 p-6 md:grid-cols-2 md:p-8">
        <div className="flex flex-col">
          <span className="text-[11px] uppercase tracking-[0.3em] text-primary">
            {project.industry ?? "Case study"}
          </span>
          <h3 className="mt-3 text-2xl font-semibold text-white md:text-3xl">
            {project.title}
          </h3>
          <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground md:text-base">
            {project.shortDescription}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {RESULT_CHIPS.map((c) => (
              <span
                key={c}
                className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs text-foreground/90"
              >
                {c}
              </span>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {TECH_CHIPS.map((c) => (
              <span
                key={c}
                className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] text-muted-foreground"
              >
                {c}
              </span>
            ))}
          </div>
          <span className="mt-6 text-sm font-medium text-primary group-hover:underline">
            Read case study →
          </span>
        </div>
        <ProjectVisualPanel variant="featured" className="h-full min-h-[200px]" />
      </div>
    </Link>
  );
}

function SupportingCard({ project }: { project: PublicProject }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-1 flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[rgba(10,16,14,0.6)] p-5 transition-colors hover:border-primary/25"
    >
      <div className="flex flex-1 flex-col gap-4 sm:flex-row">
        <div className="flex flex-1 flex-col">
          <span className="text-[10px] uppercase tracking-[0.28em] text-primary">
            {project.industry ?? "Project"}
          </span>
          <h3 className="mt-2 text-lg font-semibold">{project.title}</h3>
          <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">
            {project.shortDescription}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Platform", "Outcomes"].map((c) => (
              <span
                key={c}
                className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-muted-foreground"
              >
                {c}
              </span>
            ))}
          </div>
          <span className="mt-4 text-xs font-medium text-primary">View project →</span>
        </div>
        <div className="w-full shrink-0 sm:w-[140px]">
          <ProjectVisualPanel variant="compact" className="h-full min-h-[100px]" />
        </div>
      </div>
    </Link>
  );
}

export function ProjectSpotlight({ projects }: { projects: PublicProject[] }) {
  const [lead, second, third] = projects.slice(0, 3);
  if (!lead) return null;

  return (
    <div className={cn(HOME_GRID, "items-stretch gap-5 md:gap-6")}>
      <FeaturedCard project={lead} />
      <div className="col-span-12 flex flex-col gap-5 md:col-span-5">
        {second ? <SupportingCard project={second} /> : null}
        {third ? <SupportingCard project={third} /> : null}
      </div>
    </div>
  );
}

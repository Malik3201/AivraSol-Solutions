import { getProjectOverviewBody } from "@/components/projects/project-detail-utils";
import type { PublicProject } from "@/lib/api/types";
import { PAGE_GRID } from "@/lib/page-layout";

export function ProjectOverview({ project }: { project: PublicProject }) {
  const body = getProjectOverviewBody(project);
  const paragraphs = body.split(/\n\n+/).filter(Boolean);

  return (
    <div className={PAGE_GRID}>
      <div className="col-span-12 lg:col-span-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.34em] text-primary">
          Overview
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-3xl">
          From challenge to shipped outcome
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          How strategy, design, and engineering came together for a result the
          team could measure and build on.
        </p>
      </div>
      <div className="col-span-12 lg:col-span-8">
        <div className="rounded-3xl border border-white/[0.08] bg-[rgba(10,16,14,0.55)] p-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] md:p-10">
          <div className="space-y-5 text-base leading-relaxed text-foreground/90 md:text-lg">
            {paragraphs.length > 1 ? (
              paragraphs.map((p) => <p key={p.slice(0, 40)}>{p}</p>)
            ) : (
              <p>{body}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

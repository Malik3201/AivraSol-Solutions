import { getServiceOverviewBody } from "@/components/services/service-detail-utils";
import type { PublicService } from "@/lib/api/types";
import { PAGE_GRID } from "@/lib/page-layout";

export function ServiceOverview({ service }: { service: PublicService }) {
  const body = getServiceOverviewBody(service);
  const paragraphs = body.split(/\n\n+/).filter(Boolean);

  return (
    <div className={PAGE_GRID}>
      <div className="col-span-12 lg:col-span-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.34em] text-primary">
          Overview
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-3xl">
          Built for outcomes, not buzzwords
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Every engagement is scoped around your users, constraints, and success
          metrics—then delivered with the craft your brand deserves.
        </p>
      </div>
      <div className="col-span-12 lg:col-span-8">
        <div className="rounded-3xl border border-white/[0.08] bg-[rgba(10,16,14,0.55)] p-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] md:p-10">
          <div className="space-y-5 text-base leading-relaxed text-foreground/90 md:text-lg md:leading-relaxed">
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

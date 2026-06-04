import { Layers, Sparkles } from "lucide-react";
import { PAGE_GRID } from "@/lib/page-layout";
import { cn } from "@/lib/utils";

const DEFAULT_FEATURES = [
  "Discovery-led scoping aligned to business outcomes",
  "Premium UX and interface systems",
  "Scalable engineering and integrations",
  "Applied AI and automation layers",
  "SEO-ready architecture and performance",
  "Launch support and iteration planning",
];

export function ServiceFeatureGrid({ features }: { features: string[] }) {
  const list = features.length > 0 ? features : DEFAULT_FEATURES;

  return (
    <div className={PAGE_GRID}>
      {list.map((feature, i) => (
        <article
          key={`${feature}-${i}`}
          className={cn(
            "group relative col-span-12 overflow-hidden rounded-3xl border border-white/[0.08] bg-[rgba(10,16,14,0.6)] p-6 backdrop-blur-sm transition-colors hover:border-primary/25 sm:col-span-6 lg:col-span-4",
            "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]",
          )}
        >
          <div
            className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-primary/10 blur-2xl opacity-0 transition-opacity group-hover:opacity-100"
            aria-hidden
          />
          <span className="text-[11px] font-semibold tabular-nums text-primary/80">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="mt-4 flex size-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
            {i % 2 === 0 ? (
              <Sparkles className="size-5" aria-hidden />
            ) : (
              <Layers className="size-5" aria-hidden />
            )}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-foreground/90 md:text-[15px]">
            {feature}
          </p>
        </article>
      ))}
    </div>
  );
}

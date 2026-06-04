import type { ProcessStep } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const DEFAULT_STEPS: ProcessStep[] = [
  { title: "Discover", description: "Goals, users, constraints, and success metrics." },
  { title: "Design", description: "UX, architecture, and delivery roadmap." },
  { title: "Build", description: "Engineering, integrations, and QA." },
  { title: "Launch", description: "Deploy, measure, and improve with intent." },
];

export function ServiceProcess({ steps }: { steps?: ProcessStep[] }) {
  const list = steps?.length ? steps : DEFAULT_STEPS;

  return (
    <div className="relative">
      <div
        className="absolute left-0 right-0 top-[2.75rem] hidden h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent lg:block"
        aria-hidden
      />
      <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {list.map((step, i) => (
          <li
            key={step.title}
            className={cn(
              "relative rounded-3xl border border-white/[0.08] bg-[rgba(10,16,14,0.55)] p-6",
              "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]",
            )}
          >
            <div className="flex items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-sm font-semibold text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              {i < list.length - 1 ? (
                <span
                  className="hidden h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent lg:block"
                  aria-hidden
                />
              ) : null}
            </div>
            <h3 className="mt-5 text-lg font-semibold text-white">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {step.description}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

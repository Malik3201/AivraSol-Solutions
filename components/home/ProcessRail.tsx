import { cn } from "@/lib/utils";

const STEPS = [
  { title: "Discover the business", detail: "Goals, users, constraints, and the real problem." },
  { title: "Map intelligent workflows", detail: "Data paths, decisions, and automation leverage." },
  { title: "Design premium experience", detail: "Custom UI, motion, and narrative — not templates." },
  { title: "Build scalable systems", detail: "Next.js, APIs, and cloud-native foundations." },
  { title: "Automate with AI", detail: "Assistants and workflows teams adopt daily." },
  { title: "Launch, measure, improve", detail: "Ship, track outcomes, iterate with intent." },
];

export function ProcessRail() {
  return (
    <div className="relative mt-12">
      <div
        className="absolute left-[8%] right-[8%] top-8 hidden h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent md:block"
        aria-hidden
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {STEPS.map((step, i) => (
          <div
            key={step.title}
            className={cn(
              "relative rounded-2xl border border-white/[0.08] bg-[rgba(10,16,14,0.55)] p-4 backdrop-blur-sm transition-colors hover:border-primary/25",
            )}
          >
            <span className="mb-3 inline-flex size-8 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-xs font-semibold text-primary">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="text-sm font-semibold leading-snug text-foreground">
              {step.title}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {step.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

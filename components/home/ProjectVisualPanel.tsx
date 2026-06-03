import { cn } from "@/lib/utils";

export function ProjectVisualPanel({
  variant = "compact",
  className,
}: {
  variant?: "featured" | "compact";
  className?: string;
}) {
  const featured = variant === "featured";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#0c1411] via-[#080d0b] to-[#060a08]",
        featured ? "min-h-[200px] p-5" : "min-h-[100px] p-4",
        className,
      )}
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(62,207,142,0.12),transparent_50%)]" />
      {featured ? (
        <>
          <div className="relative mb-4 grid grid-cols-3 gap-2">
            {[
              { label: "Efficiency", value: "+38%" },
              { label: "Adoption", value: "92%" },
              { label: "Uptime", value: "99.9%" },
            ].map((m) => (
              <div
                key={m.label}
                className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-2 py-2"
              >
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
                  {m.label}
                </p>
                <p className="text-sm font-semibold text-primary">{m.value}</p>
              </div>
            ))}
          </div>
          <div className="relative space-y-2">
            {["Workflow", "Analytics", "Automation"].map((row, i) => (
              <div key={row} className="flex items-center gap-2">
                <span className="w-16 text-[10px] text-muted-foreground">{row}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-primary/70"
                    style={{ width: `${72 - i * 12}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="relative mt-4 flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className="size-1.5 rounded-full bg-primary/40"
                style={{ opacity: 0.4 + i * 0.12 }}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="relative flex h-full flex-col justify-between">
          <div className="flex gap-2">
            <div className="h-8 flex-1 rounded-md border border-white/[0.06] bg-primary/10" />
            <div className="h-8 w-12 rounded-md border border-white/[0.06] bg-white/[0.04]" />
          </div>
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <div className="h-full w-2/3 rounded-full bg-primary/50" />
          </div>
        </div>
      )}
    </div>
  );
}

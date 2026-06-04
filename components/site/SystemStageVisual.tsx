export function SystemStageVisual({ className }: { className?: string }) {
  return (
    <div
      className={`relative mx-auto aspect-square w-full max-w-[320px] ${className ?? ""}`}
      aria-hidden
    >
      <div className="absolute inset-[10%] rounded-full bg-primary/15 blur-[60px]" />
      <div
        className="absolute inset-[18%] rounded-2xl border border-white/[0.08] bg-[rgba(10,16,14,0.85)] p-5 backdrop-blur-md"
        style={{
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 24px 60px -30px rgba(62,207,142,0.2)",
        }}
      >
        <p className="text-[10px] uppercase tracking-[0.3em] text-primary">System map</p>
        <div className="mt-4 space-y-2">
          {["Strategy", "Experience", "Automation"].map((row) => (
            <div
              key={row}
              className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-xs text-muted-foreground"
            >
              <span>{row}</span>
              <span className="size-1.5 rounded-full bg-primary" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

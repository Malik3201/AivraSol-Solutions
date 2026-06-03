export default function Loading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 px-4">
      <div className="relative size-14">
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/25" />
        <span className="relative flex size-14 items-center justify-center rounded-2xl border border-primary/30 bg-surface/80">
          <span className="size-3 rounded-full bg-primary shadow-[0_0_20px_var(--aivra-glow)]" />
        </span>
      </div>
      <p className="text-sm tracking-[0.25em] text-muted-foreground uppercase">
        Loading experience
      </p>
    </div>
  );
}

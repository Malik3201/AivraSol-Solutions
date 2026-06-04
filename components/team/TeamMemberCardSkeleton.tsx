import { cn } from "@/lib/utils";

export function TeamMemberCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-[440px] animate-pulse flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03]",
        className,
      )}
      aria-hidden
    >
      <div className="flex flex-1 flex-col items-center px-6 pt-10">
        <div className="mb-6 size-[7.5rem] rounded-full bg-white/10" />
        <div className="h-6 w-32 rounded-md bg-white/10" />
        <div className="mt-2 h-4 w-24 rounded-md bg-white/[0.06]" />
        <div className="mt-6 space-y-2 w-full">
          <div className="h-3 w-full rounded bg-white/[0.06]" />
          <div className="h-3 w-4/5 rounded bg-white/[0.06]" />
          <div className="h-3 w-3/5 rounded bg-white/[0.06]" />
        </div>
      </div>
      <div className="h-14 rounded-b-2xl bg-primary/20" />
    </div>
  );
}

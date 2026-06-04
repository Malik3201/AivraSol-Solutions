import { cn } from "@/lib/utils";

const VARIANTS: Record<string, string> = {
  active: "border-primary/30 bg-primary/10 text-primary",
  inactive: "border-white/10 bg-white/5 text-muted-foreground",
  draft: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  published: "border-primary/30 bg-primary/10 text-primary",
  new: "border-sky-500/30 bg-sky-500/10 text-sky-200",
  contacted: "border-violet-500/30 bg-violet-500/10 text-violet-200",
  qualified: "border-primary/30 bg-primary/10 text-primary",
  closed: "border-white/10 bg-white/5 text-muted-foreground",
  spam: "border-destructive/30 bg-destructive/10 text-destructive",
  featured: "border-primary/40 bg-primary/15 text-primary",
};

export function StatusBadge({
  label,
  variant,
}: {
  label: string;
  variant?: keyof typeof VARIANTS | string;
}) {
  const key = (variant ?? label).toLowerCase();
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide",
        VARIANTS[key] ?? VARIANTS.inactive,
      )}
    >
      {label}
    </span>
  );
}

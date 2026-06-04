import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  className,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/[0.08] bg-[rgba(10,16,14,0.55)] px-8 py-14 text-center backdrop-blur-md",
        className,
      )}
    >
      <p className="text-[11px] uppercase tracking-[0.3em] text-primary">Coming soon</p>
      <h3 className="mt-4 text-2xl font-semibold text-white">{title}</h3>
      <p className="mx-auto mt-4 max-w-md text-muted-foreground">{description}</p>
      {actionLabel && actionHref ? (
        <Link href={actionHref} className={cn(buttonVariants({ variant: "outline" }), "mt-8")}>
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

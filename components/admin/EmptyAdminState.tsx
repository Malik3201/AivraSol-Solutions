import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EmptyAdminState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-xl border border-dashed border-white/10 px-8 py-14 text-center">
      <p className="text-sm font-medium text-white">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      {actionLabel && onAction ? (
        <button type="button" onClick={onAction} className={cn(buttonVariants(), "mt-6")}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

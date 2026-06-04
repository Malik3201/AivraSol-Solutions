import type { LucideIcon } from "lucide-react";
import { adminPanelClass } from "@/lib/admin-styles";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  accent?: boolean;
}) {
  return (
    <div className={cn(adminPanelClass, "p-5")}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
            {label}
          </p>
          <p
            className={cn(
              "mt-2 text-3xl font-semibold tabular-nums",
              accent ? "text-primary" : "text-white",
            )}
          >
            {value}
          </p>
          {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
        </div>
        {Icon ? (
          <div className="rounded-lg border border-primary/20 bg-primary/10 p-2">
            <Icon className="size-4 text-primary" aria-hidden />
          </div>
        ) : null}
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";

export function PremiumMetric({
  value,
  label,
  className,
}: {
  value: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-3xl font-semibold tracking-tight text-gradient-aivra md:text-[2.25rem]">
        {value}
      </span>
      <span className="max-w-[11rem] text-sm leading-snug text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

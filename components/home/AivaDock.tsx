import type { AivaWaypointId } from "@/lib/aiva-waypoints";
import { cn } from "@/lib/utils";

/** In-section anchor for desktop Aiva scroll journey */
export function AivaDock({
  id,
  className,
}: {
  id: AivaWaypointId;
  className?: string;
}) {
  return (
    <div
      data-aiva-dock={id}
      className={cn(
        "pointer-events-none absolute z-[3] hidden size-3 lg:block",
        className,
      )}
      aria-hidden
    />
  );
}

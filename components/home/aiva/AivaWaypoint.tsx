import type { AivaWaypointId } from "@/lib/aiva-waypoints";
import { cn } from "@/lib/utils";

/** Scroll chapter wrapper — docks live inside section layouts */
export function AivaWaypoint({
  id,
  children,
  className,
}: {
  id: AivaWaypointId;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div data-aiva-chapter={id} className={cn("relative", className)}>
      {children}
    </div>
  );
}

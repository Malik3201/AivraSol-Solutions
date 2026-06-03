import { ProcessRail } from "@/components/home/ProcessRail";
import { AivaDock } from "@/components/home/AivaDock";
import { AivaGuide } from "@/components/home/aiva/AivaGuide";
import { AivaWaypoint } from "@/components/home/aiva/AivaWaypoint";
import { HomeSection } from "@/components/home/HomeSection";
import { AIVA_WAYPOINT_MESSAGES } from "@/lib/aiva-waypoints";

export function ProcessSection() {
  return (
    <AivaWaypoint id="process">
      <HomeSection
        id="process"
        background="process"
        eyebrow="Process"
        title="A deliberate path from strategy to shipped intelligence."
        description="Six connected phases — each with a clear deliverable."
      >
        <AivaGuide message={AIVA_WAYPOINT_MESSAGES.process} className="mb-8" />
        <div className="relative pt-4">
          <AivaDock id="process" className="bottom-12 left-1/2 top-auto -translate-x-1/2" />
          <ProcessRail />
        </div>
      </HomeSection>
    </AivaWaypoint>
  );
}

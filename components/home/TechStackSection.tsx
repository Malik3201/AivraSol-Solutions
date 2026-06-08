import { AivaDock } from "@/components/home/AivaDock";
import { AivaGuide } from "@/components/home/aiva/AivaGuide";
import { AivaWaypoint } from "@/components/home/aiva/AivaWaypoint";
import { HomeSection } from "@/components/home/HomeSection";
import { TechStackCards } from "@/components/home/TechStackCards";
import { AIVA_WAYPOINT_MESSAGES } from "@/lib/aiva-waypoints";

export function TechStackSection() {
  return (
    <AivaWaypoint id="tech">
      <HomeSection
        id="tech"
        background="minimal"
        eyebrow="Technology"
        title="Built for speed, safety, and scale."
      >
        <AivaGuide message={AIVA_WAYPOINT_MESSAGES.tech} className="mb-8" />
        <div className="relative">
          <AivaDock id="tech" className="right-4 top-2 md:right-8" />
          <TechStackCards />
        </div>
      </HomeSection>
    </AivaWaypoint>
  );
}

import Link from "next/link";
import { AivaDock } from "@/components/home/AivaDock";
import { AivaGuide } from "@/components/home/aiva/AivaGuide";
import { AivaWaypoint } from "@/components/home/aiva/AivaWaypoint";
import { HomeSection } from "@/components/home/HomeSection";
import { AIVA_WAYPOINT_MESSAGES } from "@/lib/aiva-waypoints";
import type { PublicTeamMember } from "@/lib/api/types";
import { TeamCardGrid } from "@/components/team/TeamCardGrid";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function TeamPreview({ members }: { members: PublicTeamMember[] }) {
  const list = members.slice(0, 4);

  return (
    <AivaWaypoint id="team">
      <HomeSection
        id="team"
        background="calm"
        eyebrow="Team"
        title="Specialists behind the systems you ship."
      >
        <AivaGuide message={AIVA_WAYPOINT_MESSAGES.team} className="mb-6 md:mb-8" />
        <div className="relative">
          <AivaDock id="team" className="right-6 top-24 md:right-10" />
          <TeamCardGrid members={list} ariaLabel="Team preview" />
        </div>
        <div className="mt-8 text-center sm:mt-10">
          <Link
            href="/team"
            className={cn(buttonVariants({ variant: "outline" }), "w-full sm:w-auto")}
          >
            Meet the team
          </Link>
        </div>
      </HomeSection>
    </AivaWaypoint>
  );
}

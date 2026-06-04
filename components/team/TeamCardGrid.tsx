"use client";

import { ResponsiveCardGrid } from "@/components/site/ResponsiveCardGrid";
import { TeamMemberCard } from "@/components/team/TeamMemberCard";
import type { PublicTeamMember } from "@/lib/api/types";

export function TeamCardGrid({
  members,
  ariaLabel = "Team members",
}: {
  members: PublicTeamMember[];
  ariaLabel?: string;
}) {
  return (
    <ResponsiveCardGrid
      items={members}
      keyExtractor={(m) => m.id}
      ariaLabel={ariaLabel}
      gridClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      slideClassName="w-[min(88vw,340px)] sm:w-[min(52vw,380px)] lg:w-[min(32vw,380px)]"
      renderItem={(member) => <TeamMemberCard member={member} />}
    />
  );
}

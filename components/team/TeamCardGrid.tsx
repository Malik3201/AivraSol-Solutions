"use client";

import { ResponsiveCardGrid } from "@/components/site/ResponsiveCardGrid";
import { TeamCard } from "@/components/team/TeamCard";
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
      gridClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      renderItem={(member) => <TeamCard member={member} />}
    />
  );
}

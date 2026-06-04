"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { TeamMemberCard } from "@/components/team/TeamMemberCard";
import type { PublicTeamMember } from "@/lib/api/types";
import { cn } from "@/lib/utils";

export function TeamMembersSection({
  members,
  className,
  columns = "responsive",
}: {
  members: PublicTeamMember[];
  className?: string;
  /** `responsive`: 1→2→3 cols; `three`: max 3 per row on desktop */
  columns?: "responsive" | "three";
}) {
  if (!members.length) return null;

  const gridClass =
    columns === "three"
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  return (
    <div
      className={cn("grid gap-8", gridClass, className)}
      role="list"
      aria-label="Team members"
    >
      {members.map((member, index) => (
        <FadeIn key={member.id} delay={index * 0.05} className="h-full">
          <div role="listitem" className="h-full">
            <TeamMemberCard member={member} />
          </div>
        </FadeIn>
      ))}
    </div>
  );
}

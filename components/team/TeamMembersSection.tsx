"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { ResponsiveCardGrid } from "@/components/site/ResponsiveCardGrid";
import { TeamMemberCard } from "@/components/team/TeamMemberCard";
import type { PublicTeamMember } from "@/lib/api/types";
import { cn } from "@/lib/utils";

export function TeamMembersSection({
  members,
  className,
  columns = "responsive",
  mobileCarousel = true,
  carouselOnly = false,
}: {
  members: PublicTeamMember[];
  className?: string;
  /** `responsive`: 1→2→3 cols; `three`: max 3 per row on desktop */
  columns?: "responsive" | "three";
  /** Swipeable autoplay carousel below md */
  mobileCarousel?: boolean;
  /** Carousel only — no stacked grid (homepage) */
  carouselOnly?: boolean;
}) {
  if (!members.length) return null;

  const gridCols =
    columns === "three"
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  const card = (member: PublicTeamMember) => (
    <div role="listitem" className="h-full">
      <TeamMemberCard member={member} />
    </div>
  );

  if (mobileCarousel) {
    return (
      <div className={className} role="list" aria-label="Team members">
        <ResponsiveCardGrid
          items={members}
          keyExtractor={(m) => m.id}
          renderItem={(member) => card(member)}
          carouselFrom="md"
          carouselOnly={carouselOnly}
          autoPlay
          autoPlayInterval={5000}
          ariaLabel="Team members"
          slideClassName="w-[min(88vw,340px)] shrink-0 snap-center sm:w-[min(72vw,380px)] md:w-[min(42vw,400px)]"
          gridClassName={carouselOnly ? undefined : cn("gap-8", gridCols)}
        />
      </div>
    );
  }

  return (
    <div
      className={cn("grid gap-8", gridCols, className)}
      role="list"
      aria-label="Team members"
    >
      {members.map((member, index) => (
        <FadeIn key={member.id} delay={index * 0.05} className="h-full">
          {card(member)}
        </FadeIn>
      ))}
    </div>
  );
}

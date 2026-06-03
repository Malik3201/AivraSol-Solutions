import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/animations/FadeIn";
import { AivaDock } from "@/components/home/AivaDock";
import { AivaGuide } from "@/components/home/aiva/AivaGuide";
import { AivaWaypoint } from "@/components/home/aiva/AivaWaypoint";
import { HomeSection } from "@/components/home/HomeSection";
import { HOME_GRID } from "@/components/home/home-layout";
import { AIVA_WAYPOINT_MESSAGES } from "@/lib/aiva-waypoints";
import type { PublicTeamMember } from "@/lib/api/types";
import { buttonVariants } from "@/components/ui/button";

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
        <AivaGuide message={AIVA_WAYPOINT_MESSAGES.team} className="mb-8" />
        <div className="relative">
          <AivaDock id="team" className="right-6 top-24 md:right-10" />
          <div className={HOME_GRID}>
            {list.map((member, i) => (
              <FadeIn
                key={member.id}
                delay={i * 0.04}
                className="col-span-12 sm:col-span-6 lg:col-span-3"
              >
                <div className="h-full rounded-2xl border border-white/[0.08] bg-[rgba(10,16,14,0.55)] p-6">
                  <div className="mb-4 flex size-14 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-primary/5">
                    {member.photo ? (
                      <Image
                        src={member.photo}
                        alt={member.name}
                        width={56}
                        height={56}
                        className="size-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-semibold text-primary">
                        {member.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="mt-1 text-sm text-primary">{member.role}</p>
                  {member.bio ? (
                    <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                      {member.bio}
                    </p>
                  ) : null}
                </div>
              </FadeIn>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/team" className={buttonVariants({ variant: "outline" })}>
              Meet the team
            </Link>
          </div>
        </div>
      </HomeSection>
    </AivaWaypoint>
  );
}

"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { RemoteImage } from "@/components/site/RemoteImage";
import { TeamSocialBar } from "@/components/team/TeamSocialBar";
import type { PublicTeamMember } from "@/lib/api/types";
import { cn } from "@/lib/utils";

export function TeamMemberCard({
  member,
  className,
}: {
  member: PublicTeamMember;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const bio =
    member.bio?.trim() ||
    `${member.name} helps deliver premium digital systems with clarity, craft, and measurable outcomes.`;

  return (
    <motion.article
      whileHover={reduce ? undefined : { y: -6 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      className={cn(
        "group flex h-[min(440px,78vh)] flex-col overflow-hidden rounded-2xl",
        "border border-white/[0.09] bg-[rgba(10,16,14,0.55)] backdrop-blur-xl",
        "shadow-[0_24px_60px_-28px_rgba(0,0,0,0.85)]",
        "transition-[border-color,box-shadow] duration-500",
        "hover:border-primary/35 hover:shadow-[0_32px_80px_-24px_rgba(62,207,142,0.28)]",
        className,
      )}
    >
      <Link
        href={`/team/${member.slug}`}
        className={cn(
          "relative flex min-h-0 flex-1 flex-col overflow-hidden",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary",
        )}
        aria-label={`View profile for ${member.name}`}
      >
        {member.photo ? (
          <div
            className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            aria-hidden
          >
            <RemoteImage
              src={member.photo}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-[#060a08]/20" />
          </div>
        ) : null}

        <div
          className="pointer-events-none absolute -top-16 left-1/2 z-0 size-40 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl opacity-60 transition-opacity duration-500 group-hover:opacity-0"
          aria-hidden
        />

        <div
          className={cn(
            "relative z-10 flex flex-1 flex-col items-center px-6 pb-6 pt-10 text-center",
            "transition-opacity duration-500 ease-out",
            "group-hover:pointer-events-none group-hover:opacity-0",
          )}
        >
          <div className="relative mb-6 transition-opacity duration-500 group-hover:opacity-0">
            <div
              className="absolute -inset-2 rounded-full bg-primary/25 blur-md transition-opacity duration-500 group-hover:opacity-0"
              aria-hidden
            />
            <div
              className={cn(
                "relative size-[7.5rem] overflow-hidden rounded-full",
                "ring-[3px] ring-primary/80 ring-offset-4 ring-offset-[rgba(10,16,14,0.9)]",
                "shadow-[0_0_32px_rgba(62,207,142,0.45)]",
                "transition-opacity duration-500 group-hover:opacity-0",
              )}
            >
              {member.photo ? (
                <RemoteImage
                  src={member.photo}
                  alt={member.name}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              ) : (
                <span className="flex size-full items-center justify-center bg-primary/10 text-3xl font-semibold text-primary">
                  {member.name.charAt(0)}
                </span>
              )}
            </div>
          </div>

          <h3 className="text-xl font-semibold tracking-tight text-white">{member.name}</h3>
          <p className="mt-1.5 text-sm font-medium lowercase tracking-wide text-primary">
            {member.role}
          </p>
          <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-white/65">{bio}</p>
        </div>

        <div
          className={cn(
            "absolute inset-x-0 bottom-5 z-20 flex justify-center",
            "pointer-events-none translate-y-2 opacity-0 transition-all duration-500",
            "group-hover:translate-y-0 group-hover:opacity-100",
          )}
        >
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary px-6 py-2.5",
              "text-sm font-semibold text-primary-foreground shadow-[0_12px_40px_-8px_rgba(62,207,142,0.55)]",
            )}
          >
            View profile
            <ArrowUpRight className="size-4" aria-hidden />
          </span>
        </div>
      </Link>

      <TeamSocialBar member={member} variant="bar" className="relative z-10 shrink-0 w-full" />
    </motion.article>
  );
}

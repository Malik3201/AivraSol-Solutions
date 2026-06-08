"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, type MouseEvent } from "react";
import { RemoteImage } from "@/components/site/RemoteImage";
import { TeamSocialBar } from "@/components/team/TeamSocialBar";
import type { PublicTeamMember } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const MOBILE_MQ = "(max-width: 767px)";

/** Shared classes: desktop hover + mobile tap-expanded */
const revealBg =
  "opacity-0 transition-opacity duration-500 group-hover:opacity-100 max-md:group-data-[expanded]:opacity-100";
const hideOnReveal =
  "transition-opacity duration-500 group-hover:opacity-0 max-md:group-data-[expanded]:opacity-0";
const showCta =
  "translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 max-md:group-data-[expanded]:translate-y-0 max-md:group-data-[expanded]:opacity-100";

export function TeamMemberCard({
  member,
  className,
}: {
  member: PublicTeamMember;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const bio =
    member.bio?.trim() ||
    `${member.name} helps deliver premium digital systems with clarity, craft, and measurable outcomes.`;

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    const update = () => {
      setIsMobile(mq.matches);
      if (!mq.matches) setExpanded(false);
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const handleProfileClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (isMobile && !expanded) {
      e.preventDefault();
      setExpanded(true);
    }
  };

  return (
    <motion.article
      data-expanded={expanded ? "" : undefined}
      whileHover={reduce || isMobile ? undefined : { y: -6 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      className={cn(
        "group flex h-[min(440px,78vh)] flex-col overflow-hidden rounded-2xl",
        "border border-white/[0.09] bg-[rgba(10,16,14,0.55)] backdrop-blur-xl",
        "shadow-[0_24px_60px_-28px_rgba(0,0,0,0.85)]",
        "transition-[border-color,box-shadow] duration-500",
        "hover:border-primary/35 hover:shadow-[0_32px_80px_-24px_rgba(62,207,142,0.28)]",
        "max-md:group-data-[expanded]:border-primary/35 max-md:group-data-[expanded]:shadow-[0_32px_80px_-24px_rgba(62,207,142,0.28)]",
        className,
      )}
    >
      <Link
        href={`/team/${member.slug}`}
        onClick={handleProfileClick}
        className={cn(
          "relative flex min-h-0 flex-1 flex-col overflow-hidden",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary",
        )}
        aria-label={`View profile for ${member.name}`}
        aria-expanded={isMobile ? expanded : undefined}
      >
        {member.photo ? (
          <div className={cn("pointer-events-none absolute inset-0 z-0", revealBg)} aria-hidden>
            <RemoteImage
              src={member.photo}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105 max-md:group-data-[expanded]:scale-105"
            />
            <div className="absolute inset-0 bg-[#060a08]/20" />
          </div>
        ) : null}

        <div
          className={cn(
            "pointer-events-none absolute -top-16 left-1/2 z-0 size-40 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl opacity-60 transition-opacity duration-500",
            hideOnReveal,
          )}
          aria-hidden
        />

        <div
          className={cn(
            "relative z-10 flex flex-1 flex-col items-center px-6 pb-6 pt-10 text-center",
            hideOnReveal,
            "group-hover:pointer-events-none max-md:group-data-[expanded]:pointer-events-none",
          )}
        >
          <div className={cn("relative mb-6", hideOnReveal)}>
            <div
              className={cn(
                "absolute -inset-2 rounded-full bg-primary/25 blur-md transition-opacity duration-500",
                hideOnReveal,
              )}
              aria-hidden
            />
            <div
              className={cn(
                "relative size-[7.5rem] overflow-hidden rounded-full",
                "ring-[3px] ring-primary/80 ring-offset-4 ring-offset-[rgba(10,16,14,0.9)]",
                "shadow-[0_0_32px_rgba(62,207,142,0.45)]",
                hideOnReveal,
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
            "pointer-events-none",
            showCta,
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

"use client";

import type { MouseEvent } from "react";
import {
  GithubIcon,
  GlobeIcon,
  LinkedinIcon,
  TwitterIcon,
} from "@/components/team/TeamSocialIcons";
import type { PublicTeamMember } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const LINKS = [
  { key: "linkedin" as const, icon: LinkedinIcon, label: "LinkedIn" },
  { key: "github" as const, icon: GithubIcon, label: "GitHub" },
  { key: "twitter" as const, icon: TwitterIcon, label: "Twitter" },
  { key: "website" as const, icon: GlobeIcon, label: "Website" },
];

export function TeamSocialBar({
  member,
  variant = "bar",
  className,
  onLinkClick,
}: {
  member: PublicTeamMember;
  variant?: "bar" | "inline";
  className?: string;
  onLinkClick?: (e: MouseEvent) => void;
}) {
  const items = LINKS.filter((l) => member[l.key]?.trim());

  if (!items.length) return null;

  if (variant === "inline") {
    return (
      <div className={cn("flex flex-wrap gap-2", className)}>
        {items.map(({ key, icon: Icon, label }) => (
          <a
            key={key}
            href={member[key]!}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} on ${label}`}
            onClick={onLinkClick}
            className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white/80 transition-colors hover:border-primary/40 hover:bg-primary/15 hover:text-primary"
          >
            <Icon className="size-4" aria-hidden />
          </a>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4 rounded-b-2xl bg-gradient-to-r from-primary via-primary to-aivra-accent px-4 py-3.5",
        className,
      )}
    >
      {items.map(({ key, icon: Icon, label }) => (
        <a
          key={key}
          href={member[key]!}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${member.name} on ${label}`}
          onClick={onLinkClick}
          className="text-primary-foreground/95 transition-transform hover:scale-110"
        >
          <Icon className="size-[18px]" strokeWidth={1.75} aria-hidden />
        </a>
      ))}
    </div>
  );
}

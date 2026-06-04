"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { PublicTeamMember } from "@/lib/api/types";
import { cn } from "@/lib/utils";

function buildTimeline(member: PublicTeamMember) {
  const role = member.role;
  return [
    {
      year: "Present",
      title: role,
      detail: `Leading delivery and craft at AIVRASOL — ${member.name.split(" ")[0]} partners with teams to ship intelligent digital systems.`,
    },
    {
      year: "Growth",
      title: "Product & platform focus",
      detail:
        "Scaled premium web platforms, automation layers, and AI-enabled workflows across multiple industries.",
    },
    {
      year: "Foundation",
      title: "Strategy to execution",
      detail:
        "Built expertise across discovery, UX, full-stack engineering, and measurable launch outcomes.",
    },
  ];
}

export function TeamProfileTimeline({
  member,
  className,
}: {
  member: PublicTeamMember;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const items = buildTimeline(member);

  return (
    <div ref={ref} className={cn("relative space-y-0", className)}>
      <div
        className="absolute bottom-0 left-[7px] top-2 w-px bg-gradient-to-b from-primary/60 via-primary/20 to-transparent"
        aria-hidden
      />
      {items.map((item, i) => (
        <motion.div
          key={item.year}
          initial={{ opacity: 0, x: -12 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: i * 0.1, duration: 0.45 }}
          className="relative flex gap-6 pb-8 last:pb-0"
        >
          <span
            className="relative z-10 mt-1.5 size-3.5 shrink-0 rounded-full border-2 border-primary bg-[#060a08] shadow-[0_0_12px_rgba(62,207,142,0.6)]"
            aria-hidden
          />
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-primary">
              {item.year}
            </p>
            <h4 className="mt-1 text-base font-semibold text-white">{item.title}</h4>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {item.detail}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

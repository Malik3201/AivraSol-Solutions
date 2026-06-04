"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

function barWidth(skill: string, index: number): number {
  const base = 72 + ((skill.length * 7 + index * 13) % 24);
  return Math.min(96, base);
}

export function TeamSkillBars({
  skills,
  className,
}: {
  skills: string[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const list = skills.length ? skills : ["Strategy", "UX", "Engineering", "AI systems"];

  return (
    <div ref={ref} className={cn("space-y-4", className)}>
      {list.map((skill, i) => (
        <div key={skill}>
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-white/90">{skill}</span>
            <span className="text-primary">{barWidth(skill, i)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/[0.08]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light"
              initial={{ width: 0 }}
              animate={
                inView ? { width: `${barWidth(skill, i)}%` } : { width: 0 }
              }
              transition={{
                duration: reduce ? 0 : 0.9,
                delay: reduce ? 0 : i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

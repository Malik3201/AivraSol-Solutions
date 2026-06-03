"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const FLOAT_CARDS = [
  { label: "Workflow map", x: "8%", y: "18%", delay: 0 },
  { label: "AI assist layer", x: "58%", y: "12%", delay: 0.15 },
  { label: "Launch metrics", x: "72%", y: "58%", delay: 0.3 },
  { label: "Platform core", x: "22%", y: "62%", delay: 0.45 },
];

export function SectionVisualStage({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <div
      className={cn(
        "relative aspect-[4/5] w-full max-w-[520px] lg:aspect-square lg:max-w-none",
        className,
      )}
    >
      <div className="absolute inset-[8%] rounded-full bg-primary/20 blur-[80px]" />
      <motion.div
        className="absolute left-1/2 top-1/2 size-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/30 bg-gradient-to-br from-primary/25 via-primary/5 to-transparent shadow-[0_0_80px_rgba(62,207,142,0.35)]"
        animate={reduce ? undefined : { scale: [1, 1.04, 1], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 size-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
        style={{
          background:
            "conic-gradient(from 0deg, transparent, rgba(62,207,142,0.15), transparent, rgba(62,207,142,0.08), transparent)",
        }}
      />
      <div
        className="absolute left-1/2 top-[18%] h-[45%] w-px -translate-x-1/2 bg-gradient-to-b from-primary/60 via-primary/20 to-transparent"
        aria-hidden
      />
      {!reduce &&
        FLOAT_CARDS.map((card) => (
          <motion.div
            key={card.label}
            className="absolute rounded-xl border border-white/10 bg-[rgba(10,16,14,0.85)] px-3 py-2 text-[10px] font-medium uppercase tracking-wider text-foreground/80 backdrop-blur-md shadow-lg"
            style={{ left: card.x, top: card.y }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: [0, -6, 0] }}
            transition={{
              opacity: { delay: card.delay + 0.3, duration: 0.5 },
              y: { delay: card.delay, duration: 4 + card.delay, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <span className="mb-1 block size-1 rounded-full bg-primary" />
            {card.label}
          </motion.div>
        ))}
      <div className="absolute inset-x-[12%] bottom-[10%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
    </div>
  );
}

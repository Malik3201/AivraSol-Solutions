"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { AIVA_ROBOT_IMAGE } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const CARDS = [
  { label: "Strategy Layer", className: "left-[4%] top-[14%]" },
  { label: "Aiva Assistant", className: "right-[2%] top-[22%]" },
  { label: "Platform Core", className: "left-[18%] bottom-[16%]" },
];

export function HeroRobotStage({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <div
      className={cn(
        "relative mx-auto flex w-full max-w-[420px] items-center justify-center lg:max-w-none",
        className,
      )}
    >
      <div
        data-aiva-hero-origin
        className="pointer-events-none absolute left-1/2 top-[52%] z-20 size-2 -translate-x-1/2 -translate-y-1/2"
        aria-hidden
      />

      <div
        data-aiva-hero-visual
        className="relative flex w-full items-center justify-center transition-opacity duration-300"
      >
        <div className="absolute left-1/2 top-1/2 size-[min(100%,420px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25 blur-[100px]" />
        <motion.div
          className="absolute left-1/2 top-1/2 size-[72%] max-w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/20"
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 56, repeat: Infinity, ease: "linear" }}
          style={{
            background:
              "conic-gradient(from 90deg, transparent, rgba(62,207,142,0.12), transparent)",
          }}
          aria-hidden
        />
        <motion.div
          animate={reduce ? undefined : { y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src={AIVA_ROBOT_IMAGE}
            alt="Aiva — AIVRASOL assistant"
            width={400}
            height={400}
            priority
            className="relative z-10 w-[260px] drop-shadow-[0_32px_72px_rgba(62,207,142,0.42)] sm:w-[300px] lg:w-[340px] xl:w-[400px]"
          />
        </motion.div>

        {!reduce &&
          CARDS.map((card, i) => (
            <motion.div
              key={card.label}
              className={cn(
                "absolute z-10 rounded-xl border border-white/10 bg-[rgba(8,14,12,0.9)] px-3 py-2 text-[10px] font-medium uppercase tracking-wider text-foreground/85 shadow-lg backdrop-blur-md",
                card.className,
              )}
              animate={{ y: [0, -5, 0] }}
              transition={{
                duration: 3.5 + i * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            >
              <span className="mb-1 block size-1 rounded-full bg-primary" />
              {card.label}
            </motion.div>
          ))}
      </div>
    </div>
  );
}

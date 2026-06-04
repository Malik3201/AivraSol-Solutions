"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PremiumCard({
  children,
  className,
  href,
}: {
  children: ReactNode;
  className?: string;
  href?: string;
}) {
  const reduce = useReducedMotion();

  const classes = cn(
    "group relative block overflow-hidden rounded-3xl border border-white/[0.08] bg-[rgba(10,16,14,0.65)] p-6 backdrop-blur-xl transition-colors md:p-8",
    "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]",
    "before:pointer-events-none before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-primary/[0.08] before:via-transparent before:to-transparent before:opacity-0 before:transition-opacity hover:border-primary/20 hover:before:opacity-100",
    className,
  );

  const inner = (
    <>
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative z-10">{children}</div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {inner}
      </Link>
    );
  }

  return (
    <motion.div
      className={classes}
      {...(reduce
        ? {}
        : {
            whileHover: { y: -4 },
            transition: { duration: 0.25 },
          })}
    >
      {inner}
    </motion.div>
  );
}

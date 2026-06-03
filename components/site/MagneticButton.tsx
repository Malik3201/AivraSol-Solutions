"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export function MagneticButton({
  href,
  children,
  variant = "default",
  size = "default",
  className,
  onClick,
}: {
  href?: string;
  children: ReactNode;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
  onClick?: () => void;
}) {
  const reduce = useReducedMotion();
  const classes = cn(
    buttonVariants({ variant, size }),
    "relative inline-flex overflow-hidden",
    className,
  );

  const inner = (
    <>
      <span className="relative z-10">{children}</span>
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/0 via-white/10 to-primary/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </>
  );

  const motionProps = reduce
    ? {}
    : {
        whileHover: { scale: 1.02, y: -1 },
        whileTap: { scale: 0.98 },
        transition: { type: "spring" as const, stiffness: 400, damping: 25 },
      };

  if (href) {
    return (
      <motion.div className="group inline-block" {...motionProps}>
        <Link href={href} className={classes}>
          {inner}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button type="button" onClick={onClick} className={cn("group", classes)} {...motionProps}>
      {inner}
    </motion.button>
  );
}

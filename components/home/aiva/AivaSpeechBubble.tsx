"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export type BubblePlacement = "above" | "below" | "left" | "right";

export function AivaSpeechBubble({
  message,
  visible = true,
  className,
  placement = "left",
}: {
  message: string;
  visible?: boolean;
  className?: string;
  placement?: BubblePlacement;
}) {
  const position =
    placement === "below"
      ? "top-full left-1/2 mt-3 -translate-x-1/2"
      : placement === "above"
        ? "bottom-full left-1/2 mb-3 -translate-x-1/2"
        : placement === "left"
          ? "right-full top-1/2 mr-3 -translate-y-1/2"
          : "left-full top-1/2 ml-3 -translate-y-1/2";

  return (
    <AnimatePresence mode="wait">
      {visible && message ? (
        <motion.div
          key={message}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "absolute z-20 w-max max-w-[280px]",
              position,
              className,
            )}
          >
          <div className="rounded-2xl border border-primary/20 bg-[rgba(8,14,12,0.96)] px-4 py-3.5 shadow-[0_16px_48px_-12px_var(--aivra-glow)] backdrop-blur-xl">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-primary">
              Aiva
            </p>
            <p className="text-sm leading-relaxed text-foreground/95">{message}</p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

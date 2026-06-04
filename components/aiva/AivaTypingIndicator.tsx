"use client";

import { motion } from "framer-motion";

export function AivaTypingIndicator() {
  return (
    <div
      className="flex items-center gap-1.5 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3"
      role="status"
      aria-label="Aiva is typing"
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-1.5 rounded-full bg-primary"
          animate={{ opacity: [0.35, 1, 0.35], y: [0, -3, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

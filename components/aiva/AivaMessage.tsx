"use client";

import { motion } from "framer-motion";
import type { AivaChatMessage } from "@/lib/api/types";
import { cn } from "@/lib/utils";

export function AivaMessage({ message }: { message: AivaChatMessage }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className={cn("flex", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
          isUser
            ? "border border-primary/25 bg-primary/15 text-foreground"
            : "border border-white/[0.08] bg-[rgba(12,18,16,0.9)] text-muted-foreground",
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </motion.div>
  );
}

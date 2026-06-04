"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { RotateCcw, X } from "lucide-react";
import { AivaMessage } from "@/components/aiva/AivaMessage";
import { AivaSuggestedActions } from "@/components/aiva/AivaSuggestedActions";
import { AivaTypingIndicator } from "@/components/aiva/AivaTypingIndicator";
import { buttonVariants } from "@/components/ui/button";
import type { AivaChatMessage } from "@/lib/api/types";
import { AIVA_ROBOT_IMAGE } from "@/lib/site-config";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
  messages: AivaChatMessage[];
  suggestions: string[];
  recommendedServiceSlug: string | null;
  leadIntent: "low" | "medium" | "high";
  loading: boolean;
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onReset: () => void;
  onSuggestionSelect: (text: string) => void;
};

export function AivaChatWindow({
  open,
  onClose,
  messages,
  suggestions,
  recommendedServiceSlug,
  leadIntent,
  loading,
  input,
  onInputChange,
  onSend,
  onReset,
  onSuggestionSelect,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const showLeadCta = leadIntent === "high" || leadIntent === "medium";

  useEffect(() => {
    if (!open || !scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading, open]);

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[88] bg-black/50 backdrop-blur-[2px] md:bg-black/35"
        aria-label="Close chat overlay"
        onClick={onClose}
      />
      <div
        id="aiva-chat-window"
        role="dialog"
        aria-modal="true"
        aria-labelledby="aiva-chat-title"
        className={cn(
          "fixed z-[89] flex flex-col overflow-hidden border border-white/[0.1] bg-[rgba(6,10,8,0.96)] shadow-[0_24px_80px_-24px_rgba(0,0,0,0.8)] backdrop-blur-xl",
          "inset-x-0 bottom-0 max-h-[min(88vh,640px)] rounded-t-3xl md:inset-x-auto md:bottom-24 md:right-6 md:w-[min(100vw-2rem,400px)] md:rounded-3xl",
        )}
        style={{
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 24px 60px -20px rgba(62,207,142,0.2)",
        }}
      >
        <header className="flex items-center gap-3 border-b border-white/[0.08] px-4 py-3">
          <div className="relative size-9 shrink-0 overflow-hidden rounded-xl border border-primary/25 bg-primary/10">
            <Image src={AIVA_ROBOT_IMAGE} alt="" fill className="object-contain p-1" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 id="aiva-chat-title" className="truncate text-sm font-semibold text-white">
              Aiva
            </h2>
            <p className="truncate text-xs text-muted-foreground">AIVRASOL assistant</p>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="rounded-lg p-2 text-muted-foreground hover:bg-white/5 hover:text-foreground"
            aria-label="Start new chat"
          >
            <RotateCcw className="size-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground hover:bg-white/5 hover:text-foreground"
            aria-label="Close chat"
          >
            <X className="size-4" />
          </button>
        </header>

        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.map((m) => (
            <AivaMessage key={m.id} message={m} />
          ))}
          {loading ? <AivaTypingIndicator /> : null}
        </div>

        <div className="space-y-3 border-t border-white/[0.08] px-4 py-3">
          {showLeadCta ? (
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ size: "sm" }),
                "w-full border-primary/30 bg-primary/15 hover:bg-primary/25",
              )}
            >
              Start a project with AIVRASOL
            </Link>
          ) : null}

          <AivaSuggestedActions
            actions={suggestions}
            onSelect={onSuggestionSelect}
            recommendedServiceSlug={recommendedServiceSlug}
            disabled={loading}
          />

          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              onSend();
            }}
          >
            <label htmlFor="aiva-chat-input" className="sr-only">
              Message Aiva
            </label>
            <input
              id="aiva-chat-input"
              type="text"
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder="Ask about services, projects, or your idea…"
              disabled={loading}
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[rgba(10,16,14,0.85)] px-3 py-2.5 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/25 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className={cn(buttonVariants({ size: "sm" }), "shrink-0 px-4")}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useState } from "react";
import { AivaDock } from "@/components/home/AivaDock";
import { AivaGuide } from "@/components/home/aiva/AivaGuide";
import { AivaWaypoint } from "@/components/home/aiva/AivaWaypoint";
import { FloatingPanel } from "@/components/home/FloatingPanel";
import { HomeSection } from "@/components/home/HomeSection";
import { AIVA_WAYPOINT_MESSAGES } from "@/lib/aiva-waypoints";
import type { PublicTestimonial } from "@/lib/api/types";

export function TestimonialsSection({
  testimonials,
}: {
  testimonials: PublicTestimonial[];
}) {
  const items = testimonials.slice(0, 5);
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  const next = useCallback(() => setIndex((i) => (i + 1) % items.length), [items.length]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + items.length) % items.length), [items.length]);

  if (!items.length) return null;
  const current = items[index];

  return (
    <AivaWaypoint id="testimonials">
      <HomeSection
        id="testimonials"
        background="calm"
        eyebrow="Clients"
        title="Proof in the language of outcomes."
        description="Clarity, confidence, and systems teams rely on."
      >
        <AivaGuide message={AIVA_WAYPOINT_MESSAGES.testimonials} className="mb-8" />
        <div className="relative">
          <AivaDock id="testimonials" className="right-2 top-[38%] md:right-4" />
          <FloatingPanel className="flex min-h-[260px] flex-col justify-center p-8 md:min-h-[280px] md:p-10 md:pr-16">
            {reduce ? (
              <blockquote>
                <p className="text-xl leading-relaxed md:text-2xl">&ldquo;{current.quote}&rdquo;</p>
                <footer className="mt-8 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{current.clientName}</span>
                  {" — "}
                  {[current.clientRole, current.company].filter(Boolean).join(", ")}
                </footer>
              </blockquote>
            ) : (
              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={current.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                >
                  <p className="text-xl leading-relaxed md:text-2xl">&ldquo;{current.quote}&rdquo;</p>
                  <footer className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] pt-6">
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{current.clientName}</span>
                      <br />
                      {[current.clientRole, current.company].filter(Boolean).join(" · ")}
                    </div>
                    {items.length > 1 ? (
                      <div className="flex gap-2">
                        <button type="button" onClick={prev} className="rounded-full border border-white/10 px-3 py-1 text-xs">
                          Prev
                        </button>
                        <button type="button" onClick={next} className="rounded-full border border-white/10 px-3 py-1 text-xs">
                          Next
                        </button>
                      </div>
                    ) : null}
                  </footer>
                </motion.blockquote>
              </AnimatePresence>
            )}
          </FloatingPanel>
        </div>
      </HomeSection>
    </AivaWaypoint>
  );
}

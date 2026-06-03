"use client";

import { useState } from "react";
import { AivaDock } from "@/components/home/AivaDock";
import { AivaGuide } from "@/components/home/aiva/AivaGuide";
import { AivaWaypoint } from "@/components/home/aiva/AivaWaypoint";
import { FloatingPanel } from "@/components/home/FloatingPanel";
import { HomeSection } from "@/components/home/HomeSection";
import { AIVA_WAYPOINT_MESSAGES } from "@/lib/aiva-waypoints";
import type { PublicFAQ } from "@/lib/api/types";
import { cn } from "@/lib/utils";

function FAQItem({
  faq,
  open,
  onToggle,
}: {
  faq: PublicFAQ;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-white/[0.06] last:border-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <span className="text-base font-medium md:text-lg">{faq.question}</span>
        <span className={cn("shrink-0 text-lg text-primary transition-transform", open && "rotate-45")}>
          +
        </span>
      </button>
      <div className={cn("grid transition-[grid-template-rows] duration-300", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <div className="overflow-hidden">
          <p className="pb-5 text-sm text-muted-foreground md:text-base">{faq.answer}</p>
        </div>
      </div>
    </div>
  );
}

export function FAQPreview({ faqs }: { faqs: PublicFAQ[] }) {
  const items = faqs.slice(0, 5);
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <AivaWaypoint id="faq">
      <HomeSection
        id="faq"
        background="minimal"
        containerClassName="max-w-[900px]"
        eyebrow="FAQ"
        title="Straight answers before we scope your build."
      >
        <AivaGuide message={AIVA_WAYPOINT_MESSAGES.faq} className="mb-8" />
        <div className="relative">
          <FloatingPanel className="relative px-6 md:px-8">
            <AivaDock id="faq" className="right-6 top-6 md:right-8" />
            {items.map((faq) => (
              <FAQItem
                key={faq.id}
                faq={faq}
                open={openId === faq.id}
                onToggle={() => setOpenId((id) => (id === faq.id ? null : faq.id))}
              />
            ))}
          </FloatingPanel>
        </div>
      </HomeSection>
    </AivaWaypoint>
  );
}

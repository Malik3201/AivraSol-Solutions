import Link from "next/link";
import { FadeIn } from "@/components/animations/FadeIn";
import { AivaDock } from "@/components/home/AivaDock";
import { AivaGuide } from "@/components/home/aiva/AivaGuide";
import { AivaWaypoint } from "@/components/home/aiva/AivaWaypoint";
import { FloatingPanel } from "@/components/home/FloatingPanel";
import { HomeSection } from "@/components/home/HomeSection";
import { HOME_BODY } from "@/components/home/home-layout";
import { AIVA_WAYPOINT_MESSAGES } from "@/lib/aiva-waypoints";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function IntroSection() {
  return (
    <AivaWaypoint id="intro">
      <HomeSection
        id="intro"
        background="editorial"
        eyebrow="Studio approach"
        title="Digital products should feel clear, intelligent, and built around the business."
        description="We align product direction, UX, engineering, and applied intelligence so every release supports how your team sells, operates, and scales."
      >
        <AivaGuide message={AIVA_WAYPOINT_MESSAGES.intro} className="mb-8" />
        <Link href="/about" className={cn(buttonVariants({ variant: "outline" }), "mb-8 inline-flex")}>
          How we work
        </Link>
        <FadeIn>
          <FloatingPanel glow className="relative p-8 md:p-10">
              <AivaDock id="intro" className="right-10 top-[50%]" />
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-primary">
                Strategy console
              </p>
              <ul className="mt-8 space-y-5">
                {[
                  { k: "Discovery", v: "Business model, users, constraints, success metrics" },
                  { k: "Architecture", v: "Platform shape, integrations, data flow" },
                  { k: "Experience", v: "Premium UI, narrative, conversion paths" },
                  { k: "Intelligence", v: "Assistants, automation, measurable outcomes" },
                ].map((row) => (
                  <li
                    key={row.k}
                    className="flex flex-col gap-1 border-b border-white/[0.06] pb-5 last:border-0 sm:flex-row sm:gap-8"
                  >
                    <span className="w-28 shrink-0 text-sm font-medium">{row.k}</span>
                    <span className={cn(HOME_BODY, "text-sm")}>{row.v}</span>
                  </li>
                ))}
              </ul>
          </FloatingPanel>
        </FadeIn>
      </HomeSection>
    </AivaWaypoint>
  );
}

import Link from "next/link";
import { FadeIn } from "@/components/animations/FadeIn";
import { AivaDock } from "@/components/home/AivaDock";
import { AivaGuide } from "@/components/home/aiva/AivaGuide";
import { AivaWaypoint } from "@/components/home/aiva/AivaWaypoint";
import { HomeSection } from "@/components/home/HomeSection";
import { AIVA_WAYPOINT_MESSAGES } from "@/lib/aiva-waypoints";
import { MagneticButton } from "@/components/site/MagneticButton";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FinalCTA() {
  return (
    <AivaWaypoint id="final">
      <HomeSection
        id="final-cta"
        background="cta"
        className="border-b-0"
        containerClassName="max-w-[900px]"
        eyebrow="Start here"
        title="Ready to build something intelligent?"
        description="Let's shape your website, automation, or AI product into a system your business can actually grow with."
      >
        <AivaGuide message={AIVA_WAYPOINT_MESSAGES.final} className="mb-8" />
        <FadeIn>
          <div className="relative overflow-hidden rounded-[2rem] border border-primary/25 bg-[rgba(10,20,14,0.85)] px-8 py-12 text-center md:px-12 md:py-14">
            <AivaDock id="final" className="right-[10%] top-[38%] hidden md:block" />
            <div className="relative z-10 flex flex-wrap justify-center gap-4">
              <MagneticButton href="/contact" size="lg">
                Start a Project
              </MagneticButton>
              <Link
                href="/contact?aiva=1"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                Talk to Aiva
              </Link>
            </div>
          </div>
        </FadeIn>
      </HomeSection>
    </AivaWaypoint>
  );
}

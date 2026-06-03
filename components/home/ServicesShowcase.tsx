import Link from "next/link";
import { BentoShowcase } from "@/components/home/BentoShowcase";
import { AivaDock } from "@/components/home/AivaDock";
import { AivaGuide } from "@/components/home/aiva/AivaGuide";
import { AivaWaypoint } from "@/components/home/aiva/AivaWaypoint";
import { HomeSection } from "@/components/home/HomeSection";
import { AIVA_WAYPOINT_MESSAGES } from "@/lib/aiva-waypoints";
import type { PublicService } from "@/lib/api/types";
import { buttonVariants } from "@/components/ui/button";
export function ServicesShowcase({ services }: { services: PublicService[] }) {
  return (
    <AivaWaypoint id="services">
      <HomeSection
        id="services"
        background="bento"
        eyebrow="Services"
        title="Capabilities engineered for serious growth."
        description="Strategy-led delivery across platforms, automation, and intelligent product layers."
      >
        <AivaGuide message={AIVA_WAYPOINT_MESSAGES.services} className="mb-8" />
        <div className="mb-8 flex justify-end">
          <Link href="/services" className={buttonVariants({ variant: "outline" })}>
            View all services
          </Link>
        </div>
        <div className="relative">
          <AivaDock id="services" className="bottom-8 right-[12%] top-auto" />
          <BentoShowcase services={services} />
        </div>
      </HomeSection>
    </AivaWaypoint>
  );
}

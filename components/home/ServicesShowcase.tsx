import Link from "next/link";
import { BentoShowcase } from "@/components/home/BentoShowcase";
import { AivaDock } from "@/components/home/AivaDock";
import { AivaGuide } from "@/components/home/aiva/AivaGuide";
import { AivaWaypoint } from "@/components/home/aiva/AivaWaypoint";
import { HomeSection } from "@/components/home/HomeSection";
import { AIVA_WAYPOINT_MESSAGES } from "@/lib/aiva-waypoints";
import type { PublicService } from "@/lib/api/types";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FeaturedServicesSection({
  services,
}: {
  services: PublicService[];
}) {
  if (!services.length) return null;

  return (
    <AivaWaypoint id="services">
      <HomeSection
        id="featured-services"
        background="bento"
        eyebrow="Featured Services"
        title="Capabilities engineered for serious growth."
        description="Strategy-led delivery across platforms, automation, and intelligent product layers — swipe on mobile to explore."
      >
        <AivaGuide message={AIVA_WAYPOINT_MESSAGES.services} className="mb-6 md:mb-8" />
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground md:hidden">
            Swipe to browse featured services
          </p>
          <Link
            href="/services"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-full sm:ml-auto sm:w-auto",
            )}
          >
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

/** @deprecated Use FeaturedServicesSection */
export const ServicesShowcase = FeaturedServicesSection;

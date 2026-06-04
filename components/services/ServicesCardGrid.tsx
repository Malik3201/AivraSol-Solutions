"use client";

import { ServiceCard } from "@/components/services/ServiceCard";
import { ResponsiveCardGrid } from "@/components/site/ResponsiveCardGrid";
import type { PublicService } from "@/lib/api/types";

type Props = {
  services: PublicService[];
  featuredId?: string;
  /** Home uses single-row carousel; listing pages use responsive grid */
  variant?: "listing" | "featured";
  ariaLabel?: string;
};

export function ServicesCardGrid({
  services,
  featuredId,
  variant = "listing",
  ariaLabel = "Services",
}: Props) {
  const isHome = variant === "featured";

  return (
    <ResponsiveCardGrid
      items={services}
      keyExtractor={(s) => s.id}
      ariaLabel={ariaLabel}
      layout={isHome ? "single-row" : "grid"}
      autoPlay={isHome}
      gridClassName={
        isHome
          ? undefined
          : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
      }
      renderItem={(service, index) => (
        <ServiceCard
          service={service}
          index={index}
          featured={
            featuredId ? service.id === featuredId : index === 0
          }
        />
      )}
    />
  );
}

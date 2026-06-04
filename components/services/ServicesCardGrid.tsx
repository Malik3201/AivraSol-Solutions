"use client";

import { ServiceCard } from "@/components/services/ServiceCard";
import { ResponsiveCardGrid } from "@/components/site/ResponsiveCardGrid";
import type { PublicService } from "@/lib/api/types";

type Props = {
  services: PublicService[];
  featuredId?: string;
  /** Home bento uses 4 columns on xl */
  variant?: "listing" | "featured";
  ariaLabel?: string;
};

export function ServicesCardGrid({
  services,
  featuredId,
  variant = "listing",
  ariaLabel = "Services",
}: Props) {
  const gridClassName =
    variant === "featured"
      ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
      : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3";

  return (
    <ResponsiveCardGrid
      items={services}
      keyExtractor={(s) => s.id}
      ariaLabel={ariaLabel}
      gridClassName={gridClassName}
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

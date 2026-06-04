"use client";

import { PremiumCard } from "@/components/site/PremiumCard";
import { ResponsiveCardGrid } from "@/components/site/ResponsiveCardGrid";

export function ServiceShapeGrid({ items }: { items: string[] }) {
  return (
    <ResponsiveCardGrid
      items={items}
      keyExtractor={(item) => item}
      ariaLabel="How we shape services"
      gridClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      slideClassName="w-[min(84vw,320px)]"
      renderItem={(item) => (
        <PremiumCard className="h-full">
          <p className="text-sm text-foreground/90">{item}</p>
        </PremiumCard>
      )}
    />
  );
}

import { ServicesCardGrid } from "@/components/services/ServicesCardGrid";
import type { PublicService } from "@/lib/api/types";

export function BentoShowcase({ services }: { services: PublicService[] }) {
  const list = services.slice(0, 4);
  if (!list.length) return null;

  const featuredId = list.find((s) => s.isFeatured)?.id ?? list[0]?.id;

  return (
    <ServicesCardGrid
      services={list}
      featuredId={featuredId}
      variant="featured"
      ariaLabel="Featured services"
    />
  );
}

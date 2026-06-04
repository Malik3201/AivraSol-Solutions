import { ServicesCardGrid } from "@/components/services/ServicesCardGrid";
import type { PublicService } from "@/lib/api/types";

export function BentoShowcase({ services }: { services: PublicService[] }) {
  if (!services.length) return null;

  const featuredId =
    services.find((s) => s.isFeatured)?.id ?? services[0]?.id;

  return (
    <ServicesCardGrid
      services={services}
      featuredId={featuredId}
      variant="featured"
      ariaLabel="Featured services"
    />
  );
}

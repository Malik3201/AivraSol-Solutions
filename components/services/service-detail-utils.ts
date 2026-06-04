import type { PublicService } from "@/lib/api/types";

export function getServiceHeroLead(service: PublicService): string {
  return (
    service.shortDescription?.trim() ||
    "Strategy-led delivery with premium UX, scalable engineering, and applied AI where it creates measurable leverage."
  );
}

export function getServiceOverviewBody(service: PublicService): string {
  const description = service.description?.trim() ?? "";
  const short = service.shortDescription?.trim() ?? "";
  if (description && description !== short) return description;
  if (description) return description;
  if (short) return short;
  return "AIVRASOL partners with ambitious teams to design, build, and scale digital products with clarity, craft, and long-term maintainability.";
}

export function getServiceHighlightFeatures(service: PublicService): string[] {
  const fromFeatures = service.features?.filter(Boolean).slice(0, 4) ?? [];
  if (fromFeatures.length > 0) return fromFeatures;
  return service.technologies?.filter(Boolean).slice(0, 4) ?? [];
}

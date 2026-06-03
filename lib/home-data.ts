import { getHomeData } from "@/lib/api/public";
import type { HomePageData } from "@/lib/api/types";
import {
  FALLBACK_FAQS,
  FALLBACK_HOME_DATA,
  FALLBACK_PROJECTS,
  FALLBACK_SERVICES,
  FALLBACK_TEAM,
  FALLBACK_TESTIMONIALS,
} from "@/lib/home-fallback";

export type HomePageContent = HomePageData;

export async function getHomePageContent(): Promise<HomePageContent> {
  try {
    const data = await getHomeData();
    return {
      ...FALLBACK_HOME_DATA,
      ...data,
      featuredServices:
        data.featuredServices?.length > 0
          ? data.featuredServices
          : FALLBACK_SERVICES,
      featuredProjects:
        data.featuredProjects?.length > 0
          ? data.featuredProjects
          : FALLBACK_PROJECTS,
      featuredTestimonials:
        data.featuredTestimonials?.length > 0
          ? data.featuredTestimonials
          : FALLBACK_TESTIMONIALS,
      teamPreview:
        data.teamPreview?.length > 0 ? data.teamPreview : FALLBACK_TEAM,
      faqPreview: data.faqPreview?.length > 0 ? data.faqPreview : FALLBACK_FAQS,
    };
  } catch {
    return FALLBACK_HOME_DATA;
  }
}

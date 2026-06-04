import type { HomePageData } from "@/lib/api/types";
import { getHomepageData } from "@/lib/services/public-content";
import { buildSeoObject } from "@/lib/services/seo";

export type HomePageContent = HomePageData;

const EMPTY_HOME: HomePageData = {
  hero: null,
  featuredServices: [],
  featuredProjects: [],
  featuredTestimonials: [],
  teamPreview: [],
  faqPreview: [],
  robotGuideSettings: null,
  seo: buildSeoObject({
    title: "AIVRASOL",
    description:
      "Premium AI and digital services for ambitious brands building the future.",
    path: "/",
  }),
  stats: null,
  settings: {},
};

/** Server-only: reads MongoDB directly (no HTTP). Never injects demo services/projects. */
export async function getHomePageContent(): Promise<HomePageContent> {
  try {
    return await getHomepageData();
  } catch (error) {
    console.error("[home] failed to load homepage data from database", error);
    return EMPTY_HOME;
  }
}

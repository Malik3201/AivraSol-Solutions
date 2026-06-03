import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/services/seo";

const staticRoutes = [
  "",
  "/about",
  "/services",
  "/projects",
  "/team",
  "/blog",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();

  return staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}

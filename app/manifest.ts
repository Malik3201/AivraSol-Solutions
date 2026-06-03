import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/services/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AIVRASOL",
    short_name: "AIVRASOL",
    description:
      "Premium AI and digital services for ambitious brands building the future.",
    start_url: "/",
    display: "standalone",
    background_color: "#030712",
    theme_color: "#22c55e",
    icons: [
      {
        src: "/brand/logo.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
    scope: getSiteUrl(),
  };
}

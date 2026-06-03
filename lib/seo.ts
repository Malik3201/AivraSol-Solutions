import type { Metadata } from "next";
import {
  buildPageMetadata,
  defaultMetadata,
  getSiteUrl,
} from "@/lib/services/seo";

export { buildPageMetadata, defaultMetadata, getSiteUrl };

export function createPageMetadata({
  title,
  description,
  path = "",
  image,
}: {
  title: string;
  description?: string;
  path?: string;
  image?: string;
}): Metadata {
  const meta = buildPageMetadata({ title, description, path });
  if (image) {
    return {
      ...meta,
      openGraph: {
        ...meta.openGraph,
        images: [{ url: image }],
      },
      twitter: {
        ...meta.twitter,
        images: [image],
      },
    };
  }
  return meta;
}

export const themeColor = "#0a0f0d";

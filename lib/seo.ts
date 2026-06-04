import type { Metadata } from "next";
import {
  buildBlogSchema,
  buildPageMetadata,
  buildProjectSchema,
  buildServiceSchema,
  defaultMetadata,
  getSiteUrl,
} from "@/lib/services/seo";

export {
  buildBlogSchema,
  buildPageMetadata,
  buildProjectSchema,
  buildServiceSchema,
  defaultMetadata,
  getSiteUrl,
};

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

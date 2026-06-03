import type { Metadata } from "next";
import { getEnv } from "@/lib/env";

const SITE_NAME = "AIVRASOL";
const DEFAULT_DESCRIPTION =
  "AIVRASOL delivers premium AI and digital services — custom software, intelligent automation, and future-ready experiences for ambitious brands.";

export function getSiteUrl(): string {
  try {
    return getEnv().NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  } catch {
    return (
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
      "http://localhost:3000"
    );
  }
}

export const defaultMetadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${SITE_NAME} | Premium AI & Digital Services`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "AIVRASOL",
    "AI services",
    "digital agency",
    "automation",
    "custom software",
    "machine learning",
  ],
  authors: [{ name: SITE_NAME, url: getSiteUrl() }],
  creator: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: getSiteUrl(),
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Premium AI & Digital Services`,
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Premium AI & Digital Services`,
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: getSiteUrl(),
  },
};

export function buildPageMetadata({
  title,
  description,
  path = "",
}: {
  title: string;
  description?: string;
  path?: string;
}): Metadata {
  const url = `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const desc = description ?? DEFAULT_DESCRIPTION;

  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description: desc,
      url,
    },
    twitter: {
      title: `${title} | ${SITE_NAME}`,
      description: desc,
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: getSiteUrl(),
    logo: `${getSiteUrl()}/brand/logo.svg`,
    description: DEFAULT_DESCRIPTION,
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["English"],
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: getSiteUrl(),
    potentialAction: {
      "@type": "SearchAction",
      target: `${getSiteUrl()}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export const SEO_PAGE_KEYS = [
  "home",
  "about",
  "services",
  "projects",
  "team",
  "contact",
  "blog",
] as const;

export type SeoPageKey = (typeof SEO_PAGE_KEYS)[number];

export interface SeoObject {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
  image?: string;
  openGraph: {
    title: string;
    description: string;
    url: string;
    image?: string;
  };
}

export function trimSeoDescription(
  value: string,
  maxLength = 160,
): string {
  const trimmed = value.replace(/\s+/g, " ").trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength - 1).trim()}…`;
}

export function buildSeoObject(input: {
  title?: string;
  description?: string;
  keywords?: string[];
  path?: string;
  image?: string;
}): SeoObject {
  const title = input.title?.trim() || `${SITE_NAME} | Premium AI & Digital Services`;
  const description = trimSeoDescription(
    input.description?.trim() || DEFAULT_DESCRIPTION,
  );
  const path = input.path?.startsWith("/") ? input.path : `/${input.path ?? ""}`;
  const canonical = `${getSiteUrl()}${path === "/" ? "" : path}`;
  const keywords =
    input.keywords && input.keywords.length > 0
      ? input.keywords
      : ["AIVRASOL", "AI services", "digital agency"];

  return {
    title,
    description,
    keywords,
    canonical,
    image: input.image,
    openGraph: {
      title,
      description,
      url: canonical,
      image: input.image,
    },
  };
}

export function buildSeoFromContent(input: {
  title: string;
  shortDescription?: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  path: string;
  image?: string;
}): SeoObject {
  return buildSeoObject({
    title: input.seoTitle || `${input.title} | ${SITE_NAME}`,
    description:
      input.seoDescription ||
      input.shortDescription ||
      input.description ||
      DEFAULT_DESCRIPTION,
    keywords: input.seoKeywords,
    path: input.path,
    image: input.image,
  });
}

export function getSeoSettingKey(pageKey: SeoPageKey): string {
  return `seo.${pageKey}`;
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function buildOrganizationSchema(
  settings: Record<string, unknown> = {},
) {
  const social = (settings.socialLinks as Record<string, string>) ?? {};
  const sameAs = Object.values(social).filter(
    (v): v is string => typeof v === "string" && v.startsWith("http"),
  );

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: (settings.companyName as string) || SITE_NAME,
    url: getSiteUrl(),
    logo:
      (settings.logo as string) || `${getSiteUrl()}/brand/logo.svg`,
    description:
      (settings.tagline as string) || DEFAULT_DESCRIPTION,
    email: settings.contactEmail as string | undefined,
    telephone: settings.phone as string | undefined,
    address: settings.address
      ? {
          "@type": "PostalAddress",
          streetAddress: settings.address,
        }
      : undefined,
    sameAs,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: settings.contactEmail as string | undefined,
      telephone: settings.phone as string | undefined,
      availableLanguage: ["English"],
    },
  };
}

export function buildServiceSchema(service: {
  title: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  coverImage?: string;
}) {
  const url = `${getSiteUrl()}/services/${service.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description:
      service.shortDescription || service.description || DEFAULT_DESCRIPTION,
    url,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: getSiteUrl(),
    },
    image: service.coverImage,
  };
}

export function buildProjectSchema(project: {
  title: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  clientName?: string;
  industry?: string;
  coverImage?: string;
  liveUrl?: string;
}) {
  const url = `${getSiteUrl()}/projects/${project.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description:
      project.shortDescription || project.description || DEFAULT_DESCRIPTION,
    url: project.liveUrl || url,
    image: project.coverImage,
    about: project.industry,
    creator: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    client: project.clientName
      ? { "@type": "Organization", name: project.clientName }
      : undefined,
  };
}

export function buildBlogSchema(post: {
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  author?: string;
  publishedAt?: Date | string;
  tags?: string[];
}) {
  const url = `${getSiteUrl()}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || trimSeoDescription(post.content ?? "", 200),
    url,
    image: post.coverImage,
    author: {
      "@type": "Person",
      name: post.author || SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${getSiteUrl()}/brand/logo.svg`,
      },
    },
    datePublished: post.publishedAt
      ? new Date(post.publishedAt).toISOString()
      : undefined,
    keywords: post.tags?.join(", "),
  };
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${getSiteUrl()}${item.path.startsWith("/") ? item.path : `/${item.path}`}`,
    })),
  };
}

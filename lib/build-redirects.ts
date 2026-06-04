import type { Redirect, Rewrite } from "next/dist/lib/load-custom-routes";

/** Canonical site URL used for www → apex redirects at build time. */
function resolveCanonicalSiteUrl(): URL | null {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`
      : "");

  if (!raw) return null;

  try {
    return new URL(raw.includes("://") ? raw : `https://${raw}`);
  } catch {
    return null;
  }
}

function shouldApplyHostRedirects(hostname: string): boolean {
  if (hostname === "localhost" || hostname === "127.0.0.1") return false;
  if (hostname.endsWith(".vercel.app")) return false;
  return true;
}

/**
 * Redirects that send users to the same path on the canonical host
 * (e.g. www.example.com/about → example.com/about).
 */
export function getBuildRedirects(): Redirect[] {
  const redirects: Redirect[] = [
    {
      source: "/:path+/",
      destination: "/:path+",
      permanent: true,
    },
  ];

  const canonical = resolveCanonicalSiteUrl();
  if (!canonical || !shouldApplyHostRedirects(canonical.hostname)) {
    return redirects;
  }

  const host = canonical.hostname;
  const origin = `${canonical.protocol}//${host}`;

  redirects.push({
    source: "/:path*",
    has: [{ type: "host", value: `www.${host}` }],
    destination: `${origin}/:path*`,
    permanent: true,
  });

  return redirects;
}

/** Internal rewrites — same logical endpoint, preserves method/body (POST-safe). */
export function getBuildRewrites(): Rewrite[] {
  return [
    {
      source: "/api/ai/aiva/chat",
      destination: "/api/aiva/chat",
    },
  ];
}

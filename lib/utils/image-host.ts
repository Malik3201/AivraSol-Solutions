const DEFAULT_OPTIMIZED_HOSTS = ["ik.imagekit.io"];

function imageKitHostname(): string | null {
  const endpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT?.trim();
  if (!endpoint) return null;
  try {
    return new URL(endpoint).hostname;
  } catch {
    return null;
  }
}

/** Hostnames allowed for `next/image` optimization (ImageKit + configured CDN). */
export function getOptimizedImageHosts(): string[] {
  const kit = imageKitHostname();
  return kit
    ? [...new Set([...DEFAULT_OPTIMIZED_HOSTS, kit])]
    : [...DEFAULT_OPTIMIZED_HOSTS];
}

export function canUseNextImage(src: string): boolean {
  try {
    const { hostname, protocol } = new URL(src);
    if (protocol !== "https:" && protocol !== "http:") return false;
    return getOptimizedImageHosts().some(
      (allowed) => hostname === allowed || hostname.endsWith(`.${allowed}`),
    );
  } catch {
    return false;
  }
}

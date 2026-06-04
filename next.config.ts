import type { NextConfig } from "next";
import { getBuildRedirects, getBuildRewrites } from "@/lib/build-redirects";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
    ],
  },
  async redirects() {
    return getBuildRedirects();
  },
  async rewrites() {
    return getBuildRewrites();
  },
};

export default nextConfig;

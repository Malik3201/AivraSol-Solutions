import Image from "next/image";
import { canUseNextImage } from "@/lib/utils/image-host";
import { cn } from "@/lib/utils";

type RemoteImageProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
};

/** Renders admin/CMS image URLs: optimized via next/image on ImageKit, native img elsewhere. */
export function RemoteImage({
  src,
  alt,
  className,
  sizes = "100vw",
  priority = false,
  fill = false,
}: RemoteImageProps) {
  if (canUseNextImage(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        fill={fill}
        priority={priority}
        sizes={sizes}
        className={className}
      />
    );
  }

  if (fill) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- external CMS URLs are not in next/image remotePatterns
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        className={cn("absolute inset-0 size-full", className)}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- external CMS URLs are not in next/image remotePatterns
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      className={className}
    />
  );
}

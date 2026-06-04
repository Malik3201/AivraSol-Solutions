import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { RemoteImage } from "@/components/site/RemoteImage";
import type { PublicService } from "@/lib/api/types";
import { PAGE_GRID } from "@/lib/page-layout";

export function RelatedServices({ services }: { services: PublicService[] }) {
  if (!services.length) return null;

  return (
    <div className={PAGE_GRID}>
      {services.map((s) => (
        <Link
          key={s.id}
          href={`/services/${s.slug}`}
          className="group relative col-span-12 overflow-hidden rounded-2xl border border-white/[0.08] bg-[rgba(10,16,14,0.55)] transition-all hover:border-primary/30 sm:col-span-6"
        >
          {s.coverImage ? (
            <div className="relative h-32 w-full">
              <RemoteImage
                src={s.coverImage}
                alt=""
                fill
                className="object-cover opacity-70 transition-transform duration-500 group-hover:scale-105"
                sizes="400px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1210] to-transparent" />
            </div>
          ) : null}
          <div className="p-5">
            <p className="text-[10px] uppercase tracking-[0.28em] text-primary">
              Service
            </p>
            <h3 className="mt-2 flex items-center gap-2 font-semibold text-white">
              {s.title}
              <ArrowUpRight className="size-4 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
            </h3>
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {s.shortDescription}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

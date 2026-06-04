"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Bot,
  Globe,
  Layers,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { RemoteImage } from "@/components/site/RemoteImage";
import type { PublicService } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  "ai-product-engineering": Bot,
  "premium-web-platforms": Globe,
  "business-automation": Layers,
  "ai-strategy-advisory": Sparkles,
  "ai-chatbot-development": Bot,
  "web-development": Globe,
};

const DEFAULT_TAGS = ["Discovery", "Delivery", "Scale"];

export const SERVICE_CARD_HEIGHT = "h-[min(440px,78vh)] sm:h-[460px] md:h-[480px]";

export function ServiceCard({
  service,
  featured = false,
  index = 0,
}: {
  service: PublicService;
  featured?: boolean;
  index?: number;
}) {
  const Icon = ICONS[service.slug] ?? Sparkles;
  const tags = service.features?.filter(Boolean).slice(0, 3) ?? DEFAULT_TAGS;
  const number = String(index + 1).padStart(2, "0");

  return (
    <Link
      href={`/services/${service.slug}`}
      className={cn(
        "group relative block w-full overflow-hidden rounded-[1.75rem]",
        SERVICE_CARD_HEIGHT,
        "border border-white/[0.07]",
        "shadow-[0_20px_50px_-24px_rgba(0,0,0,0.9)]",
        "transition-[border-color,box-shadow,transform] duration-500 ease-out",
        "hover:-translate-y-1.5 hover:border-primary/35",
        "hover:shadow-[0_28px_80px_-20px_rgba(62,207,142,0.22)]",
        featured && "ring-1 ring-primary/40",
      )}
    >
      {/* Media */}
      <div className="absolute inset-0 bg-[#0a100e]">
        {service.coverImage ? (
          <RemoteImage
            src={service.coverImage}
            alt=""
            fill
            priority={index < 3}
            className="object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-[1.06]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <>
            <div
              className="absolute inset-0 opacity-80"
              style={{
                background:
                  "radial-gradient(120% 90% at 0% 0%, rgba(62,207,142,0.22), transparent 55%), radial-gradient(80% 70% at 100% 100%, rgba(30,157,98,0.12), transparent 50%), linear-gradient(165deg, #0f1814 0%, #060a08 100%)",
              }}
              aria-hidden
            />
            <Icon
              className="pointer-events-none absolute -right-6 -top-6 size-40 text-primary/[0.07]"
              strokeWidth={0.75}
              aria-hidden
            />
          </>
        )}
      </div>

      {/* Cinematic scrim */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#060a08] via-[#060a08]/55 to-[#060a08]/15"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      />

      {/* Film grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />

      {/* Top meta */}
      <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between p-6">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-full border border-white/15 bg-black/35 text-primary backdrop-blur-md">
            <Icon className="size-4" strokeWidth={1.75} aria-hidden />
          </span>
          {featured ? (
            <span className="rounded-full border border-primary/40 bg-primary/15 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-primary">
              Featured
            </span>
          ) : null}
        </div>
        <span className="font-mono text-[11px] tabular-nums tracking-widest text-white/35">
          {number}
        </span>
      </div>

      {/* Default content — slides up slightly on hover */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 z-10 px-6 pb-6 pt-16 transition-transform duration-500 ease-out",
          "group-hover:translate-y-2 group-hover:opacity-0",
        )}
      >
        <div className="border-t border-white/10 pt-5">
          <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-primary/90">
            Capability
          </p>
          <h3 className="mt-2 line-clamp-2 text-xl font-semibold leading-tight tracking-tight text-white">
            {service.title}
          </h3>
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-white/65">
            {service.shortDescription}
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 text-[11px] text-white/80 backdrop-blur-sm"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Hover reveal */}
      <div
        className={cn(
          "absolute inset-0 z-20 flex flex-col items-center justify-center px-8",
          "bg-[#040807]/75 opacity-0 backdrop-blur-md transition-all duration-500",
          "group-hover:opacity-100",
        )}
      >
        <div className="flex max-w-[260px] translate-y-3 flex-col items-center text-center opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
          <p className="text-[10px] uppercase tracking-[0.38em] text-primary">
            {service.title}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-white/75">
            {service.shortDescription}
          </p>

          <span
            className={cn(
              "mt-8 inline-flex items-center gap-3 rounded-full",
              "border border-primary/50 bg-primary/95 px-8 py-3.5",
              "text-[13px] font-semibold tracking-wide text-primary-foreground",
              "shadow-[0_0_0_1px_rgba(255,255,255,0.08)_inset,0_12px_40px_-8px_rgba(62,207,142,0.55)]",
              "transition-transform duration-300 group-hover:gap-4",
            )}
          >
            View service
            <ArrowUpRight className="size-4" aria-hidden />
          </span>
        </div>

        {/* Corner brackets */}
        <span className="pointer-events-none absolute left-5 top-5 h-8 w-8 border-l border-t border-primary/50 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="pointer-events-none absolute bottom-5 right-5 h-8 w-8 border-b border-r border-primary/50 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      {/* Bottom shine line */}
      <span
        className="absolute bottom-0 left-0 z-30 h-[2px] w-0 bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-700 ease-out group-hover:w-full"
        aria-hidden
      />
    </Link>
  );
}

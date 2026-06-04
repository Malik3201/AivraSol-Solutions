"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { RemoteImage } from "@/components/site/RemoteImage";
import type { PublicProject } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const DEFAULT_TAGS = ["Strategy", "Build", "Launch"];

export const PROJECT_CARD_HEIGHT = "h-[min(460px,82vh)] sm:h-[500px] md:h-[520px]";

export function ProjectCard({
  project,
  featured = false,
  index = 0,
}: {
  project: PublicProject;
  featured?: boolean;
  index?: number;
}) {
  const number = String(index + 1).padStart(2, "0");
  const tags = [
    ...(project.technologies?.filter(Boolean).slice(0, 2) ?? []),
    ...(project.results?.filter(Boolean).slice(0, 1) ?? []),
  ].slice(0, 3);
  const displayTags = tags.length > 0 ? tags : DEFAULT_TAGS;

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(
        "group relative flex w-full flex-col overflow-hidden rounded-[2rem]",
        PROJECT_CARD_HEIGHT,
        "border border-white/[0.09] bg-[#0a100e]",
        "shadow-[0_24px_60px_-28px_rgba(0,0,0,0.85)]",
        "transition-[border-color,box-shadow,transform] duration-500 ease-out",
        "hover:-translate-y-2 hover:border-primary/40",
        featured
          ? "shadow-[0_0_0_1px_rgba(62,207,142,0.25),0_32px_80px_-24px_rgba(62,207,142,0.28)]"
          : "hover:shadow-[0_32px_90px_-20px_rgba(62,207,142,0.22)]",
      )}
    >
      {/* Image stage — projects show more of the visual than service cards */}
      <div className="relative min-h-[248px] flex-[1.2] overflow-hidden">
        {project.coverImage ? (
          <RemoteImage
            src={project.coverImage}
            alt=""
            fill
            priority={index < 3}
            className="object-cover transition-transform duration-[1.15s] ease-out group-hover:scale-[1.07]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 70% at 80% 20%, rgba(62,207,142,0.35), transparent 55%), radial-gradient(ellipse 60% 50% at 10% 90%, rgba(30,157,98,0.2), transparent 50%), linear-gradient(160deg, #142018 0%, #080c0a 100%)",
            }}
            aria-hidden
          />
        )}

        <div
          className="absolute inset-0 bg-gradient-to-t from-[#0a100e] via-[#0a100e]/20 to-transparent"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-primary/[0.12] via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-100"
          aria-hidden
        />

        {/* Film grain */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
          aria-hidden
        />

        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-3 p-5">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            {project.industry ? (
              <span className="rounded-full border border-white/20 bg-black/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-md">
                {project.industry}
              </span>
            ) : null}
            {featured ? (
              <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground shadow-[0_8px_24px_-6px_rgba(62,207,142,0.6)]">
                Featured
              </span>
            ) : null}
          </div>
          <span className="shrink-0 font-mono text-xs tabular-nums tracking-[0.2em] text-white/50">
            {number}
          </span>
        </div>

        {/* Hover corner accents */}
        <span className="pointer-events-none absolute left-4 top-4 z-10 h-7 w-7 border-l border-t border-primary/0 transition-all duration-500 group-hover:border-primary/60" />
        <span className="pointer-events-none absolute right-4 top-4 z-10 h-7 w-7 border-r border-t border-primary/0 transition-all duration-500 group-hover:border-primary/60" />
      </div>

      {/* Glass content dock — always readable (unlike full-bleed overlay) */}
      <div className="relative z-10 flex shrink-0 flex-col border-t border-white/[0.08] bg-[#0c1210]/95 px-6 py-5 backdrop-blur-xl">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(62,207,142,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(62,207,142,0.03) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
          aria-hidden
        />

        <div className="relative flex items-center gap-2">
          <span
            className="size-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_10px_rgba(62,207,142,0.9)]"
            aria-hidden
          />
          <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-primary">
            Case study
          </p>
          {project.clientName ? (
            <>
              <span className="text-white/25" aria-hidden>
                ·
              </span>
              <p className="truncate text-[11px] text-white/55">
                {project.clientName}
              </p>
            </>
          ) : null}
        </div>

        <h3 className="relative mt-2.5 line-clamp-2 text-[1.35rem] font-semibold leading-[1.2] tracking-tight text-white transition-colors duration-300 group-hover:text-primary-light">
          {project.title}
        </h3>

        <p className="relative mt-2 line-clamp-2 text-sm leading-relaxed text-white/70">
          {project.shortDescription}
        </p>

        <div className="relative mt-4 flex items-end justify-between gap-4">
          <ul className="flex min-w-0 flex-1 flex-wrap gap-2">
            {displayTags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-white/15 bg-white/[0.07] px-3 py-1 text-[11px] font-medium text-white/90 backdrop-blur-sm transition-colors duration-300 group-hover:border-primary/30 group-hover:bg-primary/10 group-hover:text-white"
              >
                {tag}
              </li>
            ))}
          </ul>

          <span
            className={cn(
              "inline-flex shrink-0 items-center justify-center rounded-full",
              "size-11 border border-white/20 bg-white/[0.06] text-white",
              "transition-all duration-300",
              "group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground",
              "group-hover:shadow-[0_0_24px_-4px_rgba(62,207,142,0.65)]",
            )}
            aria-hidden
          >
            <ArrowUpRight className="size-5" strokeWidth={2} />
          </span>
        </div>
      </div>

      {/* Bottom accent — projects use full-width bar; services use center shine */}
      <span
        className="absolute bottom-0 left-0 z-20 h-[3px] w-0 bg-gradient-to-r from-primary via-primary-light to-primary/40 transition-all duration-700 ease-out group-hover:w-full"
        aria-hidden
      />
    </Link>
  );
}

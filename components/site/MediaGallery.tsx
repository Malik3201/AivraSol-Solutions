"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { ProjectVisualPanel } from "@/components/projects/ProjectVisualPanel";
import { RemoteImage } from "@/components/site/RemoteImage";
import { cn } from "@/lib/utils";

export function MediaGallery({
  images,
  title,
  lightbox = true,
}: {
  images?: string[];
  title: string;
  lightbox?: boolean;
}) {
  const list = images?.filter(Boolean) ?? [];
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const close = useCallback(() => setActiveIndex(null), []);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => {
      if (i === null || list.length === 0) return i;
      return (i - 1 + list.length) % list.length;
    });
  }, [list.length]);

  const goNext = useCallback(() => {
    setActiveIndex((i) => {
      if (i === null || list.length === 0) return i;
      return (i + 1) % list.length;
    });
  }, [list.length]);

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, close, goPrev, goNext]);

  if (!list.length) {
    return <ProjectVisualPanel variant="featured" className="min-h-[240px]" />;
  }

  const openAt = (index: number) => {
    if (lightbox) setActiveIndex(index);
  };

  const tileClass = (i: number) =>
    cn(
      "group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[rgba(10,16,14,0.4)] shadow-lg shadow-black/20 transition-all duration-300",
      "aspect-[16/10]",
      lightbox && "cursor-zoom-in hover:border-primary/35",
      list.length === 1 && "w-full",
      list.length === 2 && "md:col-span-6",
      list.length >= 3 && i === 0 && "md:col-span-8 md:min-h-[320px]",
      list.length >= 3 && i > 0 && "md:col-span-4",
      list.length > 2 && i === 0 && "md:row-span-2 md:aspect-auto",
    );

  const renderTile = (src: string, i: number, single = false) => {
    const wrapperProps = lightbox
      ? {
          type: "button" as const,
          onClick: () => openAt(i),
          "aria-label": `View ${title} image ${i + 1} full screen`,
        }
      : {};

    const className = single
      ? "relative aspect-[21/9] w-full overflow-hidden rounded-3xl border border-white/[0.1] shadow-2xl shadow-black/40"
      : tileClass(i);

    if (lightbox) {
      return (
        <button key={`${src}-${i}`} className={className} {...wrapperProps}>
          {tileContent(src, i)}
        </button>
      );
    }

    return (
      <div key={`${src}-${i}`} className={className}>
        {tileContent(src, i)}
      </div>
    );
  };

  function tileContent(src: string, i: number) {
    return (
      <>
        <RemoteImage
          src={src}
          alt={`${title} — visual ${i + 1}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(max-width:768px) 100vw, 40vw"
        />
        {lightbox ? (
          <>
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"
              aria-hidden
            />
            <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/55 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-white/90 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
              <Maximize2 className="size-3.5" aria-hidden />
              Full view
            </span>
          </>
        ) : null}
      </>
    );
  }

  const lightboxPortal =
    lightbox && activeIndex !== null && mounted
      ? createPortal(
          <div
            className="fixed inset-0 z-[200] flex flex-col bg-black/95"
            role="dialog"
            aria-modal="true"
            aria-label={`${title} — full screen gallery`}
          >
            {/* Top bar */}
            <div className="relative z-[210] flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3 md:px-8">
              <p className="truncate text-sm text-white/70">
                <span className="text-white/40">{title}</span>
                <span className="mx-2">·</span>
                Image {activeIndex + 1} of {list.length}
              </p>
              <button
                type="button"
                onClick={close}
                className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-primary/50 hover:bg-primary/20"
                aria-label="Close full screen view"
              >
                <X className="size-4" aria-hidden />
                Close
              </button>
            </div>

            {/* Image stage */}
            <div
              className="relative z-[205] flex min-h-0 flex-1 items-center justify-center p-4 md:p-10"
              onClick={close}
            >
              {list.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goPrev();
                    }}
                    className="absolute left-2 z-[210] flex size-12 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white shadow-lg hover:border-primary/40 md:left-6"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="size-6" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goNext();
                    }}
                    className="absolute right-2 z-[210] flex size-12 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white shadow-lg hover:border-primary/40 md:right-6"
                    aria-label="Next image"
                  >
                    <ChevronRight className="size-6" />
                  </button>
                </>
              ) : null}

              {/* eslint-disable-next-line @next/next/no-img-element -- lightbox must show any CMS URL at full resolution */}
              <img
                src={list[activeIndex]}
                alt={`${title} — image ${activeIndex + 1}`}
                className="relative z-[208] max-h-full max-w-full object-contain shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <p className="relative z-[210] shrink-0 pb-4 text-center text-[11px] uppercase tracking-[0.24em] text-white/40">
              Click outside or press Esc to close
            </p>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      {list.length === 1 ? (
        renderTile(list[0], 0, true)
      ) : (
        <div className="grid gap-4 md:grid-cols-12 md:gap-5">
          {list.map((src, i) => renderTile(src, i))}
        </div>
      )}
      {lightboxPortal}
    </>
  );
}

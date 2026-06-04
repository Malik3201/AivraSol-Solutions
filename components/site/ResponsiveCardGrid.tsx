"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type CarouselBreakpoint = "md" | "lg";

const CAROUSEL_VISIBLE: Record<CarouselBreakpoint, string> = {
  md: "md:hidden",
  lg: "lg:hidden",
};

const GRID_MIN: Record<CarouselBreakpoint, string> = {
  md: "md:grid",
  lg: "lg:grid",
};

const DEFAULT_AUTO_PLAY_MS = 5000;

/** Homepage: one row — 3 cards visible on desktop (lg+) */
const HOME_ROW_SLIDE =
  "w-[min(88vw,340px)] shrink-0 snap-start sm:w-[min(52vw,380px)] md:w-[min(38vw,400px)] lg:w-[calc((100%-2*1rem)/3)] lg:max-w-none xl:w-[calc((100%-2*1rem)/3)]";

export function ResponsiveCardGrid<T>({
  items,
  keyExtractor,
  renderItem,
  gridClassName,
  carouselFrom = "md",
  layout = "grid",
  autoPlay = false,
  autoPlayInterval = DEFAULT_AUTO_PLAY_MS,
  ariaLabel = "Cards",
  slideClassName,
  className,
}: {
  items: T[];
  keyExtractor: (item: T) => string;
  renderItem: (item: T, index: number) => ReactNode;
  gridClassName?: string;
  carouselFrom?: CarouselBreakpoint;
  layout?: "grid" | "single-row";
  autoPlay?: boolean;
  autoPlayInterval?: number;
  ariaLabel?: string;
  slideClassName?: string;
  className?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const pausedRef = useRef(false);

  const updateIndex = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !el.firstElementChild) return;
    const slide = el.firstElementChild as HTMLElement;
    const gap = 16;
    const step = slide.offsetWidth + gap;
    if (step <= 0) return;
    const idx = Math.round(el.scrollLeft / step);
    const clamped = Math.min(Math.max(0, idx), items.length - 1);
    activeIndexRef.current = clamped;
    setActiveIndex(clamped);
  }, [items.length]);

  const scrollTo = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el?.firstElementChild) return;
    const slide = el.firstElementChild as HTMLElement;
    const gap = 16;
    const target = Math.min(Math.max(0, index), items.length - 1);
    el.scrollTo({
      left: target * (slide.offsetWidth + gap),
      behavior: "smooth",
    });
    activeIndexRef.current = target;
    setActiveIndex(target);
  }, [items.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateIndex();
    el.addEventListener("scroll", updateIndex, { passive: true });
    window.addEventListener("resize", updateIndex);
    return () => {
      el.removeEventListener("scroll", updateIndex);
      window.removeEventListener("resize", updateIndex);
    };
  }, [updateIndex, items.length]);

  useEffect(() => {
    if (!autoPlay || items.length <= 1) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) return;

    const tick = () => {
      if (pausedRef.current) return;
      const next = (activeIndexRef.current + 1) % items.length;
      scrollTo(next);
    };

    const id = window.setInterval(tick, autoPlayInterval);
    return () => window.clearInterval(id);
  }, [autoPlay, autoPlayInterval, items.length, scrollTo]);

  if (!items.length) return null;

  const isSingleRow = layout === "single-row";
  const carouselHidden = isSingleRow ? "" : CAROUSEL_VISIBLE[carouselFrom];
  const gridMin = GRID_MIN[carouselFrom];
  const resolvedSlideClass = cn(
    isSingleRow
      ? HOME_ROW_SLIDE
      : "w-[min(88vw,380px)] shrink-0 snap-center sm:w-[min(82vw,400px)]",
    slideClassName,
  );

  const carousel = (
    <div
      ref={trackRef}
      className={cn("relative", carouselHidden)}
      aria-roledescription="carousel"
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
      onFocusCapture={() => {
        pausedRef.current = true;
      }}
      onBlurCapture={(e) => {
        if (!trackRef.current?.contains(e.relatedTarget as Node)) {
          pausedRef.current = false;
        }
      }}
    >
      <div
        ref={scrollRef}
        className={cn(
          "scrollbar-none flex flex-nowrap snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-1",
          isSingleRow
            ? "-mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0"
            : "-mx-4 px-4 sm:-mx-6 sm:px-6",
        )}
        aria-label={ariaLabel}
        aria-live={autoPlay ? "polite" : undefined}
      >
        {items.map((item, index) => (
          <div key={keyExtractor(item)} className={resolvedSlideClass}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>

      {items.length > 1 ? (
        <div className="mt-5 flex items-center justify-between gap-4 px-0.5">
          <div
            className="flex gap-2"
            role="tablist"
            aria-label={`${ariaLabel} slides`}
          >
            {items.map((item, i) => (
              <button
                key={keyExtractor(item)}
                type="button"
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => scrollTo(i)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  i === activeIndex
                    ? "w-7 bg-primary"
                    : "w-2 bg-white/25 hover:bg-white/40",
                )}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() =>
                scrollTo((activeIndex - 1 + items.length) % items.length)
              }
              className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white transition-colors hover:border-primary/40 hover:bg-primary/15"
            >
              <ChevronLeft className="size-4" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() =>
                scrollTo((activeIndex + 1) % items.length)
              }
              className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white transition-colors hover:border-primary/40 hover:bg-primary/15"
            >
              <ChevronRight className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );

  if (isSingleRow) {
    return <div className={className}>{carousel}</div>;
  }

  return (
    <div className={className}>
      {carousel}
      {gridClassName ? (
        <div className={cn("hidden gap-6", gridMin, gridClassName)}>
          {items.map((item, index) => (
            <div key={keyExtractor(item)}>{renderItem(item, index)}</div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

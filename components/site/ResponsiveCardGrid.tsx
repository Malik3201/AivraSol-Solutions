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

export function ResponsiveCardGrid<T>({
  items,
  keyExtractor,
  renderItem,
  gridClassName,
  carouselFrom = "md",
  ariaLabel = "Cards",
  slideClassName,
  className,
}: {
  items: T[];
  keyExtractor: (item: T) => string;
  renderItem: (item: T, index: number) => ReactNode;
  /** Must include `hidden` and breakpoint grid cols, e.g. `hidden md:grid grid-cols-1 gap-6` */
  gridClassName: string;
  carouselFrom?: CarouselBreakpoint;
  ariaLabel?: string;
  slideClassName?: string;
  className?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateIndex = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !el.firstElementChild) return;
    const slide = el.firstElementChild as HTMLElement;
    const gap = 16;
    const step = slide.offsetWidth + gap;
    if (step <= 0) return;
    const idx = Math.round(el.scrollLeft / step);
    setActiveIndex(Math.min(Math.max(0, idx), items.length - 1));
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

  const scrollTo = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el?.firstElementChild) return;
    const slide = el.firstElementChild as HTMLElement;
    const gap = 16;
    el.scrollTo({
      left: index * (slide.offsetWidth + gap),
      behavior: "smooth",
    });
    setActiveIndex(index);
  }, []);

  if (!items.length) return null;

  const carouselHidden = CAROUSEL_VISIBLE[carouselFrom];
  const gridMin = GRID_MIN[carouselFrom];

  return (
    <div className={className}>
      {/* Mobile / tablet carousel */}
      <div className={cn("relative", carouselHidden)} aria-roledescription="carousel">
        <div
          ref={scrollRef}
          className={cn(
            "scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-1",
            "-mx-4 px-4 sm:-mx-6 sm:px-6",
          )}
          aria-label={ariaLabel}
        >
          {items.map((item, index) => (
            <div
              key={keyExtractor(item)}
              className={cn(
                "w-[min(88vw,380px)] shrink-0 snap-center sm:w-[min(82vw,400px)]",
                slideClassName,
              )}
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>

        {items.length > 1 ? (
          <div className="mt-5 flex items-center justify-between gap-4 px-0.5">
            <div className="flex gap-2" role="tablist" aria-label={`${ariaLabel} slides`}>
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
                onClick={() => scrollTo((activeIndex + 1) % items.length)}
                className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white transition-colors hover:border-primary/40 hover:bg-primary/15"
              >
                <ChevronRight className="size-4" aria-hidden />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Desktop grid */}
      <div className={cn("hidden gap-6", gridMin, gridClassName)}>
        {items.map((item, index) => (
          <div key={keyExtractor(item)}>{renderItem(item, index)}</div>
        ))}
      </div>
    </div>
  );
}

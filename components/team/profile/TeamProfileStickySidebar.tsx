"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/** Matches SiteHeader (72px) + breathing room */
const STICKY_TOP = 88;
const DESKTOP_MQ = "(min-width: 768px)";

type PinMode = "flow" | "fixed" | "anchored-bottom";

export function TeamProfileStickySidebar({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const columnRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [pin, setPin] = useState<PinMode>("flow");
  const [fixedStyle, setFixedStyle] = useState<CSSProperties>({});
  const [spacerHeight, setSpacerHeight] = useState<number | undefined>(undefined);

  const update = useCallback(() => {
    const column = columnRef.current;
    const card = cardRef.current;
    if (!column || !card) return;

    const section = column.closest("[data-team-profile-body]") as HTMLElement | null;
    const desktop = window.matchMedia(DESKTOP_MQ).matches;

    if (!desktop || !section) {
      setPin("flow");
      setSpacerHeight(undefined);
      setFixedStyle({});
      return;
    }

    const cardHeight = card.offsetHeight;
    setSpacerHeight(cardHeight);

    const columnRect = column.getBoundingClientRect();
    const sectionRect = section.getBoundingClientRect();

    if (sectionRect.top > STICKY_TOP) {
      setPin("flow");
      setFixedStyle({});
      return;
    }

    if (sectionRect.bottom <= STICKY_TOP + cardHeight) {
      setPin("anchored-bottom");
      setFixedStyle({});
      return;
    }

    setPin("fixed");
    setFixedStyle({
      position: "fixed",
      top: STICKY_TOP,
      left: columnRect.left,
      width: columnRect.width,
      zIndex: 20,
    });
  }, []);

  useEffect(() => {
    update();

    const ro = new ResizeObserver(update);
    if (columnRef.current) ro.observe(columnRef.current);
    if (cardRef.current) ro.observe(cardRef.current);
    const section = columnRef.current?.closest("[data-team-profile-body]");
    if (section) ro.observe(section);

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    const mq = window.matchMedia(DESKTOP_MQ);
    mq.addEventListener("change", update);

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      mq.removeEventListener("change", update);
    };
  }, [update]);

  return (
    <div
      ref={columnRef}
      className={cn("relative w-full md:h-full", className)}
      style={spacerHeight ? { minHeight: spacerHeight } : undefined}
    >
      <div
        ref={cardRef}
        style={pin === "fixed" ? fixedStyle : undefined}
        className={cn(
          pin === "anchored-bottom" && "absolute bottom-0 left-0 right-0",
          pin === "flow" && "relative",
        )}
      >
        {children}
      </div>
    </div>
  );
}

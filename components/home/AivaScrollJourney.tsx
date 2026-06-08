"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  AivaSpeechBubble,
  type BubblePlacement,
} from "@/components/home/aiva/AivaSpeechBubble";
import {
  AIVA_DOCK_ROTATION,
  AIVA_DOCK_SCALES,
  AIVA_GUIDE_SCALE,
  AIVA_HERO_SCALE,
  AIVA_MOBILE_ANCHORS,
  AIVA_MOBILE_BASE_PX,
  AIVA_MOBILE_GUIDE_SCALE,
  AIVA_MOBILE_HERO_SCALE,
  AIVA_ROBOT_BASE_PX,
} from "@/lib/aiva-docks";
import { AIVA_WAYPOINTS, type AivaWaypointId } from "@/lib/aiva-waypoints";
import { AIVA_ROBOT_IMAGE } from "@/lib/site-config";

const MOBILE_MQ = "(max-width: 767px)";

type LayoutMode = "desktop" | "mobile";

function getLayoutMode(): LayoutMode {
  return window.matchMedia(MOBILE_MQ).matches ? "mobile" : "desktop";
}

function layoutConfig(mode: LayoutMode) {
  if (mode === "mobile") {
    return {
      basePx: AIVA_MOBILE_BASE_PX,
      headerSafe: 76,
      bottomSafe: 108,
      sideMargin: 10,
      heroScale: AIVA_MOBILE_HERO_SCALE,
      guideScale: AIVA_MOBILE_GUIDE_SCALE,
    };
  }
  return {
    basePx: AIVA_ROBOT_BASE_PX,
    headerSafe: 112,
    bottomSafe: 220,
    sideMargin: 24,
    heroScale: AIVA_HERO_SCALE,
    guideScale: AIVA_GUIDE_SCALE,
  };
}

function clampPosition(
  x: number,
  y: number,
  scale: number,
  mode: LayoutMode,
): { x: number; y: number } {
  const { basePx, headerSafe, bottomSafe, sideMargin } = layoutConfig(mode);
  const size = basePx * scale;
  return {
    x: Math.max(sideMargin, Math.min(window.innerWidth - size - sideMargin, x)),
    y: Math.max(headerSafe, Math.min(window.innerHeight - size - bottomSafe, y)),
  };
}

function rectToTransform(el: Element, scale: number, mode: LayoutMode) {
  const { basePx } = layoutConfig(mode);
  const rect = el.getBoundingClientRect();
  const size = basePx * scale;
  const rawX = rect.left + rect.width / 2 - size / 2;
  const rawY = rect.top + rect.height / 2 - size / 2;
  return { ...clampPosition(rawX, rawY, scale, mode), scale, size };
}

function mobileAnchorToTransform(id: AivaWaypointId) {
  const anchor = AIVA_MOBILE_ANCHORS[id];
  const { basePx } = layoutConfig("mobile");
  const size = basePx * anchor.scale;
  const cx = window.innerWidth * anchor.xRatio;
  const cy = window.innerHeight * anchor.yRatio;
  const rawX = cx - size / 2;
  const rawY = cy - size / 2;
  return {
    ...clampPosition(rawX, rawY, anchor.scale, "mobile"),
    scale: anchor.scale,
    size,
    rotation: anchor.rotation ?? 0,
  };
}

function bubblePlacementFor(
  x: number,
  y: number,
  size: number,
  mode: LayoutMode,
): BubblePlacement {
  const cx = x + size / 2;
  const cy = y + size / 2;

  if (mode === "mobile") {
    if (cy < window.innerHeight * 0.45) return "below";
    return cx > window.innerWidth * 0.5 ? "left" : "right";
  }

  if (cy < window.innerHeight * 0.42) return "below";
  if (cx > window.innerWidth * 0.62) return "left";
  if (cx < window.innerWidth * 0.38) return "right";
  return "below";
}

export default function AivaScrollJourney() {
  const robotRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef<LayoutMode>("desktop");
  const [message, setMessage] = useState("");
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [bubblePlacement, setBubblePlacement] = useState<BubblePlacement>("left");
  const [enabled, setEnabled] = useState(false);
  const [robotWidth, setRobotWidth] = useState(AIVA_ROBOT_BASE_PX);
  const activeId = useRef<AivaWaypointId | null>(null);
  const journeyActive = useRef(false);

  useEffect(() => {
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileMq = window.matchMedia(MOBILE_MQ);
    const update = () => {
      layoutRef.current = getLayoutMode();
      setRobotWidth(layoutConfig(layoutRef.current).basePx);
      setEnabled(!motionMq.matches);
    };
    update();
    motionMq.addEventListener("change", update);
    mobileMq.addEventListener("change", update);
    return () => {
      motionMq.removeEventListener("change", update);
      mobileMq.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let ctxRevert: (() => void) | undefined;
    let floatTween: { kill: () => void } | null = null;

    (async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const robot = robotRef.current;
      const floatEl = floatRef.current;
      const journey = document.getElementById("aiva-journey");
      const hero = document.getElementById("home-hero");
      if (!robot || !journey || !hero) return;

      const mode = () => layoutRef.current;
      const heroOrigin = () => document.querySelector("[data-aiva-hero-origin]");
      const heroVisual = () => document.querySelector("[data-aiva-hero-visual]");

      const startFloat = () => {
        floatTween?.kill();
        if (!floatEl) return;
        const mobile = mode() === "mobile";
        floatTween = gsap.to(floatEl, {
          y: mobile ? -9 : -8,
          x: mobile ? 6 : 0,
          rotation: mobile ? 3 : 0,
          duration: mobile ? 2.6 : 2.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      };

      const stopFloat = () => {
        floatTween?.kill();
        floatTween = null;
        if (floatEl) gsap.set(floatEl, { y: 0, x: 0, rotation: 0 });
      };

      const moveToWaypoint = (
        id: AivaWaypointId,
        msg: string,
        duration = 0.85,
      ) => {
        activeId.current = id;
        const current = mode();

        let x: number;
        let y: number;
        let scale: number;
        let size: number;
        let rotation: number;

        if (current === "mobile") {
          const t = mobileAnchorToTransform(id);
          x = t.x;
          y = t.y;
          scale = t.scale;
          size = t.size;
          rotation = t.rotation;
        } else {
          const dock = journey.querySelector(`[data-aiva-dock="${id}"]`);
          if (!dock) return;
          scale = AIVA_DOCK_SCALES[id];
          const t = rectToTransform(dock, scale, "desktop");
          x = t.x;
          y = t.y;
          size = t.size;
          rotation = AIVA_DOCK_ROTATION[id] ?? 0;
        }

        setBubblePlacement(bubblePlacementFor(x, y, size, current));
        stopFloat();
        gsap.to(robot, {
          x,
          y,
          scale,
          rotation,
          opacity: 1,
          duration,
          ease: current === "mobile" ? "power2.out" : "power3.out",
          overwrite: true,
          onComplete: startFloat,
        });
        setMessage(msg);
        setBubbleVisible(true);
      };

      const handoffFromHero = () => {
        const origin = heroOrigin();
        const visual = heroVisual();
        if (!origin) return;

        journeyActive.current = true;
        const current = mode();
        const { heroScale, guideScale } = layoutConfig(current);
        const { x, y, size } = rectToTransform(origin, heroScale, current);

        stopFloat();
        gsap.set(robot, { x, y, scale: heroScale, opacity: 1, rotation: 0 });
        setBubbleVisible(false);
        if (visual) gsap.to(visual, { opacity: 0, duration: 0.25 });

        gsap.to(robot, {
          scale: guideScale,
          duration: current === "mobile" ? 0.75 : 0.95,
          ease: "power3.out",
          onComplete: () => {
            const wp = AIVA_WAYPOINTS.find((w) => w.id === "intro");
            if (wp) moveToWaypoint("intro", wp.message, current === "mobile" ? 0.65 : 0.8);
            else startFloat();
          },
        });
        setBubblePlacement(bubblePlacementFor(x, y, size, current));
      };

      const returnToHero = () => {
        journeyActive.current = false;
        activeId.current = null;
        stopFloat();
        setBubbleVisible(false);
        setMessage("");
        gsap.to(robot, { opacity: 0, duration: 0.35 });
        const visual = heroVisual();
        if (visual) gsap.to(visual, { opacity: 1, duration: 0.4 });
      };

      const ctx = gsap.context(() => {
        const { heroScale } = layoutConfig(mode());
        gsap.set(robot, {
          opacity: 0,
          scale: heroScale,
          x: -400,
          y: 0,
          transformOrigin: "center center",
        });

        ScrollTrigger.create({
          trigger: hero,
          start: mode() === "mobile" ? "bottom 88%" : "bottom 80%",
          onEnter: handoffFromHero,
          onLeaveBack: returnToHero,
        });

        AIVA_WAYPOINTS.forEach((wp) => {
          const chapter = journey.querySelector(`[data-aiva-chapter="${wp.id}"]`);
          const dock = journey.querySelector(`[data-aiva-dock="${wp.id}"]`);
          const trigger = chapter ?? dock;
          if (!trigger) return;
          if (mode() === "desktop" && !dock) return;

          ScrollTrigger.create({
            trigger,
            start: mode() === "mobile" ? "top 72%" : "top 68%",
            end: "bottom 32%",
            onEnter: () => {
              if (!journeyActive.current) return;
              moveToWaypoint(wp.id, wp.message);
            },
            onEnterBack: () => {
              if (!journeyActive.current) return;
              moveToWaypoint(wp.id, wp.message);
            },
          });
        });

        const finalChapter = journey.querySelector('[data-aiva-chapter="final"]');
        if (finalChapter) {
          ScrollTrigger.create({
            trigger: finalChapter,
            start: "bottom 92%",
            onLeave: () => {
              stopFloat();
              gsap.to(robot, { opacity: 0, duration: 0.45 });
              setBubbleVisible(false);
            },
            onEnterBack: () => {
              if (!journeyActive.current) return;
              const wp = AIVA_WAYPOINTS.find((w) => w.id === "final");
              if (wp) moveToWaypoint("final", wp.message);
            },
          });
        }
      });

      const refresh = () => {
        const prev = layoutRef.current;
        layoutRef.current = getLayoutMode();
        setRobotWidth(layoutConfig(layoutRef.current).basePx);

        ScrollTrigger.refresh();
        const id = activeId.current;
        if (!id || !journeyActive.current) return;
        if (prev !== layoutRef.current) {
          const wp = AIVA_WAYPOINTS.find((w) => w.id === id);
          if (wp) moveToWaypoint(id, wp.message, 0.35);
          return;
        }
        const wp = AIVA_WAYPOINTS.find((w) => w.id === id);
        if (wp) moveToWaypoint(id, wp.message, 0.45);
      };

      window.addEventListener("resize", refresh);
      ctxRevert = () => {
        window.removeEventListener("resize", refresh);
        stopFloat();
        ctx.revert();
      };
    })();

    return () => ctxRevert?.();
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={robotRef}
      className="pointer-events-none fixed left-0 top-0 z-[25] will-change-transform"
      style={{ width: robotWidth }}
      aria-hidden
    >
      <div ref={floatRef} className="relative h-full w-full">
        <div className="absolute -inset-8 rounded-full bg-primary/18 blur-2xl md:-inset-10 md:blur-3xl" aria-hidden />
        <Image
          src={AIVA_ROBOT_IMAGE}
          alt=""
          width={AIVA_ROBOT_BASE_PX}
          height={AIVA_ROBOT_BASE_PX}
          className="relative z-10 h-auto w-full drop-shadow-[0_20px_48px_rgba(62,207,142,0.38)] md:drop-shadow-[0_24px_56px_rgba(62,207,142,0.38)]"
        />
        <AivaSpeechBubble
          message={message}
          visible={bubbleVisible && !!message}
          placement={bubblePlacement}
          className="max-w-[min(260px,calc(100vw-5rem))] md:max-w-[280px]"
        />
      </div>
    </div>
  );
}

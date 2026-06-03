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
  AIVA_ROBOT_BASE_PX,
} from "@/lib/aiva-docks";
import { AIVA_WAYPOINTS, type AivaWaypointId } from "@/lib/aiva-waypoints";
import { AIVA_ROBOT_IMAGE } from "@/lib/site-config";

const HEADER_SAFE = 112;
const BOTTOM_SAFE = 220;
const SIDE_MARGIN = 24;

function clampPosition(
  x: number,
  y: number,
  scale: number,
): { x: number; y: number } {
  const size = AIVA_ROBOT_BASE_PX * scale;
  return {
    x: Math.max(SIDE_MARGIN, Math.min(window.innerWidth - size - SIDE_MARGIN, x)),
    y: Math.max(
      HEADER_SAFE,
      Math.min(window.innerHeight - size - BOTTOM_SAFE, y),
    ),
  };
}

function rectToTransform(el: Element, scale: number) {
  const rect = el.getBoundingClientRect();
  const size = AIVA_ROBOT_BASE_PX * scale;
  const rawX = rect.left + rect.width / 2 - size / 2;
  const rawY = rect.top + rect.height / 2 - size / 2;
  return { ...clampPosition(rawX, rawY, scale), scale, size };
}

function bubblePlacementFor(
  x: number,
  y: number,
  size: number,
): BubblePlacement {
  const cx = x + size / 2;
  const cy = y + size / 2;
  if (cy < window.innerHeight * 0.42) return "below";
  if (cx > window.innerWidth * 0.62) return "left";
  if (cx < window.innerWidth * 0.38) return "right";
  return "below";
}

export default function AivaScrollJourney() {
  const robotRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [bubblePlacement, setBubblePlacement] = useState<BubblePlacement>("left");
  const [enabled, setEnabled] = useState(false);
  const activeId = useRef<AivaWaypointId | null>(null);
  const journeyActive = useRef(false);

  useEffect(() => {
    const desktopMq = window.matchMedia("(min-width: 768px)");
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(desktopMq.matches && !motionMq.matches);
    update();
    desktopMq.addEventListener("change", update);
    motionMq.addEventListener("change", update);
    return () => {
      desktopMq.removeEventListener("change", update);
      motionMq.removeEventListener("change", update);
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

      const heroOrigin = () => document.querySelector("[data-aiva-hero-origin]");
      const heroVisual = () => document.querySelector("[data-aiva-hero-visual]");

      const startFloat = () => {
        floatTween?.kill();
        if (!floatEl) return;
        floatTween = gsap.to(floatEl, {
          y: -8,
          duration: 2.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      };

      const stopFloat = () => {
        floatTween?.kill();
        floatTween = null;
        if (floatEl) gsap.set(floatEl, { y: 0 });
      };

      const moveToDock = (
        dock: Element,
        msg: string,
        id: AivaWaypointId,
        duration = 0.85,
      ) => {
        activeId.current = id;
        const scale = AIVA_DOCK_SCALES[id];
        const { x, y, size } = rectToTransform(dock, scale);
        const rotation = AIVA_DOCK_ROTATION[id] ?? 0;

        setBubblePlacement(bubblePlacementFor(x, y, size));
        stopFloat();
        gsap.to(robot, {
          x,
          y,
          scale,
          rotation,
          opacity: 1,
          duration,
          ease: "power3.out",
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
        const { x, y, size } = rectToTransform(origin, AIVA_HERO_SCALE);

        stopFloat();
        gsap.set(robot, { x, y, scale: AIVA_HERO_SCALE, opacity: 1, rotation: 0 });
        setBubbleVisible(false);
        if (visual) gsap.to(visual, { opacity: 0, duration: 0.25 });

        gsap.to(robot, {
          scale: AIVA_GUIDE_SCALE,
          duration: 0.95,
          ease: "power3.out",
          onComplete: () => {
            const introDock = journey.querySelector('[data-aiva-dock="intro"]');
            const wp = AIVA_WAYPOINTS.find((w) => w.id === "intro");
            if (introDock && wp) moveToDock(introDock, wp.message, "intro", 0.8);
            else startFloat();
          },
        });
        setBubblePlacement(bubblePlacementFor(x, y, size));
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
        gsap.set(robot, {
          opacity: 0,
          scale: AIVA_HERO_SCALE,
          x: -400,
          y: 0,
          transformOrigin: "center center",
        });

        ScrollTrigger.create({
          trigger: hero,
          start: "bottom 80%",
          onEnter: handoffFromHero,
          onLeaveBack: returnToHero,
        });

        AIVA_WAYPOINTS.forEach((wp) => {
          const dock = journey.querySelector(`[data-aiva-dock="${wp.id}"]`);
          const chapter = journey.querySelector(`[data-aiva-chapter="${wp.id}"]`);
          const trigger = chapter ?? dock;
          if (!dock || !trigger) return;

          ScrollTrigger.create({
            trigger,
            start: "top 68%",
            end: "bottom 32%",
            onEnter: () => {
              if (!journeyActive.current) return;
              moveToDock(dock, wp.message, wp.id);
            },
            onEnterBack: () => {
              if (!journeyActive.current) return;
              moveToDock(dock, wp.message, wp.id);
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
              const dock = journey.querySelector('[data-aiva-dock="final"]');
              const wp = AIVA_WAYPOINTS.find((w) => w.id === "final");
              if (dock && wp) moveToDock(dock, wp.message, "final");
            },
          });
        }
      });

      const refresh = () => {
        ScrollTrigger.refresh();
        const id = activeId.current;
        if (!id || !journeyActive.current) return;
        const dock = journey.querySelector(`[data-aiva-dock="${id}"]`);
        const wp = AIVA_WAYPOINTS.find((w) => w.id === id);
        if (dock && wp) moveToDock(dock, wp.message, id, 0.45);
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
      className="pointer-events-none fixed left-0 top-0 z-20 hidden will-change-transform md:block"
      style={{ width: AIVA_ROBOT_BASE_PX }}
      aria-hidden
    >
      <div ref={floatRef} className="relative h-full w-full">
        <div className="absolute -inset-10 rounded-full bg-primary/18 blur-3xl" aria-hidden />
        <Image
          src={AIVA_ROBOT_IMAGE}
          alt=""
          width={AIVA_ROBOT_BASE_PX}
          height={AIVA_ROBOT_BASE_PX}
          className="relative z-10 h-auto w-full drop-shadow-[0_24px_56px_rgba(62,207,142,0.38)]"
        />
        <AivaSpeechBubble
          message={message}
          visible={bubbleVisible && !!message}
          placement={bubblePlacement}
          className="max-w-[280px]"
        />
      </div>
    </div>
  );
}

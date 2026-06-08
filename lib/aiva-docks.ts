import type { AivaWaypointId } from "@/lib/aiva-waypoints";

/** Overlay image width; GSAP scale multiplies this */
export const AIVA_ROBOT_BASE_PX = 240;

/** Smaller base on narrow screens */
export const AIVA_MOBILE_BASE_PX = 148;

/** Hero handoff on mobile (~163px visual) */
export const AIVA_MOBILE_HERO_SCALE = 1.1;

/** Guide size after hero handoff on mobile (~71px) */
export const AIVA_MOBILE_GUIDE_SCALE = 0.48;

/** Hero handoff size (~420px visual) */
export const AIVA_HERO_SCALE = 1.85;

/** Size after hero → guide transition (~190px) */
export const AIVA_GUIDE_SCALE = 0.78;

export const AIVA_DOCK_SCALES: Record<AivaWaypointId, number> = {
  intro: 0.72,
  services: 0.62,
  process: 0.58,
  projects: 0.65,
  "ai-workflow": 0.78,
  team: 0.58,
  testimonials: 0.62,
  tech: 0.52,
  faq: 0.55,
  final: 0.68,
};

export const AIVA_DOCK_ROTATION: Partial<Record<AivaWaypointId, number>> = {
  process: 2,
  "ai-workflow": -2,
};

export function getAivaScaledSize(id: AivaWaypointId): number {
  return AIVA_ROBOT_BASE_PX * AIVA_DOCK_SCALES[id];
}

/** Viewport-relative anchors for mobile floating journey (alternating sides, avoids chat FAB) */
export const AIVA_MOBILE_ANCHORS: Record<
  AivaWaypointId,
  { xRatio: number; yRatio: number; scale: number; rotation?: number }
> = {
  intro: { xRatio: 0.78, yRatio: 0.24, scale: 0.52, rotation: -5 },
  services: { xRatio: 0.14, yRatio: 0.36, scale: 0.48, rotation: 4 },
  process: { xRatio: 0.76, yRatio: 0.32, scale: 0.46, rotation: -3 },
  projects: { xRatio: 0.12, yRatio: 0.4, scale: 0.5, rotation: 5 },
  "ai-workflow": { xRatio: 0.72, yRatio: 0.28, scale: 0.5, rotation: -4 },
  team: { xRatio: 0.1, yRatio: 0.34, scale: 0.46, rotation: 3 },
  testimonials: { xRatio: 0.74, yRatio: 0.38, scale: 0.48, rotation: -5 },
  tech: { xRatio: 0.12, yRatio: 0.3, scale: 0.44, rotation: 4 },
  faq: { xRatio: 0.7, yRatio: 0.34, scale: 0.46, rotation: -3 },
  final: { xRatio: 0.22, yRatio: 0.42, scale: 0.5, rotation: 0 },
};

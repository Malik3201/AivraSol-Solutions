import type { AivaWaypointId } from "@/lib/aiva-waypoints";

/** Overlay image width; GSAP scale multiplies this */
export const AIVA_ROBOT_BASE_PX = 240;

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

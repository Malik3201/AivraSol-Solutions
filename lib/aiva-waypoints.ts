export type AivaWaypointId =
  | "intro"
  | "services"
  | "process"
  | "projects"
  | "ai-workflow"
  | "team"
  | "testimonials"
  | "tech"
  | "faq"
  | "final";

export interface AivaWaypoint {
  id: AivaWaypointId;
  message: string;
}

export const AIVA_WAYPOINTS: AivaWaypoint[] = [
  {
    id: "intro",
    message:
      "Hi, I'm Aiva. Let's walk through what AIVRASOL can build for you.",
  },
  {
    id: "services",
    message:
      "We combine strategy, design, development, and AI into practical digital systems.",
  },
  {
    id: "process",
    message:
      "A premium result starts with a clear process, not random features.",
  },
  {
    id: "projects",
    message:
      "Every project is designed to solve a real business problem.",
  },
  {
    id: "ai-workflow",
    message:
      "This is where automation and intelligence start working together.",
  },
  {
    id: "team",
    message:
      "AIVRASOL is built around people, creativity, and strong execution.",
  },
  {
    id: "testimonials",
    message:
      "Good systems create confidence, clarity, and better customer experiences.",
  },
  {
    id: "tech",
    message:
      "Modern tools help us build faster, safer, and more scalable products.",
  },
  {
    id: "faq",
    message: "A few answers before we start your next build.",
  },
  {
    id: "final",
    message:
      "Ready when you are. Let's turn your idea into a serious digital product.",
  },
];

export const AIVA_WAYPOINT_MESSAGES = Object.fromEntries(
  AIVA_WAYPOINTS.map((w) => [w.id, w.message]),
) as Record<AivaWaypointId, string>;

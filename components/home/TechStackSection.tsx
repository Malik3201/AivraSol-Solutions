import {
  Brain,
  Cloud,
  Code2,
  Database,
  LineChart,
} from "lucide-react";
import { AivaDock } from "@/components/home/AivaDock";
import { AivaGuide } from "@/components/home/aiva/AivaGuide";
import { AivaWaypoint } from "@/components/home/aiva/AivaWaypoint";
import { HomeSection } from "@/components/home/HomeSection";
import { HOME_GRID } from "@/components/home/home-layout";
import { AIVA_WAYPOINT_MESSAGES } from "@/lib/aiva-waypoints";
import { cn } from "@/lib/utils";

const CLUSTERS = [
  { icon: Code2, title: "Frontend", items: ["Next.js", "TypeScript", "Tailwind", "Framer Motion"] },
  { icon: Database, title: "Backend", items: ["Node APIs", "Edge routes", "MongoDB Atlas", "Mongoose"] },
  { icon: Brain, title: "AI", items: ["LongCat AI", "Aiva assistants", "Content tools", "Workflow bots"] },
  { icon: Cloud, title: "Cloud & Media", items: ["ImageKit CDN", "Cloud deploy", "Uploads", "Pipelines"] },
  { icon: LineChart, title: "SEO & Analytics", items: ["Metadata", "Schema.org", "Web Vitals", "Search IA"] },
];

export function TechStackSection() {
  return (
    <AivaWaypoint id="tech">
      <HomeSection
        id="tech"
        background="minimal"
        eyebrow="Technology"
        title="Built for speed, safety, and scale."
      >
        <AivaGuide message={AIVA_WAYPOINT_MESSAGES.tech} className="mb-8" />
        <div className="relative">
          <AivaDock id="tech" className="right-4 top-2 md:right-8" />
          <div className={cn(HOME_GRID, "gap-5")}>
            {CLUSTERS.map((cluster, i) => (
              <div
                key={cluster.title}
                className={cn(
                  "col-span-12 sm:col-span-6",
                  i < 3 ? "lg:col-span-4" : "lg:col-span-4",
                  i === 3 && "lg:col-start-3",
                  i === 4 && "lg:col-start-7",
                )}
              >
                <div className="h-full rounded-2xl border border-white/[0.08] bg-[rgba(10,16,14,0.55)] p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <cluster.icon className="size-4 text-primary" aria-hidden />
                    <h3 className="text-sm font-semibold text-primary">{cluster.title}</h3>
                    <span className="ml-auto size-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--aivra-glow)]" />
                  </div>
                  <div className="mb-3 h-px w-full bg-gradient-to-r from-primary/30 to-transparent" />
                  <ul className="space-y-1.5">
                    {cluster.items.map((item) => (
                      <li key={item} className="text-sm text-muted-foreground">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </HomeSection>
    </AivaWaypoint>
  );
}

"use client";

import {
  Brain,
  Cloud,
  Code2,
  Database,
  LineChart,
  type LucideIcon,
} from "lucide-react";
import { ResponsiveCardGrid } from "@/components/site/ResponsiveCardGrid";

const CLUSTERS: {
  icon: LucideIcon;
  title: string;
  items: string[];
}[] = [
  { icon: Code2, title: "Frontend", items: ["Next.js", "TypeScript", "Tailwind", "Framer Motion"] },
  { icon: Database, title: "Backend", items: ["Node APIs", "Edge routes", "MongoDB Atlas", "Mongoose"] },
  { icon: Brain, title: "AI", items: ["Groq AI", "Aiva assistants", "Content tools", "Workflow bots"] },
  { icon: Cloud, title: "Cloud & Media", items: ["ImageKit CDN", "Cloud deploy", "Uploads", "Pipelines"] },
  { icon: LineChart, title: "SEO & Analytics", items: ["Metadata", "Schema.org", "Web Vitals", "Search IA"] },
];

function TechClusterCard({
  icon: Icon,
  title,
  items,
}: {
  icon: LucideIcon;
  title: string;
  items: string[];
}) {
  return (
    <div className="h-full rounded-2xl border border-white/[0.08] bg-[rgba(10,16,14,0.55)] p-5">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="size-4 text-primary" aria-hidden />
        <h3 className="text-sm font-semibold text-primary">{title}</h3>
        <span className="ml-auto size-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--aivra-glow)]" />
      </div>
      <div className="mb-3 h-px w-full bg-gradient-to-r from-primary/30 to-transparent" />
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="text-sm text-muted-foreground">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TechStackCards() {
  return (
    <ResponsiveCardGrid
      items={CLUSTERS}
      keyExtractor={(c) => c.title}
      renderItem={(cluster) => <TechClusterCard {...cluster} />}
      carouselOnly
      autoPlay
      autoPlayInterval={5000}
      ariaLabel="Technology stack"
      slideClassName="w-[min(86vw,320px)] shrink-0 snap-center sm:w-[min(72vw,360px)] md:w-[min(42vw,380px)]"
    />
  );
}

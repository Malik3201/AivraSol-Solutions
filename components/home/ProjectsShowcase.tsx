import Link from "next/link";
import { ProjectSpotlight } from "@/components/home/ProjectSpotlight";
import { AivaDock } from "@/components/home/AivaDock";
import { AivaGuide } from "@/components/home/aiva/AivaGuide";
import { AivaWaypoint } from "@/components/home/aiva/AivaWaypoint";
import { HomeSection } from "@/components/home/HomeSection";
import { AIVA_WAYPOINT_MESSAGES } from "@/lib/aiva-waypoints";
import type { PublicProject } from "@/lib/api/types";
import { MagneticButton } from "@/components/site/MagneticButton";

export function ProjectsShowcase({ projects }: { projects: PublicProject[] }) {
  return (
    <AivaWaypoint id="projects">
      <HomeSection
        id="projects"
        background="stage"
        tall
        eyebrow="Work"
        title="Where strategy becomes measurable product."
      >
        <AivaGuide message={AIVA_WAYPOINT_MESSAGES.projects} className="mb-8" />
        <div className="mb-8 flex justify-end">
          <MagneticButton href="/projects" variant="outline" size="default">
            View Work
          </MagneticButton>
        </div>
        <div className="relative">
          <AivaDock id="projects" className="bottom-[28%] left-[58%] top-auto md:left-[52%]" />
          <ProjectSpotlight projects={projects} />
        </div>
        <p className="mt-8 text-center md:hidden">
          <Link href="/projects" className="text-sm text-primary">
            View all projects →
          </Link>
        </p>
      </HomeSection>
    </AivaWaypoint>
  );
}

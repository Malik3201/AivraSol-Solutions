import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { RemoteImage } from "@/components/site/RemoteImage";
import type { PublicProject } from "@/lib/api/types";
import { cn } from "@/lib/utils";

export function TeamProfileProjects({
  projects,
  className,
}: {
  projects: PublicProject[];
  className?: string;
}) {
  if (!projects.length) return null;

  return (
    <div className={cn("grid gap-4 sm:grid-cols-2", className)}>
      {projects.map((project) => (
        <Link
          key={project.id}
          href={`/projects/${project.slug}`}
          className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm transition-colors hover:border-primary/30"
        >
          <div className="relative aspect-[16/10] bg-[#0a100e]">
            {project.coverImage ? (
              <RemoteImage
                src={project.coverImage}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, 280px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-[#060a08]/90 to-transparent" />
          </div>
          <div className="p-4">
            <p className="text-[10px] uppercase tracking-[0.28em] text-primary">
              {project.industry ?? "Case study"}
            </p>
            <h4 className="mt-1 line-clamp-2 font-semibold text-white group-hover:text-primary-light">
              {project.title}
            </h4>
            <span className="mt-3 inline-flex items-center gap-1 text-xs text-primary">
              View project
              <ArrowUpRight className="size-3" aria-hidden />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { MagneticButton } from "@/components/site/MagneticButton";
import { PageContainer } from "@/components/site/PageContainer";
import { RemoteImage } from "@/components/site/RemoteImage";
import { getProjectHeroLead } from "@/components/projects/project-detail-utils";
import { buttonVariants } from "@/components/ui/button";
import type { PublicProject } from "@/lib/api/types";
import { cn } from "@/lib/utils";

export function ProjectDetailHero({ project }: { project: PublicProject }) {
  const lead = getProjectHeroLead(project);
  const meta = [project.clientName, project.industry].filter(Boolean) as string[];
  const tech = project.technologies?.filter(Boolean).slice(0, 5) ?? [];

  return (
    <section className="relative isolate min-h-[min(72vh,720px)] overflow-hidden border-b border-white/[0.06] sm:min-h-[min(80vh,820px)] md:min-h-[min(88vh,920px)]">
      {project.coverImage ? (
        <>
          <RemoteImage
            src={project.coverImage}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#060a08] via-[#060a08]/88 to-[#060a08]/40"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#060a08]/95 via-[#060a08]/50 to-transparent"
            aria-hidden
          />
        </>
      ) : (
        <div
          className="absolute inset-0 bg-[#060a08]"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(ellipse 70% 55% at 15% 35%, rgba(62,207,142,0.14), transparent 55%), radial-gradient(ellipse 45% 40% at 85% 15%, rgba(62,207,142,0.08), transparent 50%)",
          }}
        />
      )}

      <PageContainer className="relative z-10 flex min-h-[inherit] flex-col justify-end pb-12 pt-24 sm:pb-14 sm:pt-28 md:pb-20 md:pt-32">
        <Breadcrumbs
          className="mb-10 md:mb-12 [&_a]:text-white/70 [&_a:hover]:text-primary [&_li]:text-white/50 [&_span]:text-white/90"
          items={[
            { label: "Home", href: "/" },
            { label: "Projects", href: "/projects" },
            { label: project.title },
          ]}
        />

        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-8">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.28em] text-primary">
              <span className="size-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(62,207,94,0.8)]" />
              Case study
            </p>
            <h1 className="max-w-4xl text-3xl font-semibold leading-[1.06] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              {project.title}
            </h1>
            {meta.length > 0 ? (
              <p className="mt-4 text-sm font-medium uppercase tracking-[0.2em] text-white/55">
                {meta.join(" · ")}
              </p>
            ) : null}
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
              {lead}
            </p>
            {tech.length > 0 ? (
              <div className="mt-8 flex flex-wrap gap-2">
                {tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-xs text-white/80 backdrop-blur-sm"
                  >
                    {t}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-3 lg:col-span-4">
            {project.liveUrl ? (
              <MagneticButton
                href={project.liveUrl}
                size="lg"
                className="w-full [&_span]:inline-flex [&_span]:items-center [&_span]:justify-center"
              >
                View live project
                <ExternalLink className="ml-2 size-4" aria-hidden />
              </MagneticButton>
            ) : null}
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full border-white/20 bg-white/5 text-white hover:bg-white/10",
              )}
            >
              Start a similar project
              <ArrowRight className="ml-2 inline size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}

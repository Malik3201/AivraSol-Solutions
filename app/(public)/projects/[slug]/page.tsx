import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProjectDetailHero } from "@/components/projects/ProjectDetailHero";
import { ProjectOverview } from "@/components/projects/ProjectOverview";
import { ProjectResults } from "@/components/projects/ProjectResults";
import { RelatedServices } from "@/components/projects/RelatedServices";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { PageCTA } from "@/components/site/PageCTA";
import { PageSection } from "@/components/site/PageSection";
import { PremiumCard } from "@/components/site/PremiumCard";
import { PAGE_GRID } from "@/lib/page-layout";
import { fetchProjectDetail } from "@/lib/public-data";
import { buildProjectSchema, createPageMetadata } from "@/lib/seo";
import type { PublicProject } from "@/lib/api/types";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const data = await fetchProjectDetail(slug);
  if (!data) {
    return createPageMetadata({ title: "Project", path: `/projects/${slug}` });
  }
  return createPageMetadata({
    title: data.seo.title,
    description: data.seo.description,
    path: `/projects/${slug}`,
    image: data.seo.image,
  });
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const data = await fetchProjectDetail(slug);
  if (!data) notFound();

  const project = data.project as PublicProject;
  const { relatedServices } = data;
  const hasGallery = (project.gallery?.filter(Boolean).length ?? 0) > 0;

  return (
    <div className="bg-[#060a08]">
      <JsonLd data={buildProjectSchema(project)} />
      <ProjectDetailHero project={project} />

      <PageSection
        background="editorial"
        className="border-t-0 py-20 md:py-28"
        containerClassName="max-w-[1180px]"
      >
        <ProjectOverview project={project} />
      </PageSection>

      {hasGallery ? (
        <PageSection
          background="stage"
          eyebrow="Showcase"
          title="Project gallery"
          description="Screens, flows, and deliverables from this engagement."
        >
          <ProjectGallery images={project.gallery} title={project.title} />
        </PageSection>
      ) : null}

      <PageSection
        background="minimal"
        eyebrow="Delivery"
        title="Challenge & approach"
        description="How we framed the problem and executed the solution."
      >
        <div className={PAGE_GRID}>
          <PremiumCard className="col-span-12 lg:col-span-6 md:p-8">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Challenge
            </h3>
            <p className="text-base leading-relaxed text-muted-foreground">
              {project.problem ||
                "The client needed a clearer digital system to support growth, reduce manual work, and improve customer experience."}
            </p>
          </PremiumCard>
          <PremiumCard className="col-span-12 lg:col-span-6 md:p-8">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Approach
            </h3>
            <p className="text-base leading-relaxed text-muted-foreground">
              {project.solution ||
                "AIVRASOL shaped strategy, UX, engineering, and intelligent layers into one cohesive platform."}
            </p>
          </PremiumCard>
        </div>
      </PageSection>

      <PageSection
        background="process"
        eyebrow="Impact"
        title="Outcomes"
        description="Measurable results and qualitative wins from the delivery."
      >
        <ProjectResults results={project.results} />
      </PageSection>

      {(project.technologies?.length ?? 0) > 0 ? (
        <PageSection background="calm" eyebrow="Stack" title="Technology">
          <div className="flex flex-wrap gap-2">
            {project.technologies!.map((t) => (
              <span
                key={t}
                className="rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-sm text-foreground/90"
              >
                {t}
              </span>
            ))}
          </div>
        </PageSection>
      ) : null}

      {relatedServices.length > 0 ? (
        <PageSection
          background="bento"
          eyebrow="Capabilities"
          title="Services involved"
          description="Explore the service lines that powered this project."
        >
          <RelatedServices services={relatedServices} />
        </PageSection>
      ) : null}

      <PageCTA
        title="Want results like this?"
        description="Share your goals and we will scope a project with the right team and timeline."
        primaryLabel="Start a Project"
        secondaryLabel="View all projects"
        secondaryHref="/projects"
      />
    </div>
  );
}

import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceDetailHero } from "@/components/services/ServiceDetailHero";
import { ServiceFeatureGrid } from "@/components/services/ServiceFeatureGrid";
import { ServiceMediaGallery } from "@/components/services/ServiceMediaGallery";
import { ServiceOverview } from "@/components/services/ServiceOverview";
import { ServiceProcess } from "@/components/services/ServiceProcess";
import { RelatedProjects } from "@/components/services/RelatedProjects";
import { PageCTA } from "@/components/site/PageCTA";
import { PageSection } from "@/components/site/PageSection";
import { PremiumCard } from "@/components/site/PremiumCard";
import { fetchServiceDetail } from "@/lib/public-data";
import { buildServiceSchema, createPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const data = await fetchServiceDetail(slug);
  if (!data) {
    return createPageMetadata({ title: "Service", path: `/services/${slug}` });
  }
  return createPageMetadata({
    title: data.seo.title,
    description: data.seo.description,
    path: `/services/${slug}`,
    image: data.seo.image,
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const data = await fetchServiceDetail(slug);
  if (!data) notFound();

  const { service, relatedProjects, relatedFAQs } = data;
  const hasGallery = (service.gallery?.filter(Boolean).length ?? 0) > 0;

  return (
    <div className="bg-[#060a08]">
      <JsonLd data={buildServiceSchema(service)} />
      <ServiceDetailHero service={service} />

      <PageSection
        background="editorial"
        className="border-t-0 py-20 md:py-28"
        containerClassName="max-w-[1180px]"
      >
        <ServiceOverview service={service} />
      </PageSection>

      <PageSection
        background="minimal"
        eyebrow="Capabilities"
        title="What this includes"
        description="Core deliverables and outcomes you can expect from this engagement."
      >
        <ServiceFeatureGrid features={service.features ?? []} />
      </PageSection>

      <PageSection
        background="process"
        eyebrow="Method"
        title="How we deliver"
        description="A clear, phased approach—so you always know what happens next."
      >
        <ServiceProcess steps={service.processSteps} />
      </PageSection>

      {hasGallery ? (
        <PageSection
          background="stage"
          eyebrow="Showcase"
          title="In action"
          description="Visual snapshots from this capability—interfaces, flows, and real-world context."
        >
          <ServiceMediaGallery images={service.gallery} title={service.title} />
        </PageSection>
      ) : null}

      {relatedProjects.length > 0 ? (
        <PageSection
          background="bento"
          eyebrow="Proof"
          title="Related work"
          description="Case studies and launches connected to this service line."
        >
          <RelatedProjects projects={relatedProjects} />
        </PageSection>
      ) : null}

      {relatedFAQs.length > 0 ? (
        <PageSection
          background="calm"
          eyebrow="FAQ"
          title="Common questions"
          description="Quick answers before you reach out to the team."
        >
          <div className="mx-auto max-w-3xl space-y-4">
            {relatedFAQs.map((faq) => (
              <PremiumCard key={faq.id} className="md:p-7">
                <h3 className="text-lg font-medium text-white">{faq.question}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {faq.answer}
                </p>
              </PremiumCard>
            ))}
          </div>
        </PageSection>
      ) : null}

      <PageCTA
        title={`Ready to explore ${service.title}?`}
        description="Tell us about your goals—we'll recommend the right scope, timeline, and team."
        primaryLabel="Start a Project"
        secondaryLabel="Browse all services"
        secondaryHref="/services"
      />
    </div>
  );
}

import { PageHero } from "@/components/site/PageHero";
import { SectionShell } from "@/components/site/SectionShell";
import { CTASection } from "@/components/site/CTASection";
import { createPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return createPageMetadata({
    title: slug.replace(/-/g, " "),
    path: `/projects/${slug}`,
  });
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;

  return (
    <>
      <PageHero
        eyebrow="Case Study"
        title={slug.replace(/-/g, " ")}
        description="Challenge, solution, stack, outcomes, and visual narrative — presented with editorial structure."
      />
      <SectionShell>
        <p className="text-muted-foreground">
          Case study body from <code>/api/public/projects/{slug}</code> will render here.
        </p>
      </SectionShell>
      <CTASection />
    </>
  );
}

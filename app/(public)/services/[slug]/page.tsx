import { PageHero } from "@/components/site/PageHero";
import { SectionShell } from "@/components/site/SectionShell";
import { CTASection } from "@/components/site/CTASection";
import { createPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return createPageMetadata({
    title: slug.replace(/-/g, " "),
    path: `/services/${slug}`,
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;

  return (
    <>
      <PageHero
        eyebrow="Service"
        title={slug.replace(/-/g, " ")}
        description="Detailed service narrative with process, capabilities, proof, and conversion pathways."
      />
      <SectionShell>
        <p className="text-muted-foreground">
          Dynamic service content from <code>/api/public/services/{slug}</code> will hydrate
          this template in the next phase.
        </p>
      </SectionShell>
      <CTASection />
    </>
  );
}

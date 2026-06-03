import { PageHero } from "@/components/site/PageHero";
import { SectionShell } from "@/components/site/SectionShell";
import { CTASection } from "@/components/site/CTASection";
import { createPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return createPageMetadata({
    title: slug.replace(/-/g, " "),
    path: `/blog/${slug}`,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  return (
    <>
      <PageHero
        eyebrow="Article"
        title={slug.replace(/-/g, " ")}
        description="Long-form insight article with structured reading experience and related posts."
      />
      <SectionShell size="narrow">
        <p className="text-muted-foreground">
          Article content from <code>/api/public/blog/{slug}</code> will render here.
        </p>
      </SectionShell>
      <CTASection />
    </>
  );
}

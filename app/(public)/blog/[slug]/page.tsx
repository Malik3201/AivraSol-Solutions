import { RemoteImage } from "@/components/site/RemoteImage";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { BlogArticle } from "@/components/blog/BlogArticle";
import { BlogMeta } from "@/components/blog/BlogMeta";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { PageCTA } from "@/components/site/PageCTA";
import { PageSection } from "@/components/site/PageSection";
import { fetchBlogDetail } from "@/lib/public-data";
import { buildBlogSchema, createPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const data = await fetchBlogDetail(slug);
  if (!data) {
    return createPageMetadata({ title: "Article", path: `/blog/${slug}` });
  }
  return createPageMetadata({
    title: data.seo.title,
    description: data.seo.description,
    path: `/blog/${slug}`,
    image: data.seo.image,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const data = await fetchBlogDetail(slug);
  if (!data) notFound();

  const { post, relatedPosts } = data;
  const content = (post as { content?: string }).content ?? post.excerpt ?? "";

  return (
    <>
      <JsonLd data={buildBlogSchema(post)} />
      <div className="border-b border-white/[0.06] bg-[#060a08]">
        <div className="mx-auto max-w-[1180px] px-6 py-8 sm:px-8 lg:px-10">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blog" },
              { label: post.title },
            ]}
          />
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl">
            {post.title}
          </h1>
          <div className="mt-6">
            <BlogMeta post={post} />
          </div>
          {post.coverImage ? (
            <div className="relative mt-10 aspect-[21/9] max-w-4xl overflow-hidden rounded-2xl border border-white/[0.08]">
              <RemoteImage src={post.coverImage} alt="" fill className="object-cover" priority />
            </div>
          ) : null}
        </div>
      </div>

      <PageSection background="minimal" containerClassName="max-w-3xl">
        <BlogArticle content={content} />
      </PageSection>

      {relatedPosts.length > 0 ? (
        <PageSection background="calm" title="Related reading">
          <RelatedPosts posts={relatedPosts} />
        </PageSection>
      ) : null}

      <PageCTA title="Ready to apply these ideas?" primaryLabel="Start a Project" />
    </>
  );
}

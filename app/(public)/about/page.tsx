import { Target, Layers, Sparkles } from "lucide-react";
import { PageCTA } from "@/components/site/PageCTA";
import { PageHero } from "@/components/site/PageHero";
import { PageSection } from "@/components/site/PageSection";
import { PremiumCard } from "@/components/site/PremiumCard";
import { SystemStageVisual } from "@/components/site/SystemStageVisual";
import { PAGE_GRID } from "@/lib/page-layout";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "About AIVRASOL",
  description:
    "AIVRASOL is a digital and AI studio shaping premium websites, automation workflows, and intelligent platforms for ambitious brands.",
  path: "/about",
});

const PHILOSOPHY = [
  { icon: Target, title: "Strategy before screens", text: "We define business context, users, and success metrics before visual or technical decisions." },
  { icon: Layers, title: "Systems before shortcuts", text: "Architecture, data flow, and automation are designed to scale — not patched together later." },
  { icon: Sparkles, title: "Experience before decoration", text: "Interfaces should feel intentional, clear, and credible — never generic or overloaded." },
];

const VALUES = [
  { title: "Clarity", text: "Complex ideas translated into understandable product experiences." },
  { title: "Intelligence", text: "Applied AI where it reduces friction and improves outcomes." },
  { title: "Craft", text: "Design and engineering standards that feel senior and deliberate." },
  { title: "Performance", text: "Fast, SEO-ready, maintainable systems built for growth." },
  { title: "Trust", text: "Transparent process, realistic scope, and reliable delivery." },
];

const PROCESS = [
  { step: "01", title: "Understand", detail: "Business goals, users, constraints, and existing systems." },
  { step: "02", title: "Design", detail: "UX, architecture, and a delivery roadmap teams can follow." },
  { step: "03", title: "Build", detail: "Engineering, integrations, AI layers, and quality assurance." },
  { step: "04", title: "Improve", detail: "Launch, measure, and iterate with clear priorities." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About AIVRASOL"
        title="Digital systems shaped with strategy, intelligence, and craft."
        description="AIVRASOL helps businesses turn ideas into premium websites, automation workflows, AI assistants, and scalable digital platforms."
        visual={<SystemStageVisual />}
      />

      <PageSection
        background="editorial"
        eyebrow="Studio"
        title="A product-minded studio for serious digital work."
        description="We partner with teams that need more than a template — strategy, premium UX, full-stack engineering, and applied intelligence in one delivery model."
      >
        <div className={PAGE_GRID}>
          <div className="col-span-12 space-y-6 lg:col-span-5">
            <PremiumCard>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Every engagement starts with understanding how your business sells, operates,
                and scales. We then design systems — websites, automation, AI assistants — that
                support those realities.
              </p>
            </PremiumCard>
          </div>
          <div className="col-span-12 lg:col-span-7">
            <PremiumCard>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Our work spans discovery, interface design, Next.js platforms, workflow automation,
                and intelligent layers your team can adopt. The outcome is clarity for users and
                measurable progress for leadership.
              </p>
            </PremiumCard>
          </div>
        </div>
      </PageSection>

      <PageSection
        background="minimal"
        title="Built around clarity before complexity."
        description="Three principles guide how we scope, design, and ship."
      >
        <div className={PAGE_GRID}>
          {PHILOSOPHY.map((item) => (
            <PremiumCard key={item.title} className="col-span-12 md:col-span-4">
              <item.icon className="mb-4 size-6 text-primary" aria-hidden />
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{item.text}</p>
            </PremiumCard>
          ))}
        </div>
      </PageSection>

      <PageSection background="bento" title="What we stand for">
        <div className={PAGE_GRID}>
          {VALUES.map((v, i) => (
            <PremiumCard
              key={v.title}
              className={
                i === 0
                  ? "col-span-12 md:col-span-6"
                  : i === 1
                    ? "col-span-12 md:col-span-6"
                    : "col-span-12 sm:col-span-6 lg:col-span-4"
              }
            >
              <h3 className="text-lg font-semibold text-primary">{v.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{v.text}</p>
            </PremiumCard>
          ))}
        </div>
      </PageSection>

      <PageSection background="process" title="How engagements move forward">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-white/[0.08] bg-[rgba(10,16,14,0.55)] p-5"
            >
              <span className="text-xs font-semibold text-primary">{p.step}</span>
              <h3 className="mt-3 font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.detail}</p>
            </div>
          ))}
        </div>
      </PageSection>

      <PageCTA
        title="Have an idea that needs structure?"
        description="Tell us what you are building — we will help shape scope, systems, and a clear path to launch."
        primaryLabel="Start a Project"
      />
    </>
  );
}

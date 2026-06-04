import { ContactIntakeConsole } from "@/components/contact/ContactIntakeConsole";
import { ContactProcess } from "@/components/contact/ContactProcess";
import { ContactWorkspace } from "@/components/contact/ContactWorkspace";
import { PageHero } from "@/components/site/PageHero";
import { PageSection } from "@/components/site/PageSection";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Contact",
  description:
    "Contact AIVRASOL to discuss websites, automation, AI products, and intelligent digital systems for your business.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact AIVRASOL"
        title="Let's build your next intelligent digital system."
        description="Tell us what you want to build. We'll help turn the idea into a clear strategy, premium experience, and scalable technical direction."
        visual={<ContactIntakeConsole />}
      />

      <PageSection background="editorial">
        <ContactWorkspace />
      </PageSection>

      <PageSection background="minimal" title="What happens next">
        <ContactProcess />
      </PageSection>

      <PageSection background="cta" className="border-b-0">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] uppercase tracking-[0.34em] text-primary">Trust</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white md:text-3xl">
            Clear process. No vague promises.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Every inquiry is reviewed by the AIVRASOL team. You receive honest scope guidance,
            realistic timelines, and a practical path — whether you need a website, automation
            layer, or full AI-enabled platform.
          </p>
        </div>
      </PageSection>
    </>
  );
}

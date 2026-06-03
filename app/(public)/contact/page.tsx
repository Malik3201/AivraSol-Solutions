import { PageHero } from "@/components/site/PageHero";
import { SectionShell } from "@/components/site/SectionShell";
import { PremiumCard } from "@/components/site/PremiumCard";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Contact",
  description:
    "Contact AIVRASOL to discuss AI products, automation, and premium digital initiatives.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's build what's next."
        description="Share your goals and constraints. We'll respond with a clear path forward — no generic pitch decks."
      />
      <SectionShell size="narrow">
        <PremiumCard>
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Contact form</p>
          <h2 className="mt-3 text-2xl font-semibold">Start the conversation</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            The interactive contact form with AI message assist will connect to{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">/api/contact</code> in
            the next phase. Fields: name, email, service interest, budget, and message.
          </p>
        </PremiumCard>
      </SectionShell>
    </>
  );
}

import { MagneticButton } from "@/components/site/MagneticButton";
import { SectionShell } from "@/components/site/SectionShell";
import { AnimatedBackground } from "@/components/site/AnimatedBackground";
import { FadeIn } from "@/components/animations/FadeIn";

export function CTASection({
  title = "Ready to build what's next?",
  description = "Partner with AIVRASOL for AI products, automation, and premium digital experiences crafted for ambitious brands.",
  primaryLabel = "Start a Project",
  primaryHref = "/contact",
  secondaryLabel = "View Our Work",
  secondaryHref = "/projects",
}: {
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  return (
    <SectionShell className="py-0">
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-surface/90 px-6 py-14 md:px-12 md:py-16">
        <AnimatedBackground variant="subtle" className="rounded-3xl" />
        <FadeIn className="relative z-10 mx-auto max-w-3xl text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-primary">
            Let&apos;s collaborate
          </p>
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          <p className="mt-5 text-muted-foreground md:text-lg">{description}</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton href={primaryHref} size="lg">
              {primaryLabel}
            </MagneticButton>
            <MagneticButton href={secondaryHref} variant="outline" size="lg">
              {secondaryLabel}
            </MagneticButton>
          </div>
        </FadeIn>
      </div>
    </SectionShell>
  );
}

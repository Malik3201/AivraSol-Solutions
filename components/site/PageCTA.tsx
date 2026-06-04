import Link from "next/link";
import { MagneticButton } from "@/components/site/MagneticButton";
import { PageSection } from "@/components/site/PageSection";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PageCTA({
  title,
  description,
  primaryLabel = "Start a Project",
  primaryHref = "/contact",
  secondaryLabel,
  secondaryHref,
}: {
  title: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  return (
    <PageSection background="cta" className="border-b-0">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-primary/25 bg-[rgba(10,20,14,0.85)] px-5 py-10 text-center sm:rounded-[2rem] sm:px-8 sm:py-12 md:px-14 md:py-14">
        <p className="text-[11px] uppercase tracking-[0.34em] text-primary">Next step</p>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">{description}</p>
        ) : null}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <MagneticButton href={primaryHref} size="lg">
            {primaryLabel}
          </MagneticButton>
          {secondaryLabel && secondaryHref ? (
            <Link
              href={secondaryHref}
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              {secondaryLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </PageSection>
  );
}

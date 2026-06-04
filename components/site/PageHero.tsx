import type { ReactNode } from "react";
import { FadeIn } from "@/components/animations/FadeIn";
import { AmbientScene } from "@/components/home/AmbientScene";
import { PageContainer } from "@/components/site/PageContainer";
import { PAGE_GRID } from "@/lib/page-layout";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  visual,
  className,
  size = "default",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  visual?: ReactNode;
  className?: string;
  size?: "default" | "compact";
}) {
  const minH =
    size === "compact"
      ? "min-h-[42vh] sm:min-h-[50vh]"
      : "min-h-[48vh] sm:min-h-[55vh] md:min-h-[62vh]";

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden border-b border-white/[0.06] bg-[#060a08]",
        minH,
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <AmbientScene variant="hero" />
      </div>
      <PageContainer
        className={cn(
          PAGE_GRID,
          "relative z-10 flex min-h-[inherit] items-center gap-8 py-14 sm:gap-10 sm:py-16 md:gap-12 md:py-20 lg:py-24",
        )}
      >
        <FadeIn className={cn("col-span-12", visual && "lg:col-span-7")}>
          {eyebrow ? (
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.34em] text-primary">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="max-w-3xl text-3xl font-semibold leading-[1.08] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {description}
            </p>
          ) : null}
          {children ? <div className="mt-8">{children}</div> : null}
        </FadeIn>
        {visual ? (
          <FadeIn
            delay={0.08}
            direction="left"
            className="col-span-12 flex justify-center lg:col-span-5 lg:justify-end"
          >
            {visual}
          </FadeIn>
        ) : null}
      </PageContainer>
    </section>
  );
}

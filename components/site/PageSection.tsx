import type { ReactNode } from "react";
import {
  AmbientScene,
  type SectionBackground,
} from "@/components/home/AmbientScene";
import { PageContainer } from "@/components/site/PageContainer";
import { PAGE_EYEBROW, PAGE_H2 } from "@/lib/page-layout";
import { cn } from "@/lib/utils";

export function PageSection({
  children,
  background = "minimal",
  className,
  containerClassName,
  id,
  eyebrow,
  title,
  description,
  headerClassName,
}: {
  children: ReactNode;
  background?: SectionBackground;
  className?: string;
  containerClassName?: string;
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  headerClassName?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative isolate overflow-hidden scroll-mt-24 border-t border-white/[0.06] bg-[#060a08] py-16 sm:py-20 md:py-28 lg:py-32",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <AmbientScene variant={background} />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
      </div>
      <PageContainer className={cn("relative z-10", containerClassName)}>
        {(eyebrow || title) && (
          <header className={cn("mb-10 md:mb-12", headerClassName)}>
            {eyebrow ? <p className={PAGE_EYEBROW}>{eyebrow}</p> : null}
            {title ? <h2 className={PAGE_H2}>{title}</h2> : null}
            {description ? (
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {description}
              </p>
            ) : null}
          </header>
        )}
        {children}
      </PageContainer>
    </section>
  );
}

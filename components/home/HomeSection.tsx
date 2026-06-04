import type { ReactNode } from "react";
import { AmbientScene, type SectionBackground } from "@/components/home/AmbientScene";
import { HomeContainer } from "@/components/home/HomeContainer";
import { HOME_EYEBROW, HOME_H2 } from "@/components/home/home-layout";
import { cn } from "@/lib/utils";

export function HomeSection({
  children,
  background = "none",
  className,
  containerClassName,
  id,
  eyebrow,
  title,
  description,
  tall = false,
}: {
  children: ReactNode;
  background?: SectionBackground;
  className?: string;
  containerClassName?: string;
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  /** Complex sections: projects, AI workflow */
  tall?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative isolate overflow-hidden scroll-mt-24 border-t border-white/[0.06] bg-[#060a08] py-16 sm:py-20 md:py-28 lg:py-36",
        tall && "md:min-h-[640px]",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        aria-hidden
      >
        <AmbientScene variant={background} />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
      </div>

      <HomeContainer className={cn("relative z-10", containerClassName)}>
        {(eyebrow || title) && (
          <header className="mb-10 md:mb-12">
            {eyebrow ? <p className={HOME_EYEBROW}>{eyebrow}</p> : null}
            {title ? <h2 className={HOME_H2}>{title}</h2> : null}
            {description ? (
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {description}
              </p>
            ) : null}
          </header>
        )}
        {children}
      </HomeContainer>
    </section>
  );
}

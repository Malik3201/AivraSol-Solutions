import { AnimatedBackground } from "@/components/site/AnimatedBackground";
import { FadeIn } from "@/components/animations/FadeIn";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  className,
  size = "default",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  size?: "default" | "large";
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-border/50",
        size === "large" ? "py-28 md:py-36" : "py-20 md:py-28",
        className,
      )}
    >
      <AnimatedBackground variant="hero" />
      <div className="container relative z-10 mx-auto max-w-6xl px-4 md:px-6">
        <FadeIn>
          {eyebrow ? (
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-primary">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
          {children ? <div className="mt-10">{children}</div> : null}
        </FadeIn>
      </div>
    </section>
  );
}

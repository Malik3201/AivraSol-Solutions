import Link from "next/link";
import { FadeIn } from "@/components/animations/FadeIn";
import { AmbientScene } from "@/components/home/AmbientScene";
import { HeroRobotStage } from "@/components/home/HeroRobotStage";
import { HomeContainer } from "@/components/home/HomeContainer";
import { HOME_GRID } from "@/components/home/home-layout";
import { PremiumMetric } from "@/components/home/PremiumMetric";
import { MagneticButton } from "@/components/site/MagneticButton";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const METRICS = [
  { value: "40+", label: "Digital workflows mapped" },
  { value: "12+", label: "Service categories" },
  { value: "98%", label: "Performance-first approach" },
];

export function HomeHero() {
  return (
    <section
      id="home-hero"
      className="relative isolate min-h-[calc(100vh-72px)] overflow-hidden border-t-0 border-b border-white/[0.06] bg-[#060a08]"
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <AmbientScene variant="hero" />
      </div>

      <HomeContainer
        className={cn(
          HOME_GRID,
          "relative z-10 min-h-[calc(100vh-72px)] items-center gap-10 py-16 lg:gap-8 lg:py-20",
        )}
      >
        <FadeIn className="col-span-12 flex flex-col justify-center lg:col-span-7">
          <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.38em] text-primary">
            AIVRASOL AI STUDIO
          </p>
          <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl">
            Intelligent Digital Systems for Brands{" "}
            <span className="text-gradient-aivra">Ready to Scale</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            AIVRASOL designs premium websites, AI assistants, automation workflows,
            and scalable digital platforms that turn business ideas into intelligent
            digital experiences.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <MagneticButton href="/contact" size="lg">
              Start a Project
            </MagneticButton>
            <Link
              href="/services"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Explore Services
            </Link>
          </div>
          <div className="mt-12 grid gap-8 border-t border-white/[0.06] pt-10 sm:grid-cols-3">
            {METRICS.map((m) => (
              <PremiumMetric key={m.label} value={m.value} label={m.label} />
            ))}
          </div>
        </FadeIn>

        <FadeIn
          delay={0.1}
          direction="left"
          className="col-span-12 flex justify-center lg:col-span-5 lg:justify-end"
        >
          <HeroRobotStage />
        </FadeIn>
      </HomeContainer>
    </section>
  );
}

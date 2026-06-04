import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { MagneticButton } from "@/components/site/MagneticButton";
import { PageContainer } from "@/components/site/PageContainer";
import { RemoteImage } from "@/components/site/RemoteImage";
import { buttonVariants } from "@/components/ui/button";
import {
  getServiceHeroLead,
  getServiceHighlightFeatures,
} from "@/components/services/service-detail-utils";
import type { PublicService } from "@/lib/api/types";
import { cn } from "@/lib/utils";

export function ServiceDetailHero({ service }: { service: PublicService }) {
  const highlights = getServiceHighlightFeatures(service);
  const lead = getServiceHeroLead(service);
  const stepCount = service.processSteps?.length ?? 0;

  return (
    <section className="relative isolate min-h-[min(72vh,720px)] overflow-hidden border-b border-white/[0.06] sm:min-h-[min(80vh,820px)] md:min-h-[min(88vh,920px)]">
      {service.coverImage ? (
        <>
          <RemoteImage
            src={service.coverImage}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#060a08] via-[#060a08]/85 to-[#060a08]/35"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#060a08]/95 via-[#060a08]/55 to-transparent"
            aria-hidden
          />
        </>
      ) : (
        <div
          className="absolute inset-0 bg-[#060a08]"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 60% at 20% 40%, rgba(34,197,94,0.12), transparent 55%), radial-gradient(ellipse 50% 40% at 90% 20%, rgba(34,197,94,0.06), transparent 50%)",
          }}
        />
      )}

      <div
        className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.04%22/%3E%3C/svg%3E')] opacity-40"
        aria-hidden
      />

      <PageContainer className="relative z-10 flex min-h-[inherit] flex-col justify-end pb-12 pt-24 sm:pb-14 sm:pt-28 md:pb-20 md:pt-32">
        <Breadcrumbs
          className="mb-10 md:mb-12 [&_a]:text-white/70 [&_a:hover]:text-primary [&_li]:text-white/50 [&_span]:text-white/90"
          items={[
            { label: "Home", href: "/" },
            { label: "Services", href: "/services" },
            { label: service.title },
          ]}
        />

        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-8">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.28em] text-primary">
              <span className="size-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
              AIVRASOL Service
            </p>
            <h1 className="max-w-4xl text-3xl font-semibold leading-[1.06] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              {service.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
              {lead}
            </p>

            {highlights.length > 0 ? (
              <ul className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-3">
                {highlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5 text-sm text-white/85"
                  >
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/15">
                      <Check className="size-3.5 text-primary" aria-hidden />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="flex flex-col gap-6 lg:col-span-4 lg:items-stretch">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-5 backdrop-blur-md md:p-6">
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-primary/90">
                Engagement
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                Scoped discovery, premium delivery, and measurable outcomes—built
                for teams that expect clarity at every stage.
              </p>
              {(stepCount > 0 || (service.technologies?.length ?? 0) > 0) && (
                <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-5">
                  {stepCount > 0 ? (
                    <div>
                      <dt className="text-[10px] uppercase tracking-wider text-white/45">
                        Phases
                      </dt>
                      <dd className="mt-1 text-2xl font-semibold text-white">
                        {String(stepCount).padStart(2, "0")}
                      </dd>
                    </div>
                  ) : null}
                  {(service.technologies?.length ?? 0) > 0 ? (
                    <div>
                      <dt className="text-[10px] uppercase tracking-wider text-white/45">
                        Stack areas
                      </dt>
                      <dd className="mt-1 text-2xl font-semibold text-white">
                        {service.technologies!.length}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <MagneticButton
                href="/contact"
                size="lg"
                className="w-full sm:flex-1 lg:w-full [&_span]:inline-flex [&_span]:items-center [&_span]:justify-center"
              >
                Start a Project
                <ArrowRight className="ml-2 size-4" aria-hidden />
              </MagneticButton>
              <Link
                href="/projects"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full border-white/20 bg-white/5 text-white hover:bg-white/10 sm:flex-1 lg:w-full",
                )}
              >
                View case studies
              </Link>
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}

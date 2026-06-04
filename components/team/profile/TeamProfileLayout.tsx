"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { Briefcase, Mail, Sparkles } from "lucide-react";
import { FadeIn } from "@/components/animations/FadeIn";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { MagneticButton } from "@/components/site/MagneticButton";
import { RemoteImage } from "@/components/site/RemoteImage";
import { PageCTA } from "@/components/site/PageCTA";
import { TeamSocialBar } from "@/components/team/TeamSocialBar";
import { TeamProfileProjects } from "@/components/team/profile/TeamProfileProjects";
import { TeamProfileStats } from "@/components/team/profile/TeamProfileStats";
import { TeamProfileTestimonials } from "@/components/team/profile/TeamProfileTestimonials";
import { TeamProfileTimeline } from "@/components/team/profile/TeamProfileTimeline";
import { TeamProfileStickySidebar } from "@/components/team/profile/TeamProfileStickySidebar";
import { TeamSkillBars } from "@/components/team/profile/TeamSkillBars";
import type { TeamMemberDetailData } from "@/lib/api/types";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function ProfileSection({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-white/[0.06] py-12 first:border-t-0 first:pt-0 md:py-14">
      <FadeIn>
        <h2 className="text-xl font-semibold tracking-tight text-white md:text-2xl">{title}</h2>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {description}
          </p>
        ) : null}
        <div className="mt-8">{children}</div>
      </FadeIn>
    </section>
  );
}

export function TeamProfileLayout({ data }: { data: TeamMemberDetailData }) {
  const { member, relatedProjects, relatedTestimonials } = data;
  const reduce = useReducedMotion();
  const bio =
    member.bio?.trim() ||
    `${member.name} is a ${member.role.toLowerCase()} at AIVRASOL, partnering with ambitious teams to design and ship intelligent digital systems with clarity, craft, and measurable outcomes.`;
  const skills = member.skills?.length
    ? member.skills
    : ["Product strategy", "UX design", "Next.js", "AI workflows", "Automation"];
  const technologies = skills.slice(0, 6);

  return (
    <>
      <div className="border-b border-white/[0.06] bg-[#060a08]">
        <div className="mx-auto max-w-[1180px] px-4 pb-2 pt-6 sm:px-6 md:px-8 lg:px-10">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Team", href: "/team" },
              { label: member.name },
            ]}
          />
        </div>
      </div>

      <div className="relative border-b border-white/[0.06] bg-[#060a08]">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_20%_0%,rgba(62,207,142,0.12),transparent_55%)]"
          aria-hidden
        />
        <div
          data-team-profile-body
          className="mx-auto flex max-w-[1180px] flex-col gap-10 px-4 py-12 sm:px-6 md:flex-row md:items-stretch md:gap-12 md:py-16 lg:px-10"
        >
          <aside className="w-full shrink-0 md:w-[41.666%] lg:w-[33.333%]">
            <TeamProfileStickySidebar>
              <div
                className={cn(
                  "overflow-hidden rounded-[1.75rem] border border-white/[0.09] bg-[rgba(10,16,14,0.65)] shadow-[0_32px_80px_-32px_rgba(0,0,0,0.85)] backdrop-blur-xl",
                  !reduce && "animate-in fade-in duration-500",
                )}
              >
                <div className="relative aspect-[4/5] bg-[#0a100e]">
                  {member.photo ? (
                    <RemoteImage
                      src={member.photo}
                      alt={member.name}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-gradient-to-br from-primary/20 to-transparent text-6xl font-semibold text-primary">
                      {member.name.charAt(0)}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060a08]/80 via-transparent to-transparent" />
                </div>
                <div className="space-y-4 p-6">
                  <TeamSocialBar member={member} variant="inline" />
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <MagneticButton href="/contact" size="default" className="flex-1">
                      <Mail className="mr-2 inline size-4" aria-hidden />
                      Book a call
                    </MagneticButton>
                    <Link
                      href="/projects"
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "flex-1 justify-center",
                      )}
                    >
                      View work
                    </Link>
                  </div>
                </div>
              </div>
            </TeamProfileStickySidebar>
          </aside>

          <div className="min-w-0 flex-1">
            <header
              className={cn(
                !reduce && "animate-in fade-in slide-in-from-bottom-2 duration-500",
              )}
            >
                <p className="text-[11px] font-medium uppercase tracking-[0.34em] text-primary">
                  Team profile
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
                  {member.name}
                </h1>
                <p className="mt-3 text-lg font-medium text-primary">{member.role}</p>
                <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <Briefcase className="size-4 text-primary/80" aria-hidden />
                  AIVRASOL · Intelligent digital systems
                </p>
                <p className="mt-6 text-base leading-relaxed text-white/75">{bio}</p>

                <div className="mt-8 flex flex-wrap gap-2">
                  {technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-primary-light"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
            </header>

              <div className="mt-10">
                <TeamProfileStats
                  skillsCount={skills.length}
                  projectsCount={relatedProjects.length}
                />
              </div>

              <ProfileSection id="about" title="About" description="Professional background and approach.">
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-sm md:p-8">
                  <p className="text-base leading-relaxed text-muted-foreground">{bio}</p>
                  <div className="mt-6 flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
                    <Sparkles className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                    <p className="text-sm leading-relaxed text-white/80">
                      Focused on premium UX, scalable engineering, and applied AI — aligned with
                      how modern teams ship and measure product outcomes.
                    </p>
                  </div>
                </div>
              </ProfileSection>

              <ProfileSection
                id="skills"
                title="Skills & expertise"
                description="Core capabilities shaped through studio delivery."
              >
                <div className="grid gap-8 lg:grid-cols-2">
                  <TeamSkillBars skills={skills} />
                  <div className="flex flex-wrap content-start gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white/85"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </ProfileSection>

              {relatedProjects.length > 0 ? (
                <ProfileSection
                  id="projects"
                  title="Selected projects"
                  description="Recent studio work from the AIVRASOL portfolio."
                >
                  <TeamProfileProjects projects={relatedProjects} />
                </ProfileSection>
              ) : null}

              <ProfileSection
                id="experience"
                title="Experience"
                description="Career trajectory and delivery focus."
              >
                <TeamProfileTimeline member={member} />
              </ProfileSection>

              {relatedTestimonials.length > 0 ? (
                <ProfileSection
                  id="testimonials"
                  title="Client testimonials"
                  description="What partners say about working with our studio."
                >
                  <TeamProfileTestimonials
                    testimonials={relatedTestimonials}
                    memberName={member.name}
                  />
                </ProfileSection>
              ) : null}

              <ProfileSection id="contact" title="Let's work together">
                <div className="rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 via-transparent to-transparent p-8 text-center md:text-left">
                  <h3 className="text-xl font-semibold text-white">
                    Ready to build with {member.name.split(" ")[0]}?
                  </h3>
                  <p className="mt-3 max-w-lg text-sm text-muted-foreground">
                    Share your product vision — we will map strategy, experience, and technical
                    direction for your next intelligent digital system.
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
                    <MagneticButton href="/contact" size="lg">
                      Book a meeting
                    </MagneticButton>
                    <Link href="/team" className={buttonVariants({ variant: "outline", size: "lg" })}>
                      Meet the team
                    </Link>
                  </div>
                </div>
              </ProfileSection>
          </div>
        </div>
      </div>

      <PageCTA title="Start your next project with AIVRASOL" primaryLabel="Contact us" />
    </>
  );
}

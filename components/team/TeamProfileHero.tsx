import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { PageHero } from "@/components/site/PageHero";
import type { PublicTeamMember } from "@/lib/api/types";

export function TeamProfileHero({ member }: { member: PublicTeamMember }) {
  const socials = [
    { label: "LinkedIn", href: member.linkedin },
    { label: "GitHub", href: member.github },
    { label: "Website", href: member.website },
  ].filter((s) => s.href) as { label: string; href: string }[];

  return (
    <>
      <div className="border-b border-white/[0.06] bg-[#060a08]">
        <div className="mx-auto max-w-[1180px] px-6 pb-0 pt-6 sm:px-8 lg:px-10">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Team", href: "/team" },
              { label: member.name },
            ]}
          />
        </div>
      </div>
      <PageHero eyebrow="Team" title={member.name} description={member.role} size="compact">
        {member.photo ? (
          <div className="relative size-24 overflow-hidden rounded-2xl border border-white/10">
            <Image src={member.photo} alt={member.name} fill className="object-cover" />
          </div>
        ) : (
          <div className="flex size-24 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-3xl font-semibold text-primary">
            {member.name.charAt(0)}
          </div>
        )}
        {socials.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-3">
            {socials.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                {s.label}
              </Link>
            ))}
          </div>
        ) : null}
      </PageHero>
    </>
  );
}

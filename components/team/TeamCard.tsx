import Image from "next/image";
import Link from "next/link";
import type { PublicTeamMember } from "@/lib/api/types";

export function TeamCard({ member }: { member: PublicTeamMember }) {
  return (
    <Link
      href={`/team/${member.slug}`}
      className="group flex h-full flex-col rounded-3xl border border-white/[0.08] bg-[rgba(10,16,14,0.55)] p-6 transition-colors hover:border-primary/25"
    >
      <div className="mb-4 flex size-16 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-primary/5">
        {member.photo ? (
          <Image
            src={member.photo}
            alt={member.name}
            width={64}
            height={64}
            className="size-full object-cover"
          />
        ) : (
          <span className="text-xl font-semibold text-primary">{member.name.charAt(0)}</span>
        )}
      </div>
      <h3 className="text-lg font-semibold">{member.name}</h3>
      <p className="mt-1 text-sm text-primary">{member.role}</p>
      {member.skills?.length ? (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {member.skills.slice(0, 3).map((s) => (
            <span
              key={s}
              className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-muted-foreground"
            >
              {s}
            </span>
          ))}
        </div>
      ) : member.bio ? (
        <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{member.bio}</p>
      ) : null}
      <span className="mt-auto pt-5 text-sm text-primary">View profile →</span>
    </Link>
  );
}

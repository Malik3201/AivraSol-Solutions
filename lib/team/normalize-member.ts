import type { PublicTeamMember } from "@/lib/api/types";

type RawMember = PublicTeamMember & {
  socialLinks?: {
    linkedin?: string | null;
    github?: string | null;
    twitter?: string | null;
    website?: string | null;
  };
};

/** Flatten CMS `socialLinks` and ensure a consistent public shape. */
export function normalizeTeamMember(raw: RawMember | Record<string, unknown>): PublicTeamMember {
  const m = raw as RawMember;
  const social = m.socialLinks ?? {};

  return {
    id: String(m.id ?? ""),
    name: String(m.name ?? ""),
    slug: String(m.slug ?? ""),
    role: String(m.role ?? ""),
    bio: m.bio ?? undefined,
    photo: m.photo ?? undefined,
    skills: Array.isArray(m.skills) ? m.skills.filter(Boolean) : undefined,
    linkedin: social.linkedin ?? m.linkedin ?? undefined,
    github: social.github ?? m.github ?? undefined,
    twitter: social.twitter ?? m.twitter ?? undefined,
    website: social.website ?? m.website ?? undefined,
  };
}

export function normalizeTeamMembers(
  list: (RawMember | Record<string, unknown>)[],
): PublicTeamMember[] {
  return list.map((m) => normalizeTeamMember(m));
}

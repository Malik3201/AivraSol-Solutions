import { connectDB } from "@/lib/db";
import {
  BlogPost,
  FAQ,
  Project,
  Service,
  TeamMember,
  Testimonial,
} from "@/lib/models";
import { getPublicSettingsMap } from "@/lib/services/public-content";
import { mainNav } from "@/lib/site-config";
import { normalizeTeamMembers } from "@/lib/team/normalize-member";

const CACHE_TTL_MS = 5 * 60 * 1000;

let cache: { data: AivaPublicContext; at: number } | null = null;

function clip(text: unknown, max: number): string {
  const raw = typeof text === "string" ? text : "";
  const cleaned = raw
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return "";
  return cleaned.length <= max ? cleaned : `${cleaned.slice(0, max - 1)}…`;
}

function clipList(items: unknown, maxItems = 24): string[] {
  if (!Array.isArray(items)) return [];
  return items
    .filter((x): x is string => typeof x === "string" && x.trim().length > 0)
    .slice(0, maxItems);
}

export interface AivaPublicContext {
  companyName: string;
  tagline: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  pages: { path: string; label: string }[];
  services: Array<{
    title: string;
    slug: string;
    path: string;
    shortDescription: string;
    description: string;
    features: string[];
    technologies: string[];
    processSteps: { title: string; description: string }[];
    isFeatured: boolean;
  }>;
  projects: Array<{
    title: string;
    slug: string;
    path: string;
    clientName?: string;
    industry?: string;
    shortDescription: string;
    description: string;
    problem: string;
    solution: string;
    results: string[];
    services: string[];
    technologies: string[];
    liveUrl?: string;
    isFeatured: boolean;
  }>;
  team: Array<{
    name: string;
    slug: string;
    path: string;
    role: string;
    bio: string;
    skills: string[];
    linkedin?: string;
    github?: string;
    website?: string;
  }>;
  testimonials: Array<{
    clientName: string;
    clientRole?: string;
    company?: string;
    quote: string;
    rating: number;
    project?: string;
    isFeatured: boolean;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
    category: string;
  }>;
  blogPosts: Array<{
    title: string;
    slug: string;
    path: string;
    excerpt: string;
    content: string;
    author: string;
    tags: string[];
    publishedAt?: string;
    isFeatured: boolean;
  }>;
}

async function fetchAivaPublicContext(): Promise<AivaPublicContext> {
  await connectDB();

  const [
    services,
    projects,
    teamRaw,
    testimonials,
    faqs,
    blogPosts,
    settings,
  ] = await Promise.all([
    Service.find({ isActive: true }).sort({ sortOrder: 1, title: 1 }).lean(),
    Project.find({ isActive: true }).sort({ sortOrder: 1, title: 1 }).lean(),
    TeamMember.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }).lean(),
    Testimonial.find({ isActive: true }).sort({ sortOrder: 1 }).lean(),
    FAQ.find({ isActive: true }).sort({ sortOrder: 1 }).lean(),
    BlogPost.find({ status: "published" })
      .sort({ publishedAt: -1, createdAt: -1 })
      .lean(),
    getPublicSettingsMap(),
  ]);

  const team = normalizeTeamMembers(
    teamRaw.map((m) => ({ id: String(m._id), ...m })),
  );

  return {
    companyName: (settings.companyName as string) ?? "AIVRASOL",
    tagline:
      (settings.tagline as string) ??
      "Premium AI and digital services for ambitious brands.",
    contactEmail: settings.contactEmail as string | undefined,
    contactPhone: settings.contactPhone as string | undefined,
    address: settings.address as string | undefined,
    pages: mainNav.map((item) => ({ path: item.href, label: item.label })),
    services: services.map((s) => ({
      title: s.title,
      slug: s.slug,
      path: `/services/${s.slug}`,
      shortDescription: clip(s.shortDescription, 280),
      description: clip(s.description, 700),
      features: clipList(s.features),
      technologies: clipList(s.technologies),
      processSteps: (s.processSteps ?? []).slice(0, 8).map((step) => ({
        title: clip(step.title, 80),
        description: clip(step.description, 200),
      })),
      isFeatured: Boolean(s.isFeatured),
    })),
    projects: projects.map((p) => ({
      title: p.title,
      slug: p.slug,
      path: `/projects/${p.slug}`,
      clientName: p.clientName ? clip(p.clientName, 80) : undefined,
      industry: p.industry ? clip(p.industry, 80) : undefined,
      shortDescription: clip(p.shortDescription, 280),
      description: clip(p.description, 700),
      problem: clip(p.problem, 400),
      solution: clip(p.solution, 400),
      results: clipList(p.results, 12),
      services: clipList(p.services, 12),
      technologies: clipList(p.technologies, 16),
      liveUrl: p.liveUrl || undefined,
      isFeatured: Boolean(p.isFeatured),
    })),
    team: team.map((m) => ({
      name: m.name,
      slug: m.slug,
      path: `/team/${m.slug}`,
      role: m.role,
      bio: clip(m.bio, 500),
      skills: clipList(m.skills, 20),
      linkedin: m.linkedin,
      github: m.github,
      website: m.website,
    })),
    testimonials: testimonials.map((t) => ({
      clientName: t.clientName,
      clientRole: t.clientRole ?? undefined,
      company: t.company ?? undefined,
      quote: clip(t.quote, 400),
      rating: t.rating ?? 5,
      project: t.project ?? undefined,
      isFeatured: Boolean(t.isFeatured),
    })),
    faqs: faqs.map((f) => ({
      question: clip(f.question, 200),
      answer: clip(f.answer, 500),
      category: f.category ?? "general",
    })),
    blogPosts: blogPosts.map((b) => ({
      title: b.title,
      slug: b.slug,
      path: `/blog/${b.slug}`,
      excerpt: clip(b.excerpt, 320),
      content: clip(b.content, 900),
      author: b.author ?? "AIVRASOL",
      tags: clipList(b.tags, 12),
      publishedAt: b.publishedAt
        ? new Date(b.publishedAt).toISOString().slice(0, 10)
        : undefined,
      isFeatured: Boolean(b.isFeatured),
    })),
  };
}

export async function buildAivaPublicContext(): Promise<AivaPublicContext> {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) {
    return cache.data;
  }

  try {
    const data = await fetchAivaPublicContext();
    cache = { data, at: Date.now() };
    return data;
  } catch (error) {
    const { FALLBACK_SERVICES, FALLBACK_PROJECTS } = await import(
      "@/lib/home-fallback"
    );
    console.error(
      "[aiva] Using static context fallback:",
      error instanceof Error ? error.message : error,
    );
    return {
      companyName: "AIVRASOL",
      tagline: "Premium AI and digital services for ambitious brands.",
      pages: mainNav.map((item) => ({ path: item.href, label: item.label })),
      services: FALLBACK_SERVICES.map((s) => ({
        title: s.title,
        slug: s.slug,
        path: `/services/${s.slug}`,
        shortDescription: s.shortDescription ?? "",
        description: "",
        features: s.features ?? [],
        technologies: [],
        processSteps: [],
        isFeatured: Boolean(s.isFeatured),
      })),
      projects: FALLBACK_PROJECTS.map((p) => ({
        title: p.title,
        slug: p.slug,
        path: `/projects/${p.slug}`,
        industry: p.industry,
        shortDescription: p.shortDescription ?? "",
        description: "",
        problem: "",
        solution: "",
        results: [],
        services: [],
        technologies: p.technologies ?? [],
        isFeatured: Boolean(p.isFeatured),
      })),
      team: [],
      testimonials: [],
      faqs: [],
      blogPosts: [],
    };
  }
}

/** Compact JSON for the chat prompt (all public CMS content). */
export function serializeAivaContextForPrompt(context: AivaPublicContext): string {
  return JSON.stringify(
    {
      company: {
        name: context.companyName,
        tagline: context.tagline,
        contactEmail: context.contactEmail,
        contactPhone: context.contactPhone,
        address: context.address,
      },
      pages: context.pages,
      services: context.services,
      projects: context.projects,
      team: context.team,
      testimonials: context.testimonials,
      faqs: context.faqs,
      blogPosts: context.blogPosts,
      counts: {
        services: context.services.length,
        projects: context.projects.length,
        team: context.team.length,
        testimonials: context.testimonials.length,
        faqs: context.faqs.length,
        blogPosts: context.blogPosts.length,
      },
    },
    null,
    0,
  );
}

export function invalidateAivaContextCache(): void {
  cache = null;
}

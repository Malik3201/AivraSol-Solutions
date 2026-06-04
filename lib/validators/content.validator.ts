import { z } from "zod";
import { BLOG_STATUSES } from "@/lib/models/BlogPost";

const processStepSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

/** Empty string or valid URL (admin forms often send ""). */
const optionalUrl = z.union([z.literal(""), z.string().trim().url()]).optional();

function normalizeSocialUrl(value: unknown): string | undefined {
  if (value == null) return undefined;
  const trimmed = String(value).trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

const socialLinksSchema = z
  .object({
    linkedin: optionalUrl,
    github: optionalUrl,
    twitter: optionalUrl,
    website: optionalUrl,
  })
  .partial()
  .optional()
  .transform((links) => {
    if (!links) return undefined;
    const cleaned: Record<string, string> = {};
    for (const [key, value] of Object.entries(links)) {
      if (value && value !== "") cleaned[key] = value;
    }
    return Object.keys(cleaned).length > 0 ? cleaned : undefined;
  });

const socialLinksInputSchema = z.preprocess(
  (val) => {
    if (!val || typeof val !== "object") return undefined;
    const o = val as Record<string, unknown>;
    return {
      linkedin: normalizeSocialUrl(o.linkedin),
      github: normalizeSocialUrl(o.github),
      twitter: normalizeSocialUrl(o.twitter),
      website: normalizeSocialUrl(o.website),
    };
  },
  socialLinksSchema,
);

const seoFieldsSchema = z.object({
  seoTitle: z.string().max(200).optional(),
  seoDescription: z.string().max(500).optional(),
  seoKeywords: z.array(z.string()).optional(),
});

export const serviceCreateSchema = z
  .object({
    title: z.string().min(1).max(200),
    slug: z.string().min(1).max(200).optional(),
    shortDescription: z.string().min(1).max(500),
    description: z.string().max(20000).optional(),
    icon: z.string().optional(),
    coverImage: z.string().optional(),
    gallery: z.array(z.string()).optional(),
    features: z.array(z.string()).optional(),
    processSteps: z.array(processStepSchema).optional(),
    technologies: z.array(z.string()).optional(),
    isFeatured: z.boolean().optional(),
    isActive: z.boolean().optional(),
    sortOrder: z.number().optional(),
  })
  .merge(seoFieldsSchema);

export const serviceUpdateSchema = serviceCreateSchema.partial();

export const projectCreateSchema = z
  .object({
    title: z.string().min(1).max(200),
    slug: z.string().min(1).max(200).optional(),
    clientName: z.string().max(200).optional(),
    industry: z.string().max(120).optional(),
    shortDescription: z.string().max(500).optional(),
    description: z.string().max(30000).optional(),
    problem: z.string().max(10000).optional(),
    solution: z.string().max(10000).optional(),
    results: z.array(z.string()).optional(),
    coverImage: z.string().optional(),
    gallery: z.array(z.string()).optional(),
    services: z.array(z.string()).optional(),
    technologies: z.array(z.string()).optional(),
    liveUrl: z.string().url().optional().or(z.literal("")),
    caseStudyUrl: z.string().url().optional().or(z.literal("")),
    isFeatured: z.boolean().optional(),
    isActive: z.boolean().optional(),
    sortOrder: z.number().optional(),
  })
  .merge(seoFieldsSchema);

export const projectUpdateSchema = projectCreateSchema.partial();

const teamMemberBaseSchema = z
  .object({
    name: z.string().trim().min(1).max(200),
    slug: z.string().trim().min(1).max(200).optional(),
    role: z.string().trim().min(1).max(200),
    bio: z.string().max(5000).optional(),
    photo: z.union([z.literal(""), z.string().trim()]).optional(),
    skills: z.array(z.string().trim()).optional(),
    socialLinks: socialLinksInputSchema,
    isActive: z.boolean().optional(),
    sortOrder: z.coerce.number().optional(),
  })
  .merge(seoFieldsSchema);

function normalizeTeamMemberInput(
  data: z.infer<typeof teamMemberBaseSchema>,
) {
  return {
    ...data,
    photo: data.photo && data.photo !== "" ? data.photo : undefined,
    skills: data.skills?.filter(Boolean),
    seoKeywords: data.seoKeywords?.filter(Boolean),
  };
}

function normalizeTeamMemberPatch(
  data: Partial<z.infer<typeof teamMemberBaseSchema>>,
) {
  const out: Partial<z.infer<typeof teamMemberBaseSchema>> = { ...data };
  if ("photo" in data) {
    out.photo =
      data.photo && data.photo !== "" ? data.photo : undefined;
  }
  if (data.skills) out.skills = data.skills.filter(Boolean);
  if (data.seoKeywords) {
    out.seoKeywords = data.seoKeywords.filter(Boolean);
  }
  return out;
}

export const teamMemberCreateSchema = teamMemberBaseSchema.transform(
  normalizeTeamMemberInput,
);

export const teamMemberUpdateSchema = teamMemberBaseSchema
  .partial()
  .transform(normalizeTeamMemberPatch);

export const testimonialCreateSchema = z.object({
  clientName: z.string().min(1).max(200),
  quote: z.string().min(1).max(2000),
  rating: z.number().min(1).max(5).optional(),
  clientRole: z.string().max(200).optional(),
  company: z.string().max(200).optional(),
  image: z.string().optional(),
  project: z.string().max(200).optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().optional(),
});

export const testimonialUpdateSchema = testimonialCreateSchema.partial();

export const faqCreateSchema = z.object({
  question: z.string().min(1).max(500),
  answer: z.string().min(1).max(10000),
  category: z.string().max(100).optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().optional(),
});

export const faqUpdateSchema = faqCreateSchema.partial();

export const blogPostCreateSchema = z
  .object({
    title: z.string().min(1).max(200),
    slug: z.string().min(1).max(200).optional(),
    excerpt: z.string().max(1000).optional(),
    content: z.string().max(100000).optional(),
    coverImage: z.string().optional(),
    author: z.string().max(200).optional(),
    tags: z.array(z.string()).optional(),
    status: z.enum(BLOG_STATUSES).optional(),
    isFeatured: z.boolean().optional(),
  })
  .merge(seoFieldsSchema);

export const blogPostUpdateSchema = blogPostCreateSchema.partial();

export const siteSettingCreateSchema = z.object({
  key: z.string().min(1).max(120),
  value: z.unknown(),
  group: z.string().max(100).optional(),
  label: z.string().max(200).optional(),
  description: z.string().max(500).optional(),
  isPublic: z.boolean().optional(),
});

export const siteSettingUpdateSchema = siteSettingCreateSchema
  .omit({ key: true })
  .partial()
  .extend({ key: z.string().min(1).max(120).optional() });

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  status: z.string().optional(),
  category: z.string().optional(),
  tag: z.string().optional(),
  technology: z.string().optional(),
  service: z.string().optional(),
  serviceInterest: z.string().optional(),
});

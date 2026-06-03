import { z } from "zod";
import { BLOG_STATUSES } from "@/lib/models/BlogPost";

const processStepSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

const socialLinksSchema = z.object({
  linkedin: z.string().url().optional().or(z.literal("")),
  github: z.string().url().optional().or(z.literal("")),
  twitter: z.string().url().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
});

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

export const teamMemberCreateSchema = z
  .object({
    name: z.string().min(1).max(200),
    slug: z.string().min(1).max(200).optional(),
    role: z.string().min(1).max(200),
    bio: z.string().max(5000).optional(),
    photo: z.string().optional(),
    skills: z.array(z.string()).optional(),
    socialLinks: socialLinksSchema.optional(),
    isActive: z.boolean().optional(),
    sortOrder: z.number().optional(),
  })
  .merge(seoFieldsSchema);

export const teamMemberUpdateSchema = teamMemberCreateSchema.partial();

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

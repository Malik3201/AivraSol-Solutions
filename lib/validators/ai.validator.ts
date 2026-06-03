import { z } from "zod";

export const serviceContentAiSchema = z.object({
  title: z.string().min(1).max(200),
  targetAudience: z.string().max(500).optional(),
  tone: z.string().max(100).optional(),
  keywords: z.array(z.string()).optional(),
  shortNotes: z.string().max(2000).optional(),
});

export const projectContentAiSchema = z.object({
  title: z.string().min(1).max(200),
  clientIndustry: z.string().max(200).optional(),
  serviceType: z.string().max(200).optional(),
  problemNotes: z.string().max(3000).optional(),
  solutionNotes: z.string().max(3000).optional(),
  resultNotes: z.string().max(3000).optional(),
});

export const blogContentAiSchema = z.object({
  topic: z.string().min(1).max(300),
  audience: z.string().max(300).optional(),
  keywords: z.array(z.string()).optional(),
  tone: z.string().max(100).optional(),
});

export const faqContentAiSchema = z.object({
  serviceName: z.string().min(1).max(200),
  audience: z.string().max(300).optional(),
  keywords: z.array(z.string()).optional(),
});

export const seoContentAiSchema = z.object({
  pageType: z.string().min(1).max(100),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  keywords: z.array(z.string()).optional(),
});

export const aivaChatSchema = z.object({
  message: z.string().min(1).max(2000),
  sessionId: z.string().max(100).optional(),
  pageContext: z.string().max(500).optional(),
  currentPage: z.string().max(200).optional(),
});

export const contactAssistSchema = z.object({
  name: z.string().max(120).optional(),
  serviceInterest: z.string().min(1).max(200),
  roughIdea: z.string().min(10).max(3000),
  tone: z.string().max(100).optional(),
});

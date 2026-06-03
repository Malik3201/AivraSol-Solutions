import { apiFetch, apiFetchWithMeta } from "@/lib/api/client";
import type {
  AivaChatResponse,
  BlogDetailData,
  ContactAssistResponse,
  HomePageData,
  ProjectDetailData,
  PublicBlogPost,
  PublicFAQ,
  PublicProject,
  PublicService,
  PublicTeamMember,
  PublicTestimonial,
  ServiceDetailData,
  TeamMemberDetailData,
} from "@/lib/api/types";

export function getHomeData() {
  return apiFetch<HomePageData>("/api/public/home");
}

export function getServices(params?: {
  page?: number;
  limit?: number;
  search?: string;
  featured?: boolean;
}) {
  return apiFetchWithMeta<PublicService[]>("/api/public/services", { params });
}

export function getServiceBySlug(slug: string) {
  return apiFetch<ServiceDetailData>(`/api/public/services/${slug}`);
}

export function getProjects(params?: {
  page?: number;
  limit?: number;
  search?: string;
  technology?: string;
  service?: string;
  featured?: boolean;
}) {
  return apiFetchWithMeta<PublicProject[]>("/api/public/projects", { params });
}

export function getProjectBySlug(slug: string) {
  return apiFetch<ProjectDetailData>(`/api/public/projects/${slug}`);
}

export function getTeam() {
  return apiFetch<PublicTeamMember[]>("/api/public/team");
}

export function getTeamMemberBySlug(slug: string) {
  return apiFetch<TeamMemberDetailData>(`/api/public/team/${slug}`);
}

export function getTestimonials() {
  return apiFetch<PublicTestimonial[]>("/api/public/testimonials");
}

export function getFAQs(category?: string) {
  return apiFetch<PublicFAQ[]>("/api/public/faqs", {
    params: category ? { category } : undefined,
  });
}

export function getBlogPosts(params?: {
  page?: number;
  limit?: number;
  search?: string;
  tag?: string;
  featured?: boolean;
}) {
  return apiFetchWithMeta<PublicBlogPost[]>("/api/public/blog", { params });
}

export function getBlogPostBySlug(slug: string) {
  return apiFetch<BlogDetailData>(`/api/public/blog/${slug}`);
}

export function getPublicSettings() {
  return apiFetch<Record<string, unknown>>("/api/public/settings");
}

export function submitContact(data: {
  name: string;
  email: string;
  message: string;
  phone?: string;
  company?: string;
  serviceInterest?: string;
  budgetRange?: string;
  aiGeneratedDraft?: string;
}) {
  return apiFetch<{ lead: { id: string; status: string } }>("/api/contact", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function assistContactMessage(data: {
  name?: string;
  serviceInterest: string;
  roughIdea: string;
  tone?: string;
}) {
  return apiFetch<ContactAssistResponse>("/api/contact/assist", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function aivaChat(data: {
  message: string;
  sessionId?: string;
  pageContext?: string;
  currentPage?: string;
}) {
  return apiFetch<AivaChatResponse>("/api/ai/aiva/chat", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

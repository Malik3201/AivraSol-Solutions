export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface SeoObject {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
  image?: string;
  openGraph: {
    title: string;
    description: string;
    url: string;
    image?: string;
  };
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface PublicService {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  icon?: string;
  coverImage?: string;
  gallery?: string[];
  isFeatured?: boolean;
  sortOrder?: number;
  features?: string[];
  processSteps?: ProcessStep[];
  technologies?: string[];
}

export interface PublicProject {
  id: string;
  title: string;
  slug: string;
  clientName?: string;
  industry?: string;
  shortDescription?: string;
  description?: string;
  problem?: string;
  solution?: string;
  results?: string[];
  coverImage?: string;
  gallery?: string[];
  services?: string[];
  technologies?: string[];
  liveUrl?: string;
  caseStudyUrl?: string;
  isFeatured?: boolean;
}

export interface PublicTeamMember {
  id: string;
  name: string;
  slug: string;
  role: string;
  bio?: string;
  photo?: string;
  skills?: string[];
  linkedin?: string;
  twitter?: string;
  github?: string;
  website?: string;
}

export interface PublicTestimonial {
  id: string;
  clientName: string;
  quote: string;
  rating?: number;
  company?: string;
  clientRole?: string;
  image?: string;
}

export interface PublicFAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface PublicBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  author?: string;
  tags?: string[];
  publishedAt?: string;
  isFeatured?: boolean;
}

export interface HomePageData {
  hero: unknown;
  featuredServices: PublicService[];
  featuredProjects: PublicProject[];
  featuredTestimonials: PublicTestimonial[];
  teamPreview: PublicTeamMember[];
  faqPreview: PublicFAQ[];
  robotGuideSettings: unknown;
  seo: SeoObject;
  stats: unknown;
  settings: Record<string, unknown>;
}

export interface ServiceDetailData {
  service: PublicService;
  relatedProjects: PublicProject[];
  relatedFAQs: PublicFAQ[];
  seo: SeoObject;
}

export interface ProjectDetailData {
  project: PublicProject & Record<string, unknown>;
  relatedServices: PublicService[];
  seo: SeoObject;
}

export interface BlogDetailData {
  post: PublicBlogPost & { content?: string };
  relatedPosts: PublicBlogPost[];
  seo: SeoObject;
}

export interface TeamMemberDetailData {
  member: PublicTeamMember;
  seo: SeoObject;
}

export interface ContactInput {
  name: string;
  email: string;
  message: string;
  phone?: string;
  company?: string;
  serviceInterest?: string;
  budgetRange?: string;
  aiGeneratedDraft?: string;
}

export interface ContactAssistInput {
  name?: string;
  serviceInterest: string;
  roughIdea: string;
  tone?: string;
}

export interface ContactAssistResponse {
  generatedMessage: string;
}

export interface AivaChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface AivaChatRequest {
  message: string;
  sessionId?: string;
  pageContext?: string;
  currentPage?: string;
}

export interface AivaChatResponse {
  reply: string;
  suggestedActions: string[];
  leadIntent: "low" | "medium" | "high";
  recommendedServiceSlug: string | null;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AdminListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface AdminDashboardStats {
  totalServices: number;
  activeServices: number;
  totalProjects: number;
  activeProjects: number;
  totalTeamMembers: number;
  totalTestimonials: number;
  totalFAQs: number;
  totalBlogPosts: number;
  publishedBlogPosts: number;
  totalContactLeads: number;
  newContactLeads: number;
  recentContactLeads: AdminContactLead[];
  recentAiLogs: AdminAiLog[];
  recentUpdatedContent: {
    services: AdminContentRef[];
    projects: AdminContentRef[];
    blogPosts: (AdminContentRef & { status?: string })[];
  };
}

export interface AdminContentRef {
  id: string;
  title: string;
  slug: string;
  updatedAt?: string;
}

export interface AdminAiLog {
  id: string;
  feature?: string;
  model?: string;
  createdAt?: string;
}

export interface AdminContactLead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  serviceInterest?: string;
  budgetRange?: string;
  message: string;
  status: string;
  adminNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminMediaAsset {
  id: string;
  originalName: string;
  fileId: string;
  url: string;
  thumbnailUrl?: string;
  mimeType?: string;
  size?: number;
  folder: string;
  altText?: string;
  createdAt?: string;
}

export interface AdminSiteSetting {
  id: string;
  key: string;
  value: unknown;
  group?: string;
  label?: string;
  description?: string;
  isPublic?: boolean;
}

export interface AdminServiceRecord {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  icon?: string;
  coverImage?: string;
  gallery?: string[];
  features?: string[];
  processSteps?: ProcessStep[];
  technologies?: string[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  isFeatured?: boolean;
  isActive?: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminProjectRecord {
  id: string;
  title: string;
  slug: string;
  clientName?: string;
  industry?: string;
  shortDescription?: string;
  description?: string;
  problem?: string;
  solution?: string;
  results?: string[];
  coverImage?: string;
  gallery?: string[];
  services?: string[];
  technologies?: string[];
  liveUrl?: string;
  caseStudyUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  isFeatured?: boolean;
  isActive?: boolean;
  sortOrder?: number;
}

export interface AdminTeamRecord {
  id: string;
  name: string;
  slug: string;
  role: string;
  bio?: string;
  photo?: string;
  skills?: string[];
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
  };
  seoTitle?: string;
  seoDescription?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface AdminTestimonialRecord {
  id: string;
  clientName: string;
  quote: string;
  rating?: number;
  clientRole?: string;
  company?: string;
  image?: string;
  project?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  sortOrder?: number;
}

export interface AdminFaqRecord {
  id: string;
  question: string;
  answer: string;
  category?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface AdminBlogRecord {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  author?: string;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  status: "draft" | "published";
  isFeatured?: boolean;
  publishedAt?: string;
}

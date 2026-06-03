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

export interface PublicService {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  icon?: string;
  coverImage?: string;
  isFeatured?: boolean;
  sortOrder?: number;
}

export interface PublicProject {
  id: string;
  title: string;
  slug: string;
  clientName?: string;
  industry?: string;
  shortDescription?: string;
  coverImage?: string;
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

export interface AivaChatResponse {
  reply: string;
  suggestedActions: string[];
  leadIntent: "low" | "medium" | "high";
  recommendedServiceSlug: string | null;
}

export interface ContactAssistResponse {
  generatedMessage: string;
}

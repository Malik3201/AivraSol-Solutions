import {
  getBlogPostBySlug,
  getBlogPosts,
  getProjectBySlug,
  getProjects,
  getServiceBySlug,
  getServices,
  getTeam,
  getTeamMemberBySlug,
} from "@/lib/api/public";
import type {
  BlogDetailData,
  ProjectDetailData,
  PublicBlogPost,
  PublicProject,
  PublicService,
  PublicTeamMember,
  ServiceDetailData,
  TeamMemberDetailData,
} from "@/lib/api/types";
import {
  FALLBACK_PROJECTS,
  FALLBACK_SERVICES,
  FALLBACK_TEAM,
} from "@/lib/home-fallback";

export async function fetchServicesList(): Promise<PublicService[]> {
  try {
    const res = await getServices({ limit: 50 });
    return res.data?.length ? res.data : FALLBACK_SERVICES;
  } catch {
    return FALLBACK_SERVICES;
  }
}

export async function fetchServiceDetail(
  slug: string,
): Promise<ServiceDetailData | null> {
  try {
    return await getServiceBySlug(slug);
  } catch {
    return null;
  }
}

export async function fetchProjectsList(): Promise<PublicProject[]> {
  try {
    const res = await getProjects({ limit: 50 });
    return res.data?.length ? res.data : FALLBACK_PROJECTS;
  } catch {
    return FALLBACK_PROJECTS;
  }
}

export async function fetchProjectDetail(
  slug: string,
): Promise<ProjectDetailData | null> {
  try {
    return await getProjectBySlug(slug);
  } catch {
    return null;
  }
}

export async function fetchTeamList(): Promise<PublicTeamMember[]> {
  try {
    const data = await getTeam();
    return data?.length ? data : FALLBACK_TEAM;
  } catch {
    return FALLBACK_TEAM;
  }
}

export async function fetchTeamDetail(
  slug: string,
): Promise<TeamMemberDetailData | null> {
  try {
    return await getTeamMemberBySlug(slug);
  } catch {
    return null;
  }
}

export async function fetchBlogList(): Promise<PublicBlogPost[]> {
  try {
    const res = await getBlogPosts({ limit: 50 });
    return res.data ?? [];
  } catch {
    return [];
  }
}

export async function fetchBlogDetail(
  slug: string,
): Promise<BlogDetailData | null> {
  try {
    return await getBlogPostBySlug(slug);
  } catch {
    return null;
  }
}

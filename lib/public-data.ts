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
  getPublicBlogBySlug,
  getPublicProjectBySlug,
  getPublicServiceBySlug,
  getPublicTeamBySlug,
  listPublicBlog,
  listPublicProjects,
  listPublicServices,
  listPublicTeam,
} from "@/lib/services/public-content";

/** Server components: query MongoDB directly — reliable on Vercel (no self-HTTP). */
export async function fetchServicesList(): Promise<PublicService[]> {
  try {
    const { items } = await listPublicServices({ limit: 50 });
    return items as PublicService[];
  } catch (error) {
    console.error("[public-data] failed to load services", error);
    return [];
  }
}

export async function fetchServiceDetail(
  slug: string,
): Promise<ServiceDetailData | null> {
  try {
    return (await getPublicServiceBySlug(slug)) as ServiceDetailData;
  } catch (error) {
    console.error("[public-data] failed to load service", slug, error);
    return null;
  }
}

export async function fetchProjectsList(): Promise<PublicProject[]> {
  try {
    const { items } = await listPublicProjects({ limit: 50 });
    return items as PublicProject[];
  } catch (error) {
    console.error("[public-data] failed to load projects", error);
    return [];
  }
}

export async function fetchProjectDetail(
  slug: string,
): Promise<ProjectDetailData | null> {
  try {
    return (await getPublicProjectBySlug(slug)) as ProjectDetailData;
  } catch (error) {
    console.error("[public-data] failed to load project", slug, error);
    return null;
  }
}

export async function fetchTeamList(): Promise<PublicTeamMember[]> {
  try {
    return await listPublicTeam();
  } catch (error) {
    console.error("[public-data] failed to load team", error);
    return [];
  }
}

export async function fetchTeamDetail(
  slug: string,
): Promise<TeamMemberDetailData | null> {
  try {
    return (await getPublicTeamBySlug(slug)) as TeamMemberDetailData;
  } catch (error) {
    console.error("[public-data] failed to load team member", slug, error);
    return null;
  }
}

export async function fetchBlogList(): Promise<PublicBlogPost[]> {
  try {
    const { items } = await listPublicBlog({ limit: 50 });
    return items as PublicBlogPost[];
  } catch (error) {
    console.error("[public-data] failed to load blog", error);
    return [];
  }
}

export async function fetchBlogDetail(
  slug: string,
): Promise<BlogDetailData | null> {
  try {
    return (await getPublicBlogBySlug(slug)) as BlogDetailData;
  } catch (error) {
    console.error("[public-data] failed to load blog post", slug, error);
    return null;
  }
}

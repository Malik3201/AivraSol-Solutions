import type { Model } from "mongoose";
import { connectDB } from "@/lib/db";
import { getDatabaseDiagnostics } from "@/lib/db-info";
import { BlogPost } from "@/lib/models/BlogPost";
import { ContactLead } from "@/lib/models/ContactLead";
import { FAQ } from "@/lib/models/FAQ";
import { Project } from "@/lib/models/Project";
import { Service } from "@/lib/models/Service";
import { SiteSetting } from "@/lib/models/SiteSetting";
import { TeamMember } from "@/lib/models/TeamMember";
import { Testimonial } from "@/lib/models/Testimonial";
import { ApiError } from "@/lib/api-error";
import {
  buildSeoFromContent,
  buildSeoObject,
  getSeoSettingKey,
  type SeoPageKey,
} from "@/lib/services/seo";
import {
  contentSort,
  blogSort,
  listDocuments,
} from "@/lib/services/admin-crud";
import { buildPaginationMeta, parsePagination } from "@/lib/utils/pagination";
import type {
  HomePageData,
  PublicFAQ,
  PublicProject,
  PublicService,
  PublicTeamMember,
  PublicTestimonial,
} from "@/lib/api/types";
import { normalizeTeamMember, normalizeTeamMembers } from "@/lib/team/normalize-member";

function stripDoc<T extends { _id: unknown }>(doc: T) {
  const { _id, __v, ...rest } = doc as T & { __v?: unknown };
  return { id: String(_id), ...rest };
}

export async function getPublicSettingsMap(): Promise<Record<string, unknown>> {
  await connectDB();
  const settings = await SiteSetting.find({ isPublic: true }).lean();
  return settings.reduce<Record<string, unknown>>((acc, item) => {
    acc[item.key] = item.value;
    return acc;
  }, {});
}

export async function getPageSeo(pageKey: SeoPageKey) {
  await connectDB();
  const settings = await getPublicSettingsMap();
  const globalSeo = (settings.globalSeo as Record<string, unknown>) ?? {};
  const pageSeo =
    (settings[getSeoSettingKey(pageKey)] as Record<string, unknown>) ?? {};

  const pathMap: Record<SeoPageKey, string> = {
    home: "/",
    about: "/about",
    services: "/services",
    projects: "/projects",
    team: "/team",
    contact: "/contact",
    blog: "/blog",
  };

  return buildSeoObject({
    title:
      (pageSeo.title as string) ||
      (globalSeo.title as string) ||
      "AIVRASOL",
    description:
      (pageSeo.description as string) ||
      (globalSeo.description as string),
    keywords: (pageSeo.keywords as string[]) || (globalSeo.keywords as string[]),
    path: pathMap[pageKey],
    image: (pageSeo.image as string) || (globalSeo.image as string),
  });
}

const HOME_FEATURED_MAX = 24;

/** All active + featured items for homepage carousels. */
async function listAllFeaturedForHome(
  model: Model<unknown>,
): Promise<Array<{ _id: unknown } & Record<string, unknown>>> {
  return model
    .find({ isActive: true, isFeatured: true })
    .sort(contentSort)
    .limit(HOME_FEATURED_MAX)
    .select("-__v")
    .lean();
}

export async function getHomepageData(): Promise<HomePageData> {
  await connectDB();
  const settings = await getPublicSettingsMap();

  const [
    featuredServices,
    featuredProjects,
    featuredTestimonials,
    teamPreview,
    faqPreview,
  ] = await Promise.all([
    listAllFeaturedForHome(Service),
    listAllFeaturedForHome(Project),
    Testimonial.find({ isActive: true, isFeatured: true })
      .sort(contentSort)
      .limit(6)
      .select("-__v")
      .lean(),
    TeamMember.find({ isActive: true })
      .sort({ sortOrder: 1, createdAt: -1 })
      .limit(4)
      .select("-__v")
      .lean(),
    FAQ.find({ isActive: true })
      .sort({ sortOrder: 1, createdAt: -1 })
      .limit(6)
      .select("-__v")
      .lean(),
  ]);

  const hero = settings.homeHero ?? null;
  const robotGuideSettings = settings.robotGuideSettings ?? null;
  const stats = settings.homeStats ?? null;

  return {
    hero,
    featuredServices: featuredServices.map(stripDoc) as unknown as PublicService[],
    featuredProjects: featuredProjects.map(stripDoc) as unknown as PublicProject[],
    featuredTestimonials: featuredTestimonials.map(
      stripDoc,
    ) as PublicTestimonial[],
    teamPreview: normalizeTeamMembers(teamPreview.map(stripDoc)),
    faqPreview: faqPreview.map(stripDoc) as PublicFAQ[],
    robotGuideSettings,
    seo: await getPageSeo("home"),
    stats,
    settings: {
      companyName: settings.companyName,
      tagline: settings.tagline,
      contactEmail: settings.contactEmail,
      phone: settings.phone,
      socialLinks: settings.socialLinks,
      ctaLabels: settings.ctaLabels,
    },
  };
}

export async function listPublicServices(query: {
  page?: number;
  limit?: number;
  search?: string;
  featured?: boolean;
}) {
  await connectDB();
  const { page, limit, skip } = parsePagination(query, {
    defaultLimit: 12,
    maxLimit: 50,
  });

  const filter: Record<string, unknown> = { isActive: true };
  if (query.featured) filter.isFeatured = true;

  const { items, meta } = await listDocuments(Service, {
    page,
    limit,
    skip,
    search: query.search,
    searchFields: ["title", "shortDescription", "description"],
    filter,
    sort: contentSort,
  });

  return { items: items.map(stripDoc), meta };
}

export async function getPublicServiceBySlug(slug: string) {
  await connectDB();
  const service = await Service.findOne({ slug, isActive: true })
    .select("-__v")
    .lean();
  if (!service) throw new ApiError("Service not found", 404);

  const [relatedProjects, relatedFAQs] = await Promise.all([
    Project.find({
      isActive: true,
      $or: [{ services: service.title }, { services: service.slug }],
    })
      .sort(contentSort)
      .limit(4)
      .select("-__v")
      .lean(),
    FAQ.find({ isActive: true, category: "services" })
      .sort({ sortOrder: 1 })
      .limit(6)
      .select("-__v")
      .lean(),
  ]);

  return {
    service: stripDoc(service),
    relatedProjects: relatedProjects.map(stripDoc),
    relatedFAQs: relatedFAQs.map(stripDoc),
    seo: buildSeoFromContent({
      title: service.title,
      shortDescription: service.shortDescription ?? undefined,
      description: service.description ?? undefined,
      seoTitle: service.seoTitle ?? undefined,
      seoDescription: service.seoDescription ?? undefined,
      seoKeywords: service.seoKeywords,
      path: `/services/${service.slug}`,
      image: service.coverImage ?? undefined,
    }),
  };
}

export async function listPublicProjects(query: {
  page?: number;
  limit?: number;
  search?: string;
  technology?: string;
  service?: string;
  featured?: boolean;
}) {
  await connectDB();
  const { page, limit, skip } = parsePagination(query, {
    defaultLimit: 12,
    maxLimit: 50,
  });

  const filter: Record<string, unknown> = { isActive: true };
  if (query.featured) filter.isFeatured = true;
  if (query.technology) filter.technologies = query.technology;
  if (query.service) {
    filter.$or = [
      { services: query.service },
      { services: { $regex: query.service, $options: "i" } },
    ];
  }

  const { items, meta } = await listDocuments(Project, {
    page,
    limit,
    skip,
    search: query.search,
    searchFields: ["title", "shortDescription", "clientName", "industry"],
    filter,
    sort: contentSort,
  });

  return { items: items.map(stripDoc), meta };
}

export async function getPublicProjectBySlug(slug: string) {
  await connectDB();
  const project = await Project.findOne({ slug, isActive: true })
    .select("-__v")
    .lean();
  if (!project) throw new ApiError("Project not found", 404);

  const relatedServices = project.services?.length
    ? await Service.find({
        isActive: true,
        $or: [
          { slug: { $in: project.services } },
          { title: { $in: project.services } },
        ],
      })
        .sort(contentSort)
        .limit(6)
        .select("-__v")
        .lean()
    : [];

  return {
    project: stripDoc(project),
    relatedServices: relatedServices.map(stripDoc),
    seo: buildSeoFromContent({
      title: project.title,
      shortDescription: project.shortDescription ?? undefined,
      description: project.description ?? undefined,
      seoTitle: project.seoTitle ?? undefined,
      seoDescription: project.seoDescription ?? undefined,
      seoKeywords: project.seoKeywords,
      path: `/projects/${project.slug}`,
      image: project.coverImage ?? undefined,
    }),
  };
}

export async function listPublicTeam() {
  await connectDB();
  const members = await TeamMember.find({ isActive: true })
    .sort({ sortOrder: 1, createdAt: -1 })
    .select("-__v")
    .lean();
  return normalizeTeamMembers(members.map(stripDoc));
}

export async function getPublicTeamBySlug(slug: string) {
  await connectDB();
  const member = await TeamMember.findOne({ slug, isActive: true })
    .select("-__v")
    .lean();
  if (!member) throw new ApiError("Team member not found", 404);

  const [relatedProjects, relatedTestimonials] = await Promise.all([
    Project.find({ isActive: true }).sort(contentSort).limit(4).select("-__v").lean(),
    Testimonial.find({ isActive: true }).sort(contentSort).limit(4).select("-__v").lean(),
  ]);

  return {
    member: normalizeTeamMember(stripDoc(member)),
    relatedProjects: relatedProjects.map(stripDoc) as unknown as PublicProject[],
    relatedTestimonials: relatedTestimonials.map(stripDoc) as unknown as PublicTestimonial[],
    seo: buildSeoFromContent({
      title: member.name,
      shortDescription: member.role,
      description: member.bio ?? undefined,
      seoTitle: member.seoTitle ?? undefined,
      seoDescription: member.seoDescription ?? undefined,
      path: `/team/${member.slug}`,
      image: member.photo ?? undefined,
    }),
  };
}

export async function listPublicTestimonials() {
  await connectDB();
  const items = await Testimonial.find({ isActive: true })
    .sort(contentSort)
    .select("-__v")
    .lean();
  return items.map(stripDoc);
}

export async function listPublicFaqs(category?: string) {
  await connectDB();
  const filter: Record<string, unknown> = { isActive: true };
  if (category) filter.category = category;

  const items = await FAQ.find(filter)
    .sort({ category: 1, sortOrder: 1, createdAt: -1 })
    .select("-__v")
    .lean();
  return items.map(stripDoc);
}

export async function listPublicBlog(query: {
  page?: number;
  limit?: number;
  search?: string;
  tag?: string;
  featured?: boolean;
}) {
  await connectDB();
  const { page, limit, skip } = parsePagination(query, {
    defaultLimit: 10,
    maxLimit: 50,
  });

  const filter: Record<string, unknown> = { status: "published" };
  if (query.featured) filter.isFeatured = true;
  if (query.tag) filter.tags = query.tag;

  const searchFilter = query.search?.trim()
    ? {
        $or: [
          { title: { $regex: query.search, $options: "i" } },
          { excerpt: { $regex: query.search, $options: "i" } },
        ],
      }
    : {};

  const combinedFilter = { ...filter, ...searchFilter };

  const [items, total] = await Promise.all([
    BlogPost.find(combinedFilter)
      .sort(blogSort)
      .skip(skip)
      .limit(limit)
      .select("-content -__v")
      .lean(),
    BlogPost.countDocuments(combinedFilter),
  ]);

  return {
    items: items.map(stripDoc),
    meta: buildPaginationMeta(total, page, limit),
  };
}

export async function getPublicBlogBySlug(slug: string) {
  await connectDB();
  const post = await BlogPost.findOne({ slug, status: "published" })
    .select("-__v")
    .lean();
  if (!post) throw new ApiError("Blog post not found", 404);

  const relatedPosts = await BlogPost.find({
    status: "published",
    slug: { $ne: slug },
    tags: post.tags?.length ? { $in: post.tags } : undefined,
  })
    .sort(blogSort)
    .limit(4)
    .select("title slug excerpt coverImage publishedAt tags")
    .lean();

  return {
    post: stripDoc(post),
    relatedPosts: relatedPosts.map(stripDoc),
    seo: buildSeoFromContent({
      title: post.title,
      shortDescription: post.excerpt ?? undefined,
      description: post.excerpt ?? undefined,
      seoTitle: post.seoTitle ?? undefined,
      seoDescription: post.seoDescription ?? undefined,
      seoKeywords: post.seoKeywords,
      path: `/blog/${post.slug}`,
      image: post.coverImage ?? undefined,
    }),
  };
}

export async function createContactLead(data: {
  name: string;
  email: string;
  message: string;
  phone?: string;
  company?: string;
  subject?: string;
  serviceInterest?: string;
  budgetRange?: string;
  source?: string;
}) {
  await connectDB();
  const lead = await ContactLead.create({
    name: data.name,
    email: data.email,
    phone: data.phone,
    company: data.company,
    serviceInterest: data.serviceInterest || data.subject,
    budgetRange: data.budgetRange,
    message: data.message,
    source: data.source ?? "website",
    status: "new",
  });
  return stripDoc(lead.toObject());
}

export async function getAdminDashboardStats() {
  const [database, counts] = await Promise.all([
    getDatabaseDiagnostics(),
    (async () => {
      await connectDB();
      return Promise.all([
        Service.countDocuments(),
        Service.countDocuments({ isActive: true }),
        Project.countDocuments(),
        Project.countDocuments({ isActive: true }),
        TeamMember.countDocuments(),
        Testimonial.countDocuments(),
        FAQ.countDocuments(),
        BlogPost.countDocuments(),
        BlogPost.countDocuments({ status: "published" }),
        ContactLead.countDocuments(),
        ContactLead.countDocuments({ status: "new" }),
        ContactLead.find().sort({ createdAt: -1 }).limit(5).lean(),
        import("@/lib/models/AiLog").then(({ AiLog }) =>
          AiLog.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select("-prompt -response")
            .lean(),
        ),
      ]);
    })(),
  ]);

  const [
    totalServices,
    activeServices,
    totalProjects,
    activeProjects,
    totalTeamMembers,
    totalTestimonials,
    totalFAQs,
    totalBlogPosts,
    publishedBlogPosts,
    totalContactLeads,
    newContactLeads,
    recentContactLeads,
    recentAiLogs,
  ] = counts;

  const recentUpdatedContent = await Promise.all([
    Service.find().sort({ updatedAt: -1 }).limit(3).select("title slug updatedAt").lean(),
    Project.find().sort({ updatedAt: -1 }).limit(3).select("title slug updatedAt").lean(),
    BlogPost.find().sort({ updatedAt: -1 }).limit(3).select("title slug status updatedAt").lean(),
  ]);

  return {
    database,
    totalServices,
    activeServices,
    totalProjects,
    activeProjects,
    totalTeamMembers,
    totalTestimonials,
    totalFAQs,
    totalBlogPosts,
    publishedBlogPosts,
    totalContactLeads,
    newContactLeads,
    recentContactLeads: recentContactLeads.map(stripDoc),
    recentAiLogs: recentAiLogs.map(stripDoc),
    recentUpdatedContent: {
      services: recentUpdatedContent[0].map(stripDoc),
      projects: recentUpdatedContent[1].map(stripDoc),
      blogPosts: recentUpdatedContent[2].map(stripDoc),
    },
  };
}

export async function adminSearch(query: string) {
  await connectDB();
  const regex = { $regex: query.trim(), $options: "i" };
  const limit = 5;

  const [services, projects, teamMembers, blogPosts, faqs, testimonials] =
    await Promise.all([
      Service.find({ $or: [{ title: regex }, { shortDescription: regex }] })
        .limit(limit)
        .select("title slug isActive")
        .lean(),
      Project.find({ $or: [{ title: regex }, { clientName: regex }] })
        .limit(limit)
        .select("title slug isActive")
        .lean(),
      TeamMember.find({ $or: [{ name: regex }, { role: regex }] })
        .limit(limit)
        .select("name slug isActive")
        .lean(),
      BlogPost.find({ $or: [{ title: regex }, { excerpt: regex }] })
        .limit(limit)
        .select("title slug status")
        .lean(),
      FAQ.find({ $or: [{ question: regex }, { answer: regex }] })
        .limit(limit)
        .select("question category isActive")
        .lean(),
      Testimonial.find({ $or: [{ clientName: regex }, { quote: regex }] })
        .limit(limit)
        .select("clientName company isActive")
        .lean(),
    ]);

  return {
    services: services.map(stripDoc),
    projects: projects.map(stripDoc),
    teamMembers: teamMembers.map(stripDoc),
    blogPosts: blogPosts.map(stripDoc),
    faqs: faqs.map(stripDoc),
    testimonials: testimonials.map(stripDoc),
  };
}

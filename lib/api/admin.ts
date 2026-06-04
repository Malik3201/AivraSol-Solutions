import { apiFetch, apiFetchWithMeta } from "@/lib/api/client";
import type {
  AdminBlogRecord,
  AdminContactLead,
  AdminDashboardStats,
  AdminFaqRecord,
  AdminListMeta,
  AdminMediaAsset,
  AdminProjectRecord,
  AdminServiceRecord,
  AdminSiteSetting,
  AdminTeamRecord,
  AdminTestimonialRecord,
  AdminUser,
} from "@/lib/api/types";

export type { AdminUser } from "@/lib/api/types";

type ListParams = Record<string, string | number | boolean | undefined>;

function withCreds(init?: RequestInit): RequestInit {
  return { ...init, credentials: "include" };
}

export function login(email: string, password: string) {
  return apiFetch<{ admin: AdminUser }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
}

export function me() {
  return apiFetch<{ admin: AdminUser }>("/api/auth/me", {
    credentials: "include",
  });
}

export function logout() {
  return apiFetch<null>("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}

export function getDashboard() {
  return apiFetch<AdminDashboardStats>("/api/admin/dashboard", {
    credentials: "include",
  });
}

export async function adminList<T>(
  resource: string,
  params?: ListParams,
): Promise<{ data: T[]; meta?: AdminListMeta }> {
  return apiFetchWithMeta<T[]>(`/api/admin/${resource}`, {
    params,
    credentials: "include",
  });
}

export function adminGet<T>(resource: string, id: string) {
  return apiFetch<T>(`/api/admin/${resource}/${id}`, {
    credentials: "include",
  });
}

export function adminCreate<T>(
  resource: string,
  body: Record<string, unknown>,
) {
  return apiFetch<T>(`/api/admin/${resource}`, {
    method: "POST",
    body: JSON.stringify(body),
    credentials: "include",
  });
}

export function adminUpdate<T>(
  resource: string,
  id: string,
  body: Record<string, unknown>,
) {
  return apiFetch<T>(`/api/admin/${resource}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
    credentials: "include",
  });
}

export function adminDelete(resource: string, id: string) {
  return apiFetch<null>(`/api/admin/${resource}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
}

export const servicesApi = {
  list: (params?: ListParams) => adminList<AdminServiceRecord>("services", params),
  create: (body: Record<string, unknown>) =>
    adminCreate<AdminServiceRecord>("services", body),
  update: (id: string, body: Record<string, unknown>) =>
    adminUpdate<AdminServiceRecord>("services", id, body),
  delete: (id: string) => adminDelete("services", id),
};

export const projectsApi = {
  list: (params?: ListParams) => adminList<AdminProjectRecord>("projects", params),
  create: (body: Record<string, unknown>) =>
    adminCreate<AdminProjectRecord>("projects", body),
  update: (id: string, body: Record<string, unknown>) =>
    adminUpdate<AdminProjectRecord>("projects", id, body),
  delete: (id: string) => adminDelete("projects", id),
};

export const teamApi = {
  list: (params?: ListParams) =>
    adminList<AdminTeamRecord>("team-members", params),
  create: (body: Record<string, unknown>) =>
    adminCreate<AdminTeamRecord>("team-members", body),
  update: (id: string, body: Record<string, unknown>) =>
    adminUpdate<AdminTeamRecord>("team-members", id, body),
  delete: (id: string) => adminDelete("team-members", id),
};

export const testimonialsApi = {
  list: (params?: ListParams) =>
    adminList<AdminTestimonialRecord>("testimonials", params),
  create: (body: Record<string, unknown>) =>
    adminCreate<AdminTestimonialRecord>("testimonials", body),
  update: (id: string, body: Record<string, unknown>) =>
    adminUpdate<AdminTestimonialRecord>("testimonials", id, body),
  delete: (id: string) => adminDelete("testimonials", id),
};

export const faqsApi = {
  list: (params?: ListParams) => adminList<AdminFaqRecord>("faqs", params),
  create: (body: Record<string, unknown>) =>
    adminCreate<AdminFaqRecord>("faqs", body),
  update: (id: string, body: Record<string, unknown>) =>
    adminUpdate<AdminFaqRecord>("faqs", id, body),
  delete: (id: string) => adminDelete("faqs", id),
};

export const blogApi = {
  list: (params?: ListParams) =>
    adminList<AdminBlogRecord>("blog-posts", params),
  create: (body: Record<string, unknown>) =>
    adminCreate<AdminBlogRecord>("blog-posts", body),
  update: (id: string, body: Record<string, unknown>) =>
    adminUpdate<AdminBlogRecord>("blog-posts", id, body),
  delete: (id: string) => adminDelete("blog-posts", id),
  publish: (id: string) =>
    apiFetch<AdminBlogRecord>(`/api/admin/blog-posts/${id}/publish`, {
      method: "PATCH",
      credentials: "include",
    }),
  unpublish: (id: string) =>
    apiFetch<AdminBlogRecord>(`/api/admin/blog-posts/${id}/unpublish`, {
      method: "PATCH",
      credentials: "include",
    }),
};

export const leadsApi = {
  list: (params?: ListParams) =>
    adminList<AdminContactLead>("contact-leads", params),
  get: (id: string) => adminGet<AdminContactLead>("contact-leads", id),
  update: (id: string, body: Record<string, unknown>) =>
    adminUpdate<AdminContactLead>("contact-leads", id, body),
  delete: (id: string) => adminDelete("contact-leads", id),
};

export const mediaApi = {
  list: (params?: ListParams) => adminList<AdminMediaAsset>("media", params),
  update: (id: string, body: Record<string, unknown>) =>
    adminUpdate<AdminMediaAsset>("media", id, body),
  delete: (id: string) => adminDelete("media", id),
};

export const settingsApi = {
  list: (params?: ListParams) =>
    adminList<AdminSiteSetting>("site-settings", params),
  create: (body: Record<string, unknown>) =>
    adminCreate<AdminSiteSetting>("site-settings", body),
  update: (id: string, body: Record<string, unknown>) =>
    adminUpdate<AdminSiteSetting>("site-settings", id, body),
  delete: (id: string) => adminDelete("site-settings", id),
};

export function uploadImage(file: File, folder: string, altText?: string) {
  const form = new FormData();
  form.append("file", file);
  form.append("folder", folder);
  if (altText) form.append("altText", altText);
  return apiFetch<AdminMediaAsset>("/api/upload/image", {
    method: "POST",
    body: form,
    credentials: "include",
  });
}

export function uploadMultiple(files: File[], folder: string) {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  form.append("folder", folder);
  return apiFetch<AdminMediaAsset[]>("/api/upload/multiple", {
    method: "POST",
    body: form,
    credentials: "include",
  });
}

export function aiServiceContent(body: Record<string, unknown>) {
  return apiFetch<Record<string, unknown>>("/api/ai/admin/service-content", {
    method: "POST",
    body: JSON.stringify(body),
    credentials: "include",
  });
}

export function aiProjectContent(body: Record<string, unknown>) {
  return apiFetch<Record<string, unknown>>("/api/ai/admin/project-content", {
    method: "POST",
    body: JSON.stringify(body),
    credentials: "include",
  });
}

export function aiBlogContent(body: Record<string, unknown>) {
  return apiFetch<Record<string, unknown>>("/api/ai/admin/blog-content", {
    method: "POST",
    body: JSON.stringify(body),
    credentials: "include",
  });
}

export function aiFaqContent(body: Record<string, unknown>) {
  return apiFetch<Record<string, unknown>>("/api/ai/admin/faq-content", {
    method: "POST",
    body: JSON.stringify(body),
    credentials: "include",
  });
}

export function aiSeoContent(body: Record<string, unknown>) {
  return apiFetch<Record<string, unknown>>("/api/ai/admin/seo-content", {
    method: "POST",
    body: JSON.stringify(body),
    credentials: "include",
  });
}

export function adminSearch(q: string) {
  return apiFetch<unknown>("/api/admin/search", {
    params: { q },
    credentials: "include",
  });
}

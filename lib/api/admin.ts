import { apiFetch } from "@/lib/api/client";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
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

export async function adminList<T>(
  resource: string,
  params?: Record<string, string | number | boolean | undefined>,
) {
  return apiFetch<T[]>(`/api/admin/${resource}`, {
    params,
    credentials: "include",
  });
}

export async function adminGet<T>(resource: string, id: string) {
  return apiFetch<T>(`/api/admin/${resource}/${id}`, {
    credentials: "include",
  });
}

export async function adminCreate<T>(
  resource: string,
  body: Record<string, unknown>,
) {
  return apiFetch<T>(`/api/admin/${resource}`, {
    method: "POST",
    body: JSON.stringify(body),
    credentials: "include",
  });
}

export async function adminUpdate<T>(
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

export async function adminDelete(resource: string, id: string) {
  return apiFetch<null>(`/api/admin/${resource}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
}

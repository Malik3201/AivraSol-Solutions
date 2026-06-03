import type { ApiResponse } from "@/lib/api/types";

export class ApiClientError extends Error {
  status: number;
  errors?: unknown;

  constructor(message: string, status = 500, errors?: unknown) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.errors = errors;
  }
}

function getBaseUrl(): string {
  if (typeof window !== "undefined") return "";
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "";
}

export interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

function buildUrl(path: string, params?: FetchOptions["params"]): string {
  const base = getBaseUrl();
  const url = new URL(path.startsWith("http") ? path : `${base}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
}

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const { params, headers, ...init } = options;
  const url = buildUrl(path, params);

  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...headers,
    },
    credentials: init.credentials ?? "same-origin",
    cache: init.cache ?? "no-store",
  });

  let json: ApiResponse<T> | { success: false; message: string; errors?: unknown };

  try {
    json = await response.json();
  } catch {
    throw new ApiClientError("Invalid server response", response.status);
  }

  if (!response.ok || !json.success) {
    throw new ApiClientError(
      json.message || "Request failed",
      response.status,
      "errors" in json ? json.errors : undefined,
    );
  }

  return json.data;
}

export async function apiFetchWithMeta<T>(
  path: string,
  options?: FetchOptions,
): Promise<{ data: T; meta?: ApiResponse<T>["meta"] }> {
  const { params, headers, ...init } = options ?? {};
  const url = buildUrl(path, params);

  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: init.credentials ?? "same-origin",
    cache: init.cache ?? "no-store",
  });

  const json = (await response.json()) as ApiResponse<T> & {
    success: boolean;
    errors?: unknown;
  };

  if (!response.ok || !json.success) {
    throw new ApiClientError(
      json.message || "Request failed",
      response.status,
      json.errors,
    );
  }

  return { data: json.data, meta: json.meta };
}

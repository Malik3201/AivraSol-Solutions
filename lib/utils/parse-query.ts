import type { NextRequest } from "next/server";

export function getQueryParams(request: NextRequest): Record<string, string> {
  const params: Record<string, string> = {};
  request.nextUrl.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

export function getQueryBoolean(
  value: string | undefined,
): boolean | undefined {
  if (value === undefined) return undefined;
  return value === "true" || value === "1";
}

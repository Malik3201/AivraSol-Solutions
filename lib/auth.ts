import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import type { NextResponse } from "next/server";
import { ApiError } from "@/lib/api-error";
import { connectDB } from "@/lib/db";
import { getServerEnv, isAdminAuthConfigured } from "@/lib/env";
import {
  Admin,
  type AdminRole,
  type SafeAdmin,
  toSafeAdmin,
} from "@/lib/models/Admin";
import { assertRole } from "@/lib/permissions";

export const ADMIN_TOKEN_COOKIE = "aivrasol_admin_token";

/** @deprecated Use ADMIN_TOKEN_COOKIE */
export const ADMIN_SESSION_COOKIE = ADMIN_TOKEN_COOKIE;

export interface AdminTokenPayload {
  sub: string;
  email: string;
  name: string;
  role: AdminRole;
}

function getJwtSecret(): Uint8Array {
  if (!isAdminAuthConfigured()) {
    throw new ApiError("Admin authentication is not configured", 503);
  }
  return new TextEncoder().encode(getServerEnv().ADMIN_JWT_SECRET);
}

function cookieMaxAgeSeconds(): number {
  const expiresIn = getServerEnv().ADMIN_JWT_EXPIRES_IN ?? "7d";
  const match = expiresIn.match(/^(\d+)([dhms])$/);
  if (!match) return 60 * 60 * 24 * 7;
  const value = Number(match[1]);
  const unit = match[2];
  const multipliers: Record<string, number> = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
  };
  return value * (multipliers[unit] ?? 86400);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}

export async function signAdminToken(
  payload: AdminTokenPayload,
): Promise<string> {
  const expiresIn = getServerEnv().ADMIN_JWT_EXPIRES_IN ?? "7d";

  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getJwtSecret());
}

export async function verifyAdminToken(
  token: string,
): Promise<AdminTokenPayload> {
  const { payload } = await jwtVerify(token, getJwtSecret());
  const sub = payload.sub;
  const email = payload.email;
  const name = payload.name;
  const role = payload.role;

  if (
    typeof sub !== "string" ||
    typeof email !== "string" ||
    typeof name !== "string" ||
    typeof role !== "string" ||
    !["super_admin", "admin", "editor"].includes(role)
  ) {
    throw new ApiError("Invalid session", 401);
  }

  return {
    sub,
    email,
    name,
    role: role as AdminRole,
  };
}

export function getTokenFromRequest(request: NextRequest): string | null {
  return request.cookies.get(ADMIN_TOKEN_COOKIE)?.value ?? null;
}

export async function getTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_TOKEN_COOKIE)?.value ?? null;
}

export async function getCurrentAdminFromRequest(
  request?: NextRequest,
): Promise<SafeAdmin | null> {
  if (!isAdminAuthConfigured()) return null;

  const token = request
    ? getTokenFromRequest(request)
    : await getTokenFromCookies();
  if (!token) return null;

  try {
    const session = await verifyAdminToken(token);
    await connectDB();
    const admin = await Admin.findById(session.sub);
    if (!admin || !admin.isActive) return null;
    return toSafeAdmin(admin);
  } catch {
    return null;
  }
}

export async function requireAdmin(
  request?: NextRequest,
): Promise<SafeAdmin> {
  const admin = await getCurrentAdminFromRequest(request);
  if (!admin) {
    throw new ApiError("Unauthorized", 401);
  }
  return admin;
}

export async function requireRole(
  requiredRole: AdminRole,
  request?: NextRequest,
): Promise<SafeAdmin> {
  const admin = await requireAdmin(request);
  assertRole(admin.role, requiredRole);
  return admin;
}

export function getAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: cookieMaxAgeSeconds(),
  };
}

/** Prefer on Route Handler responses so Set-Cookie reaches browser fetch clients. */
export function attachAdminSessionCookie(
  response: NextResponse,
  token: string,
): NextResponse {
  response.cookies.set(ADMIN_TOKEN_COOKIE, token, getAdminSessionCookieOptions());
  return response;
}

export async function setAdminSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_TOKEN_COOKIE, token, getAdminSessionCookieOptions());
}

export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_TOKEN_COOKIE);
}

/** @deprecated Use getCurrentAdminFromRequest */
export async function getAdminSession(): Promise<AdminTokenPayload | null> {
  const token = await getTokenFromCookies();
  if (!token) return null;
  try {
    return await verifyAdminToken(token);
  } catch {
    return null;
  }
}

/** @deprecated Use requireAdmin */
export async function requireAdminSession(): Promise<AdminTokenPayload> {
  const token = await getTokenFromCookies();
  if (!token) throw new ApiError("Unauthorized", 401);
  return verifyAdminToken(token);
}

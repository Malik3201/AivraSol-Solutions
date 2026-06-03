import type { NextRequest } from "next/server";
import { successResponse } from "@/lib/api-response";
import { ApiError } from "@/lib/api-error";
import { asyncHandler } from "@/lib/utils/async-handler";
import { assertRateLimit, getRateLimitKey } from "@/lib/utils/rate-limit";
import { getClientIp } from "@/lib/utils/request-ip";
import {
  comparePassword,
  setAdminSessionCookie,
  signAdminToken,
} from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { isAdminAuthConfigured, isDbConfigured } from "@/lib/env";
import { Admin, toSafeAdmin } from "@/lib/models/Admin";
import { adminLoginSchema } from "@/lib/validators/auth.validator";

export const POST = asyncHandler(async (request: NextRequest) => {
  assertRateLimit({
    key: getRateLimitKey("login", getClientIp(request)),
    limit: 10,
    windowMs: 15 * 60 * 1000,
  });

  if (!isDbConfigured() || !isAdminAuthConfigured()) {
    throw new ApiError("Authentication service is not configured", 503);
  }

  const body = await request.json();
  const parsed = adminLoginSchema.safeParse(body);
  if (!parsed.success) {
    throw new ApiError("Invalid login payload", 400, parsed.error.flatten());
  }

  await connectDB();

  const admin = await Admin.findOne({
    email: parsed.data.email.toLowerCase(),
    isActive: true,
  }).select("+passwordHash");

  if (!admin?.passwordHash) {
    throw new ApiError("Invalid email or password", 401);
  }

  const valid = await comparePassword(parsed.data.password, admin.passwordHash);
  if (!valid) {
    throw new ApiError("Invalid email or password", 401);
  }

  admin.lastLoginAt = new Date();
  await admin.save();

  const token = await signAdminToken({
    sub: String(admin._id),
    email: admin.email,
    name: admin.name,
    role: admin.role,
  });

  await setAdminSessionCookie(token);

  return successResponse(
    { admin: toSafeAdmin(admin) },
    "Logged in successfully",
  );
});

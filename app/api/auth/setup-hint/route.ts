import { successResponse } from "@/lib/api-response";
import { asyncHandler } from "@/lib/utils/async-handler";
import { connectDB } from "@/lib/db";
import { isAdminAuthConfigured, isDbConfigured } from "@/lib/env";
import { Admin } from "@/lib/models/Admin";

/** Dev helper: tells the login UI whether auth is configured and if an admin exists. */
export const GET = asyncHandler(async () => {
  const dbConfigured = isDbConfigured();
  const jwtConfigured = isAdminAuthConfigured();
  const jwtLongEnough = (process.env.ADMIN_JWT_SECRET?.trim().length ?? 0) >= 16;

  let adminCount = 0;
  if (dbConfigured) {
    try {
      await connectDB();
      adminCount = await Admin.countDocuments({ isActive: true });
    } catch {
      adminCount = -1;
    }
  }

  const seedEmail = process.env.ADMIN_SEED_EMAIL?.toLowerCase();

  return successResponse(
    {
      dbConfigured,
      jwtConfigured: jwtConfigured && jwtLongEnough,
      adminCount,
      seedEmail: process.env.NODE_ENV === "development" ? seedEmail : undefined,
      needsSeed: adminCount === 0,
      hint:
        adminCount === 0
          ? "Run npm run seed:admin in the project folder, then sign in with ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD from .env"
          : adminCount < 0
            ? "Cannot reach MongoDB — check MONGODB_URI and network"
            : undefined,
    },
    "Setup hint",
  );
});

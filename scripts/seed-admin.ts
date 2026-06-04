import { hashPassword } from "../lib/auth";
import { connectDB, disconnectDB } from "../lib/db";
import { Admin } from "../lib/models/Admin";

const forceReset =
  process.argv.includes("--force") ||
  process.env.ADMIN_SEED_FORCE === "true" ||
  process.env.ADMIN_SEED_FORCE === "1";

async function main() {
  const name = process.env.ADMIN_SEED_NAME?.trim();
  const email = process.env.ADMIN_SEED_EMAIL?.trim();
  const password = process.env.ADMIN_SEED_PASSWORD?.trim();

  if (!process.env.MONGODB_URI || !name || !email || !password) {
    throw new Error(
      "Set MONGODB_URI, ADMIN_SEED_NAME, ADMIN_SEED_EMAIL, and ADMIN_SEED_PASSWORD in .env or .env.local",
    );
  }

  if (password.length < 8) {
    throw new Error("ADMIN_SEED_PASSWORD must be at least 8 characters");
  }

  await connectDB();

  const normalizedEmail = email.toLowerCase();
  const existing = await Admin.findOne({ email: normalizedEmail }).select(
    "+passwordHash",
  );

  if (existing) {
    if (forceReset) {
      existing.passwordHash = await hashPassword(password);
      existing.name = name;
      existing.isActive = true;
      existing.role = "super_admin";
      await existing.save();
      console.info(
        `[seed] Password reset for ${normalizedEmail} (use ADMIN_SEED_PASSWORD from env)`,
      );
    } else {
      console.info(
        `[seed] Admin already exists for ${normalizedEmail} — password NOT changed.`,
      );
      console.info(
        `[seed] Run: npm run seed:admin -- --force   (or set ADMIN_SEED_FORCE=true) to sync password from .env`,
      );
    }
    await disconnectDB();
    return;
  }

  const passwordHash = await hashPassword(password);

  await Admin.create({
    name,
    email: normalizedEmail,
    passwordHash,
    role: "super_admin",
    isActive: true,
  });

  console.info(`[seed] Super admin created for ${normalizedEmail}`);
  console.info(`[seed] Login with ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD from your env file`);
  await disconnectDB();
}

main().catch((error) => {
  console.error(
    "[seed] Failed:",
    error instanceof Error ? error.message : "Unknown error",
  );
  process.exit(1);
});

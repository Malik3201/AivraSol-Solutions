import { hashPassword } from "../lib/auth";
import { connectDB, disconnectDB } from "../lib/db";
import { Admin } from "../lib/models/Admin";

async function main() {
  const name = process.env.ADMIN_SEED_NAME;
  const email = process.env.ADMIN_SEED_EMAIL;
  const password = process.env.ADMIN_SEED_PASSWORD;

  if (!process.env.MONGODB_URI || !name || !email || !password) {
    throw new Error(
      "Set MONGODB_URI, ADMIN_SEED_NAME, ADMIN_SEED_EMAIL, and ADMIN_SEED_PASSWORD",
    );
  }

  await connectDB();

  const normalizedEmail = email.toLowerCase();
  const existing = await Admin.findOne({ email: normalizedEmail });

  if (existing) {
    console.info(`[seed] Admin already exists for ${normalizedEmail} — password unchanged`);
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
  await disconnectDB();
}

main().catch((error) => {
  console.error(
    "[seed] Failed:",
    error instanceof Error ? error.message : "Unknown error",
  );
  process.exit(1);
});

import { z } from "zod";

const serverEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  MONGODB_URI: z.string().min(1).optional(),
  ADMIN_JWT_SECRET: z.string().min(16).optional(),
  ADMIN_JWT_EXPIRES_IN: z.string().default("7d"),
  ADMIN_SEED_NAME: z.string().optional(),
  ADMIN_SEED_EMAIL: z.string().email().optional(),
  ADMIN_SEED_PASSWORD: z.string().min(8).optional(),
  IMAGEKIT_PUBLIC_KEY: z.string().optional(),
  IMAGEKIT_PRIVATE_KEY: z.string().optional(),
  IMAGEKIT_URL_ENDPOINT: z.string().url().optional(),
  LONGCAT_API_KEY: z.string().optional(),
  LONGCAT_BASE_URL: z.string().url().optional(),
  LONGCAT_MODEL: z.string().optional(),
  CONTACT_RECEIVER_EMAIL: z.string().email().optional(),
});

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: z.string().url().optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type PublicEnv = z.infer<typeof publicEnvSchema>;
export type Env = ServerEnv & PublicEnv;

let cachedServerEnv: ServerEnv | null = null;
let cachedPublicEnv: PublicEnv | null = null;

function formatZodError(error: z.ZodError): string {
  return error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
}

export function getServerEnv(): ServerEnv {
  if (cachedServerEnv) return cachedServerEnv;
  const parsed = serverEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(`Invalid server environment:\n${formatZodError(parsed.error)}`);
  }
  cachedServerEnv = parsed.data;
  return cachedServerEnv;
}

export function getPublicEnv(): PublicEnv {
  if (cachedPublicEnv) return cachedPublicEnv;
  const parsed = publicEnvSchema.safeParse({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT:
      process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
  });
  if (!parsed.success) {
    throw new Error(`Invalid public environment:\n${formatZodError(parsed.error)}`);
  }
  cachedPublicEnv = parsed.data;
  return cachedPublicEnv;
}

/** @deprecated Use getServerEnv/getPublicEnv */
export function getEnv(): Env {
  return { ...getServerEnv(), ...getPublicEnv() };
}

export const serverEnv = new Proxy({} as ServerEnv, {
  get(_target, prop: string) {
    return getServerEnv()[prop as keyof ServerEnv];
  },
});

export const publicEnv = new Proxy({} as PublicEnv, {
  get(_target, prop: string) {
    return getPublicEnv()[prop as keyof PublicEnv];
  },
});

export function isDbConfigured(): boolean {
  return Boolean(process.env.MONGODB_URI?.trim());
}

export function isImageKitConfigured(): boolean {
  return Boolean(
    process.env.IMAGEKIT_PUBLIC_KEY &&
      process.env.IMAGEKIT_PRIVATE_KEY &&
      process.env.IMAGEKIT_URL_ENDPOINT,
  );
}

export function isLongCatConfigured(): boolean {
  return Boolean(
    process.env.LONGCAT_API_KEY?.trim() && process.env.LONGCAT_BASE_URL?.trim(),
  );
}

export function isAdminAuthConfigured(): boolean {
  return Boolean(process.env.ADMIN_JWT_SECRET?.trim());
}

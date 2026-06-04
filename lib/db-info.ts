import mongoose from "mongoose";
import { connectDB } from "@/lib/db";

/** Default database — must match local Atlas database name. */
export const DEFAULT_MONGODB_DB_NAME = "AivraSol";

export function getMongoDbName(): string {
  return process.env.MONGODB_DB_NAME?.trim() || DEFAULT_MONGODB_DB_NAME;
}

/** Database name in the URI path, if present (before `?`). */
export function parseDatabaseNameFromUri(uri: string): string | null {
  const base = uri.split("?")[0] ?? uri;
  const segments = base.split("/").filter(Boolean);
  if (segments.length < 2) return null;
  const last = segments[segments.length - 1];
  if (!last || last.includes("@")) return null;
  return decodeURIComponent(last);
}

/** Cluster host for diagnostics (no credentials). */
export function getMongoHostFromUri(uri: string): string | null {
  try {
    const normalized = uri
      .replace(/^mongodb\+srv:\/\//, "https://")
      .replace(/^mongodb:\/\//, "http://");
    return new URL(normalized).hostname || null;
  } catch {
    const match = uri.match(/@([^/]+)/);
    return match?.[1]?.split(":")[0] ?? null;
  }
}

export type DatabaseDiagnostics = {
  connectedDatabase: string | null;
  configuredDatabase: string;
  databaseInUri: string | null;
  clusterHost: string | null;
  /** True when connected DB is not the configured canonical name. */
  isWrongDatabase: boolean;
  hint: string | null;
};

export async function getDatabaseDiagnostics(): Promise<DatabaseDiagnostics> {
  await connectDB();

  const connectedDatabase = mongoose.connection.db?.databaseName ?? null;
  const configuredDatabase = getMongoDbName();
  const uri = process.env.MONGODB_URI?.trim() ?? "";
  const databaseInUri = uri ? parseDatabaseNameFromUri(uri) : null;
  const clusterHost = uri ? getMongoHostFromUri(uri) : null;

  let isWrongDatabase = false;
  let hint: string | null = null;

  if (!connectedDatabase) {
    hint = "Could not read database name from the active connection.";
  } else if (connectedDatabase !== configuredDatabase) {
    isWrongDatabase = true;
    hint = `This deployment is connected to "${connectedDatabase}" but should use "${configuredDatabase}". Set MONGODB_DB_NAME=${configuredDatabase} on Vercel (and include /${configuredDatabase} in MONGODB_URI), then redeploy.`;
  } else if (
    connectedDatabase === "test" &&
    configuredDatabase !== "test"
  ) {
    isWrongDatabase = true;
    hint =
      'MongoDB defaulted to the "test" database. Add MONGODB_DB_NAME=AivraSol on Vercel and redeploy so local CMS data appears here.';
  } else if (databaseInUri && databaseInUri !== configuredDatabase) {
    hint = `MONGODB_URI path uses "${databaseInUri}" while MONGODB_DB_NAME is "${configuredDatabase}". The app uses MONGODB_DB_NAME for connections.`;
  }

  return {
    connectedDatabase,
    configuredDatabase,
    databaseInUri,
    clusterHost,
    isWrongDatabase,
    hint,
  };
}

import mongoose from "mongoose";
import { isDbConfigured } from "@/lib/env";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

global.mongooseCache = cached;

export async function connectDB(): Promise<typeof mongoose> {
  if (!isDbConfigured()) {
    throw new Error(
      "MongoDB is not configured. Set MONGODB_URI in your environment.",
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI!;
    cached.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
        maxPoolSize: 10,
      })
      .then((instance) => {
        if (process.env.NODE_ENV === "development") {
          console.info("[db] connected");
        }
        return instance;
      })
      .catch((error: unknown) => {
        cached.promise = null;
        const message =
          error instanceof Error ? error.message : "Database connection failed";
        console.error("[db] connection error");
        throw new Error(message);
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export async function disconnectDB(): Promise<void> {
  if (!cached.conn) return;
  await mongoose.disconnect();
  cached.conn = null;
  cached.promise = null;
  if (process.env.NODE_ENV === "development") {
    console.info("[db] disconnected");
  }
}

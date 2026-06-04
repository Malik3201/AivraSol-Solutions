import mongoose from "mongoose";

/** Drop obsolete unique indexes left from earlier schemas (e.g. services.name). */
export async function dropStaleCollectionIndexes(): Promise<void> {
  const db = mongoose.connection.db;
  if (!db) return;

  const serviceColl = db.collection("services");

  try {
    await serviceColl.dropIndex("name_1").catch(() => undefined);
  } catch {
    // ignore
  }

  try {
    const indexes = await serviceColl.indexes();
    for (const index of indexes) {
      const keys = index.key ?? {};
      if (!("name" in keys) || index.name === "_id_") continue;
      await serviceColl.dropIndex(index.name!).catch(() => undefined);
      if (process.env.NODE_ENV === "development") {
        console.info(`[db] dropped stale index services.${index.name}`);
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.includes("index not found") && !message.includes("ns not found")) {
      console.warn("[db] legacy index cleanup (services):", message);
    }
  }

  try {
    const stale = await serviceColl
      .find({
        $or: [{ name: null }, { name: { $exists: false } }, { name: "" }],
      })
      .project({ title: 1, slug: 1 })
      .toArray();

    for (const doc of stale) {
      const name =
        (typeof doc.title === "string" && doc.title.trim()) ||
        (typeof doc.slug === "string" && doc.slug.trim()) ||
        "service";
      await serviceColl.updateOne({ _id: doc._id }, { $set: { name } });
    }

    if (stale.length > 0 && process.env.NODE_ENV === "development") {
      console.info(`[db] backfilled name on ${stale.length} service(s)`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn("[db] service name backfill:", message);
  }

  await cleanupLegacyNameIndex(db.collection("projects"), "project");
}

async function cleanupLegacyNameIndex(
  coll: ReturnType<NonNullable<typeof mongoose.connection.db>["collection"]>,
  label: string,
) {
  try {
    await coll.dropIndex("name_1").catch(() => undefined);
    const indexes = await coll.indexes();
    for (const index of indexes) {
      const keys = index.key ?? {};
      if (!("name" in keys) || index.name === "_id_") continue;
      await coll.dropIndex(index.name!).catch(() => undefined);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.includes("index not found") && !message.includes("ns not found")) {
      console.warn(`[db] legacy index cleanup (${label}):`, message);
    }
  }
}

export function withServiceLegacyName<T extends Record<string, unknown>>(
  data: T,
): T & { name?: string } {
  const title = typeof data.title === "string" ? data.title.trim() : "";
  if (!title) return data;
  return { ...data, name: title };
}

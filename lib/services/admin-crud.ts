import type { Model, SortOrder } from "mongoose";
import { ApiError } from "@/lib/api-error";
import { connectDB } from "@/lib/db";
import { slugify } from "@/lib/utils/slugify";
import { isValidObjectId } from "@/lib/utils/object-id";
import { buildPaginationMeta } from "@/lib/utils/pagination";

export interface ListOptions {
  page: number;
  limit: number;
  skip: number;
  search?: string;
  searchFields?: string[];
  filter?: Record<string, unknown>;
  sort?: Record<string, SortOrder>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyModel = Model<any>;

export async function listDocuments(
  model: AnyModel,
  options: ListOptions,
) {
  await connectDB();
  const filter: Record<string, unknown> = { ...(options.filter ?? {}) };

  if (options.search?.trim() && options.searchFields?.length) {
    const regex = { $regex: options.search.trim(), $options: "i" };
    filter.$or = options.searchFields.map((field) => ({ [field]: regex }));
  }

  const sort = options.sort ?? { createdAt: -1 };
  const [items, total] = await Promise.all([
    model.find(filter).sort(sort).skip(options.skip).limit(options.limit).lean(),
    model.countDocuments(filter),
  ]);

  return {
    items,
    meta: buildPaginationMeta(total, options.page, options.limit),
  };
}

export function parseObjectIdParam(id: string): string {
  if (!isValidObjectId(id)) {
    throw new ApiError("Invalid resource id", 400);
  }
  return id;
}

export async function getDocumentById(
  model: AnyModel,
  id: string,
  notFoundMessage = "Resource not found",
) {
  await connectDB();
  parseObjectIdParam(id);
  const doc = await model.findById(id).lean();
  if (!doc) {
    throw new ApiError(notFoundMessage, 404);
  }
  return doc;
}

export async function ensureUniqueSlug(
  model: AnyModel,
  baseSlug: string,
  excludeId?: string,
): Promise<string> {
  await connectDB();
  let slug = slugify(baseSlug);
  if (!slug) slug = "item";

  let candidate = slug;
  let counter = 1;

  while (true) {
    const filter: Record<string, unknown> = { slug: candidate };
    if (excludeId) filter._id = { $ne: excludeId };
    const exists = await model.exists(filter);
    if (!exists) return candidate;
    candidate = `${slug}-${counter++}`;
  }
}

export async function resolveSlug(
  model: AnyModel,
  input: { slug?: string; title?: string; name?: string },
  excludeId?: string,
): Promise<string> {
  const base = input.slug || input.title || input.name || "item";
  return ensureUniqueSlug(model, base, excludeId);
}

export function withId<T extends { _id: unknown }>(doc: T) {
  return { ...doc, id: String(doc._id) };
}

export function mapWithIds<T extends { _id: unknown }>(docs: T[]) {
  return docs.map(withId);
}

export async function createDocument(
  model: AnyModel,
  data: Record<string, unknown>,
) {
  await connectDB();
  const doc = await model.create(data);
  return doc.toObject() as Record<string, unknown> & { _id: unknown };
}

export async function updateDocument(
  model: AnyModel,
  id: string,
  data: Record<string, unknown>,
  notFoundMessage = "Resource not found",
) {
  await connectDB();
  parseObjectIdParam(id);
  const doc = await model
    .findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true })
    .lean();
  if (!doc) {
    throw new ApiError(notFoundMessage, 404);
  }
  return doc;
}

export async function deleteDocument(
  model: AnyModel,
  id: string,
  notFoundMessage = "Resource not found",
) {
  await connectDB();
  parseObjectIdParam(id);
  const doc = await model.findByIdAndDelete(id).lean();
  if (!doc) {
    throw new ApiError(notFoundMessage, 404);
  }
  return doc;
}

export const contentSort = {
  isFeatured: -1 as SortOrder,
  sortOrder: 1 as SortOrder,
  createdAt: -1 as SortOrder,
};

export const blogSort = {
  isFeatured: -1 as SortOrder,
  publishedAt: -1 as SortOrder,
  createdAt: -1 as SortOrder,
};

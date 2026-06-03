import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

export const BLOG_STATUSES = ["draft", "published"] as const;
export type BlogStatus = (typeof BLOG_STATUSES)[number];

const BlogPostSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    coverImage: { type: String },
    author: { type: String, default: "AIVRASOL" },
    tags: { type: [String], default: [] },
    seoTitle: { type: String },
    seoDescription: { type: String },
    seoKeywords: { type: [String], default: [] },
    status: {
      type: String,
      enum: BLOG_STATUSES,
      default: "draft",
      index: true,
    },
    publishedAt: { type: Date, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

BlogPostSchema.index({ status: 1, publishedAt: -1 });
BlogPostSchema.index({ isFeatured: 1, status: 1 });

export type BlogPostDocument = InferSchemaType<typeof BlogPostSchema>;
export type BlogPostModel = Model<BlogPostDocument>;

export const BlogPost: BlogPostModel =
  (models.BlogPost as BlogPostModel) ??
  model<BlogPostDocument>("BlogPost", BlogPostSchema);

import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    clientName: { type: String },
    industry: { type: String },
    shortDescription: { type: String, default: "" },
    description: { type: String, default: "" },
    problem: { type: String, default: "" },
    solution: { type: String, default: "" },
    results: { type: [String], default: [] },
    coverImage: { type: String },
    gallery: { type: [String], default: [] },
    services: { type: [String], default: [] },
    technologies: { type: [String], default: [] },
    liveUrl: { type: String },
    caseStudyUrl: { type: String },
    seoTitle: { type: String },
    seoDescription: { type: String },
    seoKeywords: { type: [String], default: [] },
    isFeatured: { type: Boolean, default: false, index: true },
    isActive: { type: Boolean, default: true, index: true },
    sortOrder: { type: Number, default: 0, index: true },
  },
  { timestamps: true },
);

ProjectSchema.index({ isActive: 1, sortOrder: 1 });
ProjectSchema.index({ isFeatured: 1, isActive: 1 });
ProjectSchema.index({ createdAt: -1 });

export type ProjectDocument = InferSchemaType<typeof ProjectSchema>;
export type ProjectModel = Model<ProjectDocument>;

export const Project: ProjectModel =
  (models.Project as ProjectModel) ??
  model<ProjectDocument>("Project", ProjectSchema);

import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const ProcessStepSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false },
);

const ServiceSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    /** Legacy DB field — kept in sync with `title` for old unique indexes on `name`. */
    name: { type: String, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    shortDescription: { type: String, default: "" },
    description: { type: String, default: "" },
    icon: { type: String },
    coverImage: { type: String },
    gallery: { type: [String], default: [] },
    features: { type: [String], default: [] },
    processSteps: { type: [ProcessStepSchema], default: [] },
    technologies: { type: [String], default: [] },
    seoTitle: { type: String },
    seoDescription: { type: String },
    seoKeywords: { type: [String], default: [] },
    isFeatured: { type: Boolean, default: false, index: true },
    isActive: { type: Boolean, default: true, index: true },
    sortOrder: { type: Number, default: 0, index: true },
  },
  { timestamps: true },
);

ServiceSchema.index({ isActive: 1, sortOrder: 1 });
ServiceSchema.index({ isFeatured: 1, isActive: 1 });

export type ServiceDocument = InferSchemaType<typeof ServiceSchema>;
export type ServiceModel = Model<ServiceDocument>;

export const Service: ServiceModel =
  (models.Service as ServiceModel) ??
  model<ServiceDocument>("Service", ServiceSchema);

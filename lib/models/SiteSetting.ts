import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const SiteSettingSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    value: { type: Schema.Types.Mixed, required: true },
    group: { type: String, default: "general", index: true },
    label: { type: String },
    description: { type: String },
    isPublic: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

export type SiteSettingDocument = InferSchemaType<typeof SiteSettingSchema>;
export type SiteSettingModel = Model<SiteSettingDocument>;

export const SiteSetting: SiteSettingModel =
  (models.SiteSetting as SiteSettingModel) ??
  model<SiteSettingDocument>("SiteSetting", SiteSettingSchema);

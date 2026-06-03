import { Schema, model, models, type InferSchemaType, type Model, Types } from "mongoose";

const MediaAssetSchema = new Schema(
  {
    originalName: { type: String, required: true },
    fileId: { type: String, required: true, index: true },
    url: { type: String, required: true },
    thumbnailUrl: { type: String },
    mimeType: { type: String },
    size: { type: Number },
    width: { type: Number },
    height: { type: Number },
    folder: { type: String, default: "general", index: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "Admin" },
    altText: { type: String },
  },
  { timestamps: true },
);

MediaAssetSchema.index({ createdAt: -1 });

export type MediaAssetDocument = InferSchemaType<typeof MediaAssetSchema> & {
  uploadedBy?: Types.ObjectId;
};
export type MediaAssetModel = Model<MediaAssetDocument>;

export const MediaAsset: MediaAssetModel =
  (models.MediaAsset as MediaAssetModel) ??
  model<MediaAssetDocument>("MediaAsset", MediaAssetSchema);

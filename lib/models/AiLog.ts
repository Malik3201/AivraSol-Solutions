import { Schema, model, models, type InferSchemaType, type Model, Types } from "mongoose";

export const AI_FEATURES = [
  "chatbot",
  "admin_content_generate",
  "contact_email_assist",
  "seo_generate",
] as const;
export type AiFeature = (typeof AI_FEATURES)[number];

export const AI_LOG_STATUSES = ["success", "failed"] as const;
export type AiLogStatus = (typeof AI_LOG_STATUSES)[number];

const AiLogSchema = new Schema(
  {
    feature: { type: String, enum: AI_FEATURES, required: true, index: true },
    prompt: { type: String, required: true },
    response: { type: String },
    model: { type: String },
    tokensUsed: { type: Number },
    status: { type: String, enum: AI_LOG_STATUSES, required: true, index: true },
    errorMessage: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "Admin" },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

AiLogSchema.index({ createdAt: -1 });

export type AiLogDocument = InferSchemaType<typeof AiLogSchema> & {
  createdBy?: Types.ObjectId;
};
export type AiLogModel = Model<AiLogDocument>;

export const AiLog: AiLogModel =
  (models.AiLog as AiLogModel) ?? model<AiLogDocument>("AiLog", AiLogSchema);

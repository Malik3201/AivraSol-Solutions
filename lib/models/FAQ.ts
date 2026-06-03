import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const FAQSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, default: "general", index: true },
    sortOrder: { type: Number, default: 0, index: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

FAQSchema.index({ isActive: 1, category: 1, sortOrder: 1 });

export type FAQDocument = InferSchemaType<typeof FAQSchema>;
export type FAQModel = Model<FAQDocument>;

export const FAQ: FAQModel =
  (models.FAQ as FAQModel) ?? model<FAQDocument>("FAQ", FAQSchema);

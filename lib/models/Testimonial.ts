import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const TestimonialSchema = new Schema(
  {
    clientName: { type: String, required: true },
    clientRole: { type: String },
    company: { type: String },
    quote: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    image: { type: String },
    project: { type: String },
    isFeatured: { type: Boolean, default: false, index: true },
    isActive: { type: Boolean, default: true, index: true },
    sortOrder: { type: Number, default: 0, index: true },
  },
  { timestamps: true },
);

TestimonialSchema.index({ isActive: 1, sortOrder: 1 });

export type TestimonialDocument = InferSchemaType<typeof TestimonialSchema>;
export type TestimonialModel = Model<TestimonialDocument>;

export const Testimonial: TestimonialModel =
  (models.Testimonial as TestimonialModel) ??
  model<TestimonialDocument>("Testimonial", TestimonialSchema);

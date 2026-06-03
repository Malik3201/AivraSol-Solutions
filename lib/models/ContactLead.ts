import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "closed",
  "spam",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

const ContactLeadSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String },
    company: { type: String },
    serviceInterest: { type: String },
    budgetRange: { type: String },
    message: { type: String, required: true },
    aiGeneratedDraft: { type: String },
    source: { type: String, default: "website" },
    status: {
      type: String,
      enum: LEAD_STATUSES,
      default: "new",
      index: true,
    },
    adminNotes: { type: String },
  },
  { timestamps: true },
);

ContactLeadSchema.index({ createdAt: -1 });
ContactLeadSchema.index({ email: 1 });

export type ContactLeadDocument = InferSchemaType<typeof ContactLeadSchema>;
export type ContactLeadModel = Model<ContactLeadDocument>;

export const ContactLead: ContactLeadModel =
  (models.ContactLead as ContactLeadModel) ??
  model<ContactLeadDocument>("ContactLead", ContactLeadSchema);

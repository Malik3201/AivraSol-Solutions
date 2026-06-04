import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const SocialLinksSchema = new Schema(
  {
    linkedin: String,
    github: String,
    twitter: String,
    website: String,
  },
  { _id: false },
);

const TeamMemberSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    role: { type: String, required: true },
    bio: { type: String, default: "" },
    photo: { type: String },
    skills: { type: [String], default: [] },
    socialLinks: { type: SocialLinksSchema, default: {} },
    sortOrder: { type: Number, default: 0, index: true },
    isActive: { type: Boolean, default: true, index: true },
    seoTitle: { type: String },
    seoDescription: { type: String },
    seoKeywords: { type: [String], default: [] },
  },
  { timestamps: true },
);

TeamMemberSchema.index({ isActive: 1, sortOrder: 1 });

export type TeamMemberDocument = InferSchemaType<typeof TeamMemberSchema>;
export type TeamMemberModel = Model<TeamMemberDocument>;

export const TeamMember: TeamMemberModel =
  (models.TeamMember as TeamMemberModel) ??
  model<TeamMemberDocument>("TeamMember", TeamMemberSchema);

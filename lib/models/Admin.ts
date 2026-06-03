import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

export const ADMIN_ROLES = ["super_admin", "admin", "editor"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

const AdminSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ADMIN_ROLES,
      default: "admin",
    },
    avatarUrl: { type: String },
    isActive: { type: Boolean, default: true, index: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true },
);

export type AdminDocument = InferSchemaType<typeof AdminSchema>;
export type AdminModel = Model<AdminDocument>;

export const Admin: AdminModel =
  (models.Admin as AdminModel) ?? model<AdminDocument>("Admin", AdminSchema);

export type SafeAdmin = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatarUrl?: string;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export function toSafeAdmin(doc: AdminDocument & { _id: unknown }): SafeAdmin {
  return {
    id: String(doc._id),
    name: doc.name,
    email: doc.email,
    role: doc.role as AdminRole,
    avatarUrl: doc.avatarUrl ?? undefined,
    isActive: doc.isActive,
    lastLoginAt: doc.lastLoginAt ?? undefined,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

import { ApiError } from "@/lib/api-error";
import type { AdminRole } from "@/lib/models/Admin";

const ROLE_RANK: Record<AdminRole, number> = {
  editor: 1,
  admin: 2,
  super_admin: 3,
};

export function hasMinimumRole(
  userRole: AdminRole,
  requiredRole: AdminRole,
): boolean {
  return ROLE_RANK[userRole] >= ROLE_RANK[requiredRole];
}

export function assertRole(userRole: AdminRole, requiredRole: AdminRole): void {
  if (!hasMinimumRole(userRole, requiredRole)) {
    throw new ApiError("Forbidden", 403);
  }
}

export const PERMISSIONS = {
  manageAdmins: ["super_admin"] as AdminRole[],
  manageSettings: ["super_admin", "admin"] as AdminRole[],
  manageContent: ["super_admin", "admin", "editor"] as AdminRole[],
  viewLeads: ["super_admin", "admin"] as AdminRole[],
} satisfies Record<string, AdminRole[]>;

export function assertPermission(
  userRole: AdminRole,
  permission: keyof typeof PERMISSIONS,
): void {
  if (!PERMISSIONS[permission].includes(userRole)) {
    throw new ApiError("Forbidden", 403);
  }
}

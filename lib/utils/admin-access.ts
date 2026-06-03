import { ApiError } from "@/lib/api-error";
import type { AdminRole } from "@/lib/models/Admin";
import { assertPermission } from "@/lib/permissions";

export function assertCanManageContent(role: AdminRole): void {
  assertPermission(role, "manageContent");
}

export function assertCanManageSettings(role: AdminRole): void {
  assertPermission(role, "manageSettings");
}

export function assertCanViewLeads(role: AdminRole): void {
  assertPermission(role, "viewLeads");
}

/** Editors may create/update/read but cannot delete content. */
export function assertCanDeleteContent(role: AdminRole): void {
  if (role === "editor") {
    throw new ApiError("Editors cannot delete content", 403);
  }
  assertCanManageContent(role);
}

/** Contact lead deletion: admin and super_admin only. */
export function assertCanDeleteLeads(role: AdminRole): void {
  assertCanViewLeads(role);
}

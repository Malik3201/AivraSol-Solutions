"use client";

import type { ReactNode } from "react";
import { Search } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { adminFieldClass, adminPanelClass } from "@/lib/admin-styles";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CrudPageShell({
  title,
  description,
  onCreate,
  createLabel = "Create",
  search,
  onSearchChange,
  filters,
  children,
  loading,
}: {
  title: string;
  description?: string;
  onCreate?: () => void;
  createLabel?: string;
  search?: string;
  onSearchChange?: (value: string) => void;
  filters?: ReactNode;
  children: ReactNode;
  loading?: boolean;
}) {
  return (
    <div className={cn(loading && "pointer-events-none opacity-60")}>
      <AdminPageHeader
        title={title}
        description={description}
        actions={
          onCreate ? (
            <button type="button" onClick={onCreate} className={buttonVariants()}>
              {createLabel}
            </button>
          ) : undefined
        }
      />
      {(onSearchChange || filters) && (
        <div className={cn(adminPanelClass, "mb-4 flex flex-col gap-3 p-4 sm:flex-row sm:items-center")}>
          {onSearchChange ? (
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={search ?? ""}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search…"
                className={cn(adminFieldClass, "pl-9")}
                aria-label="Search records"
              />
            </div>
          ) : null}
          {filters ? <div className="flex flex-wrap gap-2">{filters}</div> : null}
        </div>
      )}
      {children}
    </div>
  );
}

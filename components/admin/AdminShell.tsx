"use client";

import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

export function AdminShell({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#050807] text-foreground">
        <div className="lg:grid lg:min-h-screen lg:grid-cols-[260px_1fr]">
          <div className="hidden lg:block">
            <AdminSidebar />
          </div>
          <div className="flex min-h-screen flex-col">
            <AdminTopbar title={title} />
            <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}

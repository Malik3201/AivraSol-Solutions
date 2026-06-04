"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";
import { useAdminAuth } from "@/components/admin/AdminGuard";
import { logout } from "@/lib/api/admin";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AdminTopbar({ title }: { title?: string }) {
  const { admin } = useAdminAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      router.replace("/admin/login");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-white/[0.08] bg-[rgba(5,8,7,0.92)] px-4 backdrop-blur-md md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <AdminMobileNav />
        {title ? (
          <p className="truncate text-sm font-medium text-white lg:hidden">{title}</p>
        ) : null}
      </div>
      <div className="flex items-center gap-3">
        {admin ? (
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-white">{admin.name}</p>
            <p className="text-xs text-muted-foreground">{admin.email}</p>
          </div>
        ) : null}
        <button
          type="button"
          onClick={() => void handleLogout()}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2")}
          aria-label="Log out"
        >
          <LogOut className="size-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}

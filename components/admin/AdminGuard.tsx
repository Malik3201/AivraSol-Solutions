"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { me, type AdminUser } from "@/lib/api/admin";
import { AdminSkeleton } from "@/components/admin/AdminSkeleton";

const AdminAuthContext = createContext<{
  admin: AdminUser | null;
  loading: boolean;
}>({ admin: null, loading: true });

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await me();
        if (!cancelled) setAdmin(res.admin);
      } catch {
        if (!cancelled) router.replace(`/admin/login?from=${encodeURIComponent(pathname)}`);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050807] p-8">
        <div className="w-full max-w-md space-y-3">
          <AdminSkeleton className="h-8 w-48" />
          <AdminSkeleton className="h-4 w-full" />
          <AdminSkeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!admin) return null;

  return (
    <AdminAuthContext.Provider value={{ admin, loading: false }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

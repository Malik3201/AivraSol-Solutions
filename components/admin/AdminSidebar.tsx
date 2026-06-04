"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { cn } from "@/lib/utils";

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col border-r border-white/[0.08] bg-[rgba(6,10,8,0.95)]">
      <Link
        href="/admin/dashboard"
        onClick={onNavigate}
        className="border-b border-white/[0.06] px-5 py-5 text-sm font-semibold tracking-[0.22em] text-primary"
      >
        AIVRASOL
      </Link>
      <nav className="flex-1 space-y-0.5 p-3" aria-label="Admin navigation">
        {ADMIN_NAV.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-primary/15 font-medium text-primary"
                  : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/[0.06] p-4">
        <Link
          href="/"
          className="text-xs text-muted-foreground hover:text-primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          View website →
        </Link>
      </div>
    </aside>
  );
}

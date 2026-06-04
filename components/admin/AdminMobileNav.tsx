"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AdminMobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Open admin menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={cn(buttonVariants({ variant: "outline", size: "icon" }), "lg:hidden")}
      >
        <Menu className="size-4" />
      </button>
      {open ? (
        <>
          <button
            type="button"
            aria-label="Close menu overlay"
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-[min(100vw-3rem,280px)] lg:hidden">
            <div className="flex h-full flex-col">
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "absolute right-2 top-3 z-10",
                )}
              >
                <X className="size-4" />
              </button>
              <AdminSidebar onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}

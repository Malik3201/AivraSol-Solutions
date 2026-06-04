"use client";

import { usePathname } from "next/navigation";
import { AivaChatWidget } from "@/components/aiva/AivaChatWidget";

export function PublicLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {children}
      {!isAdmin ? <AivaChatWidget /> : null}
    </>
  );
}

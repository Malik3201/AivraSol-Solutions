import type { ReactNode } from "react";
import { PAGE_CONTAINER } from "@/lib/page-layout";
import { cn } from "@/lib/utils";

export function PageContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn(PAGE_CONTAINER, className)}>{children}</div>;
}

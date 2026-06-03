import type { ReactNode } from "react";
import { HOME_CONTAINER } from "@/components/home/home-layout";
import { cn } from "@/lib/utils";

export function HomeContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(HOME_CONTAINER, className)}>
      {children}
    </div>
  );
}

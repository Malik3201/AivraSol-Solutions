import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function FloatingPanel({
  children,
  className,
  glow = false,
}: {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[rgba(12,18,16,0.72)] backdrop-blur-xl",
        "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_24px_80px_-40px_rgba(0,0,0,0.8)]",
        "before:pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/[0.04] before:via-transparent before:to-primary/[0.03]",
        glow && "ring-1 ring-primary/20",
        className,
      )}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}

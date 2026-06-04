import Image from "next/image";
import { AIVA_ROBOT_IMAGE } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const LABELS = ["Strategy", "UX", "AI", "Automation", "Launch"] as const;

export function ContactIntakeConsole({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[380px]",
        className,
      )}
      aria-hidden
    >
      <div className="absolute inset-[8%] rounded-full bg-primary/20 blur-[70px]" />
      <div
        className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.1] bg-[rgba(8,14,12,0.88)] p-6 backdrop-blur-xl"
        style={{
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.07), 0 28px 70px -36px rgba(62,207,142,0.35)",
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.34em] text-primary">
              Project intake
            </p>
            <p className="mt-2 text-sm text-muted-foreground">Console preview</p>
          </div>
          <div className="relative size-12 shrink-0 opacity-90">
            <Image
              src={AIVA_ROBOT_IMAGE}
              alt=""
              width={48}
              height={48}
              className="object-contain drop-shadow-[0_0_20px_rgba(62,207,142,0.35)]"
            />
          </div>
        </div>
        <div className="mt-5 space-y-2">
          {LABELS.map((label, i) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5"
            >
              <span className="text-xs text-foreground/85">{label}</span>
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  i < 3 ? "bg-primary" : "bg-white/20",
                )}
              />
            </div>
          ))}
        </div>
        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
          <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-primary/60 to-primary" />
        </div>
      </div>
    </div>
  );
}

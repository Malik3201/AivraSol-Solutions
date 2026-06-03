import { cn } from "@/lib/utils";

export function AnimatedBackground({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "hero" | "subtle";
}) {
  const intensity =
    variant === "hero"
      ? "opacity-100"
      : variant === "subtle"
        ? "opacity-60"
        : "opacity-80";

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div
        className={cn(
          "absolute -left-[20%] top-[-10%] h-[520px] w-[520px] rounded-full blur-[120px]",
          intensity,
        )}
        style={{
          background:
            "radial-gradient(circle, rgba(34, 197, 94, 0.18) 0%, transparent 70%)",
        }}
      />
      <div
        className={cn(
          "absolute -right-[15%] top-[20%] h-[420px] w-[420px] rounded-full blur-[100px]",
          intensity,
        )}
        style={{
          background:
            "radial-gradient(circle, rgba(52, 211, 153, 0.1) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
    </div>
  );
}

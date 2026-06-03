import { cn } from "@/lib/utils";

export function SectionShell({
  children,
  className,
  id,
  size = "default",
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  size?: "default" | "narrow" | "wide";
}) {
  const maxWidth =
    size === "narrow"
      ? "max-w-4xl"
      : size === "wide"
        ? "max-w-[1400px]"
        : "max-w-6xl";

  return (
    <section id={id} className={cn("relative py-20 md:py-28", className)}>
      <div className={cn("container mx-auto px-4 md:px-6", maxWidth)}>{children}</div>
    </section>
  );
}

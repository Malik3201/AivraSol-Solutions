import { cn } from "@/lib/utils";

export type SectionBackground =
  | "hero"
  | "editorial"
  | "bento"
  | "process"
  | "stage"
  | "system"
  | "calm"
  | "minimal"
  | "cta"
  | "none";

const VARIANTS: Record<
  SectionBackground,
  { layers: string[]; grid?: boolean }
> = {
  hero: {
    layers: [
      "radial-gradient(ellipse 75% 55% at 78% 35%, rgba(62,207,142,0.16), transparent 58%)",
      "radial-gradient(ellipse 45% 40% at 8% 70%, rgba(110,231,183,0.05), transparent 50%)",
    ],
  },
  editorial: {
    layers: [
      "radial-gradient(ellipse 50% 60% at 0% 40%, rgba(62,207,142,0.09), transparent 55%)",
    ],
  },
  bento: {
    layers: [
      "radial-gradient(circle at 92% 8%, rgba(62,207,142,0.07), transparent 40%)",
      "radial-gradient(circle at 8% 92%, rgba(62,207,142,0.05), transparent 42%)",
    ],
    grid: true,
  },
  process: {
    layers: [
      "linear-gradient(90deg, transparent 0%, rgba(62,207,142,0.05) 50%, transparent 100%)",
      "radial-gradient(ellipse 80% 40% at 50% 100%, rgba(62,207,142,0.06), transparent 60%)",
    ],
  },
  stage: {
    layers: [
      "radial-gradient(ellipse 70% 55% at 35% 55%, rgba(62,207,142,0.11), transparent 62%)",
    ],
  },
  system: {
    layers: [
      "radial-gradient(circle at 50% 42%, rgba(62,207,142,0.12), transparent 48%)",
    ],
    grid: true,
  },
  calm: {
    layers: [
      "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(8,14,12,0.4), transparent 70%)",
      "radial-gradient(ellipse 100% 80% at 50% 100%, rgba(0,0,0,0.35), transparent 55%)",
    ],
  },
  minimal: {
    layers: [
      "linear-gradient(180deg, rgba(62,207,142,0.03) 0%, transparent 24%)",
    ],
  },
  cta: {
    layers: [
      "radial-gradient(ellipse 75% 60% at 50% 100%, rgba(62,207,142,0.14), transparent 58%)",
    ],
  },
  none: { layers: [] },
};

export function AmbientScene({
  variant = "none",
  className,
}: {
  variant?: SectionBackground;
  className?: string;
}) {
  if (variant === "none") return null;
  const config = VARIANTS[variant];

  return (
    <>
      <div
        className={cn("absolute inset-0", className)}
        style={{ background: config.layers.join(", ") }}
      />
      {config.grid ? (
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.45) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.45) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 65% 55% at 50% 45%, black, transparent)",
          }}
        />
      ) : null}
    </>
  );
}

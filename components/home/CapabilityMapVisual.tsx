import { cn } from "@/lib/utils";

const NODES = [
  { id: "strategy", label: "Strategy", x: "8%", y: "50%" },
  { id: "build", label: "Build", x: "50%", y: "18%" },
  { id: "automate", label: "Automate", x: "82%", y: "55%" },
];

export function CapabilityMapVisual({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative mt-6 min-h-[140px] overflow-hidden rounded-xl border border-white/[0.06] bg-[#080d0b]/80 p-4",
        className,
      )}
      aria-hidden
    >
      <svg className="absolute inset-0 size-full text-primary/30" viewBox="0 0 100 60" preserveAspectRatio="none">
        <line x1="18" y1="30" x2="50" y2="14" stroke="currentColor" strokeWidth="0.5" />
        <line x1="50" y1="14" x2="82" y2="32" stroke="currentColor" strokeWidth="0.5" />
        <line x1="18" y1="30" x2="82" y2="32" stroke="currentColor" strokeWidth="0.3" strokeDasharray="2 2" />
      </svg>
      {NODES.map((node) => (
        <div
          key={node.id}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-lg border border-primary/25 bg-primary/10 px-2.5 py-1.5 text-[10px] font-medium text-primary"
          style={{ left: node.x, top: node.y }}
        >
          {node.label}
        </div>
      ))}
    </div>
  );
}

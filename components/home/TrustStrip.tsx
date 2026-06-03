import { HomeContainer } from "@/components/home/HomeContainer";
import { cn } from "@/lib/utils";

const ITEMS = [
  "AI Automation",
  "Web Platforms",
  "Cloud Integrations",
  "SEO-Ready Systems",
  "Business Workflows",
];

export function TrustStrip() {
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div className="relative isolate overflow-hidden border-b border-white/[0.06] bg-[#060a08] py-4">
      <div className={cn("flex w-max gap-14 whitespace-nowrap animate-trust-marquee")}>
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="inline-flex items-center gap-3 px-6 text-xs tracking-wide text-muted-foreground/90"
          >
            <span className="size-1 rounded-full bg-primary/60" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";
import {
  Bot,
  Globe,
  Layers,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { CapabilityMapVisual } from "@/components/home/CapabilityMapVisual";
import type { PublicService } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  "ai-product-engineering": Bot,
  "premium-web-platforms": Globe,
  "business-automation": Layers,
  "ai-strategy-advisory": Sparkles,
  "ai-strategy": Sparkles,
  "automation-systems": Layers,
  "ai-assistants": Bot,
};

const CHIP_MAP: Record<string, string[]> = {
  "ai-product-engineering": ["Assistants", "Workflows", "Integrations"],
  "premium-web-platforms": ["Next.js", "SEO", "Performance"],
  "business-automation": ["CRM", "Webhooks", "Ops"],
  "ai-strategy-advisory": ["Roadmap", "Architecture", "ROI"],
  default: ["Strategy", "Build", "Scale"],
};

function ServiceTile({
  service,
  featured = false,
}: {
  service: PublicService;
  featured?: boolean;
}) {
  const Icon = ICONS[service.slug] ?? Sparkles;
  const chips = CHIP_MAP[service.slug] ?? CHIP_MAP.default;
  const category = featured ? "Featured capability" : "Capability";

  return (
    <Link
      href={`/services/${service.slug}`}
      className={cn(
        "group flex h-full flex-col rounded-2xl border border-white/[0.08] bg-[rgba(10,16,14,0.65)] p-6 transition-all hover:border-primary/25",
        featured && "p-7 md:p-8",
      )}
    >
      <span className="mb-3 text-[10px] uppercase tracking-[0.28em] text-primary/90">
        {category}
      </span>
      <span className="mb-4 inline-flex size-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
        <Icon className="size-5" aria-hidden />
      </span>
      <h3 className={cn("font-semibold", featured ? "text-2xl md:text-3xl" : "text-lg")}>
        {service.title}
      </h3>
      <p
        className={cn(
          "mt-3 leading-relaxed text-muted-foreground",
          featured ? "text-base" : "text-sm",
        )}
      >
        {service.shortDescription}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {chips.map((c) => (
          <span
            key={c}
            className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-[10px] text-muted-foreground"
          >
            {c}
          </span>
        ))}
      </div>
      {featured ? <CapabilityMapVisual /> : null}
      <span className="mt-auto pt-5 text-sm font-medium text-primary">
        View capability →
      </span>
    </Link>
  );
}

export function BentoShowcase({ services }: { services: PublicService[] }) {
  const list = services.slice(0, 4);
  const [featured, ...rest] = list;
  if (!featured) return null;

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-5">
      <div className="col-span-12 md:col-span-7">
        <ServiceTile service={featured} featured />
      </div>
      <div className="col-span-12 flex flex-col gap-4 md:col-span-5">
        {rest.slice(0, 2).map((s) => (
          <ServiceTile key={s.id} service={s} />
        ))}
      </div>
      {rest[2] ? (
        <div className="col-span-12">
          <ServiceTile service={rest[2]} />
        </div>
      ) : null}
    </div>
  );
}

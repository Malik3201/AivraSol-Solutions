import { Clock, Globe2, Layers, Mail } from "lucide-react";
import { PremiumCard } from "@/components/site/PremiumCard";

const ITEMS = [
  {
    icon: Mail,
    title: "Email",
    detail: "hello@aivrasol.com",
    href: "mailto:hello@aivrasol.com",
  },
  {
    icon: Clock,
    title: "Response",
    detail: "New inquiries answered within one business day.",
  },
  {
    icon: Layers,
    title: "Services",
    detail: "Websites, platforms, automation, AI assistants, and SEO systems.",
  },
  {
    icon: Globe2,
    title: "Delivery",
    detail: "Remote-first engagements for teams worldwide.",
  },
];

export function ContactInfoCards({ compact }: { compact?: boolean }) {
  return (
    <div className={compact ? "grid gap-3" : "grid gap-4 sm:grid-cols-2 lg:grid-cols-1"}>
      {ITEMS.map((item) => (
        <PremiumCard key={item.title} className="!p-4">
          <item.icon className="mb-2.5 size-4 text-primary" aria-hidden />
          <h3 className="text-sm font-semibold text-white">{item.title}</h3>
          {item.href ? (
            <a
              href={item.href}
              className="mt-1.5 block text-sm text-primary hover:underline"
            >
              {item.detail}
            </a>
          ) : (
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {item.detail}
            </p>
          )}
        </PremiumCard>
      ))}
    </div>
  );
}

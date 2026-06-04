"use client";

import { cn } from "@/lib/utils";

const ACTION_LINKS: Record<string, string> = {
  "explore services": "/services",
  "start a project": "/contact",
  "view projects": "/projects",
  "ask about ai automation": "/services",
};

function resolveHref(label: string, recommendedSlug?: string | null): string | null {
  const key = label.toLowerCase().trim();
  if (ACTION_LINKS[key]) return ACTION_LINKS[key];
  if (recommendedSlug && key.includes("service")) {
    return `/services/${recommendedSlug}`;
  }
  return null;
}

export function AivaSuggestedActions({
  actions,
  onSelect,
  recommendedServiceSlug,
  disabled,
}: {
  actions: string[];
  onSelect: (text: string) => void;
  recommendedServiceSlug?: string | null;
  disabled?: boolean;
}) {
  if (!actions.length) return null;

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Suggested actions">
      {actions.map((action) => {
        const href = resolveHref(action, recommendedServiceSlug);
        return (
          <button
            key={action}
            type="button"
            disabled={disabled}
            onClick={() => {
              if (href && typeof window !== "undefined") {
                window.location.href = href;
                return;
              }
              onSelect(action);
            }}
            className={cn(
              "rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-foreground/90 transition-colors",
              "hover:border-primary/35 hover:bg-primary/10 disabled:opacity-50",
            )}
          >
            {action}
          </button>
        );
      })}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { servicesApi } from "@/lib/api/admin";
import type { AdminServiceRecord } from "@/lib/api/types";
import { cn } from "@/lib/utils";

export function ServiceMultiSelect({
  value,
  onChange,
  label = "Linked services",
}: {
  value: string[];
  onChange: (slugs: string[]) => void;
  label?: string;
}) {
  const [services, setServices] = useState<AdminServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await servicesApi.list({ limit: 100 });
        if (!cancelled) setServices(res.data.filter((s) => s.isActive !== false));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const isSelected = (service: AdminServiceRecord) =>
    value.includes(service.slug) || value.includes(service.title);

  const toggle = (service: AdminServiceRecord) => {
    if (isSelected(service)) {
      onChange(
        value.filter((s) => s !== service.slug && s !== service.title),
      );
    } else {
      onChange([
        ...value.filter((s) => s !== service.slug && s !== service.title),
        service.slug,
      ]);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="text-xs text-muted-foreground">
        Select one or more services this project relates to. Shown on the public
        project page.
      </p>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading services…
        </div>
      ) : services.length === 0 ? (
        <p className="rounded-lg border border-dashed border-white/15 p-4 text-sm text-muted-foreground">
          No services yet. Create services first, then link them here.
        </p>
      ) : (
        <div className="max-h-52 space-y-1 overflow-y-auto rounded-xl border border-white/10 bg-black/20 p-2">
          {services.map((service) => {
            const checked = isSelected(service);
            return (
              <label
                key={service.id}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2.5 transition-colors",
                  checked ? "bg-primary/15" : "hover:bg-white/[0.04]",
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(service)}
                  className="mt-1 size-4 rounded border-white/20 accent-primary"
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-white">
                    {service.title}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {service.slug}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      )}

      {value.length > 0 ? (
        <p className="text-xs text-primary">
          {value.length} service{value.length === 1 ? "" : "s"} selected
        </p>
      ) : null}
    </div>
  );
}

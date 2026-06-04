"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { FormField } from "@/components/admin/FormField";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { settingsApi } from "@/lib/api/admin";
import type { AdminSiteSetting } from "@/lib/api/types";
import {
  ADMIN_SETTING_GROUPS,
  type SettingFieldDef,
} from "@/lib/admin-settings-groups";
import { adminFieldClass, adminPanelClass } from "@/lib/admin-styles";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function parseFieldValue(raw: string, type: SettingFieldDef["type"]): unknown {
  if (type === "json") {
    try {
      return JSON.parse(raw || "{}");
    } catch {
      return raw;
    }
  }
  if (type === "number") return Number(raw);
  return raw;
}

function stringifyValue(value: unknown, type: SettingFieldDef["type"]): string {
  if (value === undefined || value === null) return "";
  if (type === "json") {
    return typeof value === "string" ? value : JSON.stringify(value, null, 2);
  }
  return String(value);
}

export function SettingsTabs({
  initialSettings,
  onSaved,
}: {
  initialSettings: AdminSiteSetting[];
  onSaved: () => void;
}) {
  const [activeTab, setActiveTab] = useState(ADMIN_SETTING_GROUPS[0].id);
  const [saving, setSaving] = useState(false);

  const settingsMap = useMemo(() => {
    const map = new Map<string, AdminSiteSetting>();
    initialSettings.forEach((s) => map.set(s.key, s));
    return map;
  }, [initialSettings]);

  const [draft, setDraft] = useState<Record<string, string>>(() => {
    const values: Record<string, string> = {};
    ADMIN_SETTING_GROUPS.forEach((group) => {
      group.fields.forEach((field) => {
        const existing = settingsMap.get(field.key);
        values[field.key] = stringifyValue(existing?.value, field.type);
      });
    });
    return values;
  });

  const group = ADMIN_SETTING_GROUPS.find((g) => g.id === activeTab)!;

  const saveGroup = async () => {
    setSaving(true);
    try {
      for (const field of group.fields) {
        const value = parseFieldValue(draft[field.key] ?? "", field.type);
        const existing = settingsMap.get(field.key);
        const body = {
          key: field.key,
          value,
          group: group.id,
          label: field.label,
          description: field.description,
          isPublic: field.isPublic ?? false,
        };
        if (existing) {
          await settingsApi.update(existing.id, body);
        } else {
          await settingsApi.create(body);
        }
      }
      toast.success(`${group.label} settings saved`);
      onSaved();
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 border-b border-white/[0.08] pb-4">
        {ADMIN_SETTING_GROUPS.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => setActiveTab(g.id)}
            className={cn(
              "rounded-lg px-3 py-2 text-sm transition-colors",
              activeTab === g.id
                ? "bg-primary/15 font-medium text-primary"
                : "text-muted-foreground hover:bg-white/[0.04]",
            )}
          >
            {g.label}
          </button>
        ))}
      </div>
      <div className={cn(adminPanelClass, "space-y-5 p-6")}>
        {group.fields.map((field) => (
          <div key={field.key}>
            {field.type === "image" ? (
              <ImageUploader
                label={field.label}
                value={draft[field.key]}
                onChange={(url) =>
                  setDraft((prev) => ({ ...prev, [field.key]: url }))
                }
                folder="/aivrasol/brand"
              />
            ) : field.type === "textarea" || field.type === "json" ? (
              <FormField label={field.label} hint={field.description}>
                <textarea
                  value={draft[field.key] ?? ""}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, [field.key]: e.target.value }))
                  }
                  rows={field.type === "json" ? 8 : 3}
                  className={cn(adminFieldClass, "font-mono text-xs")}
                />
              </FormField>
            ) : (
              <FormField label={field.label}>
                <input
                  type={field.type === "number" ? "number" : "text"}
                  value={draft[field.key] ?? ""}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, [field.key]: e.target.value }))
                  }
                  className={adminFieldClass}
                />
              </FormField>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => void saveGroup()}
          disabled={saving}
          className={buttonVariants()}
        >
          {saving ? "Saving…" : `Save ${group.label}`}
        </button>
      </div>
    </div>
  );
}

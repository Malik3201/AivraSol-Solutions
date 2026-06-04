"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SettingsTabs } from "@/components/admin/SettingsTabs";
import { AdminTableSkeleton } from "@/components/admin/AdminSkeleton";
import { settingsApi } from "@/lib/api/admin";
import type { AdminSiteSetting } from "@/lib/api/types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AdminSiteSetting[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await settingsApi.list({ limit: 200 });
      setSettings(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <AdminShell>
      <AdminPageHeader
        title="Site settings"
        description="Brand, homepage, SEO, contact, navigation, and footer configuration."
      />
      {loading ? (
        <AdminTableSkeleton rows={8} />
      ) : (
        <SettingsTabs initialSettings={settings} onSaved={() => void load()} />
      )}
    </AdminShell>
  );
}

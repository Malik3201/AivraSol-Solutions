"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { CrudPageShell } from "@/components/admin/CrudPageShell";
import { DataTable } from "@/components/admin/DataTable";
import { EmptyAdminState } from "@/components/admin/EmptyAdminState";
import { LeadDetailDrawer } from "@/components/admin/LeadDetailDrawer";
import { AdminTableSkeleton } from "@/components/admin/AdminSkeleton";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { leadsApi } from "@/lib/api/admin";
import type { AdminContactLead } from "@/lib/api/types";
import { LEAD_STATUSES } from "@/lib/lead-statuses";
import { adminFieldClass } from "@/lib/admin-styles";

export default function AdminLeadsPage() {
  const [items, setItems] = useState<AdminContactLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<AdminContactLead | null>(null);
  const [status, setStatus] = useState("new");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await leadsApi.list({
        search: search || undefined,
        status: statusFilter || undefined,
        limit: 100,
      });
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const t = setTimeout(() => void load(), 300);
    return () => clearTimeout(t);
  }, [load]);

  const openLead = (lead: AdminContactLead) => {
    setSelected(lead);
    setStatus(lead.status);
    setNotes(lead.adminNotes ?? "");
  };

  const saveLead = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await leadsApi.update(selected.id, { status, adminNotes: notes });
      toast.success("Lead updated");
      setSelected(null);
      void load();
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const deleteLead = async () => {
    if (!selected) return;
    await leadsApi.delete(selected.id);
    setConfirmDelete(false);
    setSelected(null);
    void load();
    toast.success("Lead deleted");
  };

  return (
    <AdminShell>
      <CrudPageShell
        title="Contact leads"
        description="Inquiries from the website contact form."
        search={search}
        onSearchChange={setSearch}
        filters={
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={adminFieldClass}
            aria-label="Filter by status"
          >
            <option value="">All statuses</option>
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s} className="bg-[#0a100e]">
                {s}
              </option>
            ))}
          </select>
        }
      >
        {loading ? (
          <AdminTableSkeleton />
        ) : (
          <DataTable
            columns={[
              {
                key: "name",
                header: "Contact",
                render: (r) => (
                  <div>
                    <p className="font-medium text-white">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.email}</p>
                  </div>
                ),
              },
              {
                key: "service",
                header: "Interest",
                render: (r) => r.serviceInterest ?? "—",
              },
              {
                key: "status",
                header: "Status",
                render: (r) => (
                  <StatusBadge
                    label={r.status}
                    variant={r.status}
                  />
                ),
              },
              {
                key: "date",
                header: "Received",
                render: (r) =>
                  r.createdAt
                    ? new Date(r.createdAt).toLocaleDateString()
                    : "—",
              },
            ]}
            rows={items}
            onRowClick={openLead}
            empty={
              <EmptyAdminState
                title="No leads yet"
                description="New contact form submissions appear here."
              />
            }
          />
        )}
      </CrudPageShell>
      <LeadDetailDrawer
        lead={selected}
        open={!!selected}
        onOpenChange={(o) => !o && setSelected(null)}
        status={status}
        notes={notes}
        onStatusChange={setStatus}
        onNotesChange={setNotes}
        onSave={() => void saveLead()}
        onDelete={() => setConfirmDelete(true)}
        saving={saving}
      />
      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete lead?"
        description="Permanently remove this inquiry."
        destructive
        confirmLabel="Delete"
        onConfirm={() => void deleteLead()}
      />
    </AdminShell>
  );
}

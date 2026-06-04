"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { CrudPageShell } from "@/components/admin/CrudPageShell";
import { DataTable } from "@/components/admin/DataTable";
import { EmptyAdminState } from "@/components/admin/EmptyAdminState";
import { AdminTableSkeleton } from "@/components/admin/AdminSkeleton";
import { CheckboxField, NumberField, TextAreaField, TextField } from "@/components/admin/EntityForm";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { RecordDrawer } from "@/components/admin/RecordDrawer";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { testimonialsApi } from "@/lib/api/admin";
import type { AdminTestimonialRecord } from "@/lib/api/types";
import { buttonVariants } from "@/components/ui/button";

const empty = (): AdminTestimonialRecord & { id?: string } => ({
  id: "",
  clientName: "",
  quote: "",
  rating: 5,
  clientRole: "",
  company: "",
  image: "",
  project: "",
  isFeatured: false,
  isActive: true,
  sortOrder: 0,
});

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<AdminTestimonialRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [form, setForm] = useState(empty());
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await testimonialsApi.list({ search: search || undefined, limit: 100 });
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(() => void load(), 300);
    return () => clearTimeout(t);
  }, [load]);

  const patch = (p: Partial<AdminTestimonialRecord>) => setForm((f) => ({ ...f, ...p }));

  const save = async () => {
    const { id, ...body } = form;
    try {
      if (id) await testimonialsApi.update(id, body);
      else await testimonialsApi.create(body);
      toast.success("Saved");
      setEditorOpen(false);
      void load();
    } catch {
      toast.error("Save failed");
    }
  };

  return (
    <AdminShell>
      <CrudPageShell title="Testimonials" description="Client quotes and social proof." onCreate={() => { setForm(empty()); setEditorOpen(true); }} search={search} onSearchChange={setSearch}>
        {loading ? <AdminTableSkeleton /> : (
          <DataTable columns={[
            { key: "client", header: "Client", render: (r) => r.clientName },
            { key: "company", header: "Company", render: (r) => r.company ?? "—" },
            { key: "status", header: "Status", render: (r) => <StatusBadge label={r.isActive ? "active" : "inactive"} variant={r.isActive ? "active" : "inactive"} /> },
            { key: "a", header: "", render: (r) => (
              <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                <button type="button" onClick={() => { setForm({ ...empty(), ...r }); setEditorOpen(true); }} className={buttonVariants({ variant: "ghost", size: "icon" })}><Pencil className="size-4" /></button>
                <button type="button" onClick={() => setDeleteId(r.id)} className={buttonVariants({ variant: "ghost", size: "icon" })}><Trash2 className="size-4 text-destructive" /></button>
              </div>
            )},
          ]} rows={items} onRowClick={(r) => { setForm({ ...empty(), ...r }); setEditorOpen(true); }} empty={<EmptyAdminState title="No testimonials" description="Add client feedback." actionLabel="Add" onAction={() => { setForm(empty()); setEditorOpen(true); }} />} />
        )}
      </CrudPageShell>
      <RecordDrawer open={editorOpen} onOpenChange={setEditorOpen} title={form.id ? "Edit" : "New testimonial"} onSave={() => void save()}>
        <div className="space-y-5">
          <TextField label="Client name" name="clientName" value={form.clientName} onChange={(clientName) => patch({ clientName })} required />
          <TextField label="Role" name="clientRole" value={form.clientRole ?? ""} onChange={(clientRole) => patch({ clientRole })} />
          <TextField label="Company" name="company" value={form.company ?? ""} onChange={(company) => patch({ company })} />
          <TextAreaField label="Quote" name="quote" value={form.quote} onChange={(quote) => patch({ quote })} required />
          <NumberField label="Rating (1-5)" name="rating" value={form.rating ?? 5} onChange={(rating) => patch({ rating })} />
          <ImageUploader label="Image" value={form.image} onChange={(image) => patch({ image })} folder="/aivrasol/general" />
          <TextField label="Related project" name="project" value={form.project ?? ""} onChange={(project) => patch({ project })} />
          <CheckboxField label="Featured" name="isFeatured" checked={!!form.isFeatured} onChange={(isFeatured) => patch({ isFeatured })} />
          <CheckboxField label="Active" name="isActive" checked={form.isActive !== false} onChange={(isActive) => patch({ isActive })} />
          <NumberField label="Sort order" name="sortOrder" value={form.sortOrder ?? 0} onChange={(sortOrder) => patch({ sortOrder })} />
        </div>
      </RecordDrawer>
      <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Delete?" description="" destructive confirmLabel="Delete" onConfirm={async () => { if (deleteId) { await testimonialsApi.delete(deleteId); setDeleteId(null); void load(); } }} />
    </AdminShell>
  );
}

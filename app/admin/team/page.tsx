"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { ArrayField } from "@/components/admin/ArrayField";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { CrudPageShell } from "@/components/admin/CrudPageShell";
import { DataTable } from "@/components/admin/DataTable";
import { EmptyAdminState } from "@/components/admin/EmptyAdminState";
import { AdminTableSkeleton } from "@/components/admin/AdminSkeleton";
import { CheckboxField, NumberField, TextAreaField, TextField } from "@/components/admin/EntityForm";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { RecordDrawer } from "@/components/admin/RecordDrawer";
import { SeoFields } from "@/components/admin/SeoFields";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { teamApi } from "@/lib/api/admin";
import type { AdminTeamRecord } from "@/lib/api/types";
import { slugify } from "@/lib/slugify";
import { getApiErrorMessage } from "@/lib/utils/get-api-error-message";
import { buttonVariants } from "@/components/ui/button";

const empty = (): AdminTeamRecord & { id?: string } => ({
  id: "",
  name: "",
  slug: "",
  role: "",
  bio: "",
  photo: "",
  skills: [],
  socialLinks: {},
  seoTitle: "",
  seoDescription: "",
  isActive: true,
  sortOrder: 0,
});

export default function AdminTeamPage() {
  const [items, setItems] = useState<AdminTeamRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [form, setForm] = useState(empty());
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await teamApi.list({ search: search || undefined, limit: 100 });
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(() => void load(), 300);
    return () => clearTimeout(t);
  }, [load]);

  const patch = (p: Partial<AdminTeamRecord>) => setForm((f) => ({ ...f, ...p }));

  const save = async () => {
    if (!form.name.trim() || !form.role.trim()) {
      toast.error("Name and role required");
      return;
    }
    setSaving(true);
    const { id, ...body } = form;
    const payload = {
      name: body.name.trim(),
      role: body.role.trim(),
      slug: (body.slug?.trim() || slugify(body.name)).trim(),
      bio: body.bio?.trim() || undefined,
      photo: body.photo?.trim() || undefined,
      skills: (body.skills ?? []).map((s) => s.trim()).filter(Boolean),
      socialLinks: body.socialLinks,
      seoTitle: body.seoTitle?.trim() || undefined,
      seoDescription: body.seoDescription?.trim() || undefined,
      seoKeywords: (body.seoKeywords ?? []).map((s) => s.trim()).filter(Boolean),
      isActive: body.isActive !== false,
      sortOrder: Number.isFinite(body.sortOrder) ? body.sortOrder : 0,
    };
    try {
      if (id) await teamApi.update(id, payload);
      else await teamApi.create(payload);
      toast.success("Saved");
      setEditorOpen(false);
      void load();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Save failed"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell>
      <CrudPageShell title="Team" description="Team profiles and skills." onCreate={() => { setForm(empty()); setEditorOpen(true); }} search={search} onSearchChange={setSearch}>
        {loading ? <AdminTableSkeleton /> : (
          <DataTable columns={[
            { key: "name", header: "Name", render: (r) => r.name },
            { key: "role", header: "Role", render: (r) => r.role },
            { key: "status", header: "Status", render: (r) => <StatusBadge label={r.isActive ? "active" : "inactive"} variant={r.isActive ? "active" : "inactive"} /> },
            { key: "a", header: "", render: (r) => (
              <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                <button type="button" onClick={() => { setForm({ ...empty(), ...r }); setEditorOpen(true); }} className={buttonVariants({ variant: "ghost", size: "icon" })}><Pencil className="size-4" /></button>
                <button type="button" onClick={() => setDeleteId(r.id)} className={buttonVariants({ variant: "ghost", size: "icon" })}><Trash2 className="size-4 text-destructive" /></button>
              </div>
            )},
          ]} rows={items} onRowClick={(r) => { setForm({ ...empty(), ...r }); setEditorOpen(true); }} empty={<EmptyAdminState title="No team members" description="Add a profile." actionLabel="Add member" onAction={() => { setForm(empty()); setEditorOpen(true); }} />} />
        )}
      </CrudPageShell>
      <RecordDrawer open={editorOpen} onOpenChange={setEditorOpen} title={form.id ? "Edit member" : "New member"} onSave={() => void save()} saving={saving}>
        <div className="space-y-5">
          <TextField label="Name" name="name" value={form.name} onChange={(name) => patch({ name, slug: form.slug || slugify(name) })} required />
          <TextField label="Slug" name="slug" value={form.slug} onChange={(slug) => patch({ slug })} />
          <TextField label="Role" name="role" value={form.role} onChange={(role) => patch({ role })} required />
          <TextAreaField label="Bio" name="bio" value={form.bio ?? ""} onChange={(bio) => patch({ bio })} rows={5} />
          <ImageUploader label="Photo" value={form.photo} onChange={(photo) => patch({ photo })} folder="/aivrasol/team" />
          <ArrayField label="Skills" values={form.skills ?? []} onChange={(skills) => patch({ skills })} />
          <TextField label="LinkedIn" name="linkedin" value={form.socialLinks?.linkedin ?? ""} onChange={(linkedin) => patch({ socialLinks: { ...form.socialLinks, linkedin } })} />
          <TextField label="GitHub" name="github" value={form.socialLinks?.github ?? ""} onChange={(github) => patch({ socialLinks: { ...form.socialLinks, github } })} />
          <TextField label="Twitter" name="twitter" value={form.socialLinks?.twitter ?? ""} onChange={(twitter) => patch({ socialLinks: { ...form.socialLinks, twitter } })} />
          <TextField label="Website" name="website" value={form.socialLinks?.website ?? ""} onChange={(website) => patch({ socialLinks: { ...form.socialLinks, website } })} />
          <SeoFields values={form} onChange={(seo) => patch(seo)} />
          <CheckboxField label="Active" name="isActive" checked={form.isActive !== false} onChange={(isActive) => patch({ isActive })} />
          <NumberField label="Sort order" name="sortOrder" value={form.sortOrder ?? 0} onChange={(sortOrder) => patch({ sortOrder })} />
        </div>
      </RecordDrawer>
      <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Delete member?" description="Cannot undo." destructive confirmLabel="Delete" onConfirm={async () => { if (deleteId) { await teamApi.delete(deleteId); setDeleteId(null); void load(); } }} />
    </AdminShell>
  );
}

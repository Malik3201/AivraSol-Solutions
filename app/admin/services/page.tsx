"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { AiGenerateButton } from "@/components/admin/AiGenerateButton";
import { ArrayField, ProcessStepsField } from "@/components/admin/ArrayField";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { CrudPageShell } from "@/components/admin/CrudPageShell";
import { DataTable } from "@/components/admin/DataTable";
import { EmptyAdminState } from "@/components/admin/EmptyAdminState";
import { AdminTableSkeleton } from "@/components/admin/AdminSkeleton";
import {
  CheckboxField,
  NumberField,
  TextAreaField,
  TextField,
} from "@/components/admin/EntityForm";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { RecordDrawer } from "@/components/admin/RecordDrawer";
import { SeoFields } from "@/components/admin/SeoFields";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { servicesApi } from "@/lib/api/admin";
import type { AdminServiceRecord } from "@/lib/api/types";
import { getApiErrorMessage } from "@/lib/utils/get-api-error-message";
import { slugify } from "@/lib/slugify";
import { buttonVariants } from "@/components/ui/button";

const empty = (): Omit<AdminServiceRecord, "id"> & { id?: string } => ({
  title: "",
  slug: "",
  shortDescription: "",
  description: "",
  icon: "",
  coverImage: "",
  gallery: [],
  features: [],
  processSteps: [],
  technologies: [],
  seoTitle: "",
  seoDescription: "",
  seoKeywords: [],
  isFeatured: false,
  isActive: true,
  sortOrder: 0,
});

export default function AdminServicesPage() {
  const [items, setItems] = useState<AdminServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [form, setForm] = useState(empty());
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await servicesApi.list({ search: search || undefined, limit: 100 });
      setItems(res.data);
    } catch {
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(() => void load(), 300);
    return () => clearTimeout(t);
  }, [load]);

  const openCreate = () => {
    setForm(empty());
    setEditorOpen(true);
  };

  const openEdit = (row: AdminServiceRecord) => {
    setForm({ ...empty(), ...row });
    setEditorOpen(true);
  };

  const patch = (p: Partial<typeof form>) => setForm((f) => ({ ...f, ...p }));

  const save = async () => {
    if (!form.title.trim() || !form.shortDescription?.trim()) {
      toast.error("Title and short description are required");
      return;
    }
    setSaving(true);
    const {
      id: _id,
      createdAt: _createdAt,
      updatedAt: _updatedAt,
      ...rest
    } = form as AdminServiceRecord & {
      createdAt?: string;
      updatedAt?: string;
    };

    const body = {
      ...rest,
      slug: form.slug || slugify(form.title),
      gallery: (form.gallery ?? []).filter(Boolean),
      features: (form.features ?? []).filter(Boolean),
      technologies: (form.technologies ?? []).filter(Boolean),
      processSteps: (form.processSteps ?? []).filter((s) => s.title && s.description),
    };
    try {
      if (form.id) {
        await servicesApi.update(form.id, body);
        toast.success("Service updated");
      } else {
        await servicesApi.create(body);
        toast.success("Service created");
      }
      setEditorOpen(false);
      void load();
    } catch (err) {
      console.error("[admin] service save failed", err);
      toast.error(getApiErrorMessage(err, "Save failed"));
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await servicesApi.delete(deleteId);
      toast.success("Service deleted");
      setDeleteId(null);
      void load();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <AdminShell>
      <CrudPageShell
        title="Services"
        description="Manage service offerings, features, process steps, and SEO."
        onCreate={openCreate}
        createLabel="New service"
        search={search}
        onSearchChange={setSearch}
      >
        {loading ? (
          <AdminTableSkeleton />
        ) : (
          <DataTable
            columns={[
              { key: "title", header: "Title", render: (r) => <span className="font-medium text-white">{r.title}</span> },
              { key: "slug", header: "Slug", render: (r) => <span className="text-muted-foreground">{r.slug}</span> },
              { key: "status", header: "Status", render: (r) => (
                <div className="flex gap-1">
                  <StatusBadge label={r.isActive ? "active" : "inactive"} variant={r.isActive ? "active" : "inactive"} />
                  {r.isFeatured ? <StatusBadge label="featured" variant="featured" /> : null}
                </div>
              )},
              { key: "actions", header: "", className: "w-24", render: (r) => (
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  <button type="button" aria-label="Edit" onClick={() => openEdit(r)} className={buttonVariants({ variant: "ghost", size: "icon" })}>
                    <Pencil className="size-4" />
                  </button>
                  <button type="button" aria-label="Delete" onClick={() => setDeleteId(r.id)} className={buttonVariants({ variant: "ghost", size: "icon" })}>
                    <Trash2 className="size-4 text-destructive" />
                  </button>
                </div>
              )},
            ]}
            rows={items}
            onRowClick={openEdit}
            empty={<EmptyAdminState title="No services" description="Create your first service offering." actionLabel="Create service" onAction={openCreate} />}
          />
        )}
      </CrudPageShell>

      <RecordDrawer
        open={editorOpen}
        onOpenChange={setEditorOpen}
        title={form.id ? "Edit service" : "New service"}
        onSave={() => void save()}
        saving={saving}
        extraActions={
          <AiGenerateButton
            type="service"
            defaultValues={{ title: form.title }}
            onApply={(draft) => {
              patch({
                title: String(draft.title ?? form.title),
                shortDescription: String(draft.shortDescription ?? ""),
                description: String(draft.description ?? ""),
                features: (draft.features as string[]) ?? [],
                processSteps: (draft.processSteps as { title: string; description: string }[]) ?? [],
                seoTitle: String(draft.seoTitle ?? ""),
                seoDescription: String(draft.seoDescription ?? ""),
                seoKeywords: (draft.seoKeywords as string[]) ?? [],
              });
            }}
          />
        }
      >
        <div className="space-y-5">
          <TextField label="Title" name="title" value={form.title} onChange={(title) => patch({ title, slug: form.slug || slugify(title) })} required />
          <TextField label="Slug" name="slug" value={form.slug ?? ""} onChange={(slug) => patch({ slug })} />
          <TextAreaField label="Short description" name="shortDescription" value={form.shortDescription ?? ""} onChange={(shortDescription) => patch({ shortDescription })} required />
          <TextAreaField label="Description" name="description" value={form.description ?? ""} onChange={(description) => patch({ description })} rows={6} />
          <TextField label="Icon" name="icon" value={form.icon ?? ""} onChange={(icon) => patch({ icon })} />
          <ImageUploader label="Cover image" value={form.coverImage} onChange={(coverImage) => patch({ coverImage })} folder="/aivrasol/services" />
          <ArrayField label="Gallery URLs" values={form.gallery ?? []} onChange={(gallery) => patch({ gallery })} placeholder="Image URL" />
          <ArrayField label="Features" values={form.features ?? []} onChange={(features) => patch({ features })} />
          <ProcessStepsField steps={form.processSteps ?? []} onChange={(processSteps) => patch({ processSteps })} />
          <ArrayField label="Technologies" values={form.technologies ?? []} onChange={(technologies) => patch({ technologies })} />
          <SeoFields values={form} onChange={(seo) => patch(seo)} />
          <div className="flex flex-wrap gap-4">
            <CheckboxField label="Featured" name="isFeatured" checked={!!form.isFeatured} onChange={(isFeatured) => patch({ isFeatured })} />
            <CheckboxField label="Active" name="isActive" checked={form.isActive !== false} onChange={(isActive) => patch({ isActive })} />
          </div>
          <NumberField label="Sort order" name="sortOrder" value={form.sortOrder ?? 0} onChange={(sortOrder) => patch({ sortOrder })} />
        </div>
      </RecordDrawer>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete service?"
        description="This cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={() => void confirmDelete()}
      />
    </AdminShell>
  );
}

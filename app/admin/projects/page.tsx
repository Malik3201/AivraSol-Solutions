"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { AiGenerateButton } from "@/components/admin/AiGenerateButton";
import { ArrayField } from "@/components/admin/ArrayField";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { CrudPageShell } from "@/components/admin/CrudPageShell";
import { DataTable } from "@/components/admin/DataTable";
import { EmptyAdminState } from "@/components/admin/EmptyAdminState";
import { AdminTableSkeleton } from "@/components/admin/AdminSkeleton";
import { CheckboxField, NumberField, TextAreaField, TextField } from "@/components/admin/EntityForm";
import { GalleryUploader } from "@/components/admin/GalleryUploader";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { ServiceMultiSelect } from "@/components/admin/ServiceMultiSelect";
import { RecordDrawer } from "@/components/admin/RecordDrawer";
import { SeoFields } from "@/components/admin/SeoFields";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { projectsApi } from "@/lib/api/admin";
import type { AdminProjectRecord } from "@/lib/api/types";
import { getApiErrorMessage } from "@/lib/utils/get-api-error-message";
import { slugify } from "@/lib/slugify";
import { buttonVariants } from "@/components/ui/button";

const empty = (): AdminProjectRecord & { id?: string } => ({
  id: "",
  title: "",
  slug: "",
  clientName: "",
  industry: "",
  shortDescription: "",
  description: "",
  problem: "",
  solution: "",
  results: [],
  coverImage: "",
  gallery: [],
  services: [],
  technologies: [],
  liveUrl: "",
  caseStudyUrl: "",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: [],
  isFeatured: false,
  isActive: true,
  sortOrder: 0,
});

export default function AdminProjectsPage() {
  const [items, setItems] = useState<AdminProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [form, setForm] = useState(empty());
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await projectsApi.list({ search: search || undefined, limit: 100 });
      setItems(res.data);
    } catch {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(() => void load(), 300);
    return () => clearTimeout(t);
  }, [load]);

  const patch = (p: Partial<AdminProjectRecord>) => setForm((f) => ({ ...f, ...p }));

  const save = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    const {
      id,
      createdAt: _c,
      updatedAt: _u,
      ...rest
    } = form as AdminProjectRecord & {
      createdAt?: string;
      updatedAt?: string;
    };

    const payload = {
      ...rest,
      slug: rest.slug || slugify(rest.title),
      gallery: (rest.gallery ?? []).filter(Boolean),
      results: (rest.results ?? []).filter(Boolean),
      technologies: (rest.technologies ?? []).filter(Boolean),
      services: (rest.services ?? []).filter(Boolean),
    };

    try {
      if (id) {
        await projectsApi.update(id, payload);
        toast.success("Project updated");
      } else {
        await projectsApi.create(payload);
        toast.success("Project created");
      }
      setEditorOpen(false);
      void load();
    } catch (err) {
      console.error("[admin] project save failed", err);
      toast.error(getApiErrorMessage(err, "Save failed"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell>
      <CrudPageShell title="Projects" description="Case studies, outcomes, and project SEO." onCreate={() => { setForm(empty()); setEditorOpen(true); }} search={search} onSearchChange={setSearch}>
        {loading ? <AdminTableSkeleton /> : (
          <DataTable
            columns={[
              { key: "title", header: "Title", render: (r) => r.title },
              { key: "industry", header: "Industry", render: (r) => r.industry ?? "—" },
              { key: "status", header: "Status", render: (r) => <StatusBadge label={r.isActive ? "active" : "inactive"} variant={r.isActive ? "active" : "inactive"} /> },
              { key: "actions", header: "", render: (r) => (
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  <button type="button" onClick={() => { setForm({ ...empty(), ...r }); setEditorOpen(true); }} className={buttonVariants({ variant: "ghost", size: "icon" })}><Pencil className="size-4" /></button>
                  <button type="button" onClick={() => setDeleteId(r.id)} className={buttonVariants({ variant: "ghost", size: "icon" })}><Trash2 className="size-4 text-destructive" /></button>
                </div>
              )},
            ]}
            rows={items}
            onRowClick={(r) => { setForm({ ...empty(), ...r }); setEditorOpen(true); }}
            empty={<EmptyAdminState title="No projects" description="Add a case study." actionLabel="New project" onAction={() => { setForm(empty()); setEditorOpen(true); }} />}
          />
        )}
      </CrudPageShell>
      <RecordDrawer open={editorOpen} onOpenChange={setEditorOpen} title={form.id ? "Edit project" : "New project"} onSave={() => void save()} saving={saving} extraActions={
        <AiGenerateButton type="project" defaultValues={{ title: form.title }} onApply={(d) => patch({ title: String(d.title ?? form.title), shortDescription: String(d.shortDescription ?? ""), description: String(d.description ?? ""), problem: String(d.problem ?? ""), solution: String(d.solution ?? ""), results: (d.results as string[]) ?? [], technologies: (d.technologies as string[]) ?? [], seoTitle: String(d.seoTitle ?? ""), seoDescription: String(d.seoDescription ?? ""), seoKeywords: (d.seoKeywords as string[]) ?? [] })} />
      }>
        <div className="space-y-5">
          <TextField label="Title" name="title" value={form.title} onChange={(title) => patch({ title, slug: form.slug || slugify(title) })} required />
          <TextField label="Slug" name="slug" value={form.slug} onChange={(slug) => patch({ slug })} />
          <TextField label="Client" name="clientName" value={form.clientName ?? ""} onChange={(clientName) => patch({ clientName })} />
          <TextField label="Industry" name="industry" value={form.industry ?? ""} onChange={(industry) => patch({ industry })} />
          <TextAreaField label="Short description" name="shortDescription" value={form.shortDescription ?? ""} onChange={(shortDescription) => patch({ shortDescription })} />
          <TextAreaField label="Description" name="description" value={form.description ?? ""} onChange={(description) => patch({ description })} rows={5} />
          <TextAreaField label="Problem" name="problem" value={form.problem ?? ""} onChange={(problem) => patch({ problem })} />
          <TextAreaField label="Solution" name="solution" value={form.solution ?? ""} onChange={(solution) => patch({ solution })} />
          <ArrayField label="Results" values={form.results ?? []} onChange={(results) => patch({ results })} />
          <ImageUploader
            label="Cover image"
            value={form.coverImage}
            onChange={(coverImage) => patch({ coverImage })}
            folder="/aivrasol/projects"
          />
          <GalleryUploader
            values={form.gallery ?? []}
            onChange={(gallery) => patch({ gallery })}
            folder="/aivrasol/projects"
          />
          <ServiceMultiSelect
            value={form.services ?? []}
            onChange={(services) => patch({ services })}
          />
          <ArrayField label="Technologies" values={form.technologies ?? []} onChange={(technologies) => patch({ technologies })} />
          <TextField label="Live URL" name="liveUrl" value={form.liveUrl ?? ""} onChange={(liveUrl) => patch({ liveUrl })} />
          <TextField label="Case study URL" name="caseStudyUrl" value={form.caseStudyUrl ?? ""} onChange={(caseStudyUrl) => patch({ caseStudyUrl })} />
          <SeoFields values={form} onChange={(seo) => patch(seo)} />
          <CheckboxField label="Featured" name="isFeatured" checked={!!form.isFeatured} onChange={(isFeatured) => patch({ isFeatured })} />
          <CheckboxField label="Active" name="isActive" checked={form.isActive !== false} onChange={(isActive) => patch({ isActive })} />
          <NumberField label="Sort order" name="sortOrder" value={form.sortOrder ?? 0} onChange={(sortOrder) => patch({ sortOrder })} />
        </div>
      </RecordDrawer>
      <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Delete project?" description="Permanent action." destructive confirmLabel="Delete" onConfirm={async () => { if (deleteId) { await projectsApi.delete(deleteId); setDeleteId(null); void load(); } }} />
    </AdminShell>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Trash2, Upload, Download } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { AiGenerateButton } from "@/components/admin/AiGenerateButton";
import { ArrayField } from "@/components/admin/ArrayField";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { CrudPageShell } from "@/components/admin/CrudPageShell";
import { DataTable } from "@/components/admin/DataTable";
import { EmptyAdminState } from "@/components/admin/EmptyAdminState";
import { AdminTableSkeleton } from "@/components/admin/AdminSkeleton";
import { CheckboxField, SelectField, TextAreaField, TextField } from "@/components/admin/EntityForm";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { RecordDrawer } from "@/components/admin/RecordDrawer";
import { SeoFields } from "@/components/admin/SeoFields";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { blogApi } from "@/lib/api/admin";
import type { AdminBlogRecord } from "@/lib/api/types";
import { slugify } from "@/lib/slugify";
import { adminFieldClass } from "@/lib/admin-styles";
import { buttonVariants } from "@/components/ui/button";

const empty = (): AdminBlogRecord & { id?: string } => ({
  id: "",
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  author: "AIVRASOL",
  tags: [],
  seoTitle: "",
  seoDescription: "",
  seoKeywords: [],
  status: "draft",
  isFeatured: false,
});

export default function AdminBlogPage() {
  const [items, setItems] = useState<AdminBlogRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [form, setForm] = useState(empty());
  const [preview, setPreview] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await blogApi.list({
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

  const patch = (p: Partial<AdminBlogRecord>) => setForm((f) => ({ ...f, ...p }));

  const save = async () => {
    const { id, ...body } = form;
    const payload = { ...body, slug: body.slug || slugify(body.title), tags: (body.tags ?? []).filter(Boolean) };
    try {
      if (id) await blogApi.update(id, payload);
      else await blogApi.create(payload);
      toast.success("Saved");
      setEditorOpen(false);
      void load();
    } catch {
      toast.error("Save failed");
    }
  };

  return (
    <AdminShell>
      <CrudPageShell
        title="Blog"
        description="Articles, drafts, and publishing."
        onCreate={() => { setForm(empty()); setEditorOpen(true); }}
        search={search}
        onSearchChange={setSearch}
        filters={
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={adminFieldClass} aria-label="Filter by status">
            <option value="">All statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        }
      >
        {loading ? <AdminTableSkeleton /> : (
          <DataTable
            columns={[
              { key: "title", header: "Title", render: (r) => r.title },
              { key: "status", header: "Status", render: (r) => <StatusBadge label={r.status} variant={r.status} /> },
              { key: "a", header: "", render: (r) => (
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  {r.status === "draft" ? (
                    <button type="button" title="Publish" onClick={async () => { await blogApi.publish(r.id); void load(); }} className={buttonVariants({ variant: "outline", size: "sm" })}><Upload className="size-3" /></button>
                  ) : (
                    <button type="button" title="Unpublish" onClick={async () => { await blogApi.unpublish(r.id); void load(); }} className={buttonVariants({ variant: "outline", size: "sm" })}><Download className="size-3" /></button>
                  )}
                  <button type="button" onClick={() => { setForm({ ...empty(), ...r }); setEditorOpen(true); }} className={buttonVariants({ variant: "ghost", size: "icon" })}><Pencil className="size-4" /></button>
                  <button type="button" onClick={() => setDeleteId(r.id)} className={buttonVariants({ variant: "ghost", size: "icon" })}><Trash2 className="size-4 text-destructive" /></button>
                </div>
              )},
            ]}
            rows={items}
            onRowClick={(r) => { setForm({ ...empty(), ...r }); setEditorOpen(true); }}
            empty={<EmptyAdminState title="No posts" description="Write your first article." actionLabel="New post" onAction={() => { setForm(empty()); setEditorOpen(true); }} />}
          />
        )}
      </CrudPageShell>
      <RecordDrawer open={editorOpen} onOpenChange={setEditorOpen} title={form.id ? "Edit post" : "New post"} onSave={() => void save()} extraActions={
        <AiGenerateButton type="blog" defaultValues={{ topic: form.title }} onApply={(d) => patch({ title: String(d.title ?? form.title), excerpt: String(d.excerpt ?? ""), content: String(d.content ?? ""), tags: (d.tags as string[]) ?? [], seoTitle: String(d.seoTitle ?? ""), seoDescription: String(d.seoDescription ?? ""), seoKeywords: (d.seoKeywords as string[]) ?? [] })} />
      }>
        <div className="space-y-5">
          <TextField label="Title" name="title" value={form.title} onChange={(title) => patch({ title, slug: form.slug || slugify(title) })} required />
          <TextField label="Slug" name="slug" value={form.slug} onChange={(slug) => patch({ slug })} />
          <TextAreaField label="Excerpt" name="excerpt" value={form.excerpt ?? ""} onChange={(excerpt) => patch({ excerpt })} />
          <div className="flex gap-2">
            <button type="button" onClick={() => setPreview(false)} className={buttonVariants({ variant: preview ? "outline" : "default", size: "sm" })}>Edit</button>
            <button type="button" onClick={() => setPreview(true)} className={buttonVariants({ variant: preview ? "default" : "outline", size: "sm" })}>Preview</button>
          </div>
          {preview ? (
            <div className="prose prose-invert max-w-none rounded-lg border border-white/10 bg-black/20 p-4 text-sm">
              <h2>{form.title}</h2>
              <p className="text-muted-foreground">{form.excerpt}</p>
              <div className="whitespace-pre-wrap">{form.content}</div>
            </div>
          ) : (
            <TextAreaField label="Content (markdown/plain)" name="content" value={form.content ?? ""} onChange={(content) => patch({ content })} rows={12} />
          )}
          <ImageUploader value={form.coverImage} onChange={(coverImage) => patch({ coverImage })} folder="/aivrasol/blog" />
          <TextField label="Author" name="author" value={form.author ?? ""} onChange={(author) => patch({ author })} />
          <ArrayField label="Tags" values={form.tags ?? []} onChange={(tags) => patch({ tags })} />
          <SelectField label="Status" name="status" value={form.status} onChange={(status) => patch({ status: status as "draft" | "published" })} options={[{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }]} />
          <SeoFields values={form} onChange={(seo) => patch(seo)} />
          <CheckboxField label="Featured" name="isFeatured" checked={!!form.isFeatured} onChange={(isFeatured) => patch({ isFeatured })} />
        </div>
      </RecordDrawer>
      <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Delete post?" description="" destructive confirmLabel="Delete" onConfirm={async () => { if (deleteId) { await blogApi.delete(deleteId); setDeleteId(null); void load(); } }} />
    </AdminShell>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { AiGenerateButton } from "@/components/admin/AiGenerateButton";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { CrudPageShell } from "@/components/admin/CrudPageShell";
import { DataTable } from "@/components/admin/DataTable";
import { EmptyAdminState } from "@/components/admin/EmptyAdminState";
import { AdminTableSkeleton } from "@/components/admin/AdminSkeleton";
import { CheckboxField, NumberField, TextAreaField, TextField } from "@/components/admin/EntityForm";
import { RecordDrawer } from "@/components/admin/RecordDrawer";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { faqsApi } from "@/lib/api/admin";
import type { AdminFaqRecord } from "@/lib/api/types";
import { buttonVariants } from "@/components/ui/button";

const empty = (): AdminFaqRecord & { id?: string } => ({
  id: "",
  question: "",
  answer: "",
  category: "",
  isActive: true,
  sortOrder: 0,
});

export default function AdminFaqsPage() {
  const [items, setItems] = useState<AdminFaqRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [form, setForm] = useState(empty());
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await faqsApi.list({ search: search || undefined, limit: 100 });
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(() => void load(), 300);
    return () => clearTimeout(t);
  }, [load]);

  const patch = (p: Partial<AdminFaqRecord>) => setForm((f) => ({ ...f, ...p }));

  const save = async () => {
    const { id, ...body } = form;
    try {
      if (id) await faqsApi.update(id, body);
      else await faqsApi.create(body);
      toast.success("Saved");
      setEditorOpen(false);
      void load();
    } catch {
      toast.error("Save failed");
    }
  };

  return (
    <AdminShell>
      <CrudPageShell title="FAQs" description="Questions and answers for services and site." onCreate={() => { setForm(empty()); setEditorOpen(true); }} search={search} onSearchChange={setSearch}>
        {loading ? <AdminTableSkeleton /> : (
          <DataTable columns={[
            { key: "q", header: "Question", render: (r) => <span className="line-clamp-2 max-w-md">{r.question}</span> },
            { key: "cat", header: "Category", render: (r) => r.category ?? "—" },
            { key: "status", header: "Status", render: (r) => <StatusBadge label={r.isActive ? "active" : "inactive"} variant={r.isActive ? "active" : "inactive"} /> },
            { key: "a", header: "", render: (r) => (
              <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                <button type="button" onClick={() => { setForm({ ...empty(), ...r }); setEditorOpen(true); }} className={buttonVariants({ variant: "ghost", size: "icon" })}><Pencil className="size-4" /></button>
                <button type="button" onClick={() => setDeleteId(r.id)} className={buttonVariants({ variant: "ghost", size: "icon" })}><Trash2 className="size-4 text-destructive" /></button>
              </div>
            )},
          ]} rows={items} onRowClick={(r) => { setForm({ ...empty(), ...r }); setEditorOpen(true); }} empty={<EmptyAdminState title="No FAQs" description="Add questions." actionLabel="Add FAQ" onAction={() => { setForm(empty()); setEditorOpen(true); }} />} />
        )}
      </CrudPageShell>
      <RecordDrawer open={editorOpen} onOpenChange={setEditorOpen} title={form.id ? "Edit FAQ" : "New FAQ"} onSave={() => void save()} extraActions={
        <AiGenerateButton type="faq" label="Generate FAQs" onApply={(d) => {
          const faqs = d.faqs as { question: string; answer: string; category?: string }[] | undefined;
          if (faqs?.[0]) patch({ question: faqs[0].question, answer: faqs[0].answer, category: faqs[0].category ?? "" });
          toast.message("First FAQ applied — save or edit others manually");
        }} />
      }>
        <div className="space-y-5">
          <TextField label="Question" name="question" value={form.question} onChange={(question) => patch({ question })} required />
          <TextAreaField label="Answer" name="answer" value={form.answer} onChange={(answer) => patch({ answer })} rows={6} required />
          <TextField label="Category" name="category" value={form.category ?? ""} onChange={(category) => patch({ category })} />
          <CheckboxField label="Active" name="isActive" checked={form.isActive !== false} onChange={(isActive) => patch({ isActive })} />
          <NumberField label="Sort order" name="sortOrder" value={form.sortOrder ?? 0} onChange={(sortOrder) => patch({ sortOrder })} />
        </div>
      </RecordDrawer>
      <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Delete FAQ?" description="" destructive confirmLabel="Delete" onConfirm={async () => { if (deleteId) { await faqsApi.delete(deleteId); setDeleteId(null); void load(); } }} />
    </AdminShell>
  );
}

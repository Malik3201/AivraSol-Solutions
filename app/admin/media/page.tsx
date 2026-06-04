"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { EmptyAdminState } from "@/components/admin/EmptyAdminState";
import { AdminTableSkeleton } from "@/components/admin/AdminSkeleton";
import { FormField } from "@/components/admin/FormField";
import { mediaApi, uploadImage, uploadMultiple } from "@/lib/api/admin";
import type { AdminMediaAsset } from "@/lib/api/types";
import { IMAGEKIT_FOLDERS } from "@/lib/validators/upload.validator";
import { adminFieldClass, adminPanelClass } from "@/lib/admin-styles";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AdminMediaPage() {
  const [items, setItems] = useState<AdminMediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [folder, setFolder] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editAlt, setEditAlt] = useState<{ id: string; alt: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await mediaApi.list({
        search: search || undefined,
        limit: 80,
      });
      setItems(
        folder
          ? res.data.filter((i) => i.folder === folder)
          : res.data,
      );
    } finally {
      setLoading(false);
    }
  }, [search, folder]);

  useEffect(() => {
    const t = setTimeout(() => void load(), 300);
    return () => clearTimeout(t);
  }, [load]);

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const f = folder || "/aivrasol/general";
      if (files.length === 1) {
        await uploadImage(files[0], f);
      } else {
        await uploadMultiple(Array.from(files), f);
      }
      toast.success("Upload complete");
      void load();
    } catch {
      toast.error("Upload failed — check ImageKit config");
    } finally {
      setUploading(false);
    }
  };

  const copyUrl = (url: string) => {
    void navigator.clipboard.writeText(url);
    toast.success("URL copied");
  };

  return (
    <AdminShell>
      <AdminPageHeader
        title="Media library"
        description="Upload, organize, and reuse assets across the site."
        actions={
          <>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(e) => void onFiles(e.target.files)}
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className={buttonVariants()}
            >
              {uploading ? "Uploading…" : "Upload"}
            </button>
          </>
        }
      />
      <div
        className={cn(adminPanelClass, "mb-6 flex flex-col gap-3 p-4 sm:flex-row")}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          void onFiles(e.dataTransfer.files);
        }}
      >
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search media…"
          className={adminFieldClass}
          aria-label="Search media"
        />
        <select
          value={folder}
          onChange={(e) => setFolder(e.target.value)}
          className={cn(adminFieldClass, "sm:max-w-[200px]")}
          aria-label="Folder filter"
        >
          <option value="">All folders</option>
          {IMAGEKIT_FOLDERS.map((f) => (
            <option key={f} value={f} className="bg-[#0a100e]">
              {f.replace("/aivrasol/", "")}
            </option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground sm:self-center">
          Drag and drop images here
        </p>
      </div>
      {loading ? (
        <AdminTableSkeleton rows={6} />
      ) : !items.length ? (
        <EmptyAdminState title="No media" description="Upload brand, project, or blog assets." actionLabel="Upload" onAction={() => inputRef.current?.click()} />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((item) => (
            <div key={item.id} className={cn(adminPanelClass, "overflow-hidden")}>
              <div className="relative aspect-square bg-black/30">
                <Image src={item.thumbnailUrl ?? item.url} alt={item.altText ?? ""} fill className="object-cover" unoptimized />
              </div>
              <div className="space-y-2 p-3">
                <p className="truncate text-xs font-medium text-white">{item.originalName}</p>
                <p className="truncate text-[10px] text-muted-foreground">{item.folder}</p>
                <div className="flex gap-1">
                  <button type="button" aria-label="Copy URL" onClick={() => copyUrl(item.url)} className={buttonVariants({ variant: "outline", size: "icon" })}>
                    <Copy className="size-3.5" />
                  </button>
                  <button type="button" aria-label="Edit alt" onClick={() => setEditAlt({ id: item.id, alt: item.altText ?? "" })} className={buttonVariants({ variant: "outline", size: "sm" })}>
                    Alt
                  </button>
                  <button type="button" aria-label="Delete" onClick={() => setDeleteId(item.id)} className={buttonVariants({ variant: "ghost", size: "icon" })}>
                    <Trash2 className="size-3.5 text-destructive" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {editAlt ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className={cn(adminPanelClass, "w-full max-w-md p-6")}>
            <FormField label="Alt text">
              <input value={editAlt.alt} onChange={(e) => setEditAlt({ ...editAlt, alt: e.target.value })} className={adminFieldClass} />
            </FormField>
            <div className="mt-4 flex gap-2">
              <button type="button" className={buttonVariants()} onClick={async () => {
                await mediaApi.update(editAlt.id, { altText: editAlt.alt });
                setEditAlt(null);
                void load();
                toast.success("Updated");
              }}>Save</button>
              <button type="button" className={buttonVariants({ variant: "outline" })} onClick={() => setEditAlt(null)}>Cancel</button>
            </div>
          </div>
        </div>
      ) : null}
      <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Delete asset?" description="Removes from media library." destructive confirmLabel="Delete" onConfirm={async () => { if (deleteId) { await mediaApi.delete(deleteId); setDeleteId(null); void load(); } }} />
    </AdminShell>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { mediaApi, uploadImage } from "@/lib/api/admin";
import type { AdminMediaAsset } from "@/lib/api/types";
import { adminFieldClass } from "@/lib/admin-styles";
import { buttonVariants } from "@/components/ui/button";
import { AdminTableSkeleton } from "@/components/admin/AdminSkeleton";
import { cn } from "@/lib/utils";

export function MediaPicker({
  open,
  onOpenChange,
  onSelect,
  folder,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
  folder?: string;
}) {
  const [items, setItems] = useState<AdminMediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await mediaApi.list({ limit: 60, search: search || undefined });
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    if (open) void load();
  }, [open, load]);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const asset = await uploadImage(file, folder ?? "/aivrasol/general");
    onSelect(asset.url);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-hidden border-white/10 bg-[#0a100e] sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Select media</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search media…"
            className={adminFieldClass}
          />
          <label className={cn(buttonVariants({ variant: "outline", size: "sm" }), "cursor-pointer")}>
            Upload
            <input type="file" accept="image/*" className="sr-only" onChange={onUpload} />
          </label>
        </div>
        <div className="max-h-[50vh] overflow-y-auto">
          {loading ? (
            <AdminTableSkeleton rows={4} />
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelect(item.url);
                    onOpenChange(false);
                  }}
                  className="group overflow-hidden rounded-lg border border-white/10 hover:border-primary/40"
                >
                  <div className="relative aspect-square bg-black/30">
                    <Image
                      src={item.thumbnailUrl ?? item.url}
                      alt={item.altText ?? item.originalName}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <p className="truncate px-2 py-1 text-[10px] text-muted-foreground">
                    {item.originalName}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { uploadImage } from "@/lib/api/admin";
import { adminFieldClass } from "@/lib/admin-styles";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function GalleryUploader({
  values,
  onChange,
  folder = "/aivrasol/projects",
  label = "Gallery images",
  maxImages = 12,
}: {
  values: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  label?: string;
  maxImages?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");

  const list = values.filter(Boolean);

  const addUrl = () => {
    const trimmed = urlDraft.trim();
    if (!trimmed || list.includes(trimmed) || list.length >= maxImages) return;
    onChange([...list, trimmed]);
    setUrlDraft("");
  };

  const removeAt = (index: number) => {
    onChange(list.filter((_, i) => i !== index));
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const next = [...list];
      for (const file of Array.from(files)) {
        if (next.length >= maxImages) break;
        const asset = await uploadImage(file, folder);
        if (!next.includes(asset.url)) next.push(asset.url);
      }
      onChange(next);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="text-xs text-muted-foreground">
        Upload images or paste URLs. {list.length}/{maxImages} added.
      </p>

      {list.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {list.map((src, index) => (
            <div
              key={`${src}-${index}`}
              className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-white/10"
            >
              <Image src={src} alt="" fill className="object-cover" unoptimized />
              <button
                type="button"
                aria-label="Remove image"
                onClick={() => removeAt(index)}
                className="absolute right-2 top-2 rounded-md bg-black/70 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <div className="flex gap-2">
        <input
          type="url"
          value={urlDraft}
          onChange={(e) => setUrlDraft(e.target.value)}
          placeholder="Paste image URL"
          className={cn(adminFieldClass, "flex-1")}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addUrl();
            }
          }}
        />
        <button
          type="button"
          onClick={addUrl}
          disabled={!urlDraft.trim() || list.length >= maxImages}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          Add URL
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple
        className="sr-only"
        onChange={(e) => void handleFiles(e.target.files)}
      />
      <button
        type="button"
        disabled={uploading || list.length >= maxImages}
        onClick={() => inputRef.current?.click()}
        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2")}
      >
        {uploading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <ImagePlus className="size-4" />
        )}
        Upload gallery images
      </button>
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2 } from "lucide-react";
import { uploadImage } from "@/lib/api/admin";
import { IMAGEKIT_FOLDERS } from "@/lib/validators/upload.validator";
import { adminFieldClass } from "@/lib/admin-styles";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FOLDER_OPTIONS = IMAGEKIT_FOLDERS.map((f) => ({
  value: f,
  label: f.replace("/aivrasol/", ""),
}));

export function ImageUploader({
  value,
  onChange,
  folder = "/aivrasol/general",
  label = "Image",
}: {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(folder);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const asset = await uploadImage(file, selectedFolder);
      onChange(asset.url);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      {value ? (
        <div className="relative aspect-video max-w-xs overflow-hidden rounded-lg border border-white/10">
          <Image src={value} alt="" fill className="object-cover" unoptimized />
        </div>
      ) : null}
      <input
        type="url"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Image URL"
        className={adminFieldClass}
      />
      <select
        value={selectedFolder}
        onChange={(e) => setSelectedFolder(e.target.value)}
        className={cn(adminFieldClass, "appearance-none")}
        aria-label="Upload folder"
      >
        {FOLDER_OPTIONS.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#0a100e]">
            {o.label}
          </option>
        ))}
      </select>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2")}
      >
        {uploading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <ImagePlus className="size-4" />
        )}
        Upload image
      </button>
    </div>
  );
}

"use client";

import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { buttonVariants } from "@/components/ui/button";

export function RecordDrawer({
  open,
  onOpenChange,
  title,
  children,
  onSave,
  saving,
  extraActions,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  onSave: () => void;
  saving?: boolean;
  extraActions?: ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto border-white/10 bg-[#0a100e] sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-white/[0.08] pt-4">
          {extraActions}
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className={buttonVariants()}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

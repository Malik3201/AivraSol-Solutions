"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormField } from "@/components/admin/FormField";
import { StatusBadge } from "@/components/admin/StatusBadge";
import type { AdminContactLead } from "@/lib/api/types";
import { LEAD_STATUSES } from "@/lib/lead-statuses";
import { adminFieldClass } from "@/lib/admin-styles";
import { buttonVariants } from "@/components/ui/button";

export function LeadDetailDrawer({
  lead,
  open,
  onOpenChange,
  status,
  notes,
  onStatusChange,
  onNotesChange,
  onSave,
  onDelete,
  saving,
}: {
  lead: AdminContactLead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: string;
  notes: string;
  onStatusChange: (status: string) => void;
  onNotesChange: (notes: string) => void;
  onSave: () => void;
  onDelete: () => void;
  saving?: boolean;
}) {
  if (!lead) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-[#0a100e] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {lead.name}
            <StatusBadge label={lead.status} variant={lead.status} />
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <div className="grid gap-2 text-muted-foreground">
            <p>
              <span className="text-foreground/80">Email:</span> {lead.email}
            </p>
            {lead.phone ? <p>Phone: {lead.phone}</p> : null}
            {lead.company ? <p>Company: {lead.company}</p> : null}
            {lead.serviceInterest ? <p>Service: {lead.serviceInterest}</p> : null}
            {lead.budgetRange ? <p>Budget: {lead.budgetRange}</p> : null}
          </div>
          <div className="rounded-lg border border-white/[0.08] bg-black/20 p-3">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Message</p>
            <p className="mt-2 whitespace-pre-wrap text-foreground/90">{lead.message}</p>
          </div>
          <FormField label="Status">
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className={adminFieldClass}
            >
              {LEAD_STATUSES.map((s) => (
                <option key={s} value={s} className="bg-[#0a100e]">
                  {s}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Admin notes">
            <textarea
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              rows={4}
              className={adminFieldClass}
            />
          </FormField>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className={buttonVariants()}
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
          <button
            type="button"
            onClick={onDelete}
            className={buttonVariants({ variant: "destructive" })}
          >
            Delete lead
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { Plus, Trash2 } from "lucide-react";
import { adminFieldClass } from "@/lib/admin-styles";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ArrayField({
  label,
  values,
  onChange,
  placeholder = "Add item",
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}) {
  const update = (index: number, value: string) => {
    const next = [...values];
    next[index] = value;
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      {values.map((value, index) => (
        <div key={index} className="flex gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => update(index, e.target.value)}
            className={adminFieldClass}
            placeholder={placeholder}
          />
          <button
            type="button"
            aria-label="Remove item"
            onClick={() => onChange(values.filter((_, i) => i !== index))}
            className={cn(buttonVariants({ variant: "outline", size: "icon" }), "shrink-0")}
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...values, ""])}
        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1")}
      >
        <Plus className="size-3.5" />
        Add
      </button>
    </div>
  );
}

export function ProcessStepsField({
  steps,
  onChange,
}: {
  steps: { title: string; description: string }[];
  onChange: (steps: { title: string; description: string }[]) => void;
}) {
  const update = (index: number, patch: Partial<{ title: string; description: string }>) => {
    const next = steps.map((s, i) => (i === index ? { ...s, ...patch } : s));
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Process steps
      </p>
      {steps.map((step, index) => (
        <div
          key={index}
          className="space-y-2 rounded-lg border border-white/[0.08] bg-black/20 p-3"
        >
          <input
            type="text"
            value={step.title}
            onChange={(e) => update(index, { title: e.target.value })}
            className={adminFieldClass}
            placeholder="Step title"
          />
          <textarea
            value={step.description}
            onChange={(e) => update(index, { description: e.target.value })}
            className={cn(adminFieldClass, "min-h-[72px] resize-y")}
            placeholder="Step description"
          />
          <button
            type="button"
            onClick={() => onChange(steps.filter((_, i) => i !== index))}
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-destructive")}
          >
            Remove step
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...steps, { title: "", description: "" }])}
        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
      >
        Add step
      </button>
    </div>
  );
}

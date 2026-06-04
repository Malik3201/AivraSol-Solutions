"use client";

import type { ReactNode } from "react";
import { FormField } from "@/components/admin/FormField";
import { adminFieldClass } from "@/lib/admin-styles";
import { cn } from "@/lib/utils";

export function EntityForm({
  children,
  onSubmit,
  footer,
}: {
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  footer?: ReactNode;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {children}
      {footer ? (
        <div className="flex flex-wrap gap-2 border-t border-white/[0.08] pt-4">{footer}</div>
      ) : null}
    </form>
  );
}

export function TextField({
  label,
  name,
  value,
  onChange,
  required,
  type = "text",
  hint,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  hint?: string;
}) {
  return (
    <FormField label={label} htmlFor={name} required={required} hint={hint}>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={adminFieldClass}
        required={required}
      />
    </FormField>
  );
}

export function TextAreaField({
  label,
  name,
  value,
  onChange,
  rows = 4,
  required,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  required?: boolean;
}) {
  return (
    <FormField label={label} htmlFor={name} required={required}>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className={cn(adminFieldClass, "resize-y min-h-[96px]")}
        required={required}
      />
    </FormField>
  );
}

export function SelectField({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <FormField label={label} htmlFor={name}>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(adminFieldClass, "appearance-none")}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#0a100e]">
            {o.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}

export function CheckboxField({
  label,
  name,
  checked,
  onChange,
}: {
  label: string;
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 rounded border-white/20 accent-primary"
      />
      {label}
    </label>
  );
}

export function NumberField({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <FormField label={label} htmlFor={name}>
      <input
        id={name}
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={adminFieldClass}
      />
    </FormField>
  );
}

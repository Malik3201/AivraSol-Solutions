import type { ReactNode } from "react";
import { adminHintClass, adminLabelClass } from "@/lib/admin-styles";
import { cn } from "@/lib/utils";

export function FormField({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-0", className)}>
      <label htmlFor={htmlFor} className={adminLabelClass}>
        {label}
        {required ? <span className="text-primary"> *</span> : null}
      </label>
      <div className="mt-1.5">{children}</div>
      {error ? (
        <p className="mt-1 text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className={adminHintClass}>{hint}</p>
      ) : null}
    </div>
  );
}

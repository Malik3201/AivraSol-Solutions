"use client";

import { FormField } from "@/components/admin/FormField";
import { ArrayField } from "@/components/admin/ArrayField";
import { adminFieldClass } from "@/lib/admin-styles";

export type SeoValues = {
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
};

export function SeoFields({
  values,
  onChange,
}: {
  values: SeoValues;
  onChange: (patch: Partial<SeoValues>) => void;
}) {
  return (
    <div className="space-y-4 rounded-xl border border-white/[0.06] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">SEO</p>
      <FormField label="SEO title">
        <input
          type="text"
          value={values.seoTitle ?? ""}
          onChange={(e) => onChange({ seoTitle: e.target.value })}
          className={adminFieldClass}
        />
      </FormField>
      <FormField label="SEO description">
        <textarea
          value={values.seoDescription ?? ""}
          onChange={(e) => onChange({ seoDescription: e.target.value })}
          className={adminFieldClass}
          rows={3}
        />
      </FormField>
      <ArrayField
        label="SEO keywords"
        values={values.seoKeywords ?? []}
        onChange={(seoKeywords) => onChange({ seoKeywords })}
        placeholder="keyword"
      />
    </div>
  );
}

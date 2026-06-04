"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormField } from "@/components/admin/FormField";
import { adminFieldClass } from "@/lib/admin-styles";
import { buttonVariants } from "@/components/ui/button";
import {
  aiBlogContent,
  aiFaqContent,
  aiProjectContent,
  aiSeoContent,
  aiServiceContent,
} from "@/lib/api/admin";
import { cn } from "@/lib/utils";

export type AiFeatureType = "service" | "project" | "blog" | "faq" | "seo";

type FieldConfig = {
  name: string;
  label: string;
  type?: "text" | "textarea";
  required?: boolean;
};

const FIELD_CONFIG: Record<AiFeatureType, FieldConfig[]> = {
  service: [
    { name: "title", label: "Service title", required: true },
    { name: "targetAudience", label: "Target audience" },
    { name: "tone", label: "Tone" },
    { name: "shortNotes", label: "Notes", type: "textarea" },
  ],
  project: [
    { name: "title", label: "Project title", required: true },
    { name: "clientIndustry", label: "Industry" },
    { name: "serviceType", label: "Service type" },
    { name: "problemNotes", label: "Problem notes", type: "textarea" },
    { name: "solutionNotes", label: "Solution notes", type: "textarea" },
    { name: "resultNotes", label: "Result notes", type: "textarea" },
  ],
  blog: [
    { name: "topic", label: "Topic", required: true },
    { name: "audience", label: "Audience" },
    { name: "tone", label: "Tone" },
  ],
  faq: [
    { name: "serviceName", label: "Service name", required: true },
    { name: "audience", label: "Audience" },
  ],
  seo: [
    { name: "pageType", label: "Page type", required: true },
    { name: "title", label: "Page title", required: true },
    { name: "description", label: "Description", type: "textarea" },
  ],
};

async function runAi(type: AiFeatureType, payload: Record<string, string>) {
  const body: Record<string, unknown> = { ...payload };
  if (payload.keywords) {
    body.keywords = payload.keywords.split(",").map((k) => k.trim()).filter(Boolean);
  }
  switch (type) {
    case "service":
      return aiServiceContent(body);
    case "project":
      return aiProjectContent(body);
    case "blog":
      return aiBlogContent(body);
    case "faq":
      return aiFaqContent(body);
    case "seo":
      return aiSeoContent(body);
  }
}

export function AiGenerateButton({
  type,
  onApply,
  defaultValues,
  label = "Generate with AI",
}: {
  type: AiFeatureType;
  onApply: (draft: Record<string, unknown>) => void;
  defaultValues?: Record<string, string>;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [fields, setFields] = useState<Record<string, string>>(defaultValues ?? {});
  const [preview, setPreview] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const configs = FIELD_CONFIG[type];

  const generate = async () => {
    setLoading(true);
    setError(null);
    setPreview(null);
    try {
      const draft = await runAi(type, fields);
      setPreview(draft);
    } catch {
      setError("AI generation failed. Try again or edit manually.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2 border-primary/30")}
      >
        <Sparkles className="size-4" />
        {label}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-[#0a100e] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>AI content draft</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {configs.map((f) => (
              <FormField key={f.name} label={f.label} required={f.required}>
                {f.type === "textarea" ? (
                  <textarea
                    value={fields[f.name] ?? ""}
                    onChange={(e) =>
                      setFields((prev) => ({ ...prev, [f.name]: e.target.value }))
                    }
                    className={cn(adminFieldClass, "min-h-[80px]")}
                  />
                ) : (
                  <input
                    type="text"
                    value={fields[f.name] ?? ""}
                    onChange={(e) =>
                      setFields((prev) => ({ ...prev, [f.name]: e.target.value }))
                    }
                    className={adminFieldClass}
                  />
                )}
              </FormField>
            ))}
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            {preview ? (
              <pre className="max-h-48 overflow-auto rounded-lg border border-white/10 bg-black/30 p-3 text-xs text-muted-foreground">
                {JSON.stringify(preview, null, 2)}
              </pre>
            ) : null}
          </div>
          <DialogFooter className="gap-2">
            <button
              type="button"
              onClick={generate}
              disabled={loading}
              className={buttonVariants()}
            >
              {loading ? "Generating…" : "Generate preview"}
            </button>
            <button
              type="button"
              disabled={!preview}
              onClick={() => {
                if (preview) {
                  onApply(preview);
                  setOpen(false);
                }
              }}
              className={buttonVariants({ variant: "outline" })}
            >
              Apply to form
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

"use client";

import Image from "next/image";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
  contactFieldClass,
  contactHintClass,
  contactLabelClass,
} from "@/components/contact/contact-field-styles";
import type { ContactFormApi } from "@/components/contact/ContactForm";
import { buttonVariants } from "@/components/ui/button";
import { assistContactMessage } from "@/lib/api/public";
import { ApiClientError } from "@/lib/api/client";
import { CONTACT_ASSIST_TONES } from "@/lib/contact-constants";
import { AIVA_ROBOT_IMAGE } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const FALLBACK_DRAFT =
  "I am exploring a new digital initiative with AIVRASOL and would like to discuss scope, timeline, and the right mix of design, engineering, and AI support for our goals.";

type Props = {
  formApi: ContactFormApi | null;
  serviceInterest: string;
};

export function ContactAssist({ formApi, serviceInterest }: Props) {
  const [roughIdea, setRoughIdea] = useState("");
  const [tone, setTone] = useState<string>("Professional");
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const draftWithAiva = async () => {
    if (!serviceInterest) {
      toast.error("Select a service interest in the form first.");
      return;
    }
    if (roughIdea.trim().length < 10) {
      toast.error("Add a rough idea (at least 10 characters) before drafting.");
      return;
    }

    setLoading(true);
    setPreview(null);
    try {
      const res = await assistContactMessage({
        serviceInterest,
        roughIdea: roughIdea.trim(),
        tone,
        name: formApi?.getValues().name,
      });
      setPreview(res.generatedMessage);
    } catch (err) {
      const msg =
        err instanceof ApiClientError ? err.message : "Aiva could not draft right now.";
      toast.error(msg);
      setPreview(FALLBACK_DRAFT);
    } finally {
      setLoading(false);
    }
  };

  const useMessage = () => {
    if (!preview || !formApi) return;
    formApi.setMessage(preview);
    toast.success("Draft added to your message field.");
  };

  return (
    <div className="rounded-2xl border border-primary/20 bg-[rgba(10,18,14,0.65)] p-5 backdrop-blur-md">
      <div className="flex items-start gap-3">
        <div className="relative size-10 shrink-0 overflow-hidden rounded-xl border border-primary/25 bg-primary/10">
          <Image src={AIVA_ROBOT_IMAGE} alt="" fill className="object-contain p-1" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-primary">Aiva assist</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Aiva can help shape your rough idea into a clear project message.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="assist-tone" className={contactLabelClass}>
            Tone
          </label>
          <select
            id="assist-tone"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className={cn(contactFieldClass, "appearance-none text-sm")}
          >
            {CONTACT_ASSIST_TONES.map((t) => (
              <option key={t} value={t} className="bg-[#0a100e]">
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="assist-idea" className={contactLabelClass}>
            Rough idea
          </label>
          <textarea
            id="assist-idea"
            rows={4}
            value={roughIdea}
            onChange={(e) => setRoughIdea(e.target.value)}
            placeholder="e.g. client portal, booking automation, AI support layer…"
            className={cn(contactFieldClass, "resize-y text-sm")}
          />
          <p className={contactHintClass}>
            Select service interest in the form, then draft your message here.
          </p>
        </div>

        <button
          type="button"
          onClick={draftWithAiva}
          disabled={loading}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "w-full gap-2 border-primary/30",
          )}
        >
          <Sparkles className="size-4" aria-hidden />
          {loading ? "Drafting…" : "Draft with Aiva"}
        </button>

        {preview ? (
          <div className="rounded-xl border border-white/[0.08] bg-black/20 p-4">
            <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              Preview
            </p>
            <p className="mt-2 text-sm leading-relaxed text-foreground/90">{preview}</p>
            <button
              type="button"
              onClick={useMessage}
              className={cn(buttonVariants({ size: "sm" }), "mt-4 w-full")}
            >
              Use this message
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

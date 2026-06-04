"use client";

import { useCallback, useState } from "react";
import type { ContactFormClientValues } from "@/lib/contact-form-schema";
import { ContactAssist } from "@/components/contact/ContactAssist";
import { ContactForm, type ContactFormApi } from "@/components/contact/ContactForm";
import { ContactInfoCards } from "@/components/contact/ContactInfoCards";
import { PremiumCard } from "@/components/site/PremiumCard";

export function ContactWorkspace() {
  const [formApi, setFormApi] = useState<ContactFormApi | null>(null);
  const [aiDraftUsed, setAiDraftUsed] = useState<string | undefined>();
  const [serviceInterest, setServiceInterest] = useState("");

  const handleRegisterApi = useCallback((api: ContactFormApi) => {
    setFormApi(api);
  }, []);

  const wrappedApi: ContactFormApi | null = formApi
    ? {
        ...formApi,
        setMessage: (value: string) => {
          setAiDraftUsed(value);
          formApi.setMessage(value);
        },
      }
    : null;

  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
      <div className="lg:col-span-7">
        <PremiumCard>
          <h2 className="mb-2 text-xl font-semibold text-white">Project inquiry</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Share enough context for us to understand goals, timeline, and technical direction.
          </p>
          <ContactForm
            onRegisterApi={handleRegisterApi}
            onValuesChange={(v: ContactFormClientValues) =>
              setServiceInterest(v.serviceInterest ?? "")
            }
            aiDraftUsed={aiDraftUsed}
          />
        </PremiumCard>
      </div>
      <div className="space-y-4 lg:col-span-5">
        <ContactAssist formApi={wrappedApi} serviceInterest={serviceInterest} />
        <ContactInfoCards compact />
      </div>
    </div>
  );
}

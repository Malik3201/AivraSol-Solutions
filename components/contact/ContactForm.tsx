"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ContactSuccessState } from "@/components/contact/ContactSuccessState";
import {
  contactFieldClass,
  contactHintClass,
  contactLabelClass,
} from "@/components/contact/contact-field-styles";
import { buttonVariants } from "@/components/ui/button";
import { submitContact } from "@/lib/api/public";
import { ApiClientError } from "@/lib/api/client";
import {
  BUDGET_RANGE_OPTIONS,
  SERVICE_INTEREST_OPTIONS,
} from "@/lib/contact-constants";
import {
  contactFormClientSchema,
  type ContactFormClientValues,
} from "@/lib/contact-form-schema";
import { cn } from "@/lib/utils";

export type ContactFormApi = {
  setMessage: (value: string) => void;
  getValues: () => ContactFormClientValues;
  watchServiceInterest: () => string;
};

type Props = {
  onRegisterApi?: (api: ContactFormApi) => void;
  onValuesChange?: (values: ContactFormClientValues) => void;
  aiDraftUsed?: string;
};

export function ContactForm({ onRegisterApi, onValuesChange, aiDraftUsed }: Props) {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ContactFormClientValues>({
    resolver: zodResolver(contactFormClientSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      serviceInterest: "",
      budgetRange: "",
      message: "",
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  useEffect(() => {
    if (!onRegisterApi) return;
    onRegisterApi({
      setMessage: (value) => setValue("message", value, { shouldValidate: true }),
      getValues,
      watchServiceInterest: () => watch("serviceInterest") ?? "",
    });
  }, [onRegisterApi, setValue, getValues, watch]);

  useEffect(() => {
    if (!onValuesChange) return;
    const sub = watch((values) => {
      onValuesChange(values as ContactFormClientValues);
    });
    return () => sub.unsubscribe();
  }, [watch, onValuesChange]);

  const onSubmit = async (values: ContactFormClientValues) => {
    try {
      await submitContact({
        name: values.name,
        email: values.email,
        message: values.message,
        phone: values.phone || undefined,
        company: values.company || undefined,
        serviceInterest: values.serviceInterest,
        budgetRange: values.budgetRange || undefined,
        aiGeneratedDraft: aiDraftUsed,
      });
      setSubmitted(true);
      toast.success("Message sent — we'll be in touch soon.");
    } catch (err) {
      const message =
        err instanceof ApiClientError
          ? err.message
          : "Something went wrong. Please try again or email hello@aivrasol.com.";
      toast.error(message);
    }
  };

  if (submitted) {
    return (
      <ContactSuccessState
        onReset={() => {
          reset();
          setSubmitted(false);
        }}
      />
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={contactLabelClass}>
            Name <span className="text-primary">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            className={contactFieldClass}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            {...register("name")}
          />
          {errors.name ? (
            <p id="contact-name-error" className={contactHintClass} role="alert">
              {errors.name.message}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="contact-email" className={contactLabelClass}>
            Email <span className="text-primary">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            className={contactFieldClass}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            {...register("email")}
          />
          {errors.email ? (
            <p id="contact-email-error" className={contactHintClass} role="alert">
              {errors.email.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-phone" className={contactLabelClass}>
            Phone <span className="text-muted-foreground">(optional)</span>
          </label>
          <input
            id="contact-phone"
            type="tel"
            autoComplete="tel"
            className={contactFieldClass}
            {...register("phone")}
          />
        </div>
        <div>
          <label htmlFor="contact-company" className={contactLabelClass}>
            Company <span className="text-muted-foreground">(optional)</span>
          </label>
          <input
            id="contact-company"
            type="text"
            autoComplete="organization"
            className={contactFieldClass}
            {...register("company")}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-service" className={contactLabelClass}>
            Service interest <span className="text-primary">*</span>
          </label>
          <select
            id="contact-service"
            className={cn(contactFieldClass, "appearance-none")}
            aria-invalid={!!errors.serviceInterest}
            aria-describedby={
              errors.serviceInterest ? "contact-service-error" : undefined
            }
            defaultValue=""
            {...register("serviceInterest")}
          >
            <option value="" disabled>
              Select a focus area
            </option>
            {SERVICE_INTEREST_OPTIONS.map((opt) => (
              <option key={opt} value={opt} className="bg-[#0a100e]">
                {opt}
              </option>
            ))}
          </select>
          {errors.serviceInterest ? (
            <p id="contact-service-error" className={contactHintClass} role="alert">
              {errors.serviceInterest.message}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="contact-budget" className={contactLabelClass}>
            Budget range
          </label>
          <select
            id="contact-budget"
            className={cn(contactFieldClass, "appearance-none")}
            defaultValue=""
            {...register("budgetRange")}
          >
            <option value="">Select if known</option>
            {BUDGET_RANGE_OPTIONS.map((opt) => (
              <option key={opt} value={opt} className="bg-[#0a100e]">
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className={contactLabelClass}>
          Project message <span className="text-primary">*</span>
        </label>
        <textarea
          id="contact-message"
          rows={6}
          className={cn(contactFieldClass, "resize-y min-h-[140px]")}
          placeholder="What are you building, who is it for, and what does success look like?"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          {...register("message")}
        />
        {errors.message ? (
          <p id="contact-message-error" className={contactHintClass} role="alert">
            {errors.message.message}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(buttonVariants({ size: "lg" }), "min-w-[180px]")}
      >
        {isSubmitting ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

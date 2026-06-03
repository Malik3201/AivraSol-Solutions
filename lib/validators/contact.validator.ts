import { z } from "zod";
import { LEAD_STATUSES } from "@/lib/models/ContactLead";

export const contactFormSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().max(40).optional(),
  company: z.string().max(120).optional(),
  serviceInterest: z.string().max(200).optional(),
  budgetRange: z.string().max(120).optional(),
  message: z.string().min(10).max(5000),
  aiGeneratedDraft: z.string().max(5000).optional(),
  source: z.string().max(120).optional(),
});

export const contactLeadUpdateSchema = z.object({
  status: z.enum(LEAD_STATUSES).optional(),
  adminNotes: z.string().max(5000).optional(),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

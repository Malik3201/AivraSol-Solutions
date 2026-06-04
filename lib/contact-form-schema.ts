import { z } from "zod";
import { BUDGET_RANGE_OPTIONS, SERVICE_INTEREST_OPTIONS } from "@/lib/contact-constants";

const serviceValues = [...SERVICE_INTEREST_OPTIONS] as [string, ...string[]];
const budgetValues = [...BUDGET_RANGE_OPTIONS] as [string, ...string[]];

export const contactFormClientSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().max(40).optional().or(z.literal("")),
  company: z.string().max(120).optional().or(z.literal("")),
  serviceInterest: z
    .string()
    .min(1, "Please select a service interest")
    .refine((v) => serviceValues.includes(v), "Please select a service interest"),
  budgetRange: z
    .string()
    .optional()
    .refine((v) => !v || budgetValues.includes(v), "Invalid budget range"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormClientValues = z.infer<typeof contactFormClientSchema>;

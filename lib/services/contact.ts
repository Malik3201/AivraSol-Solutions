import { connectDB } from "@/lib/db";
import { getServerEnv } from "@/lib/env";
import { ContactLead } from "@/lib/models/ContactLead";
import { sanitizeText, sanitizeOptionalText } from "@/lib/utils/sanitize";
import type { ContactFormInput } from "@/lib/validators/contact.validator";

export async function saveContactLead(input: ContactFormInput) {
  await connectDB();

  const lead = await ContactLead.create({
    name: sanitizeText(input.name, 120),
    email: input.email.toLowerCase().trim(),
    phone: sanitizeOptionalText(input.phone, 40),
    company: sanitizeOptionalText(input.company, 120),
    serviceInterest: sanitizeOptionalText(
      input.serviceInterest,
      200,
    ),
    budgetRange: sanitizeOptionalText(input.budgetRange, 120),
    message: sanitizeText(input.message, 5000),
    aiGeneratedDraft: sanitizeOptionalText(input.aiGeneratedDraft, 5000),
    source: sanitizeOptionalText(input.source, 120) ?? "website",
    status: "new",
  });

  await notifyContactLead(lead.toObject());

  return {
    id: String(lead._id),
    status: lead.status,
    createdAt: lead.createdAt,
  };
}

/**
 * Placeholder email notification — does not throw if SMTP is not configured.
 * Wire nodemailer when SMTP_* env vars are added.
 */
export async function notifyContactLead(lead: {
  name: string;
  email: string;
  message: string;
  serviceInterest?: string | null;
}): Promise<void> {
  try {
    const receiver = getServerEnv().CONTACT_RECEIVER_EMAIL;
    if (!receiver) {
      if (process.env.NODE_ENV === "development") {
        console.info("[contact] Lead saved; CONTACT_RECEIVER_EMAIL not set");
      }
      return;
    }

    // TODO: nodemailer when SMTP_HOST, SMTP_USER, SMTP_PASS are configured
    if (process.env.NODE_ENV === "development") {
      console.info(`[contact] Notification queued for ${receiver}`);
    }
  } catch {
    // Never fail the public contact flow due to email issues
  }
}

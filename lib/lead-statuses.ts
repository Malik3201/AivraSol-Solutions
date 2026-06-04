export const LEAD_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "closed",
  "spam",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

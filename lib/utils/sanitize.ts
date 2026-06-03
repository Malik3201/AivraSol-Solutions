export function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, "");
}

export function sanitizeText(value: string, maxLength = 5000): string {
  return stripHtml(value).trim().slice(0, maxLength);
}

export function sanitizeOptionalText(
  value: string | undefined | null,
  maxLength = 5000,
): string | undefined {
  if (value == null) return undefined;
  const cleaned = sanitizeText(value, maxLength);
  return cleaned.length ? cleaned : undefined;
}

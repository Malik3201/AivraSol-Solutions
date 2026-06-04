const STORAGE_KEY = "aiva-session-id";

export function getAivaSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `aiva-${Date.now()}`;
    localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}

export function resetAivaSessionId(): string {
  if (typeof window === "undefined") return "";
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `aiva-${Date.now()}`;
  localStorage.setItem(STORAGE_KEY, id);
  return id;
}

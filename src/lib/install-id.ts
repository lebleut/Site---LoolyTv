const STORAGE_KEY = "loolytv-demo-install-id";

export function getOrCreateInstallId(): string {
  if (typeof window === "undefined") {
    return "ssr";
  }

  try {
    const existing = sessionStorage.getItem(STORAGE_KEY);
    if (existing) return existing;

    const id = crypto.randomUUID();
    sessionStorage.setItem(STORAGE_KEY, id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

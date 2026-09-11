/** Prefer HTTPS for public origins; keep http only for local/dev hosts. */
function normalizePublicOrigin(raw: string | undefined, fallback: string): string {
  const value = (raw || fallback).replace(/\/$/, "");
  try {
    const url = new URL(value);
    const host = url.hostname;
    const isLocal =
      host === "localhost" || host === "127.0.0.1" || host.endsWith(".local");
    if (url.protocol === "http:" && !isLocal) {
      url.protocol = "https:";
    }
    return url.origin;
  } catch {
    return fallback;
  }
}

export const SITE_URL = normalizePublicOrigin(
  process.env.NEXT_PUBLIC_SITE_URL,
  "https://loolytv.com",
);

export const API_URL = normalizePublicOrigin(
  process.env.NEXT_PUBLIC_API_URL,
  "https://api.loolytv.com",
);

export const SUPPORT_EMAIL = "loolytv@salinnovation.com";

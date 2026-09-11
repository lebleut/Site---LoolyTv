const SCRIPT_ID = "loolytv-recaptcha-v3";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export function getRecaptchaSiteKey(): string {
  return process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim() || "";
}

function loadRecaptchaScript(siteKey: string): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("recaptcha_unavailable"));
  }
  if (window.grecaptcha) return Promise.resolve();

  const existing = document.getElementById(SCRIPT_ID);
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("recaptcha_load_failed")),
        { once: true },
      );
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("recaptcha_load_failed"));
    document.head.appendChild(script);
  });
}

/** Obtain a reCAPTCHA v3 token for the given action (e.g. waitlist, contact). */
export async function getRecaptchaToken(action: string): Promise<string> {
  const siteKey = getRecaptchaSiteKey();
  if (!siteKey) throw new Error("recaptcha_missing_key");

  await loadRecaptchaScript(siteKey);

  const grecaptcha = window.grecaptcha;
  if (!grecaptcha) throw new Error("recaptcha_unavailable");

  return new Promise((resolve, reject) => {
    grecaptcha.ready(() => {
      grecaptcha
        .execute(siteKey, { action })
        .then(resolve)
        .catch(() => reject(new Error("recaptcha_execute_failed")));
    });
  });
}

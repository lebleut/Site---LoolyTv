import "server-only";

const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
/** Google recommends ~0.5; raise if spam persists. */
const MIN_SCORE = 0.5;

export type RecaptchaVerifyResult =
  | { ok: true; score: number; action: string }
  | { ok: false; reason: "missing_config" | "missing_token" | "invalid" | "low_score" | "action_mismatch" };

type GoogleVerifyResponse = {
  success?: boolean;
  score?: number;
  action?: string;
  "error-codes"?: string[];
};

export async function verifyRecaptchaToken(options: {
  token: unknown;
  expectedAction: string;
}): Promise<RecaptchaVerifyResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY?.trim();
  if (!secret) return { ok: false, reason: "missing_config" };

  const token = typeof options.token === "string" ? options.token.trim() : "";
  if (!token) return { ok: false, reason: "missing_token" };

  const body = new URLSearchParams({
    secret,
    response: token,
  });

  let payload: GoogleVerifyResponse;
  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    });
    payload = (await res.json()) as GoogleVerifyResponse;
  } catch {
    return { ok: false, reason: "invalid" };
  }

  if (!payload.success) return { ok: false, reason: "invalid" };

  const action = payload.action || "";
  if (action !== options.expectedAction) {
    return { ok: false, reason: "action_mismatch" };
  }

  const score = typeof payload.score === "number" ? payload.score : 0;
  if (score < MIN_SCORE) return { ok: false, reason: "low_score" };

  return { ok: true, score, action };
}

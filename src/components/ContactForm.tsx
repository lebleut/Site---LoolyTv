"use client";

import { FormEvent, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { API_URL } from "@/lib/site";
import styles from "./Forms.module.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldKey = "name" | "email" | "message" | "consent";

export function ContactForm() {
  const t = useTranslations("contactPage");
  const locale = useLocale();
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [fieldError, setFieldError] = useState<Partial<Record<FieldKey, string>>>(
    {},
  );

  function validate(data: FormData): FieldKey | null {
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const body = String(data.get("message") || "").trim();
    const consent = data.get("consent") === "on";
    const next: Partial<Record<FieldKey, string>> = {};

    if (!name) next.name = t("errors.nameRequired");
    if (!email) next.email = t("errors.emailRequired");
    else if (!EMAIL_RE.test(email)) next.email = t("errors.emailInvalid");
    if (!body) next.message = t("errors.messageRequired");
    else if (body.length < 3) next.message = t("errors.messageTooShort");
    if (!consent) next.consent = t("errors.consentRequired");

    setFieldError(next);
    const order: FieldKey[] = ["name", "email", "message", "consent"];
    return order.find((key) => next[key]) ?? null;
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    if (String(data.get("website") || "")) {
      setStatus("ok");
      setMessage(t("success"));
      setFieldError({});
      return;
    }

    const firstInvalid = validate(data);
    if (firstInvalid) {
      setStatus("err");
      setMessage(fieldErrorMessage(firstInvalid, data));
      const el = form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`);
      el?.focus();
      return;
    }

    setBusy(true);
    setStatus("idle");
    setMessage("");
    try {
      const res = await fetch(`${API_URL}/v1/public/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(data.get("email") || "").trim(),
          name: String(data.get("name") || "").trim() || undefined,
          subject: String(data.get("subject") || "").trim() || undefined,
          message: String(data.get("message") || "").trim(),
          locale,
          consent: data.get("consent") === "on",
          website: String(data.get("website") || ""),
        }),
      });

      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as {
          message?: string | string[];
          errors?: Partial<Record<FieldKey, string>>;
        } | null;

        const apiField = payload?.errors
          ? (Object.keys(payload.errors) as FieldKey[]).find(
              (key) => payload.errors?.[key],
            )
          : undefined;

        if (apiField && payload?.errors?.[apiField]) {
          const reason = mapApiField(apiField, payload.errors[apiField]!);
          setFieldError({ [apiField]: reason });
          setStatus("err");
          setMessage(reason);
          return;
        }

        if (res.status === 400) {
          setStatus("err");
          setMessage(t("errors.invalidPayload"));
          return;
        }

        throw new Error("fail");
      }

      setStatus("ok");
      setMessage(t("success"));
      setFieldError({});
      form.reset();
    } catch {
      setStatus("err");
      setMessage(t("errors.network"));
    } finally {
      setBusy(false);
    }
  }

  function fieldErrorMessage(key: FieldKey, data: FormData): string {
    const email = String(data.get("email") || "").trim();
    const body = String(data.get("message") || "").trim();
    switch (key) {
      case "name":
        return t("errors.nameRequired");
      case "email":
        return email ? t("errors.emailInvalid") : t("errors.emailRequired");
      case "message":
        return body ? t("errors.messageTooShort") : t("errors.messageRequired");
      case "consent":
        return t("errors.consentRequired");
    }
  }

  function mapApiField(key: FieldKey, code: string): string {
    if (key === "email") {
      return code === "required" ? t("errors.emailRequired") : t("errors.emailInvalid");
    }
    if (key === "message") {
      return code === "too_small"
        ? t("errors.messageTooShort")
        : t("errors.messageRequired");
    }
    if (key === "consent") return t("errors.consentRequired");
    if (key === "name") return t("errors.nameRequired");
    return t("errors.invalidPayload");
  }

  return (
    <form className={styles.card} onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="contact-name">{t("name")}</label>
        <input
          id="contact-name"
          name="name"
          autoComplete="name"
          maxLength={80}
          required
          aria-invalid={fieldError.name ? true : undefined}
        />
        {fieldError.name ? (
          <p className={styles.fieldError}>{fieldError.name}</p>
        ) : null}
      </div>
      <div className="field">
        <label htmlFor="contact-email">{t("email")}</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          maxLength={120}
          aria-invalid={fieldError.email ? true : undefined}
        />
        {fieldError.email ? (
          <p className={styles.fieldError}>{fieldError.email}</p>
        ) : null}
      </div>
      <div className="field">
        <label htmlFor="contact-subject">{t("subject")}</label>
        <input id="contact-subject" name="subject" maxLength={120} />
      </div>
      <div className="field">
        <label htmlFor="contact-message">{t("message")}</label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          maxLength={4000}
          aria-invalid={fieldError.message ? true : undefined}
        />
        {fieldError.message ? (
          <p className={styles.fieldError}>{fieldError.message}</p>
        ) : null}
      </div>
      <label className="check">
        <input
          name="consent"
          type="checkbox"
          required
          aria-invalid={fieldError.consent ? true : undefined}
        />
        <span>{t("consent")}</span>
      </label>
      {fieldError.consent ? (
        <p className={styles.fieldError}>{fieldError.consent}</p>
      ) : null}
      <div className="hp" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <button className="btn btn-primary" type="submit" disabled={busy}>
        {busy ? t("submitting") : t("submit")}
      </button>
      {status !== "idle" ? (
        <p className={`form-status ${status}`} role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}

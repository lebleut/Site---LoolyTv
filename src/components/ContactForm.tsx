"use client";

import { FormEvent, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { API_URL } from "@/lib/site";
import styles from "./Forms.module.css";

export function ContactForm() {
  const t = useTranslations("contactPage");
  const locale = useLocale();
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (String(data.get("website") || "")) {
      setStatus("ok");
      setMessage(t("success"));
      return;
    }

    setBusy(true);
    setStatus("idle");
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
      if (!res.ok) throw new Error("fail");
      setStatus("ok");
      setMessage(t("success"));
      form.reset();
    } catch {
      setStatus("err");
      setMessage(t("error"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className={styles.card} onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="contact-name">{t("name")}</label>
        <input id="contact-name" name="name" autoComplete="name" maxLength={80} required />
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
        />
      </div>
      <div className="field">
        <label htmlFor="contact-subject">{t("subject")}</label>
        <input id="contact-subject" name="subject" maxLength={120} />
      </div>
      <div className="field">
        <label htmlFor="contact-message">{t("message")}</label>
        <textarea id="contact-message" name="message" required rows={6} maxLength={4000} />
      </div>
      <label className="check">
        <input name="consent" type="checkbox" required />
        <span>{t("consent")}</span>
      </label>
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

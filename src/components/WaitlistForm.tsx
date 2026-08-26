"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { API_URL } from "@/lib/site";
import styles from "./Forms.module.css";

export function WaitlistForm() {
  const t = useTranslations("waitlist");
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
      const res = await fetch(`${API_URL}/v1/public/waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(data.get("email") || "").trim(),
          name: String(data.get("name") || "").trim() || undefined,
          locale,
          wantsPretest: data.get("wantsPretest") === "on",
          wantsLaunchNotify: data.get("wantsLaunchNotify") === "on",
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
        <label htmlFor="waitlist-name">{t("name")}</label>
        <input id="waitlist-name" name="name" autoComplete="name" maxLength={80} />
      </div>
      <div className="field">
        <label htmlFor="waitlist-email">{t("email")}</label>
        <input
          id="waitlist-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          maxLength={120}
        />
      </div>
      <label className="check">
        <input name="wantsPretest" type="checkbox" defaultChecked />
        <span>{t("pretest")}</span>
      </label>
      <label className="check">
        <input name="wantsLaunchNotify" type="checkbox" defaultChecked />
        <span>{t("notify")}</span>
      </label>
      <label className="check">
        <input name="consent" type="checkbox" required />
        <span>{t("consent")}</span>
      </label>
      <div className="hp" aria-hidden="true">
        <label htmlFor="waitlist-website">Website</label>
        <input id="waitlist-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <button className="btn btn-primary" type="submit" disabled={busy}>
        {busy ? t("submitting") : t("submit")}
      </button>
      <p className={styles.note}>
        {t("privacyNote")}{" "}
        <Link href="/legal/privacy">Privacy Policy</Link>
      </p>
      {status !== "idle" ? (
        <p className={`form-status ${status}`} role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}

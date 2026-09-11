"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getRecaptchaToken } from "@/lib/recaptcha-client";

export function DataDeletionForm() {
  const searchParams = useSearchParams();
  const [installId, setInstallId] = useState("");
  const [result, setResult] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const fromQuery = searchParams.get("installId")?.trim() ?? "";
    if (fromQuery) setInstallId(fromQuery.slice(0, 80));
  }, [searchParams]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setResult("Submitting…");
    try {
      const captchaToken = await getRecaptchaToken("data_deletion");
      const res = await fetch("/api/public/data-deletion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ installId: installId.trim(), captchaToken }),
      });
      const data = (await res.json()) as {
        message?: string;
        ok?: boolean;
        reason?: string;
      };
      if (!res.ok) {
        setResult(
          data.reason
            ? "Captcha verification failed. Please try again."
            : data.message || "Request failed.",
        );
        return;
      }
      setResult(data.message || "Request completed.");
    } catch (err) {
      const code = err instanceof Error ? err.message : "";
      setResult(
        code.startsWith("recaptcha_")
          ? "Captcha verification failed. Please try again."
          : "Network error.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="installId">Installation ID</label>
        <input
          id="installId"
          name="installId"
          required
          maxLength={80}
          value={installId}
          onChange={(e) => setInstallId(e.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      <p style={{ fontSize: "0.9rem", marginTop: 0, opacity: 0.85 }}>
        This deletes content reports tied to this ID. If you never reported a
        playlist, the result will correctly say there was nothing to delete.
      </p>
      <button className="btn btn-primary" type="submit" disabled={busy}>
        Request deletion
      </button>
      {result ? (
        <p className="form-status" role="status">
          {result}
        </p>
      ) : null}
    </form>
  );
}

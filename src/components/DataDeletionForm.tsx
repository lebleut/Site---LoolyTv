"use client";

import { FormEvent, useState } from "react";
import { API_URL } from "@/lib/site";

export function DataDeletionForm() {
  const [result, setResult] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const installId = new FormData(form).get("installId");
    setBusy(true);
    setResult("Submitting…");
    try {
      const res = await fetch(`${API_URL}/legal/data-deletion/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ installId: String(installId || "").trim() }),
      });
      const data = (await res.json()) as { message?: string };
      setResult(data.message || (res.ok ? "Done." : "Request failed."));
    } catch {
      setResult("Network error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="installId">Installation ID</label>
        <input id="installId" name="installId" required maxLength={80} />
      </div>
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

"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { API_URL } from "@/lib/site";

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
      const res = await fetch(`${API_URL}/legal/data-deletion/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ installId: installId.trim() }),
      });
      const data = (await res.json()) as { message?: string; ok?: boolean };
      if (!res.ok) {
        setResult(data.message || "Request failed.");
        return;
      }
      setResult(data.message || "Request completed.");
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

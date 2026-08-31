"use client";

import { FormEvent, useMemo, useState, type CSSProperties } from "react";
import { API_URL } from "@/lib/site";

type Props = {
  token: string;
};

export function ResetPasswordClient({ token }: Props) {
  const appLink = useMemo(() => {
    if (!token) return "loolytv://reset-password";
    return `loolytv://reset-password?token=${encodeURIComponent(token)}`;
  }, [token]);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 10) {
      setError("Password must be at least 10 characters and include a letter and a digit.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`${API_URL}/v1/public/password/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "system-ui, sans-serif",
        background: "#0f1419",
        color: "#f4f7fb",
      }}
    >
      <div style={{ maxWidth: 420, width: "100%" }}>
        <h1 style={{ fontSize: 28, marginBottom: 12, textAlign: "center" }}>
          Reset LoolyTv password
        </h1>
        {!token ? (
          <p style={{ opacity: 0.85, textAlign: "center" }}>
            Missing reset token. Open the link from your email again.
          </p>
        ) : done ? (
          <div style={{ textAlign: "center" }}>
            <p style={{ opacity: 0.9, marginBottom: 20 }}>
              Your password was updated. You can sign in with email in the LoolyTv app.
            </p>
            <a
              href={appLink}
              style={{
                display: "inline-block",
                padding: "12px 20px",
                borderRadius: 10,
                background: "#3d8bfd",
                color: "#fff",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Open in LoolyTv
            </a>
          </div>
        ) : (
          <>
            <p style={{ opacity: 0.85, marginBottom: 16, textAlign: "center" }}>
              Choose a strong password (at least 10 characters, with a letter and a digit).
            </p>
            <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontSize: 14, opacity: 0.8 }}>New password</span>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={busy}
                  style={inputStyle}
                />
              </label>
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontSize: 14, opacity: 0.8 }}>Confirm password</span>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  disabled={busy}
                  style={inputStyle}
                />
              </label>
              {/* honeypot */}
              <input
                name="website"
                tabIndex={-1}
                autoComplete="off"
                style={{ display: "none" }}
                aria-hidden="true"
              />
              {error ? (
                <p style={{ color: "#ff7b8a", fontSize: 14, margin: 0 }}>{error}</p>
              ) : null}
              <button
                type="submit"
                disabled={busy}
                style={{
                  marginTop: 8,
                  padding: "12px 20px",
                  borderRadius: 10,
                  border: "none",
                  background: "#3d8bfd",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: busy ? "wait" : "pointer",
                  opacity: busy ? 0.7 : 1,
                }}
              >
                {busy ? "Saving…" : "Save new password"}
              </button>
            </form>
            <p style={{ opacity: 0.65, marginTop: 20, fontSize: 14, textAlign: "center" }}>
              Prefer the app?{" "}
              <a href={appLink} style={{ color: "#8ec2ff" }}>
                Open in LoolyTv
              </a>
            </p>
          </>
        )}
      </div>
    </main>
  );
}

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #2a3444",
  background: "#161c24",
  color: "#f4f7fb",
  fontSize: 16,
};

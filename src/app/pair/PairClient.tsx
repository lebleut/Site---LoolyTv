"use client";

import { useEffect, useMemo } from "react";

type Props = {
  code: string;
};

export function PairClient({ code }: Props) {
  const appLink = useMemo(() => {
    if (!code) return "loolytv://pair";
    return `loolytv://pair?code=${encodeURIComponent(code)}`;
  }, [code]);

  useEffect(() => {
    if (!code) return;
    const t = window.setTimeout(() => {
      window.location.href = appLink;
    }, 250);
    return () => window.clearTimeout(t);
  }, [appLink, code]);

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
      <div style={{ maxWidth: 420, textAlign: "center" }}>
        <h1 style={{ fontSize: 28, marginBottom: 12 }}>LoolyTv pairing</h1>
        {code ? (
          <>
            <p style={{ opacity: 0.85, marginBottom: 8 }}>
              Open this code in a signed-in parent device:
            </p>
            <p
              style={{
                fontSize: 32,
                fontFamily: "ui-monospace, monospace",
                letterSpacing: 2,
                fontWeight: 700,
                margin: "16px 0 24px",
              }}
            >
              {code}
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
            <p style={{ opacity: 0.65, marginTop: 20, fontSize: 14 }}>
              If nothing opens, launch LoolyTv → Options → Multi-devices and
              enter the code.
            </p>
          </>
        ) : (
          <p style={{ opacity: 0.85 }}>
            Missing pairing code. Scan the QR shown in LoolyTv again.
          </p>
        )}
      </div>
    </main>
  );
}

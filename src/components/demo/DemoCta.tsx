"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { trackEvent } from "@/lib/analytics";
import styles from "./demo.module.css";

export function DemoCta() {
  const t = useTranslations("demo");

  return (
    <section id="demo-waitlist" className={styles.ctaBlock} aria-labelledby="demo-cta-title">
      <h2 id="demo-cta-title">{t("cta.title")}</h2>
      <p>{t("cta.body")}</p>
      <Link
        href={{ pathname: "/", hash: "waitlist" }}
        className="btn btn-primary"
        onClick={() => trackEvent("demo_cta_waitlist_click")}
      >
        {t("cta.button")}
      </Link>
    </section>
  );
}

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import styles from "./SiteHeader.module.css";

const SECTIONS = ["features", "how", "parents"] as const;

export function SiteHeader() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const onHome = pathname === "/";

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand} onClick={close}>
          <span>LoolyTv</span>
          <span className={styles.brandSpark} aria-hidden="true">
            ✦
          </span>
        </Link>

        <button
          type="button"
          className={styles.burger}
          aria-expanded={open}
          aria-controls="site-nav"
          aria-label={t("menu")}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={open ? styles.burgerIconOpen : styles.burgerIcon}>
            <i />
            <i />
            <i />
          </span>
        </button>

        <nav
          id="site-nav"
          className={`${styles.nav} ${open ? styles.open : ""}`}
          aria-label="Primary"
        >
          <div className={styles.links}>
            {SECTIONS.map((section) =>
              onHome ? (
                <a key={section} href={`#${section}`} onClick={close}>
                  {t(section)}
                </a>
              ) : (
                <Link
                  key={section}
                  href={{ pathname: "/", hash: section }}
                  onClick={close}
                >
                  {t(section)}
                </Link>
              ),
            )}
            <Link href="/contact" onClick={close}>
              {t("contact")}
            </Link>
          </div>

          <div className={styles.actions}>
            <LanguageSwitcher />
            {onHome ? (
              <a className={styles.cta} href="#waitlist" onClick={close}>
                {t("waitlist")}
              </a>
            ) : (
              <Link
                className={styles.cta}
                href={{ pathname: "/", hash: "waitlist" }}
                onClick={close}
              >
                {t("waitlist")}
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

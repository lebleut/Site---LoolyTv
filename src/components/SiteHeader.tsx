"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import styles from "./SiteHeader.module.css";

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
          LoolyTv
        </Link>

        <button
          type="button"
          className={styles.burger}
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {t("menu")}
        </button>

        <nav
          id="site-nav"
          className={`${styles.nav} ${open ? styles.open : ""}`}
          aria-label="Primary"
        >
          {onHome ? (
            <>
              <a href="#features" onClick={close}>
                {t("features")}
              </a>
              <a href="#parents" onClick={close}>
                {t("parents")}
              </a>
              <a href="#waitlist" onClick={close}>
                {t("waitlist")}
              </a>
            </>
          ) : (
            <>
              <Link href={{ pathname: "/", hash: "features" }} onClick={close}>
                {t("features")}
              </Link>
              <Link href={{ pathname: "/", hash: "parents" }} onClick={close}>
                {t("parents")}
              </Link>
              <Link href={{ pathname: "/", hash: "waitlist" }} onClick={close}>
                {t("waitlist")}
              </Link>
            </>
          )}
          <Link href="/contact" onClick={close}>
            {t("contact")}
          </Link>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}

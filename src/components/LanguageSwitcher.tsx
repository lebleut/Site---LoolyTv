"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { Flag } from "./Flags";
import styles from "./LanguageSwitcher.module.css";

/** Endonyms stay untranslated on purpose — a reader looks for their own language. */
const NATIVE_NAMES: Record<AppLocale, string> = {
  en: "English",
  fr: "Français",
  ar: "العربية",
  es: "Español",
};

export function LanguageSwitcher() {
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;

    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const select = (code: AppLocale) => {
    setOpen(false);
    if (code === locale) return;
    router.replace(pathname, { locale: code });
  };

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-label={t("language")}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className={styles.flag}>
          <Flag locale={locale} />
        </span>
        <span className={styles.code}>{locale.toUpperCase()}</span>
        <span className={`${styles.chevron}${open ? ` ${styles.chevronOpen}` : ""}`} aria-hidden="true">
          <svg viewBox="0 0 16 16">
            <path d="M4 6.2 8 10l4-3.8" />
          </svg>
        </span>
      </button>

      {open ? (
        <ul
          id={listId}
          className={styles.menu}
          role="listbox"
          aria-label={t("language")}
        >
          {routing.locales.map((code) => {
            const active = code === locale;
            return (
              <li key={code} role="presentation">
                <button
                  type="button"
                  role="option"
                  lang={code}
                  aria-selected={active}
                  className={active ? styles.optionActive : styles.option}
                  onClick={() => select(code)}
                >
                  <span className={styles.flag}>
                    <Flag locale={code} />
                  </span>
                  <span className={styles.name}>{NATIVE_NAMES[code]}</span>
                  <span className={styles.optionCode}>{code.toUpperCase()}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

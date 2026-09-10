"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { AppLocale } from "@/i18n/routing";
import { DEMO_CONTENT_LANGS, type DemoContentLang } from "@/lib/demo-locale";
import { Flag } from "@/components/Flags";
import styles from "./demo.module.css";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function DemoLanguageFilter({ value, onChange }: Props) {
  const t = useTranslations("demo");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected = (DEMO_CONTENT_LANGS as readonly string[]).includes(value)
    ? (value as DemoContentLang)
    : "";

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

  const select = (next: string) => {
    setOpen(false);
    onChange(next);
  };

  return (
    <div className={styles.langFilter} ref={rootRef}>
      <button
        type="button"
        id="demo-language"
        className={styles.langFilterTrigger}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((current) => !current)}
      >
        {selected ? (
          <span className={styles.langFlag} aria-hidden="true">
            <Flag locale={selected as AppLocale} />
          </span>
        ) : (
          <span className={styles.langGlobe} aria-hidden="true">
            🌐
          </span>
        )}
        <span className={styles.langFilterLabel}>
          {selected ? t(`languages.${selected}`) : t("filters.allLanguages")}
        </span>
        <span
          className={`${styles.langChevron}${open ? ` ${styles.langChevronOpen}` : ""}`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 16 16">
            <path d="M4 6.2 8 10l4-3.8" />
          </svg>
        </span>
      </button>

      {open ? (
        <ul
          id={listId}
          className={styles.langFilterMenu}
          role="listbox"
          aria-label={t("filters.language")}
        >
          <li role="presentation">
            <button
              type="button"
              role="option"
              aria-selected={!selected}
              className={!selected ? styles.langOptionActive : styles.langOption}
              onClick={() => select("")}
            >
              <span className={styles.langGlobe} aria-hidden="true">
                🌐
              </span>
              <span>{t("filters.allLanguages")}</span>
            </button>
          </li>
          {DEMO_CONTENT_LANGS.map((lang) => {
            const active = selected === lang;
            return (
              <li key={lang} role="presentation">
                <button
                  type="button"
                  role="option"
                  lang={lang}
                  aria-selected={active}
                  className={active ? styles.langOptionActive : styles.langOption}
                  onClick={() => select(lang)}
                >
                  <span className={styles.langFlag} aria-hidden="true">
                    <Flag locale={lang} />
                  </span>
                  <span>{t(`languages.${lang}`)}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

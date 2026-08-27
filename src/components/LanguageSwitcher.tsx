"use client";

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

  return (
    <div className={styles.wrap} role="group" aria-label={t("language")}>
      {routing.locales.map((code) => (
        <button
          key={code}
          type="button"
          lang={code}
          title={NATIVE_NAMES[code]}
          className={code === locale ? styles.active : undefined}
          aria-current={code === locale ? "true" : undefined}
          onClick={() => router.replace(pathname, { locale: code })}
        >
          <span className={styles.flag}>
            <Flag locale={code} />
          </span>
          <span className={styles.code}>{code.toUpperCase()}</span>
          <span className={styles.srOnly}>{NATIVE_NAMES[code]}</span>
        </button>
      ))}
    </div>
  );
}

"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import styles from "./LanguageSwitcher.module.css";

const LABELS: Record<AppLocale, string> = {
  en: "EN",
  fr: "FR",
  ar: "AR",
  es: "ES",
};

export function LanguageSwitcher() {
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className={styles.wrap} role="group" aria-label="Language">
      {routing.locales.map((code) => (
        <button
          key={code}
          type="button"
          className={code === locale ? styles.active : undefined}
          aria-current={code === locale ? "true" : undefined}
          onClick={() => router.replace(pathname, { locale: code })}
        >
          {LABELS[code]}
        </button>
      ))}
    </div>
  );
}

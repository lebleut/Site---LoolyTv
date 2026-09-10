import type { AgeBand } from "./catalog-types";
import type { AppLocale } from "@/i18n/routing";

const LOCALE_COUNTRY: Record<AppLocale, string> = {
  en: "US",
  fr: "FR",
  ar: "SA",
  es: "ES",
};

export function demoCountryForLocale(locale: string): string {
  return LOCALE_COUNTRY[locale as AppLocale] ?? "US";
}

export function demoLangForLocale(locale: string): string {
  return locale === "ar" || locale === "fr" || locale === "es" || locale === "en"
    ? locale
    : "en";
}

export const DEMO_AGE_BANDS: AgeBand[] = ["AGE_2_4", "AGE_5_8", "AGE_9_12"];

/** Empty string = all ages (no ageBand / ageBands filter). */
export const DEFAULT_DEMO_AGE_BAND = "";

export function isDemoAgeBand(value: string): value is AgeBand {
  return (DEMO_AGE_BANDS as readonly string[]).includes(value);
}

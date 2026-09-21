import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fr", "ar", "es"],
  defaultLocale: "en",
  // English lives at `/`; other locales keep a prefix (`/fr`, `/ar`, `/es`).
  localePrefix: "as-needed",
  // Do not bounce `/` to another locale via Accept-Language or cookie (SEO).
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];

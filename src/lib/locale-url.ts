import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";

function normalizePath(path: string): string {
  if (!path || path === "/") return "";
  return path.startsWith("/") ? path : `/${path}`;
}

/** Public origin + localized path. English (default) has no `/en` prefix. */
export function localizedUrl(locale: string, path: string = "/"): string {
  const suffix = normalizePath(path);
  if (locale === routing.defaultLocale) {
    return suffix ? `${SITE_URL}${suffix}` : SITE_URL;
  }
  return `${SITE_URL}/${locale}${suffix}`;
}

/** hreflang map including `x-default` (English / unprefixed). */
export function languageAlternates(path: string = "/"): Record<string, string> {
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [locale, localizedUrl(locale, path)]),
  );
  return { ...languages, "x-default": localizedUrl(routing.defaultLocale, path) };
}

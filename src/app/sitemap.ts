import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";
import { localizedUrl } from "@/lib/locale-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const locales = routing.locales;

  const localized = locales.flatMap((locale) => [
    {
      url: localizedUrl(locale),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: localizedUrl(locale, "/faq"),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: localizedUrl(locale, "/contact"),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: localizedUrl(locale, "/demo"),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    },
  ]);

  const legal = ["", "/privacy", "/terms", "/data-deletion"].map((path) => ({
    url: `${SITE_URL}/legal${path}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...localized, ...legal];
}

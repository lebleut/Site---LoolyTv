import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const locales = routing.locales;

  const localized = locales.flatMap((locale) => [
    {
      url: `${SITE_URL}/${locale}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${SITE_URL}/${locale}/contact`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
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

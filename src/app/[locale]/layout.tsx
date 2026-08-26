import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { Fredoka, Nunito } from "next/font/google";
import { routing } from "@/i18n/routing";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SITE_URL } from "@/lib/site";
import "../globals.css";

const fredoka = Fredoka({
  subsets: ["latin", "latin-ext"],
  variable: "--font-fredoka",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin", "latin-ext"],
  variable: "--font-nunito",
  display: "swap",
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `${SITE_URL}/${l}`]),
  );

  return {
    metadataBase: new URL(SITE_URL),
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: { ...languages, "x-default": `${SITE_URL}/en` },
    },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/${locale}`,
      title: t("title"),
      description: t("description"),
      siteName: "LoolyTv",
      images: [{ url: "/mascot/looly-welcome.png", width: 512, height: 512, alt: "Looly mascot" }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/mascot/looly-welcome.png"],
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations("nav");
  const dir = locale === "ar" ? "rtl" : "ltr";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "LoolyTv",
        url: SITE_URL,
        email: "jamel@salinnovation.com",
        logo: `${SITE_URL}/mascot/looly-idle.png`,
      },
      {
        "@type": "SoftwareApplication",
        name: "LoolyTv",
        applicationCategory: "EntertainmentApplication",
        operatingSystem: "Android",
        description:
          "Curated Made-for-Kids video catalog for families on Android phone and TV.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
    ],
  };

  return (
    <html lang={locale} dir={dir}>
      <body className={`${fredoka.variable} ${nunito.variable}`}>
        <NextIntlClientProvider messages={messages}>
          <a className="skip-link" href="#main">
            {t("skip")}
          </a>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </NextIntlClientProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}

import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { Baloo_2, Cairo, Nunito_Sans } from "next/font/google";
import { routing } from "@/i18n/routing";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SITE_URL } from "@/lib/site";
import "../globals.css";

const baloo = Baloo_2({
  subsets: ["latin", "latin-ext"],
  variable: "--font-baloo",
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-nunito-sans",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
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
      images: [{ url: "/brand/og.jpg?v=20260827", width: 1200, height: 675, alt: "LoolyTv mascot" }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/brand/og.jpg?v=20260827"],
    },
    icons: {
      icon: [{ url: "/brand/logo.png", type: "image/png", sizes: "192x192" }],
      apple: [{ url: "/brand/apple-touch-icon.png", sizes: "180x180" }],
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
  const isArabic = locale === "ar";
  const dir = isArabic ? "rtl" : "ltr";
  const fontVars = isArabic
    ? cairo.variable
    : `${baloo.variable} ${nunitoSans.variable}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "LoolyTv",
        url: SITE_URL,
        email: "loolytv@salinnovation.com",
        logo: `${SITE_URL}/brand/logo.png`,
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

  // Font variables must sit on the same element as :root, otherwise the var()
  // references inside --font-display / --font-body resolve as invalid.
  return (
    <html lang={locale} dir={dir} className={fontVars}>
      <head>
      {/* Google tag (gtag.js) */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-F8KFN1XGK9"></script>
      <script>
        {`window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-F8KFN1XGK9');`}
      </script>
      </head>
      <body>
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

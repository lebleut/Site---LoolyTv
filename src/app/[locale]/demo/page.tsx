import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { DemoApp } from "@/components/demo/DemoApp";
import { SITE_URL } from "@/lib/site";
import { routing } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "demo" });

  return {
    title: `${t("title")} · LoolyTv`,
    description: t("metaDescription"),
    alternates: {
      canonical: `${SITE_URL}/${locale}/demo`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${SITE_URL}/${l}/demo`]),
      ),
    },
  };
}

function DemoFallback() {
  return (
    <div className="section">
      <div className="container">
        <p>Loading demo…</p>
      </div>
    </div>
  );
}

export default async function DemoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={<DemoFallback />}>
      <DemoApp />
    </Suspense>
  );
}

import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { DemoApp } from "@/components/demo/DemoApp";
import { languageAlternates, localizedUrl } from "@/lib/locale-url";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "demo" });

  return {
    title: `${t("title")} · LoolyTv`,
    description: t("metaDescription"),
    alternates: {
      canonical: localizedUrl(locale, "/demo"),
      languages: languageAlternates("/demo"),
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

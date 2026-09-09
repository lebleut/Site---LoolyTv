import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SITE_URL } from "@/lib/site";
import { routing } from "@/i18n/routing";
import { Reveal } from "@/components/Reveal";
import styles from "./faq.module.css";

const FAQ_KEYS = [
  "what",
  "purpose",
  "how",
  "whoChooses",
  "vsYoutube",
  "devices",
  "ads",
] as const;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faqPage" });
  return {
    title: `${t("title")} · LoolyTv`,
    description: t("subtitle"),
    alternates: {
      canonical: `${SITE_URL}/${locale}/faq`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${SITE_URL}/${l}/faq`]),
      ),
    },
  };
}

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("faqPage");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_KEYS.map((key) => ({
      "@type": "Question",
      name: t(`items.${key}.q`),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(`items.${key}.a`),
      },
    })),
  };

  return (
    <section className={`section ${styles.wrap}`}>
      <div className="container">
        <div className={`section-head ${styles.head}`}>
          <p className="eyebrow">{t("eyebrow")}</p>
          <h1>{t("title")}</h1>
          <p>{t("subtitle")}</p>
        </div>

        <div className={styles.list}>
          {FAQ_KEYS.map((key, index) => (
            <Reveal key={key} delay={index * 60}>
              <details
                className={styles.item}
                name="faq"
                open={index === 0}
                id={`faq-${key}`}
              >
                <summary className={styles.summary}>
                  <span className={styles.question}>{t(`items.${key}.q`)}</span>
                  <span className={styles.mark} aria-hidden="true" />
                </summary>
                <p className={styles.answer}>{t(`items.${key}.a`)}</p>
              </details>
            </Reveal>
          ))}
        </div>

        <p className={styles.contact}>
          {t("contactPrompt")}{" "}
          <Link href="/contact">{t("contactLink")}</Link>
        </p>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}

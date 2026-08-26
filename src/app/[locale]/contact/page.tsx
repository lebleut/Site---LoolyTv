import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/ContactForm";
import { SITE_URL } from "@/lib/site";
import { routing } from "@/i18n/routing";
import styles from "./contact.module.css";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contactPage" });
  return {
    title: `${t("title")} · LoolyTv`,
    description: t("subtitle"),
    alternates: {
      canonical: `${SITE_URL}/${locale}/contact`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${SITE_URL}/${l}/contact`]),
      ),
    },
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contactPage");

  return (
    <section className={`section ${styles.wrap}`}>
      <div className="container">
        <div className="section-head">
          <h1>{t("title")}</h1>
          <p>{t("subtitle")}</p>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}

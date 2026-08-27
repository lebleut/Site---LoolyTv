import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/Reveal";
import styles from "./Parents.module.css";

const PARENT_KEYS = ["google", "gate", "suggest", "privacy"] as const;

const ICONS: Record<(typeof PARENT_KEYS)[number], React.ReactNode> = {
  google: (
    <>
      <circle cx="12" cy="8.5" r="3.8" />
      <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
    </>
  ),
  gate: (
    <>
      <rect x="4.5" y="10" width="15" height="10.5" rx="2.5" />
      <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
      <path d="M12 14v2.5" />
    </>
  ),
  suggest: (
    <>
      <path d="M20.5 12.5a7.5 7.5 0 0 1-10.9 6.7L4.5 20.5l1.3-5.1A7.5 7.5 0 1 1 20.5 12.5Z" />
      <path d="M12 9v4.5M9.75 11.25h4.5" />
    </>
  ),
  privacy: (
    <>
      <path d="M12 21s-7-4.2-7-9.4V6.2l7-3.2 7 3.2v5.4C19 16.8 12 21 12 21Z" />
      <circle cx="12" cy="11" r="2.2" />
    </>
  ),
};

export async function Parents() {
  const t = await getTranslations("parents");

  return (
    <section id="parents" className={`section ${styles.band}`}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.intro}>
          <div className="section-head">
            <p className="eyebrow">{t("eyebrow")}</p>
            <h2>{t("title")}</h2>
            <p>{t("subtitle")}</p>
          </div>

          <p className={styles.note}>{t("note")}</p>
        </div>

        <ul className={styles.list}>
          {PARENT_KEYS.map((key, index) => (
            <li key={key}>
              <Reveal delay={index * 90}>
                <div className={styles.card}>
                  <span className={styles.icon} aria-hidden="true">
                    <svg viewBox="0 0 24 24">{ICONS[key]}</svg>
                  </span>
                  <h3>{t(`items.${key}.title`)}</h3>
                  <p>{t(`items.${key}.body`)}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

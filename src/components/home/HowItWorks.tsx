import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/Reveal";
import styles from "./HowItWorks.module.css";

const STEP_KEYS = ["install", "pick", "play"] as const;

const ICONS: Record<(typeof STEP_KEYS)[number], React.ReactNode> = {
  install: (
    <>
      <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
      <path d="M12 7v7m0 0 3-3m-3 3-3-3" />
    </>
  ),
  pick: (
    <>
      <path d="M4 6h11M4 12h11M4 18h7" />
      <path d="m17.5 16.5 2 2 3.5-3.8" />
    </>
  ),
  play: (
    <>
      <rect x="2.5" y="4" width="19" height="13" rx="2.5" />
      <path d="M8 21h8" />
      <path d="M10.5 8.8 14.5 11l-4 2.2Z" />
    </>
  ),
};

export async function HowItWorks() {
  const t = await getTranslations("howItWorks");

  return (
    <section id="how" className={`section ${styles.section}`}>
      <div className="container">
        <div className={`section-head ${styles.head}`}>
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2>{t("title")}</h2>
          <p>{t("subtitle")}</p>
        </div>

        <ol className={styles.steps}>
          {STEP_KEYS.map((key, index) => (
            <li key={key} className={styles.step}>
              <Reveal delay={index * 120}>
                <div className={styles.card}>
                  <span className={styles.number} aria-hidden="true">
                    {index + 1}
                  </span>
                  <span className={styles.icon} aria-hidden="true">
                    <svg viewBox="0 0 24 24">{ICONS[key]}</svg>
                  </span>
                  <h3>{t(`steps.${key}.title`)}</h3>
                  <p>{t(`steps.${key}.body`)}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

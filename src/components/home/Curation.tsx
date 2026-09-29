import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/Reveal";
import styles from "./Curation.module.css";

const PILLAR_KEYS = [
  "educational",
  "calm",
  "noEmptyLoops",
  "familySafe",
] as const;

export async function Curation() {
  const t = await getTranslations("curation");

  return (
    <section id="curation" className={`section ${styles.section}`}>
      <div className="container">
        <div className={`section-head ${styles.head}`}>
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2>{t("title")}</h2>
        </div>

        <p className={styles.lead}>{t("lead")}</p>

        <ul className={styles.pillars}>
          {PILLAR_KEYS.map((key, index) => (
            <li key={key}>
              <Reveal delay={index * 80}>
                <div className={styles.pillar}>
                  <h3>{t(`pillars.${key}.title`)}</h3>
                  <p>{t(`pillars.${key}.body`)}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>

        <p className={styles.note}>{t("note")}</p>
      </div>
    </section>
  );
}

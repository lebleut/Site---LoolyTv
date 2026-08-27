import Image from "next/image";
import { getTranslations } from "next-intl/server";
import styles from "./Hero.module.css";

export async function Hero() {
  const t = await getTranslations("hero");

  return (
    <section className={styles.hero} aria-labelledby="hero-brand">
      <span className={styles.blobA} aria-hidden="true" />
      <span className={styles.blobB} aria-hidden="true" />

      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <p className="eyebrow">
            <span aria-hidden="true">✦</span>
            {t("tagline")}
          </p>

          <h1 id="hero-brand" className={styles.brand}>
            {t("brand")}
            <span className={styles.dot}>.</span>
          </h1>

          <p className={styles.lead}>{t("lead")}</p>

          <div className={styles.ctaRow}>
            <a className="btn btn-primary" href="#waitlist">
              {t("ctaWaitlist")}
              <span className={styles.arrow} aria-hidden="true">
                →
              </span>
            </a>
            <a className="btn btn-secondary" href="#features">
              {t("ctaFeatures")}
            </a>
          </div>

          <p className={styles.trust}>
            <span className={styles.trustDots} aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            {t("trust")}
          </p>
        </div>

        <div className={styles.visual}>
          <span className={styles.sun} aria-hidden="true" />

          <Image
            src="/mascot/looly-new.png"
            alt={t("mascotAlt")}
            width={620}
            height={620}
            priority
            sizes="(max-width: 900px) 80vw, 40vw"
            className={styles.mascot}
          />

          <span className={`${styles.chip} ${styles.chipKids}`}>
            <span aria-hidden="true">🧸</span>
            {t("chipKids")}
          </span>
          <span className={`${styles.chip} ${styles.chipAds}`}>
            <span aria-hidden="true">🚫</span>
            {t("chipAds")}
          </span>
          <span className={`${styles.chip} ${styles.chipDevices}`}>
            <span aria-hidden="true">📺</span>
            {t("chipDevices")}
          </span>
        </div>
      </div>
    </section>
  );
}

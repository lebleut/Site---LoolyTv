import Image from "next/image";
import { getTranslations } from "next-intl/server";
import styles from "./Hero.module.css";

export async function Hero() {
  const t = await getTranslations("hero");

  return (
    <section className={styles.hero} aria-labelledby="hero-brand">
      <Image
        src="/brand/hero-bg.jpg"
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className={styles.bg}
      />
      <span className={styles.veil} aria-hidden="true" />

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

          <div className={styles.videoWrap}>
            <video
              className={styles.video}
              src="/brand/calm-parent.mp4"
              controls
              playsInline
              preload="metadata"
              aria-label={t("videoLabel")}
            />
          </div>

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
            src="/brand/mascot-hero.png"
            alt={t("mascotAlt")}
            width={620}
            height={620}
            priority
            sizes="(max-width: 900px) 70vw, 38vw"
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

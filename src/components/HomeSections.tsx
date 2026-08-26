import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { WaitlistForm } from "./WaitlistForm";
import styles from "./HomeSections.module.css";

const FEATURE_KEYS = [
  "catalog",
  "library",
  "playall",
  "topics",
  "devices",
  "ads",
] as const;

const PARENT_KEYS = ["google", "gate", "suggest", "privacy"] as const;

export async function HomeSections() {
  const th = await getTranslations("hero");
  const tf = await getTranslations("features");
  const tp = await getTranslations("parents");
  const tw = await getTranslations("waitlist");

  return (
    <>
      <section className={styles.hero} aria-labelledby="hero-brand">
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>{th("tagline")}</p>
            <h1 id="hero-brand" className={styles.brand}>
              {th("brand")}
            </h1>
            <p className={styles.lead}>{th("lead")}</p>
            <div className={styles.ctaRow}>
              <a className="btn btn-primary" href="#waitlist">
                {th("ctaWaitlist")}
              </a>
              <a className="btn btn-secondary" href="#features">
                {th("ctaFeatures")}
              </a>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <Image
              src="/mascot/looly-welcome.png"
              alt="Looly, the friendly TV mascot, waving hello"
              width={520}
              height={520}
              priority
              className={styles.mascot}
            />
          </div>
        </div>
      </section>

      <section id="features" className="section">
        <div className="container">
          <div className="section-head">
            <h2>{tf("title")}</h2>
            <p>{tf("subtitle")}</p>
          </div>
          <ul className={styles.featureList}>
            {FEATURE_KEYS.map((key) => (
              <li key={key}>
                <h3>{tf(`items.${key}.title`)}</h3>
                <p>{tf(`items.${key}.body`)}</p>
              </li>
            ))}
          </ul>
          <div className={styles.inlineMascot}>
            <Image
              src="/mascot/looly-idle.png"
              alt=""
              width={160}
              height={160}
              aria-hidden
            />
          </div>
        </div>
      </section>

      <section id="parents" className={`section ${styles.parentsBand}`}>
        <div className="container">
          <div className="section-head">
            <h2>{tp("title")}</h2>
            <p>{tp("subtitle")}</p>
          </div>
          <ul className={styles.parentList}>
            {PARENT_KEYS.map((key) => (
              <li key={key}>
                <h3>{tp(`items.${key}.title`)}</h3>
                <p>{tp(`items.${key}.body`)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="waitlist" className="section">
        <div className={`container ${styles.waitGrid}`}>
          <div className="section-head">
            <h2>{tw("title")}</h2>
            <p>{tw("subtitle")}</p>
            <Image
              src="/mascot/looly-celebrate.png"
              alt=""
              width={180}
              height={180}
              className={styles.waitMascot}
              aria-hidden
            />
          </div>
          <WaitlistForm />
        </div>
      </section>
    </>
  );
}

import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { WaitlistForm } from "./WaitlistForm";
import styles from "./HomeSections.module.css";

const FEATURE_KEYS = ["catalog", "library", "playall", "topics", "devices", "ads"] as const;
const FEATURE_ICONS = ["◉", "▣", "▶", "✦", "⌂", "♥"];
const PARENT_KEYS = ["google", "gate", "suggest", "privacy"] as const;
const PARENT_ICONS = ["1", "2", "3", "4"];

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
            <p className={styles.kicker}><span aria-hidden="true">✦</span> {th("tagline")}</p>
            <h1 id="hero-brand" className={styles.brand}>{th("brand")}<span className={styles.dot}>.</span></h1>
            <p className={styles.lead}>{th("lead")}</p>
            <div className={styles.ctaRow}>
              <a className="btn btn-primary" href="#waitlist">{th("ctaWaitlist")} <span aria-hidden="true">→</span></a>
              <a className="btn btn-secondary" href="#features">{th("ctaFeatures")}</a>
            </div>
            <div className={styles.trust}><span className={styles.trustBubbles} aria-hidden="true">● ● ●</span><span>Une aventure pensée pour toute la famille</span></div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.sun} aria-hidden="true" />
            <div className={styles.heroBadge}>Bientôt<br /><strong>sur Android</strong></div>
            <Image src="/mascot/looly-welcome.png" alt="Looly, le cheval à bascule qui accueille les enfants" width={620} height={620} priority className={styles.mascot} />
          </div>
        </div>
        <div className={styles.wave} aria-hidden="true" />
      </section>

      <section id="features" className="section featuresSection">
        <div className="container">
          <div className="section-head"><p className={styles.eyebrow}>L’univers Looly</p><h2>{tf("title")}</h2><p>{tf("subtitle")}</p></div>
          <ul className={styles.featureList}>
            {FEATURE_KEYS.map((key, index) => <li className={`${styles.featureCard} ${styles[`card${index % 4}`]}`} key={key}><span className={styles.featureIcon} aria-hidden="true">{FEATURE_ICONS[index]}</span><h3>{tf(`items.${key}.title`)}</h3><p>{tf(`items.${key}.body`)}</p></li>)}
          </ul>
          <div className={styles.inlineMascot}><Image src="/mascot/looly-idle.png" alt="" width={160} height={160} aria-hidden /></div>
        </div>
      </section>

      <section id="parents" className={`section ${styles.parentsBand}`}>
        <div className={`container ${styles.parentsGrid}`}>
          <div className="section-head"><p className={styles.eyebrow}>Pour les grands</p><h2>{tp("title")}</h2><p>{tp("subtitle")}</p><div className={styles.parentNote}>Une bulle numérique plus sereine, où les enfants explorent et où les parents respirent.</div></div>
          <ul className={styles.parentList}>{PARENT_KEYS.map((key, index) => <li key={key}><span className={styles.parentNumber} aria-hidden="true">{PARENT_ICONS[index]}</span><div><h3>{tp(`items.${key}.title`)}</h3><p>{tp(`items.${key}.body`)}</p></div></li>)}</ul>
        </div>
      </section>

      <section id="waitlist" className={`section ${styles.waitSection}`}>
        <div className={`container ${styles.waitGrid}`}>
          <div className="section-head"><p className={styles.eyebrow}>Le départ approche</p><h2>{tw("title")}</h2><p>{tw("subtitle")}</p><Image src="/mascot/looly-celebrate.png" alt="" width={220} height={220} className={styles.waitMascot} aria-hidden /></div>
          <WaitlistForm />
        </div>
      </section>
    </>
  );
}

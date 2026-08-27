import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { WaitlistForm } from "@/components/WaitlistForm";
import styles from "./Waitlist.module.css";

export async function Waitlist() {
  const t = await getTranslations("waitlist");

  return (
    <section id="waitlist" className={`section ${styles.band}`}>
      <span className={styles.glow} aria-hidden="true" />

      <div className={`container ${styles.grid}`}>
        <div>
          <div className="section-head">
            <p className="eyebrow">{t("eyebrow")}</p>
            <h2>{t("title")}</h2>
            <p>{t("subtitle")}</p>
          </div>

          <Image
            src="/mascot/looly-new.png"
            alt=""
            aria-hidden="true"
            width={260}
            height={260}
            sizes="210px"
            className={styles.mascot}
          />
        </div>

        <div className={styles.formSlot}>
          <WaitlistForm />
        </div>
      </div>
    </section>
  );
}

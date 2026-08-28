import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link as LocaleLink } from "@/i18n/navigation";
import styles from "./SiteFooter.module.css";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.about}>
          <p className={styles.brand}>
            <Image
              src="/brand/logo.png"
              alt=""
              aria-hidden="true"
              width={40}
              height={40}
              className={styles.brandMark}
            />
            LoolyTv
          </p>
          <p className={styles.tag}>{t("tagline")}</p>
        </div>

        <nav className={styles.links} aria-label="Legal">
          <Link href="/legal/privacy">{t("privacy")}</Link>
          <Link href="/legal/terms">{t("terms")}</Link>
          <Link href="/legal/data-deletion">{t("deletion")}</Link>
          <LocaleLink href="/contact">{t("contact")}</LocaleLink>
        </nav>

        <a
          className={styles.maker}
          href="https://salinnovation.com"
          target="_blank"
          rel="noreferrer"
        >
          <span>{t("producedBy")}</span>
          <img
            src="https://salinnovation.com/_next/static/media/logo.774098b1.png"
            alt="SALI Innovation"
            width="80"
            height="70"
          />
        </a>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p className={styles.copy}>{t("rights", { year })}</p>
      </div>
    </footer>
  );
}

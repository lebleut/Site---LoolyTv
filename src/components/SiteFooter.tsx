import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Link as LocaleLink } from "@/i18n/navigation";
import styles from "./SiteFooter.module.css";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div>
          <p className={styles.brand}>LoolyTv</p>
          <p className={styles.tag}>{t("tagline")}</p>
        </div>
        <nav className={styles.links} aria-label="Legal">
          <Link href="/legal/privacy">{t("privacy")}</Link>
          <Link href="/legal/terms">{t("terms")}</Link>
          <Link href="/legal/data-deletion">{t("deletion")}</Link>
          <LocaleLink href="/contact">{t("contact")}</LocaleLink>
        </nav>
        <p className={styles.copy}>{t("rights", { year })}</p>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { Baloo_2, Nunito_Sans } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "../globals.css";
import styles from "./legal.module.css";

const baloo = Baloo_2({
  subsets: ["latin", "latin-ext"],
  variable: "--font-baloo",
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-nunito-sans",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  robots: { index: true, follow: true },
};

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${baloo.variable} ${nunitoSans.variable}`}>
      <body>
        <div className={styles.shell}>
          <nav className={styles.nav} aria-label="Legal">
            <Link href="/en">Back to LoolyTv</Link>
            <span aria-hidden>·</span>
            <Link href="/legal/privacy">Privacy</Link>
            <Link href="/legal/terms">Terms</Link>
            <Link href="/legal/data-deletion">Data deletion</Link>
          </nav>
          <p className={styles.note}>Legal documents are provided in English.</p>
          {children}
        </div>
      </body>
    </html>
  );
}

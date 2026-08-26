import Link from "next/link";
import { Nunito, Source_Sans_3 } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "../globals.css";
import styles from "./legal.module.css";

const nunito = Nunito({
  subsets: ["latin", "latin-ext"],
  variable: "--font-nunito",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin", "latin-ext"],
  variable: "--font-source-sans",
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
    <html lang="en">
      <body className={`${nunito.variable} ${sourceSans.variable}`}>
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

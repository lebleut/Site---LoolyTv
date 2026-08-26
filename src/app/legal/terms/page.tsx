import { readFileSync } from "fs";
import { join } from "path";
import { markdownToHtml } from "@/lib/markdown";
import { SITE_URL } from "@/lib/site";
import styles from "../legal.module.css";

export const metadata = {
  title: "Terms of Use · LoolyTv",
  description: "LoolyTv Terms of Use for the Android app and website.",
  alternates: { canonical: `${SITE_URL}/legal/terms` },
};

export default function TermsPage() {
  const md = readFileSync(
    join(process.cwd(), "content/legal/terms-of-use.md"),
    "utf8",
  );
  return (
    <article
      className={styles.article}
      dangerouslySetInnerHTML={{ __html: markdownToHtml(md) }}
    />
  );
}

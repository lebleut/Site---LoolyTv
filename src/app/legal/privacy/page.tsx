import { readFileSync } from "fs";
import { join } from "path";
import { markdownToHtml } from "@/lib/markdown";
import { SITE_URL } from "@/lib/site";
import styles from "../legal.module.css";

export const metadata = {
  title: "Privacy Policy · LoolyTv",
  description: "LoolyTv Privacy Policy for the Android app and website.",
  alternates: { canonical: `${SITE_URL}/legal/privacy` },
};

export default function PrivacyPage() {
  const md = readFileSync(
    join(process.cwd(), "content/legal/privacy-policy.md"),
    "utf8",
  );
  return (
    <article
      className={styles.article}
      dangerouslySetInnerHTML={{ __html: markdownToHtml(md) }}
    />
  );
}

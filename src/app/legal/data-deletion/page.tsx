import { readFileSync } from "fs";
import { join } from "path";
import { markdownToHtml } from "@/lib/markdown";
import { SITE_URL } from "@/lib/site";
import { DataDeletionForm } from "@/components/DataDeletionForm";
import styles from "../legal.module.css";

export const metadata = {
  title: "Data Deletion · LoolyTv",
  description: "Request deletion of LoolyTv account or installation-linked data.",
  alternates: { canonical: `${SITE_URL}/legal/data-deletion` },
};

export default function DataDeletionPage() {
  const md = readFileSync(
    join(process.cwd(), "content/legal/data-deletion.md"),
    "utf8",
  );
  return (
    <>
      <article
        className={styles.article}
        dangerouslySetInnerHTML={{ __html: markdownToHtml(md) }}
      />
      <section className={styles.formBox}>
        <h2>Request deletion</h2>
        <p>Paste the installation ID from LoolyTv Options → About.</p>
        <DataDeletionForm />
      </section>
    </>
  );
}

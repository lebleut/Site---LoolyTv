import { markdownToHtml } from "@/lib/markdown";
import { SITE_URL } from "@/lib/site";
import styles from "./legal.module.css";

export const metadata = {
  title: "Legal · LoolyTv",
  description: "LoolyTv legal documents: Privacy Policy, Terms of Use, Data deletion.",
  alternates: { canonical: `${SITE_URL}/legal` },
};

export default function LegalIndexPage() {
  const html = markdownToHtml(`# LoolyTv Legal

- [Privacy Policy](/legal/privacy)
- [Terms of Use](/legal/terms)
- [Data deletion](/legal/data-deletion)
`);
  return <article className={styles.article} dangerouslySetInnerHTML={{ __html: html }} />;
}

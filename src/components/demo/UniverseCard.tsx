"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ExploreUniverseItem } from "@/lib/catalog-types";
import { upgradeThumbnail } from "@/lib/demo-thumbnail";
import styles from "./demo.module.css";

type Props = {
  item: ExploreUniverseItem;
};

export function UniverseCard({ item }: Props) {
  const t = useTranslations("demo");
  const thumb = upgradeThumbnail(item.thumbnail, "maxres");
  const title = item.kind === "universe" ? item.name : item.title;
  const meta =
    item.kind === "universe"
      ? t("meta.channels", { count: item.channelCount })
      : t("sections.channel");

  return (
    <article className={styles.universeCardArt}>
      <div className={styles.universeCardMedia}>
        {thumb ? (
          <Image
            src={thumb}
            alt=""
            width={480}
            height={480}
            sizes="(max-width: 720px) 72vw, (max-width: 1024px) 32vw, 14rem"
            className={styles.universeCardImg}
            unoptimized
          />
        ) : null}
      </div>
      <div className={styles.universeCardBody}>
        <h3 className={styles.universeCardTitle}>{title}</h3>
        <p className={styles.universeCardMeta}>{meta}</p>
      </div>
    </article>
  );
}

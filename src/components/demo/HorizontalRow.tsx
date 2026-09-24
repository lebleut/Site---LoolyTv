"use client";

import Image from "next/image";
import type { AppPlaylist, ExploreRailItem } from "@/lib/catalog-types";
import { DemoSlider } from "./DemoSlider";
import { PlaylistCard } from "./PlaylistCard";
import styles from "./demo.module.css";

type Props = {
  title: string;
  playlists?: AppPlaylist[];
  items?: ExploreRailItem[];
  onOpenPlaylist: (playlist: AppPlaylist) => void;
  onOpenVideo?: (video: { id: string; title: string; thumbnail?: string | null }) => void;
};

export function HorizontalRow({
  title,
  playlists = [],
  items,
  onOpenPlaylist,
  onOpenVideo,
}: Props) {
  const rail: ExploreRailItem[] =
    items && items.length > 0
      ? items
      : playlists.map((playlist) => ({ kind: "playlist" as const, playlist }));
  if (rail.length === 0) return null;

  return (
    <DemoSlider title={title}>
      {rail.map((item) => {
        if (item.kind === "playlist") {
          return (
            <li key={`pl-${item.playlist.id}`} className={styles.sliderItem}>
              <PlaylistCard playlist={item.playlist} onOpen={onOpenPlaylist} />
            </li>
          );
        }
        const thumb = item.thumbnail || "/brand/logo.png";
        const key = `${item.kind}-${item.id}`;
        const body = (
          <>
            <div className={styles.cardMedia}>
              <Image
                src={thumb}
                alt=""
                width={640}
                height={360}
                sizes="(max-width: 720px) 72vw, 16rem"
                className={styles.cardMediaImg}
                unoptimized
              />
            </div>
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardMeta}>
                {item.kind === "universe" ? "Universe" : item.kind === "video" ? "Video" : "Channel"}
              </p>
            </div>
          </>
        );
        if (item.kind === "video") {
          return (
            <li key={key} className={styles.sliderItem}>
              <button
                type="button"
                className={`${styles.card} ${styles.playlistCard}`}
                onClick={() => onOpenVideo?.(item)}
              >
                {body}
              </button>
            </li>
          );
        }
        return (
          <li key={key} className={styles.sliderItem}>
            <article className={`${styles.card} ${styles.playlistCard}`}>{body}</article>
          </li>
        );
      })}
    </DemoSlider>
  );
}

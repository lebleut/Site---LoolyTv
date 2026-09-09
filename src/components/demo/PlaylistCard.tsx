"use client";

import Image from "next/image";
import type { AppPlaylist } from "@/lib/catalog-types";
import styles from "./demo.module.css";

type Props = {
  playlist: AppPlaylist;
  meta?: string;
  onOpen: (playlist: AppPlaylist) => void;
};

export function PlaylistCard({ playlist, meta, onOpen }: Props) {
  const thumb = playlist.thumbnail ?? "/brand/logo.png";
  const subtitle =
    meta ??
    [playlist.channelTitle, `${playlist.videoCount} videos`].filter(Boolean).join(" · ");

  return (
    <button
      type="button"
      className={styles.card}
      onClick={() => onOpen(playlist)}
      aria-label={playlist.title}
    >
      <div className={styles.cardMedia}>
        <Image
          src={thumb}
          alt=""
          width={640}
          height={360}
          sizes="(max-width: 720px) 45vw, 14rem"
          unoptimized
        />
      </div>
      <div className={styles.cardBody}>
        <h3>{playlist.title}</h3>
        <p className={styles.cardMeta}>{subtitle}</p>
      </div>
    </button>
  );
}

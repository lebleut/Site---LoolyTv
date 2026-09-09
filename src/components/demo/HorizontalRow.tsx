"use client";

import type { AppPlaylist } from "@/lib/catalog-types";
import { PlaylistCard } from "./PlaylistCard";
import styles from "./demo.module.css";

type Props = {
  title: string;
  playlists: AppPlaylist[];
  onOpenPlaylist: (playlist: AppPlaylist) => void;
};

export function HorizontalRow({ title, playlists, onOpenPlaylist }: Props) {
  if (playlists.length === 0) return null;

  return (
    <section className={styles.section} aria-label={title}>
      <div className={styles.sectionHead}>
        <h2>{title}</h2>
      </div>
      <ul className={styles.rowTrack}>
        {playlists.map((playlist) => (
          <li key={playlist.id} className={styles.universeCard}>
            <PlaylistCard playlist={playlist} onOpen={onOpenPlaylist} />
          </li>
        ))}
      </ul>
    </section>
  );
}

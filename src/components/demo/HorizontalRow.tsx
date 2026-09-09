"use client";

import type { AppPlaylist } from "@/lib/catalog-types";
import { DemoSlider } from "./DemoSlider";
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
    <DemoSlider title={title}>
      {playlists.map((playlist) => (
        <li key={playlist.id} className={styles.sliderItem}>
          <PlaylistCard playlist={playlist} onOpen={onOpenPlaylist} />
        </li>
      ))}
    </DemoSlider>
  );
}

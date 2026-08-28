"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import styles from "./Hero.module.css";

export function HeroVideo() {
  const t = useTranslations("hero");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const syncPlaying = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setPlaying(!video.paused && !video.ended);
  }, []);

  const toggle = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      try {
        await video.play();
      } catch {
        // Autoplay policies can reject; keep UI on play state.
      }
    } else {
      video.pause();
    }
    syncPlaying();
  }, [syncPlaying]);

  return (
    <div className={styles.videoWrap}>
      <video
        ref={videoRef}
        className={styles.video}
        src="/brand/calm-parent.mp4"
        playsInline
        preload="metadata"
        aria-label={t("videoLabel")}
        onPlay={syncPlaying}
        onPause={syncPlaying}
        onEnded={syncPlaying}
        onClick={toggle}
      />

      {!playing ? (
        <button
          type="button"
          className={styles.playBtn}
          onClick={toggle}
          aria-label={t("playVideo")}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8.2 5.6v12.8L19 12 8.2 5.6Z" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}

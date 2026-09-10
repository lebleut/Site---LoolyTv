"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { AppVideo } from "@/lib/catalog-types";
import { trackEvent } from "@/lib/analytics";
import styles from "./demo.module.css";

type Props = {
  video: AppVideo;
  playlistId: string;
};

type YtPlayer = {
  destroy: () => void;
};

type YtNamespace = {
  Player: new (
    element: string | HTMLElement,
    config: {
      videoId: string;
      playerVars: Record<string, number | string>;
      events: { onStateChange: (event: { data: number }) => void };
    },
  ) => YtPlayer;
  PlayerState: { ENDED: number };
};

declare global {
  interface Window {
    YT?: YtNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let ytApiPromise: Promise<void> | null = null;

function loadYouTubeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();

  if (!ytApiPromise) {
    ytApiPromise = new Promise((resolve) => {
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previous?.();
        resolve();
      };

      if (document.querySelector('script[data-yt-api="1"]')) {
        const poll = window.setInterval(() => {
          if (window.YT?.Player) {
            window.clearInterval(poll);
            resolve();
          }
        }, 50);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      script.dataset.ytApi = "1";
      document.head.appendChild(script);
    });
  }

  return ytApiPromise;
}

function destroyPlayer(player: YtPlayer | null) {
  if (!player) return;
  try {
    player.destroy();
  } catch {
    // YouTube may already have detached the iframe during a fast remount.
  }
}

export function PreviewPlayer({ video, playlistId }: Props) {
  const t = useTranslations("demo");
  const frameId = useId().replace(/:/g, "");
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YtPlayer | null>(null);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const thumb = video.thumbnail ?? `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`;

  const handleEnded = useCallback(() => {
    setEnded(true);
    trackEvent("demo_video_complete", {
      video_id: video.youtubeId,
      playlist_id: playlistId,
    });
  }, [playlistId, video.youtubeId]);

  useEffect(() => {
    setPlaying(false);
    setEnded(false);
    destroyPlayer(playerRef.current);
    playerRef.current = null;
    if (hostRef.current) hostRef.current.innerHTML = "";
  }, [video.youtubeId]);

  useEffect(() => {
    if (!playing || ended) return;

    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;

    // YT.Player replaces this node with an iframe. Keep it outside React's
    // rendered tree so React never tries to removeChild the replaced node.
    const mount = document.createElement("div");
    mount.id = frameId;
    mount.className = styles.playerFrame;
    mount.title = video.title;
    host.replaceChildren(mount);

    loadYouTubeApi().then(() => {
      if (cancelled || !window.YT?.Player || !host.contains(mount)) return;

      destroyPlayer(playerRef.current);
      playerRef.current = new window.YT.Player(mount, {
        videoId: video.youtubeId,
        playerVars: {
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onStateChange: (event) => {
            if (event.data === window.YT?.PlayerState.ENDED) {
              handleEnded();
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      destroyPlayer(playerRef.current);
      playerRef.current = null;
      host.replaceChildren();
    };
  }, [playing, ended, frameId, handleEnded, video.youtubeId, video.title]);

  const startPlayback = () => {
    trackEvent("demo_video_play", {
      video_id: video.youtubeId,
      playlist_id: playlistId,
    });
    setPlaying(true);
  };

  return (
    <div className={styles.playerWrap}>
      <div className={styles.playerShell}>
        {!playing ? (
          <button type="button" className={styles.playerPoster} onClick={startPlayback}>
            <Image src={thumb} alt="" fill sizes="(max-width: 720px) 92vw, 40rem" unoptimized />
            <span aria-hidden="true">▶</span>
            <strong>{video.title}</strong>
          </button>
        ) : (
          <div ref={hostRef} className={styles.playerFrameHost} />
        )}
      </div>

      {ended ? (
        <div className={styles.endCard}>
          <p>{t("player.endMessage")}</p>
          <a className="btn btn-primary" href="#demo-waitlist">
            {t("player.endCta")}
          </a>
        </div>
      ) : null}
    </div>
  );
}

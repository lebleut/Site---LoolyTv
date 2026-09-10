"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { AppPlaylist, AppVideo } from "@/lib/catalog-types";
import { DemoApiError, fetchDemoPlaylist, fetchDemoPlaylistVideos } from "@/lib/demo-api";
import { formatDuration } from "@/lib/demo-format";
import { trackEvent } from "@/lib/analytics";
import { PreviewPlayer } from "./PreviewPlayer";
import { PlaylistDialogSkeleton } from "./PlaylistDialogSkeleton";
import styles from "./demo.module.css";

type Props = {
  playlistId: string;
  country: string;
  onClose: () => void;
};

const WEB_PREVIEW_VIDEO_LIMIT = 10;

function isPlayableVideo(video: AppVideo): boolean {
  if (video.embedBlocked) return false;
  if (video.madeForKids === false) return false;
  return true;
}

export function PlaylistDialog({ playlistId, country, onClose }: Props) {
  const t = useTranslations("demo");
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const dialogHeadRef = useRef<HTMLDivElement>(null);
  const playerAnchorRef = useRef<HTMLDivElement>(null);
  const [playlist, setPlaylist] = useState<AppPlaylist | null>(null);
  const [videos, setVideos] = useState<AppVideo[]>([]);
  const [activeVideo, setActiveVideo] = useState<AppVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    closeRef.current?.focus();

    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const query = new URLSearchParams({ country }).toString();
        const [playlistData, videosData] = await Promise.all([
          fetchDemoPlaylist(playlistId, query, { signal: controller.signal }),
          fetchDemoPlaylistVideos(playlistId, `${query}&maxResults=${WEB_PREVIEW_VIDEO_LIMIT}`, {
            signal: controller.signal,
          }),
        ]);

        setPlaylist(playlistData as AppPlaylist);
        const playable = (videosData as { items: AppVideo[] }).items.filter(isPlayableVideo);
        setVideos(playable);
        setActiveVideo(null);
        trackEvent("demo_playlist_open", { playlist_id: playlistId });
      } catch (err) {
        if (controller.signal.aborted) return;
        if (err instanceof DemoApiError && err.status === 429) {
          setError(t("errors.rateLimit"));
        } else {
          setError(t("errors.loadPlaylist"));
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    load();
    return () => controller.abort();
  }, [country, playlistId, t]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useEffect(() => {
    const node = dialogRef.current;
    if (!node) return;

    const focusables = node.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    function trapFocus(event: KeyboardEvent) {
      if (event.key !== "Tab" || focusables.length === 0) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    node.addEventListener("keydown", trapFocus);
    return () => node.removeEventListener("keydown", trapFocus);
  }, [loading, videos.length, activeVideo]);

  const meta = playlist
    ? [
        playlist.channelTitle,
        t("meta.videos", { count: playlist.videoCount }),
        playlist.avgDurationSeconds
          ? t("meta.avgDuration", {
              duration: formatDuration(playlist.avgDurationSeconds),
            })
          : null,
      ]
        .filter(Boolean)
        .join(" · ")
    : "";

  const visibleVideos = videos.slice(0, WEB_PREVIEW_VIDEO_LIMIT);
  const totalVideos = playlist?.videoCount ?? videos.length;
  const hasHiddenVideos = totalVideos > visibleVideos.length;

  const selectVideo = (video: AppVideo) => {
    setActiveVideo(video);
  };

  useEffect(() => {
    if (!activeVideo) return;

    const dialog = dialogRef.current;
    const head = dialogHeadRef.current;
    const anchor = playerAnchorRef.current;
    if (!dialog || !anchor) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scrollPlayerIntoView = () => {
      const headHeight = head?.offsetHeight ?? 0;
      const top =
        anchor.getBoundingClientRect().top -
        dialog.getBoundingClientRect().top +
        dialog.scrollTop -
        headHeight -
        8;

      dialog.scrollTo({
        top: Math.max(0, top),
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    };

    // Wait for the player to mount/layout under the sticky header.
    let innerFrame = 0;
    const outerFrame = window.requestAnimationFrame(() => {
      innerFrame = window.requestAnimationFrame(scrollPlayerIntoView);
    });

    return () => {
      window.cancelAnimationFrame(outerFrame);
      window.cancelAnimationFrame(innerFrame);
    };
  }, [activeVideo]);

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-playlist-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div ref={dialogHeadRef} className={styles.dialogHead}>
          {!loading && playlist?.thumbnail ? (
            <div className={styles.dialogThumb}>
              <Image
                src={playlist.thumbnail}
                alt=""
                width={240}
                height={135}
                unoptimized
              />
            </div>
          ) : null}

          {!loading ? (
            <div className={styles.dialogTitle}>
              <h2 id="demo-playlist-title">{playlist?.title}</h2>
              {meta ? <p>{meta}</p> : null}
            </div>
          ) : (
            <div className={styles.dialogTitle} aria-hidden="true" />
          )}

          <button
            ref={closeRef}
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label={t("close")}
          >
            ×
          </button>
        </div>

        {loading ? <PlaylistDialogSkeleton /> : null}
        {error ? <p className={`${styles.status} ${styles.statusError}`}>{error}</p> : null}

        <div ref={playerAnchorRef} className={styles.playerAnchor}>
          {activeVideo ? (
            <PreviewPlayer video={activeVideo} playlistId={playlistId} />
          ) : null}
        </div>

        {!loading && !error ? (
          <ul className={styles.videoList}>
            {visibleVideos.length === 0 ? (
              <li className={styles.empty}>{t("noVideos")}</li>
            ) : (
              visibleVideos.map((video) => (
                <li key={video.id}>
                  <button
                    type="button"
                    className={styles.videoItem}
                    onClick={() => selectVideo(video)}
                  >
                    <div className={styles.videoThumb}>
                      {video.thumbnail ? (
                        <Image
                          src={video.thumbnail}
                          alt=""
                          width={160}
                          height={90}
                          unoptimized
                        />
                      ) : null}
                    </div>
                    <div className={styles.videoCopy}>
                      <strong>{video.title}</strong>
                      <span>{formatDuration(video.duration)}</span>
                    </div>
                  </button>
                </li>
              ))
            )}
            {hasHiddenVideos ? (
              <li className={styles.previewNote}>
                {t("playlistPreviewLimit", {
                  shown: visibleVideos.length,
                  total: totalVideos,
                })}
              </li>
            ) : null}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

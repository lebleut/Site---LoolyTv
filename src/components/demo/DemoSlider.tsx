"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import styles from "./demo.module.css";

type Props = {
  title: string;
  ariaLabel?: string;
  children: ReactNode;
};

type ScrollEdges = {
  canPrev: boolean;
  canNext: boolean;
};

const EDGE_TOLERANCE_PX = 2;

function normalizedScrollLeft(track: HTMLUListElement): number {
  const maxScroll = track.scrollWidth - track.clientWidth;
  if (maxScroll <= 0) return 0;

  const isRtl = getComputedStyle(track).direction === "rtl";
  if (!isRtl) return track.scrollLeft;

  // Blink/WebKit use negative scrollLeft in RTL; Firefox uses inverted positive values.
  if (track.scrollLeft <= 0) {
    return Math.abs(track.scrollLeft);
  }

  return maxScroll - track.scrollLeft;
}

function readScrollEdges(track: HTMLUListElement): ScrollEdges {
  const maxScroll = track.scrollWidth - track.clientWidth;
  if (maxScroll <= EDGE_TOLERANCE_PX) {
    return { canPrev: false, canNext: false };
  }

  const offset = normalizedScrollLeft(track);

  return {
    canPrev: offset > EDGE_TOLERANCE_PX,
    canNext: offset < maxScroll - EDGE_TOLERANCE_PX,
  };
}

export function DemoSlider({ title, ariaLabel, children }: Props) {
  const t = useTranslations("demo");
  const trackRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState<ScrollEdges>({ canPrev: false, canNext: false });

  const updateScrollEdges = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setEdges(readScrollEdges(track));
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateScrollEdges();

    track.addEventListener("scroll", updateScrollEdges, { passive: true });
    window.addEventListener("resize", updateScrollEdges);

    const observer = new ResizeObserver(updateScrollEdges);
    observer.observe(track);
    for (const child of track.children) {
      observer.observe(child);
    }

    return () => {
      track.removeEventListener("scroll", updateScrollEdges);
      window.removeEventListener("resize", updateScrollEdges);
      observer.disconnect();
    };
  }, [children, updateScrollEdges]);

  const scrollByPage = useCallback((direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;

    const card = track.querySelector<HTMLElement>("li");
    const cardWidth = card?.offsetWidth ?? track.clientWidth * 0.75;
    const gap = 16;
    track.scrollBy({ left: direction * (cardWidth + gap), behavior: "smooth" });
  }, []);

  return (
    <section className={styles.section} aria-label={ariaLabel ?? title}>
      <div className={styles.sectionHead}>
        <h2>{title}</h2>
      </div>

      <div className={styles.slider}>
        <button
          type="button"
          className={`${styles.arrow} ${styles.prev}`}
          aria-label={t("slider.prev")}
          disabled={!edges.canPrev}
          onClick={() => scrollByPage(-1)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m15 5-7 7 7 7" />
          </svg>
        </button>

        <ul ref={trackRef} className={styles.rowTrack} tabIndex={0}>
          {children}
        </ul>

        <button
          type="button"
          className={`${styles.arrow} ${styles.next}`}
          aria-label={t("slider.next")}
          disabled={!edges.canNext}
          onClick={() => scrollByPage(1)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m9 5 7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}

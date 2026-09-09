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

function readScrollEdges(track: HTMLUListElement): ScrollEdges {
  const first = track.firstElementChild as HTMLElement | null;
  const last = track.lastElementChild as HTMLElement | null;
  if (!first || !last) {
    return { canPrev: false, canNext: false };
  }

  const trackRect = track.getBoundingClientRect();
  const firstRect = first.getBoundingClientRect();
  const lastRect = last.getBoundingClientRect();
  const isRtl = getComputedStyle(track).direction === "rtl";

  if (isRtl) {
    return {
      canPrev: lastRect.right > trackRect.right + EDGE_TOLERANCE_PX,
      canNext: firstRect.left < trackRect.left - EDGE_TOLERANCE_PX,
    };
  }

  return {
    canPrev: firstRect.left < trackRect.left - EDGE_TOLERANCE_PX,
    canNext: lastRect.right > trackRect.right + EDGE_TOLERANCE_PX,
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

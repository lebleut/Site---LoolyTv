"use client";

import { useCallback, useRef, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import styles from "./demo.module.css";

type Props = {
  title: string;
  ariaLabel?: string;
  children: ReactNode;
};

export function DemoSlider({ title, ariaLabel, children }: Props) {
  const t = useTranslations("demo");
  const trackRef = useRef<HTMLUListElement>(null);

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

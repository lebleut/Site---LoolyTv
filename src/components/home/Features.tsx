"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import styles from "./Features.module.css";

const FEATURE_KEYS = [
  "catalog",
  "library",
  "playall",
  "topics",
  "devices",
  "ads",
] as const;

const ICONS: Record<(typeof FEATURE_KEYS)[number], React.ReactNode> = {
  catalog: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="3" width="7" height="7" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" />
    </>
  ),
  library: (
    <>
      <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" />
    </>
  ),
  playall: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M10.5 8.5 16 12l-5.5 3.5Z" />
    </>
  ),
  topics: (
    <>
      <path d="M12 3l2.2 4.9 5.3.6-3.9 3.6 1 5.2-4.6-2.6-4.6 2.6 1-5.2L4.5 8.5l5.3-.6Z" />
    </>
  ),
  devices: (
    <>
      <rect x="2" y="4" width="14" height="10" rx="2" />
      <path d="M7 18h6" />
      <rect x="17" y="10" width="5" height="10" rx="1.6" />
    </>
  ),
  ads: (
    <>
      <path d="M12 21s-7-4.2-7-9.4V6.2l7-3.2 7 3.2v5.4C19 16.8 12 21 12 21Z" />
      <path d="m9.2 11.8 2 2 3.6-3.8" />
    </>
  ),
};

export function Features() {
  const t = useTranslations("features");
  const trackRef = useRef<HTMLUListElement>(null);
  const cardRefs = useRef<Array<HTMLLIElement | null>>([]);
  const visibleRef = useRef<Set<number>>(new Set());
  const [visible, setVisible] = useState<number[]>([0]);
  const [paused, setPaused] = useState(false);

  // scrollIntoView would also scroll the page vertically, so move the track
  // itself by the measured delta. A relative shift stays correct in RTL.
  const goTo = useCallback((index: number) => {
    const track = trackRef.current;
    const card = cardRefs.current[index];
    if (!track || !card) return;

    const delta =
      card.getBoundingClientRect().left - track.getBoundingClientRect().left;
    track.scrollBy({ left: delta, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const index = Number((entry.target as HTMLElement).dataset.index);
          if (entry.isIntersecting) visibleRef.current.add(index);
          else visibleRef.current.delete(index);
        }
        setVisible([...visibleRef.current].sort((a, b) => a - b));
      },
      { root: track, threshold: 0.6 },
    );

    for (const card of cardRefs.current) {
      if (card) observer.observe(card);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(() => {
      const first = visible[0] ?? 0;
      const last = visible[visible.length - 1] ?? 0;
      goTo(last >= FEATURE_KEYS.length - 1 ? 0 : first + 1);
    }, 5200);

    return () => window.clearInterval(id);
  }, [paused, visible, goTo]);

  const step = (direction: 1 | -1) => {
    const first = visible[0] ?? 0;
    const last = visible[visible.length - 1] ?? 0;
    if (direction === 1) {
      goTo(last >= FEATURE_KEYS.length - 1 ? 0 : first + 1);
    } else {
      goTo(first <= 0 ? FEATURE_KEYS.length - 1 : first - 1);
    }
  };

  return (
    <section id="features" className="section">
      <div className="container">
        <div className={`section-head ${styles.head}`}>
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2>{t("title")}</h2>
          <p>{t("subtitle")}</p>
        </div>

        <div
          className={styles.slider}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <button
            type="button"
            className={`${styles.arrow} ${styles.prev}`}
            aria-label={t("prev")}
            onClick={() => step(-1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m15 5-7 7 7 7" />
            </svg>
          </button>

          <ul
            ref={trackRef}
            className={styles.track}
            tabIndex={0}
            aria-label={t("title")}
          >
            {FEATURE_KEYS.map((key, index) => (
              <li
                key={key}
                data-index={index}
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                className={`${styles.card} ${styles[`tone${index % 5}`]}`}
              >
                <span className={styles.icon} aria-hidden="true">
                  <svg viewBox="0 0 24 24">{ICONS[key]}</svg>
                </span>
                <h3>{t(`items.${key}.title`)}</h3>
                <p>{t(`items.${key}.body`)}</p>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className={`${styles.arrow} ${styles.next}`}
            aria-label={t("next")}
            onClick={() => step(1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m9 5 7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className={styles.dots}>
          {FEATURE_KEYS.map((key, index) => (
            <button
              key={key}
              type="button"
              className={visible.includes(index) ? styles.dotOn : styles.dot}
              aria-label={t("goToSlide", { number: index + 1 })}
              aria-current={visible.includes(index) ? "true" : undefined}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

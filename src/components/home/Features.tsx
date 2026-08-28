"use client";

import Image from "next/image";
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

type FeatureKey = (typeof FEATURE_KEYS)[number];

const FEATURE_IMAGES: Record<
  FeatureKey,
  { src: string; fit: "cover" | "contain"; width: number; height: number }
> = {
  catalog: {
    src: "/brand/mascot.png",
    fit: "contain",
    width: 640,
    height: 640,
  },
  library: {
    src: "/brand/family-scene.jpg",
    fit: "cover",
    width: 1400,
    height: 900,
  },
  playall: {
    src: "/brand/mascot-celebrate.png",
    fit: "contain",
    width: 640,
    height: 640,
  },
  topics: {
    src: "/brand/mascot-hero.png",
    fit: "contain",
    width: 800,
    height: 800,
  },
  devices: {
    src: "/brand/parents.jpg",
    fit: "cover",
    width: 1200,
    height: 900,
  },
  ads: {
    src: "/brand/hero-bg.jpg",
    fit: "cover",
    width: 1200,
    height: 800,
  },
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
            {FEATURE_KEYS.map((key, index) => {
              const image = FEATURE_IMAGES[key];
              return (
                <li
                  key={key}
                  data-index={index}
                  ref={(node) => {
                    cardRefs.current[index] = node;
                  }}
                  className={`${styles.card} ${styles[`tone${index % 5}`]}`}
                >
                  <div
                    className={`${styles.media} ${
                      image.fit === "contain" ? styles.mediaSoft : ""
                    }`}
                  >
                    <Image
                      src={image.src}
                      alt={t(`items.${key}.imageAlt`)}
                      width={image.width}
                      height={image.height}
                      sizes="(max-width: 720px) 84vw, (max-width: 1024px) 42vw, 28vw"
                      className={
                        image.fit === "contain"
                          ? styles.mediaContain
                          : styles.mediaCover
                      }
                    />
                  </div>
                  <div className={styles.copy}>
                    <h3>{t(`items.${key}.title`)}</h3>
                    <p>{t(`items.${key}.body`)}</p>
                  </div>
                </li>
              );
            })}
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

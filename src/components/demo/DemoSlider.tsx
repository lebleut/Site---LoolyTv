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
  canScrollLeft: boolean;
  canScrollRight: boolean;
};

/** Covers inline padding of the track plus sub-pixel rounding. */
const EDGE_TOLERANCE_PX = 6;

const DRAG_THRESHOLD_PX = 6;

/**
 * Edges are measured from real child geometry rather than `scrollLeft`, whose
 * sign and range differ between engines in RTL. Left/right here are always
 * physical, so the arrows behave identically in every locale.
 */
function readScrollEdges(track: HTMLUListElement): ScrollEdges {
  const children = Array.from(track.children) as HTMLElement[];
  if (children.length === 0) {
    return { canScrollLeft: false, canScrollRight: false };
  }

  const trackRect = track.getBoundingClientRect();
  let leftMost = Number.POSITIVE_INFINITY;
  let rightMost = Number.NEGATIVE_INFINITY;

  for (const child of children) {
    const rect = child.getBoundingClientRect();
    leftMost = Math.min(leftMost, rect.left);
    rightMost = Math.max(rightMost, rect.right);
  }

  return {
    canScrollLeft: leftMost < trackRect.left - EDGE_TOLERANCE_PX,
    canScrollRight: rightMost > trackRect.right + EDGE_TOLERANCE_PX,
  };
}

export function DemoSlider({ title, ariaLabel, children }: Props) {
  const t = useTranslations("demo");
  const trackRef = useRef<HTMLUListElement>(null);
  const dragRef = useRef({ pointerId: -1, startX: 0, scrollLeft: 0, moved: false });
  const [edges, setEdges] = useState<ScrollEdges>({
    canScrollLeft: false,
    canScrollRight: false,
  });

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

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;

      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        scrollLeft: track.scrollLeft,
        moved: false,
      };
    };

    const onPointerMove = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (drag.pointerId !== event.pointerId) return;

      const delta = event.clientX - drag.startX;
      if (!drag.moved) {
        if (Math.abs(delta) < DRAG_THRESHOLD_PX) return;
        drag.moved = true;
        track.classList.add(styles.dragging);
        track.setPointerCapture(event.pointerId);
      }

      event.preventDefault();
      track.scrollLeft = drag.scrollLeft - delta;
    };

    const endDrag = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (drag.pointerId !== event.pointerId) return;

      if (drag.moved) {
        track.classList.remove(styles.dragging);
        if (track.hasPointerCapture(event.pointerId)) {
          track.releasePointerCapture(event.pointerId);
        }
        updateScrollEdges();
      }

      drag.pointerId = -1;
    };

    // A drag that ends over a card must not trigger that card's click.
    const onClickCapture = (event: MouseEvent) => {
      if (!dragRef.current.moved) return;
      event.preventDefault();
      event.stopPropagation();
      dragRef.current.moved = false;
    };

    track.addEventListener("pointerdown", onPointerDown);
    track.addEventListener("pointermove", onPointerMove);
    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);
    track.addEventListener("click", onClickCapture, true);

    return () => {
      track.removeEventListener("pointerdown", onPointerDown);
      track.removeEventListener("pointermove", onPointerMove);
      track.removeEventListener("pointerup", endDrag);
      track.removeEventListener("pointercancel", endDrag);
      track.removeEventListener("click", onClickCapture, true);
    };
  }, [updateScrollEdges]);

  /** `left` is a physical axis, so the same sign works in LTR and RTL. */
  const scrollByPage = useCallback((towards: "left" | "right") => {
    const track = trackRef.current;
    if (!track) return;

    const card = track.querySelector<HTMLElement>("li");
    const gap = 16;
    const step = (card?.offsetWidth ?? track.clientWidth * 0.75) + gap;

    track.scrollBy({
      left: towards === "left" ? -step : step,
      behavior: "smooth",
    });
  }, []);

  return (
    <section className={styles.section} aria-label={ariaLabel ?? title}>
      <div className={styles.sectionHead}>
        <h2>{title}</h2>
      </div>

      <div className={styles.slider}>
        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowLeft}`}
          aria-label={t("slider.scrollLeft")}
          disabled={!edges.canScrollLeft}
          onClick={() => scrollByPage("left")}
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
          className={`${styles.arrow} ${styles.arrowRight}`}
          aria-label={t("slider.scrollRight")}
          disabled={!edges.canScrollRight}
          onClick={() => scrollByPage("right")}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m9 5 7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}

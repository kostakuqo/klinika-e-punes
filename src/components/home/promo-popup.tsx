"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "framer-motion";
import { useTranslations } from "next-intl";
import { clsx } from "clsx";
import { optimizedImageUrl } from "@/lib/cloudinary-image-url";

export type PromoPopupSlide = { id: string; src: string; alt: string; link: string };

const AUTOPLAY_MS = 5000;
const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Promo images from Admin → Promocionet, shown over the home page every time
 * it opens. Several images become a carousel: arrows, dots, swipe and autoplay
 * (paused while the pointer is over it). Closes with ✕, Esc or a click outside.
 */
export function PromoPopup({ slides, delaySeconds }: { slides: PromoPopupSlide[]; delaySeconds: number }) {
  const t = useTranslations("promo");
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const many = slides.length > 1;

  useEffect(() => {
    if (!slides.length) return;
    const timer = window.setTimeout(() => {
      lastFocus.current = document.activeElement as HTMLElement | null;
      setOpen(true);
    }, Math.max(0, delaySeconds) * 1000);
    return () => window.clearTimeout(timer);
  }, [slides.length, delaySeconds]);

  const close = useCallback(() => {
    setOpen(false);
    lastFocus.current?.focus?.();
  }, []);

  const go = useCallback(
    (step: number) => {
      setDirection(step);
      setIndex((i) => (i + step + slides.length) % slides.length);
    },
    [slides.length],
  );

  // keyboard + page scroll lock while open
  useEffect(() => {
    if (!open) return;
    dialogRef.current?.focus();
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (many && e.key === "ArrowRight") go(1);
      if (many && e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, many, go, close]);

  // autoplay
  useEffect(() => {
    if (!open || !many || paused || reduce) return;
    const timer = window.setInterval(() => go(1), AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [open, many, paused, reduce, go, index]);

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -60 || info.velocity.x < -400) go(1);
    else if (info.offset.x > 60 || info.velocity.x > 400) go(-1);
  }

  const slide = slides[index];

  return (
    <AnimatePresence>
      {open && slide && (
        <motion.div
          data-lenis-prevent
          className="fixed inset-0 z-[70] grid place-items-center bg-navy-deep/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.35 }}
          onClick={close}
        >
          <motion.div
            ref={dialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-roledescription={many ? "carousel" : undefined}
            aria-label={t("label")}
            className="relative w-[min(92vw,calc(78dvh*0.8),540px)] outline-none"
            initial={reduce ? false : { opacity: 0, y: 40, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.6, ease }}
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                  key={slide.id}
                  custom={direction}
                  className="absolute inset-0"
                  initial={reduce ? false : { x: `${direction * 100}%` }}
                  animate={{ x: 0 }}
                  exit={reduce ? { opacity: 0 } : { x: `${direction * -100}%` }}
                  transition={{ duration: 0.55, ease }}
                  drag={many ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.25}
                  onDragEnd={onDragEnd}
                  aria-roledescription={many ? "slide" : undefined}
                  aria-label={many ? t("slideOf", { current: index + 1, total: slides.length }) : undefined}
                >
                  <SlideImage slide={slide} />
                </motion.div>
              </AnimatePresence>

            </div>

            {/* controls sit under the image so they never cover its text */}
            {many && (
              <div className="mt-4 flex items-center justify-center gap-4">
                <ArrowButton side="left" label={t("previous")} onClick={() => go(-1)} />
                <div className="flex items-center gap-2">
                  {slides.map((s, i) => (
                    <button
                      key={s.id}
                      type="button"
                      aria-label={t("slideOf", { current: i + 1, total: slides.length })}
                      aria-current={i === index ? "true" : undefined}
                      onClick={() => {
                        setDirection(i > index ? 1 : -1);
                        setIndex(i);
                      }}
                      className={clsx(
                        "h-2.5 rounded-full transition-all duration-300",
                        i === index ? "w-8 bg-amber" : "w-2.5 bg-white/50 hover:bg-white",
                      )}
                    />
                  ))}
                </div>
                <ArrowButton side="right" label={t("next")} onClick={() => go(1)} />
              </div>
            )}

            <button
              type="button"
              onClick={close}
              aria-label={t("close")}
              className="absolute -top-3 -right-3 z-20 grid size-11 place-items-center rounded-xl bg-amber text-navy-deep shadow-lg transition-transform duration-200 hover:scale-105 sm:-top-4 sm:-right-4"
            >
              <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SlideImage({ slide }: { slide: PromoPopupSlide }) {
  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={optimizedImageUrl(slide.src, 1080)}
      alt={slide.alt}
      draggable={false}
      className="size-full object-contain select-none"
    />
  );
  if (!slide.link) return img;
  const external = /^https?:\/\//.test(slide.link);
  return (
    <a
      href={slide.link}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      draggable={false}
      className="block size-full"
    >
      {img}
    </a>
  );
}

function ArrowButton({ side, label, onClick }: { side: "left" | "right"; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-11 place-items-center rounded-full border border-white/25 bg-white/10 text-white transition-colors hover:border-amber hover:bg-amber hover:text-navy-deep"
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d={side === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
      </svg>
    </button>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";
import translations from "@/app/i18n/translations";
import { trackWhatsAppClick } from "@/app/lib/tracking";
import { WhatsAppIcon } from "@/app/components/icons";
import { COPY, HERO_SLIDES, pick, whatsappLink } from "../_lib/content";
import { scrollToId } from "../_lib/motion";
import { Arrow } from "./ui";
import HeroFinder, { type FinderDoctor } from "./HeroFinder";

const SLIDE_MS = 7000;


export default function Hero({ isRtl, doctors }: { isRtl: boolean; doctors?: FinderDoctor[] }) {
  const t = translations[isRtl ? "ar" : "en"];
  const [current, setCurrent] = useState(0);
  const [previous, setPrevious] = useState(-1);
  const [intro, setIntro] = useState(true);

  const go = (i: number) => {
    const next = (i + HERO_SLIDES.length) % HERO_SLIDES.length;
    if (next === current) return;
    setIntro(false);
    setPrevious(current);
    setCurrent(next);
  };

  // Auto-advance; restarting the timer on every change keeps a manual pick
  // on screen for a full cycle. Held still for reduced motion.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => go(current + 1), SLIDE_MS);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  return (
    <section data-hero="" className="relative min-h-[720px] h-[100svh] max-h-[1040px] text-white overflow-hidden bg-ink" aria-roledescription="carousel">
      {/* Photography — crossfading stack, Ken Burns on the active frame (desktop) */}
      <div data-hero-media="" className="absolute inset-0 -bottom-[12%]">
        {HERO_SLIDES.map((s, i) => (
          <div key={s.image} className={`hero-slide absolute inset-0 ${i === current ? "is-active" : ""}`} aria-hidden={i !== current}>
            <div className="kenburns absolute inset-0">
              <Image src={s.image} alt={pick(s.alt, isRtl)} fill sizes="100vw" quality={78} preload={i === 0} loading={i === 0 ? undefined : "lazy"} className="object-cover object-[center_55%]" />
            </div>
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/25 to-ink/90" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/50 via-transparent to-transparent rtl:bg-gradient-to-l" aria-hidden="true" />

      <div data-hero-copy="" className="relative h-full max-w-[1440px] mx-auto px-5 sm:px-10 pt-28 pb-7 flex flex-col">
        <div className="flex-1 flex flex-col justify-center">
          <p className="fade-up eyebrow text-white/75" style={{ "--d": "150ms" } as CSSProperties}>
            {pick(COPY.heroEyebrow, isRtl)}
          </p>

          {/* All three headlines share one grid cell, so the block never
              changes height as they swap. */}
          <div className="grid mt-6" aria-live="polite">
            {HERO_SLIDES.map((s, i) => {
              const state = i === current ? "is-active" : i === previous ? "is-exit" : "";
              const [l1, l2] = isRtl ? s.lines.ar : s.lines.en;
              return (
                <div
                  key={i}
                  className={`hero-copy [grid-area:1/1] ${state}`}
                  data-intro={intro && i === current ? "" : undefined}
                  aria-hidden={i !== current}
                >
                  {i === 0 ? (
                    <h1 className="hero-title display leading-[.92] max-w-[1150px]">
                      <span className="ln"><span style={{ "--i": 0 } as CSSProperties}>{l1}</span></span>
                      <span className="ln"><span style={{ "--i": 1 } as CSSProperties} className="text-white/60">{l2}</span></span>
                    </h1>
                  ) : (
                    <p className="hero-title display leading-[.92] max-w-[1150px]">
                      <span className="ln"><span style={{ "--i": 0 } as CSSProperties}>{l1}</span></span>
                      <span className="ln"><span style={{ "--i": 1 } as CSSProperties} className="text-white/60">{l2}</span></span>
                    </p>
                  )}
                  <p className="hero-sub mt-6 max-w-[540px] text-base sm:text-lg text-white/80 leading-relaxed">{pick(s.sub, isRtl)}</p>
                </div>
              );
            })}
          </div>

          <div className="fade-up mt-9 flex flex-col sm:flex-row gap-3" style={{ "--d": "800ms" } as CSSProperties}>
            <button type="button" onClick={() => scrollToId("booking")} data-magnetic="" className="btn btn-light inline-flex items-center justify-between gap-6 rounded-full ps-6 pe-1.5 py-1.5 text-sm font-semibold w-fit cursor-pointer">
              {t.requestAppointment}
              <span className="arrow w-10 h-10 rounded-full bg-primary text-white grid place-items-center">
                <Arrow />
              </span>
            </button>
            <a
              href={whatsappLink(isRtl)}
              onClick={trackWhatsAppClick}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost on-dark btn-wa inline-flex items-center gap-2.5 rounded-full px-6 py-4 text-sm w-fit border-white/40"
            >
              <WhatsAppIcon className="text-[18px]" />
              {t.whatsappUs}
            </a>
          </div>
        </div>

        {/* Quick doctor finder → /find-doctor with the filters applied */}
        <HeroFinder isRtl={isRtl} doctors={doctors} />

        {/* Slide index + progress, status line */}
        <div className="fade-up mt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-white/70" style={{ "--d": "1200ms" } as CSSProperties}>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-glow pulse" />
            {pick(COPY.heroStatus, isRtl)}
          </span>
          <div className="flex items-center gap-3" role="tablist" aria-label={isRtl ? "شرائح العرض" : "Hero slides"}>
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === current}
                aria-label={`${i + 1} / ${HERO_SLIDES.length}`}
                onClick={() => go(i)}
                className="group flex items-center gap-2 py-2 cursor-pointer"
              >
                <span className={`tabular-nums transition-opacity ${i === current ? "opacity-100" : "opacity-50 group-hover:opacity-80"}`}>{String(i + 1).padStart(2, "0")}</span>
                <span
                  key={`${i}-${current}`}
                  className={`hero-bar block h-px w-8 sm:w-14 bg-white/25 overflow-hidden ${i === current ? "is-active" : i < current ? "is-done" : ""}`}
                  style={{ "--dur": `${SLIDE_MS}ms` } as CSSProperties}
                >
                  <span className="block h-full w-full bg-white" />
                </span>
              </button>
            ))}
          </div>
          <span className="hidden md:flex items-center gap-3">
            {pick(COPY.scrollHint, isRtl)}
            <span className="relative block w-px h-7 bg-white/25 overflow-hidden">
              <span className="scroll-cue absolute inset-0 bg-white" />
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}

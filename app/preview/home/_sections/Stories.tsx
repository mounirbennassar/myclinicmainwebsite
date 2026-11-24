"use client";

import { useEffect, useState, type CSSProperties } from "react";
import translations from "@/app/i18n/translations";
import { COPY, pick } from "../_lib/content";
import { Arrow, Lines } from "./ui";

const DURATION = 7000;
const unquote = (s: string) => s.replace(/^["“]|["”]$/g, "");

export default function Stories({ isRtl }: { isRtl: boolean }) {
  const t = translations[isRtl ? "ar" : "en"];
  const stories = [
    { quote: unquote(t.testimonial1), name: "Modi Abdullah", initials: "MA" },
    { quote: unquote(t.testimonial2), name: "Lina JI", initials: "LJ" },
    { quote: unquote(t.testimonial3), name: "Raghad Al-Ghamdi", initials: "RA" },
  ];
  const [current, setCurrent] = useState(0);
  // Bumped on every change so the progress bars restart their CSS animation.
  const [cycle, setCycle] = useState(0);

  const show = (i: number) => {
    setCurrent((i + stories.length) % stories.length);
    setCycle((c) => c + 1);
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => show(current + 1), DURATION);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, cycle]);

  return (
    <section id="stories" className="max-w-[1440px] mx-auto px-5 sm:px-10 py-24 sm:py-36">
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-6">
        <div className="lg:col-span-4 flex flex-col">
          <p data-rv="" className="rv eyebrow text-primary mb-5">{t.testimonials}</p>
          <Lines lines={isRtl ? COPY.storiesTitle.ar : COPY.storiesTitle.en} className="text-[2.75rem] sm:text-6xl leading-[.95]" />
          <div data-rv="" className="rv mt-10 rounded-2xl bg-mist p-6 flex items-center gap-5 w-fit" style={{ "--d": "150ms" } as CSSProperties}>
            <p className="display text-5xl" dir="ltr">4.9</p>
            <div>
              <div className="flex gap-0.5 text-primary" aria-label={isRtl ? "4.9 من 5" : "Rated 4.9 out of 5"}>
                {[0, 1, 2, 3, 4].map((s) => (
                  <svg key={s} viewBox="0 0 20 20" className="w-4 h-4 fill-current" aria-hidden="true">
                    <path d="m10 1.5 2.6 5.6 6.1.7-4.5 4.2 1.2 6L10 15l-5.4 3 1.2-6L1.3 7.8l6.1-.7L10 1.5Z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-ink-muted mt-1">{pick(COPY.ratingLabel, isRtl)}</p>
            </div>
          </div>
          <div className="mt-auto pt-10 hidden lg:flex gap-2">
            <button type="button" onClick={() => show(current - 1)} aria-label={pick(COPY.prev, isRtl)} className="w-12 h-12 rounded-full border border-ink/20 grid place-items-center hover:bg-ink hover:text-white transition-colors duration-500 cursor-pointer">
              <Arrow className="w-4 h-4 rotate-180" />
            </button>
            <button type="button" onClick={() => show(current + 1)} aria-label={pick(COPY.next, isRtl)} className="w-12 h-12 rounded-full bg-primary text-white grid place-items-center hover:bg-ink transition-colors duration-500 cursor-pointer">
              <Arrow />
            </button>
          </div>
        </div>

        <div data-rv="" className="rv lg:col-span-7 lg:col-start-6" style={{ "--d": "150ms" } as CSSProperties}>
          {/* Slides share one grid cell: the stage is as tall as the longest
              quote, so nothing below shifts as they rotate. */}
          <div className="grid" aria-live="polite">
            {stories.map((s, i) => (
              <figure key={i} className={`quote-slide ${i === current ? "active" : ""}`} aria-hidden={i !== current}>
                <span className="display text-primary text-8xl leading-none block h-12" aria-hidden="true">
                  {isRtl ? "”" : "“"}
                </span>
                <blockquote className="display text-[1.9rem] sm:text-[2.7rem] leading-[1.15] text-pretty mt-4">{s.quote}</blockquote>
                <figcaption className="mt-10 flex items-center gap-4">
                  <span className="w-12 h-12 rounded-full bg-ink text-white grid place-items-center text-sm font-semibold" dir="ltr">
                    {s.initials}
                  </span>
                  <span>
                    <span className="block font-semibold" dir="ltr">
                      {s.name}
                    </span>
                    <span className="block text-sm text-ink-muted">{t.googleReview}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-12 grid grid-cols-3 gap-3" role="tablist" aria-label={isRtl ? "اختر تجربة" : "Choose a story"}>
            {stories.map((s, i) => (
              <button
                key={`${i}-${cycle}`}
                type="button"
                role="tab"
                aria-selected={i === current}
                onClick={() => show(i)}
                className={`t-dot text-start group cursor-pointer ${i === current ? "active" : i < current ? "done" : ""}`}
                style={{ "--dur": `${DURATION}ms` } as CSSProperties}
              >
                <span className="block h-0.5 bg-ink/10 rounded-full overflow-hidden">
                  <span className="bar block h-full bg-primary" />
                </span>
                <span className="hidden sm:block text-xs text-ink-muted mt-3 group-hover:text-ink transition-colors">
                  {s.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

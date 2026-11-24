"use client";

import type { CSSProperties } from "react";
import translations, { type TranslationKey } from "@/app/i18n/translations";
import { specKeys } from "@/app/lib/specialties";
import { COPY, pick } from "../_lib/content";
import { CountUp } from "./ui";
import { BrandMark } from "./BrandMark";

/** Facts strip under the hero. The doctor figure is the live roster size. */
export function Stats({ isRtl, doctorCount }: { isRtl: boolean; doctorCount: number }) {
  // Round the roster down to a clean "N+" (312 → 300+) so the figure stays
  // true as doctors join or leave; fall back to the site-wide "100+" claim.
  const doctors = doctorCount >= 20 ? Math.floor(doctorCount / 10) * 10 : 100;
  const items = [
    { value: specKeys.length, suffix: "+", label: COPY.statSpecialties },
    { value: doctors, suffix: "+", label: COPY.statDoctors },
    { value: 6, suffix: "", label: COPY.statBranches },
    { value: 5000, suffix: "+", label: COPY.statPatients },
  ];
  return (
    <section className="border-b border-ink/10 bg-paper" aria-label={isRtl ? "عيادتي بالأرقام" : "My Clinic at a glance"}>
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 grid grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <div
            key={i}
            data-rv=""
            className={`rv py-10 lg:py-14 ${i % 2 === 0 ? "pe-6 border-e" : "ps-6"} lg:px-8 lg:first:ps-0 ${i < 3 ? "lg:border-e" : "lg:border-e-0"} ${i >= 2 ? "border-t lg:border-t-0" : ""} border-ink/10`}
            style={{ "--d": `${i * 100}ms` } as CSSProperties}
          >
            <p className="display text-4xl sm:text-6xl">
              <CountUp to={it.value} suffix={it.suffix} />
            </p>
            <p className="text-sm text-ink-muted mt-3">{pick(it.label, isRtl)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * One row of labels separated by the brand flower, drifting at a steady pace.
 * Pure CSS (compositor-driven), so it stays smooth even while the main thread
 * is busy. The row is rendered twice back to back and slid by -50% for a
 * seamless loop; Arabic runs the other way, as Arabic tickers read.
 */
function MarqueeRow({ items, textClass, markClass }: { items: string[]; textClass: string; markClass: string }) {
  return (
    <>
      {[0, 1].map((copy) => (
        <div key={copy} className="flex h-full shrink-0 items-center">
          {items.map((n, i) => (
            <span key={i} className="flex h-full items-center">
              <span dir="auto" className={`display whitespace-nowrap px-6 sm:px-9 leading-none ${textClass}`}>
                {n}
              </span>
              <BrandMark className={`w-[0.62em] h-[0.62em] shrink-0 ${markClass}`} />
            </span>
          ))}
        </div>
      ))}
    </>
  );
}

export function Ticker({ isRtl }: { isRtl: boolean }) {
  const t = translations[isRtl ? "ar" : "en"];
  const names = specKeys.map((k) => t[`spec.${k}` as TranslationKey] as string);
  return (
    <section className="py-12 sm:py-16 overflow-hidden bg-paper border-b border-ink/10" aria-hidden="true">
      <div dir="ltr" className="marquee ticker-mask overflow-hidden text-[clamp(1.7rem,3.4vw,3rem)]">
        <div className={`marquee-track flex w-max ${isRtl ? "reverse" : ""}`} style={{ "--dur": "90s" } as CSSProperties}>
          <MarqueeRow items={names} textClass="text-ink" markClass="text-primary" />
        </div>
      </div>
    </section>
  );
}

/**
 * A transparent ticker laid ON the seam between a light section and the dark
 * one below it. The band is centred on the seam, and the row is drawn twice:
 * a navy copy clipped to the top half (over the light section) and a white
 * copy clipped to the bottom half (over the dark one), so every word changes
 * colour exactly where the backgrounds meet. Both copies live inside the one
 * moving track, so they can never drift apart.
 */
export function SeamTicker({ items, isRtl, reverse = false }: { items: string[]; isRtl: boolean; reverse?: boolean }) {
  // Repeat short lists so one copy of the row is always wider than the screen.
  const row = Array.from({ length: Math.max(1, Math.ceil(10 / items.length)) }, () => items).flat();
  const goesRight = isRtl !== reverse;
  return (
    <div className="relative z-20 h-0 pointer-events-none select-none" aria-hidden="true">
      <div dir="ltr" className="seam-band absolute inset-x-0 top-0 -translate-y-1/2 h-20 sm:h-28 overflow-hidden text-[clamp(2.2rem,5.2vw,4.6rem)]">
        <div className={`marquee-track relative flex w-max h-full ${goesRight ? "reverse" : ""}`} style={{ "--dur": "55s" } as CSSProperties}>
          <div className="flex h-full [clip-path:inset(0_0_50%_0)]">
            <MarqueeRow items={row} textClass="text-primary" markClass="text-primary/80" />
          </div>
          <div className="absolute inset-0 flex h-full [clip-path:inset(50%_0_0_0)]">
            <MarqueeRow items={row} textClass="text-white" markClass="text-glow" />
          </div>
        </div>
      </div>
    </div>
  );
}

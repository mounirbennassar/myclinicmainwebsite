"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import translations from "@/app/i18n/translations";
import { COPY, EXPERIENCE_POINTS, pick } from "../_lib/content";
import { Lines } from "./ui";

const NUMERALS = ["i.", "ii.", "iii."];

export default function Experience({ isRtl }: { isRtl: boolean }) {
  const t = translations[isRtl ? "ar" : "en"];
  return (
    <section id="experience" className="bg-paper border-t border-ink/10 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 py-24 sm:py-36 grid lg:grid-cols-12 gap-14 lg:gap-6">
        <div className="lg:col-span-5">
          <p data-rv="" className="rv eyebrow text-primary mb-5">{pick(COPY.expEyebrow, isRtl)}</p>
          <Lines lines={isRtl ? COPY.expTitle.ar : COPY.expTitle.en} className="text-[2.75rem] sm:text-6xl lg:text-7xl leading-[.95]" />
          <p data-rv="" className="rv mt-7 text-ink-muted leading-7 max-w-[460px]" style={{ "--d": "120ms" } as CSSProperties}>
            {t.slide2Subtitle}
          </p>
          <div className="mt-10 flex flex-col">
            {EXPERIENCE_POINTS.map((p, i) => (
              <div
                key={i}
                data-rv=""
                className={`rv group py-6 border-t border-ink/15 flex gap-6 ${i === EXPERIENCE_POINTS.length - 1 ? "border-b" : ""}`}
                style={{ "--d": `${200 + i * 110}ms` } as CSSProperties}
              >
                <span className="text-xs text-primary pt-1.5 w-6 shrink-0 font-semibold" dir="ltr">
                  {NUMERALS[i]}
                </span>
                <div>
                  <h3 className="font-semibold text-lg transition-transform duration-500 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">{pick(p.title, isRtl)}</h3>
                  <p className="text-sm text-ink-muted mt-1.5 leading-6">{pick(p.body, isRtl)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7 relative">
          <div data-rv="" className="clip-rv relative rounded-[28px] overflow-hidden aspect-[4/5] sm:aspect-square">
            <div data-parallax="9" className="absolute inset-x-0 -top-[10%] h-[120%]">
              <Image src="/clinic/nurse-station.jpg" alt={isRtl ? "منسقة رعاية تستقبل المراجعين في محطة التمريض" : "A care coordinator welcoming patients at the nurse station"} fill sizes="(max-width: 1024px) 100vw, 50vw" quality={78} className="object-cover" />
            </div>
          </div>

          {/* Floating facts — drift at their own speed on desktop (ScrollSmoother effects) */}
          {/* data-speed lives on a bare wrapper: the smoother writes its
              transform every frame, and the .rv transition on the card itself
              would otherwise smear that into lag. */}
          <div data-speed="1.12" className="absolute -bottom-8 start-5 sm:-start-10 z-10">
          <div data-rv="" className="rv bg-ink text-white rounded-2xl p-6 w-[270px] shadow-2xl shadow-ink/25" style={{ "--d": "350ms" } as CSSProperties}>
            <p className="eyebrow text-[10px] text-white/60">{t.multispecialtyCare}</p>
            <p className="display text-5xl mt-3">
              27<span className="text-xl text-white/60">+</span>
            </p>
            <p className="text-sm text-white/70 mt-2">{t.specialtiesLabel}</p>
            <div className="mt-4 h-1 rounded-full bg-white/15 overflow-hidden">
              <div className="h-full w-[82%] bg-glow rounded-full" />
            </div>
          </div>
          </div>
          <div data-speed="0.92" className="absolute top-8 end-5 sm:-end-6 z-10 hidden sm:block">
          <div data-rv="" className="rv bg-white rounded-2xl p-5 w-[240px] shadow-xl shadow-ink/10" style={{ "--d": "500ms" } as CSSProperties}>
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-mist text-primary grid place-items-center shrink-0">
                <span className="material-symbols-outlined text-[20px]" aria-hidden="true">verified</span>
              </span>
              <p className="font-semibold text-sm leading-snug">{t.freeValetParking}</p>
            </div>
            <p className="text-xs text-ink-muted mt-3 leading-5">{t.valetParkingDesc}</p>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}

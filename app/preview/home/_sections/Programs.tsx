"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { COPY, PROGRAMS, pick } from "../_lib/content";
import { Arrow, Lines } from "./ui";

/**
 * Centers of care. Desktop: the section pins and the cards travel sideways as
 * you scroll (motion.ts §6). Below 1024px — or with reduced motion — it is a
 * plain swipeable snap row.
 */
export default function Programs({ isRtl }: { isRtl: boolean }) {
  return (
    <section data-hscroll="" id="programs" className="relative bg-ink text-white overflow-hidden lg:h-[100svh] lg:min-h-[680px] lg:max-h-[1000px] flex flex-col py-20 lg:py-0">
      <div className="max-w-[1440px] w-full mx-auto px-5 sm:px-10 lg:pt-24 flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 lg:mb-12">
        <div>
          <p data-rv="" className="rv eyebrow text-glow mb-5">{pick(COPY.progEyebrow, isRtl)}</p>
          <Lines lines={isRtl ? COPY.progTitle.ar : COPY.progTitle.en} className="text-[2.75rem] sm:text-6xl lg:text-7xl leading-[.95]" />
        </div>
        <div data-rv="" className="rv flex flex-col gap-6 max-w-[380px]" style={{ "--d": "150ms" } as CSSProperties}>
          <p className="text-white/65 leading-7">{pick(COPY.progDesc, isRtl)}</p>
          <div className="hidden lg:flex items-center gap-4 text-xs text-white/55">
            <span className="tabular-nums">01</span>
            <span className="relative flex-1 h-px bg-white/15 overflow-hidden">
              {/* GSAP owns this transform — no Tailwind scale-* here, it would
                  multiply with (and pin at) the inline value. */}
              <span data-hscroll-bar="" className="absolute inset-0 bg-white origin-left rtl:origin-right" style={{ transform: "scaleX(0)" }} />
            </span>
            <span className="tabular-nums">{String(PROGRAMS.length).padStart(2, "0")}</span>
          </div>
        </div>
      </div>

      <div className="hscroll-viewport flex-1 min-h-0 lg:pb-16">
        <div data-hscroll-track="" className="flex gap-4 sm:gap-5 w-max h-full px-5 sm:px-10 lg:ps-[max(2.5rem,calc((100vw-1440px)/2+2.5rem))] lg:pe-10">
          {PROGRAMS.map((p, i) => (
            <Link
              key={p.href}
              href={p.href}
              className="prog-card group relative shrink-0 w-[82vw] sm:w-[58vw] lg:w-[min(36vw,520px)] h-[460px] sm:h-[520px] lg:h-full lg:max-h-[600px] rounded-[28px] overflow-hidden bg-white/5"
            >
              <Image src={p.image} alt={pick(p.alt, isRtl)} fill sizes="(max-width: 640px) 82vw, (max-width: 1024px) 58vw, 520px" quality={75} className="prog-img object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/5" />
              <div className="absolute top-6 inset-x-6 flex items-center justify-between">
                <span className="rounded-full border border-white/25 bg-ink/40 px-3 py-1.5 text-[11px]">{pick(p.tag, isRtl)}</span>
                <span className="display text-white/60 text-sm tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <span className="block h-1 w-12 rounded-full mb-5 transition-all duration-700 group-hover:w-24" style={{ background: p.accent }} />
                <h3 className="display text-[2rem] sm:text-[2.6rem] leading-[1.02]">{pick(p.name, isRtl)}</h3>
                <p className="mt-4 text-sm sm:text-[15px] text-white/75 leading-6 sm:leading-7 max-w-[440px] line-clamp-4">{pick(p.desc, isRtl)}</p>
                <span className="mt-6 inline-flex items-center gap-3 text-sm font-medium">
                  {pick(COPY.explore, isRtl)}
                  <span className="arrow-hover w-10 h-10 rounded-full bg-white text-ink grid place-items-center group-hover:bg-primary group-hover:text-white">
                    <Arrow />
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

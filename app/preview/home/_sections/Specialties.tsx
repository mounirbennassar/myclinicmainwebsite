"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import translations, { type TranslationKey } from "@/app/i18n/translations";
import { featuredFilterOrder, keyToDoctorFilter, specIcons, specKeys, specNameToKey, type SpecKey } from "@/app/lib/specialties";
import { COPY, SPECIALTY_PAGES, pick } from "../_lib/content";
import { refreshScroll, scrollToId } from "../_lib/motion";
import { Arrow, SectionHead } from "./ui";

const INITIAL = 6;

// Patient-demand order (the clinic's promoted list), then everything else.
const featuredKeys = featuredFilterOrder.map((n) => specNameToKey[n]).filter(Boolean) as SpecKey[];
const ORDERED: SpecKey[] = [...new Set<SpecKey>([...featuredKeys, ...specKeys])];
const iconFor = (k: SpecKey) => specIcons[specKeys.indexOf(k)];
const hrefFor = (k: SpecKey) => SPECIALTY_PAGES[k] ?? `/find-doctor?spec=${encodeURIComponent(keyToDoctorFilter[k])}`;

export default function Specialties({ isRtl }: { isRtl: boolean }) {
  const t = translations[isRtl ? "ar" : "en"];
  const [open, setOpen] = useState(false);

  const toggle = () => {
    setOpen((v) => !v);
    // The page gets taller/shorter — re-measure every trigger after the
    // collapse transition, then bring the list back into view on close.
    refreshScroll(850);
    if (open) window.setTimeout(() => scrollToId("specialties"), 60);
  };

  const row = (k: SpecKey, i: number, extra: boolean) => (
    <Link
      key={k}
      href={hrefFor(k)}
      data-rv={extra ? undefined : ""}
      className={`spec-card group relative grid grid-cols-[auto_1fr_auto] md:grid-cols-[72px_64px_1.1fr_1fr_auto] items-center gap-4 sm:gap-6 py-6 sm:py-7 border-b border-ink/15 ${extra ? "stagger" : "rv"}`}
      style={{ "--d": `${extra ? (i - INITIAL) * 45 + 120 : (i % INITIAL) * 70}ms` } as CSSProperties}
    >
      <span className="hidden md:block text-xs text-ink-muted tabular-nums">{String(i + 1).padStart(2, "0")}</span>
      {/* aria-hidden sits on the wrapper: scripts/check-icon-subset.mjs reads
          quoted attributes beside an icon expression as icon names. */}
      <span className="spec-icon w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-mist text-primary grid place-items-center" aria-hidden="true">
        <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
          {iconFor(k)}
        </span>
      </span>
      <h3 className="display text-[1.55rem] sm:text-4xl leading-tight">{t[`spec.${k}` as TranslationKey]}</h3>
      <p className="hidden md:block text-sm text-ink-muted">{t[`specDesc.${k}` as TranslationKey]}</p>
      <span className="spec-arrow w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-ink/15 grid place-items-center">
        <Arrow />
      </span>
      <span className="spec-line absolute inset-x-0 -bottom-px h-px bg-primary" aria-hidden="true" />
    </Link>
  );

  return (
    <section id="specialties" className="max-w-[1440px] mx-auto px-5 sm:px-10 py-24 sm:py-36">
      <SectionHead
        className="mb-14 sm:mb-20"
        eyebrow={pick(COPY.specEyebrow, isRtl)}
        lines={isRtl ? COPY.specTitle.ar : COPY.specTitle.en}
        side={<p className="text-ink-muted leading-7 max-w-[420px]">{t.comprehensiveCareDesc}</p>}
      />

      <div className="border-t border-ink/15">{ORDERED.slice(0, INITIAL).map((k, i) => row(k, i, false))}</div>
      <div className={`collapse ${open ? "open" : ""}`} id="spec-more">
        <div inert={!open}>{ORDERED.slice(INITIAL).map((k, i) => row(k, i + INITIAL, true))}</div>
      </div>

      <div data-rv="" className="rv mt-12 flex justify-center">
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-controls="spec-more"
          data-magnetic=""
          className="more-btn btn btn-ghost on-light inline-flex items-center gap-4 rounded-full ps-7 pe-2 py-2 text-sm text-ink cursor-pointer"
        >
          <span className="label">
            <span>{pick(COPY.specMore, isRtl)}</span>
            <span>{pick(COPY.specLess, isRtl)}</span>
          </span>
          <span className="w-10 h-10 rounded-full bg-primary text-white grid place-items-center">
            <span className="plus" aria-hidden="true" />
          </span>
        </button>
      </div>
    </section>
  );
}

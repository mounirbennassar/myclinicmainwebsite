"use client";

import type { CSSProperties } from "react";
import translations, { type TranslationKey } from "@/app/i18n/translations";
import { specKeys } from "@/app/lib/specialties";
import { COPY, pick } from "../_lib/content";
import { CountUp } from "./ui";

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

/** Two counter-drifting bands of specialty names; speed follows scroll velocity. */
export function Ticker({ isRtl }: { isRtl: boolean }) {
  const t = translations[isRtl ? "ar" : "en"];
  const names = specKeys.map((k) => t[`spec.${k}` as TranslationKey] as string);
  const rowA = names.slice(0, 14);
  const rowB = names.slice(14);
  const row = (list: string[], outlined: boolean) => (
    // Each band is forced LTR so the -50% loop maths is direction-agnostic;
    // every label inside still renders in its own script direction.
    <div dir="ltr" className="ticker-mask overflow-hidden">
      <div data-ticker="" className="flex w-max will-change-transform">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
            {list.map((n, i) => (
              <span key={i} className="flex items-center">
                <span dir="auto" className={`display whitespace-nowrap px-6 sm:px-10 text-[2.6rem] sm:text-[4.5rem] leading-[1.15] ${(i + (outlined ? 1 : 0)) % 2 ? "outline-text" : "text-ink"}`}>
                  {n}
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-primary/70 shrink-0" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <section className="py-12 sm:py-20 overflow-hidden bg-paper" aria-hidden="true">
      <div className="flex flex-col gap-2 sm:gap-4 -rotate-2 scale-[1.04]">
        {row(rowA, false)}
        {row(rowB, true)}
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import translations, { type TranslationKey } from "@/app/i18n/translations";
import { COPY, SERVICES, pick } from "../_lib/content";
import { refreshScroll, scrollToId } from "../_lib/motion";
import { Arrow, SectionHead } from "./ui";

const INITIAL = 3;

export default function Services({ isRtl }: { isRtl: boolean }) {
  const t = translations[isRtl ? "ar" : "en"];
  const [open, setOpen] = useState(false);

  const toggle = () => {
    setOpen((v) => !v);
    refreshScroll(850);
    if (open) window.setTimeout(() => scrollToId("services"), 60);
  };

  const card = (s: (typeof SERVICES)[number], i: number, extra: boolean) => {
    const title = t[`svc.${s.key}` as TranslationKey] as string;
    const desc = t[`svc.${s.key}Desc` as TranslationKey] as string;
    const inner = (
      <>
        <div data-zoom-in="" className="absolute inset-0">
          <Image src={s.image} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" quality={75} className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />
        <span className="absolute top-5 start-5 rounded-full bg-ink/45 border border-white/20 px-3 py-1.5 text-[11px]">{pick(s.tag, isRtl)}</span>
        <span className="arrow-hover absolute top-5 end-5 w-11 h-11 rounded-full bg-white text-ink grid place-items-center group-hover:bg-primary group-hover:text-white">
          <Arrow />
        </span>
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
          <h3 className="display text-[1.75rem] sm:text-[2rem] leading-tight">{title}</h3>
          <p className="svc-desc text-sm text-white/80 leading-6 mt-2 overflow-hidden">{desc}</p>
        </div>
      </>
    );
    const cls = `svc-card zoom group relative block rounded-[24px] overflow-hidden aspect-[4/5] sm:aspect-[4/4.6] bg-ink text-white text-start ${extra ? "stagger" : "rv"}`;
    const style = { "--d": `${extra ? (i - INITIAL) * 110 + 180 : i * 110}ms` } as CSSProperties;
    return s.href ? (
      <Link key={s.key} href={s.href} data-rv={extra ? undefined : ""} className={cls} style={style}>
        {inner}
      </Link>
    ) : (
      <button key={s.key} type="button" onClick={() => scrollToId("booking")} data-rv={extra ? undefined : ""} className={`${cls} w-full cursor-pointer`} style={style}>
        {inner}
      </button>
    );
  };

  return (
    <section id="services" className="bg-mist py-24 sm:py-32">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10">
        <SectionHead
          className="mb-14"
          eyebrow={t.beyondMedicalCare}
          lines={isRtl ? COPY.svcTitle.ar : COPY.svcTitle.en}
          side={<p className="text-ink-muted leading-7 max-w-[400px]">{pick(COPY.svcDesc, isRtl)}</p>}
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{SERVICES.slice(0, INITIAL).map((s, i) => card(s, i, false))}</div>
        <div className={`collapse ${open ? "open" : ""}`} id="svc-more">
          <div inert={!open}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">{SERVICES.slice(INITIAL).map((s, i) => card(s, i + INITIAL, true))}</div>
          </div>
        </div>

        <div data-rv="" className="rv mt-12 flex justify-center">
          <button
            type="button"
            onClick={toggle}
            aria-expanded={open}
            aria-controls="svc-more"
            data-magnetic=""
            className="more-btn btn btn-primary inline-flex items-center gap-4 rounded-full ps-7 pe-2 py-2 text-sm cursor-pointer"
          >
            <span className="label">
              <span>{pick(COPY.svcMore, isRtl)}</span>
              <span>{pick(COPY.specLess, isRtl)}</span>
            </span>
            <span className="w-10 h-10 rounded-full bg-white/15 grid place-items-center">
              <span className="plus" aria-hidden="true" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

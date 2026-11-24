"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { useLang } from "@/app/i18n/context";
import { NAV_LINKS } from "@/app/components/SiteNav";
import { trackPhoneClick } from "@/app/lib/tracking";
import { COPY, PHONE_DISPLAY, PHONE_TEL, pick } from "../_lib/content";
import { scrollToId, scrollToTop } from "../_lib/motion";
import { Arrow } from "./ui";

// The home link is this page; everything else is a real destination.
const LINKS = NAV_LINKS.filter((l) => l.href !== "/");

export default function Header() {
  const { lang, setLang } = useLang();
  const isRtl = lang === "ar";
  const [open, setOpen] = useState(false);

  // Esc closes the sheet; the page behind stays put while it is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const book = () => {
    setOpen(false);
    scrollToId("booking");
  };

  return (
    <header data-hv2-header="" data-solid="false" data-hidden="false" className={`hv2-header fixed inset-x-0 top-0 z-50 ${open ? "menu-open" : ""}`}>
      <div id="hv2-progress" className="absolute top-0 inset-x-0 h-0.5 bg-primary" aria-hidden="true" />
      <nav className="max-w-[1440px] mx-auto h-[76px] px-5 sm:px-10 flex items-center justify-between gap-6" aria-label={isRtl ? "التنقل الرئيسي" : "Main navigation"}>
        <div className="flex items-center gap-3 shrink-0">
        <button type="button" onClick={scrollToTop} aria-label={isRtl ? "عيادتي — أعلى الصفحة" : "My Clinic — back to top"} className="shrink-0 cursor-pointer">
          {/* eslint-disable-next-line @next/next/no-img-element -- SVG logo, nothing to optimise */}
          <img src="/home-v2/logo-white.svg" alt="My Clinic" width={110} height={40} className="logo-light h-9 sm:h-10 w-auto" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/home-v2/logo-navy.svg" alt="My Clinic" width={110} height={40} className="logo-dark h-9 sm:h-10 w-auto" />
        </button>
        {/* Marks the page as the internal preview so nobody mistakes it for live */}
        <span className="inline-flex items-center gap-1.5 rounded-full border border-current/25 px-2.5 py-1 text-[10px] sm:text-[11px] whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ffb547]" />
          {pick(COPY.previewBadge, isRtl)}
        </span>
        </div>

        <div className="hidden xl:flex items-center gap-8 text-[13.5px]">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link whitespace-nowrap opacity-90 hover:opacity-100">
              {isRtl ? l.ar : l.en}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Language switch */}
          <div className="flex items-center rounded-full border border-current/25 p-0.5 text-[11px] font-semibold" role="group" aria-label="Language">
            {(["en", "ar"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={`w-9 py-1.5 rounded-full cursor-pointer transition-colors duration-300 ${lang === l ? "bg-current/15" : "opacity-60 hover:opacity-100"}`}
              >
                {l === "en" ? "EN" : "ع"}
              </button>
            ))}
          </div>

          <a href={`tel:${PHONE_TEL}`} onClick={trackPhoneClick} dir="ltr" className="hidden 2xl:inline text-[13px] opacity-80 hover:opacity-100 transition-opacity tabular-nums">
            {PHONE_DISPLAY}
          </a>

          <button type="button" onClick={book} data-magnetic="" className="btn btn-primary hidden sm:inline-flex items-center gap-3 rounded-full ps-5 pe-1.5 py-1.5 text-[13px] font-medium cursor-pointer">
            {pick(COPY.bookAppointment, isRtl)}
            <span className="arrow w-8 h-8 rounded-full bg-white/15 grid place-items-center">
              <Arrow className="w-3.5 h-3.5" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="xl:hidden w-11 h-11 grid place-items-center rounded-full cursor-pointer"
            aria-label={open ? (isRtl ? "إغلاق القائمة" : "Close menu") : isRtl ? "فتح القائمة" : "Open menu"}
            aria-expanded={open}
            aria-controls="hv2-menu"
          >
            <span className="relative block w-5 h-3" aria-hidden="true">
              <span className={`absolute inset-x-0 h-px bg-current transition-transform duration-500 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute inset-x-0 h-px bg-current transition-transform duration-500 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile / tablet sheet */}
      <div id="hv2-menu" className={`menu-sheet xl:hidden absolute inset-x-0 top-full h-[calc(100svh-76px)] bg-paper text-ink overflow-y-auto ${open ? "open" : "pointer-events-none"}`} aria-hidden={!open}>
        <div className="px-6 pt-6 pb-10 flex flex-col min-h-full">
          <div className="flex flex-col">
            {LINKS.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
                className="menu-item display text-[2rem] leading-tight py-3 border-b border-ink/10 flex items-center justify-between"
                style={{ "--i": i } as CSSProperties}
              >
                {isRtl ? l.ar : l.en}
                <Arrow className="w-5 h-5 opacity-40" />
              </Link>
            ))}
          </div>
          <div className="menu-item mt-auto pt-10 flex flex-col gap-3" style={{ "--i": LINKS.length } as CSSProperties}>
            <button type="button" tabIndex={open ? 0 : -1} onClick={book} className="btn btn-primary w-full rounded-full py-4 text-sm font-medium cursor-pointer">
              {pick(COPY.bookAppointment, isRtl)}
            </button>
            <a href={`tel:${PHONE_TEL}`} tabIndex={open ? 0 : -1} onClick={trackPhoneClick} dir="ltr" className="btn btn-ghost on-light w-full rounded-full py-4 text-sm text-center">
              {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

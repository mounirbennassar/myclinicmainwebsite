"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "@/app/i18n/context";
import { trackPhoneClick } from "@/app/lib/tracking";
import { NAV_LINKS } from "@/app/components/SiteNav";
import { AR, EN, PHONE_DISPLAY, PHONE_TEL } from "../content";

/**
 * The single navigation bar for /my360.
 *
 * This page deliberately does NOT stack the site header and a section bar — two
 * sticky rows eat 130px of a phone screen and read as clutter. One bar carries
 * the brand lockup, the page's own sections, and the actions; the wider site
 * links live in the mobile sheet and in the footer, the same way /dental works.
 *
 * The active section is tracked on scroll and marked with a shared-layout pill,
 * so the bar always tells you where you are on a long single-page layout.
 */

const SECTION_IDS = ["programs", "why", "team", "calendar", "faq"];

export default function My360Nav({ onJump }: { onJump: (id: string) => void }) {
  const { lang, setLang } = useLang();
  const isRtl = lang === "ar";
  const t = isRtl ? AR : EN;

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const frame = useRef(0);

  // Elevation + scroll-spy share one listener, coalesced into a single rAF so
  // a long page doesn't run layout reads on every scroll event.
  useEffect(() => {
    const measure = () => {
      frame.current = 0;
      setScrolled(window.scrollY > 8);

      // The section whose top has most recently passed under the bar wins.
      let current: string | null = null;
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 96) current = id;
      }
      // Past the last section the page is into the contact block — drop the pill
      // rather than leaving FAQ lit for the rest of the scroll.
      const contact = document.getElementById("my360-contact");
      if (contact && contact.getBoundingClientRect().top <= 96) current = null;
      setActive(current);
    };

    const onScroll = () => {
      if (!frame.current) frame.current = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  const go = (href: string) => {
    setOpen(false);
    onJump(href.slice(1));
  };

  const bookLabel = isRtl ? "احجز الآن" : "Book now";

  return (
    <header
      className={`my360-nav-glass sticky top-0 z-50 border-b transition-shadow duration-300 ${
        scrolled ? "border-[#E3E6EA] shadow-[0_6px_24px_-12px_rgba(0,56,104,0.28)]" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 md:px-8">
        {/* Brand lockup — My Clinic home, then the My360 sub-brand */}
        <div className="flex shrink-0 items-center gap-3">
          <Link href="/" aria-label="My Clinic" className="shrink-0">
            <Image
              src="/myclinic-frame-logo.webp"
              alt="My Clinic"
              width={150}
              height={40}
              className="h-8 w-auto md:h-9"
              preload
            />
          </Link>
          <span className="h-6 w-px bg-[#E3E6EA]" />
          <Image
            src="/my360/my360-logo.png"
            alt="My360"
            width={112}
            height={29}
            className="h-[19px] w-auto md:h-[21px]"
            preload
          />
        </div>

        {/* Sections — desktop */}
        <nav className="ms-auto hidden items-center gap-0.5 lg:flex">
          {t.nav.map((l) => {
            const id = l.href.slice(1);
            const isActive = active === id;
            return (
              <button
                key={l.href}
                onClick={() => go(l.href)}
                aria-current={isActive ? "true" : undefined}
                className={`relative cursor-pointer rounded-full px-3.5 py-2 text-[13.5px] font-semibold transition-colors ${
                  isActive ? "text-[#004d99]" : "text-[#3D434D] hover:text-[#004d99]"
                }`}
              >
                <span className="relative z-10">{l.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="my360-nav-active"
                    className="absolute inset-0 rounded-full bg-[#004d99]/[0.09]"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="ms-auto flex items-center gap-2 lg:ms-3 lg:gap-2.5">
          <div className="flex items-center overflow-hidden rounded-full border border-[#E3E6EA] bg-[#F6F7F8] text-[11px] font-bold">
            <button
              onClick={() => setLang("en")}
              className={`cursor-pointer px-2.5 py-1.5 transition-colors ${
                lang === "en" ? "bg-[#003868] text-white" : "text-[#797C82] hover:text-[#003868]"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("ar")}
              className={`cursor-pointer px-2.5 py-1.5 transition-colors ${
                lang === "ar" ? "bg-[#003868] text-white" : "text-[#797C82] hover:text-[#003868]"
              }`}
            >
              AR
            </button>
          </div>

          <a
            href={`tel:${PHONE_TEL}`}
            onClick={trackPhoneClick}
            className="hidden items-center gap-1.5 text-[13.5px] font-bold text-[#003868] xl:flex"
            dir="ltr"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
            </svg>
            {PHONE_DISPLAY}
          </a>

          <button
            onClick={() => go("#my360-contact")}
            className="hidden cursor-pointer rounded-full bg-[#003868] px-5 py-2.5 text-[13px] font-bold text-white shadow-sm shadow-[#003868]/25 transition-colors hover:bg-[#00294d] active:scale-[0.97] md:inline-flex"
          >
            {bookLabel}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={isRtl ? "القائمة" : "Menu"}
            aria-expanded={open}
            aria-controls="my360-menu"
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#003868]/[0.07] text-[#003868] transition-colors active:bg-[#003868]/15 lg:hidden"
          >
            {/* Bars, animated with transforms. Morphing an SVG `d` between
                "M4 7h16" and "M6 6l12 12" would snap rather than tween —
                Framer Motion can't interpolate paths whose commands differ. */}
            <span className="relative block h-[14px] w-[18px]">
              {[
                { y: 0, rotate: 45 },
                { y: 6, rotate: 0 },
                { y: 12, rotate: -45 },
              ].map((bar, i) => (
                <motion.span
                  key={i}
                  className="absolute inset-x-0 block h-[2px] rounded-full bg-current"
                  style={{ top: bar.y }}
                  animate={
                    open
                      ? i === 1
                        ? { opacity: 0, scaleX: 0.4 }
                        : { y: 6 - bar.y, rotate: bar.rotate }
                      : { opacity: 1, scaleX: 1, y: 0, rotate: 0 }
                  }
                  transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                />
              ))}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile sheet — page sections first, then the rest of the site */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="my360-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-[#E3E6EA] bg-white lg:hidden"
          >
            <motion.div
              initial="closed"
              animate="open"
              variants={{ open: { transition: { staggerChildren: 0.04, delayChildren: 0.04 } } }}
              className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4"
            >
              {t.nav.map((l) => (
                <motion.button
                  key={l.href}
                  variants={{ closed: { opacity: 0, y: -6 }, open: { opacity: 1, y: 0 } }}
                  onClick={() => go(l.href)}
                  className={`cursor-pointer rounded-xl px-4 py-3 text-start text-[15px] font-bold transition-colors ${
                    active === l.href.slice(1)
                      ? "bg-[#004d99]/[0.09] text-[#004d99]"
                      : "text-[#3D434D] active:bg-[#F2F6FA]"
                  }`}
                >
                  {l.label}
                </motion.button>
              ))}

              <motion.div
                variants={{ closed: { opacity: 0 }, open: { opacity: 1 } }}
                className="my-2 h-px bg-[#E3E6EA]"
              />

              {NAV_LINKS.map((l) => (
                <motion.div key={l.href} variants={{ closed: { opacity: 0, y: -6 }, open: { opacity: 1, y: 0 } }}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-[14.5px] font-semibold text-[#797C82] transition-colors active:bg-[#F2F6FA]"
                  >
                    <span className="material-symbols-outlined text-lg">{l.icon}</span>
                    {isRtl ? l.ar : l.en}
                  </Link>
                </motion.div>
              ))}

              <motion.a
                variants={{ closed: { opacity: 0, y: -6 }, open: { opacity: 1, y: 0 } }}
                href={`tel:${PHONE_TEL}`}
                onClick={trackPhoneClick}
                dir="ltr"
                className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-[#003868]/5 py-3 text-[15px] font-bold text-[#003868]"
              >
                {PHONE_DISPLAY}
              </motion.a>
              <motion.button
                variants={{ closed: { opacity: 0, y: -6 }, open: { opacity: 1, y: 0 } }}
                onClick={() => go("#my360-contact")}
                className="cursor-pointer rounded-2xl bg-[#003868] px-4 py-3.5 text-[15px] font-bold text-white active:scale-[0.98]"
              >
                {bookLabel}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

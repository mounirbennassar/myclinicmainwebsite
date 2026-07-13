"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "@/app/i18n/context";
import { trackPhoneClick } from "@/app/lib/tracking";

const PHONE_TEL = "920022811";
const PHONE_DISPLAY = "920 022 811";

// Primary site navigation. Labels are inline (en/ar) so the component is fully
// self-contained — matching the existing DentalNav / KidsNav pattern.
export const NAV_LINKS: { href: string; en: string; ar: string; icon: string }[] = [
  { href: "/", en: "Home", ar: "الرئيسية", icon: "home" },
  { href: "/find-doctor", en: "Find a Doctor", ar: "ابحث عن طبيب", icon: "stethoscope" },
  { href: "/specialties", en: "Specialties", ar: "التخصصات", icon: "medical_services" },
  { href: "/health-homecare", en: "Tele-consultation and Home care", ar: "الاستشارة عن بعد والرعاية المنزلية", icon: "home_health" },
];

export default function SiteNav() {
  const { lang, setLang } = useLang();
  const isRtl = lang === "ar";
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close the mobile menu whenever the route changes.
  useEffect(() => { setOpen(false); }, [pathname]);

  // The sheet is anchored to the sticky header, so it stays put as the page moves —
  // the page is deliberately left scrollable while it's open (client request).

  // Subtle elevation once the user scrolls past the top.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  const label = (l: { en: string; ar: string }) => (isRtl ? l.ar : l.en);
  const ctaLabel = isRtl ? "اطلب موعدك الآن" : "Request Appointment";

  return (
    <header
      className={`sticky top-0 w-full z-50 glass-effect transition-shadow duration-300 ${
        scrolled ? "shadow-clinical border-b border-outline-variant/20" : ""
      }`}
    >
      <div className="flex justify-between items-center gap-4 max-w-7xl mx-auto px-4 md:px-8 py-3">
        {/* Logo */}
        <Link href="/" aria-label="My Clinic — Home" className="shrink-0">
          <Image
            src="/myclinic-frame-logo.webp"
            alt="My Clinic"
            width={170}
            height={46}
            className="h-10 md:h-11 w-auto"
            preload
          />
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative px-3.5 py-2 rounded-full text-sm font-bold transition-colors ${
                  active ? "text-primary" : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {label(link)}
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-full bg-primary/10"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right-side actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Language switcher */}
          <div className="flex items-center bg-surface-container rounded-full overflow-hidden text-[11px] md:text-xs font-bold border border-outline-variant/30">
            <button
              onClick={() => setLang("en")}
              className={`px-2.5 py-1.5 md:px-3 transition-all cursor-pointer ${lang === "en" ? "bg-primary text-white" : "text-on-surface-variant hover:text-primary"}`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("ar")}
              className={`px-2.5 py-1.5 md:px-3 transition-all cursor-pointer ${lang === "ar" ? "bg-primary text-white" : "text-on-surface-variant hover:text-primary"}`}
            >
              AR
            </button>
          </div>

          {/* Phone — desktop only */}
          <a href={`tel:${PHONE_TEL}`} onClick={trackPhoneClick} className="hidden xl:flex items-center gap-2 text-primary font-bold text-sm" dir="ltr">
            <span className="material-symbols-outlined text-lg">call</span>
            {PHONE_DISPLAY}
          </a>

          {/* Book CTA — desktop */}
          <Link
            href="/#booking-form"
            className="hidden md:inline-flex bg-primary hover:bg-primary-container text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 whitespace-nowrap"
          >
            {ctaLabel}
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={isRtl ? "القائمة" : "Menu"}
            aria-expanded={open}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-surface-container text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">{open ? "close" : "menu"}</span>
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="lg:hidden fixed inset-0 top-[64px] z-40 bg-black/30 backdrop-blur-sm"
            />
            <motion.nav
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="lg:hidden absolute top-full inset-x-0 z-50 bg-surface-container-lowest border-t border-outline-variant/20 shadow-clinical"
            >
              <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
                {NAV_LINKS.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-bold transition-colors ${
                        active ? "bg-primary/10 text-primary" : "text-on-surface hover:bg-surface-container"
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl">{link.icon}</span>
                      {label(link)}
                    </Link>
                  );
                })}

                <div className="h-px bg-outline-variant/30 my-3" />

                <a
                  href={`tel:${PHONE_TEL}`}
                  onClick={trackPhoneClick}
                  className="flex items-center justify-center gap-2 text-primary font-bold py-3 rounded-2xl bg-primary/5"
                  dir="ltr"
                >
                  <span className="material-symbols-outlined text-lg">call</span>
                  {PHONE_DISPLAY}
                </a>
                <Link
                  href="/#booking-form"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center bg-primary hover:bg-primary-container text-white py-3.5 rounded-2xl text-base font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
                >
                  {ctaLabel}
                </Link>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

"use client";
import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLang } from "@/app/i18n/context";
import { trackPhoneClick, trackWhatsAppClick } from "@/app/lib/tracking";
import SiteNav from "@/app/components/SiteNav";
import DentalHeroV3 from "./components/DentalHeroV3";
import DentalPromisesScroll from "./components/DentalPromisesScroll";
import DentalVideos from "./components/DentalVideos";
import DentalUnitsGrid from "./components/DentalUnitsGrid";
import dynamic from "next/dynamic";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Below the fold, so still code-split. Rendering on the server keeps the
// dentist names in the HTML for search engines.
const DentalDoctorsStrip = dynamic(() => import("./components/DentalDoctorsStrip"), {
  loading: () => <div className="min-h-[520px]" />,
});
import DentalTestimonials from "./components/DentalTestimonials";
import DentalHoursAndBooking from "./components/DentalHoursAndBooking";
import SiteFooter from "@/app/components/SiteFooter";

const WHATSAPP_LINK = `https://wa.me/966920022811?text=${encodeURIComponent("مرحباً، أود حجز موعد في عيادة الأسنان بعيادتي")}`;

/*
 * Dental hub, design-v2. The visual system comes from the My Clinic design
 * tokens: navy #003868, action blue #004d99, midnight #0b1f3a, tint #F2F6FA,
 * hairline #E3E6EA. Section reveals, counters and parallax are GSAP-driven —
 * one ScrollTrigger.batch over `.dv-reveal` covers this page and the child
 * sections that opt in with the same class.
 */

const GALLERY = [
  { src: "/dental/dentalv2/smile-mirror.webp", ar: "ابتسامة تعكس الثقة", en: "A smile that reflects confidence" },
  { src: "/dental/dentalv2/shade-match.webp", ar: "مطابقة اللون مع ملامح الوجه", en: "Shade-matched to your features" },
  { src: "/dental/dentalv2/model-explain.webp", ar: "تصميم الابتسامة قبل البدء", en: "Smile design before treatment" },
  { src: "/dental/dentalv2/treatment-loupes.webp", ar: "دقة تحت التكبير", en: "Precision under magnification" },
];

export default function DentalHub() {
  const { lang } = useLang();
  const isRtl = lang === "ar";
  const rootRef = useRef<HTMLDivElement>(null);

  const t = isRtl ? AR : EN;

  const scrollToBooking = () =>
    document.getElementById("dental-booking")?.scrollIntoView({ behavior: "smooth" });

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // ── Shared reveal system ─────────────────────────────
        const els = gsap.utils.toArray<HTMLElement>(".dv-reveal");
        if (els.length) {
          gsap.set(els, { autoAlpha: 0, y: 28 });
          ScrollTrigger.batch(els, {
            start: "top 88%",
            onEnter: (batch) =>
              gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.09, overwrite: true }),
          });
        }

        // ── Counters ─────────────────────────────────────────
        gsap.utils.toArray<HTMLElement>(".dv-count").forEach((el) => {
          const to = parseFloat(el.dataset.to || "0");
          const decimals = parseInt(el.dataset.decimals || "0", 10);
          const prefix = el.dataset.prefix || "";
          const suffix = el.dataset.suffix || "";
          const state = { v: 0 };
          ScrollTrigger.create({
            trigger: el,
            start: "top 85%",
            once: true,
            onEnter: () =>
              gsap.to(state, {
                v: to,
                duration: 1.4,
                ease: "power3.out",
                onUpdate: () => {
                  el.textContent = `${prefix}${state.v.toFixed(decimals)}${suffix}`;
                },
              }),
          });
        });

        // ── Parallax in the art section ──────────────────────
        gsap.to(".dv-par-1", {
          yPercent: -8,
          ease: "none",
          scrollTrigger: { trigger: ".dv-about", start: "top bottom", end: "bottom top", scrub: true },
        });
        gsap.to(".dv-par-2", {
          yPercent: 8,
          ease: "none",
          scrollTrigger: { trigger: ".dv-about", start: "top bottom", end: "bottom top", scrub: true },
        });

        // ── Floating action buttons entrance ─────────────────
        gsap.from(".dv-fab", { scale: 0, autoAlpha: 0, duration: 0.5, stagger: 0.15, delay: 1.2, ease: "back.out(1.7)" });
      });

      // Reduced motion: counters land on their final value, nothing hides.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.utils.toArray<HTMLElement>(".dv-count").forEach((el) => {
          const to = parseFloat(el.dataset.to || "0");
          const decimals = parseInt(el.dataset.decimals || "0", 10);
          el.textContent = `${el.dataset.prefix || ""}${to.toFixed(decimals)}${el.dataset.suffix || ""}`;
        });
      });
    },
    { scope: rootRef, dependencies: [lang], revertOnUpdate: true }
  );

  return (
    <div ref={rootRef} dir={isRtl ? "rtl" : "ltr"} className="min-h-screen bg-white">
      <style>{`
        @keyframes dv-ring { 0%, 100% { transform: scale(1); opacity: .35; } 50% { transform: scale(1.08); opacity: .6; } }
        @media (prefers-reduced-motion: reduce) { .dv-ring-anim { animation: none !important; } }
      `}</style>

      <SiteNav />

      {/* ── Hero (design-v2 light stage) ─────────────────── */}
      <DentalHeroV3
        lang={lang}
        onBookClick={scrollToBooking}
        onWhatsAppClick={() => {
          trackWhatsAppClick();
          window.open(WHATSAPP_LINK, "_blank");
        }}
      />

      {/* ── Elevated stats strip bridging out of the hero ── */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-14 md:-mt-[76px] relative z-10">
          <div className="dv-reveal bg-white rounded-[20px] shadow-[0_30px_70px_-30px_rgba(0,31,61,0.35)] ring-1 ring-[#E3E6EA]/70 grid grid-cols-2 lg:grid-cols-4 py-3.5">
            {t.stats.map((s, i) => (
              <div
                key={i}
                className={`px-6 py-6 md:py-7 text-center ${i > 0 ? "border-s border-[#E3E6EA] max-lg:[&:nth-child(3)]:border-s-0" : ""}`}
              >
                <p className="text-[28px] md:text-[30px] font-extrabold text-[#003868] leading-tight" dir="ltr">
                  <span
                    className="dv-count"
                    data-to={s.value}
                    data-decimals={s.decimals ?? 0}
                    data-prefix={s.prefix ?? ""}
                    data-suffix={s.suffix ?? ""}
                  >
                    {s.prefix ?? ""}0{s.suffix ?? ""}
                  </span>
                </p>
                <p className="mt-1 text-[13px] text-[#797C82] font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why My Clinic Dental (pinned 3D tooth) ────────── */}
      <DentalPromisesScroll lang={lang} />

      {/* ── Where science meets art ───────────────────────── */}
      <section className="dv-about py-20 md:py-28 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid lg:grid-cols-2 gap-12 lg:gap-[70px] items-center">
          <div className="dv-reveal relative order-2 lg:order-1">
            {/* Dot texture behind the collage */}
            <div
              className="absolute -inset-6 opacity-60 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(rgba(0,77,153,0.14) 1px, transparent 1.4px)",
                backgroundSize: "22px 22px",
                maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 75%)",
                WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 75%)",
              }}
              aria-hidden
            />
            <div className="relative grid grid-cols-2 gap-4 md:gap-5">
              <div className="dv-par-1 relative aspect-[4/5] rounded-[24px] overflow-hidden shadow-xl shadow-[#003868]/10 will-change-transform">
                <Image src="/dental/dentalv2/consult-desk.webp" alt={t.about.imageAlt1} fill sizes="(max-width:1024px) 50vw, 25vw" quality={70} className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#003868]/20 to-transparent" />
              </div>
              <div className="dv-par-2 relative aspect-[4/5] rounded-[24px] overflow-hidden shadow-xl shadow-[#004d99]/15 mt-12 will-change-transform">
                <Image src="/dental/dentalv2/chairside-prep.webp" alt={t.about.imageAlt2} fill sizes="(max-width:1024px) 50vw, 25vw" quality={70} className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#003868]/20 to-transparent" />
              </div>
            </div>
            {/* Floating chip bridging the two photos */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/94 backdrop-blur rounded-full px-5 py-3 flex items-center gap-2.5 shadow-xl ring-1 ring-[#E3E6EA]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#004d99" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M12 4l1.5 3.9 3.9 1.5-3.9 1.5L12 14.8l-1.5-3.9L6.6 9.4l3.9-1.5L12 4ZM19 15l.7 1.8 1.8.7-1.8.7L19 20l-.7-1.8-1.8-.7 1.8-.7L19 15Z" />
              </svg>
              <span className="text-[12.5px] font-bold text-[#003868] whitespace-nowrap">{t.about.chip}</span>
            </div>
          </div>

          <div className="dv-reveal order-1 lg:order-2">
            <span className="flex items-center gap-3 text-[#004d99] font-bold text-[13px] md:text-sm tracking-[0.05em] mb-4">
              <span className="w-[30px] h-[2px] bg-[#004d99]" aria-hidden />
              {t.about.eyebrow}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-[40px] font-extrabold text-[#003868] tracking-tight leading-[1.4]">
              {t.about.titlePlain} <span className="text-[#004d99]">{t.about.titleAccent}</span>
            </h2>
            <div className="mt-6 space-y-4 text-base md:text-[17px] text-[#3D434D] leading-[2]">
              {t.about.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <ul className="mt-7 space-y-3.5">
              {t.about.bullets.map((b, i) => (
                <li key={i} className="flex items-center gap-3 text-[15.5px] text-[#3D434D]">
                  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#004d99" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden>
                    <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM8.5 12l2.5 2.5 4.5-5" />
                  </svg>
                  {b}
                </li>
              ))}
            </ul>
            <a
              href="#dental-doctors"
              className="mt-9 inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold bg-white text-[#003868] border border-[#E3E6EA] shadow-sm hover:border-[#004d99]/40 hover:text-[#004d99] active:scale-95 transition-all"
            >
              {t.about.cta}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isRtl ? "" : "rotate-180"} aria-hidden>
                <path d="m15 6-6 6 6 6" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ── Patient experience videos ─────────────────────── */}
      <DentalVideos />

      {/* ── Clinical units ────────────────────────────────── */}
      <section id="dental-units" className="py-20 md:py-28 bg-[#F2F6FA] scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="dv-reveal text-center max-w-[680px] mx-auto mb-12 md:mb-14">
            <span className="inline-flex items-center justify-center gap-3 text-[#004d99] font-bold text-[13px] md:text-sm tracking-[0.05em]">
              <span className="w-[26px] h-[2px] bg-[#004d99]" aria-hidden />
              {t.units.eyebrow}
              <span className="w-[26px] h-[2px] bg-[#004d99]" aria-hidden />
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl lg:text-[40px] font-extrabold text-[#003868] tracking-tight leading-[1.4]">
              {t.units.titlePlain} <span className="text-[#004d99]">{t.units.titleAccent}</span>
            </h2>
            <p className="mt-4 text-base md:text-[16.5px] text-[#3D434D] leading-[1.9]">{t.units.subtitle}</p>
          </div>

          <DentalUnitsGrid onBookConsult={scrollToBooking} />
        </div>
      </section>

      {/* ── Doctors (live from the DB) ────────────────────── */}
      <DentalDoctorsStrip />

      {/* ── Smiles designed to fit you ────────────────────── */}
      <section className="py-20 md:py-28 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="dv-reveal text-center max-w-[680px] mx-auto mb-12 md:mb-14">
            <span className="inline-flex items-center justify-center gap-3 text-[#004d99] font-bold text-[13px] md:text-sm tracking-[0.05em]">
              <span className="w-[26px] h-[2px] bg-[#004d99]" aria-hidden />
              {t.gallery.eyebrow}
              <span className="w-[26px] h-[2px] bg-[#004d99]" aria-hidden />
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl lg:text-[40px] font-extrabold text-[#003868] tracking-tight leading-[1.4]">
              {t.gallery.titlePlain} <span className="text-[#004d99]">{t.gallery.titleAccent}</span>
            </h2>
            <p className="mt-4 text-base md:text-[16.5px] text-[#3D434D] leading-[1.9]">{t.gallery.subtitle}</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {GALLERY.map((g, i) => (
              <figure
                key={g.src}
                className={`dv-reveal group relative aspect-[4/5] rounded-[20px] overflow-hidden shadow-lg shadow-[#003868]/10 ring-1 ring-[#003868]/10 ${i % 2 === 1 ? "lg:mt-10" : ""}`}
              >
                <Image
                  src={g.src}
                  alt={isRtl ? g.ar : g.en}
                  fill
                  sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                  quality={70}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#003868]/85 via-[#003868]/15 to-transparent" aria-hidden />
                <figcaption className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                  <span className="block text-[13px] md:text-sm font-bold text-white leading-snug drop-shadow">
                    {isRtl ? g.ar : g.en}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── Google reviews marquee ────────────────────────── */}
      <DentalTestimonials />

      {/* ── Accreditations & insurance ────────────────────── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid lg:grid-cols-2 gap-6 md:gap-8">
          {/* Accreditations */}
          <div className="dv-reveal relative rounded-[24px] bg-[#F2F6FA] p-8 md:p-12 overflow-hidden">
            <div className="relative w-[88px] h-[88px] flex items-center justify-center mb-7">
              <span className="dv-ring-anim absolute inset-0 border-[1.5px] border-[#004d99]/35 rounded-full" style={{ animation: "dv-ring 4s ease-in-out infinite" }} aria-hidden />
              <span className="absolute inset-3 border border-[#004d99]/25 rounded-full" aria-hidden />
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#004d99" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3ZM9 11.5l2 2 4-4" />
              </svg>
            </div>
            <span className="flex items-center gap-3 text-[#004d99] font-bold text-[13px] tracking-[0.05em] mb-3">
              <span className="w-[26px] h-[2px] bg-[#004d99]" aria-hidden />
              {t.accred.eyebrow}
            </span>
            <h3 className="text-2xl md:text-[28px] font-extrabold text-[#003868] leading-[1.5]">{t.accred.title}</h3>
            <p className="mt-4 text-[15.5px] md:text-base text-[#3D434D] leading-[1.95]">{t.accred.body}</p>
          </div>

          {/* Insurance */}
          <div className="dv-reveal relative rounded-[24px] bg-[#003868] p-8 md:p-12 overflow-hidden text-white">
            <img src="/dental/flower-white.png" alt="" className={`absolute -top-8 ${isRtl ? "-left-8" : "-right-8"} w-36 opacity-[0.08] pointer-events-none select-none`} aria-hidden />
            <div className="relative w-[88px] h-[88px] flex items-center justify-center mb-7">
              <span className="dv-ring-anim absolute inset-0 border-[1.5px] border-white/35 rounded-full" style={{ animation: "dv-ring 4s ease-in-out infinite" }} aria-hidden />
              <span className="absolute inset-3 border border-white/25 rounded-full" aria-hidden />
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M3 7h18v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7ZM3 7l2.5-3h13L21 7M12 11v6M9 14h6" />
              </svg>
            </div>
            <span className="flex items-center gap-3 text-[#9ec5ff] font-bold text-[13px] tracking-[0.05em] mb-3">
              <span className="w-[26px] h-[2px] bg-[#9ec5ff]" aria-hidden />
              {t.insurance.eyebrow}
            </span>
            <h3 className="text-2xl md:text-[28px] font-extrabold leading-[1.5]">{t.insurance.title}</h3>
            <p className="mt-4 text-[15.5px] md:text-base text-white/75 leading-[1.95]">{t.insurance.body}</p>
            <a
              href={WHATSAPP_LINK}
              onClick={trackWhatsAppClick}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold bg-white text-[#003868] hover:bg-[#E9F1F8] active:scale-95 transition-all"
            >
              {t.insurance.cta}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.6 0-3.1-.4-4.4-1.2L3 20l1.2-5.1A8.5 8.5 0 1 1 21 11.5ZM8.8 10.5c.6 1.9 2 3.3 3.9 3.9l1.2-1.2 2.1 1" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA band ──────────────────────────────────────── */}
      <section className="relative bg-[#003868] overflow-hidden">
        <img src="/dental/flower-white.png" alt="" className="absolute -left-10 -top-10 w-48 opacity-[0.09] pointer-events-none select-none" aria-hidden />
        <img src="/dental/flower-white.png" alt="" className="absolute -right-12 -bottom-14 w-44 opacity-[0.06] pointer-events-none select-none" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-[74px] flex items-center gap-9 flex-wrap">
          <div className="relative w-[104px] h-[104px] shrink-0 hidden sm:flex items-center justify-center">
            <span className="dv-ring-anim absolute inset-0 border-[1.5px] border-white/35 rounded-full" style={{ animation: "dv-ring 4s ease-in-out infinite" }} aria-hidden />
            <span className="absolute inset-[14px] border border-white/25 rounded-full" aria-hidden />
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 5.5c-1.5-1.5-4-2.3-5.8-.9C4.3 6 3.8 8.6 4.6 11c.9 2.7 1.6 5.6 2.1 8.2.2 1 1.5 1.2 2 .3l2.3-4.2c.4-.8 1.6-.8 2 0l2.3 4.2c.5.9 1.8.7 2-.3.5-2.6 1.2-5.5 2.1-8.2.8-2.4.3-5-1.6-6.4C16 3.2 13.5 4 12 5.5Z" />
            </svg>
          </div>
          <div className="dv-reveal flex-1 min-w-[280px]">
            <h2 className="text-[26px] md:text-[32px] font-extrabold text-white leading-[1.5] mb-2.5">{t.cta.title}</h2>
            <p className="text-base md:text-[16.5px] text-white/70">{t.cta.subtitle}</p>
          </div>
          <button
            onClick={scrollToBooking}
            className="px-8 py-4 rounded-full font-bold bg-white text-[#003868] hover:bg-[#E9F1F8] shadow-lg active:scale-95 transition-all cursor-pointer"
          >
            {t.cta.button}
          </button>
        </div>
      </section>

      {/* ── Booking + branches + social ───────────────────── */}
      <DentalHoursAndBooking service="general" />

      <SiteFooter />

      {/* ── Sticky floating buttons ───────────────────────── */}
      <div className={`fixed bottom-6 ${isRtl ? "left-6" : "right-6"} z-50 flex flex-col items-end gap-3`}>
        <a
          href="tel:920022811"
          onClick={trackPhoneClick}
          className="dv-fab w-14 h-14 bg-[#003868] rounded-full flex items-center justify-center shadow-lg shadow-[#003868]/30 hover:shadow-xl hover:scale-110 active:scale-95 transition-all"
          aria-label={isRtl ? "اتصل بنا" : "Call us"}
        >
          <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>call</span>
        </a>
        <div className={`flex items-center gap-2 ${isRtl ? "flex-row-reverse" : "flex-row"}`}>
          <span className="dv-fab bg-white text-[#25D366] text-xs font-bold px-3 py-1.5 rounded-full shadow-md border border-[#25D366]/20 whitespace-nowrap">
            {isRtl ? "احجز الآن عبر واتساب" : "Chat now on WhatsApp"}
          </span>
          <a
            href={WHATSAPP_LINK}
            onClick={trackWhatsAppClick}
            target="_blank"
            rel="noopener noreferrer"
            className="dv-fab relative w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/40 hover:shadow-xl hover:scale-110 active:scale-95 transition-all"
            aria-label="Chat on WhatsApp"
          >
            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
            <svg viewBox="0 0 32 32" className="relative w-7 h-7 fill-white">
              <path d="M16.004 0C7.165 0 .004 7.161.004 16c0 2.822.737 5.561 2.137 7.978L.003 32l8.207-2.108A15.926 15.926 0 0 0 16.004 32C24.843 32 32 24.839 32 16S24.843 0 16.004 0zm0 29.09a13.05 13.05 0 0 1-6.64-1.813l-.476-.283-4.933 1.267 1.313-4.79-.31-.494A13.008 13.008 0 0 1 2.914 16c0-7.221 5.869-13.09 13.09-13.09S29.094 8.779 29.094 16s-5.869 13.09-13.09 13.09zm7.175-9.803c-.393-.197-2.326-1.148-2.687-1.279-.362-.131-.625-.197-.888.197s-1.02 1.279-1.25 1.542-.462.296-.855.099c-.393-.197-1.66-.612-3.163-1.95-1.17-1.043-1.96-2.33-2.19-2.723-.229-.393-.024-.605.172-.8.177-.177.393-.462.59-.693.197-.23.262-.394.393-.656.131-.262.066-.492-.033-.689-.099-.197-.888-2.14-1.217-2.93-.32-.769-.646-.665-.888-.677-.229-.011-.492-.014-.755-.014s-.69.099-1.05.492c-.362.394-1.381 1.35-1.381 3.293s1.414 3.82 1.611 4.083c.197.262 2.783 4.248 6.743 5.957.942.407 1.677.65 2.25.832.946.3 1.806.258 2.486.157.758-.113 2.326-.951 2.655-1.869.328-.918.328-1.705.23-1.869-.099-.164-.362-.262-.755-.46z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────
// Bilingual copy — the Arabic is the client's provided content; the English
// mirrors it.

type Stat = { value: number; label: string; prefix?: string; suffix?: string; decimals?: number };

const AR = {
  stats: [
    { value: 70, prefix: "+", label: "استشاري وأخصائي أسنان" },
    { value: 11, label: "وحدة علاجية متخصصة" },
    { value: 5, label: "فروع في الرياض وجدة" },
    { value: 4.8, decimals: 1, label: "تقييم Google" },
  ] as Stat[],
  about: {
    eyebrow: "عن عيادتي الأسنان",
    titlePlain: "كل ابتسامة",
    titleAccent: "عملٌ فني.",
    paragraphs: [
      "نؤمن بأن طب الأسنان لا يتوقف فقط على العلاج، لذلك نتعامل مع كل ابتسامة كعملٍ فني يجمع بين العلم والفن، لنرسم ابتسامة تعكس الثقة والجمال.",
      "من التشخيص الأولي إلى أدق التخصصات، نوفر تجربة علاجية متكاملة تجمع بين الخبرة، والتقنيات المتقدمة، والشعور بالراحة والطمأنينة.",
    ],
    bullets: [
      "تصوير ثلاثي الأبعاد وتشخيص رقمي دقيق",
      "خطط علاج واضحة وأسعار شفافة من الزيارة الأولى",
      "متابعة مستمرة بعد العلاج عبر واتساب",
    ],
    chip: "حيث يلتقي العلم بالفن",
    cta: "تعرّف على أطبائنا",
    imageAlt1: "استشارة أسنان في عيادتي",
    imageAlt2: "تحضير دقيق لجلسة علاج في عيادتي",
  },
  units: {
    eyebrow: "أقسام عيادتي الأسنان",
    titlePlain: "ابتسامتكم",
    titleAccent: "تبدأ هنا.",
    subtitle:
      "لم نكتفِ بتوفير جميع تخصصات طب الأسنان، بل عززناها بتخصصات دقيقة وخبرات متقدمة لنقدم حلولاً شاملة تلبي احتياجات جميع أفراد المجتمع.",
  },
  gallery: {
    eyebrow: "حالات قبل وبعد",
    titlePlain: "ابتسامات صُممت",
    titleAccent: "لتليق بكم.",
    subtitle:
      "لا نصمم ابتسامة جميلة فحسب، بل نحرص على أن تكون متناغمة مع ملامح الوجه ولون البشرة، ومتوازنة وظيفياً، لتمنحكم مظهراً طبيعياً وثقة في كل ابتسامة.",
  },
  accred: {
    eyebrow: "قسم الاعتمادات",
    title: "اعتمادات تعكس التزامنا بالجودة",
    body: "نفخر بحصولنا على اعتمادات تؤكد التزامنا بأعلى معايير الجودة والسلامة، لتمنحكم تجربة علاجية ترتكز على الثقة والتميز.",
  },
  insurance: {
    eyebrow: "قسم التأمين",
    title: "تأمينكم... ضمن أولوياتنا",
    body: "لأن راحتكم تبدأ من سهولة الإجراءات، نتعاون مع العديد من شركات التأمين المعتمدة لتقديم تجربة أكثر سلاسة منذ لحظة وصولكم.",
    cta: "استفسر عن تغطية تأمينك",
  },
  cta: {
    title: "جاهز لابتسامة أكثر صحة وإشراقاً؟",
    subtitle: "احجز موعدك اليوم وعش تجربة مستقبل طب الأسنان.",
    button: "احجز موعدك",
  },
};

const EN: typeof AR = {
  stats: [
    { value: 70, prefix: "+", label: "Dental consultants & specialists" },
    { value: 11, label: "Specialized clinical units" },
    { value: 5, label: "Branches in Riyadh & Jeddah" },
    { value: 4.8, decimals: 1, label: "Google rating" },
  ] as Stat[],
  about: {
    eyebrow: "About My Clinic Dental",
    titlePlain: "Every smile is",
    titleAccent: "a work of art.",
    paragraphs: [
      "We believe dentistry is about more than treatment. We approach every smile as a work of art where science meets craft — drawing a smile that reflects confidence and beauty.",
      "From the first diagnosis to the most precise subspecialties, we deliver a complete treatment experience combining expertise, advanced technology, and genuine comfort.",
    ],
    bullets: [
      "3D imaging and precise digital diagnosis",
      "Clear treatment plans and transparent pricing from the first visit",
      "Continuous follow-up after treatment via WhatsApp",
    ],
    chip: "Where science meets art",
    cta: "Meet our doctors",
    imageAlt1: "A dental consultation at My Clinic",
    imageAlt2: "Careful chairside preparation at My Clinic",
  },
  units: {
    eyebrow: "My Clinic Dental units",
    titlePlain: "Your smile",
    titleAccent: "starts here.",
    subtitle:
      "We didn't stop at offering every dental specialty — we reinforced them with precise subspecialties and advanced expertise to serve every member of the community.",
  },
  gallery: {
    eyebrow: "Before & after",
    titlePlain: "Smiles designed",
    titleAccent: "to fit you.",
    subtitle:
      "We don't just design a beautiful smile — we make sure it harmonizes with your features and skin tone, and stays functionally balanced, for a natural look and confidence in every smile.",
  },
  accred: {
    eyebrow: "Accreditations",
    title: "Accreditations that reflect our commitment to quality",
    body: "We're proud to hold accreditations that confirm our commitment to the highest standards of quality and safety — a treatment experience built on trust and excellence.",
  },
  insurance: {
    eyebrow: "Insurance",
    title: "Your insurance is our priority",
    body: "Because your comfort starts with easy paperwork, we work with a wide network of approved insurance providers for a smoother experience from the moment you arrive.",
    cta: "Ask about your coverage",
  },
  cta: {
    title: "Ready for a healthier, brighter smile?",
    subtitle: "Book your appointment today and experience the future of dentistry.",
    button: "Book your visit",
  },
};

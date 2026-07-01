"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type HeroCopy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaWhatsApp: string;
  badgeLabel: string;
  badgeValue: string;
  ratingLabel: string;
  imageAlt: string;
  smileTag: string;
  verifiedLabel: string;
  verifiedValue: string;
};

const COPY: { en: HeroCopy; ar: HeroCopy } = {
  en: {
    eyebrow: "My Clinic Dental",
    title: "Optimal care for your dental health.",
    subtitle:
      "Comprehensive dental care with the latest technology, delivered by a hand-picked team of board-certified specialists.",
    ctaPrimary: "Book your visit",
    ctaWhatsApp: "WhatsApp us",
    badgeLabel: "Patient rating · Google",
    badgeValue: "4.8 / 5",
    ratingLabel: "+70 specialists & consultants",
    imageAlt: "A patient in consultation with a My Clinic dental specialist",
    smileTag: "Smile with confidence",
    verifiedLabel: "Board-certified specialists",
    verifiedValue: "Hand-picked specialist team",
  },
  ar: {
    eyebrow: "عيادتي للأسنان",
    title: "الرعاية الأمثل لصحة أسنانك.",
    subtitle:
      "رعاية متكاملة لأسنانك بأحدث التقنيات وعلى يد نخبة من الأطباء.",
    ctaPrimary: "احجز موعدك",
    ctaWhatsApp: "تواصل واتساب",
    badgeLabel: "تقييم المرضى · Google",
    badgeValue: "4.8 / 5",
    ratingLabel: "+70 طبيب واستشاري أسنان",
    imageAlt: "مريض في استشارة مع طبيب أسنان استشاري في عيادتي",
    smileTag: "ابتسم بثقة",
    verifiedLabel: "أطباء استشاريون معتمدون",
    verifiedValue: "نخبة من الأطباء والاستشاريين",
  },
};

export default function DentalHeroSplit({
  lang,
  onBookClick,
  onWhatsAppClick,
}: {
  lang: "en" | "ar";
  onBookClick: () => void;
  onWhatsAppClick: () => void;
}) {
  const isRtl = lang === "ar";
  const c = COPY[lang];

  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Entrance choreography
      const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.85 } });
      tl.from(".dhs-image-card", { x: -40, autoAlpha: 0, scale: 0.96, duration: 1, ease: "power3.out" })
        .from(".dhs-eyebrow", { y: -16, autoAlpha: 0, duration: 0.55 }, "-=0.65")
        .from(".dhs-title", { y: 26, autoAlpha: 0, duration: 0.85 }, "-=0.35")
        .from(".dhs-rule", { scaleX: 0, transformOrigin: isRtl ? "100% 50%" : "0% 50%", duration: 0.6 }, "-=0.55")
        .from(".dhs-sub", { y: 20, autoAlpha: 0, duration: 0.7 }, "-=0.45")
        .from(".dhs-cta", { y: 18, autoAlpha: 0, stagger: 0.08, duration: 0.6 }, "-=0.4")
        .from(".dhs-stat", { y: 16, autoAlpha: 0, stagger: 0.1, duration: 0.6 }, "-=0.4")
        .from(".dhs-float-top", { y: -12, x: isRtl ? 20 : -20, autoAlpha: 0, duration: 0.7 }, "-=0.6")
        .from(".dhs-float-bottom", { y: 18, autoAlpha: 0, duration: 0.7 }, "-=0.5");

      // Gentle continuous breathing on the image card
      gsap.to(".dhs-image-inner", {
        scale: 1.04,
        duration: 8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // Floating "smile" tag — gentle bob
      gsap.to(".dhs-float-top", {
        y: "-=8",
        duration: 3.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // Pointer parallax on image card (very subtle)
      const wrap = containerRef.current;
      if (!wrap) return;
      const quickX = gsap.quickTo(imageWrapRef.current, "x", { duration: 1.2, ease: "power3.out" });
      const quickY = gsap.quickTo(imageWrapRef.current, "y", { duration: 1.2, ease: "power3.out" });
      const onMove = (e: PointerEvent) => {
        const rect = wrap.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width - 0.5;
        const relY = (e.clientY - rect.top) / rect.height - 0.5;
        quickX(relX * 14);
        quickY(relY * 10);
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      return () => window.removeEventListener("pointermove", onMove);
    },
    { scope: containerRef, dependencies: [lang] }
  );

  return (
    <div
      ref={containerRef}
      className={`grid lg:grid-cols-2 gap-10 lg:gap-14 items-center ${
        isRtl ? "lg:[direction:rtl]" : ""
      }`}
    >
      {/* ── IMAGE (left in LTR, right in RTL) ─────────────── */}
      <div
        ref={imageWrapRef}
        className={`dhs-image-card relative ${isRtl ? "lg:order-2" : "lg:order-1"} will-change-transform`}
      >
        {/* Soft accent shape behind the photo */}
        <div
          className="absolute -inset-4 rounded-[2rem] -z-10"
          style={{
            background:
              "radial-gradient(circle at 30% 20%, rgba(191,231,238,0.55) 0%, rgba(191,231,238,0) 60%), radial-gradient(circle at 80% 80%, rgba(0,103,125,0.10) 0%, rgba(0,103,125,0) 60%)",
          }}
          aria-hidden
        />

        <div className="dhs-image-inner relative aspect-[5/6] rounded-[1.75rem] overflow-hidden shadow-[0_40px_80px_-30px_rgba(0,56,103,0.35)] ring-1 ring-white/80 will-change-transform">
          <Image
            src="/dental/herodental.webp"
            alt={c.imageAlt}
            fill
            preload
            sizes="(max-width: 1024px) 100vw, 50vw"
            quality={75}
            className="object-cover object-center"
          />

          {/* Soft bottom fade so the verified pill stays readable */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#003867]/55 via-[#00677d]/10 to-transparent pointer-events-none" />

          {/* Top floating tag */}
          <div
            className={`dhs-float-top absolute top-5 ${isRtl ? "left-5" : "right-5"} bg-white/95 backdrop-blur rounded-full px-4 py-2 flex items-center gap-2 shadow-lg`}
            dir={isRtl ? "rtl" : "ltr"}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-900">{c.smileTag}</span>
          </div>

          {/* Bottom verified card */}
          <div
            className="dhs-float-bottom absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur rounded-2xl p-4 flex items-center gap-3 shadow-xl"
            dir={isRtl ? "rtl" : "ltr"}
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#003867] to-[#00677d] flex items-center justify-center text-white shrink-0">
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-500 font-medium">{c.verifiedLabel}</p>
              <p className="text-sm font-extrabold text-slate-900 truncate">{c.verifiedValue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTENT (right in LTR, left in RTL) ───────────── */}
      <div
        className={`relative ${isRtl ? "lg:order-1 text-right" : "lg:order-2 text-left"}`}
        dir={isRtl ? "rtl" : "ltr"}
      >
        <span className={`dhs-eyebrow inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/85 backdrop-blur text-[#00677d] text-[11px] font-bold ${isRtl ? "" : "uppercase tracking-[0.18em]"} ring-1 ring-[#00677d]/20 shadow-sm`}>
          <span
            className="material-symbols-outlined text-sm"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            dentistry
          </span>
          {c.eyebrow}
        </span>

        <h1 className="dhs-title mt-6 text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.05] text-slate-900 tracking-tight">
          {isRtl ? (
            <>
              <span style={{ color: "#004d99" }}>الرعاية الأمثل</span>{" "}
              <span style={{ color: "#00677d" }}>لصحة أسنانك.</span>
            </>
          ) : (
            c.title
          )}
        </h1>

        <div className="dhs-rule mt-5 h-1.5 w-28 rounded-full bg-gradient-to-r from-[#003867] via-[#00677d] to-[#00677d]/40" />

        <p className="dhs-sub mt-6 text-base md:text-lg text-slate-600 leading-relaxed max-w-xl">
          {c.subtitle}
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <motion.button
            onClick={onBookClick}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="dhs-cta group relative overflow-hidden bg-gradient-to-r from-[#003867] to-[#00677d] text-white px-7 py-3.5 rounded-full font-bold shadow-lg shadow-[#003867]/30 transition-colors"
          >
            <span className="relative z-10 inline-flex items-center gap-2">
              {c.ctaPrimary}
              <span
                className={`material-symbols-outlined text-[18px] transition-transform ${
                  isRtl ? "group-hover:-translate-x-1 rotate-180" : "group-hover:translate-x-1"
                }`}
              >
                arrow_forward
              </span>
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </motion.button>

          <motion.button
            onClick={onWhatsAppClick}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="dhs-cta cursor-pointer px-6 py-3.5 bg-white text-[#003867] border-2 border-[#00677d]/20 rounded-full font-bold shadow-sm hover:bg-[#00677d]/5 hover:border-[#00677d]/50 transition-colors flex items-center gap-2"
          >
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
              alt="WhatsApp"
              width={18}
              height={18}
              className="pointer-events-none"
              unoptimized
            />
            {c.ctaWhatsApp}
          </motion.button>
        </div>

        {/* Mini stats row */}
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <div className="dhs-stat flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <span
                className="material-symbols-outlined text-amber-500"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
            </div>
            <div className="leading-tight">
              <p className="text-lg font-extrabold text-slate-900" dir="ltr">
                {c.badgeValue}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">{c.badgeLabel}</p>
            </div>
          </div>

          <div className="dhs-stat flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#003867]/10 to-[#00677d]/15 text-[#00677d] flex items-center justify-center shrink-0">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                medical_services
              </span>
            </div>
            <div className="leading-tight">
              <p className="text-lg font-extrabold text-slate-900">{c.ratingLabel}</p>
              <p className="text-[11px] text-slate-500 font-medium">
                {isRtl ? "خبرة طب الأسنان" : "Dental expertise"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

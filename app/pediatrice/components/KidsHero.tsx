"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, DrawSVGPlugin);

type HeroCopy = {
  eyebrow: string;
  titleA: string;
  titleB: string;
  subtitle: string;
  ctaPrimary: string;
  ctaWhatsApp: string;
  imageAlt: string;
  statRating: string;
  statRatingLabel: string;
  statSpecialists: string;
  statSpecialistsLabel: string;
};

const COPY: { en: HeroCopy; ar: HeroCopy } = {
  en: {
    eyebrow: "My Clinic Kids",
    titleA: "Big care",
    titleB: "for little ones.",
    subtitle:
      "Gentle, comprehensive pediatric care your child will actually smile about, delivered by a hand-picked team of board-certified children's specialists.",
    ctaPrimary: "Book your child's visit",
    ctaWhatsApp: "WhatsApp us",
    imageAlt: "A happy child smiling with a friendly My Clinic pediatrician",
    statRating: "4.8/5",
    statRatingLabel: "parent rating on Google",
    statSpecialists: "+11",
    statSpecialistsLabel: "board-certified consultants",
  },
  ar: {
    eyebrow: "عيادتي للأطفال",
    titleA: "رعاية كبيرة",
    titleB: "لأصغر القلوب.",
    subtitle:
      "رعاية طبية لطيفة ومتكاملة لطفلك يبتسم لها فعلاً، على يد نخبة مختارة من استشاريي طب الأطفال المعتمدين.",
    ctaPrimary: "احجز موعد طفلك",
    ctaWhatsApp: "تواصل واتساب",
    imageAlt: "طفل سعيد يبتسم مع طبيبة أطفال لطيفة في عيادتي",
    statRating: "4.8/5",
    statRatingLabel: "تقييم الأهالي على Google",
    statSpecialists: "+11",
    statSpecialistsLabel: "استشاري أطفال معتمد",
  },
};

const BLOB_A = "58% 42% 55% 45% / 48% 54% 46% 52%";
const BLOB_B = "45% 55% 48% 52% / 56% 44% 58% 42%";

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

export default function KidsHero({
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

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.8 } });
      tl.from(".kh-word", { yPercent: 110, rotation: () => gsap.utils.random(-7, 7), autoAlpha: 0, stagger: 0.09, duration: 0.85 })
        .from(".kh-eyebrow", { y: -14, autoAlpha: 0, duration: 0.5 }, "-=0.7")
        .from(".kh-squiggle path", { drawSVG: "0%", duration: 0.7, ease: "power2.inOut" }, "-=0.35")
        .from(".kh-sub", { y: 18, autoAlpha: 0 }, "-=0.45")
        .from(".kh-cta", { y: 16, autoAlpha: 0, stagger: 0.08, duration: 0.55 }, "-=0.4")
        .from(".kh-stat", { y: 14, autoAlpha: 0, stagger: 0.1, duration: 0.5 }, "-=0.35")
        .from(".kh-image-card", { y: 44, autoAlpha: 0, scale: 0.95, duration: 1.05, ease: "power4.out" }, 0.15)
        .from(".kh-mascot", { scale: 0, autoAlpha: 0, duration: 0.7, ease: "back.out(2)" }, "-=0.55")
        .from(".kh-stamp", { scale: 0, autoAlpha: 0, duration: 0.6, ease: "back.out(1.8)" }, "-=0.5");

      // Living blob mask on the photo.
      gsap.to(".kh-blob", {
        borderRadius: BLOB_B,
        duration: 9,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // Idle motion.
      gsap.to(".kh-mascot", { y: "-=10", rotation: 4, duration: 2.8, ease: "sine.inOut", repeat: -1, yoyo: true });
      gsap.to(".kh-stamp-spin", { rotation: 360, duration: 22, ease: "none", repeat: -1 });
      gsap.to(".kh-image-inner", { scale: 1.05, duration: 11, ease: "sine.inOut", repeat: -1, yoyo: true });
      gsap.to(".kh-blob-wrap", { y: -9, duration: 4.5, ease: "sine.inOut", repeat: -1, yoyo: true, delay: 1.4 });
      gsap.to(".kh-blob-outline", { rotation: 360, duration: 90, ease: "none", repeat: -1, transformOrigin: "50% 50%" });

    },
    { scope: containerRef, dependencies: [lang], revertOnUpdate: true }
  );

  return (
    <div ref={containerRef} className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      {/* ── CONTENT (reads first on every screen) ──────────────── */}
      <div className={isRtl ? "text-right" : "text-left"}>
        <span className={`kh-eyebrow inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-[#004d99] ${isRtl ? "text-[13px]" : "text-[11px] uppercase tracking-[0.18em]"} font-extrabold ring-1 ring-[#004d99]/10 shadow-[0_2px_0_rgba(0,77,153,0.08)]`}>
          <span className="material-symbols-outlined text-sm text-[#FFB300]" style={{ fontVariationSettings: "'FILL' 1" }}>
            child_care
          </span>
          {c.eyebrow}
        </span>

        <h1 className={`kh-title mt-7 font-headline font-extrabold text-slate-900 ${isRtl ? "leading-[1.28]" : "tracking-tight leading-[1.06]"} text-[2.6rem] md:text-6xl lg:text-[4rem] [text-wrap:balance]`}>
          <span className="block pt-1">
            {c.titleA.split(" ").map((w, i) => (
              <span key={i} className="kh-word inline-block will-change-transform text-[#004d99]">
                {w}
                {" "}
              </span>
            ))}
          </span>
          <span className="relative inline-block overflow-visible">
            {c.titleB.split(" ").map((w, i) => (
              <span key={i} className="kh-word inline-block will-change-transform text-[#00677d]">
                {w}
                {" "}
              </span>
            ))}
            {/* Hand-drawn underline, drawn on after the words land */}
            <svg
              className="kh-squiggle absolute -bottom-3 left-0 w-full h-4 text-[#FFC83D]"
              viewBox="0 0 220 16"
              preserveAspectRatio="none"
              aria-hidden
            >
              <path
                d="M4 11 Q 30 3 56 10 T 110 9 T 164 10 T 216 8"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </span>
        </h1>

        <p className="kh-sub mt-7 text-base md:text-lg text-slate-600 leading-relaxed max-w-xl [text-wrap:pretty]">
          {c.subtitle}
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-4">
          <motion.button
            onClick={onBookClick}
            whileHover={{ y: -3 }}
            whileTap={{ y: 2 }}
            className="kh-cta cursor-pointer bg-[#004d99] text-white px-8 py-4 rounded-full font-extrabold text-[15px] shadow-[0_6px_0_#FFC83D] hover:shadow-[0_9px_0_#FFC83D] active:shadow-[0_2px_0_#FFC83D] transition-shadow inline-flex items-center gap-2.5"
          >
            {c.ctaPrimary}
            <span className={`material-symbols-outlined text-[19px] ${isRtl ? "rotate-180" : ""}`}>arrow_forward</span>
          </motion.button>

          <motion.button
            onClick={onWhatsAppClick}
            whileHover={{ y: -3 }}
            whileTap={{ y: 1 }}
            className="kh-cta cursor-pointer px-7 py-4 bg-white text-slate-800 rounded-full font-bold text-[15px] ring-2 ring-slate-200 hover:ring-[#25D366]/60 transition-shadow inline-flex items-center gap-2.5"
          >
            <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
            {c.ctaWhatsApp}
          </motion.button>
        </div>

        {/* Editorial stats */}
        <div className={`mt-11 flex items-center gap-8 ${isRtl ? "flex-row-reverse justify-end" : ""}`} dir="ltr">
          <div className={`kh-stat ${isRtl ? "text-right" : "text-left"}`} dir={isRtl ? "rtl" : "ltr"}>
            <p className="font-headline text-2xl md:text-[1.7rem] font-extrabold text-slate-900 tabular-nums" dir="ltr">
              {c.statRating}
            </p>
            <p className="mt-0.5 text-[12px] text-slate-500 font-medium">{c.statRatingLabel}</p>
          </div>
          <span className="kh-stat h-10 w-px bg-slate-200" aria-hidden />
          <div className={`kh-stat ${isRtl ? "text-right" : "text-left"}`} dir={isRtl ? "rtl" : "ltr"}>
            <p className="font-headline text-2xl md:text-[1.7rem] font-extrabold text-slate-900 tabular-nums" dir="ltr">
              {c.statSpecialists}
            </p>
            <p className="mt-0.5 text-[12px] text-slate-500 font-medium">{c.statSpecialistsLabel}</p>
          </div>
        </div>
      </div>

      {/* ── PHOTO ──────────────────────────────────────────────── */}
      <div className="kh-image-card relative mx-auto w-full max-w-md lg:max-w-none mt-12 lg:mt-0 will-change-transform">
        {/* Watercolor glow behind the blob */}
        <div
          className="absolute -inset-8 -z-10"
          style={{
            background:
              "radial-gradient(circle at 30% 20%, rgba(125,200,247,0.45) 0%, rgba(125,200,247,0) 58%), radial-gradient(circle at 78% 84%, rgba(255,200,61,0.35) 0%, rgba(255,200,61,0) 60%)",
            filter: "blur(6px)",
          }}
          aria-hidden
        />

        <div className="kh-blob-wrap relative will-change-transform">
        {/* Slowly rotating dashed companion outline */}
        <div
          className="kh-blob-outline absolute -inset-4 border-2 border-dashed border-[#7DC8F7]/70 will-change-transform"
          style={{ borderRadius: BLOB_B }}
          aria-hidden
        />
        <div
          className="kh-blob relative aspect-[4/5] overflow-hidden ring-[6px] ring-white shadow-[0_44px_90px_-34px_rgba(0,77,153,0.5)]"
          style={{ borderRadius: BLOB_A }}
        >
          <div className="kh-image-inner absolute inset-0 will-change-transform">
            <Image
              src="/kids/hero.jpg"
              alt={c.imageAlt}
              fill
              preload
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={80}
              className="object-cover object-center"
            />
          </div>
        </div>

        {/* Rotating stamp badge */}
        <div className={`kh-stamp absolute -top-4 md:-top-8 ${isRtl ? "-right-2 md:-right-9" : "-left-2 md:-left-9"} w-20 h-20 md:w-28 md:h-28`}>
          <div className="kh-stamp-spin absolute inset-0 will-change-transform">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <path id="kh-stamp-circle" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
              </defs>
              <circle cx="50" cy="50" r="49" fill="white" opacity="0.92" />
              <text className="font-headline" fontSize="10.5" fontWeight="800" letterSpacing="2.5" fill="#004d99">
                <textPath href="#kh-stamp-circle">MY CLINIC KIDS ★ MY CLINIC KIDS ★</textPath>
              </text>
            </svg>
          </div>
          <svg
            className="absolute inset-0 m-auto w-8 h-8 text-[#FFB300]"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <circle cx="12" cy="12" r="5" />
            {Array.from({ length: 8 }).map((_, i) => (
              <rect key={i} x="11.3" y="1.5" width="1.4" height="4" rx="0.7" transform={`rotate(${i * 45} 12 12)`} />
            ))}
          </svg>
        </div>

        {/* Mascot */}
        <div className={`kh-mascot absolute -bottom-7 ${isRtl ? "-left-3 md:-left-7" : "-right-3 md:-right-7"} w-24 h-24 md:w-32 md:h-32 will-change-transform`}>
          <div className="relative w-full h-full">
            <div className="absolute inset-0 rounded-full bg-[#7DC8F7]/50 blur-xl" />
            <Image
              src="/kids/mascot.jpg"
              alt=""
              width={160}
              height={160}
              className="relative rounded-full ring-4 ring-white shadow-xl object-cover"
            />
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

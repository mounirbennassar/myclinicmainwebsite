"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { WhatsAppIcon } from "@/app/components/icons";

gsap.registerPlugin(useGSAP);

type Copy = {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  ctaPrimary: string;
  ctaWhatsApp: string;
  statSpecialists: string;
  statSpecialistsLabel: string;
  ratingValue: string;
  ratingLabel: string;
  verifiedLabel: string;
  verifiedValue: string;
  imageAlt: string;
  marquee: { icon: string; text: string }[];
};

const COPY: { en: Copy; ar: Copy } = {
  en: {
    eyebrow: "My Clinic Dental",
    titleLine1: "Optimal care for",
    titleLine2: "your dental health.",
    subtitle:
      "Comprehensive dental care with the latest technology, delivered by a hand-picked team of board-certified specialists.",
    ctaPrimary: "Book your visit",
    ctaWhatsApp: "WhatsApp us",
    statSpecialists: "+70",
    statSpecialistsLabel: "Specialists & consultants",
    ratingValue: "4.8 / 5",
    ratingLabel: "Google rating",
    verifiedLabel: "Board-certified specialists",
    verifiedValue: "Hand-picked specialist team",
    imageAlt: "A patient smiling during a consultation with a My Clinic dental specialist",
    marquee: [
      { icon: "star", text: "4.8 / 5 patient rating" },
      { icon: "verified_user", text: "+70 specialists & consultants" },
      { icon: "location_on", text: "Riyadh & Jeddah" },
      { icon: "sanitizer", text: "Hospital-level sterilization" },
      { icon: "schedule", text: "Flexible appointments" },
      { icon: "support_agent", text: "Insurance handled for you" },
    ],
  },
  ar: {
    eyebrow: "عيادتي للأسنان",
    titleLine1: "الرعاية الأمثل",
    titleLine2: "لصحة أسنانك.",
    subtitle: "رعاية متكاملة لأسنانك بأحدث التقنيات وعلى يد نخبة من الأطباء.",
    ctaPrimary: "احجز موعدك",
    ctaWhatsApp: "تواصل واتساب",
    statSpecialists: "+70",
    statSpecialistsLabel: "طبيب واستشاري أسنان",
    ratingValue: "4.8 / 5",
    ratingLabel: "تقييم Google",
    verifiedLabel: "أطباء استشاريون معتمدون",
    verifiedValue: "نخبة من الأطباء والاستشاريين",
    imageAlt: "مريضة تبتسم خلال استشارة مع طبيب أسنان في عيادتي",
    marquee: [
      { icon: "star", text: "تقييم المرضى 4.8 / 5" },
      { icon: "verified_user", text: "+70 طبيب واستشاري أسنان" },
      { icon: "location_on", text: "الرياض وجدة" },
      { icon: "sanitizer", text: "تعقيم بمعايير المستشفيات" },
      { icon: "schedule", text: "مواعيد مرنة" },
      { icon: "support_agent", text: "نتولى إجراءات التأمين" },
    ],
  },
};

/* Headline line split into masked words so each word can slide up on load. */
function SplitWords({ text, className }: { text: string; className?: string }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={i} className="dhi-mask inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]">
          <span className={`dhi-word inline-block will-change-transform ${className ?? ""}`}>{w}&nbsp;</span>
        </span>
      ))}
    </>
  );
}

export default function DentalHeroImmersive({
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
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from(".dhi-word", { yPercent: 118, duration: 0.9, ease: "power4.out", stagger: 0.055 }, 0)
          .from(".dhi-eyebrow", { y: -14, autoAlpha: 0, duration: 0.5 }, 0.1)
          .from(".dhi-sub", { y: 22, autoAlpha: 0, duration: 0.7 }, 0.45)
          .from(".dhi-cta", { y: 18, autoAlpha: 0, duration: 0.55, stagger: 0.08 }, 0.6)
          .from(".dhi-rings", { scale: 0.82, autoAlpha: 0, transformOrigin: "50% 100%", duration: 1.1 }, 0.35)
          .from(
            ".dhi-arch",
            { y: 90, autoAlpha: 0, duration: 0.95, ease: "back.out(1.25)", stagger: { each: 0.09, from: "center" } },
            0.5
          )
          .from(".dhi-float", { scale: 0.5, autoAlpha: 0, duration: 0.6, ease: "back.out(2)", stagger: 0.12 }, 1.1)
          .from(".dhi-marquee-strip", { autoAlpha: 0, duration: 0.8 }, 1.2);

        // Ambient drift on the two glow blobs (transform-only, very slow)
        gsap.to(".dhi-blob-a", { x: 50, y: -30, duration: 16, ease: "sine.inOut", repeat: -1, yoyo: true });
        gsap.to(".dhi-blob-b", { x: -40, y: 26, duration: 18, ease: "sine.inOut", repeat: -1, yoyo: true });
        // Gentle bob on floating chips
        gsap.to(".dhi-float", { y: "-=7", duration: 3, ease: "sine.inOut", repeat: -1, yoyo: true, stagger: 0.4 });
      });

      // Pointer parallax on the arch gallery — desktop with a fine pointer only
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference) and (pointer: fine)", () => {
        const arches = gsap.utils.toArray<HTMLElement>(".dhi-arch");
        const setters = arches.map((el) => ({
          x: gsap.quickTo(el, "x", { duration: 1, ease: "power3.out" }),
          y: gsap.quickTo(el, "y", { duration: 1, ease: "power3.out" }),
          depth: Number(el.dataset.depth || 1),
        }));
        const onMove = (e: PointerEvent) => {
          const relX = e.clientX / window.innerWidth - 0.5;
          const relY = e.clientY / window.innerHeight - 0.5;
          setters.forEach((s) => {
            s.x(relX * 10 * s.depth);
            s.y(relY * 7 * s.depth);
          });
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => window.removeEventListener("pointermove", onMove);
      });
    },
    // revertOnUpdate: a language switch must tear down the old timeline, loops,
    // matchMedia contexts and pointer listeners — otherwise they stack per switch.
    { scope: rootRef, dependencies: [lang], revertOnUpdate: true }
  );

  return (
    <div ref={rootRef} dir={isRtl ? "rtl" : "ltr"} className="relative">
      {/* Marquee keyframes (scoped, CSS-driven so it costs no JS per frame) */}
      <style>{`
        @keyframes dhi-marquee-x { to { transform: translateX(-50%); } }
        .dhi-marquee-track { animation: dhi-marquee-x 36s linear infinite; }
        .dhi-marquee-strip:hover .dhi-marquee-track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) { .dhi-marquee-track { animation: none; } }
      `}</style>

      {/* ── Ambient background ────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage: "radial-gradient(rgba(0,103,125,0.16) 1px, transparent 1.5px)",
            backgroundSize: "26px 26px",
            maskImage: "radial-gradient(ellipse 75% 65% at 50% 35%, black 25%, transparent 72%)",
            WebkitMaskImage: "radial-gradient(ellipse 75% 65% at 50% 35%, black 25%, transparent 72%)",
          }}
        />
        <div className="dhi-blob-a absolute -top-24 -left-24 w-[26rem] h-[26rem] rounded-full bg-[#bfe7ee]/40 blur-3xl will-change-transform" />
        <div className="dhi-blob-b absolute top-1/3 -right-28 w-[30rem] h-[30rem] rounded-full bg-[#00677d]/[0.12] blur-3xl will-change-transform" />
      </div>

      {/* ── Headline block ────────────────────────────────── */}
      <div className="relative text-center pt-4 md:pt-8 px-4">
        <span className="dhi-eyebrow inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/85 backdrop-blur text-[#00677d] text-[11px] font-bold uppercase tracking-[0.18em] ring-1 ring-[#00677d]/20 shadow-sm">
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
            dentistry
          </span>
          {c.eyebrow}
        </span>

        <h1 className="mt-6 text-[2.6rem] leading-[1.06] sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900">
          <span className="block">
            <SplitWords text={c.titleLine1} />
            {/* Inline smile chip — editorial accent inside the headline */}
            <span className="dhi-mask inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]">
              <span className="dhi-word inline-flex align-middle mx-1 will-change-transform">
                <span className="relative inline-block w-[2.1em] h-[1.05em] rounded-full overflow-hidden ring-2 ring-white shadow-lg shadow-[#003867]/20 rotate-[-4deg]">
                  <Image src="/dental/smile-chip.webp" alt="" fill sizes="160px" className="object-cover" />
                </span>
              </span>
            </span>
          </span>
          <span className="block mt-1 pb-1">
            {/* Gradient must live on each word: background-clip:text doesn't
                reach through the nested overflow-hidden reveal masks. */}
            <SplitWords
              text={c.titleLine2}
              className="bg-gradient-to-r from-[#003867] via-[#00677d] to-[#00677d] bg-clip-text text-transparent"
            />
          </span>
        </h1>

        <p className="dhi-sub mt-5 md:mt-6 text-base md:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          {c.subtitle}
        </p>

        <div className="mt-7 md:mt-8 flex flex-wrap justify-center items-center gap-3">
          <button
            onClick={onBookClick}
            className="dhi-cta group relative overflow-hidden bg-gradient-to-r from-[#003867] to-[#00677d] text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-[#003867]/30 hover:shadow-xl hover:shadow-[#00677d]/30 active:scale-95 transition-all hover:-translate-y-0.5"
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
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>

          <button
            onClick={onWhatsAppClick}
            className="dhi-cta cursor-pointer px-7 py-4 bg-white/90 backdrop-blur text-[#003867] border-2 border-[#00677d]/20 rounded-full font-bold shadow-sm hover:bg-[#00677d]/5 hover:border-[#00677d]/50 active:scale-95 transition-all flex items-center gap-2"
          >
            <WhatsAppIcon className="pointer-events-none text-[18px] text-[#25D366]" />
            {c.ctaWhatsApp}
          </button>
        </div>
      </div>

      {/* ── Dental-arch gallery (a row of "teeth") ────────── */}
      <div className="relative mt-10 md:mt-14 px-4">
        {/* Concentric rings behind the gallery */}
        <svg
          className="dhi-rings absolute left-1/2 -translate-x-1/2 bottom-0 w-[640px] md:w-[880px] max-w-none text-[#00677d] pointer-events-none"
          viewBox="0 0 880 440"
          fill="none"
          aria-hidden
        >
          {[430, 350, 270].map((r, i) => (
            <circle key={r} cx="440" cy="440" r={r} stroke="currentColor" strokeOpacity={0.1 - i * 0.02} strokeWidth="1.4" />
          ))}
          <circle cx="440" cy="440" r="190" stroke="url(#dhi-ring-grad)" strokeOpacity="0.35" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
          <defs>
            <linearGradient id="dhi-ring-grad" x1="0" y1="0" x2="880" y2="440">
              <stop stopColor="#003867" />
              <stop offset="1" stopColor="#00677d" />
            </linearGradient>
          </defs>
        </svg>

        <div className="relative flex items-end justify-center gap-2.5 sm:gap-4 md:gap-5">
          {/* 1 — clinic room (hidden on small phones) */}
          <div
            data-depth="1.6"
            className="dhi-arch hidden sm:block relative w-24 md:w-40 h-40 md:h-56 rounded-t-full rounded-b-[1.4rem] overflow-hidden shadow-[0_24px_48px_-20px_rgba(0,56,103,0.35)] ring-1 ring-white/80 will-change-transform"
          >
            <Image src="/dental/39.webp" alt="" fill sizes="(max-width:768px) 96px, 160px" quality={62} className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#003867]/25 to-transparent" />
          </div>

          {/* 2 — specialists stat panel */}
          <div
            data-depth="1.25"
            className="dhi-arch relative w-24 sm:w-28 md:w-44 h-44 sm:h-52 md:h-72 rounded-t-full rounded-b-[1.4rem] overflow-hidden bg-gradient-to-b from-[#003867] to-[#00677d] shadow-[0_24px_48px_-20px_rgba(0,56,103,0.45)] will-change-transform"
          >
            <div
              className="absolute inset-0 opacity-25"
              style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1.4px)", backgroundSize: "18px 18px" }}
              aria-hidden
            />
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-5 md:pb-7 px-2 text-center text-white">
              <span className="material-symbols-outlined text-[22px] md:text-[30px] opacity-90" style={{ fontVariationSettings: "'FILL' 1" }}>
                groups
              </span>
              <p className="mt-1.5 text-2xl md:text-4xl font-extrabold tracking-tight" dir="ltr">
                {c.statSpecialists}
              </p>
              <p className="mt-1 text-[9px] md:text-[11px] font-bold text-white/85 leading-tight">{c.statSpecialistsLabel}</p>
            </div>
          </div>

          {/* 3 — center portrait */}
          <div
            data-depth="0.6"
            className="dhi-arch relative w-44 sm:w-52 md:w-64 h-64 sm:h-72 md:h-96 rounded-t-full rounded-b-[1.6rem] overflow-hidden shadow-[0_40px_80px_-28px_rgba(0,56,103,0.5)] ring-1 ring-white/80 will-change-transform"
          >
            <Image
              src="/dental/herodental.webp"
              alt={c.imageAlt}
              fill
              preload
              sizes="(max-width:768px) 208px, 256px"
              quality={78}
              className="object-cover object-[62%_center]"
            />
            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#003867]/55 via-[#00677d]/10 to-transparent" />
            {/* Verified pill inside the portrait */}
            <div className="dhi-float absolute bottom-3 inset-x-3 bg-white/95 backdrop-blur rounded-xl md:rounded-2xl px-3 py-2.5 md:p-3.5 flex items-center gap-2.5 shadow-xl will-change-transform">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[#003867] to-[#00677d] flex items-center justify-center text-white shrink-0">
                <span className="material-symbols-outlined text-[16px] md:text-[19px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
              </div>
              <div className="min-w-0 text-start">
                <p className="text-[9px] md:text-[10px] text-slate-500 font-medium leading-tight">{c.verifiedLabel}</p>
                <p className="text-[11px] md:text-[13px] font-extrabold text-slate-900 truncate leading-tight">{c.verifiedValue}</p>
              </div>
            </div>
          </div>

          {/* 4 — clinic room */}
          <div
            data-depth="1.25"
            className="dhi-arch relative w-24 sm:w-28 md:w-44 h-44 sm:h-52 md:h-72 rounded-t-full rounded-b-[1.4rem] overflow-hidden shadow-[0_24px_48px_-20px_rgba(0,56,103,0.35)] ring-1 ring-white/80 will-change-transform"
          >
            <Image src="/dental/40.webp" alt="" fill sizes="(max-width:768px) 112px, 176px" quality={62} className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#003867]/25 to-transparent" />
          </div>

          {/* 5 — clinic room (hidden on small phones) */}
          <div
            data-depth="1.6"
            className="dhi-arch hidden sm:block relative w-24 md:w-40 h-40 md:h-56 rounded-t-full rounded-b-[1.4rem] overflow-hidden shadow-[0_24px_48px_-20px_rgba(0,56,103,0.35)] ring-1 ring-white/80 will-change-transform"
          >
            <Image src="/dental/DSC04628_HDR.webp" alt="" fill sizes="(max-width:768px) 96px, 160px" quality={62} className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#003867]/25 to-transparent" />
          </div>

          {/* Floating rating chip — overlaps the center arch top */}
          <div className="dhi-float absolute top-6 sm:top-2 left-1/2 -translate-x-1/2 md:translate-x-16 bg-white/95 backdrop-blur rounded-full pl-2 pr-4 py-1.5 md:py-2 flex items-center gap-2 shadow-xl ring-1 ring-[#00677d]/10 will-change-transform" dir="ltr">
            <span className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-amber-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-amber-500 text-[16px] md:text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
            </span>
            <span className="leading-tight text-start">
              <span className="block text-[13px] md:text-sm font-extrabold text-slate-900">{c.ratingValue}</span>
              <span className="block text-[9px] md:text-[10px] text-slate-500 font-medium">{c.ratingLabel}</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── Trust marquee ─────────────────────────────────── */}
      <div
        className="dhi-marquee-strip relative mt-10 md:mt-12 -mx-4 md:-mx-8 border-y border-[#00677d]/10 bg-white/60 backdrop-blur-sm overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
        dir="ltr"
      >
        <div className="dhi-marquee-track flex w-max items-center will-change-transform">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex items-center shrink-0" aria-hidden={dup === 1}>
              {c.marquee.map((m, i) => (
                <span key={i} className="flex items-center gap-2.5 px-6 md:px-9 py-3.5 text-[13px] font-bold text-[#003867]/80 whitespace-nowrap" dir={isRtl ? "rtl" : "ltr"}>
                  <span className="material-symbols-outlined text-[18px] text-[#00677d]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {m.icon}
                  </span>
                  {m.text}
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00677d]/30 ms-6 md:ms-9" aria-hidden />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

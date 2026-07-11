"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { WhatsAppIcon } from "@/app/components/icons";

gsap.registerPlugin(useGSAP);

const SLIDE_SECONDS = 6;
const FADE_SECONDS = 1.1;

const SLIDES = [
  { src: "/dental/herodental.webp", pos: "object-[62%_center]" },
  { src: "/dental/39.webp", pos: "object-center" },
  { src: "/dental/DSC04628_HDR.webp", pos: "object-center" },
  { src: "/dental/40.webp", pos: "object-center" },
];

type Copy = {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  ctaPrimary: string;
  ctaWhatsApp: string;
  ratingValue: string;
  ratingLabel: string;
  specialistsValue: string;
  specialistsLabel: string;
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
    ratingValue: "4.8 / 5",
    ratingLabel: "Google rating",
    specialistsValue: "+70",
    specialistsLabel: "Specialists & consultants",
    imageAlt: "My Clinic dental care",
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
    ratingValue: "4.8 / 5",
    ratingLabel: "تقييم Google",
    specialistsValue: "+70",
    specialistsLabel: "طبيب واستشاري أسنان",
    imageAlt: "عيادتي لطب الأسنان",
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
        <span key={i} className="dhs2-mask inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em]">
          <span className={`dhs2-word inline-block will-change-transform ${className ?? ""}`}>{w}&nbsp;</span>
        </span>
      ))}
    </>
  );
}

export default function DentalHeroSlider({
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
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const barRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const goToRef = useRef<(i: number) => void>(() => {});

  useGSAP(
    (context, contextSafe) => {
      const mm = gsap.matchMedia();

      // Entrance choreography (once, on load)
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".dhs2-word", { yPercent: 118, duration: 0.9, ease: "power4.out", stagger: 0.055 }, 0.1)
          .from(".dhs2-eyebrow", { y: -14, autoAlpha: 0, duration: 0.5 }, 0.15)
          .from(".dhs2-sub", { y: 20, autoAlpha: 0, duration: 0.7 }, 0.55)
          // Animate the row wrapper, not the buttons: their Tailwind
          // `transition-all` would fight GSAP's per-frame opacity/visibility
          // writes (each write restarts the CSS transition → stays hidden).
          .from(".dhs2-cta-row", { y: 16, autoAlpha: 0, duration: 0.55 }, 0.7)
          .from(".dhs2-stat", { y: 14, autoAlpha: 0, duration: 0.5, stagger: 0.1 }, 0.9)
          .from(".dhs2-controls", { autoAlpha: 0, duration: 0.6 }, 1.05)
          .from(".dhs2-marquee-strip", { autoAlpha: 0, duration: 0.7 }, 1.1);
      });

      // Slider engine
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const slides = slideRefs.current.filter(Boolean) as HTMLDivElement[];
        const bars = barRefs.current.filter(Boolean) as HTMLSpanElement[];
        if (slides.length < 2) return;

        let current = 0;
        let progressTween: gsap.core.Tween | null = null;

        gsap.set(slides, { autoAlpha: 0 });
        gsap.set(slides[0], { autoAlpha: 1 });

        const kenBurns = (i: number) => {
          const img = slides[i].querySelector("img");
          if (img) {
            gsap.fromTo(
              img,
              { scale: 1.02 },
              { scale: 1.1, duration: SLIDE_SECONDS + FADE_SECONDS, ease: "none", overwrite: true }
            );
          }
        };

        const runProgress = () => {
          progressTween?.kill();
          bars.forEach((b, i) => gsap.set(b, { scaleX: i === current ? 0 : i < current ? 1 : 0 }));
          progressTween = gsap.fromTo(
            bars[current],
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: SLIDE_SECONDS,
              ease: "none",
              onComplete: () => goTo((current + 1) % slides.length),
            }
          );
        };

        const goTo = (next: number) => {
          if (next === current) return;
          gsap.to(slides[current], { autoAlpha: 0, duration: FADE_SECONDS, ease: "power2.inOut", overwrite: true });
          gsap.to(slides[next], { autoAlpha: 1, duration: FADE_SECONDS, ease: "power2.inOut", overwrite: true });
          current = next;
          kenBurns(next);
          runProgress();
        };

        goToRef.current = goTo;
        kenBurns(0);
        runProgress();

        // Pause the rotation while the pointer is over the imagery
        const stage = rootRef.current?.querySelector(".dhs2-stage");
        const pause = () => progressTween?.pause();
        const resume = () => progressTween?.resume();
        stage?.addEventListener("pointerenter", pause);
        stage?.addEventListener("pointerleave", resume);

        return () => {
          progressTween?.kill();
          stage?.removeEventListener("pointerenter", pause);
          stage?.removeEventListener("pointerleave", resume);
          goToRef.current = () => {};
        };
      });

      // Reduced motion: static first slide, everything visible
      mm.add("(prefers-reduced-motion: reduce)", () => {
        const slides = slideRefs.current.filter(Boolean) as HTMLDivElement[];
        gsap.set(slides, { autoAlpha: 0 });
        if (slides[0]) gsap.set(slides[0], { autoAlpha: 1 });
        barRefs.current.forEach((b, i) => b && gsap.set(b, { scaleX: i === 0 ? 1 : 0 }));
      });

      void context;
      void contextSafe;
    },
    { scope: rootRef, dependencies: [lang], revertOnUpdate: true }
  );

  return (
    <div ref={rootRef} dir={isRtl ? "rtl" : "ltr"}>
      <style>{`
        @keyframes dhs2-marquee-x { to { transform: translateX(-50%); } }
        .dhs2-marquee-track { animation: dhs2-marquee-x 36s linear infinite; }
        .dhs2-marquee-strip:hover .dhs2-marquee-track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) { .dhs2-marquee-track { animation: none; } }
      `}</style>

      {/* ── Full-bleed slider stage ───────────────────────── */}
      <div className="dhs2-stage relative h-[72vh] min-h-[540px] max-h-[780px] overflow-hidden">
        {/* Slides */}
        {SLIDES.map((s, i) => (
          <div
            key={s.src}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            className="absolute inset-0 will-change-[opacity]"
            aria-hidden={i !== 0}
          >
            <Image
              src={s.src}
              alt={i === 0 ? c.imageAlt : ""}
              fill
              preload={i === 0}
              loading={i === 0 ? undefined : "eager"}
              sizes="100vw"
              quality={72}
              className={`object-cover ${s.pos} will-change-transform`}
            />
          </div>
        ))}

        {/* Brand overlay for legibility — flips with direction */}
        <div
          className={`absolute inset-0 pointer-events-none bg-gradient-to-r ${
            isRtl
              ? "from-[#00677d]/20 via-[#003867]/60 to-[#003867]/95"
              : "from-[#003867]/95 via-[#003867]/60 to-[#00677d]/20"
          }`}
          aria-hidden
        />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" aria-hidden />

        {/* Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 md:px-8 flex items-center">
          <div className="max-w-2xl text-white pb-10">
            <span className="dhs2-eyebrow inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/25 text-[11px] font-bold uppercase tracking-[0.18em]">
              <span className="material-symbols-outlined text-sm text-[#bfe7ee]" style={{ fontVariationSettings: "'FILL' 1" }}>
                dentistry
              </span>
              {c.eyebrow}
            </span>

            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[3.6rem] font-extrabold leading-[1.08] tracking-tight">
              <span className="block">
                <SplitWords text={c.titleLine1} />
              </span>
              <span className="block mt-1">
                <SplitWords text={c.titleLine2} className="text-[#bfe7ee]" />
              </span>
            </h1>

            <p className="dhs2-sub mt-5 text-base md:text-lg text-white/85 leading-relaxed max-w-xl">{c.subtitle}</p>

            <div className="dhs2-cta-row mt-8 flex flex-wrap items-center gap-3 will-change-transform">
              <button
                onClick={onBookClick}
                className="group relative overflow-hidden bg-white text-[#003867] px-8 py-4 rounded-full font-extrabold shadow-lg shadow-black/20 hover:bg-[#bfe7ee] active:scale-95 transition-all hover:-translate-y-0.5"
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
              </button>

              <button
                onClick={onWhatsAppClick}
                className="cursor-pointer px-7 py-4 rounded-full font-bold bg-white/10 backdrop-blur border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 active:scale-95 transition-all flex items-center gap-2"
              >
                <WhatsAppIcon className="pointer-events-none text-[18px] text-[#25D366]" />
                {c.ctaWhatsApp}
              </button>
            </div>

            {/* Stats */}
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              <div className="dhs2-stat flex items-center gap-3">
                <span className="w-11 h-11 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-amber-300 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                </span>
                <span className="leading-tight">
                  <span className="block text-lg font-extrabold" dir="ltr">{c.ratingValue}</span>
                  <span className="block text-[11px] text-white/70 font-medium">{c.ratingLabel}</span>
                </span>
              </div>
              <div className="dhs2-stat flex items-center gap-3">
                <span className="w-11 h-11 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#bfe7ee] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    groups
                  </span>
                </span>
                <span className="leading-tight">
                  <span className="block text-lg font-extrabold" dir="ltr">{c.specialistsValue}</span>
                  <span className="block text-[11px] text-white/70 font-medium">{c.specialistsLabel}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Slide progress bars */}
        <div className="dhs2-controls absolute bottom-7 inset-x-0">
          <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center gap-2.5" dir="ltr">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goToRef.current(i)}
                aria-label={`Slide ${i + 1}`}
                className="group/bar relative h-6 w-14 md:w-20 flex items-center cursor-pointer"
              >
                <span className="relative h-[3px] w-full rounded-full bg-white/30 overflow-hidden group-hover/bar:bg-white/45 transition-colors">
                  <span
                    ref={(el) => {
                      barRefs.current[i] = el;
                    }}
                    className="absolute inset-0 rounded-full bg-white origin-left will-change-transform"
                    style={{ transform: "scaleX(0)" }}
                  />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Trust marquee ─────────────────────────────────── */}
      <div
        className="dhs2-marquee-strip relative border-b border-[#00677d]/10 bg-white overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
        dir="ltr"
      >
        <div className="dhs2-marquee-track flex w-max items-center will-change-transform">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex items-center shrink-0" aria-hidden={dup === 1}>
              {c.marquee.map((m, i) => (
                <span
                  key={i}
                  className="flex items-center gap-2.5 px-6 md:px-9 py-3.5 text-[13px] font-bold text-[#003867]/80 whitespace-nowrap"
                  dir={isRtl ? "rtl" : "ltr"}
                >
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

"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { WhatsAppIcon } from "@/app/components/icons";

gsap.registerPlugin(useGSAP);

/*
 * Design-v2 hero: light editorial stage instead of the old dark full-bleed
 * slider. The photo panel keeps the rotation (crossfade + Ken Burns) so all
 * four existing hero shots still get screen time, but the copy now sits on a
 * calm #E9F1F8 field with a white gradient bridging into the photo.
 */
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
  titlePlain: string;
  titleAccent: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  trustTitle: string;
  trustRating: string;
  chipSterile: string;
  chipDoctorsValue: string;
  chipDoctorsLabel: string;
  imageAlt: string;
};

const COPY: { en: Copy; ar: Copy } = {
  en: {
    eyebrow: "Advanced care · Brighter smiles",
    titlePlain: "Because your smile",
    titleAccent: "matters to us.",
    subtitle:
      "A complete treatment journey led by elite consultants and specialists, powered by the latest precision technology — an exceptional experience that feels comfortable at every moment.",
    ctaPrimary: "Book your visit",
    ctaSecondary: "Explore our units",
    trustTitle: "Trusted by thousands of happy patients",
    trustRating: "4.8/5",
    chipSterile: "Sterilization at the highest standard",
    chipDoctorsValue: "+70",
    chipDoctorsLabel: "Specialists &\nconsultants",
    imageAlt: "My Clinic dental care",
  },
  ar: {
    eyebrow: "رعاية متقدمة · ابتسامات أكثر إشراقاً",
    titlePlain: "لأن ابتسامتكم",
    titleAccent: "تهمنا.",
    subtitle:
      "صممنا رحلة علاجية متكاملة على أيدي نخبة من الاستشاريين والأخصائيين، مدعومة بأحدث التقنيات الدقيقة، لتقديم تجربة استثنائية تلامس حواسك وتمنحك راحة تستمتع بها في كل لحظة.",
    ctaPrimary: "احجز موعدك",
    ctaSecondary: "استكشف أقسامنا",
    trustTitle: "موثوق من آلاف المرضى السعداء",
    trustRating: "4.8/5",
    chipSterile: "تعقيم وفق أعلى المعايير",
    chipDoctorsValue: "+70",
    chipDoctorsLabel: "طبيب واستشاري\nأسنان",
    imageAlt: "عيادتي لطب الأسنان",
  },
};

/* Headline words in overflow masks so each can slide up on load. The
   padding/negative-margin pairs buy headroom for Arabic ascenders (hamza on
   alef) that paint above the em box — without them the mask clips them. */
function SplitWords({ text, className }: { text: string; className?: string }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={i} className="dhv3-mask inline-block overflow-hidden align-bottom pt-[0.3em] -mt-[0.3em] pb-[0.14em] -mb-[0.14em]">
          <span className={`dhv3-word inline-block will-change-transform ${className ?? ""}`}>{w}&nbsp;</span>
        </span>
      ))}
    </>
  );
}

function Star({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#F8B037" className={className} aria-hidden>
      <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9 2.9-6Z" />
    </svg>
  );
}

export default function DentalHeroV3({
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

  // Non-LCP slides mount on idle so the first image has the pipe to itself.
  const [deferredSlides, setDeferredSlides] = useState(false);
  useEffect(() => {
    const w = window as typeof window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (h: number) => void;
    };
    if (!w.requestIdleCallback) {
      const t = setTimeout(() => setDeferredSlides(true), 1200);
      return () => clearTimeout(t);
    }
    const h = w.requestIdleCallback(() => setDeferredSlides(true), { timeout: 2500 });
    return () => w.cancelIdleCallback?.(h);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Entrance choreography (once, on load)
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".dhv3-eyebrow", { y: -12, autoAlpha: 0, duration: 0.5 }, 0.1)
          .from(".dhv3-word", { yPercent: 118, duration: 0.9, ease: "power4.out", stagger: 0.055 }, 0.15)
          .from(".dhv3-sub", { y: 20, autoAlpha: 0, duration: 0.7 }, 0.55)
          // Animate the wrapper, not the buttons: their Tailwind `transition-all`
          // restarts on every GSAP opacity write and the buttons stay hidden.
          .from(".dhv3-cta-row", { y: 16, autoAlpha: 0, duration: 0.55 }, 0.7)
          .from(".dhv3-trust", { y: 14, autoAlpha: 0, duration: 0.5 }, 0.85)
          .from(".dhv3-chip", { scale: 0.6, autoAlpha: 0, duration: 0.55, ease: "back.out(1.7)", stagger: 0.12 }, 0.95)
          .from(".dhv3-controls", { autoAlpha: 0, duration: 0.6 }, 1.1);
      });

      // Photo panel rotation
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

        const stage = rootRef.current?.querySelector(".dhv3-photo");
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
    },
    { scope: rootRef, dependencies: [lang], revertOnUpdate: true }
  );

  return (
    <div ref={rootRef} dir={isRtl ? "rtl" : "ltr"}>
      <style>{`
        @keyframes dhv3-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .dhv3-chip { animation: dhv3-float 8s ease-in-out infinite; }
        .dhv3-chip-2 { animation-duration: 10s; }
        @media (prefers-reduced-motion: reduce) { .dhv3-chip { animation: none; } }
      `}</style>

      <div className="relative min-h-[640px] md:min-h-[690px] bg-[#E9F1F8] overflow-hidden">
        {/* ── Photo — full-bleed, dissolving toward the copy side. The mask
            fades the image itself to transparent (revealing the #E9F1F8
            stage), so there's no hard panel edge anywhere. ── */}
        <div
          className="dhv3-photo absolute inset-0"
          style={{
            maskImage: isRtl
              ? "linear-gradient(to right, black 0%, black 38%, rgba(0,0,0,.45) 62%, transparent 90%)"
              : "linear-gradient(to left, black 0%, black 38%, rgba(0,0,0,.45) 62%, transparent 90%)",
            WebkitMaskImage: isRtl
              ? "linear-gradient(to right, black 0%, black 38%, rgba(0,0,0,.45) 62%, transparent 90%)"
              : "linear-gradient(to left, black 0%, black 38%, rgba(0,0,0,.45) 62%, transparent 90%)",
          }}
        >
          {SLIDES.map((s, i) => (
            <div
              key={s.src}
              ref={(el) => {
                slideRefs.current[i] = el;
              }}
              className="absolute inset-0 will-change-[opacity]"
              aria-hidden={i !== 0}
            >
              {(i === 0 || deferredSlides) && (
                <Image
                  src={s.src}
                  alt={i === 0 ? c.imageAlt : ""}
                  fill
                  preload={i === 0}
                  sizes="100vw"
                  quality={72}
                  className={`object-cover ${s.pos} will-change-transform`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Soft veil on the copy side only — the mask already dissolves the
            photo, this just guarantees contrast behind the headline. */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isRtl
              ? "linear-gradient(to left, rgba(255,255,255,.85) 0%, rgba(255,255,255,.5) 26%, rgba(255,255,255,0) 52%)"
              : "linear-gradient(to right, rgba(255,255,255,.85) 0%, rgba(255,255,255,.5) 26%, rgba(255,255,255,0) 52%)",
          }}
          aria-hidden
        />

        {/* ── Copy ── */}
        <div className="relative max-w-7xl mx-auto px-4 md:px-8 min-h-[640px] md:min-h-[690px] flex flex-col justify-center py-20 md:py-0">
          <div className="max-w-[600px]">
            <div className="dhv3-eyebrow flex items-center gap-3 text-[#004d99] font-bold text-[13px] md:text-sm tracking-[0.05em] mb-5">
              <span className="w-[30px] h-[2px] bg-[#004d99]" aria-hidden />
              {c.eyebrow}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.22] tracking-tight text-[#003868]">
              <span className="block">
                <SplitWords text={c.titlePlain} />
              </span>
              <span className="block">
                <SplitWords text={c.titleAccent} className="text-[#004d99]" />
              </span>
            </h1>

            <p className="dhv3-sub mt-5 text-base md:text-lg text-[#3D434D] leading-[1.9] max-w-[500px]">{c.subtitle}</p>

            <div className="dhv3-cta-row mt-8 flex flex-wrap items-center gap-3.5 will-change-transform">
              <button
                onClick={onBookClick}
                className="group relative overflow-hidden bg-[#004d99] hover:bg-[#003868] text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-[#004d99]/30 active:scale-95 transition-all hover:-translate-y-0.5 inline-flex items-center gap-2 cursor-pointer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M8 2v4M16 2v4M3 8h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
                </svg>
                {c.ctaPrimary}
              </button>

              <a
                href="#dental-units"
                className="group px-7 py-4 rounded-full font-bold bg-white text-[#003868] border border-[#E3E6EA] shadow-sm hover:border-[#004d99]/40 hover:text-[#004d99] active:scale-95 transition-all inline-flex items-center gap-2"
              >
                {c.ctaSecondary}
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className={`transition-transform ${isRtl ? "group-hover:-translate-x-1" : "group-hover:translate-x-1 rotate-180"}`}
                  aria-hidden
                >
                  <path d="m15 6-6 6 6 6" />
                </svg>
              </a>

              <button
                onClick={onWhatsAppClick}
                className="w-[52px] h-[52px] rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:shadow-xl active:scale-95 transition-all cursor-pointer"
                aria-label={isRtl ? "تواصل واتساب" : "WhatsApp us"}
              >
                <WhatsAppIcon className="pointer-events-none text-[22px]" />
              </button>
            </div>

            {/* Trust row */}
            <div className="dhv3-trust mt-10 flex items-center gap-4">
              <div className="flex" dir="ltr">
                {(isRtl ? ["م", "س", "خ"] : ["M", "S", "K"]).map((ch, i) => (
                  <span
                    key={i}
                    className={`w-10 h-10 rounded-full text-[#003868] font-bold text-sm inline-flex items-center justify-center border-2 border-white ${
                      ["bg-[#DCE9F5]", "bg-[#F2F6FA]", "bg-[#CBDDEE]"][i]
                    } ${i > 0 ? "-ml-3" : ""}`}
                  >
                    {ch}
                  </span>
                ))}
              </div>
              <div>
                <div className="text-sm font-bold text-[#003868]">{c.trustTitle}</div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="inline-flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} />
                    ))}
                  </span>
                  <span className="text-[13px] text-[#797C82] font-bold" dir="ltr">
                    {c.trustRating}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Floating glass chips over the photo ── */}
        <div className={`dhv3-chip absolute top-24 ${isRtl ? "left-[7%]" : "right-[7%]"} hidden md:flex items-center gap-3 bg-white/85 backdrop-blur-[10px] rounded-[14px] shadow-[0_18px_42px_-18px_rgba(0,56,104,0.4)] px-[18px] py-[13px]`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#004d99" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3ZM9 11.5l2 2 4-4" />
          </svg>
          <span className="text-[13.5px] font-bold text-[#003868] whitespace-nowrap">{c.chipSterile}</span>
        </div>
        <div className={`dhv3-chip dhv3-chip-2 absolute bottom-28 ${isRtl ? "left-[16%]" : "right-[16%]"} hidden md:flex items-center gap-3 bg-white/85 backdrop-blur-[10px] rounded-[14px] shadow-[0_18px_42px_-18px_rgba(0,56,104,0.4)] px-[18px] py-[13px]`}>
          <span className="text-2xl font-extrabold text-[#004d99] leading-none" dir="ltr">{c.chipDoctorsValue}</span>
          <span className="text-[13px] font-medium text-[#003868] leading-[1.45] whitespace-pre-line">{c.chipDoctorsLabel}</span>
        </div>

        {/* ── Slide progress bars ── */}
        <div className={`dhv3-controls absolute bottom-8 ${isRtl ? "left-[7%]" : "right-[7%]"} hidden md:block`}>
          <div className="flex items-center gap-2.5" dir="ltr">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goToRef.current(i)}
                aria-label={`Slide ${i + 1}`}
                className="group/bar relative h-6 w-12 flex items-center cursor-pointer"
              >
                <span className="relative h-[3px] w-full rounded-full bg-white/50 overflow-hidden group-hover/bar:bg-white/70 transition-colors">
                  <span
                    ref={(el) => {
                      barRefs.current[i] = el;
                    }}
                    className="absolute inset-0 rounded-full bg-[#004d99] origin-left will-change-transform"
                    style={{ transform: "scaleX(0)" }}
                  />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "@/app/i18n/context";

type TintKey = "sky" | "amber" | "pink" | "teal";
type Shot = { src: string; en: string; ar: string; tint: TintKey };

// Curated from the clinic photo library — a varied mix of happy faces,
// playful spaces and gentle care moments.
const SHOTS: Shot[] = [
  { src: "/kids/gallery/g01.jpg", en: "Friends from the first visit", ar: "صداقة من أول زيارة", tint: "sky" },
  { src: "/kids/gallery/g02.jpg", en: "Endless little energy", ar: "طاقة لا تتوقف", tint: "amber" },
  { src: "/kids/gallery/g03.jpg", en: "Growing, visit by visit", ar: "نكبر مع كل زيارة", tint: "pink" },
  { src: "/kids/gallery/g04.jpg", en: "Always time to play", ar: "دائمًا وقت للّعب", tint: "teal" },
  { src: "/kids/gallery/g05.jpg", en: "Spaces built for kids", ar: "مساحات مهيأة للأطفال", tint: "sky" },
  { src: "/kids/gallery/g06.jpg", en: "A cosy little corner", ar: "ركن صغير ومريح", tint: "amber" },
  { src: "/kids/gallery/g07.jpg", en: "Learning through play", ar: "نتعلّم باللعب", tint: "pink" },
  { src: "/kids/gallery/g08.jpg", en: "Friendly exam rooms", ar: "غرف فحص مرحة", tint: "teal" },
  { src: "/kids/gallery/g09.jpg", en: "Care with a gentle touch", ar: "رعاية بلمسة لطيفة", tint: "sky" },
  { src: "/kids/gallery/g10.jpg", en: "Welcome to My Clinic", ar: "أهلًا بكم في عيادتي", tint: "amber" },
];

const TINTS: Record<TintKey, { dot: string; text: string; star: string }> = {
  sky: { dot: "bg-[#7DC8F7]", text: "text-[#0067B2]", star: "text-[#7DC8F7]" },
  amber: { dot: "bg-[#FFC83D]", text: "text-[#B27900]", star: "text-[#FFC83D]" },
  pink: { dot: "bg-[#F9A8C0]", text: "text-[#C2497A]", star: "text-[#F9A8C0]" },
  teal: { dot: "bg-[#00677d]", text: "text-[#00677d]", star: "text-[#00677d]" },
};

const ROTATIONS = ["-rotate-2", "rotate-1", "rotate-2", "-rotate-1", "rotate-1", "-rotate-2", "rotate-2", "-rotate-1", "rotate-1", "-rotate-2"];

const COPY = {
  en: {
    eyebrow: "inside our clinic",
    title: "A peek inside",
    highlight: "our kids' clinic.",
    subtitle: "Playful spaces, happy faces and gentle care — a little glimpse of what a visit really feels like.",
    open: "Tap any photo to take a closer look",
  },
  ar: {
    eyebrow: "أجواء عيادتي",
    title: "لمحات من",
    highlight: "عيادة الأطفال.",
    subtitle: "مساحات مرحة، ووجوه سعيدة، ورعاية لطيفة... هذه لمحة من أجواء زيارة طفلك لعيادتي.",
    open: "اضغط على أي صورة لمشاهدتها عن قرب",
  },
};

function StarSticker({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2c.5 4.5 2.5 6.5 7 7-4.5.5-6.5 2.5-7 7-.5-4.5-2.5-6.5-7-7 4.5-.5 6.5-2.5 7-7z" />
    </svg>
  );
}

export default function KidsGallery() {
  const { lang } = useLang();
  const isRtl = lang === "ar";
  const c = COPY[lang];
  const railRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  const scroll = (direction: "left" | "right") => {
    const container = railRef.current;
    if (!container) return;
    const card = container.querySelector<HTMLElement>(":scope > div");
    const amount = (card?.offsetWidth || 280) + 20;
    container.scrollBy({ left: direction === "right" ? amount : -amount, behavior: "smooth" });
  };

  const step = useCallback(
    (dir: number) => setActive((i) => (i === null ? i : (i + dir + SHOTS.length) % SHOTS.length)),
    []
  );

  // Lightbox keyboard controls.
  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, step]);

  return (
    <section dir={isRtl ? "rtl" : "ltr"} className="py-20 md:py-28 bg-gradient-to-b from-white via-[#FFFBF1] to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className={`max-w-2xl ${isRtl ? "text-right ml-auto" : "text-left"} mb-10 md:mb-14`}>
          <p className="font-body italic font-semibold text-[#00677d] text-sm">{c.eyebrow}</p>
          <h2 className={`mt-4 font-headline text-4xl md:text-[2.9rem] font-extrabold text-slate-900 ${isRtl ? "leading-[1.3]" : "tracking-tight leading-[1.08]"} [text-wrap:balance]`}>
            {c.title}{" "}
            <span className="relative inline-block">
              <span className="relative z-10">{c.highlight}</span>
              <span className="absolute inset-x-0 bottom-1 h-[0.55em] bg-[#FFC83D]/45 -rotate-1 rounded-sm" aria-hidden />
            </span>
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed [text-wrap:pretty]">{c.subtitle}</p>
        </div>

        {/* Arrow controls */}
        <div dir="ltr" className="flex items-center justify-end gap-2 mb-5">
          <button
            onClick={() => scroll("left")}
            className="w-11 h-11 rounded-full bg-white ring-2 ring-slate-200 text-[#004d99] flex items-center justify-center shadow-[0_3px_0_#FFC83D] hover:-translate-y-0.5 hover:ring-[#004d99]/40 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            aria-label="Scroll left"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-11 h-11 rounded-full bg-white ring-2 ring-slate-200 text-[#004d99] flex items-center justify-center shadow-[0_3px_0_#FFC83D] hover:-translate-y-0.5 hover:ring-[#004d99]/40 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            aria-label="Scroll right"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>

        {/* Polaroid rail */}
        <div
          ref={railRef}
          dir="ltr"
          className="flex overflow-x-scroll snap-x snap-mandatory gap-5 md:gap-6 pb-8 pt-3 hide-scrollbar"
          style={{ scrollBehavior: "smooth" }}
        >
          {SHOTS.map((shot, i) => {
            const tint = TINTS[shot.tint];
            return (
              <motion.div
                key={shot.src}
                initial={{ opacity: 0, y: 30, rotate: i % 2 === 0 ? -4 : 4 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.07, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="snap-start shrink-0"
              >
                <button
                  onClick={() => setActive(i)}
                  className={`group relative block w-[228px] sm:w-[260px] lg:w-[284px] bg-white rounded-[1.75rem] p-3 pb-4 ring-1 ring-slate-100 shadow-[0_18px_44px_-22px_rgba(0,77,153,0.32)] ${ROTATIONS[i]} hover:rotate-0 hover:-translate-y-2 hover:shadow-[0_28px_56px_-24px_rgba(0,77,153,0.42)] focus-visible:outline-2 focus-visible:outline-[#004d99] transition-all duration-300 cursor-pointer`}
                >
                  {/* Star sticker */}
                  <StarSticker className={`absolute -top-3 ${i % 2 === 0 ? "-left-2" : "-right-2"} w-7 h-7 ${tint.star} drop-shadow-sm rotate-12 group-hover:rotate-0 transition-transform duration-300 z-10`} />

                  {/* Photo */}
                  <div className="relative aspect-[4/5] rounded-[1.4rem] overflow-hidden bg-slate-100">
                    <Image
                      src={shot.src}
                      alt={isRtl ? shot.ar : shot.en}
                      fill
                      sizes="(max-width: 640px) 60vw, 284px"
                      quality={72}
                      loading="lazy"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Zoom hint */}
                    <span className="absolute bottom-2.5 right-2.5 w-9 h-9 rounded-full bg-white/85 backdrop-blur text-[#004d99] flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 shadow-sm">
                      <span className="material-symbols-outlined text-[20px]">zoom_in</span>
                    </span>
                  </div>

                  {/* Caption */}
                  <div className={`mt-3 px-1 flex items-center gap-2 ${isRtl ? "flex-row-reverse text-right" : "text-left"}`}>
                    <span className={`w-2 h-2 rounded-full shrink-0 ${tint.dot}`} aria-hidden />
                    <span className="font-headline text-[13px] font-bold text-slate-700 leading-snug">{isRtl ? shot.ar : shot.en}</span>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>

        <p className={`mt-1 text-[13px] text-slate-400 font-medium ${isRtl ? "text-right" : "text-left"}`}>
          <span className={`material-symbols-outlined text-[15px] align-middle ${isRtl ? "ml-1" : "mr-1"}`}>touch_app</span>
          {c.open}
        </p>
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#04233f]/80 backdrop-blur-sm"
            onClick={() => setActive(null)}
          >
            <button
              onClick={() => setActive(null)}
              className="absolute top-5 right-5 w-11 h-11 bg-white/15 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-[#004d99] transition-all cursor-pointer z-10"
              aria-label={isRtl ? "إغلاق" : "Close"}
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {/* Prev / Next (fixed LTR so arrows always point the right way) */}
            <div dir="ltr" className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-4 z-10" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => step(-1)}
                className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-[#004d99] active:scale-95 transition-all cursor-pointer"
                aria-label="Previous photo"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <span className="text-white/80 text-sm font-bold tabular-nums min-w-[3.5rem] text-center">
                {active + 1} / {SHOTS.length}
              </span>
              <button
                onClick={() => step(1)}
                className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-[#004d99] active:scale-95 transition-all cursor-pointer"
                aria-label="Next photo"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.figure
                key={active}
                initial={{ opacity: 0, scale: 0.94, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -12 }}
                transition={{ duration: 0.32, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="relative max-w-[88vw] sm:max-w-md w-full bg-white rounded-[2rem] p-3 pb-5 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
                dir={isRtl ? "rtl" : "ltr"}
              >
                <div className="relative aspect-[4/5] rounded-[1.5rem] overflow-hidden bg-slate-100">
                  <Image
                    src={SHOTS[active].src}
                    alt={isRtl ? SHOTS[active].ar : SHOTS[active].en}
                    fill
                    sizes="(max-width: 640px) 88vw, 448px"
                    quality={86}
                    className="object-cover"
                  />
                </div>
                <figcaption className={`mt-4 px-1 flex items-center gap-2.5 ${isRtl ? "flex-row-reverse text-right" : "text-left"}`}>
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${TINTS[SHOTS[active].tint].dot}`} aria-hidden />
                  <span className="font-headline font-extrabold text-slate-800">{isRtl ? SHOTS[active].ar : SHOTS[active].en}</span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

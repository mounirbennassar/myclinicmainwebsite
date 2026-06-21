"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "@/app/i18n/context";

const REVIEWS = [
  {
    initials: "NA",
    name: "Nora Al-Harbi",
    nameAr: "نورة الحربي",
    tint: "bg-[#7DC8F7]",
    en: "My daughter is usually terrified of doctors, but she actually asked to come back. The pediatrician was so patient and gentle.",
    ar: "ابنتي عادةً تخاف من الأطباء، لكنها طلبت أن نعود مرة أخرى. الطبيبة كانت صبورة ولطيفة جداً.",
  },
  {
    initials: "FM",
    name: "Faisal Mansour",
    nameAr: "فيصل منصور",
    tint: "bg-[#FFC83D]",
    en: "Clean, calm and beautifully designed for kids. The whole visit felt easy and reassuring for us as parents.",
    ar: "نظيف وهادئ ومصمم بشكل جميل للأطفال. الزيارة كلها كانت سهلة ومطمئنة لنا كأهل.",
  },
  {
    initials: "RS",
    name: "Reem Saleh",
    nameAr: "ريم صالح",
    tint: "bg-[#F9A8C0]",
    en: "From vaccinations to a specialist referral, everything was handled in one place. Truly outstanding pediatric care.",
    ar: "من التطعيمات إلى تحويلة لاستشاري، كل شيء تم في مكان واحد. رعاية أطفال متميزة فعلاً.",
  },
];

const ROTATE_MS = 6500;

export default function KidsTestimonials() {
  const { lang } = useLang();
  const isRtl = lang === "ar";
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(() => setIndex((i) => (i + 1) % REVIEWS.length), ROTATE_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused]);

  const go = (i: number) => setIndex(((i % REVIEWS.length) + REVIEWS.length) % REVIEWS.length);
  const r = REVIEWS[index];

  return (
    <section dir={isRtl ? "rtl" : "ltr"} className="py-20 md:py-28 bg-white overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12 md:mb-14">
          <p className="font-body italic font-semibold text-[#00677d] text-sm">
            {isRtl ? "آراء الأهالي" : "happy parents"}
          </p>
          <h2 className={`mt-4 font-headline text-4xl md:text-[2.9rem] font-extrabold text-slate-900 ${isRtl ? "leading-[1.3]" : "tracking-tight leading-[1.08]"} [text-wrap:balance]`}>
            {isRtl ? "ماذا يقول الأهالي عنّا" : "What parents say about us"}
          </h2>
        </div>

        {/* Quote stage */}
        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Decorative tilted backdrops */}
          <div className="absolute inset-x-6 -top-3 bottom-3 bg-[#FFF6DF] rounded-[2.5rem] rotate-2" aria-hidden />
          <div className="absolute inset-x-10 -top-6 bottom-6 bg-[#EAF5FE] rounded-[2.5rem] -rotate-2" aria-hidden />

          <div className="relative bg-white rounded-[2.5rem] ring-1 ring-slate-100 shadow-[0_30px_70px_-30px_rgba(0,77,153,0.35)] px-7 md:px-14 py-10 md:py-14 text-center min-h-[300px] md:min-h-[280px] flex flex-col justify-between">
            {/* Big crayon quote mark */}
            <svg
              className={`absolute -top-5 ${isRtl ? "right-8" : "left-8"} w-12 h-12 text-[#FFC83D]`}
              viewBox="0 0 48 48"
              fill="currentColor"
              aria-hidden
            >
              <path d="M10 34c-3 0-6-2.6-6-7 0-7.6 5.4-14.2 13-17l2.2 3.6C13.6 16.4 11 20 10.6 23c.4-.2 1-.3 1.6-.3 3.4 0 6 2.5 6 5.8 0 3.2-2.7 5.5-6.2 5.5-.7 0-1.4-.1-2-.3zm21 0c-3 0-6-2.6-6-7 0-7.6 5.4-14.2 13-17l2.2 3.6C34.6 16.4 32 20 31.6 23c.4-.2 1-.3 1.6-.3 3.4 0 6 2.5 6 5.8 0 3.2-2.7 5.5-6.2 5.5-.7 0-1.4-.1-2-.3z" />
            </svg>

            <AnimatePresence mode="wait">
              <motion.figure
                key={index}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="flex-1 flex flex-col justify-center"
              >
                <blockquote className="font-headline text-xl md:text-2xl font-bold text-slate-800 leading-relaxed [text-wrap:balance]">
                  {isRtl ? r.ar : r.en}
                </blockquote>
                <figcaption className="mt-7 flex items-center justify-center gap-3">
                  <span className={`w-11 h-11 rounded-2xl ${r.tint} flex items-center justify-center text-white font-extrabold text-sm rotate-3`}>
                    {r.initials}
                  </span>
                  <span className={isRtl ? "text-right" : "text-left"}>
                    <span className="block font-bold text-slate-900 text-sm">{isRtl ? r.nameAr : r.name}</span>
                    <span className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400">
                      <span className="flex text-[#FFB300]" dir="ltr">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span key={s} className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        ))}
                      </span>
                      {isRtl ? "مراجعة Google" : "Google review"}
                    </span>
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>

            {/* Controls */}
            <div className="mt-8 flex items-center justify-center gap-5" dir="ltr">
              <button
                onClick={() => go(index - 1)}
                className="w-10 h-10 rounded-full bg-white ring-2 ring-slate-200 text-[#004d99] flex items-center justify-center hover:ring-[#004d99]/50 active:scale-95 transition-all cursor-pointer"
                aria-label={isRtl ? "السابق" : "Previous review"}
              >
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              <div className="flex items-center gap-2">
                {REVIEWS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => go(i)}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      i === index ? "w-7 bg-[#004d99]" : "w-2.5 bg-slate-200 hover:bg-slate-300"
                    }`}
                    aria-label={`${isRtl ? "مراجعة" : "Review"} ${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={() => go(index + 1)}
                className="w-10 h-10 rounded-full bg-white ring-2 ring-slate-200 text-[#004d99] flex items-center justify-center hover:ring-[#004d99]/50 active:scale-95 transition-all cursor-pointer"
                aria-label={isRtl ? "التالي" : "Next review"}
              >
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

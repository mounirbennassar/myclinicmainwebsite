"use client";

import { type MouseEvent, type ReactNode, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLang } from "@/app/i18n/context";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";

// Portraits in public/leadership/ are the client-supplied photos, cut out and
// re-framed onto one studio backdrop (880x1100, 4:5) so every card matches.

type Leader = {
  img: string;
  icon: string;
  name: { en: string; ar: string };
  title: { en: string; ar: string };
  medical?: boolean;
};

const MEDICAL_DIRECTOR = { en: "Medical Director", ar: "المدير الطبي" };

// One grid, in the order the client asked for: the CMO first, the CEO in the
// middle of the top row, then the rest. 3 per row on desktop, 1 per row on phones.
const LEADERS: Leader[] = [
  {
    img: "/leadership/ahmed-alzahrani.webp",
    icon: "health_and_safety",
    name: { en: "Dr. Ahmed Alzahrani", ar: "د. أحمد الزهراني" },
    title: { en: "Chief Medical Officer", ar: "الرئيس التنفيذي الطبي" },
  },
  {
    img: "/leadership/abdullah-alghamdi.webp",
    icon: "verified",
    name: { en: "Abdullah Alghamdi", ar: "عبدالله الغامدي" },
    title: { en: "Chief Executive Officer", ar: "الرئيس التنفيذي" },
  },
  {
    img: "/leadership/hesham-abdulwahab.webp",
    icon: "apartment",
    name: { en: "Hesham Abdulwahab", ar: "هشام عبدالوهاب" },
    title: { en: "Chief Operating Officer", ar: "الرئيس التنفيذي للعمليات" },
  },
  {
    img: "/leadership/omar-bashanfar.webp",
    icon: "payments",
    name: { en: "Omar Bashanfar", ar: "عمر باشنفر" },
    title: { en: "Chief Financial Officer", ar: "الرئيس التنفيذي للمالية" },
  },
  ...[
    { img: "/leadership/asim-alshanbari.webp", name: { en: "Dr. Asim Alshanbari", ar: "د. عاصم الشنبري" } },
    { img: "/leadership/majed-alnabulsi.webp", name: { en: "Dr. Majed Alnabulsi", ar: "د. ماجد النابلسي" } },
    { img: "/leadership/majed-almansouri.webp", name: { en: "Dr. Majed Almansouri", ar: "د. ماجد المنصوري" } },
    { img: "/leadership/mohammed-batais.webp", name: { en: "Prof. Mohammed Batais", ar: "البروفيسور محمد بطيس" } },
  ].map((m) => ({ ...m, icon: "stethoscope", title: MEDICAL_DIRECTOR, medical: true })),
];

/** The CEO card plays its hover effect once by itself; the rest are hover-only. */
const AUTOPLAY_IMG = "/leadership/abdullah-alghamdi.webp";

/* Safe scroll reveal — framer-motion whileInView, same as about-us (GSAP
   ScrollTrigger reveals leave elements stuck at opacity:0 on these pages). */
function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Plays the hover effect once, by itself, when the CEO card scrolls into view:
 * sets data-lit for LIT_MS, and every hover style is mirrored on
 * `data-[lit]` / `group-data-[lit]`. Hovering afterwards plays it again as usual.
 * `delay` waits for the Reveal fade-in to finish; `enabled` is false for every
 * card but the CEO's.
 */
const LIT_MS = 1700;
function useIntroGlow<T extends HTMLElement>(delay: number, enabled: boolean) {
  const ref = useRef<T>(null);
  const [lit, setLit] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    let on: number | undefined;
    let off: number | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        on = window.setTimeout(() => {
          setLit(true);
          off = window.setTimeout(() => setLit(false), LIT_MS);
        }, delay);
      },
      { threshold: 0.45 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(on);
      window.clearTimeout(off);
    };
  }, [delay, enabled]);
  return [ref, lit ? "" : undefined] as const;
}

/** Feeds the pointer position to the card's spotlight as CSS variables. */
function trackPointer(e: MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

/** Hover layers shared by every card: pointer spotlight + diagonal light sweep. */
function HoverLight() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-data-[lit]:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--mx, 50%) var(--my, 30%), rgba(255,255,255,0.22), transparent 45%)",
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
        <div className="absolute -inset-y-10 -left-1/2 w-1/3 -skew-x-[20deg] bg-gradient-to-r from-transparent via-white/35 to-transparent -translate-x-full motion-safe:transition-transform motion-safe:duration-[1100ms] motion-safe:ease-out group-hover:translate-x-[520%] group-data-[lit]:translate-x-[520%]" />
      </div>
    </>
  );
}

function LeaderCard({ leader, isRtl, tier, autoPlay }: { leader: Leader; isRtl: boolean; tier: string; autoPlay: boolean }) {
  const [glowRef, lit] = useIntroGlow<HTMLElement>(900, autoPlay);
  const name = isRtl ? leader.name.ar : leader.name.en;
  const title = isRtl ? leader.title.ar : leader.title.en;
  return (
    <article
      ref={glowRef}
      data-lit={lit}
      onMouseMove={trackPointer}
      className="group relative isolate aspect-[4/5] overflow-hidden rounded-[2rem] bg-primary-fixed shadow-[0_24px_60px_-34px_rgba(0,27,61,0.55)] ring-1 ring-primary/10 motion-safe:transition-all motion-safe:duration-500 hover:-translate-y-2 data-[lit]:-translate-y-2 hover:shadow-[0_40px_80px_-30px_rgba(0,77,153,0.55)] data-[lit]:shadow-[0_40px_80px_-30px_rgba(0,77,153,0.55)] hover:ring-secondary-fixed-dim/70 data-[lit]:ring-secondary-fixed-dim/70"
    >
      <Image
        src={leader.img}
        alt={`${name} — ${title}`}
        fill
        priority={autoPlay}
        sizes="(min-width: 1280px) 360px, (min-width: 768px) 45vw, 92vw"
        className="object-cover object-top motion-safe:transition-transform motion-safe:duration-[900ms] motion-safe:ease-out group-hover:scale-[1.06] group-data-[lit]:scale-[1.06]"
      />
      {/* Legibility gradient — deepens on hover so the glass panel reads */}
      <div
        aria-hidden
        className="absolute inset-0 z-10 bg-gradient-to-t from-[#001b3d]/85 via-[#001b3d]/10 to-transparent transition-opacity duration-500 group-hover:opacity-90 group-data-[lit]:opacity-90"
      />
      <HoverLight />

      {/* Glass caption: name + title always visible; the panel frosts over and
          reveals the tier line on hover (touch devices still get the essentials). */}
      <div className="absolute inset-x-3 bottom-3 z-30">
        <div className="rounded-[1.4rem] border border-transparent p-4 transition-all duration-500 group-hover:border-white/30 group-data-[lit]:border-white/30 group-hover:bg-white/12 group-data-[lit]:bg-white/12 group-hover:backdrop-blur-xl group-data-[lit]:backdrop-blur-xl group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_10px_30px_-10px_rgba(0,0,0,0.4)] group-data-[lit]:shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_10px_30px_-10px_rgba(0,0,0,0.4)]">
          <h3 className={`font-headline font-bold text-white text-lg md:text-xl leading-tight ${isRtl ? "" : "tracking-tight"}`}>
            {name}
          </h3>
          <p className="mt-1 text-[13px] font-semibold leading-snug text-secondary-fixed">{title}</p>
          <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-500 group-hover:grid-rows-[1fr] group-data-[lit]:grid-rows-[1fr] group-hover:opacity-100 group-data-[lit]:opacity-100">
            <div className="overflow-hidden">
              <div className="mt-3 flex items-center gap-2 border-t border-white/20 pt-3 text-[12px] font-medium text-white/80">
                <span className="material-symbols-outlined text-[18px] text-secondary-fixed-dim">{leader.icon}</span>
                {tier}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function LeadershipClient() {
  const { lang } = useLang();
  const isRtl = lang === "ar";
  const execTier = isRtl ? "القيادة التنفيذية" : "Executive Leadership";
  const medTier = isRtl ? "القيادة الطبية" : "Medical Leadership";

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="min-h-screen bg-surface flex flex-col">
      <SiteNav />

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden hero-gradient">
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.35] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,77,153,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0,77,153,0.07) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage: "radial-gradient(ellipse at 50% 0%, black 30%, transparent 75%)",
              WebkitMaskImage: "radial-gradient(ellipse at 50% 0%, black 30%, transparent 75%)",
            }}
          />
          {/* Fade the hero glow into the page so it has no hard bottom edge */}
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-surface pointer-events-none" />
          <div className="relative max-w-4xl mx-auto px-4 md:px-8 pt-14 md:pt-20 pb-24 md:pb-32 text-center">
            <div>
              <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-primary font-extrabold shadow-clinical ring-1 ring-primary/10 ${isRtl ? "text-[13px]" : "text-[11px] uppercase tracking-[0.15em]"}`}>
                {isRtl ? "فريق القيادة" : "Our Leadership"}
              </span>
            </div>
            <h1 className={`mt-6 font-headline font-extrabold text-primary text-4xl md:text-6xl ${isRtl ? "leading-[1.25]" : "tracking-tight leading-[1.05]"} [text-wrap:balance] text-glow`}>
              {isRtl ? "القيادة التي تصنع الفرق" : "The people leading the way"}
            </h1>
            <p className="mt-5 text-on-surface-variant text-base md:text-lg max-w-2xl mx-auto leading-relaxed [text-wrap:pretty]">
              {isRtl
                ? "خبرة إدارية وطبية تجمعها رؤية واحدة: رعاية صحية متخصصة بجودة عالية، قريبة من كل أسرة في جدة والرياض."
                : "Executive and clinical expertise united by one vision: specialized, high-quality care, close to every family across Jeddah & Riyadh."}
            </p>
          </div>
        </section>

        {/* ── Leaders: 3 per row (last row centred), 2 on tablets, 1 on phones ── */}
        <section className="relative max-w-6xl mx-auto px-4 md:px-8 -mt-14 md:-mt-20 pb-20 md:pb-28">
          <div className="flex flex-wrap justify-center gap-6">
            {LEADERS.map((l, i) => (
              <Reveal
                key={l.img}
                delay={(i % 3) * 0.08}
                className="w-full max-w-sm sm:max-w-none sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
              >
                <LeaderCard leader={l} isRtl={isRtl} tier={l.medical ? medTier : execTier} autoPlay={l.img === AUTOPLAY_IMG} />
              </Reveal>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

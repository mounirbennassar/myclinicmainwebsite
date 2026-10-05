"use client";

import { type MouseEvent, type ReactNode } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLang } from "@/app/i18n/context";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";

// Portraits in public/leadership/ are AI-generated PLACEHOLDERS for the
// approval preview. Swap in the real photos (4:5, same file names) and set this
// to false before launch — it removes the "Placeholder photo" tags.
const PREVIEW = true;

type Leader = {
  img: string;
  icon: string;
  name: { en: string; ar: string };
  title: { en: string; ar: string };
};

const CEO: Leader = {
  img: "/leadership/ceo.webp",
  icon: "verified",
  name: { en: "Abdullah Alghamdi", ar: "عبدالله الغامدي" },
  title: { en: "Chief Executive Officer", ar: "الرئيس التنفيذي" },
};

const EXECUTIVES: Leader[] = [
  {
    img: "/leadership/coo.webp",
    icon: "apartment",
    name: { en: "Hisham Abdulwahab", ar: "هشام عبدالوهاب" },
    title: { en: "Chief Operating Officer", ar: "الرئيس التنفيذي للعمليات" },
  },
  {
    img: "/leadership/cfo.webp",
    icon: "payments",
    name: { en: "Omar Bashanfar", ar: "عمر باشنفر" },
    title: { en: "Chief Financial Officer", ar: "الرئيس التنفيذي للمالية" },
  },
  {
    img: "/leadership/cmo.webp",
    icon: "rocket_launch",
    name: { en: "Ahmed Alzahrani", ar: "أحمد الزهراني" },
    title: { en: "Chief Marketing Officer", ar: "الرئيس التنفيذي للتسويق" },
  },
];

const MEDICAL_DIRECTOR = { en: "Medical Director", ar: "المدير الطبي" };

const MEDICAL: Leader[] = [
  { img: "/leadership/md1.webp", name: { en: "Asim Alshanbari", ar: "عاصم الشنبري" } },
  { img: "/leadership/md2.webp", name: { en: "Majed Alnabulsi", ar: "ماجد النابلسي" } },
  { img: "/leadership/md3.webp", name: { en: "Majed Almansouri", ar: "ماجد المنصوري" } },
  { img: "/leadership/md4.webp", name: { en: "Prof. Mohammed Batais", ar: "البروفيسور محمد بطيس" } },
].map((m) => ({ ...m, icon: "stethoscope", title: MEDICAL_DIRECTOR }));

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
        className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--mx, 50%) var(--my, 30%), rgba(255,255,255,0.22), transparent 45%)",
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
        <div className="absolute -inset-y-10 -left-1/2 w-1/3 -skew-x-[20deg] bg-gradient-to-r from-transparent via-white/35 to-transparent -translate-x-full motion-safe:transition-transform motion-safe:duration-[1100ms] motion-safe:ease-out group-hover:translate-x-[520%]" />
      </div>
    </>
  );
}

function PreviewTag({ isRtl }: { isRtl: boolean }) {
  if (!PREVIEW) return null;
  return (
    <span className="absolute top-2.5 start-2.5 md:top-4 md:start-4 z-30 rounded-full bg-black/35 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white/90 ring-1 ring-white/25">
      {isRtl ? "صورة مؤقتة" : "Placeholder photo"}
    </span>
  );
}

function LeaderCard({ leader, isRtl, tier }: { leader: Leader; isRtl: boolean; tier: string }) {
  const name = isRtl ? leader.name.ar : leader.name.en;
  const title = isRtl ? leader.title.ar : leader.title.en;
  return (
    <article
      onMouseMove={trackPointer}
      className="group relative isolate aspect-[4/5] overflow-hidden rounded-[1.4rem] md:rounded-[2rem] bg-primary-fixed shadow-[0_24px_60px_-34px_rgba(0,27,61,0.55)] ring-1 ring-primary/10 motion-safe:transition-all motion-safe:duration-500 hover:-translate-y-2 hover:shadow-[0_40px_80px_-30px_rgba(0,77,153,0.55)] hover:ring-secondary-fixed-dim/70"
    >
      <Image
        src={leader.img}
        alt={`${name} — ${title}`}
        fill
        sizes="(min-width: 1280px) 340px, (min-width: 768px) 45vw, 50vw"
        className="object-cover object-top motion-safe:transition-transform motion-safe:duration-[900ms] motion-safe:ease-out group-hover:scale-[1.06]"
      />
      {/* Legibility gradient — deepens on hover so the glass panel reads */}
      <div
        aria-hidden
        className="absolute inset-0 z-10 bg-gradient-to-t from-[#001b3d]/85 via-[#001b3d]/10 to-transparent transition-opacity duration-500 group-hover:opacity-90"
      />
      <HoverLight />
      <PreviewTag isRtl={isRtl} />

      {/* Glass caption: name + title always visible; the panel frosts over and
          reveals the tier line on hover (touch devices still get the essentials). */}
      <div className="absolute inset-x-1.5 bottom-1.5 md:inset-x-3 md:bottom-3 z-30">
        <div className="rounded-[1.1rem] md:rounded-[1.4rem] border border-transparent p-3 md:p-4 transition-all duration-500 group-hover:border-white/30 group-hover:bg-white/12 group-hover:backdrop-blur-xl group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_10px_30px_-10px_rgba(0,0,0,0.4)]">
          <h3 className={`font-headline font-bold text-white text-[15px] sm:text-lg md:text-xl leading-tight ${isRtl ? "" : "tracking-tight"}`}>
            {name}
          </h3>
          <p className="mt-1 text-[11px] sm:text-[13px] font-semibold leading-snug text-secondary-fixed">{title}</p>
          <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-500 group-hover:grid-rows-[1fr] group-hover:opacity-100">
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

function CeoCard({ isRtl }: { isRtl: boolean }) {
  return (
    <article
      onMouseMove={trackPointer}
      className="group relative isolate overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#002a57] via-primary to-[#00395f] p-2 shadow-[0_50px_100px_-45px_rgba(0,27,61,0.8)] ring-1 ring-white/10 motion-safe:transition-all motion-safe:duration-500 hover:-translate-y-1.5 hover:shadow-[0_60px_110px_-40px_rgba(0,77,153,0.75)]"
    >
      <div aria-hidden className="pointer-events-none absolute -top-32 end-0 h-80 w-80 rounded-full bg-secondary-container/25 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 start-1/3 h-80 w-80 rounded-full bg-primary-fixed-dim/20 blur-3xl" />
      <HoverLight />

      <div className="relative z-10 grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-2">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
          <Image
            src={CEO.img}
            alt={`${isRtl ? CEO.name.ar : CEO.name.en} — ${isRtl ? CEO.title.ar : CEO.title.en}`}
            fill
            priority
            sizes="(min-width: 1024px) 440px, (min-width: 768px) 45vw, 92vw"
            className="object-cover object-top motion-safe:transition-transform motion-safe:duration-[900ms] motion-safe:ease-out group-hover:scale-[1.05]"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#001b3d]/40 to-transparent" />
          <PreviewTag isRtl={isRtl} />
        </div>

        <div className="relative flex flex-col justify-center p-6 md:p-10 lg:p-12">
          <span className={`inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 font-bold text-secondary-fixed backdrop-blur-md ${isRtl ? "text-[13px]" : "text-[11px] uppercase tracking-[0.18em]"}`}>
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              {CEO.icon}
            </span>
            {isRtl ? CEO.title.ar : CEO.title.en}
          </span>
          <h2 className={`mt-5 font-headline font-extrabold text-white text-4xl md:text-5xl ${isRtl ? "leading-[1.3]" : "tracking-tight leading-[1.05]"}`}>
            {isRtl ? CEO.name.ar : CEO.name.en}
          </h2>
          <div aria-hidden className="mt-6 h-px w-24 bg-gradient-to-r from-secondary-fixed-dim to-transparent rtl:bg-gradient-to-l" />
          <p className="mt-6 max-w-md text-base md:text-lg leading-relaxed text-white/75 [text-wrap:pretty]">
            {isRtl
              ? "يقود رؤية عيادتي ومسيرة نموها، ليجعل الرعاية الصحية المتخصصة أقرب وأيسر لكل أسرة في المملكة."
              : "Leading My Clinic's vision and growth, bringing specialized healthcare closer to every family in the Kingdom."}
          </p>

          {/* Glass stat strip — frosts brighter on hover */}
          <div className="mt-8 grid grid-cols-3 gap-2 rounded-2xl border border-white/15 bg-white/[0.07] p-2 backdrop-blur-xl transition-colors duration-500 group-hover:bg-white/[0.12]">
            {[
              { v: "2017", en: "Founded", ar: "التأسيس" },
              { v: "+24", en: "Specialties", ar: "تخصصا" },
              { v: "+300", en: "Professionals", ar: "متخصص" },
            ].map((s) => (
              <div key={s.en} className="rounded-xl px-2 py-3 text-center">
                <div className="font-headline text-xl md:text-2xl font-extrabold text-white" dir="ltr">{s.v}</div>
                <div className="mt-0.5 text-[11px] md:text-xs font-semibold text-white/60">{isRtl ? s.ar : s.en}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

/** Vertical org-chart connector between tiers. */
function Connector() {
  return (
    <div aria-hidden className="flex justify-center py-6 md:py-8">
      <div className="flex flex-col items-center">
        <div className="h-10 md:h-14 w-px bg-gradient-to-b from-primary/0 via-primary/30 to-primary/50" />
        <div className="h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-primary-fixed" />
      </div>
    </div>
  );
}

function TierHeading({ icon, en, ar, isRtl }: { icon: string; en: string; ar: string; isRtl: boolean }) {
  return (
    <div className="mb-8 md:mb-10 flex items-center gap-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-primary shadow-clinical ring-1 ring-primary/10">
        <span className="material-symbols-outlined text-[22px]">{icon}</span>
      </span>
      <h2 className={`font-headline font-bold text-primary text-2xl md:text-3xl ${isRtl ? "" : "tracking-tight"}`}>
        {isRtl ? ar : en}
      </h2>
      <div aria-hidden className="h-px flex-1 bg-gradient-to-r from-primary/25 to-transparent rtl:bg-gradient-to-l" />
    </div>
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

        <section className="relative max-w-6xl mx-auto px-4 md:px-8 -mt-14 md:-mt-20 pb-20 md:pb-28">
          {/* ── Tier 1: CEO ── */}
          <Reveal>
            <CeoCard isRtl={isRtl} />
          </Reveal>

          <Connector />

          {/* ── Tier 2: C-suite ── */}
          <Reveal>
            <TierHeading icon="groups" en="Executive Leadership" ar="القيادة التنفيذية" isRtl={isRtl} />
          </Reveal>
          <div className="flex flex-wrap justify-center gap-3 md:gap-6">
            {EXECUTIVES.map((l, i) => (
              <Reveal key={l.img} delay={i * 0.08} className="w-[calc(50%-6px)] md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                <LeaderCard leader={l} isRtl={isRtl} tier={execTier} />
              </Reveal>
            ))}
          </div>

          <Connector />

          {/* ── Tier 3: Medical directors ── */}
          <Reveal>
            <TierHeading icon="medical_services" en="Medical Leadership" ar="القيادة الطبية" isRtl={isRtl} />
          </Reveal>
          <div className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-4">
            {MEDICAL.map((l, i) => (
              <Reveal key={l.img} delay={i * 0.08}>
                <LeaderCard leader={l} isRtl={isRtl} tier={medTier} />
              </Reveal>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

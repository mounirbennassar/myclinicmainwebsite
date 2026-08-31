"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { useLang } from "@/app/i18n/context";
import { trackPhoneClick, trackWhatsAppClick } from "@/app/lib/tracking";
import SiteFooter from "@/app/components/SiteFooter";

import My360Aurora from "./components/My360Aurora";
import My360Icon from "./components/My360Icons";
import My360Form from "./components/My360Form";
import My360Nav from "./components/My360Nav";
import {
  AR,
  EMAIL,
  EN,
  FAMILY_TESTIMONIAL,
  PHONE_DISPLAY,
  PHONE_TEL,
  PROGRAMS,
  TESTIMONIALS,
  WEBSITE_DISPLAY,
  WHATSAPP_DISPLAY,
  whatsappLink,
} from "./content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const NAVY = "#003868";
const ACTION = "#004d99";
const HAIRLINE = "#E3E6EA";
const MUTED = "#797C82";
const TINT = "#F2F6FA";

/** Program accent lookup, for the care-journey timeline nodes. */
const ACCENT_BY_SLUG: Record<string, string> = Object.fromEntries(
  PROGRAMS.map((p) => [p.slug, p.accent])
);

// Every care-team card shows a real care interaction rather than an empty room.
const TEAM_PHOTOS = [
  {
    src: "/clinic/consultation.webp",
    altEn: "A consultant discussing an examination with a patient",
    altAr: "استشارية تناقش الفحص مع أحد المرضى",
  },
  {
    src: "/female-family/hero.webp",
    altEn: "A GP speaking with a parent and child patient",
    altAr: "طبيبة تتحدث مع أم وطفلتها",
  },
  {
    src: "/dental/dentalv2/consult-desk.webp",
    altEn: "A care team member reviewing information with a patient",
    altAr: "عضوة من فريق الرعاية تراجع المعلومات مع إحدى المريضات",
  },
];

export default function My360Client() {
  const { lang } = useLang();
  const isRtl = lang === "ar";
  const t = isRtl ? AR : EN;
  const root = useRef<HTMLDivElement>(null);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Desktop-only, deliberately. Phones run ZERO GSAP on this page: the
      // language switch re-renders the whole tree AND (with dependencies:
      // [lang]) reverts + rebuilds every ScrollTrigger at the same moment the
      // Arabic font loads — that spike was crashing mobile WebKit ("This page
      // couldn't load"). On mobile the markup below already renders its final
      // state (real counter values, everything visible), so skipping GSAP
      // costs nothing but the scroll-reveal garnish.
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        // ── Hero entrance ────────────────────────────────────
        const heroBits = gsap.utils.toArray<HTMLElement>(".m3-hero-in");
        if (heroBits.length) {
          gsap.from(heroBits, {
            autoAlpha: 0,
            y: 26,
            duration: 0.85,
            ease: "power3.out",
            stagger: 0.09,
          });
        }
        // ── Section reveals ──────────────────────────────────
        // Only pre-hide what starts BELOW the fold. Hiding every .m3-reveal made
        // the page's first paint depend on JS having run — a bad LCP, and a
        // blank page entirely if the bundle is slow or fails. Anything already
        // on screen just stays visible; it has nothing to animate in from.
        const els = gsap.utils
          .toArray<HTMLElement>(".m3-reveal")
          .filter((el) => el.getBoundingClientRect().top > window.innerHeight * 0.9);
        if (els.length) {
          gsap.set(els, { autoAlpha: 0, y: 30 });
          ScrollTrigger.batch(els, {
            start: "top 88%",
            onEnter: (batch) =>
              gsap.to(batch, {
                autoAlpha: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
                stagger: 0.08,
                overwrite: true,
              }),
          });
        }

        // ── Counters ─────────────────────────────────────────
        // The markup ships the FINAL value (so mobile/no-JS shows real numbers);
        // this resets to 0 pre-paint and counts up on scroll — desktop garnish.
        gsap.utils.toArray<HTMLElement>(".m3-count").forEach((el) => {
          const to = parseFloat(el.dataset.to || "0");
          const suffix = el.dataset.suffix || "";
          el.textContent = `0${suffix}`;
          const state = { v: 0 };
          ScrollTrigger.create({
            trigger: el,
            start: "top 88%",
            once: true,
            onEnter: () =>
              gsap.to(state, {
                v: to,
                duration: 1.5,
                ease: "power3.out",
                onUpdate: () => {
                  el.textContent = Math.round(state.v).toLocaleString("en-US") + suffix;
                },
              }),
          });
        });

      });

      return () => mm.revert();
    },
    // revertOnUpdate is load-bearing: without it @gsap/react re-runs the callback
    // on a language flip WITHOUT reverting, stacking duplicate ScrollTriggers.
    { scope: root, dependencies: [lang], revertOnUpdate: true }
  );

  const eyebrow = (text: string) => (
    <div className="text-[11px] font-bold uppercase tracking-[0.14em] md:text-[12px]" style={{ color: ACTION }}>
      {text}
    </div>
  );

  return (
    <div ref={root} className="bg-white" style={{ color: "#3D434D" }}>
      <My360Nav onJump={scrollTo} />

      {/* ── 1. Hero / Introducing My 360 ───────────────────────────── */}
      <header
        id="home"
        className="relative isolate overflow-hidden"
        style={{ background: "linear-gradient(180deg,#F2F6FA 0%,#ffffff 82%)" }}
      >
        {/* Background photo — a real My Clinic reception, drifting slowly under
            a direction-aware scrim so the headline always keeps its contrast.
            z-0, NOT -z-10: the header paints an opaque background gradient of
            its own, and a negative-z layer ends up underneath it — the photo
            renders but is never visible. At z-0 it sits above that background
            and still below the hero content, which follows it in the DOM. */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
          <Image
            src="/clinic/reception.webp"
            alt=""
            fill
            sizes="100vw"
            className="my360-hero-photo object-cover"
            preload
          />
          <div className="my360-hero-scrim absolute inset-0" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-white" />
        </div>

        <My360Aurora />

        <div className="relative mx-auto max-w-6xl px-5 pb-12 pt-8 md:px-8 md:pb-28 md:pt-20">
          <div className="max-w-3xl">
            <div
              className="m3-hero-in inline-flex items-center gap-2 rounded-full border bg-white px-3.5 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.12em] sm:px-4 sm:py-2 sm:text-[11.5px] sm:tracking-[0.14em]"
              style={{ borderColor: HAIRLINE, color: ACTION }}
            >
              <span className="h-[7px] w-[7px] rounded-full" style={{ background: ACTION }} />
              {t.meta.badge}
            </div>

            {/* The brand tagline lockup — bilingual in BOTH languages, exactly as
                it appears under the logo in the brochures. The second half is
                always the other language, so it gets its own dir. */}
            <div className="m3-hero-in mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13.5px] font-bold sm:mt-5 sm:text-[15px]">
              <span style={{ color: NAVY }}>{t.meta.tagline}</span>
              <span aria-hidden style={{ color: "#C9D6E4" }}>
                |
              </span>
              <span dir={isRtl ? "ltr" : "rtl"} style={{ color: MUTED }}>
                {t.meta.taglineAlt}
              </span>
            </div>

            <h1
              className="m3-hero-in mt-3 text-[clamp(1.7rem,5.8vw,4rem)] font-extrabold leading-[1.12] tracking-tight sm:mt-4"
              style={{ color: NAVY, textWrap: "pretty" }}
            >
              {t.meta.h1a}
              <span style={{ color: ACTION }}>{t.meta.h1b}</span>
            </h1>

            <p
              className="m3-hero-in mt-4 max-w-2xl text-[14.5px] leading-[1.65] sm:mt-6 sm:text-[17px] md:text-[18px]"
              style={{ textWrap: "pretty" }}
            >
              {t.meta.sub}
            </p>

            {/* Doc-specified CTAs: primary "Find Your Program", secondary
                "How My 360 Works". Both are in-page anchors — the phone and
                WhatsApp live in the sticky nav and in the closing band, so no
                contact route is lost by keeping this block uncluttered. */}
            <div className="m3-hero-in mt-7 flex flex-nowrap items-stretch gap-2.5 sm:mt-9 sm:gap-3.5">
              <button
                onClick={() => scrollTo("programs")}
                className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full px-3 py-3 text-[13px] font-bold text-white shadow-lg shadow-[#003868]/25 transition-all hover:bg-[#00294d] active:scale-[0.98] sm:flex-none sm:gap-2.5 sm:px-7 sm:py-4 sm:text-[15px]"
                style={{ background: NAVY }}
              >
                <My360Icon name="grid" className="h-4 w-4 shrink-0 sm:h-[17px] sm:w-[17px]" />
                <span className="truncate">{t.meta.ctaPrimary}</span>
              </button>
              <button
                onClick={() => scrollTo("approach")}
                className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border-[1.5px] bg-white px-3 py-3 text-[13px] font-bold transition-colors hover:border-[#004d99] active:scale-[0.98] sm:flex-none sm:gap-2.5 sm:px-7 sm:py-4 sm:text-[15px]"
                style={{ borderColor: "#C9D6E4", color: ACTION }}
              >
                <My360Icon name="route" className="h-4 w-4 shrink-0 sm:h-[17px] sm:w-[17px]" />
                <span className="truncate">{t.meta.ctaSecondary}</span>
              </button>
            </div>

            <div
              className="m3-hero-in mt-4 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[12px] font-bold sm:text-[12.5px]"
              style={{ background: "#E6F4EA", color: "#1E7B45" }}
            >
              <My360Icon name="tag" className="h-[15px] w-[15px] shrink-0" />
              {t.meta.noFees}
            </div>
          </div>

          {/* Program pills — a marquee on phones, a wrapped row from sm up.
              Full-bleed on mobile (negative margins cancel the hero padding) so
              the pills scroll off the screen edge rather than a padded box. */}
          <div className="m3-hero-in -mx-5 mt-7 overflow-hidden sm:mx-0 sm:mt-8 sm:overflow-visible">
            {/* Spacing is a per-pill margin on mobile, not a flex gap: with a
                gap the track measures 8 pills + 7 gaps, so half of it is not a
                whole copy and the loop jumps. From sm up it's a normal gap. */}
            <div className="my360-marquee sm:gap-2.5">
              {[0, 1].map((copy) =>
                PROGRAMS.map((p) => (
                  <button
                    key={`${copy}-${p.slug}`}
                    onClick={() => scrollTo("programs")}
                    // The duplicate copy exists only to make the loop seamless;
                    // hide it from assistive tech and from the sm+ wrapped row.
                    aria-hidden={copy === 1 || undefined}
                    tabIndex={copy === 1 ? -1 : undefined}
                    className={`me-2.5 inline-flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border bg-white px-3.5 py-2 text-[12px] font-semibold transition-shadow hover:shadow-md sm:me-0 sm:text-[12.5px] ${
                      copy === 1 ? "sm:hidden" : ""
                    }`}
                    style={{ borderColor: HAIRLINE, color: "#3D434D" }}
                  >
                    <span className="h-2 w-2 rounded-full" style={{ background: p.accent }} />
                    {isRtl ? p.short.ar : p.short.en}
                    <span style={{ color: MUTED }}>·</span>
                    {/* No dir override — the Arabic ages read "0–18 سنة", and
                        forcing LTR would lay the digits out on the wrong side. */}
                    <span style={{ color: MUTED }}>{isRtl ? p.age.ar : p.age.en}</span>
                  </button>
                ))
              )}
            </div>
          </div>

        </div>
      </header>

      {/* ── Stats bar ─────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto -mt-10 max-w-6xl px-5 md:px-8">
        <div
          className="m3-reveal relative grid grid-cols-2 gap-5 overflow-hidden rounded-[20px] px-6 py-7 md:grid-cols-4 md:gap-6 md:rounded-[22px] md:px-11 md:py-9"
          style={{ background: NAVY }}
        >
          {/* Slow sheen across the panel */}
          <span className="pointer-events-none absolute inset-y-0 -inset-x-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent animate-[my360-sheen_7s_ease-in-out_infinite]" />
          <span
            className="pointer-events-none absolute -end-10 -top-16 h-64 w-64 rounded-full opacity-[0.14]"
            style={{ background: "radial-gradient(circle,#fff,transparent 62%)" }}
          />
          {t.stats.map((s, i) => (
            <div key={i} className="relative">
              {/* dir sits on an inline <bdi>, NOT the block: on the block it
                  also flips text-align, so in Arabic the number hugged the left
                  edge while its label sat right — misaligned pairs. The block
                  inherits the page alignment; the bdi only fixes digit order. */}
              <div className="text-[26px] font-extrabold leading-none text-white md:text-[34px]">
                {/* Real value in the markup — mobile runs no GSAP, and desktop's
                    counter resets this to 0 pre-paint before counting up.

                    TWO things here are load-bearing, both because the GSAP
                    counter writes el.textContent, which destroys the text nodes
                    React rendered. React tolerates that until a re-render must
                    DELETE one of them — the suffix changes shape between
                    languages (" yrs" → "") — then removeChild throws
                    NotFoundError and React unmounts the whole page to Next's
                    error shell. That was the "This page couldn't load" crash on
                    the language switch.
                    1. key={lang}: the flip replaces the entire element instead
                       of reconciling inside it — deleting the bdi itself is
                       always valid, its own parent is untouched.
                    2. one template-literal child: a single text node, so React
                       never manages a multi-child structure in here at all. */}
                <bdi dir="ltr" key={lang} className="m3-count" data-to={s.value} data-suffix={s.suffix}>
                  {`${s.value.toLocaleString("en-US")}${s.suffix}`}
                </bdi>
              </div>
              <div className="mt-1.5 text-[12px] text-white/70 md:mt-2 md:text-[13px]">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 2. Why My 360? ────────────────────────────────────────── */}
      <section id="why" className="my360-cv mt-16 scroll-mt-28 py-16 md:mt-24 md:py-24" style={{ background: TINT }}>
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="m3-reveal flex flex-wrap items-end justify-between gap-5">
            <div className="max-w-lg">
              {eyebrow(t.why.eyebrow)}
              <h2
                className="mt-2.5 text-[clamp(1.4rem,3.6vw,2.25rem)] font-bold leading-[1.25]"
                style={{ color: NAVY, textWrap: "pretty" }}
              >
                {t.why.title}
              </h2>
            </div>
            <p className="max-w-xl text-[14.5px] leading-[1.7] md:text-[15px]">{t.why.sub}</p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {t.why.items.map((item, i) => (
              <div
                key={i}
                className="m3-reveal flex gap-4 rounded-2xl border bg-white p-6 transition-shadow hover:shadow-[0_12px_30px_rgba(0,56,104,0.1)]"
                style={{ borderColor: HAIRLINE }}
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: TINT, color: ACTION }}
                >
                  <My360Icon name={item.mark} className="h-[21px] w-[21px]" />
                </div>
                <div>
                  <div className="text-[15.5px] font-bold" style={{ color: NAVY }}>
                    {item.title}
                  </div>
                  <p className="mt-1.5 text-[13.5px] leading-[1.55]">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. My 360 approach / how it works ─────────────────────── */}
      <section id="approach" className="my360-cv mx-auto max-w-6xl scroll-mt-28 px-5 pt-16 md:px-8 md:pt-24">
        <div className="m3-reveal mx-auto max-w-2xl text-center">
          {eyebrow(t.approach.eyebrow)}
          <h2
            className="mt-2.5 text-[clamp(1.4rem,3.6vw,2.25rem)] font-bold leading-[1.25]"
            style={{ color: NAVY, textWrap: "pretty" }}
          >
            {t.approach.title}
          </h2>
          <p className="mt-3.5 text-[14.5px] leading-[1.7] md:text-[16px]" style={{ textWrap: "pretty" }}>
            {t.approach.body}
          </p>
        </div>

        {/* The three joining steps. On md+ a hairline runs behind the row and
            ties them into one process rather than three loose cards. */}
        <div className="relative mt-10 md:mt-12">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-[16%] top-[46px] hidden h-[2px] md:block"
            style={{ background: "linear-gradient(90deg,#C9D6E4,#C9D6E4)" }}
          />
          <div className="relative grid gap-5 md:grid-cols-3 md:gap-6">
            {t.approach.steps.map((step, i) => (
              <div
                key={i}
                className="m3-reveal flex items-start gap-4 rounded-[18px] border bg-white p-6 shadow-[0_2px_8px_rgba(0,56,104,0.05)] transition-shadow hover:shadow-[0_14px_32px_rgba(0,56,104,0.1)] md:flex-col md:items-center md:gap-0 md:pt-8 md:text-center"
                style={{ borderColor: HAIRLINE }}
              >
                <div
                  className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl md:h-14 md:w-14"
                  style={{ background: NAVY, color: "white" }}
                >
                  <My360Icon name={step.mark} className="h-[22px] w-[22px] md:h-6 md:w-6" />
                  <span
                    className="absolute -end-1.5 -top-1.5 flex h-[22px] w-[22px] items-center justify-center rounded-full text-[11px] font-extrabold text-white ring-2 ring-white"
                    style={{ background: ACTION }}
                    dir="ltr"
                  >
                    {i + 1}
                  </span>
                </div>
                <div className="md:mt-4">
                  <div className="text-[16px] font-extrabold" style={{ color: NAVY }}>
                    {step.title}
                  </div>
                  <p className="mt-1.5 text-[13.5px] leading-[1.6]">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p
          className="m3-reveal mx-auto mt-8 max-w-2xl text-center text-[15px] font-semibold leading-[1.65] md:mt-10 md:text-[17px]"
          style={{ color: NAVY, textWrap: "pretty" }}
        >
          {t.approach.closing}
        </p>
      </section>

      {/* ── 4. Explore My 360 programs ────────────────────────────── */}
      <section id="programs" className="my360-cv mx-auto max-w-6xl scroll-mt-28 px-5 pt-16 md:px-8 md:pt-24">
        <div className="m3-reveal max-w-3xl">
          {eyebrow(t.programs.eyebrow)}
          <h2
            className="mt-2.5 text-[clamp(1.4rem,3.6vw,2.25rem)] font-bold leading-[1.25]"
            style={{ color: NAVY, textWrap: "pretty" }}
          >
            {t.programs.title}
          </h2>
          <p className="mt-3 text-[14.5px] leading-[1.7] md:mt-3.5 md:text-[16px]">{t.programs.sub}</p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {PROGRAMS.map((p) => (
            <article
              key={p.slug}
              className="m3-reveal group relative flex flex-col gap-4 overflow-hidden rounded-[18px] border bg-white p-6 shadow-[0_2px_8px_rgba(0,56,104,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_38px_rgba(0,56,104,0.14)] md:p-7"
              style={{ borderColor: HAIRLINE }}
            >
              {/* Accent hairline that grows on hover */}
              <span
                className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                style={{ background: p.accent }}
              />
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                    style={{ background: p.tint, color: p.accent }}
                  >
                    <My360Icon name={p.slug} className="h-[22px] w-[22px]" />
                  </div>
                  <div className="text-[19px] font-extrabold leading-tight md:text-[20px]" style={{ color: NAVY }}>
                    {isRtl ? p.name.ar : p.name.en}
                  </div>
                </div>
                <span
                  className="shrink-0 rounded-full px-3 py-1.5 text-[12px] font-bold"
                  style={{ background: p.tint, color: p.accent }}
                >
                  {isRtl ? p.age.ar : p.age.en}
                </span>
              </div>

              <p className="text-[15px] font-bold leading-[1.45]" style={{ color: p.accent }}>
                {isRtl ? p.tagline.ar : p.tagline.en}
              </p>

              <div className="rounded-xl px-4 py-3" style={{ background: TINT }}>
                <div
                  className="text-[10.5px] font-bold uppercase tracking-[0.12em]"
                  style={{ color: MUTED }}
                >
                  {t.programs.whoLabel}
                </div>
                <p className="mt-1 text-[13.5px] leading-[1.5]" style={{ color: NAVY }}>
                  {isRtl ? p.who.ar : p.who.en}
                </p>
              </div>

              <ul className="flex flex-1 flex-col gap-2 text-[13.5px] leading-[1.5]" style={{ color: "#3D434D" }}>
                {p.points.map((pt, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="font-bold" style={{ color: p.accent }}>
                      ✓
                    </span>
                    {isRtl ? pt.ar : pt.en}
                  </li>
                ))}
              </ul>

              <div
                className="flex items-start gap-2.5 border-t pt-4 text-[12.5px] leading-[1.5]"
                style={{ borderColor: HAIRLINE, color: MUTED }}
              >
                <My360Icon name="clock" className="mt-[1px] h-4 w-4 shrink-0" />
                {isRtl ? p.rhythm.ar : p.rhythm.en}
              </div>

              <button
                onClick={() => scrollTo("my360-contact")}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border-[1.5px] px-5 py-2.5 text-[13.5px] font-bold transition-colors active:scale-[0.98]"
                style={{ borderColor: p.accent, color: p.accent }}
              >
                {t.programs.cta}
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* ── 5. Your care journey ──────────────────────────────────── */}
      <section id="journey" className="my360-cv mt-16 scroll-mt-28 py-16 md:mt-24 md:py-24" style={{ background: TINT }}>
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="m3-reveal max-w-2xl">
            {eyebrow(t.journey.eyebrow)}
            <h2
              className="mt-2.5 text-[clamp(1.4rem,3.6vw,2.25rem)] font-bold leading-[1.25]"
              style={{ color: NAVY, textWrap: "pretty" }}
            >
              {t.journey.title}
            </h2>
            <p className="mt-3 text-[14.5px] leading-[1.7] md:mt-3.5 md:text-[16px]">{t.journey.body}</p>
          </div>

          {/* The lifeline. One rail element, re-oriented at lg: vertical down
              the start edge on small screens, horizontal behind the dots on
              wide ones. It deliberately runs past both ends and fades out —
              this is a life, not a closed range. */}
          <div className="relative mt-10 md:mt-12">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-3 start-[7px] w-[2px] lg:inset-x-0 lg:inset-y-auto lg:top-[7px] lg:h-[2px] lg:w-auto"
              style={{
                background:
                  "linear-gradient(to bottom,transparent,#C9D6E4 6%,#C9D6E4 94%,transparent)",
              }}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-[7px] hidden h-[2px] lg:block"
              style={{
                background:
                  "linear-gradient(to right,transparent,#C9D6E4 7%,#C9D6E4 93%,transparent)",
              }}
            />

            <ol className="relative flex flex-col gap-5 lg:flex-row lg:gap-2">
              {t.journey.milestones.map((m, i) => (
                <li
                  key={i}
                  className="m3-reveal flex flex-1 items-start gap-4 lg:flex-col lg:items-stretch lg:gap-3"
                >
                  <span
                    className="mt-[3px] h-4 w-4 shrink-0 rounded-full ring-4 lg:mt-0"
                    style={{
                      background: ACCENT_BY_SLUG[m.slug] || ACTION,
                      // The ring hides the rail where it passes under the dot.
                      boxShadow: `0 0 0 4px ${TINT}`,
                    }}
                  />
                  <div>
                    <div className="text-[13px] font-extrabold" style={{ color: NAVY }}>
                      {m.age}
                    </div>
                    <div className="mt-0.5 text-[13px] leading-[1.45]" style={{ color: MUTED }}>
                      {m.label}
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            {/* The Diabetes program is not a life stage — it is a parallel track
                that plugs into any point on the line above. */}
            <div
              className="m3-reveal mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-dashed bg-white px-5 py-4 md:mt-9"
              style={{ borderColor: "#F9812255" }}
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{ background: "#FBEACF", color: "#F98122" }}
              >
                <My360Icon name="diabetes" className="h-[18px] w-[18px]" />
              </span>
              <span className="text-[13px] font-extrabold" style={{ color: "#F98122" }}>
                {t.journey.parallel.age}
              </span>
              <span className="text-[14px] font-bold" style={{ color: NAVY }}>
                {t.journey.parallel.label}
              </span>
              <span className="text-[13px]" style={{ color: MUTED }}>
                {t.journey.parallel.note}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Your care team ─────────────────────────────────────── */}
      <section id="team" className="my360-cv mx-auto max-w-6xl scroll-mt-28 px-5 pt-16 md:px-8 md:pt-24">
        <div className="m3-reveal max-w-2xl">
          {eyebrow(t.team.eyebrow)}
          <h2 className="mt-2.5 text-[clamp(1.4rem,3.6vw,2.25rem)] font-bold leading-[1.25]" style={{ color: NAVY }}>
            {t.team.title}
          </h2>
          <p className="mt-3 text-[14.5px] leading-[1.7] md:mt-3.5 md:text-[16px]">{t.team.sub}</p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {t.team.members.map((m, i) => (
            <article
              key={i}
              className="m3-reveal group overflow-hidden rounded-[18px] border bg-white shadow-[0_2px_8px_rgba(0,56,104,0.06)] transition-shadow hover:shadow-[0_16px_38px_rgba(0,56,104,0.13)]"
              style={{ borderColor: HAIRLINE }}
            >
              <div className="relative h-[210px] overflow-hidden">
                <Image
                  src={TEAM_PHOTOS[i].src}
                  alt={isRtl ? TEAM_PHOTOS[i].altAr : TEAM_PHOTOS[i].altEn}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#003868]/45 to-transparent" />
                <span className="absolute bottom-3 start-4 text-[42px] font-extrabold leading-none text-white/25" dir="ltr">
                  0{i + 1}
                </span>
              </div>
              <div className="p-6">
                <div className="text-[17px] font-extrabold" style={{ color: NAVY }}>
                  {m.role}
                </div>
                <div
                  className="mt-1 text-[12px] font-semibold uppercase tracking-[0.08em]"
                  style={{ color: ACTION }}
                >
                  {m.tag}
                </div>
                <p className="mt-2.5 text-[14px] leading-[1.6]">{m.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── 7. Your care throughout the year ──────────────────────── */}
      <section id="year" className="my360-cv mx-auto max-w-6xl scroll-mt-28 px-5 pt-16 md:px-8 md:pt-24">
        <div className="m3-reveal max-w-2xl">
          {eyebrow(t.year.eyebrow)}
          <h2 className="mt-2.5 text-[clamp(1.4rem,3.6vw,2.25rem)] font-bold leading-[1.25]" style={{ color: NAVY }}>
            {t.year.title}
          </h2>
          <p className="mt-3 text-[14.5px] leading-[1.7] md:mt-3.5 md:text-[16px]">{t.year.body}</p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.year.groups.map((g, i) => (
            <div
              key={i}
              className="m3-reveal flex flex-col gap-4 rounded-[18px] border bg-white p-6 transition-shadow hover:shadow-[0_12px_30px_rgba(0,56,104,0.1)]"
              style={{ borderColor: HAIRLINE }}
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl"
                style={{ background: TINT, color: ACTION }}
              >
                <My360Icon name={g.mark} className="h-[21px] w-[21px]" />
              </div>
              <div>
                <div className="text-[15px] font-extrabold leading-tight" style={{ color: NAVY }}>
                  {g.cadence}
                </div>
                {g.note && (
                  <div className="mt-1.5 inline-flex rounded-md px-2 py-0.5 text-[11px] font-bold" style={{ background: "#FBEACF", color: "#B4550C" }}>
                    {g.note}
                  </div>
                )}
              </div>
              <ul className="flex flex-wrap gap-1.5">
                {g.items.map((item, j) => (
                  <li
                    key={j}
                    className="rounded-lg px-2.5 py-1 text-[12.5px] font-medium"
                    style={{ background: TINT, color: "#3D434D" }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p
          className="m3-reveal mx-auto mt-8 max-w-3xl text-center text-[14.5px] leading-[1.7] md:mt-10 md:text-[16px]"
          style={{ textWrap: "pretty" }}
        >
          {t.year.closing}
        </p>
      </section>

      {/* ── 8. Medical experts / testimonials ─────────────────────── */}
      <section className="my360-cv mt-16 py-16 md:mt-24 md:py-24" style={{ background: TINT }}>
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="m3-reveal mx-auto max-w-2xl text-center">
            {eyebrow(t.testimonials.eyebrow)}
            <h2 className="mt-2.5 text-[clamp(1.4rem,3.6vw,2.25rem)] font-bold leading-[1.25]" style={{ color: NAVY }}>
              {t.testimonials.title}
            </h2>
            <p className="mt-3.5 text-[14.5px] leading-[1.7] md:text-[15.5px]">{t.testimonials.sub}</p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {TESTIMONIALS.map((testimonial, i) => (
              <figure
                key={i}
                className="m3-reveal relative flex flex-col gap-5 overflow-hidden rounded-[20px] border bg-white p-7 transition-shadow hover:shadow-[0_14px_34px_rgba(0,56,104,0.11)] md:p-8"
                style={{ borderColor: HAIRLINE }}
              >
                <span className="absolute inset-x-0 top-0 h-[3px]" style={{ background: testimonial.accent }} />
                <div className="flex items-center justify-between gap-4">
                  <div
                    className="rounded-lg px-3 py-1.5 text-[12px] font-bold"
                    style={{ background: `${testimonial.accent}18`, color: testimonial.accent }}
                  >
                    {isRtl ? testimonial.programAr : testimonial.programEn}
                  </div>
                  <div className="text-[44px] font-extrabold leading-[0.5] opacity-15" style={{ color: NAVY }}>
                    &ldquo;
                  </div>
                </div>
                <blockquote className="flex-1 text-[15px] leading-[1.65]">
                  {isRtl ? testimonial.quoteAr : testimonial.quoteEn}
                </blockquote>
                <figcaption className="border-t pt-4 text-[13px] font-bold" style={{ borderColor: HAIRLINE, color: NAVY }}>
                  {isRtl ? testimonial.memberAr : testimonial.memberEn}
                </figcaption>
              </figure>
            ))}
          </div>

          {/* The multi-program family quote — the one that proves the "one
              clinic, every stage" promise, so it gets the full width. */}
          <figure
            className="m3-reveal relative mt-5 overflow-hidden rounded-[20px] p-7 md:p-10"
            style={{ background: NAVY }}
          >
            <span className="pointer-events-none absolute inset-y-0 -inset-x-1/2 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent animate-[my360-sheen_9s_ease-in-out_infinite]" />
            <div className="relative flex flex-col gap-5">
              <div className="inline-flex w-fit rounded-lg bg-white/[0.14] px-3 py-1.5 text-[12px] font-bold text-white">
                {isRtl ? FAMILY_TESTIMONIAL.programAr : FAMILY_TESTIMONIAL.programEn}
              </div>
              <blockquote
                className="max-w-3xl text-[17px] font-semibold leading-[1.6] text-white md:text-[20px]"
                style={{ textWrap: "pretty" }}
              >
                {isRtl ? FAMILY_TESTIMONIAL.quoteAr : FAMILY_TESTIMONIAL.quoteEn}
              </blockquote>
              <figcaption className="text-[13px] font-bold text-white/70">
                {isRtl ? FAMILY_TESTIMONIAL.memberAr : FAMILY_TESTIMONIAL.memberEn}
              </figcaption>
            </div>
          </figure>
        </div>
      </section>

      {/* ── 9. FAQs ───────────────────────────────────────────────── */}
      <section id="faq" className="my360-cv mx-auto max-w-3xl scroll-mt-28 px-5 pt-16 md:px-8 md:pt-24">
        <div className="m3-reveal text-center">
          {eyebrow(t.faq.eyebrow)}
          <h2 className="mt-2.5 text-[clamp(1.4rem,3.6vw,2.25rem)] font-bold leading-[1.25]" style={{ color: NAVY }}>
            {t.faq.title}
          </h2>
        </div>

        <div className="mt-9 flex flex-col gap-3">
          {t.faq.items.map((item, i) => (
            <details
              key={i}
              open={i === 0}
              className="m3-reveal group rounded-2xl border bg-white [&_summary::-webkit-details-marker]:hidden"
              style={{ borderColor: HAIRLINE }}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[14.5px] font-bold md:px-6 md:py-5 md:text-[15.5px]" style={{ color: NAVY }}>
                {item.q}
                <span
                  className="shrink-0 text-xl font-extrabold transition-transform duration-300 group-open:rotate-45"
                  style={{ color: ACTION }}
                >
                  +
                </span>
              </summary>
              <p className="px-5 pb-4 text-[13.5px] leading-[1.65] md:px-6 md:pb-5 md:text-[14px]">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── 10. Join My 360 / final CTA ───────────────────────────── */}
      <section id="my360-contact" className="my360-cv mx-auto max-w-6xl scroll-mt-28 px-5 py-16 md:px-8 md:py-24">
        <div
          className="m3-reveal relative grid items-start gap-8 overflow-hidden rounded-[24px] p-6 sm:p-8 md:gap-10 md:p-12 lg:grid-cols-[1fr_400px]"
          style={{ background: NAVY }}
        >
          <span className="pointer-events-none absolute inset-y-0 -inset-x-1/2 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent animate-[my360-sheen_9s_ease-in-out_infinite]" />
          <span
            className="pointer-events-none absolute -bottom-24 -start-16 h-80 w-80 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle,#fff,transparent 65%)" }}
          />

          <div className="relative">
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/60 md:text-[12px]">
              {t.contact.eyebrow}
            </div>
            <h2
              className="mt-2.5 text-[clamp(1.45rem,4vw,2.4rem)] font-extrabold leading-[1.2] text-white"
              style={{ textWrap: "pretty" }}
            >
              {t.contact.title}
            </h2>
            <p className="mt-3 max-w-md text-[14px] leading-[1.65] text-white/80 md:mt-4 md:text-[15.5px]">{t.contact.body}</p>

            {/* The three joining steps again, condensed — the guide asks for
                them here so the closing band answers "what happens next?". */}
            <ol className="mt-7 flex flex-col gap-2.5 border-y border-white/15 py-5 md:flex-row md:gap-6">
              {t.approach.steps.map((step, i) => (
                <li key={i} className="flex flex-1 items-center gap-3">
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.14] text-[12px] font-extrabold text-white"
                    dir="ltr"
                  >
                    {i + 1}
                  </span>
                  <span className="text-[13.5px] font-bold text-white">{step.title}</span>
                </li>
              ))}
            </ol>

            <div className="mt-6 flex flex-col gap-3 text-[14.5px] font-medium text-white">
              <a href={`tel:${PHONE_TEL}`} onClick={trackPhoneClick} className="flex items-center gap-3 hover:text-white">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-white/[0.12]">
                  <My360Icon name="phone" className="h-4 w-4" />
                </span>
                <span dir="ltr">{PHONE_DISPLAY}</span>
              </a>
              <a
                href={whatsappLink(isRtl)}
                onClick={trackWhatsAppClick}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:text-white"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-white/[0.12]">
                  <My360Icon name="whatsapp" className="h-4 w-4" />
                </span>
                <span dir="ltr">WhatsApp {WHATSAPP_DISPLAY}</span>
              </a>
              <a href={`mailto:${EMAIL}`} className="flex items-center gap-3 hover:text-white">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-white/[0.12]">
                  <My360Icon name="mail" className="h-4 w-4" />
                </span>
                <span dir="ltr">{EMAIL}</span>
              </a>
              <a href="/" className="flex items-center gap-3 hover:text-white">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-white/[0.12]">
                  <My360Icon name="globe" className="h-4 w-4" />
                </span>
                <span dir="ltr">{WEBSITE_DISPLAY}</span>
              </a>
              <div className="flex items-center gap-3 text-[13px] font-normal text-white/70">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-white/[0.12]">
                  <My360Icon name="clock" className="h-4 w-4" />
                </span>
                {t.contact.hours}
              </div>
            </div>
          </div>

          <div className="relative">
            <My360Form />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

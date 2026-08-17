"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { useLang } from "@/app/i18n/context";
import { trackPhoneClick, trackWhatsAppClick } from "@/app/lib/tracking";
import { doctorAvatar } from "@/app/lib/doctor-avatar";
import SiteFooter from "@/app/components/SiteFooter";

import My360Aurora from "./components/My360Aurora";
import My360Icon from "./components/My360Icons";
import My360Form from "./components/My360Form";
import My360Nav from "./components/My360Nav";
import {
  AR,
  EMAIL,
  EN,
  PHONE_DISPLAY,
  PHONE_TEL,
  PROGRAMS,
  QUOTES,
  WHATSAPP_DISPLAY,
  whatsappLink,
} from "./content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const NAVY = "#003868";
const ACTION = "#004d99";
const HAIRLINE = "#E3E6EA";
const MUTED = "#797C82";

// Team cards use real My Clinic interiors rather than stock placeholders.
const TEAM_PHOTOS = ["/clinic/consultation.webp", "/clinic/exam-room.webp", "/clinic/reception.webp"];

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

      mm.add("(prefers-reduced-motion: no-preference)", () => {
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
        gsap.from(".m3-hero-card", {
          autoAlpha: 0,
          scale: 0.9,
          y: 18,
          duration: 0.7,
          ease: "back.out(1.6)",
          stagger: 0.14,
          delay: 0.5,
        });

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
        gsap.utils.toArray<HTMLElement>(".m3-count").forEach((el) => {
          const to = parseFloat(el.dataset.to || "0");
          const suffix = el.dataset.suffix || "";
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

        // ── Calendar rows cascade in ─────────────────────────
        const rows = gsap.utils.toArray<HTMLElement>(".m3-row");
        if (rows.length) {
          gsap.from(rows, {
            autoAlpha: 0,
            x: isRtl ? 18 : -18,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.06,
            scrollTrigger: { trigger: rows[0], start: "top 85%", once: true },
          });
        }
      });

      return () => mm.revert();
    },
    // revertOnUpdate is load-bearing: without it @gsap/react re-runs the callback
    // on a language flip WITHOUT reverting, stacking duplicate ScrollTriggers.
    { scope: root, dependencies: [lang], revertOnUpdate: true }
  );

  const eyebrow = (text: string) => (
    <div className="text-[12px] font-bold uppercase tracking-[0.14em]" style={{ color: ACTION }}>
      {text}
    </div>
  );

  return (
    <div ref={root} className="bg-white" style={{ color: "#3D434D" }}>
      <My360Nav onJump={scrollTo} />

      {/* ── Hero ──────────────────────────────────────────────────── */}
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

        <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-12 md:px-8 md:pb-28 md:pt-20">
          <div className="max-w-3xl">
            <div
              className="m3-hero-in inline-flex items-center gap-2 rounded-full border bg-white/90 px-4 py-2 text-[11.5px] font-bold uppercase tracking-[0.14em] backdrop-blur"
              style={{ borderColor: HAIRLINE, color: ACTION }}
            >
              <span className="h-[7px] w-[7px] rounded-full" style={{ background: ACTION }} />
              {t.meta.badge}
            </div>

            <h1
              className="m3-hero-in mt-6 text-[clamp(1.95rem,5.8vw,4rem)] font-extrabold leading-[1.1] tracking-tight"
              style={{ color: NAVY, textWrap: "pretty" }}
            >
              {t.meta.h1a}
              <span style={{ color: ACTION }}>{t.meta.h1b}</span>
              {t.meta.h1c}
            </h1>

            <p
              className="m3-hero-in mt-6 max-w-2xl text-[17px] leading-[1.7] md:text-[18px]"
              style={{ textWrap: "pretty" }}
            >
              {t.meta.sub}
            </p>

            <div className="m3-hero-in mt-9 flex flex-wrap gap-3.5">
              <a
                href={`tel:${PHONE_TEL}`}
                onClick={trackPhoneClick}
                className="inline-flex items-center gap-2.5 rounded-full px-7 py-4 text-[15px] font-bold text-white shadow-lg shadow-[#003868]/25 transition-all hover:bg-[#00294d] active:scale-[0.98]"
                style={{ background: NAVY }}
              >
                <My360Icon name="phone" className="h-[17px] w-[17px]" />
                {t.meta.ctaBook}
              </a>
              <a
                href={whatsappLink(isRtl)}
                onClick={trackWhatsAppClick}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full border-[1.5px] bg-white px-7 py-4 text-[15px] font-bold transition-colors hover:border-[#004d99]"
                style={{ borderColor: "#C9D6E4", color: ACTION }}
              >
                <My360Icon name="whatsapp" className="h-[17px] w-[17px]" />
                {t.meta.ctaWhatsApp}
              </a>
            </div>

            {/* Program pills */}
            <div className="m3-hero-in mt-8 flex flex-wrap gap-2.5">
              {PROGRAMS.map((p) => (
                <button
                  key={p.slug}
                  onClick={() => scrollTo("programs")}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border bg-white/90 px-3.5 py-2 text-[12.5px] font-semibold backdrop-blur transition-shadow hover:shadow-md"
                  style={{ borderColor: HAIRLINE, color: "#3D434D" }}
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: p.accent }} />
                  {(isRtl ? p.name.ar : p.name.en).replace(/^My360 |^عيادتي 360 /, "")}
                  <span style={{ color: MUTED }}>·</span>
                  {/* No dir override — the Arabic ages read "0–18 سنة", and
                      forcing LTR would lay the digits out on the wrong side. */}
                  <span style={{ color: MUTED }}>{isRtl ? p.age.ar : p.age.en}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Floating proof cards — inline on mobile, offset on desktop */}
          <div className="mt-9 flex flex-wrap gap-3 lg:absolute lg:inset-y-0 lg:end-8 lg:mt-0 lg:block lg:w-[250px]">
            <div
              className="m3-hero-card flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-[0_10px_34px_rgba(0,56,104,0.16)] lg:absolute lg:top-[26%] lg:end-0"
              style={{ border: `1px solid ${HAIRLINE}` }}
            >
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: "#02AEAD" }} />
              <div>
                <div className="text-[13.5px] font-bold" style={{ color: NAVY }}>
                  {t.meta.heroCardTitle}
                </div>
                <div className="text-[11.5px]" style={{ color: MUTED }}>
                  {t.meta.heroCardSub}
                </div>
              </div>
            </div>

            <div
              className="m3-hero-card rounded-2xl bg-white px-6 py-4 shadow-[0_10px_34px_rgba(0,56,104,0.16)] lg:absolute lg:bottom-[24%] lg:end-10"
              style={{ border: `1px solid ${HAIRLINE}` }}
            >
              <div className="text-[27px] font-extrabold leading-none" style={{ color: NAVY }} dir="ltr">
                {t.meta.heroStatValue}
              </div>
              <div className="mt-1 text-[12px]" style={{ color: MUTED }}>
                {t.meta.heroStatLabel}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Stats bar ─────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto -mt-10 max-w-6xl px-5 md:px-8">
        <div
          className="m3-reveal relative grid grid-cols-2 gap-6 overflow-hidden rounded-[22px] px-8 py-9 md:grid-cols-4 md:px-11"
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
              <div className="text-[32px] font-extrabold leading-none text-white md:text-[34px]" dir="ltr">
                <span className="m3-count" data-to={s.value} data-suffix={s.suffix}>
                  0{s.suffix}
                </span>
              </div>
              <div className="mt-2 text-[13px] text-white/70">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Programs ──────────────────────────────────────────────── */}
      <section id="programs" className="mx-auto max-w-6xl scroll-mt-28 px-5 pt-16 md:px-8 md:pt-28">
        <div className="m3-reveal max-w-2xl">
          {eyebrow(t.programs.eyebrow)}
          <h2
            className="mt-2.5 text-[clamp(1.7rem,3.6vw,2.25rem)] font-bold leading-[1.25]"
            style={{ color: NAVY, textWrap: "pretty" }}
          >
            {t.programs.title}
          </h2>
          <p className="mt-3.5 text-[16px] leading-[1.65]">{t.programs.sub}</p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PROGRAMS.map((p) => (
            <article
              key={p.slug}
              className="m3-reveal group relative flex flex-col gap-3.5 overflow-hidden rounded-[18px] border bg-white p-6 shadow-[0_2px_8px_rgba(0,56,104,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_38px_rgba(0,56,104,0.14)]"
              style={{ borderColor: HAIRLINE }}
            >
              {/* Accent hairline that grows on hover */}
              <span
                className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                style={{ background: p.accent }}
              />
              <div className="flex items-center justify-between">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                  style={{ background: p.tint, color: p.accent }}
                >
                  <My360Icon name={p.slug} className="h-[22px] w-[22px]" />
                </div>
                <span
                  className="rounded-full px-3 py-1.5 text-[12px] font-bold"
                  style={{ background: p.tint, color: p.accent }}
                >
                  {isRtl ? p.age.ar : p.age.en}
                </span>
              </div>

              <div>
                <div className="text-[20px] font-extrabold" style={{ color: NAVY }}>
                  {isRtl ? p.name.ar : p.name.en}
                </div>
                <div className="mt-0.5 font-arabic text-[13px]" style={{ color: MUTED }} dir="rtl">
                  {p.tagline.ar}
                </div>
              </div>

              <p className="text-[14px] leading-[1.6]">{isRtl ? p.blurb.ar : p.blurb.en}</p>

              <ul className="flex flex-col gap-2 text-[13.5px] leading-[1.5]" style={{ color: "#3D434D" }}>
                {p.points.map((pt, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="font-bold" style={{ color: p.accent }}>
                      ✓
                    </span>
                    {isRtl ? pt.ar : pt.en}
                  </li>
                ))}
              </ul>

              <a
                href={p.brochure}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[13.5px] font-bold hover:underline"
                style={{ color: ACTION }}
              >
                <My360Icon name="download" className="h-4 w-4" />
                {t.programs.download}
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* ── Why My360 ─────────────────────────────────────────────── */}
      <section id="why" className="mt-16 scroll-mt-28 py-16 md:mt-28 md:py-24" style={{ background: "#F2F6FA" }}>
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="m3-reveal flex flex-wrap items-end justify-between gap-5">
            <div className="max-w-xl">
              {eyebrow(t.why.eyebrow)}
              <h2
                className="mt-2.5 text-[clamp(1.7rem,3.6vw,2.25rem)] font-bold leading-[1.25]"
                style={{ color: NAVY, textWrap: "pretty" }}
              >
                {t.why.title}
              </h2>
            </div>
            <p className="max-w-md text-[15px] leading-[1.65]">{t.why.sub}</p>
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
                  style={{ background: "#F2F6FA", color: ACTION }}
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

      {/* ── Care team ─────────────────────────────────────────────── */}
      <section id="team" className="mx-auto max-w-6xl scroll-mt-28 px-5 pt-16 md:px-8 md:pt-28">
        <div className="m3-reveal max-w-2xl">
          {eyebrow(t.team.eyebrow)}
          <h2 className="mt-2.5 text-[clamp(1.7rem,3.6vw,2.25rem)] font-bold leading-[1.25]" style={{ color: NAVY }}>
            {t.team.title}
          </h2>
          <p className="mt-3.5 text-[16px] leading-[1.65]">{t.team.sub}</p>
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
                  src={TEAM_PHOTOS[i]}
                  alt=""
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

      {/* ── Annual care calendar ──────────────────────────────────── */}
      <section id="calendar" className="mx-auto max-w-6xl scroll-mt-28 px-5 pt-16 md:px-8 md:pt-28">
        <div className="grid items-start gap-9 lg:grid-cols-[1fr_330px]">
          <div>
            <div className="m3-reveal">
              {eyebrow(t.calendar.eyebrow)}
              <h2
                className="mb-6 mt-2.5 text-[clamp(1.7rem,3.6vw,2.25rem)] font-bold leading-[1.25]"
                style={{ color: NAVY }}
              >
                {t.calendar.title}
              </h2>
            </div>

            {/* Four columns don't fit a phone without cramping every cell, so the
                table scrolls sideways below its natural width instead. */}
            <div
              className="m3-reveal overflow-x-auto rounded-2xl border shadow-[0_2px_8px_rgba(0,56,104,0.06)]"
              style={{ borderColor: HAIRLINE }}
            >
              <div className="min-w-[520px]">
              <div
                className="grid grid-cols-[2.1fr_1fr_1fr_1fr] gap-2 px-4 py-4 md:px-6"
                style={{ background: NAVY }}
              >
                {t.calendar.head.map((h, i) => (
                  <div key={i}>
                    <div
                      className={`text-[13px] ${i === 0 ? "font-semibold text-white/85" : "font-bold text-white"}`}
                    >
                      {h}
                    </div>
                    {t.calendar.ages[i] && (
                      // dir goes on an inline <bdi>, not the block: on the block
                      // it would also flip text-align, leaving the age flush left
                      // while its column label stays flush right in Arabic.
                      <div className="text-[11px] text-white/60">
                        <bdi dir="ltr">{t.calendar.ages[i]}</bdi>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {t.calendar.rows.map((row, r) => (
                <div
                  key={r}
                  className="m3-row grid grid-cols-[2.1fr_1fr_1fr_1fr] gap-2 border-b px-4 py-3.5 last:border-b-0 md:px-6"
                  style={{ borderColor: HAIRLINE, background: r % 2 ? "#F6F7F8" : "#fff" }}
                >
                  {row.map((cell, c) => (
                    <div
                      key={c}
                      className={c === 0 ? "text-[13.5px] font-semibold" : "text-[13.5px]"}
                      style={{ color: c === 0 ? "#3D434D" : undefined }}
                    >
                      {cell}
                    </div>
                  ))}
                </div>
              ))}
              </div>
            </div>

            <p className="m3-reveal mt-3.5 text-[12.5px] leading-[1.5]" style={{ color: MUTED }}>
              {t.calendar.note}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="m3-reveal rounded-2xl p-6" style={{ background: "#FBEACF" }}>
              <div className="flex items-center gap-2.5">
                <My360Icon name="diabetes" className="h-5 w-5" />
                <div className="text-[16px] font-extrabold" style={{ color: NAVY }}>
                  {t.calendar.diabetesTitle}
                </div>
              </div>
              <p className="mt-3 text-[13.5px] leading-[1.6]">{t.calendar.diabetesBody}</p>
            </div>

            <div className="m3-reveal rounded-2xl border bg-white p-6" style={{ borderColor: HAIRLINE }}>
              <div className="text-[16px] font-extrabold" style={{ color: NAVY }}>
                {t.calendar.measureTitle}
              </div>
              <ul className="mt-3 flex flex-col gap-2.5 text-[13.5px] leading-[1.5]">
                {t.calendar.measures.map((m, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: ACTION }} />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Doctor quotes ─────────────────────────────────────────── */}
      <section className="mt-16 py-16 md:mt-28 md:py-24" style={{ background: "#F2F6FA" }}>
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="m3-reveal mx-auto max-w-xl text-center">
            {eyebrow(t.quotes.eyebrow)}
            <h2 className="mt-2.5 text-[clamp(1.7rem,3.6vw,2.25rem)] font-bold leading-[1.25]" style={{ color: NAVY }}>
              {t.quotes.title}
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {QUOTES.map((q, i) => (
              <figure
                key={i}
                className="m3-reveal flex flex-col gap-4 rounded-[18px] border bg-white p-7 transition-shadow hover:shadow-[0_14px_34px_rgba(0,56,104,0.11)]"
                style={{ borderColor: HAIRLINE }}
              >
                <div className="text-[44px] font-extrabold leading-[0.5] opacity-20" style={{ color: NAVY }}>
                  &ldquo;
                </div>
                <blockquote className="flex-1 text-[15px] leading-[1.65]">
                  {isRtl ? q.quoteAr : q.quoteEn}
                </blockquote>
                <figcaption
                  className="flex items-center gap-3 border-t pt-4"
                  style={{ borderColor: HAIRLINE }}
                >
                  <Image
                    src={q.photo || doctorAvatar(q.nameEn, q.nameAr)}
                    alt={isRtl ? q.nameAr : q.nameEn}
                    width={48}
                    height={48}
                    className="h-12 w-12 shrink-0 rounded-full bg-[#F2F6FA] object-cover"
                  />
                  <div>
                    <div className="text-[14px] font-bold" style={{ color: NAVY }}>
                      {isRtl ? q.nameAr : q.nameEn}
                    </div>
                    <div className="text-[12px]" style={{ color: MUTED }}>
                      {isRtl ? q.roleAr : q.roleEn}
                    </div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <section id="faq" className="mx-auto max-w-3xl scroll-mt-28 px-5 pt-16 md:px-8 md:pt-28">
        <div className="m3-reveal text-center">
          {eyebrow(t.faq.eyebrow)}
          <h2 className="mt-2.5 text-[clamp(1.7rem,3.6vw,2.25rem)] font-bold leading-[1.25]" style={{ color: NAVY }}>
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
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-[15.5px] font-bold" style={{ color: NAVY }}>
                {item.q}
                <span
                  className="shrink-0 text-xl font-extrabold transition-transform duration-300 group-open:rotate-45"
                  style={{ color: ACTION }}
                >
                  +
                </span>
              </summary>
              <p className="px-6 pb-5 text-[14px] leading-[1.65]">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Contact + lead form ───────────────────────────────────── */}
      <section id="my360-contact" className="mx-auto max-w-6xl scroll-mt-28 px-5 py-16 md:px-8 md:py-28">
        <div
          className="m3-reveal relative grid items-center gap-8 overflow-hidden rounded-[24px] p-6 sm:p-8 md:gap-10 md:p-12 lg:grid-cols-[1fr_400px]"
          style={{ background: NAVY }}
        >
          <span className="pointer-events-none absolute inset-y-0 -inset-x-1/2 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent animate-[my360-sheen_9s_ease-in-out_infinite]" />
          <span
            className="pointer-events-none absolute -bottom-24 -start-16 h-80 w-80 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle,#fff,transparent 65%)" }}
          />

          <div className="relative">
            <h2
              className="text-[clamp(1.75rem,4vw,2.4rem)] font-extrabold leading-[1.2] text-white"
              style={{ textWrap: "pretty" }}
            >
              {t.contact.title}
            </h2>
            <p className="mt-4 max-w-md text-[15.5px] leading-[1.65] text-white/80">{t.contact.body}</p>

            <div className="mt-7 flex flex-col gap-3 text-[14.5px] font-medium text-white">
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

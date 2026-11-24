"use client";

import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import translations, { type TranslationKey } from "@/app/i18n/translations";
import { featuredFilterOrder, keyToDoctorFilter, specKeys, specNameToKey, type SpecKey } from "@/app/lib/specialties";
import { COPY, SPECIALTY_IMAGES, SPECIALTY_PAGES, pick } from "../_lib/content";
import { refreshScroll, scrollToId } from "../_lib/motion";
import { Arrow, SectionHead } from "./ui";

const INITIAL = 6;
// Thumbnails and the hover preview ask for the same width on desktop, so the
// preview is served from cache the moment a row is hovered.
const THUMB_SIZES = "(min-width: 1024px) 320px, 112px";

// Patient-demand order (the clinic's promoted list), then everything else.
const featuredKeys = featuredFilterOrder.map((n) => specNameToKey[n]).filter(Boolean) as SpecKey[];
const ORDERED: SpecKey[] = [...new Set<SpecKey>([...featuredKeys, ...specKeys])];
const hrefFor = (k: SpecKey) => SPECIALTY_PAGES[k] ?? `/find-doctor?spec=${encodeURIComponent(keyToDoctorFilter[k])}`;
const imageFor = (k: SpecKey) => SPECIALTY_IMAGES[k] ?? "/clinic/consultation.webp";

export default function Specialties({ isRtl }: { isRtl: boolean }) {
  const t = translations[isRtl ? "ar" : "en"];
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<SpecKey | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Desktop only: a photo card trails the cursor across the list, leaning
  // into the direction of travel. Touch devices see the row thumbnails instead.
  useEffect(() => {
    const section = sectionRef.current;
    const preview = previewRef.current;
    if (!section || !preview) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)").matches) return;
    const xTo = gsap.quickTo(preview, "x", { duration: 0.55, ease: "power3" });
    const yTo = gsap.quickTo(preview, "y", { duration: 0.55, ease: "power3" });
    const rTo = gsap.quickTo(preview, "rotation", { duration: 0.9, ease: "power3" });
    let lastX = 0;
    let primed = false;
    const move = (e: PointerEvent) => {
      const r = section.getBoundingClientRect();
      const x = e.clientX - r.left - 150;
      const y = e.clientY - r.top - 105;
      // First contact: jump straight to the cursor instead of gliding in
      // from the section's corner.
      if (!primed) {
        gsap.set(preview, { x, y });
        primed = true;
      }
      xTo(x);
      yTo(y);
      rTo(gsap.utils.clamp(-9, 9, (e.clientX - lastX) * 0.5));
      lastX = e.clientX;
    };
    section.addEventListener("pointermove", move);
    return () => {
      section.removeEventListener("pointermove", move);
      gsap.killTweensOf(preview);
    };
  }, []);

  const toggle = () => {
    setOpen((v) => !v);
    // The page gets taller/shorter — re-measure every trigger after the
    // collapse transition, then bring the list back into view on close.
    refreshScroll(850);
    if (open) window.setTimeout(() => scrollToId("specialties"), 60);
  };

  const row = (k: SpecKey, i: number, extra: boolean) => (
    <Link
      key={k}
      href={hrefFor(k)}
      onPointerEnter={() => setHovered(k)}
      data-rv={extra ? undefined : ""}
      className={`spec-card group relative grid grid-cols-[auto_1fr_auto] md:grid-cols-[56px_96px_1.1fr_1fr_auto] items-center gap-4 sm:gap-6 py-5 sm:py-6 border-b border-ink/15 ${extra ? "stagger" : "rv"}`}
      style={{ "--d": `${extra ? (i - INITIAL) * 45 + 120 : (i % INITIAL) * 70}ms` } as CSSProperties}
    >
      <span className="hidden md:block text-xs text-ink-muted tabular-nums">{String(i + 1).padStart(2, "0")}</span>
      <span className="spec-thumb relative block w-16 h-16 sm:w-24 sm:h-[72px] rounded-2xl overflow-hidden bg-mist shrink-0">
        <Image src={imageFor(k)} alt="" fill sizes={THUMB_SIZES} quality={72} className="object-cover" />
      </span>
      <h3 className="display text-[1.45rem] sm:text-4xl leading-tight">{t[`spec.${k}` as TranslationKey]}</h3>
      <p className="hidden md:block text-sm text-ink-muted">{t[`specDesc.${k}` as TranslationKey]}</p>
      <span className="spec-arrow w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-ink/15 grid place-items-center">
        <Arrow />
      </span>
      <span className="spec-line absolute inset-x-0 -bottom-px h-px bg-primary" aria-hidden="true" />
    </Link>
  );

  return (
    <section ref={sectionRef} id="specialties" className="relative max-w-[1440px] mx-auto px-5 sm:px-10 py-24 sm:py-36">
      {/* Cursor-trailing preview (physical left/top: it is positioned from
          the pointer's viewport coordinates, which ignore writing direction). */}
      <div
        ref={previewRef}
        className="spec-preview hidden lg:block absolute left-0 top-0 z-30 w-[300px] pointer-events-none"
        data-show={hovered ? "true" : "false"}
        aria-hidden="true"
      >
        <div className="relative aspect-[10/7] rounded-[22px] overflow-hidden bg-mist shadow-2xl shadow-ink/30">
          {hovered && <Image key={hovered} src={imageFor(hovered)} alt="" fill sizes={THUMB_SIZES} quality={72} className="object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
          {hovered && (
            <span key={`l-${hovered}`} className="absolute bottom-3 inset-x-4 text-white text-sm font-semibold leading-snug fade-up">
              {t[`specDesc.${hovered}` as TranslationKey]}
            </span>
          )}
        </div>
      </div>

      <SectionHead
        className="mb-14 sm:mb-20"
        eyebrow={pick(COPY.specEyebrow, isRtl)}
        lines={isRtl ? COPY.specTitle.ar : COPY.specTitle.en}
        side={<p className="text-ink-muted leading-7 max-w-[420px]">{t.comprehensiveCareDesc}</p>}
      />

      <div onPointerLeave={() => setHovered(null)}>
        <div className="border-t border-ink/15">{ORDERED.slice(0, INITIAL).map((k, i) => row(k, i, false))}</div>
        <div className={`collapse ${open ? "open" : ""}`} id="spec-more">
          <div inert={!open}>{ORDERED.slice(INITIAL).map((k, i) => row(k, i + INITIAL, true))}</div>
        </div>
      </div>

      <div data-rv="" className="rv mt-12 flex justify-center">
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-controls="spec-more"
          data-magnetic=""
          className="more-btn btn btn-ghost on-light inline-flex items-center gap-4 rounded-full ps-7 pe-2 py-2 text-sm text-ink cursor-pointer"
        >
          <span className="label">
            <span>{pick(COPY.specMore, isRtl)}</span>
            <span>{pick(COPY.specLess, isRtl)}</span>
          </span>
          <span className="w-10 h-10 rounded-full bg-primary text-white grid place-items-center">
            <span className="plus" aria-hidden="true" />
          </span>
        </button>
      </div>
    </section>
  );
}

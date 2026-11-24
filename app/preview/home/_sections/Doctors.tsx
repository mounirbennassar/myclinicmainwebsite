"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as RPointerEvent } from "react";
import translations, { type TranslationKey } from "@/app/i18n/translations";
import { doctorFilters, featuredFilterOrder, specNameToKey } from "@/app/lib/specialties";
import { doctorAvatar } from "@/app/lib/doctor-avatar";
import type { DoctorCard } from "@/app/lib/doctors";
import { COPY, pick } from "../_lib/content";
import { Arrow, SectionHead } from "./ui";

// Same windowing contract as the live carousel: every doctor the clinic
// employs stays reachable from the home page, but only a window of cards is
// mounted; it grows as the rail nears its end.
const WINDOW_START = 18;
const WINDOW_STEP = 18;

export default function Doctors({ isRtl, initialDoctors }: { isRtl: boolean; initialDoctors?: DoctorCard[] }) {
  const t = translations[isRtl ? "ar" : "en"];
  const railRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const hasInitial = Array.isArray(initialDoctors);
  const [doctors, setDoctors] = useState<DoctorCard[]>(initialDoctors ?? []);
  const [loading, setLoading] = useState(!hasInitial);
  const [tab, setTab] = useState("");
  const [windowSize, setWindowSize] = useState(WINDOW_START);
  const [progress, setProgress] = useState(0);

  // Server data is the normal path; this fetch only covers a DB timeout at render.
  useEffect(() => {
    if (hasInitial) return;
    let cancelled = false;
    fetch("/api/doctors")
      .then((r) => r.json())
      .then((d) => !cancelled && (setDoctors(d.doctors || []), setLoading(false)))
      .catch(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [hasInitial]);

  const tSpec = (name: string) => {
    const key = specNameToKey[name];
    return key ? (t[`spec.${key}` as TranslationKey] as string) || name : name;
  };

  // Promoted specialties first, then canonical, then anything else on the roster.
  const tabs = useMemo(() => {
    const counts = new Map<string, number>();
    for (const d of doctors) for (const s of d.specialties) counts.set(s, (counts.get(s) || 0) + 1);
    const featured = featuredFilterOrder.filter((s) => counts.has(s));
    const seen = new Set(featured);
    const rest = doctorFilters.filter((s) => counts.has(s) && !seen.has(s));
    rest.forEach((s) => seen.add(s));
    const extra = [...counts.keys()].filter((s) => !seen.has(s)).sort();
    return [...featured, ...rest, ...extra].map((name) => ({ name, count: counts.get(name) || 0 }));
  }, [doctors]);

  const visible = useMemo(() => (tab ? doctors.filter((d) => d.specialties.includes(tab)) : doctors), [doctors, tab]);
  const rendered = visible.slice(0, windowSize);

  const selectTab = (name: string) => {
    setTab(name);
    setWindowSize(WINDOW_START);
    railRef.current?.scrollTo({ left: 0 });
    setProgress(0);
  };

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || windowSize >= visible.length) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setWindowSize((n) => n + WINDOW_STEP), {
      root: railRef.current,
      rootMargin: "0px 800px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, [windowSize, visible.length]);

  const onScroll = () => {
    const el = railRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? Math.min(1, Math.abs(el.scrollLeft) / max) : 1);
  };

  // Mouse drag-to-scroll (touch already pans natively). A drag longer than a
  // few pixels swallows the click so releasing over a card doesn't navigate.
  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: false });
  const onPointerDown = (e: RPointerEvent<HTMLDivElement>) => {
    drag.current.moved = false;
    if (e.pointerType !== "mouse" || e.button !== 0 || !railRef.current) return;
    drag.current = { active: true, startX: e.clientX, startLeft: railRef.current.scrollLeft, moved: false };
  };
  const onPointerMove = (e: RPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const el = railRef.current;
    if (!d.active || !el) return;
    const dx = e.clientX - d.startX;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      el.dataset.dragging = "true";
      el.setPointerCapture(e.pointerId);
    }
    if (d.moved) el.scrollLeft = d.startLeft - dx;
  };
  const endDrag = () => {
    drag.current.active = false;
    const el = railRef.current;
    if (el && el.dataset.dragging) {
      // Let the release click fire (and get ignored) before re-enabling snap.
      window.setTimeout(() => el && delete el.dataset.dragging, 0);
    }
  };

  const step = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-doc]")?.offsetWidth ?? 300;
    el.scrollBy({ left: dir * (isRtl ? -1 : 1) * (card + 20) * 2, behavior: "smooth" });
  };

  const count = doctors.length >= 20 ? Math.floor(doctors.length / 10) * 10 : 100;

  return (
    <section id="doctors" className="py-24 sm:py-32 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10">
        <SectionHead
          className="mb-10"
          eyebrow={t.ourSpecialists}
          lines={isRtl ? COPY.docTitle.ar : COPY.docTitle.en}
          side={
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <p className="text-ink-muted text-sm leading-6 max-w-[320px]">{pick(COPY.docDesc, isRtl).replace("{n}", `${count}+`)}</p>
              <Link href="/find-doctor" className="btn btn-ghost on-light inline-flex items-center gap-3 rounded-full px-6 py-3.5 text-sm w-fit text-ink whitespace-nowrap">
                {pick(COPY.finderSubmit, isRtl)}
                <span className="arrow">
                  <Arrow />
                </span>
              </Link>
            </div>
          }
        />

        {/* Specialty tabs */}
        {tabs.length > 0 && (
          <div data-rv="" className="rv -mx-5 px-5 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-8" role="tablist" aria-label={isRtl ? "التخصصات" : "Specialties"}>
            {[{ name: "", label: pick(COPY.allDoctors, isRtl), count: doctors.length }, ...tabs.map((x) => ({ ...x, label: tSpec(x.name) }))].map(({ name, label, count: c }) => {
              const active = tab === name;
              return (
                <button
                  key={name || "all"}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => selectTab(name)}
                  className={`shrink-0 inline-flex items-center gap-2 ps-4 pe-2 py-2 rounded-full text-sm border transition-colors duration-300 cursor-pointer ${
                    active ? "bg-ink text-white border-ink" : "border-ink/15 text-ink/75 hover:border-ink/40 hover:text-ink"
                  }`}
                >
                  {label}
                  <span className={`min-w-[1.4rem] h-[1.4rem] px-1.5 rounded-full text-[11px] grid place-items-center tabular-nums ${active ? "bg-white/20" : "bg-mist"}`}>{c}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Rail — bleeds to the viewport edge on the trailing side */}
      <div className="max-w-[1440px] mx-auto ps-5 sm:ps-10">
        <div
          ref={railRef}
          onScroll={onScroll}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={(e) => {
            if (drag.current.moved) {
              e.preventDefault();
              e.stopPropagation();
              drag.current.moved = false;
            }
          }}
          className="rail flex gap-5 overflow-x-auto pe-5 sm:pe-10 select-none"
        >
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="shrink-0 w-[260px] sm:w-[300px] aspect-[4/5] rounded-[24px] bg-mist animate-pulse" />)
            : rendered.map((d, i) => {
                const subtitle = isRtl && d.specialties[0] ? tSpec(d.specialties[0]) : d.specialty_raw || (d.specialties[0] ? tSpec(d.specialties[0]) : "");
                return (
                  <Link
                    key={`${tab}-${d.id}`}
                    href={`/doctors/${d.slug}`}
                    data-doc=""
                    draggable={false}
                    className="doc-card doc-enter zoom group shrink-0 w-[260px] sm:w-[300px]"
                    style={{ "--d": `${Math.min(i, 6) * 70}ms` } as CSSProperties}
                  >
                    <div className="relative rounded-[24px] overflow-hidden aspect-[4/5] bg-white">
                      <Image
                        src={d.image_url || doctorAvatar(d.name_en, d.name_ar)}
                        alt={d.name_en}
                        fill
                        sizes="300px"
                        draggable={false}
                        className="object-cover object-top"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-ink/90 via-ink/35 to-transparent" />
                      {d.specialties[0] && (
                        <span className="absolute top-4 start-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-[11px] text-ink">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {tSpec(d.specialties[0])}
                        </span>
                      )}
                      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                        <h3 className="font-semibold text-lg leading-snug line-clamp-2">{isRtl && d.name_ar ? d.name_ar : d.name_en}</h3>
                        <p className="text-sm text-white/70 mt-1 line-clamp-1">{subtitle}</p>
                        <span className="doc-cta mt-4 flex items-center justify-between rounded-full bg-white text-ink text-sm font-medium ps-5 pe-1.5 py-1.5">
                          {pick(COPY.viewProfile, isRtl)}
                          <span className="w-8 h-8 rounded-full bg-primary text-white grid place-items-center">
                            <Arrow className="w-3.5 h-3.5" />
                          </span>
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
          {!loading && visible.length === 0 && <p className="text-ink-muted py-10">{t.noDoctorsYet}</p>}
          {!loading && windowSize < visible.length && <div ref={sentinelRef} aria-hidden="true" className="shrink-0 w-px self-stretch" />}
        </div>
      </div>

      {/* Progress + arrows */}
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 mt-8 flex items-center gap-6">
        <div className="flex-1 h-px bg-ink/10 relative overflow-hidden">
          <div className="absolute inset-y-0 start-0 bg-ink transition-[width] duration-300" style={{ width: `${Math.max(progress, 0.06) * 100}%` }} />
        </div>
        <span className="hidden sm:inline text-xs text-ink-muted">{pick(COPY.dragHint, isRtl)}</span>
        <div className="flex gap-2">
          <button type="button" onClick={() => step(-1)} aria-label={pick(COPY.prev, isRtl)} className="w-12 h-12 rounded-full border border-ink/20 grid place-items-center hover:bg-ink hover:text-white transition-colors duration-500 cursor-pointer">
            <Arrow className="w-4 h-4 rotate-180" />
          </button>
          <button type="button" onClick={() => step(1)} aria-label={pick(COPY.next, isRtl)} className="w-12 h-12 rounded-full bg-primary text-white grid place-items-center hover:bg-ink transition-colors duration-500 cursor-pointer">
            <Arrow />
          </button>
        </div>
      </div>
    </section>
  );
}

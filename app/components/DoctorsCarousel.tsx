"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/app/i18n/context";
import translations, { type TranslationKey } from "@/app/i18n/translations";
import { doctorFilters, featuredFilterOrder, specNameToKey } from "@/app/lib/specialties";
import { doctorAvatar } from "@/app/lib/doctor-avatar";
import DoctorWatermark from "@/app/components/DoctorWatermark";
import type { DoctorCard } from "@/app/lib/doctors";

type Props = {
  /** Limit to one canonical specialty (landing pages). Omit for the home carousel. */
  specialty?: string;
  /** Show specialty filter tabs (home page). */
  showTabs?: boolean;
  /** Max doctors to request. */
  limit?: number;
  /** Server-fetched doctors. When provided the carousel renders them directly
   *  and skips the client fetch (faster + works even if /api/doctors is down). */
  initialDoctors?: DoctorCard[];
  /** Optional heading overrides. */
  eyebrowEn?: string; eyebrowAr?: string;
  headingEn?: string; headingAr?: string;
};

// The rail renders a window, not the roster: mounting 377 cards up front costs
// hydration time for cards nobody scrolls to. The window opens as the user
// reaches the end of the rail, so every doctor is reachable — which is the
// point; a doctor the clinic employs must never be absent from the home page.
const WINDOW_START = 24;
const WINDOW_STEP = 24;

export default function DoctorsCarousel({ specialty, showTabs = false, limit, initialDoctors, eyebrowEn, eyebrowAr, headingEn, headingAr }: Props) {
  const { lang } = useLang();
  const t = translations[lang];
  const isRtl = lang === "ar";
  const railRef = useRef<HTMLDivElement>(null);

  const hasInitial = Array.isArray(initialDoctors);
  const [doctors, setDoctors] = useState<DoctorCard[]>(initialDoctors ?? []);
  const [loading, setLoading] = useState(!hasInitial);
  // "" = the "All" tab → a shuffled mix across every specialty (dental included).
  // Landing pages pin a single specialty; the home carousel opens on the mix.
  const [activeTab, setActiveTab] = useState<string>(specialty ?? "");

  const tSpec = (name: string) => {
    const key = specNameToKey[name];
    return key ? t[`spec.${key}` as TranslationKey] || name : name;
  };

  useEffect(() => {
    if (hasInitial) return; // already have server-rendered data
    let cancelled = false;
    const params = new URLSearchParams();
    if (specialty) params.set("specialty", specialty);
    if (limit) params.set("limit", String(limit));
    fetch(`/api/doctors?${params}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        const list: DoctorCard[] = d.doctors || [];
        setDoctors(list);
        setLoading(false);
      })
      .catch(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [specialty, limit, showTabs]);

  // Tab order: the clinic's promoted specialties first (featuredFilterOrder),
  // then the remaining canonical ones, then anything else the roster actually
  // contains. That last group matters — an earlier version intersected with
  // `doctorFilters` and dropped the rest, so a specialty typed in the dashboard
  // that isn't on that hard-coded list left its doctors with no tab at all.
  const tabs = useMemo(() => {
    if (!showTabs) return [];
    const counts = new Map<string, number>();
    for (const d of doctors) for (const s of d.specialties) counts.set(s, (counts.get(s) || 0) + 1);
    const featured = featuredFilterOrder.filter((s) => counts.has(s));
    const seen = new Set(featured);
    const rest = doctorFilters.filter((s) => counts.has(s) && !seen.has(s));
    for (const s of rest) seen.add(s);
    const extra = [...counts.keys()].filter((s) => !seen.has(s)).sort();
    return [...featured, ...rest, ...extra].map((name) => ({ name, count: counts.get(name) || 0 }));
  }, [showTabs, doctors]);

  // Every doctor in the active tab — no cap. "All" keeps the shuffled
  // cross-specialty mix, which now runs to the end of the roster instead of
  // stopping at the first 40 (doctors past that point were unreachable from
  // the home page entirely unless they happened to hold a tabbed specialty).
  const visible = useMemo(() => {
    if (showTabs && activeTab) return doctors.filter((d) => d.specialties.includes(activeTab));
    return doctors;
  }, [doctors, showTabs, activeTab]);

  // Grow the render window when the end of the rail scrolls into view.
  const [windowSize, setWindowSize] = useState(WINDOW_START);
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => { setWindowSize(WINDOW_START); }, [activeTab]);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || windowSize >= visible.length) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setWindowSize((n) => n + WINDOW_STEP);
      },
      // The rail is the scroll container, and the sentinel sits past its right
      // edge; a generous margin loads the next batch before it is reached.
      { root: railRef.current, rootMargin: "0px 600px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [windowSize, visible.length]);

  const rendered = visible.slice(0, windowSize);

  const scroll = (dir: "prev" | "next") => {
    const el = railRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(":scope > a")?.offsetWidth || 280;
    el.scrollBy({ left: (dir === "next" ? 1 : -1) * (isRtl ? -1 : 1) * (card + 20), behavior: "smooth" });
  };

  const eyebrow = isRtl ? (eyebrowAr ?? t.ourSpecialists) : (eyebrowEn ?? t.ourSpecialists);
  const heading = isRtl ? (headingAr ?? t.worldClassMinds) : (headingEn ?? t.worldClassMinds);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20 w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
        <div>
          <p className="text-sm font-bold text-primary uppercase tracking-widest mb-2">{eyebrow}</p>
          {/* Brand navy (--color-primary #004d99), matching the doctor names on
              the cards below. text-on-surface rendered this near-black. */}
          <h2 className="text-3xl md:text-5xl font-headline font-extrabold text-primary tracking-tight">{heading}</h2>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/find-doctor" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-container text-white px-5 py-3 rounded-full text-sm font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all whitespace-nowrap">
            {isRtl ? "ابحث عن طبيب" : "Find a Doctor"}
            <span className={`material-symbols-outlined text-base ${isRtl ? "rotate-180" : ""}`}>arrow_forward</span>
          </Link>
        </div>
      </div>

      {/* Filter tabs (home) */}
      {showTabs && tabs.length > 0 && (
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-3 mb-6">
          {[{ name: "", label: isRtl ? "الكل" : "All", count: doctors.length }, ...tabs.map((t) => ({ ...t, label: tSpec(t.name) }))].map(
            ({ name, label, count }) => {
              const active = activeTab === name;
              return (
                <button
                  key={name || "all"}
                  onClick={() => setActiveTab(name)}
                  aria-pressed={active}
                  className={`shrink-0 inline-flex items-center gap-2 ps-4 pe-2.5 py-2 rounded-full text-sm font-bold transition-colors cursor-pointer ${active ? "bg-primary text-white" : "bg-surface-container text-on-surface-variant hover:text-primary"}`}
                >
                  {label}
                  {/* A count badge, not "(9)". Parentheses are bidi-NEUTRAL: the
                      Unicode algorithm mirrors them to face the surrounding
                      paragraph, so an English label sitting in the Arabic-default
                      RTL document rendered them reversed. A badge carries no
                      neutral characters, so it cannot flip in either direction. */}
                  <span
                    className={`inline-flex items-center justify-center min-w-[1.375rem] h-[1.375rem] px-1.5 rounded-full text-[11px] font-extrabold tabular-nums ${active ? "bg-white/25 text-white" : "bg-primary/10 text-primary"}`}
                  >
                    {count}
                  </span>
                </button>
              );
            }
          )}
        </div>
      )}

      {/* Rail */}
      <div className="relative">
        {!loading && visible.length > 4 && (
          <>
            <button onClick={() => scroll("prev")} aria-label="Previous" className={`hidden md:flex absolute ${isRtl ? "right-0" : "left-0"} top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white/90 backdrop-blur rounded-full shadow-xl items-center justify-center text-primary hover:bg-primary hover:text-white transition-all cursor-pointer border border-outline-variant/20`}>
              <span className={`material-symbols-outlined ${isRtl ? "rotate-180" : ""}`}>chevron_left</span>
            </button>
            <button onClick={() => scroll("next")} aria-label="Next" className={`hidden md:flex absolute ${isRtl ? "left-0" : "right-0"} top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white/90 backdrop-blur rounded-full shadow-xl items-center justify-center text-primary hover:bg-primary hover:text-white transition-all cursor-pointer border border-outline-variant/20`}>
              <span className={`material-symbols-outlined ${isRtl ? "rotate-180" : ""}`}>chevron_right</span>
            </button>
          </>
        )}

        {/* No `scroll-smooth` here, and it is load-bearing. In Arabic this rail
            inherits RTL, so the browser has to place it at its right-hand start
            edge; `snap-mandatory` turns that into a snap adjustment, and
            `scroll-smooth` turned the adjustment into an *animated* scroll that
            ran during load. A scroll ends Chrome's LCP recording, and this one
            fired before the hero ever painted — so the document produced no LCP
            candidate at all, Lighthouse reported NO_LCP, and PageSpeed could not
            score Performance (it also took Total Blocking Time and ~20 other
            audits down with it). /dental's identical strips escaped it only
            because they force dir="ltr", so they have no start-edge adjustment.
            Smooth scrolling is unaffected: the arrow handler passes
            behavior:"smooth" to scrollBy itself. */}
        <div ref={railRef} className="flex gap-5 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-2 -mx-1 px-1">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="snap-start shrink-0 w-[260px] bg-surface-container-lowest rounded-3xl overflow-hidden border border-outline-variant/20">
                  <div className="aspect-[4/5] bg-surface-container animate-pulse" />
                  <div className="p-5 space-y-2"><div className="h-4 bg-surface-container rounded animate-pulse" /><div className="h-3 w-2/3 bg-surface-container rounded animate-pulse" /></div>
                </div>
              ))
            : visible.length === 0
            ? <p className="text-on-surface-variant py-10">{t.noDoctorsYet}</p>
            : rendered.map((d) => (
                <Link key={d.id} href={`/doctors/${d.slug}`} className="group snap-start shrink-0 w-[260px] bg-surface-container-lowest rounded-3xl overflow-hidden border border-outline-variant/20 shadow-clinical hover:shadow-xl hover:-translate-y-1 transition-all">
                  {/* bg-white, not bg-surface-container: many portraits are cut-out
                      PNGs sitting on a white circular disc with transparency outside
                      it. Against a tinted panel that disc reads as a hard circle
                      behind the doctor; against white it disappears. */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-white">
                    <Image src={d.image_url || doctorAvatar(d.name_en, d.name_ar)} alt={d.name_en} fill loading="lazy" className="object-cover object-top group-hover:scale-105 transition-transform duration-500" sizes="260px" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/55 via-transparent to-transparent" />
                    <DoctorWatermark isRtl={isRtl} />
                    {d.specialties[0] && <span className={`absolute bottom-3 ${isRtl ? "right-3" : "left-3"} bg-secondary-fixed text-on-secondary-fixed px-2.5 py-1 rounded-full text-[10px] font-bold`}>{tSpec(d.specialties[0])}</span>}
                  </div>
                  <div className="p-5">
                    <h3 className="font-headline font-extrabold text-primary text-lg leading-tight mb-1 line-clamp-1">{isRtl && d.name_ar ? d.name_ar : d.name_en}</h3>
                    <p className="text-on-surface-variant text-sm font-medium line-clamp-2 min-h-[2.5em]">{isRtl && d.specialties[0] ? tSpec(d.specialties[0]) : d.specialty_raw}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-primary text-sm font-bold group-hover:gap-2 transition-all">
                      {isRtl ? "عرض الملف" : "View profile"}
                      <span className={`material-symbols-outlined text-base ${isRtl ? "rotate-180" : ""}`}>arrow_forward</span>
                    </span>
                  </div>
                </Link>
              ))}

          {/* Opens the next batch as the rail nears its end. Kept as a direct
              child so it rides the same horizontal scroll; the arrow handler
              measures `:scope > a`, so a bare div here does not confuse it. */}
          {!loading && windowSize < visible.length && (
            <div ref={sentinelRef} aria-hidden="true" className="shrink-0 w-px self-stretch" />
          )}
        </div>
      </div>
    </section>
  );
}

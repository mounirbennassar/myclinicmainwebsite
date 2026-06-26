"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/app/i18n/context";
import translations, { type TranslationKey } from "@/app/i18n/translations";
import { doctorFilters, specNameToKey } from "@/app/lib/specialties";
import type { Doctor } from "@/app/lib/doctors";

type Props = {
  /** Limit to one canonical specialty (landing pages). Omit for the home carousel. */
  specialty?: string;
  /** Show specialty filter tabs (home page). */
  showTabs?: boolean;
  /** Max doctors to request. */
  limit?: number;
  /** Server-fetched doctors. When provided the carousel renders them directly
   *  and skips the client fetch (faster + works even if /api/doctors is down). */
  initialDoctors?: Doctor[];
  /** Optional heading overrides. */
  eyebrowEn?: string; eyebrowAr?: string;
  headingEn?: string; headingAr?: string;
};

export default function DoctorsCarousel({ specialty, showTabs = false, limit, initialDoctors, eyebrowEn, eyebrowAr, headingEn, headingAr }: Props) {
  const { lang } = useLang();
  const t = translations[lang];
  const isRtl = lang === "ar";
  const railRef = useRef<HTMLDivElement>(null);

  const hasInitial = Array.isArray(initialDoctors);
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors ?? []);
  const [loading, setLoading] = useState(!hasInitial);
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
        const list: Doctor[] = d.doctors || [];
        setDoctors(list);
        if (showTabs && !activeTab) {
          const present = new Set(list.flatMap((x) => x.specialties));
          setActiveTab(doctorFilters.find((s) => present.has(s)) || "");
        }
        setLoading(false);
      })
      .catch(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [specialty, limit, showTabs]);

  const tabs = useMemo(() => {
    if (!showTabs) return [];
    const present = new Set(doctors.flatMap((d) => d.specialties));
    return doctorFilters.filter((s) => present.has(s));
  }, [showTabs, doctors]);

  const visible = useMemo(() => {
    if (showTabs && activeTab) return doctors.filter((d) => d.specialties.includes(activeTab));
    return doctors;
  }, [doctors, showTabs, activeTab]);

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
          <h2 className="text-3xl md:text-5xl font-headline font-extrabold text-on-surface tracking-tight">{heading}</h2>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/find-a-doctor" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-container text-white px-5 py-3 rounded-full text-sm font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all whitespace-nowrap">
            {isRtl ? "ابحث عن طبيب" : "Find a Doctor"}
            <span className={`material-symbols-outlined text-base ${isRtl ? "rotate-180" : ""}`}>arrow_forward</span>
          </Link>
        </div>
      </div>

      {/* Filter tabs (home) */}
      {showTabs && tabs.length > 0 && (
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-3 mb-6">
          {tabs.map((s) => (
            <button key={s} onClick={() => setActiveTab(s)} className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-colors cursor-pointer ${activeTab === s ? "bg-primary text-white" : "bg-surface-container text-on-surface-variant hover:text-primary"}`}>
              {tSpec(s)}
            </button>
          ))}
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

        <div ref={railRef} className="flex gap-5 overflow-x-auto hide-scrollbar snap-x snap-mandatory scroll-smooth pb-2 -mx-1 px-1">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="snap-start shrink-0 w-[260px] bg-surface-container-lowest rounded-3xl overflow-hidden border border-outline-variant/20">
                  <div className="aspect-[4/5] bg-surface-container animate-pulse" />
                  <div className="p-5 space-y-2"><div className="h-4 bg-surface-container rounded animate-pulse" /><div className="h-3 w-2/3 bg-surface-container rounded animate-pulse" /></div>
                </div>
              ))
            : visible.length === 0
            ? <p className="text-on-surface-variant py-10">{t.noDoctorsYet}</p>
            : visible.map((d) => (
                <Link key={d.id} href={`/doctors/${d.slug}`} className="group snap-start shrink-0 w-[260px] bg-surface-container-lowest rounded-3xl overflow-hidden border border-outline-variant/20 shadow-clinical hover:shadow-xl hover:-translate-y-1 transition-all">
                  <div className="relative aspect-[4/5] overflow-hidden bg-surface-container">
                    {d.image_url && <Image src={d.image_url} alt={d.name_en} fill loading="lazy" className="object-cover object-top group-hover:scale-105 transition-transform duration-500" sizes="260px" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/55 via-transparent to-transparent" />
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
        </div>
      </div>
    </section>
  );
}

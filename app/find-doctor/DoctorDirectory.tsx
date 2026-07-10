"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useLang } from "@/app/i18n/context";
import translations, { type TranslationKey } from "@/app/i18n/translations";
import { doctorFilters, specNameToKey } from "@/app/lib/specialties";
import { doctorAvatar } from "@/app/lib/doctor-avatar";
import { buildDoctorIndex, searchDoctors, closestDoctors } from "@/app/lib/doctor-search";
import type { Doctor } from "@/app/lib/doctors";

const PAGE = 24;
const CITIES = ["all", "Jeddah", "Riyadh"] as const;

export default function DoctorDirectory({ doctors }: { doctors: Doctor[] }) {
  const { lang } = useLang();
  const t = translations[lang];
  const isRtl = lang === "ar";
  const router = useRouter();
  const searchParams = useSearchParams();

  const [spec, setSpec] = useState(searchParams.get("spec") || searchParams.get("specialty") || "all");
  const [city, setCity] = useState(searchParams.get("city") || "all");
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [visible, setVisible] = useState(PAGE);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const boxRef = useRef<HTMLDivElement>(null);

  // Reset pagination whenever a filter changes (adjust-during-render pattern).
  const filterKey = `${spec}|${city}|${q}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setVisible(PAGE);
  }

  // Keep filters shareable: mirror them into the URL without re-rendering the
  // server page (native replaceState integrates with the Next router).
  useEffect(() => {
    const p = new URLSearchParams();
    if (q.trim()) p.set("q", q.trim());
    if (spec !== "all") p.set("spec", spec);
    if (city !== "all") p.set("city", city);
    const qs = p.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [q, spec, city]);

  // Close the suggestion dropdown on outside click.
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);

  // Localized specialty labels (stable per language) — feeds both the UI and
  // the search index, so Arabic users can search by Arabic specialty names.
  const specLabels = useMemo(() => {
    const m = new Map<string, string>();
    for (const name of doctorFilters) {
      const key = specNameToKey[name];
      m.set(name, key ? t[`spec.${key}` as TranslationKey] || name : name);
    }
    return m;
  }, [t]);
  const tSpec = (name: string) => specLabels.get(name) || name;

  // Search index: normalized names (both scripts), specialty labels, cities.
  const index = useMemo(
    () => buildDoctorIndex(doctors, (name) => specLabels.get(name) || name),
    [doctors, specLabels]
  );

  // Specialty options with live counts, canonical order, only those present.
  const specCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const d of doctors) for (const s of d.specialties) m.set(s, (m.get(s) || 0) + 1);
    return m;
  }, [doctors]);
  const specOptions = doctorFilters.filter((s) => specCounts.has(s));

  // Ranked when searching, curated order otherwise; then facet filters.
  const filtered = useMemo(() => {
    const base = q.trim() ? searchDoctors(index, q) : doctors;
    return base.filter((d) => {
      if (spec !== "all" && !d.specialties.includes(spec)) return false;
      if (city !== "all" && !d.cities.includes(city)) return false;
      return true;
    });
  }, [doctors, index, spec, city, q]);

  const suggestions = q.trim().length >= 2 ? filtered.slice(0, 6) : [];
  const didYouMean = useMemo(
    () => (q.trim().length >= 3 && filtered.length === 0 ? closestDoctors(index, q, 4) : []),
    [index, q, filtered.length]
  );
  const shown = filtered.slice(0, visible);

  const subtitle = (d: Doctor) =>
    isRtl && d.specialties[0] ? tSpec(d.specialties[0]) : d.specialty_raw || (d.specialties[0] ? tSpec(d.specialties[0]) : "");

  const cityLabel = (c: string) =>
    c === "all" ? (isRtl ? "كل المدن" : "All cities") : c === "Jeddah" ? t.jeddah : t.riyadh;

  const goTo = (d: Doctor) => {
    setOpen(false);
    router.push(`/doctors/${d.slug}`);
  };

  const onSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || !suggestions.length) {
      if (e.key === "Escape") setOpen(false);
      return;
    }
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => (a + 1) % suggestions.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => (a <= 0 ? suggestions.length - 1 : a - 1)); }
    else if (e.key === "Enter" && active >= 0) { e.preventDefault(); goTo(suggestions[active]); }
    else if (e.key === "Escape") setOpen(false);
  };

  return (
    <>
      {/* Hero band */}
      <section className="relative overflow-hidden bg-surface hero-gradient border-b border-outline-variant/20">
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-[-30%] right-[-5%] w-[480px] h-[480px] bg-primary/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-40%] left-[-5%] w-[420px] h-[420px] bg-secondary/10 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16 relative z-10 max-w-3xl">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-extrabold uppercase tracking-label mb-5">
            {t.ourSpecialists}
          </div>
          <h1 className={`text-4xl md:text-6xl font-headline font-extrabold text-primary tracking-tighter text-glow mb-4 ${isRtl ? "leading-[1.4]" : "leading-[1.1]"}`}>
            {isRtl ? "ابحث عن طبيب" : "Find a Doctor"}
          </h1>
          <p className="text-on-surface-variant text-base md:text-lg font-medium leading-relaxed opacity-90">
            {isRtl
              ? `اختر من بين ${doctors.length}+ طبيباً متخصصاً عبر فروعنا في جدة والرياض. ابحث بالاسم أو التخصص — بالعربية أو الإنجليزية.`
              : `Choose from ${doctors.length}+ specialist doctors across Jeddah & Riyadh. Search by name or specialty — in Arabic or English.`}
          </p>
        </div>
      </section>

      {/* Filter bar */}
      <section className="sticky top-[64px] z-30 bg-surface/90 backdrop-blur-md border-b border-outline-variant/20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row gap-3">
          {/* Search + live suggestions */}
          <div ref={boxRef} className="relative flex-1 min-w-0">
            <span className={`material-symbols-outlined absolute top-1/2 -translate-y-1/2 ${isRtl ? "right-4" : "left-4"} text-on-surface-variant pointer-events-none`}>search</span>
            <input
              value={q}
              onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(-1); }}
              onFocus={() => setOpen(true)}
              onKeyDown={onSearchKey}
              role="combobox"
              aria-expanded={open && suggestions.length > 0}
              aria-controls="doctor-suggestions"
              placeholder={isRtl ? "ابحث بالاسم أو التخصص أو المدينة..." : "Search by name, specialty or city..."}
              className={`w-full bg-surface-container-lowest border border-outline-variant/40 rounded-full py-3 ${isRtl ? "pr-12 pl-11" : "pl-12 pr-11"} text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all`}
            />
            {q && (
              <button
                onClick={() => { setQ(""); setOpen(false); }}
                aria-label={isRtl ? "مسح البحث" : "Clear search"}
                className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? "left-3" : "right-3"} w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer`}
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            )}

            {open && suggestions.length > 0 && (
              <div
                id="doctor-suggestions"
                role="listbox"
                className="absolute top-full inset-x-0 mt-2 bg-surface-container-lowest border border-outline-variant/30 rounded-3xl shadow-xl overflow-hidden z-40"
              >
                {suggestions.map((d, i) => (
                  <button
                    key={d.id}
                    role="option"
                    aria-selected={i === active}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => goTo(d)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors cursor-pointer ${isRtl ? "text-right" : "text-left"} ${i === active ? "bg-primary/8" : ""}`}
                  >
                    <span className="relative w-11 h-11 rounded-full overflow-hidden bg-surface-container shrink-0">
                      <Image src={d.image_url || doctorAvatar(d.name_en, d.name_ar)} alt="" fill className="object-cover object-top" sizes="44px" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-bold text-on-surface text-sm leading-tight line-clamp-1">{isRtl && d.name_ar ? d.name_ar : d.name_en}</span>
                      <span className="block text-xs text-on-surface-variant line-clamp-1">{subtitle(d)}</span>
                    </span>
                    {d.specialties[0] && (
                      <span className="hidden sm:inline-flex bg-secondary-fixed text-on-secondary-fixed px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0">{tSpec(d.specialties[0])}</span>
                    )}
                  </button>
                ))}
                {filtered.length > suggestions.length && (
                  <button
                    onClick={() => setOpen(false)}
                    className="w-full px-4 py-2.5 text-primary text-sm font-bold hover:bg-primary/5 transition-colors cursor-pointer border-t border-outline-variant/20"
                  >
                    {isRtl ? `عرض كل النتائج (${filtered.length})` : `View all ${filtered.length} results`}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Specialty select (with live counts) */}
          <select
            value={spec}
            onChange={(e) => setSpec(e.target.value)}
            className="md:w-72 bg-surface-container-lowest border border-outline-variant/40 rounded-full py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary outline-none cursor-pointer"
          >
            <option value="all">{isRtl ? "كل التخصصات" : "All specialties"}</option>
            {specOptions.map((s) => (
              <option key={s} value={s}>{tSpec(s)} ({specCounts.get(s)})</option>
            ))}
          </select>

          {/* City segmented pills */}
          <div className="flex items-center bg-surface-container-lowest border border-outline-variant/40 rounded-full p-1 shrink-0">
            {CITIES.map((c) => (
              <button
                key={c}
                onClick={() => setCity(c)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  city === c ? "bg-primary text-white shadow-md shadow-primary/20" : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {cityLabel(c)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-14 w-full">
        <p className="text-sm font-bold text-on-surface-variant mb-6" aria-live="polite">
          {filtered.length} {isRtl ? "طبيب" : filtered.length === 1 ? "doctor" : "doctors"}
          {spec !== "all" && <span className="text-primary"> · {tSpec(spec)}</span>}
          {city !== "all" && <span className="text-primary"> · {cityLabel(city)}</span>}
          {q.trim() && <span className="text-primary"> · “{q.trim()}”</span>}
        </p>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">search_off</span>
            <p className="text-lg font-bold text-on-surface mb-1">{t.noDoctorsYet}</p>
            {didYouMean.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-bold text-on-surface-variant mb-3">{isRtl ? "ربما تقصد:" : "Did you mean:"}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {didYouMean.map((d) => (
                    <Link
                      key={d.id}
                      href={`/doctors/${d.slug}`}
                      className="inline-flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/30 rounded-full py-1.5 ps-1.5 pe-4 hover:border-primary/50 hover:shadow-md transition-all"
                    >
                      <span className="relative w-8 h-8 rounded-full overflow-hidden bg-surface-container">
                        <Image src={d.image_url || doctorAvatar(d.name_en, d.name_ar)} alt="" fill className="object-cover object-top" sizes="32px" />
                      </span>
                      <span className="text-sm font-bold text-on-surface">{isRtl && d.name_ar ? d.name_ar : d.name_en}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            <button onClick={() => { setSpec("all"); setCity("all"); setQ(""); }} className="block mx-auto text-primary font-bold hover:underline mt-6 cursor-pointer">
              {isRtl ? "إعادة ضبط الفلاتر" : "Reset filters"}
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {shown.map((d, i) => (
                <motion.div key={d.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: (i % PAGE % 8) * 0.03 }}>
                  <Link href={`/doctors/${d.slug}`} className="group block h-full bg-surface-container-lowest rounded-3xl overflow-hidden border border-outline-variant/20 shadow-clinical hover:shadow-xl hover:-translate-y-1 transition-all">
                    <div className="relative aspect-[4/5] overflow-hidden bg-surface-container">
                      <Image src={d.image_url || doctorAvatar(d.name_en, d.name_ar)} alt={d.name_en} fill className="object-cover object-top group-hover:scale-105 transition-transform duration-500" sizes="(max-width:768px) 50vw, (max-width:1280px) 33vw, 25vw" loading={i < 8 ? "eager" : "lazy"} />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/55 via-transparent to-transparent" />
                      {d.specialties[0] && (
                        <span className={`absolute bottom-3 ${isRtl ? "right-3" : "left-3"} bg-secondary-fixed text-on-secondary-fixed px-2.5 py-1 rounded-full text-[10px] font-bold`}>{tSpec(d.specialties[0])}</span>
                      )}
                    </div>
                    <div className="p-4 md:p-5">
                      <h3 className="font-headline font-extrabold text-primary text-base md:text-lg leading-tight mb-1 line-clamp-1">{isRtl && d.name_ar ? d.name_ar : d.name_en}</h3>
                      <p className="text-on-surface-variant text-xs md:text-sm font-medium mb-2 line-clamp-2 min-h-[2.5em]">{subtitle(d)}</p>
                      {d.cities[0] && (
                        <p className="flex items-center gap-1 text-xs text-on-surface-variant/80">
                          <span className="material-symbols-outlined text-sm text-primary">location_on</span>
                          <span className="line-clamp-1">{isRtl ? (d.cities.includes("Riyadh") && d.cities.includes("Jeddah") ? "جدة، الرياض" : d.cities.includes("Riyadh") ? "الرياض" : "جدة") : d.cities.join(", ")}</span>
                        </p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {visible < filtered.length && (
              <div className="text-center mt-10">
                <button onClick={() => setVisible((v) => v + PAGE)} className="bg-primary hover:bg-primary-container text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all cursor-pointer">
                  {isRtl ? `عرض المزيد (${filtered.length - visible})` : `Load more (${filtered.length - visible})`}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}

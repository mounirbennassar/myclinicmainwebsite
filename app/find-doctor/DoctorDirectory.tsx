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

  // Keep search relevance separate from facets. This lets the interface tell
  // users when a valid doctor is merely hidden by a city/specialty selection.
  const searched = useMemo(
    () => (q.trim() ? searchDoctors(index, q) : doctors),
    [doctors, index, q]
  );
  const filtered = useMemo(() => {
    return searched.filter((d) => {
      if (spec !== "all" && !d.specialties.includes(spec)) return false;
      if (city !== "all" && !d.cities.includes(city)) return false;
      return true;
    });
  }, [searched, spec, city]);

  const suggestions = q.trim().length >= 2 ? searched.slice(0, 6) : [];
  const hiddenByFilters = searched.length - filtered.length;
  const hasActiveFilters = spec !== "all" || city !== "all";
  const didYouMean = useMemo(
    () => (q.trim().length >= 3 && searched.length === 0 ? closestDoctors(index, q, 4) : []),
    [index, q, searched.length]
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

  const clearFacets = () => {
    setSpec("all");
    setCity("all");
  };

  const resetSearch = () => {
    setQ("");
    clearFacets();
    setOpen(false);
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
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12 pb-24 md:pt-16 md:pb-28 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-primary text-xs font-extrabold tracking-label mb-5">
              <span className="w-7 h-px bg-primary/40" aria-hidden="true" />
              {t.ourSpecialists}
            </div>
            <h1 className={`text-4xl md:text-6xl font-headline font-extrabold text-primary tracking-tighter text-glow mb-4 text-balance ${isRtl ? "leading-[1.4]" : "leading-[1.05]"}`}>
              {isRtl ? "طبيبك المناسب، أقرب مما تتوقع" : "Find the right doctor for your care"}
            </h1>
            <p className="text-on-surface-variant text-base md:text-lg font-medium leading-relaxed max-w-2xl text-pretty">
              {isRtl
                ? `ابحث بين ${doctors.length} طبيباً بالاسم أو التخصص أو الفرع — بالعربية أو الإنجليزية.`
                : `Search ${doctors.length} doctors by name, specialty, or branch — in Arabic or English.`}
            </p>
          </div>
        </div>
      </section>

      {/* Search console */}
      <section className="sticky top-[64px] z-30 -mt-14 px-4 md:px-8 pointer-events-none">
        <div className="max-w-7xl mx-auto bg-surface-container-lowest/95 backdrop-blur-xl border border-white/70 rounded-[28px] shadow-[0_24px_60px_-28px_rgba(0,56,103,0.38)] pointer-events-auto">
          <div className="p-3 md:p-4">
            <div ref={boxRef} className="relative min-w-0">
              <label htmlFor="doctor-search" className={`absolute top-2 ${isRtl ? "right-14" : "left-14"} text-[10px] font-extrabold text-primary tracking-wide pointer-events-none`}>
                {isRtl ? "بحث ذكي عن الأطباء" : "SMART DOCTOR SEARCH"}
              </label>
              <span className={`material-symbols-outlined absolute top-1/2 -translate-y-1/2 ${isRtl ? "right-4" : "left-4"} text-primary pointer-events-none`}>manage_search</span>
              <input
                id="doctor-search"
                value={q}
                onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(-1); }}
                onFocus={() => setOpen(true)}
                onKeyDown={onSearchKey}
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={open && suggestions.length > 0}
                aria-controls="doctor-suggestions"
                placeholder={isRtl ? "اكتب اسم الطبيب أو التخصص أو الفرع..." : "Type a doctor, specialty, or branch..."}
                className={`w-full h-16 bg-surface-container border border-transparent rounded-2xl pt-5 pb-2 ${isRtl ? "pr-14 pl-24" : "pl-14 pr-24"} text-on-surface font-semibold placeholder:font-medium placeholder:text-on-surface-variant/65 focus:bg-white focus:border-primary/35 focus:ring-4 focus:ring-primary/10 outline-none transition-all`}
              />
              <span className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? "left-4" : "right-4"} text-xs font-extrabold tabular-nums ${q.trim() ? "text-primary" : "text-on-surface-variant"}`}>
                {filtered.length}
              </span>
              {q && (
                <button
                  onClick={() => { setQ(""); setOpen(false); }}
                  aria-label={isRtl ? "مسح البحث" : "Clear search"}
                  className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? "left-12" : "right-12"} w-7 h-7 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-white hover:text-on-surface focus-visible:ring-2 focus-visible:ring-primary transition-colors cursor-pointer`}
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              )}

              {open && suggestions.length > 0 && (
                <div
                  id="doctor-suggestions"
                  role="listbox"
                  className="absolute top-full inset-x-0 mt-2 bg-surface-container-lowest border border-outline-variant/25 rounded-2xl shadow-[0_24px_60px_-24px_rgba(0,56,103,0.45)] overflow-hidden z-40"
                >
                  <div className="px-4 py-2 text-[10px] font-extrabold tracking-wide text-on-surface-variant bg-surface-container/70">
                    {isRtl ? "أفضل النتائج" : "BEST MATCHES"}
                  </div>
                  {suggestions.map((d, i) => (
                    <button
                      key={d.id}
                      role="option"
                      aria-selected={i === active}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => goTo(d)}
                      className={`w-full flex items-center gap-3 px-4 py-3 transition-colors cursor-pointer ${isRtl ? "text-right" : "text-left"} ${i === active ? "bg-primary/10" : "hover:bg-surface-container/70"}`}
                    >
                      <span className="relative w-12 h-12 rounded-xl overflow-hidden bg-surface-container shrink-0">
                        <Image src={d.image_url || doctorAvatar(d.name_en, d.name_ar)} alt="" fill className="object-cover object-top" sizes="48px" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-extrabold text-on-surface text-sm leading-tight line-clamp-1">{isRtl && d.name_ar ? d.name_ar : d.name_en}</span>
                        <span className="block text-xs text-on-surface-variant mt-1 line-clamp-1">{subtitle(d)}{d.cities[0] ? ` · ${d.cities.map(cityLabel).join(", ")}` : ""}</span>
                      </span>
                      <span className="material-symbols-outlined text-lg text-primary rtl:rotate-180">arrow_forward</span>
                    </button>
                  ))}
                  {searched.length > suggestions.length && (
                    <button
                      onClick={() => setOpen(false)}
                      className="w-full px-4 py-3 text-primary text-sm font-extrabold hover:bg-primary/5 focus-visible:bg-primary/5 transition-colors cursor-pointer border-t border-outline-variant/20"
                    >
                      {isRtl ? `عرض كل النتائج (${searched.length})` : `View all ${searched.length} matches`}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-outline-variant/20 px-3 py-3 md:px-4 flex flex-col lg:flex-row lg:items-center gap-3">
            <div className="relative flex-1 min-w-0">
              <span className={`material-symbols-outlined absolute top-1/2 -translate-y-1/2 ${isRtl ? "right-3" : "left-3"} text-lg text-primary pointer-events-none`}>stethoscope</span>
              <select
                aria-label={isRtl ? "التخصص" : "Specialty"}
                value={spec}
                onChange={(e) => setSpec(e.target.value)}
                className={`w-full h-11 bg-surface-container border border-transparent rounded-xl ${isRtl ? "pr-10 pl-3" : "pl-10 pr-3"} text-sm font-bold text-on-surface focus:bg-white focus:border-primary/35 focus:ring-2 focus:ring-primary/10 outline-none cursor-pointer transition-all`}
              >
                <option value="all">{isRtl ? "كل التخصصات" : "All specialties"}</option>
                {specOptions.map((s) => (
                  <option key={s} value={s}>{tSpec(s)} ({specCounts.get(s)})</option>
                ))}
              </select>
            </div>

            <div className="flex items-center bg-surface-container rounded-xl p-1 shrink-0" aria-label={isRtl ? "اختر المدينة" : "Choose a city"}>
              {CITIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCity(c)}
                  aria-pressed={city === c}
                  className={`flex-1 lg:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer whitespace-nowrap focus-visible:ring-2 focus-visible:ring-primary ${
                    city === c ? "bg-primary text-white shadow-sm" : "text-on-surface-variant hover:bg-white hover:text-on-surface"
                  }`}
                >
                  {cityLabel(c)}
                </button>
              ))}
            </div>

            {hasActiveFilters && (
              <button onClick={clearFacets} className="h-10 inline-flex items-center justify-center gap-1.5 px-3 text-sm font-bold text-primary hover:bg-primary/5 rounded-xl focus-visible:ring-2 focus-visible:ring-primary transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-lg">filter_alt_off</span>
                {isRtl ? "مسح الفلاتر" : "Clear filters"}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-14 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6" aria-live="polite">
          <p className="text-sm font-bold text-on-surface-variant">
            <span className="text-on-surface tabular-nums">{filtered.length}</span> {isRtl ? "طبيب" : filtered.length === 1 ? "doctor" : "doctors"}
            {spec !== "all" && <span className="text-primary"> · {tSpec(spec)}</span>}
            {city !== "all" && <span className="text-primary"> · {cityLabel(city)}</span>}
            {q.trim() && <span className="text-primary"> · “{q.trim()}”</span>}
          </p>
          {q.trim() && hiddenByFilters > 0 && (
            <button onClick={clearFacets} className="self-start text-xs font-extrabold text-primary hover:underline underline-offset-4 cursor-pointer">
              {isRtl ? `${hiddenByFilters} نتيجة أخرى خارج الفلاتر` : `${hiddenByFilters} more ${hiddenByFilters === 1 ? "match" : "matches"} outside filters`}
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center py-14 md:py-20 bg-surface-container/45 rounded-[28px] px-6">
            <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white text-primary shadow-sm mb-5">
              <span className="material-symbols-outlined text-3xl">{searched.length > 0 ? "filter_alt_off" : "search_off"}</span>
            </span>
            <h2 className="text-xl font-headline font-extrabold text-on-surface mb-2">
              {searched.length > 0
                ? (isRtl ? "وجدنا الطبيب، لكن الفلاتر تخفي النتيجة" : "We found matches, but your filters hide them")
                : t.noDoctorsYet}
            </h2>
            <p className="text-sm text-on-surface-variant font-medium max-w-md mx-auto leading-relaxed">
              {searched.length > 0
                ? (isRtl ? "امسح فلتر المدينة أو التخصص لعرض الأطباء المطابقين لبحثك." : "Clear the city or specialty filter to show the doctors matching your search.")
                : (isRtl ? "جرّب كتابة جزء من الاسم؛ البحث يتعامل مع الأخطاء الإملائية والاختلافات بين العربية والإنجليزية." : "Try part of the name. Search handles common misspellings and Arabic–English name variations.")}
            </p>
            {searched.length > 0 && (
              <button onClick={clearFacets} className="mt-6 inline-flex items-center gap-2 bg-primary hover:bg-primary-container text-white px-5 py-3 rounded-xl font-bold active:scale-[0.98] focus-visible:ring-4 focus-visible:ring-primary/20 transition-all cursor-pointer">
                <span className="material-symbols-outlined text-lg">visibility</span>
                {isRtl ? `عرض ${searched.length} نتيجة` : `Show ${searched.length} ${searched.length === 1 ? "match" : "matches"}`}
              </button>
            )}
            {searched.length === 0 && didYouMean.length > 0 && (
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
            {searched.length === 0 && (
              <button onClick={resetSearch} className="block mx-auto text-primary font-bold hover:underline underline-offset-4 mt-6 cursor-pointer">
                {isRtl ? "إعادة ضبط البحث" : "Reset search"}
              </button>
            )}
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

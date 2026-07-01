"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useLang } from "@/app/i18n/context";
import translations, { type TranslationKey } from "@/app/i18n/translations";
import { doctorFilters, specNameToKey } from "@/app/lib/specialties";
import type { Doctor } from "@/app/lib/doctors";

const PAGE = 24;

export default function DoctorDirectory({ doctors }: { doctors: Doctor[] }) {
  const { lang } = useLang();
  const t = translations[lang];
  const isRtl = lang === "ar";
  const searchParams = useSearchParams();

  const initialSpec = searchParams.get("spec") || searchParams.get("specialty") || "all";
  const [spec, setSpec] = useState(initialSpec);
  const [city, setCity] = useState("all");
  const [q, setQ] = useState("");
  const [visible, setVisible] = useState(PAGE);

  // Reset pagination whenever a filter changes.
  useEffect(() => { setVisible(PAGE); }, [spec, city, q]);

  const tSpec = (name: string) => {
    const key = specNameToKey[name];
    return key ? t[`spec.${key}` as TranslationKey] || name : name;
  };

  // Specialty options: canonical order, only those present in the data.
  const present = useMemo(() => new Set(doctors.flatMap((d) => d.specialties)), [doctors]);
  const specOptions = doctorFilters.filter((s) => present.has(s));

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return doctors.filter((d) => {
      if (spec !== "all" && !d.specialties.includes(spec)) return false;
      if (city !== "all" && !d.cities.includes(city)) return false;
      if (needle) {
        const hay = `${d.name_en} ${d.name_ar ?? ""} ${d.specialty_raw ?? ""}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [doctors, spec, city, q]);

  const shown = filtered.slice(0, visible);

  const subtitle = (d: Doctor) =>
    isRtl && d.specialties[0] ? tSpec(d.specialties[0]) : d.specialty_raw || (d.specialties[0] ? tSpec(d.specialties[0]) : "");

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
              ? `اختر من بين ${doctors.length}+ طبيباً متخصصاً عبر فروعنا في جدة والرياض. ابحث بالاسم أو صفِّ النتائج حسب التخصص والمدينة.`
              : `Choose from ${doctors.length}+ specialist doctors across Jeddah & Riyadh. Search by name or filter by specialty and city.`}
          </p>
        </div>
      </section>

      {/* Filter bar */}
      <section className="sticky top-[64px] z-30 bg-surface/90 backdrop-blur-md border-b border-outline-variant/20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-5 relative">
            <span className={`material-symbols-outlined absolute top-1/2 -translate-y-1/2 ${isRtl ? "right-4" : "left-4"} text-on-surface-variant`}>search</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={isRtl ? "ابحث عن طبيب أو تخصص..." : "Search by doctor or specialty..."}
              className={`w-full bg-surface-container-lowest border border-outline-variant/40 rounded-full py-3 ${isRtl ? "pr-12 pl-4" : "pl-12 pr-4"} text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all`}
            />
          </div>
          <select value={spec} onChange={(e) => setSpec(e.target.value)} className="md:col-span-4 bg-surface-container-lowest border border-outline-variant/40 rounded-full py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary outline-none cursor-pointer">
            <option value="all">{isRtl ? "كل التخصصات" : "All specialties"}</option>
            {specOptions.map((s) => <option key={s} value={s}>{tSpec(s)}</option>)}
          </select>
          <select value={city} onChange={(e) => setCity(e.target.value)} className="md:col-span-3 bg-surface-container-lowest border border-outline-variant/40 rounded-full py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary outline-none cursor-pointer">
            <option value="all">{isRtl ? "كل المدن" : "All cities"}</option>
            <option value="Jeddah">{t.jeddah}</option>
            <option value="Riyadh">{t.riyadh}</option>
          </select>
        </div>
      </section>

      {/* Results */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-14 w-full">
        <p className="text-sm font-bold text-on-surface-variant mb-6">
          {filtered.length} {isRtl ? "طبيب" : filtered.length === 1 ? "doctor" : "doctors"}
          {spec !== "all" && <span className="text-primary"> · {tSpec(spec)}</span>}
        </p>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">search_off</span>
            <p className="text-lg font-bold text-on-surface mb-1">{t.noDoctorsYet}</p>
            <button onClick={() => { setSpec("all"); setCity("all"); setQ(""); }} className="text-primary font-bold hover:underline mt-2 cursor-pointer">
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
                      {d.image_url && (
                        <Image src={d.image_url} alt={d.name_en} fill className="object-cover object-top group-hover:scale-105 transition-transform duration-500" sizes="(max-width:768px) 50vw, (max-width:1280px) 33vw, 25vw" loading={i < 8 ? "eager" : "lazy"} />
                      )}
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

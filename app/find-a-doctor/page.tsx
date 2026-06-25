"use client";

import { Suspense, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { doctorsData, type Doctor } from "@/app/doctors-data";
import { useLang } from "@/app/i18n/context";
import translations, { type TranslationKey } from "@/app/i18n/translations";
import { doctorFilters, specNameToKey } from "@/app/lib/specialties";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";

const WHATSAPP_LINK = `https://wa.me/966920022811?text=${encodeURIComponent("مرحباً، أود حجز موعد في عيادتي")}`;

function FindADoctor() {
  const { lang } = useLang();
  const t = translations[lang];
  const isRtl = lang === "ar";
  const searchParams = useSearchParams();

  const initialSpec = searchParams.get("spec") || "all";
  const [spec, setSpec] = useState<string>(doctorFilters.includes(initialSpec) ? initialSpec : "all");
  const [city, setCity] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Doctor | null>(null);

  const tSpec = (enName: string) => {
    const key = specNameToKey[enName];
    return key ? t[`spec.${key}` as TranslationKey] || enName : enName;
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return doctorsData.filter((d) => {
      const matchSpec = spec === "all" || d.spec === spec;
      const matchCity = city === "all" || (d.location || "").toLowerCase().includes(city.toLowerCase());
      const matchQuery =
        !q ||
        d.name.toLowerCase().includes(q) ||
        (d.nameAr || "").toLowerCase().includes(q) ||
        tSpec(d.spec).toLowerCase().includes(q);
      return matchSpec && matchCity && matchQuery;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spec, city, query, lang]);

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="min-h-screen bg-surface flex flex-col">
      <SiteNav />

      <main className="flex-1">
        {/* Hero band */}
        <section className="relative overflow-hidden bg-surface hero-gradient border-b border-outline-variant/20">
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <div className="absolute top-[-30%] right-[-5%] w-[480px] h-[480px] bg-primary/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-40%] left-[-5%] w-[420px] h-[420px] bg-secondary/10 rounded-full blur-[100px]" />
          </div>
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20 relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-extrabold uppercase tracking-label mb-5">
                {t.ourSpecialists}
              </div>
              <h1 className={`text-4xl md:text-6xl font-headline font-extrabold text-primary tracking-tighter text-glow mb-4 ${isRtl ? "leading-[1.4]" : "leading-[1.1]"}`}>
                {isRtl ? "ابحث عن طبيب" : "Find a Doctor"}
              </h1>
              <p className="text-on-surface-variant text-base md:text-lg font-medium leading-relaxed opacity-90">
                {isRtl
                  ? "اختر من بين أكثر من 100 طبيب متخصص في 27 تخصصاً عبر فروعنا في جدة والرياض. ابحث بالاسم أو صفِّ النتائج حسب التخصص والمدينة."
                  : "Choose from 100+ specialist doctors across 27 specialties in Jeddah & Riyadh. Search by name or filter by specialty and city."}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters */}
        <section className="sticky top-[64px] z-30 bg-surface/90 backdrop-blur-md border-b border-outline-variant/20">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-5 relative">
              <span className={`material-symbols-outlined absolute top-1/2 -translate-y-1/2 ${isRtl ? "right-4" : "left-4"} text-on-surface-variant`}>search</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isRtl ? "ابحث عن طبيب أو تخصص..." : "Search by doctor or specialty..."}
                className={`w-full bg-surface-container-lowest border border-outline-variant/40 rounded-full py-3 ${isRtl ? "pr-12 pl-4" : "pl-12 pr-4"} text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all`}
              />
            </div>
            <select
              value={spec}
              onChange={(e) => setSpec(e.target.value)}
              className="md:col-span-4 bg-surface-container-lowest border border-outline-variant/40 rounded-full py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all cursor-pointer"
            >
              <option value="all">{isRtl ? "كل التخصصات" : "All specialties"}</option>
              {doctorFilters.map((f) => (
                <option key={f} value={f}>{tSpec(f)}</option>
              ))}
            </select>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="md:col-span-3 bg-surface-container-lowest border border-outline-variant/40 rounded-full py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary outline-none transition-all cursor-pointer"
            >
              <option value="all">{isRtl ? "كل المدن" : "All cities"}</option>
              <option value="Jeddah">{t.jeddah}</option>
              <option value="Riyadh">{t.riyadh}</option>
            </select>
          </div>
        </section>

        {/* Results */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-14 w-full">
          <p className="text-sm font-bold text-on-surface-variant mb-6">
            {filtered.length}{" "}
            {isRtl ? "طبيب" : filtered.length === 1 ? "doctor" : "doctors"}
            {spec !== "all" && <span className="text-primary"> · {tSpec(spec)}</span>}
          </p>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">search_off</span>
              <p className="text-lg font-bold text-on-surface mb-1">{t.noDoctorsYet}</p>
              <button onClick={() => { setSpec("all"); setCity("all"); setQuery(""); }} className="text-primary font-bold hover:underline mt-2 cursor-pointer">
                {isRtl ? "إعادة ضبط الفلاتر" : "Reset filters"}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((doc, i) => (
                <motion.button
                  key={`${doc.name}-${i}`}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
                  onClick={() => setSelected(doc)}
                  className="group text-start bg-surface-container-lowest rounded-3xl overflow-hidden border border-outline-variant/20 shadow-clinical hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-surface-container">
                    <Image src={doc.img} alt={doc.name} fill className="object-cover object-top group-hover:scale-105 transition-transform duration-500" sizes="(max-width:640px) 100vw, (max-width:1280px) 33vw, 25vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent" />
                    <span className={`absolute bottom-3 ${isRtl ? "right-3" : "left-3"} bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full text-[10px] font-bold`}>
                      {tSpec(doc.spec)}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-headline font-extrabold text-primary text-lg leading-tight mb-1 line-clamp-1">
                      {isRtl && doc.nameAr ? doc.nameAr : doc.name}
                    </h3>
                    <p className="text-on-surface-variant text-sm font-medium mb-3 line-clamp-1">
                      {isRtl && doc.titleAr ? doc.titleAr : doc.title}
                    </p>
                    {doc.location && (
                      <p className="flex items-center gap-1.5 text-xs text-on-surface-variant/80">
                        <span className="material-symbols-outlined text-sm text-primary">location_on</span>
                        <span className="line-clamp-1">{doc.location}</span>
                      </p>
                    )}
                    <span className="mt-4 inline-flex items-center gap-1 text-primary text-sm font-bold group-hover:gap-2 transition-all">
                      {isRtl ? "عرض الملف" : "View profile"}
                      <span className={`material-symbols-outlined text-base ${isRtl ? "rotate-180" : ""}`}>arrow_forward</span>
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </section>
      </main>

      <SiteFooter />

      {/* Floating WhatsApp */}
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className={`fixed bottom-6 ${isRtl ? "left-6" : "right-6"} z-40 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:scale-110 transition-all`}
      >
        <i className="fa-brands fa-whatsapp text-white text-2xl" />
      </a>

      {/* Doctor modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-surface-container-lowest rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-72 sm:h-80 overflow-hidden">
                <Image src={selected.img} alt={selected.name} fill className="object-cover object-top" sizes="(max-width:640px) 100vw, 512px" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
                <button onClick={() => setSelected(null)} className={`absolute top-4 ${isRtl ? "left-4" : "right-4"} w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all cursor-pointer`}>
                  <span className="material-symbols-outlined">close</span>
                </button>
                <div className={`absolute bottom-4 ${isRtl ? "right-6" : "left-6"}`}>
                  <span className="bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full text-[10px] font-bold uppercase">{tSpec(selected.spec)}</span>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-headline font-extrabold text-primary mb-1">{isRtl && selected.nameAr ? selected.nameAr : selected.name}</h3>
                <p className="text-on-surface-variant font-medium mb-6">{isRtl && selected.titleAr ? selected.titleAr : selected.title}</p>
                <div className="space-y-4 mb-8">
                  {selected.education && selected.education.length > 0 && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-primary text-xl">school</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">{t.educationQualifications}</p>
                        <ul className="text-sm text-on-surface space-y-1">
                          {(isRtl && selected.educationAr ? selected.educationAr : selected.education).map((e, idx) => (
                            <li key={idx}>{e}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  {selected.languages && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-primary text-xl">translate</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">{t.languages}</p>
                        <p className="text-sm text-on-surface">{selected.languages}</p>
                      </div>
                    </div>
                  )}
                  {selected.location && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-primary text-xl">location_on</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">{t.location}</p>
                        <p className="text-sm text-on-surface">{selected.location}</p>
                      </div>
                    </div>
                  )}
                </div>
                <Link
                  href="/#booking-form"
                  className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-container text-white font-bold py-4 rounded-full shadow-lg shadow-primary/30 active:scale-95 transition-all"
                >
                  {t.requestAppointmentWith} {isRtl && selected.nameAr ? selected.nameAr : selected.name.replace(/^Dr\.\s*/, "Dr. ")}
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FindADoctorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface" />}>
      <FindADoctor />
    </Suspense>
  );
}

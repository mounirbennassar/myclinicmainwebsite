"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLang } from "@/app/i18n/context";
import translations, { type TranslationKey } from "@/app/i18n/translations";
import { specKeys, specIcons, doctorFilters, type SpecKey } from "@/app/lib/specialties";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";

export default function SpecialtiesPage() {
  const { lang } = useLang();
  const t = translations[lang];
  const isRtl = lang === "ar";

  // Live doctor count per specialty (keyed by the doctor-filter label).
  // The doctors dataset is ~97KB of source, so it is imported lazily after
  // mount instead of being bundled into the page — cards render immediately
  // with their "Service available" fallback and the counts fill in.
  const [counts, setCounts] = useState<Record<string, number>>({});
  useEffect(() => {
    import("@/app/doctors-data").then(({ doctorsData }) => {
      const map: Record<string, number> = {};
      for (const d of doctorsData) map[d.spec] = (map[d.spec] || 0) + 1;
      setCounts(map);
    });
  }, []);

  // Pediatrics, Dental and Women & Family Medicine have their own dedicated
  // landing pages — feature them first and link straight to those experiences
  // instead of the doctor finder. Obstetrics & Gynecology and Family Medicine
  // both route into the shared Women & Family Medicine hub. Every other
  // specialty keeps its /find-doctor deep-link.
  const FEATURED_HREF: Partial<Record<SpecKey, string>> = {
    pediatrics: "/pediatric",
    dental: "/dental",
    obGyn: "/female-medicine",
    familyMedicine: "/female-medicine",
  };
  const orderedKeys: SpecKey[] = [
    "pediatrics",
    "dental",
    "obGyn",
    "familyMedicine",
    ...specKeys.filter((k) => !FEATURED_HREF[k]),
  ];

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
                {t.specialtiesServices}
              </div>
              <h1 className={`text-4xl md:text-6xl font-headline font-extrabold text-primary tracking-tighter text-glow mb-4 ${isRtl ? "leading-[1.4]" : "leading-[1.1]"}`}>
                {t.comprehensiveCare}
              </h1>
              <p className="text-on-surface-variant text-base md:text-lg font-medium leading-relaxed opacity-90">
                {t.comprehensiveCareDesc}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Specialties grid */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {orderedKeys.map((key, pos) => {
              const i = specKeys.indexOf(key);
              const filter = doctorFilters[i];
              const count = counts[filter] || 0;
              const featured = Boolean(FEATURED_HREF[key]);
              const href = FEATURED_HREF[key] ?? `/find-doctor?spec=${encodeURIComponent(filter)}`;
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: (pos % 3) * 0.05 }}
                >
                  <Link
                    href={href}
                    className={`group flex items-start gap-4 h-full bg-surface-container-lowest rounded-3xl p-6 border shadow-clinical hover:shadow-xl hover:-translate-y-1 transition-all ${featured ? "border-primary/30 ring-1 ring-primary/10" : "border-outline-variant/20 hover:border-primary/30"}`}
                  >
                    <div className="w-14 h-14 shrink-0 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-2xl">{specIcons[i]}</span>
                    </div>
                    <div className="min-w-0">
                      {featured && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-wider mb-1.5">
                          <span className="material-symbols-outlined text-[13px]">verified</span>
                          {isRtl ? "مركز متخصص" : "Specialized Center"}
                        </span>
                      )}
                      <h3 className="font-headline font-extrabold text-primary text-lg leading-tight mb-1">
                        {t[`spec.${key}` as TranslationKey]}
                      </h3>
                      <p className="text-on-surface-variant text-sm font-medium leading-relaxed mb-3">
                        {t[`specDesc.${key}` as TranslationKey]}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary">
                        {featured
                          ? (isRtl ? "تصفّح الصفحة" : "Explore page")
                          : count > 0
                            ? `${count} ${isRtl ? "طبيب" : count === 1 ? "doctor" : "doctors"}`
                            : (isRtl ? "خدمة متوفرة" : "Service available")}
                        <span className={`material-symbols-outlined text-sm transition-opacity ${featured ? "" : "opacity-0 group-hover:opacity-100"} ${isRtl ? "rotate-180" : ""}`}>arrow_forward</span>
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* CTA band */}
        <section className="bg-primary relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-[-20%] right-[10%] w-72 h-72 bg-white rounded-full blur-3xl" />
          </div>
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-16 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-start">
            <div>
              <h2 className="text-2xl md:text-3xl font-headline font-extrabold text-white mb-2">
                {isRtl ? "لست متأكداً من التخصص المناسب؟" : "Not sure which specialty you need?"}
              </h2>
              <p className="text-white/80 font-medium max-w-xl">
                {isRtl ? "تواصل مع منسّق الرعاية لدينا وسنوجّهك إلى الطبيب المناسب لحالتك." : "Talk to our care coordinator and we'll guide you to the right doctor for your needs."}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <Link href="/find-doctor" className="bg-white text-primary px-6 py-3.5 rounded-full font-bold shadow-lg hover:scale-105 transition-transform whitespace-nowrap">
                {isRtl ? "عرض جميع الأطباء" : "View All Doctors"}
              </Link>
              <Link href="/#booking-form" className="bg-white/15 text-white border border-white/30 px-6 py-3.5 rounded-full font-bold hover:bg-white/25 transition-colors whitespace-nowrap">
                {t.requestAppointment}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

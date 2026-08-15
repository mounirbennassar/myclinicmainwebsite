"use client";
import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { Doctor } from "@/app/lib/doctors";
import { useDoctors } from "@/app/components/DoctorsProvider";
import { useLang } from "@/app/i18n/context";
import { doctorAvatar } from "@/app/lib/doctor-avatar";
import DoctorWatermark from "@/app/components/DoctorWatermark";
import {
  doctorEducation,
  doctorLanguages,
  doctorLocation,
  doctorName,
  doctorTitle,
} from "@/app/lib/doctor-display";
import DentalDoctorCard from "./DentalDoctorCard";

type Props = {
  match?: (titleOrSpec: string) => boolean;
  /** Cap the rail. Omit for every match — the default. */
  limit?: number | null;
  variant?: "section" | "footer";
};

type CityFilter = "all" | "Riyadh" | "Jeddah";

export default function DentalDoctorsStrip({ match, limit = null, variant = "section" }: Props) {
  const { lang } = useLang();
  const isRtl = lang === "ar";
  const carouselRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<Doctor | null>(null);
  const [city, setCity] = useState<CityFilter>("all");

  // Every dentist in the DB, loaded once by the dental layout (a server
  // component) so these names are in the SSR HTML and the CMS can edit them.
  const all = useDoctors();

  const dentists = useMemo(() => {
    // services.ts matches on the descriptive line ("Orthodontics Consultant"),
    // which is specialty_raw here; title_ar lets its Arabic patterns still hit.
    const matched = match
      ? all.filter((d) => match(`${d.specialty_raw || ""} ${d.title || ""} ${d.title_ar || ""}`))
      : all;
    // Show every specialist who matches. The old default stopped at 8, which
    // would drop 5 of the 13 implant/oral surgeons once the per-service pages
    // go live (they are all DentalComingSoon placeholders today, so only the
    // uncapped /dental call currently reaches this).
    const list = matched.length ? matched : all;
    const byCity = city === "all" ? list : list.filter((d) => (d.cities || []).includes(city));
    return limit === null ? byCity : byCity.slice(0, limit);
  }, [all, match, limit, city]);

  const CITY_FILTERS: { key: CityFilter; ar: string; en: string }[] = [
    { key: "all", ar: "جميع الفروع", en: "All branches" },
    { key: "Riyadh", ar: "الرياض", en: "Riyadh" },
    { key: "Jeddah", ar: "جدة", en: "Jeddah" },
  ];

  if (variant === "footer") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {dentists.slice(0, 4).map((d) => (
          <DentalDoctorCard key={d.id} doctor={d} />
        ))}
      </div>
    );
  }

  // scrollBy deltas are visual-coordinate in both directions, so the left
  // button always moves the rail visually left — RTL included.
  const scroll = (direction: "left" | "right") => {
    const container = carouselRef.current;
    if (!container) return;
    const card = container.querySelector<HTMLElement>(":scope > *");
    const amount = ((card?.offsetWidth || 200) + 20) * 2;
    container.scrollBy({ left: direction === "right" ? amount : -amount, behavior: "smooth" });
  };

  return (
    <section id="dental-doctors" className="py-20 md:py-28 bg-white overflow-x-clip scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Design-v2 header row: copy on the reading side, arrows on the end */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="flex items-end justify-between gap-6 flex-wrap mb-10 md:mb-12"
        >
          <div className="max-w-[560px]">
            <span className="flex items-center gap-3 text-[#004d99] font-bold text-[13px] md:text-sm tracking-[0.05em] mb-4">
              <span className="w-[30px] h-[2px] bg-[#004d99]" aria-hidden />
              {isRtl ? "الأطباء" : "Our doctors"}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-[40px] font-extrabold text-[#003868] tracking-tight leading-[1.4]">
              {isRtl ? (
                <>خبرات <span className="text-[#004d99]">تثقون بها</span></>
              ) : (
                <>Expertise <span className="text-[#004d99]">you can trust</span></>
              )}
            </h2>
            <p className="mt-4 text-base md:text-[16.5px] text-[#3D434D] leading-[1.9]">
              {isRtl
                ? "وراء كل ابتسامة ناجحة فريق من الاستشاريين والأخصائيين يعمل بتناغم ليقدم لكم تشخيصاً دقيقاً، وخطة علاجية مدروسة، ونتائج يمكنكم الوثوق بها."
                : "Behind every successful smile is a team of consultants and specialists working in harmony — precise diagnosis, a considered treatment plan, and results you can rely on."}
            </p>
          </div>

          {/* Arrow controls — forced LTR layout so the left button is visually left
              and the right button is visually right, in both English and Arabic. */}
          {dentists.length > 1 && (
            <div dir="ltr" className="flex gap-2.5 shrink-0 pb-1">
              <button
                onClick={() => scroll("left")}
                className="w-12 h-12 rounded-full bg-white border border-[#E3E6EA] text-[#003868] flex items-center justify-center shadow-sm hover:border-[#004d99]/50 hover:bg-[#004d99] hover:text-white transition-all cursor-pointer"
                aria-label="Scroll left"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-12 h-12 rounded-full bg-white border border-[#E3E6EA] text-[#003868] flex items-center justify-center shadow-sm hover:border-[#004d99]/50 hover:bg-[#004d99] hover:text-white transition-all cursor-pointer"
                aria-label="Scroll right"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          )}
        </motion.div>

        {/* City filter — segmented pills, elegant and touch-friendly */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="flex items-center gap-3 mb-7 md:mb-8"
        >
          <span className="hidden sm:inline-flex items-center gap-2 text-[13px] font-bold text-[#797C82]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#004d99" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0ZM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
            </svg>
            {isRtl ? "اختر الفرع" : "Choose a branch"}
          </span>
          <div className="inline-flex items-center gap-1 bg-[#F2F6FA] rounded-full p-1.5">
            {CITY_FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setCity(f.key)}
                aria-pressed={city === f.key}
                className={`px-5 py-2 rounded-full text-[13.5px] font-bold transition-all cursor-pointer ${
                  city === f.key
                    ? "bg-[#003868] text-white shadow-[0_8px_20px_-8px_rgba(0,56,104,0.5)]"
                    : "text-[#3D434D] hover:text-[#004d99]"
                }`}
              >
                {isRtl ? f.ar : f.en}
              </button>
            ))}
          </div>
          <span className="hidden md:block text-[12.5px] text-[#797C82] font-medium ms-1" dir="ltr">
            {dentists.length > 0 && (isRtl ? `${dentists.length} طبيباً` : `${dentists.length} doctors`)}
          </span>
        </motion.div>

        <div className="relative">
          <div
            ref={carouselRef}
            dir={isRtl ? "rtl" : "ltr"}
            className="flex overflow-x-scroll snap-x snap-mandatory gap-4 md:gap-5 pb-6 md:pb-8 hide-scrollbar"
            style={{ scrollBehavior: "smooth" }}
          >
            {dentists.map((doc, i) => {
              const name = doctorName(doc, isRtl);
              const title = doctorTitle(doc, isRtl);
              return (
                <motion.button
                  key={doc.id}
                  type="button"
                  onClick={() => setSelected(doc)}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55, delay: i * 0.05, ease: [0.21, 0.47, 0.32, 0.98] }}
                  dir={isRtl ? "rtl" : "ltr"}
                  className="relative w-[210px] sm:w-[225px] lg:w-[calc((100%-100px)/6)] h-[300px] lg:h-[310px] snap-start shrink-0 group rounded-[20px] overflow-hidden bg-white text-start ring-1 ring-[#E3E6EA] shadow-[0_14px_36px_-18px_rgba(0,56,104,0.3)] hover:-translate-y-2 hover:shadow-[0_30px_60px_-24px_rgba(0,56,104,0.4)] transition-all duration-300 cursor-pointer"
                  aria-label={isRtl ? `تفاصيل ${name}` : `Details for ${name}`}
                >
                  {/* Flat white behind the portrait — the cut-out photos carry a
                      white circular disc that a tinted panel exposes as a circle. */}
                  <div className="absolute inset-0">
                    <Image
                      alt={name}
                      src={doc.image_url || doctorAvatar(doc.name_en, doc.name_ar, doc.gender)}
                      fill
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      sizes="320px"
                      loading="lazy"
                    />
                    <DoctorWatermark isRtl={isRtl} />
                  </div>
                  <span className={`absolute top-3 ${isRtl ? "right-3" : "left-3"} bg-white/90 backdrop-blur text-[#003868] px-2.5 py-1 rounded-full text-[10px] font-bold shadow-md whitespace-nowrap`}>
                    {isRtl ? "أسنان" : "Dental"}
                  </span>
                  {/* Glass name plate */}
                  <span className="absolute left-2.5 right-2.5 bottom-2.5 block bg-white/90 backdrop-blur-[10px] rounded-xl px-3 py-2.5 shadow-[0_10px_26px_-14px_rgba(0,31,61,0.5)]">
                    <span className="block text-[13px] font-extrabold text-[#003868] leading-tight truncate">{name}</span>
                    <span className="mt-0.5 block text-[11px] font-semibold text-[#004d99] leading-snug line-clamp-2">{title}</span>
                  </span>
                </motion.button>
              );
            })}
          </div>

        </div>
      </div>

      {/* ── Modal ────────────────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              dir={isRtl ? "rtl" : "ltr"}
            >
              <div className="relative h-72 sm:h-96 overflow-hidden bg-white">
                <Image src={selected.image_url || doctorAvatar(selected.name_en, selected.name_ar, selected.gender)} alt={selected.name_en} fill className="object-cover object-top" sizes="(max-width: 640px) 100vw, 512px" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#003868] via-[#003868]/30 to-transparent" />
                <button
                  onClick={() => setSelected(null)}
                  className={`absolute top-4 ${isRtl ? "left-4" : "right-4"} w-10 h-10 bg-white/25 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-[#003867] transition-all cursor-pointer`}
                  aria-label="Close"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
                <div className={`absolute bottom-4 ${isRtl ? "right-6" : "left-6"}`}>
                  <span className="bg-white/90 backdrop-blur text-[#003867] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {isRtl ? "أسنان" : "Dental"}
                  </span>
                </div>
              </div>
              <div className="p-7 md:p-8">
                <h3 className="text-2xl font-extrabold text-slate-900 mb-1">
                  {doctorName(selected, isRtl)}
                </h3>
                <p className="text-[#004d99] font-semibold mb-6">
                  {doctorTitle(selected, isRtl)}
                </p>
                <div className="space-y-4 mb-7">
                  {doctorEducation(selected, isRtl).length > 0 && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#003868]/10 to-[#004d99]/15 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-[#004d99] text-lg">school</span>
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-500 uppercase font-bold tracking-wider mb-1">
                          {isRtl ? "المؤهلات العلمية" : "Education & Qualifications"}
                        </p>
                        {doctorEducation(selected, isRtl).map((edu, i) => (
                          <p key={i} className="text-sm font-medium text-slate-700 leading-relaxed">{edu}</p>
                        ))}
                      </div>
                    </div>
                  )}
                  {doctorLanguages(selected, isRtl) && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#003868]/10 to-[#004d99]/15 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[#004d99] text-lg">translate</span>
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">
                          {isRtl ? "اللغات" : "Languages"}
                        </p>
                        <p className="text-sm font-medium text-slate-700">
                          {doctorLanguages(selected, isRtl)}
                        </p>
                      </div>
                    </div>
                  )}
                  {doctorLocation(selected, isRtl) && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#003868]/10 to-[#004d99]/15 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[#004d99] text-lg">location_on</span>
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">
                          {isRtl ? "الفرع" : "Location"}
                        </p>
                        <p className="text-sm font-medium text-slate-700">
                          {doctorLocation(selected, isRtl)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => {
                    setSelected(null);
                    document.getElementById("dental-booking")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full py-4 bg-[#004d99] hover:bg-[#003868] text-white rounded-full font-bold shadow-lg shadow-[#004d99]/30 hover:shadow-xl active:scale-95 transition-all cursor-pointer"
                >
                  {isRtl
                    ? `احجز مع ${selected.name_ar ? selected.name_ar.split(" ").slice(1).join(" ") : selected.name_en}`
                    : `Book with ${selected.name_en.split(" ")[1] || selected.name_en}`}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

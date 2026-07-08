"use client";
import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { doctorsData, type Doctor } from "@/app/doctors-data";
import { useLang } from "@/app/i18n/context";
import { doctorInitials } from "@/app/lib/doctor-avatar";
import DentalDoctorCard from "./DentalDoctorCard";

const locationArMap: Record<string, string> = {
  "Jeddah Al Mohammadiyah": "جدة المحمدية",
  "Jeddah Al Safa": "جدة الصفا",
  "Jeddah Al Khalidiyyah": "جدة الخالدية",
  "Jeddah Al Mohammadiyah + Dental Center": "جدة المحمدية + مركز الأسنان",
  "Jeddah Al Mohammadiyah + Obhour": "جدة المحمدية + أبحر",
  "Riyadh Al Sahafa": "الرياض الصحافة",
};

const languagesArMap: Record<string, string> = {
  "English, Arabic": "الإنجليزية، العربية",
  "English, Arabic, French": "الإنجليزية، العربية، الفرنسية",
};

type Props = {
  match?: (titleOrSpec: string) => boolean;
  limit?: number;
  variant?: "section" | "footer";
};

export default function DentalDoctorsStrip({ match, limit = 8, variant = "section" }: Props) {
  const { lang } = useLang();
  const isRtl = lang === "ar";
  const carouselRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<Doctor | null>(null);

  const dentists = useMemo(() => {
    const all = doctorsData.filter((d) => d.spec === "Dental");
    const matched = match ? all.filter((d) => match(`${d.title} ${d.spec}`)) : all;
    return (matched.length ? matched : all).slice(0, limit);
  }, [match, limit]);

  if (variant === "footer") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {dentists.slice(0, 4).map((d) => (
          <DentalDoctorCard key={d.name} doctor={d} />
        ))}
      </div>
    );
  }

  const scroll = (direction: "left" | "right") => {
    const container = carouselRef.current;
    if (!container) return;
    const card = container.querySelector<HTMLElement>(":scope > div");
    const amount = (card?.offsetWidth || 280) + 24;
    container.scrollBy({ left: direction === "right" ? amount : -amount, behavior: "smooth" });
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-[#00677d]/[0.04] to-[#003867]/[0.06] overflow-x-clip">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#00677d]">
            {isRtl ? "فريقنا" : "Our Team"}
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            {isRtl ? "تعرّف على أطباء الأسنان لدينا" : "Meet our dental specialists"}
          </h2>
          <div className="mt-5 mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-[#003867] via-[#00677d] to-[#00677d]/40" />
          <p className="mt-5 text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {isRtl
              ? "نخبة من استشاريي وأخصائيي طب الأسنان بخبرات دولية وآلاف الحالات الناجحة."
              : "Board-certified consultants and specialists with international training and thousands of completed cases."}
          </p>
        </motion.div>

        <div className="relative">
          {/* Arrow controls — forced LTR layout so the left button is visually left
              and the right button is visually right, in both English and Arabic. */}
          {dentists.length > 1 && (
            <div dir="ltr" className="flex items-center justify-end gap-2 mb-5">
              <button
                onClick={() => scroll("left")}
                className="w-11 h-11 rounded-full bg-white border border-[#00677d]/25 text-[#003867] flex items-center justify-center shadow-sm hover:border-[#00677d]/60 hover:bg-gradient-to-br hover:from-[#003867] hover:to-[#00677d] hover:text-white transition-all cursor-pointer"
                aria-label="Scroll left"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-11 h-11 rounded-full bg-white border border-[#00677d]/25 text-[#003867] flex items-center justify-center shadow-sm hover:border-[#00677d]/60 hover:bg-gradient-to-br hover:from-[#003867] hover:to-[#00677d] hover:text-white transition-all cursor-pointer"
                aria-label="Scroll right"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          )}

          <div
            ref={carouselRef}
            dir="ltr"
            className="flex overflow-x-scroll snap-x snap-mandatory gap-5 md:gap-6 pb-6 md:pb-8 hide-scrollbar"
            style={{ scrollBehavior: "smooth" }}
          >
            {dentists.map((doc, i) => {
              const name = isRtl && doc.nameAr ? doc.nameAr : doc.name;
              const title = isRtl && doc.titleAr ? doc.titleAr : doc.title;
              return (
                <motion.div
                  key={doc.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55, delay: i * 0.05, ease: [0.21, 0.47, 0.32, 0.98] }}
                  className="w-[260px] sm:w-[280px] lg:w-[300px] snap-start shrink-0 group bg-white rounded-2xl p-5 md:p-6 shadow-lg shadow-[#00677d]/10 border border-[#00677d]/10 hover:border-[#00677d]/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#00677d]/15 transition-all duration-300"
                >
                  <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden mb-5 bg-gradient-to-br from-[#003867]/5 to-[#00677d]/10">
                    {doc.img ? (
                      <Image
                        alt={name}
                        src={doc.img}
                        fill
                        className="object-cover group-hover:grayscale transition-all duration-500 group-hover:scale-105"
                        sizes="300px"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#003867] to-[#00677d]">
                        <span className="text-white font-extrabold text-5xl select-none">{doctorInitials(doc.name)}</span>
                      </div>
                    )}
                    <div className={`absolute top-3 ${isRtl ? "right-3" : "left-3"} bg-gradient-to-r from-[#003867] to-[#00677d] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md`}>
                      {isRtl ? "أسنان" : "Dental"}
                    </div>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 mb-1 leading-tight">{name}</h3>
                  <p className="text-[#00677d] text-sm font-semibold mb-4 leading-tight">{title}</p>
                  <div className={`flex ${isRtl ? "justify-start" : "justify-end"}`}>
                    <button
                      onClick={() => setSelected(doc)}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-[#003867] to-[#00677d] text-white flex items-center justify-center shadow-md shadow-[#00677d]/30 group-hover:scale-110 transition-transform cursor-pointer"
                      aria-label={isRtl ? "تفاصيل الطبيب" : "Doctor details"}
                    >
                      <span className="material-symbols-outlined text-[20px]">add</span>
                    </button>
                  </div>
                </motion.div>
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
              <div className="relative h-72 sm:h-96 overflow-hidden">
                {selected.img ? (
                  <Image src={selected.img} alt={selected.name} fill className="object-cover object-top" sizes="(max-width: 640px) 100vw, 512px" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#003867] to-[#00677d]">
                    <span className="text-white font-extrabold text-[5rem] select-none">{doctorInitials(selected.name)}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#003867] via-[#00677d]/40 to-transparent" />
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
                  {isRtl && selected.nameAr ? selected.nameAr : selected.name}
                </h3>
                <p className="text-[#00677d] font-semibold mb-6">
                  {isRtl && selected.titleAr ? selected.titleAr : selected.title}
                </p>
                <div className="space-y-4 mb-7">
                  {selected.education && selected.education.length > 0 && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#003867]/10 to-[#00677d]/15 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-[#00677d] text-lg">school</span>
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-500 uppercase font-bold tracking-wider mb-1">
                          {isRtl ? "المؤهلات العلمية" : "Education & Qualifications"}
                        </p>
                        {(isRtl && selected.educationAr ? selected.educationAr : selected.education).map((edu, i) => (
                          <p key={i} className="text-sm font-medium text-slate-700 leading-relaxed">{edu}</p>
                        ))}
                      </div>
                    </div>
                  )}
                  {selected.languages && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#003867]/10 to-[#00677d]/15 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[#00677d] text-lg">translate</span>
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">
                          {isRtl ? "اللغات" : "Languages"}
                        </p>
                        <p className="text-sm font-medium text-slate-700">
                          {isRtl ? (languagesArMap[selected.languages] || selected.languages) : selected.languages}
                        </p>
                      </div>
                    </div>
                  )}
                  {selected.location && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#003867]/10 to-[#00677d]/15 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[#00677d] text-lg">location_on</span>
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">
                          {isRtl ? "الفرع" : "Location"}
                        </p>
                        <p className="text-sm font-medium text-slate-700">
                          {isRtl ? (locationArMap[selected.location] || selected.location) : selected.location}
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
                  className="w-full py-4 bg-gradient-to-r from-[#003867] to-[#00677d] text-white rounded-full font-bold shadow-lg shadow-[#00677d]/30 hover:shadow-xl hover:shadow-[#00677d]/40 active:scale-95 transition-all cursor-pointer"
                >
                  {isRtl
                    ? `احجز مع ${selected.nameAr ? selected.nameAr.split(" ").slice(1).join(" ") : selected.name}`
                    : `Book with ${selected.name.split(" ")[1] || selected.name}`}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

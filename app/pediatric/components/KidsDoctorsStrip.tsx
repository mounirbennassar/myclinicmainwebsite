"use client";
import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { doctorsData, type Doctor } from "@/app/doctors-data";
import { useLang } from "@/app/i18n/context";

const locationArMap: Record<string, string> = {
  "Jeddah Al Mohammadiyah": "جدة المحمدية",
  "Jeddah Al Safa": "جدة الصفا",
  "Jeddah Al Khalidiyyah": "جدة الخالدية",
  "Riyadh Al Sahafa": "الرياض الصحافة",
};

// Priority pediatric team — surfaced first on the strip, in this order. Names
// must match `doctorsData` exactly. Entries not yet in the data (awaiting
// photos) are listed here too, so they slot into the right spot automatically
// the moment they're added.
const FEATURED_ORDER = [
  "Prof. Bassam Bin Abbas",
  "Prof. Abdullah Al Shamrani",
  "Dr. Khaled Bin Saad",
  "Dr. Bushra Asiri",
  "Dr. Mohammed Al-Otaibi",
  "Dr. Mariam Dabour",
  "Prof. Fahad Al Bashiri",
];

export default function KidsDoctorsStrip() {
  const { lang } = useLang();
  const isRtl = lang === "ar";
  const carouselRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<Doctor | null>(null);

  const peds = useMemo(() => {
    const rank = (d: Doctor) => {
      const i = FEATURED_ORDER.indexOf(d.name);
      return i === -1 ? FEATURED_ORDER.length : i;
    };
    // Sort is stable (ES2019+), so non-featured doctors keep their original order.
    return doctorsData.filter((d) => d.spec === "Pediatrics").sort((a, b) => rank(a) - rank(b));
  }, []);

  const scroll = (direction: "left" | "right") => {
    const container = carouselRef.current;
    if (!container) return;
    const card = container.querySelector<HTMLElement>(":scope > div");
    const amount = (card?.offsetWidth || 280) + 24;
    container.scrollBy({ left: direction === "right" ? amount : -amount, behavior: "smooth" });
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-sky-50/60 via-white to-white overflow-x-clip">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-10 md:mb-14">
          <p className="font-body italic font-semibold text-[#00677d] text-sm">
            {isRtl ? "فريق الأطفال" : "our kids team"}
          </p>
          <h2 className={`mt-4 font-headline text-4xl md:text-[2.9rem] font-extrabold text-slate-900 ${isRtl ? "leading-[1.3]" : "tracking-tight leading-[1.08]"} [text-wrap:balance]`}>
            {isRtl ? "تعرّف على أطباء واستشاريي طب الأطفال" : "Meet our pediatric team"}
          </h2>
          <p className="mt-5 text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {isRtl
              ? "نخبة من الاستشاريين والأخصائيين في مختلف التخصصات الدقيقة للأطفال لتقديم رعاية صحية متكاملة لطفلك."
              : "A group of consultants and specialists across every pediatric field, working together to give your child complete, connected care."}
          </p>
        </div>

        <div className="relative">
          {peds.length > 1 && (
            <div dir="ltr" className="flex items-center justify-end gap-2 mb-5">
              <button
                onClick={() => scroll("left")}
                className="w-11 h-11 rounded-full bg-white ring-2 ring-slate-200 text-[#004d99] flex items-center justify-center shadow-[0_3px_0_#FFC83D] hover:-translate-y-0.5 hover:ring-[#004d99]/40 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                aria-label="Scroll left"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-11 h-11 rounded-full bg-white ring-2 ring-slate-200 text-[#004d99] flex items-center justify-center shadow-[0_3px_0_#FFC83D] hover:-translate-y-0.5 hover:ring-[#004d99]/40 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
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
            {peds.map((doc, i) => {
              const name = isRtl && doc.nameAr ? doc.nameAr : doc.name;
              const title = isRtl && doc.titleAr ? doc.titleAr : doc.title;
              return (
                <div
                  key={doc.name}
                  className="w-[260px] sm:w-[280px] lg:w-[300px] snap-start shrink-0 group bg-white rounded-[2rem] p-4 pb-5 ring-1 ring-slate-100 shadow-[0_18px_44px_-22px_rgba(0,77,153,0.3)] hover:-translate-y-2 hover:shadow-[0_28px_56px_-24px_rgba(0,77,153,0.4)] transition-all duration-300"
                >
                  {/* Arch portrait */}
                  <div className={`relative w-full aspect-[4/4.7] rounded-t-[8.5rem] rounded-b-2xl overflow-hidden mb-5 ${i % 2 === 0 ? "bg-[#EAF5FE]" : "bg-[#FFF6DF]"}`}>
                    <Image
                      alt={name}
                      src={doc.img}
                      fill
                      className="object-cover transition-all duration-500 group-hover:scale-105"
                      sizes="300px"
                      loading="lazy"
                    />
                    <div className={`absolute bottom-3 left-3 bg-white/95 backdrop-blur text-[#004d99] px-3 py-1 rounded-full font-extrabold shadow-sm ${isRtl ? "text-[11px]" : "text-[10px] uppercase tracking-wider"}`}>
                      {isRtl ? "أطفال" : "Pediatrics"}
                    </div>
                  </div>
                  <div className="px-2" dir={isRtl ? "rtl" : "ltr"}>
                    <h3 className={`text-lg font-extrabold text-slate-900 mb-1 leading-tight ${isRtl ? "text-right" : "text-left"}`}>{name}</h3>
                    <p className={`text-[#00677d] text-sm font-semibold mb-4 leading-tight ${isRtl ? "text-right" : "text-left"}`}>{title}</p>
                    <button
                      onClick={() => setSelected(doc)}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-full text-[13px] font-extrabold text-[#004d99] bg-[#EAF5FE] hover:bg-[#004d99] hover:text-white active:scale-[0.98] transition-all cursor-pointer"
                    >
                      {isRtl ? "تفاصيل الطبيب" : "View profile"}
                      <span className={`material-symbols-outlined text-[17px] ${isRtl ? "rotate-180" : ""}`}>arrow_forward</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Modal ── */}
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
                <Image src={selected.img} alt={selected.name} fill className="object-cover object-top" sizes="(max-width: 640px) 100vw, 512px" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#004d99] via-[#00677d]/40 to-transparent" />
                <button
                  onClick={() => setSelected(null)}
                  className={`absolute top-4 ${isRtl ? "left-4" : "right-4"} w-10 h-10 bg-white/25 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-[#004d99] transition-all cursor-pointer`}
                  aria-label="Close"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
                <div className={`absolute bottom-4 ${isRtl ? "right-6" : "left-6"}`}>
                  <span className={`bg-white/90 backdrop-blur text-[#004d99] px-3 py-1 rounded-full font-bold ${isRtl ? "text-[11px]" : "text-[10px] uppercase tracking-wider"}`}>
                    {isRtl ? "أطفال" : "Pediatrics"}
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
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#004d99]/10 to-[#00677d]/15 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-[#00677d] text-lg">school</span>
                      </div>
                      <div>
                        <p className={`text-[11px] text-slate-500 font-bold mb-1 ${isRtl ? "" : "uppercase tracking-wider"}`}>
                          {isRtl ? "المؤهلات العلمية" : "Education & Qualifications"}
                        </p>
                        {(isRtl && selected.educationAr ? selected.educationAr : selected.education).map((edu, i) => (
                          <p key={i} className="text-sm font-medium text-slate-700 leading-relaxed">{edu}</p>
                        ))}
                      </div>
                    </div>
                  )}
                  {selected.location && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-amber-500 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                      </div>
                      <div>
                        <p className={`text-[11px] text-slate-500 font-bold mb-1 ${isRtl ? "" : "uppercase tracking-wider"}`}>{isRtl ? "الفرع" : "Location"}</p>
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
                    document.getElementById("kids-booking")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full bg-[#004d99] text-white font-extrabold py-3.5 rounded-full shadow-[0_5px_0_#FFC83D] hover:-translate-y-0.5 hover:shadow-[0_7px_0_#FFC83D] active:translate-y-0.5 active:shadow-[0_2px_0_#FFC83D] transition-all cursor-pointer"
                >
                  {isRtl ? "احجز موعد طفلك" : "Book your child's visit"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

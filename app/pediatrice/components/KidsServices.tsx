"use client";

import { motion } from "framer-motion";

type Service = { icon: string; en: string; ar: string; descEn: string; descAr: string };

const SERVICES: Service[] = [
  { icon: "vaccines", en: "Vaccinations", ar: "التطعيمات", descEn: "On-schedule immunizations, calm and quick.", descAr: "تطعيمات في موعدها، بهدوء وسرعة." },
  { icon: "monitor_weight", en: "Growth & Development", ar: "النمو والتطور", descEn: "Tracking healthy milestones and growth.", descAr: "متابعة النمو والمراحل الصحية." },
  { icon: "child_care", en: "Newborn Care", ar: "رعاية حديثي الولادة", descEn: "Expert care from the very first days.", descAr: "رعاية متخصصة من الأيام الأولى." },
  { icon: "allergy", en: "Allergy & Immunology", ar: "الحساسية والمناعة", descEn: "Diagnosis and care for sensitive kids.", descAr: "تشخيص وعلاج حساسية الأطفال." },
  { icon: "cardiology", en: "Pediatric Cardiology", ar: "قلب الأطفال", descEn: "Specialist heart care for children.", descAr: "رعاية متخصصة لقلب طفلك." },
  { icon: "neurology", en: "Pediatric Neurology", ar: "أعصاب الأطفال", descEn: "Care for the developing nervous system.", descAr: "رعاية للجهاز العصبي النامي." },
  { icon: "pulmonology", en: "Pulmonology & Sleep", ar: "صدر ونوم الأطفال", descEn: "Breathing, asthma and sleep support.", descAr: "التنفس والربو ودعم النوم." },
  { icon: "endocrinology", en: "Endocrinology", ar: "غدد الأطفال", descEn: "Hormones, diabetes and growth care.", descAr: "الهرمونات والسكري ومتابعة النمو." },
];

// A restrained sticker palette cycled across the sheet.
const TINTS = [
  { card: "bg-[#EAF5FE]", icon: "bg-white text-[#0067B2]", shadow: "shadow-[0_5px_0_#7DC8F7]" },
  { card: "bg-[#FFF6DF]", icon: "bg-white text-[#B27900]", shadow: "shadow-[0_5px_0_#FFC83D]" },
  { card: "bg-[#FDEFF3]", icon: "bg-white text-[#C2497A]", shadow: "shadow-[0_5px_0_#F9A8C0]" },
  { card: "bg-[#E9F4F4]", icon: "bg-white text-[#00677d]", shadow: "shadow-[0_5px_0_#9BC9CF]" },
];

const ROTATIONS = ["-rotate-1", "rotate-1", "rotate-0", "-rotate-1", "rotate-1", "-rotate-1", "rotate-0", "rotate-1"];

const COPY = {
  en: {
    eyebrow: "our pediatric care",
    title: "One clinic for every",
    titleHighlight: "little need.",
    subtitle: "From routine check-ups to specialist care, our children's department covers it all under one friendly roof.",
    book: "Book now",
  },
  ar: {
    eyebrow: "رعاية الأطفال لدينا",
    title: "عيادة واحدة لكل",
    titleHighlight: "احتياجات صغيرك.",
    subtitle: "من الفحوصات الدورية إلى الرعاية التخصصية، قسم الأطفال لدينا يغطّي كل شيء تحت سقف واحد ودود.",
    book: "احجز الآن",
  },
};

export default function KidsServices({ lang, onBookClick }: { lang: "en" | "ar"; onBookClick: () => void }) {
  const isRtl = lang === "ar";
  const c = COPY[lang];

  return (
    <section dir={isRtl ? "rtl" : "ltr"} className="py-20 md:py-28 bg-gradient-to-b from-white via-[#F4FAFE] to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Off-center editorial header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: [0.21, 0.47, 0.32, 0.98] }}
          className={`max-w-2xl ${isRtl ? "text-right" : "text-left"} mb-12 md:mb-16`}
        >
          <p className="font-body italic font-semibold text-[#00677d] text-sm">{c.eyebrow}</p>
          <h2 className={`mt-4 font-headline text-4xl md:text-[2.9rem] font-extrabold text-slate-900 ${isRtl ? "leading-[1.3]" : "tracking-tight leading-[1.08]"} [text-wrap:balance]`}>
            {c.title}{" "}
            <span className="relative inline-block">
              <span className="relative z-10">{c.titleHighlight}</span>
              <span className="absolute inset-x-0 bottom-1 h-[0.55em] bg-[#7DC8F7]/40 rotate-1 rounded-sm" aria-hidden />
            </span>
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed [text-wrap:pretty]">{c.subtitle}</p>
        </motion.div>

        {/* Sticker sheet */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {SERVICES.map((s, i) => {
            const tint = TINTS[i % TINTS.length];
            return (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 32, rotate: i % 2 === 0 ? -3 : 3 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: (i % 4) * 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
                onClick={onBookClick}
                className={`group ${isRtl ? "text-right" : "text-left"} ${tint.card} ${ROTATIONS[i]} ${
                  // Stagger alternate columns for a pinned-to-corkboard feel.
                  i % 2 === 1 ? "lg:translate-y-7" : ""
                } rounded-[1.75rem] p-5 md:p-7 ${tint.shadow} hover:-translate-y-1.5 hover:rotate-0 focus-visible:outline-2 focus-visible:outline-[#004d99] transition-all duration-300 cursor-pointer`}
              >
                <div className={`w-13 h-13 md:w-14 md:h-14 rounded-2xl ${tint.icon} flex items-center justify-center mb-4 md:mb-5 shadow-sm group-hover:-rotate-6 group-hover:scale-105 transition-transform duration-300`}>
                  <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                </div>
                <h3 className="font-headline font-bold text-slate-900 text-[15px] md:text-base leading-snug">{isRtl ? s.ar : s.en}</h3>
                <p className="mt-1.5 text-[13px] md:text-sm text-slate-600 leading-relaxed">{isRtl ? s.descAr : s.descEn}</p>
                <span className={`mt-4 inline-flex items-center gap-1.5 text-[12px] font-extrabold text-[#004d99] opacity-0 ${isRtl ? "translate-x-2" : "-translate-x-2"} group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300`}>
                  {c.book}
                  <span className={`material-symbols-outlined text-sm ${isRtl ? "rotate-180" : ""}`}>arrow_forward</span>
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

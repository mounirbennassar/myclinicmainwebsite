"use client";
import { useLang } from "@/app/i18n/context";

const REVIEWS = [
  {
    initials: "MA",
    name: "Modi Abdullah",
    en: "“The center is a spacious, well-designed building with numerous services. The signage and layout of the various departments are very attractive and modern.”",
    ar: "«المجمع مبنى واسع ومصمم بشكل جميل مع خدمات متعددة. اللوحات الإرشادية وتوزيع الأقسام جذاب وعصري جداً.»",
  },
  {
    initials: "LJ",
    name: "Lina JI",
    en: "“Honestly, ‘My Clinic’ is outstanding in its service and responsiveness. The staff is professional, and the facility is spotless.”",
    ar: "«بصراحة، عيادتي متميز في خدمته واستجابته. الكادر محترف والمنشأة نظيفة جداً.»",
  },
  {
    initials: "RA",
    name: "Raghad Al-Ghamdi",
    en: "“We can all agree that a clinic that is clean, quiet, and comfortable for the patient is very important — and I experienced exactly that at My Clinic.”",
    ar: "«كلنا متفقين أن العيادة النظيفة والهادئة والمريحة للمريض أمر مهم جداً، وهذا بالضبط ما عشته في عيادتي.»",
  },
];

export default function DentalTestimonials() {
  const { lang } = useLang();
  const isRtl = lang === "ar";

  return (
    <section className="py-16 md:py-24 bg-white px-4 md:px-0">
      <div className="max-w-7xl mx-auto md:px-8">
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#003867]/10 text-[#003867] text-[11px] font-bold uppercase tracking-widest">
            {isRtl ? "آراء مرضانا" : "Testimonials"}
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            {isRtl ? "ماذا يقول مرضانا عنّا" : "What our patients say"}
          </h2>
          <p className="mt-3 text-slate-500 max-w-xl mx-auto font-medium">
            {isRtl
              ? "تجارب حقيقية تعكس جودة الرعاية والاهتمام الذي نقدمه لمرضانا."
              : "Real experiences that reflect the quality of care and attention we provide to our patients."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
          {REVIEWS.map((r, i) => (
            <div key={i} className="bg-white rounded-2xl p-7 md:p-8 border border-[#003867]/10 shadow-lg shadow-[#003867]/5 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#003867]/10 transition-all duration-300">
              <div className="flex gap-1 text-amber-400 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                ))}
              </div>
              <p className="text-slate-600 italic mb-6 font-medium leading-relaxed">
                {isRtl ? r.ar : r.en}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#003867] flex items-center justify-center text-white font-bold text-sm">
                  {r.initials}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{r.name}</p>
                  <p className="text-xs text-slate-400">{isRtl ? "مراجعة Google" : "Google Review"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={() => document.getElementById("dental-booking")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#003867] border-2 border-[#003867] rounded-full font-bold text-white hover:bg-[#002a4d] hover:border-[#002a4d] transition-all shadow-lg shadow-[#003867]/20"
          >
            <span className="material-symbols-outlined text-xl">calendar_month</span>
            {isRtl ? "احجز موعدك الآن" : "Book your appointment"}
          </button>
        </div>
      </div>
    </section>
  );
}

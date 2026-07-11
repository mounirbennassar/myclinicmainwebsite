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

function GoogleG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.86c2.26-2.09 3.58-5.16 3.58-8.81z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.86-3a7.24 7.24 0 0 1-10.8-3.81H1.29v3.09A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.28 14.28a7.2 7.2 0 0 1 0-4.56V6.63H1.29a12 12 0 0 0 0 10.74l3.99-3.09z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42A11.97 11.97 0 0 0 1.29 6.63l3.99 3.09A7.24 7.24 0 0 1 12 4.75z" />
    </svg>
  );
}

export default function DentalTestimonials() {
  const { lang } = useLang();
  const isRtl = lang === "ar";

  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-b from-white via-[#bfe7ee]/[0.12] to-white px-4 md:px-0 overflow-hidden">
      {/* Faint dot texture */}
      <div
        className="absolute inset-0 opacity-50 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(0,103,125,0.12) 1px, transparent 1.4px)",
          backgroundSize: "26px 26px",
          maskImage: "radial-gradient(ellipse 60% 55% at 50% 45%, black 20%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 60% 55% at 50% 45%, black 20%, transparent 75%)",
        }}
        aria-hidden
      />
      <div className="relative max-w-7xl mx-auto md:px-8">
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#003867]/[0.06] text-[#00677d] text-[11px] font-bold uppercase tracking-[0.18em] ring-1 ring-[#00677d]/15">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
            {isRtl ? "آراء مرضانا" : "Testimonials"}
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            {isRtl ? "ماذا يقول مرضانا عنّا" : "What our patients say"}
          </h2>
          <div className="mt-4 mx-auto h-1 w-20 rounded-full bg-gradient-to-r from-[#003867] to-[#00677d]" />
          <p className="mt-4 text-slate-500 max-w-xl mx-auto font-medium">
            {isRtl
              ? "تجارب حقيقية تعكس جودة الرعاية والاهتمام الذي نقدمه لمرضانا."
              : "Real experiences that reflect the quality of care and attention we provide to our patients."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
          {REVIEWS.map((r, i) => (
            <div
              key={i}
              className={`group relative bg-white rounded-2xl p-7 md:p-8 border border-[#003867]/10 shadow-lg shadow-[#003867]/5 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#003867]/10 hover:border-[#00677d]/30 transition-all duration-300 overflow-hidden ${
                i === 1 ? "md:-translate-y-3 md:hover:-translate-y-4" : ""
              }`}
            >
              <span className="absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r from-[#003867]/0 via-[#00677d] to-[#003867]/0 opacity-50 group-hover:opacity-100 transition-opacity" aria-hidden />
              {/* Oversized quote watermark */}
              <span
                className={`absolute -top-4 ${isRtl ? "left-4" : "right-4"} text-[110px] leading-none font-serif text-[#003867]/[0.06] select-none pointer-events-none`}
                aria-hidden
              >
                &ldquo;
              </span>
              <div className="relative inline-flex items-center gap-1.5 bg-amber-50 rounded-full px-3 py-1.5 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className="material-symbols-outlined text-amber-400 text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                ))}
              </div>
              <p className="relative text-slate-600 italic mb-6 font-medium leading-relaxed">
                {isRtl ? r.ar : r.en}
              </p>
              <div className="relative flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#003867] to-[#00677d] flex items-center justify-center text-white font-bold text-sm">
                  {r.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900">{r.name}</p>
                  <p className="text-xs text-slate-400">{isRtl ? "مراجعة Google" : "Google Review"}</p>
                </div>
                <GoogleG className="w-5 h-5 shrink-0 opacity-80" />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={() => document.getElementById("dental-booking")?.scrollIntoView({ behavior: "smooth" })}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#003867] to-[#00677d] hover:from-[#002a4d] hover:to-[#005164] rounded-full font-bold text-white transition-all shadow-lg shadow-[#003867]/20 hover:-translate-y-0.5 active:scale-95"
          >
            <span className="material-symbols-outlined text-xl">calendar_month</span>
            {isRtl ? "احجز موعدك الآن" : "Book your appointment"}
          </button>
        </div>
      </div>
    </section>
  );
}

"use client";
import { useLang } from "@/app/i18n/context";

export default function DentalTrustStrip() {
  const { lang } = useLang();
  const isRtl = lang === "ar";
  const stats = [
    { value: "20+", en: "Dental Specialists", ar: "أطباء أسنان متخصصون" },
    { value: "50,000+", en: "Procedures", ar: "إجراء طبي" },
    { value: "4.9/5", en: "Patient Rating", ar: "تقييم المرضى" },
    { value: "24/7", en: "Emergency Support", ar: "دعم طوارئ" },
  ];

  return (
    <section className="py-10 bg-gradient-to-b from-white to-[#003867]/5 border-y border-[#003867]/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
        {stats.map((s) => (
          <div key={s.value} className="text-center">
            <p className="text-3xl md:text-4xl font-extrabold text-[#003867]">{s.value}</p>
            <p className="mt-1 text-xs md:text-sm text-slate-500 font-medium">{isRtl ? s.ar : s.en}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

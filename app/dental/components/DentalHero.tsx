"use client";
import { useLang } from "@/app/i18n/context";
import { trackPhoneClick } from "@/app/lib/tracking";

type HeroCopy = { eyebrow: string; title: string; subtitle: string };

export default function DentalHero({ copy }: { copy: { en: HeroCopy; ar: HeroCopy } }) {
  const { lang } = useLang();
  const c = copy[lang];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-[#003867]/5 to-[#003867]/10">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 -right-20 w-96 h-96 rounded-full bg-[#003867]/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-[#003867]/10 blur-3xl" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#003867]/10 text-[#003867] text-[11px] font-bold uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>dentistry</span>
            {c.eyebrow}
          </span>
          <h1 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-slate-900">
            {c.title}
          </h1>
          <p className="mt-5 text-lg text-slate-600 leading-relaxed max-w-xl">
            {c.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => document.getElementById("dental-booking")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-[#003867] hover:bg-[#002a4d] text-white px-7 py-3.5 rounded-full font-bold shadow-lg shadow-[#003867]/30 active:scale-95 transition-colors"
            >
              {lang === "ar" ? "استشارة مجانية" : "Free Consultation"}
            </button>
            <a href="tel:920022811" onClick={trackPhoneClick} className="px-7 py-3.5 rounded-full font-bold bg-white text-[#003867] border border-[#003867]/20 hover:border-[#003867]/50 transition-colors" dir="ltr">
              <span className="material-symbols-outlined text-base align-middle me-2">call</span>
              920 022 811
            </a>
          </div>
        </div>
        <div className="relative aspect-[5/4] rounded-3xl overflow-hidden bg-gradient-to-br from-[#003867]/15 to-[#003867]/5 shadow-2xl shadow-[#003867]/10 border border-white">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-[#003867]/40" style={{ fontSize: 240, fontVariationSettings: "'FILL' 1" }}>
              dentistry
            </span>
          </div>
          <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur rounded-2xl p-4 flex items-center gap-4 shadow-lg">
            <div className="w-12 h-12 rounded-full bg-[#003867]/10 flex items-center justify-center text-[#003867]">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">{lang === "ar" ? "أطباء استشاريون" : "Board-certified specialists"}</p>
              <p className="text-sm font-bold text-slate-900">{lang === "ar" ? "+٧٠ طبيب أسنان" : "70+ dental specialists"}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

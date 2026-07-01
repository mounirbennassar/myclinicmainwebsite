"use client";
import { useLang } from "@/app/i18n/context";
import DentalNav from "./DentalNav";
import DentalHero from "./DentalHero";
import DentalTrustStrip from "./DentalTrustStrip";
import dynamic from "next/dynamic";

// Carries the full doctors dataset; client-only keeps it out of the service
// pages' critical JS (below the fold — placeholder avoids layout shift).
const DentalDoctorsStrip = dynamic(() => import("./DentalDoctorsStrip"), {
  ssr: false,
  loading: () => <div className="min-h-[520px]" />,
});
import DentalServicesGrid from "./DentalServicesGrid";
import DentalBookingForm from "./DentalBookingForm";
import DentalFooter from "./DentalFooter";
import type { DentalService } from "../content/services";

// Single template every service route renders through. The route file
// just hands over the service slug — content comes from services.ts.
export default function DentalServicePage({ service }: { service: DentalService }) {
  const { lang } = useLang();
  const isRtl = lang === "ar";
  const benefits = service.benefits[lang];
  const procedure = service.procedure[lang];
  const faq = service.faq[lang];

  return (
    <div className="min-h-screen bg-white" dir={isRtl ? "rtl" : "ltr"}>
      <DentalNav />
      <DentalHero copy={service.hero} />
      <DentalTrustStrip />

      {/* Benefits */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">{benefits.title}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {benefits.items.map((b, i) => (
              <div key={i} className="bg-gradient-to-br from-white to-[#003867]/5 rounded-2xl p-6 border border-[#003867]/10">
                <div className="w-12 h-12 rounded-xl bg-[#003867]/10 text-[#003867] flex items-center justify-center">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{b.icon}</span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{b.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Procedure */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-[#003867]/5 to-white">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">{procedure.title}</h2>
          </div>
          <div className="space-y-4">
            {procedure.steps.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 md:p-8 border border-[#003867]/10 shadow-sm shadow-[#003867]/5 flex gap-5">
                <div className="shrink-0 w-12 h-12 rounded-full bg-[#003867] text-white font-extrabold flex items-center justify-center">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DentalDoctorsStrip match={service.doctorMatch} />

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <div className="text-center mb-10">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#003867]">FAQ</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-slate-900">
              {isRtl ? "أسئلة يطرحها المرضى" : "Questions patients ask"}
            </h2>
          </div>
          <div className="space-y-3">
            {faq.map((q, i) => (
              <details key={i} className="group bg-gradient-to-br from-white to-[#003867]/5 rounded-2xl border border-[#003867]/10 p-5 open:shadow-md transition-all">
                <summary className="cursor-pointer list-none flex items-start justify-between gap-4">
                  <h3 className="font-bold text-slate-900">{q.q}</h3>
                  <span className="material-symbols-outlined text-[#003867] transition-transform group-open:rotate-45">add</span>
                </summary>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{q.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <DentalBookingForm service={service.slug} />
      <DentalServicesGrid excludeSlug={service.slug} />
      <DentalFooter />
    </div>
  );
}

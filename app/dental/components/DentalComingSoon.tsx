"use client";
import Link from "next/link";
import { useLang } from "@/app/i18n/context";
import DentalNav from "./DentalNav";
import DentalFooter from "./DentalFooter";
import DentalBookingForm from "./DentalBookingForm";
import { dentalServiceCatalog } from "../content/services";

export default function DentalComingSoon({ slug }: { slug: string }) {
  const { lang, ready } = useLang();
  const isRtl = lang === "ar";
  const item = dentalServiceCatalog.find((s) => s.slug === slug);
  const title = item ? (isRtl ? item.ar : item.en) : (isRtl ? "خدمة الأسنان" : "Dental Service");

  if (!ready) return <div className="min-h-screen bg-white" />;

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="min-h-screen bg-white flex flex-col">
      <DentalNav />

      <section className="relative overflow-hidden bg-gradient-to-br from-white via-[#003867]/5 to-[#003867]/10 flex-1 flex items-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 -right-20 w-96 h-96 rounded-full bg-[#003867]/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-[#003867]/10 blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 md:px-8 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#003867]/10 text-[#003867] text-[11px] font-bold uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
            {isRtl ? "قريباً" : "Coming Soon"}
          </div>

          <h1 className="mt-6 text-4xl md:text-6xl font-extrabold leading-tight text-slate-900">
            {title}
          </h1>

          <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-xl mx-auto">
            {isRtl
              ? "نعمل حالياً على إطلاق هذه الصفحة. في هذه الأثناء، يمكنك حجز موعدك مباشرة وسيتواصل معك فريقنا."
              : "We're putting the finishing touches on this page. In the meantime, request a consultation and our team will reach out directly."}
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => document.getElementById("dental-booking")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-[#003867] hover:bg-[#002a4d] text-white px-7 py-3.5 rounded-full font-bold shadow-lg shadow-[#003867]/30 active:scale-95 transition-colors"
            >
              {isRtl ? "احجز استشارة" : "Request Consultation"}
            </button>
            <Link
              href="/dental"
              className="px-7 py-3.5 rounded-full font-bold bg-white text-[#003867] border border-[#003867]/20 hover:border-[#003867]/50 transition-colors"
            >
              {isRtl ? "عودة لخدمات الأسنان" : "Back to dental services"}
            </Link>
          </div>
        </div>
      </section>

      <DentalBookingForm service={slug} />
      <DentalFooter />
    </div>
  );
}

"use client";
import { useLang } from "@/app/i18n/context";

export default function DentalHours() {
  const { lang } = useLang();
  const isRtl = lang === "ar";

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <div className="text-center mb-10 md:mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#003867]/10 text-[#003867] text-[11px] font-bold uppercase tracking-widest">
            {isRtl ? "ساعات العمل" : "Opening Hours"}
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            {isRtl ? "متى يمكنك زيارتنا" : "When you can visit us"}
          </h2>
        </div>

        <div className="bg-[#003867] text-white p-8 md:p-12 rounded-3xl shadow-2xl shadow-[#003867]/20 relative overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />

          <div className="relative grid md:grid-cols-2 gap-10 md:gap-14">
            {/* Standard hours */}
            <div>
              <h3 className="text-xl md:text-2xl font-extrabold mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
                {isRtl ? "العيادات الطبية" : "Medical Clinics"}
              </h3>
              <div className="space-y-4">
                <div className="border-b border-white/15 pb-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{isRtl ? "الأحد – الخميس" : "Sunday – Thursday"}</span>
                    <span className="font-bold">{isRtl ? "9:00 ص – 9:00 م" : "9:00 AM – 9:00 PM"}</span>
                  </div>
                  <p className="text-amber-300 font-bold text-xs mt-2">
                    {isRtl ? "الرياض: مغلق يوم الجمعة" : "Riyadh: Closed on Friday"}
                  </p>
                  <p className="text-amber-300 font-bold text-xs mt-1">
                    {isRtl ? "التحلية: 1:00 م – 9:00 م، مغلق يوم الجمعة" : "Al Tahlia: 1:00 PM – 9:00 PM, Closed on Friday"}
                  </p>
                </div>
                <div className="flex justify-between items-center border-b border-white/15 pb-4">
                  <span className="font-medium">{isRtl ? "الجمعة" : "Friday"}</span>
                  <span className="font-bold">{isRtl ? "5:00 م – 9:00 م" : "5:00 PM – 9:00 PM"}</span>
                </div>
                <div className="flex justify-between items-center pb-1">
                  <span className="font-medium">{isRtl ? "السبت" : "Saturday"}</span>
                  <span className="font-bold">{isRtl ? "1:00 م – 9:00 م" : "1:00 PM – 9:00 PM"}</span>
                </div>
              </div>
            </div>

            {/* Dental hours — highlighted */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/15">
              <h3 className="text-xl md:text-2xl font-extrabold mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dentistry</span>
                {isRtl ? "عيادة الأسنان" : "Dental Clinic"}
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/15 pb-4">
                  <span className="font-medium">{isRtl ? "السبت – الخميس" : "Saturday – Thursday"}</span>
                  <span className="font-bold">{isRtl ? "10:00 ص – 10:00 م" : "10:00 AM – 10:00 PM"}</span>
                </div>
                <div className="flex justify-between items-center pb-1">
                  <span className="font-medium">{isRtl ? "الجمعة" : "Friday"}</span>
                  <span className="font-bold">{isRtl ? "4:00 م – 8:00 م" : "4:00 PM – 8:00 PM"}</span>
                </div>
              </div>
              <button
                onClick={() => document.getElementById("dental-booking")?.scrollIntoView({ behavior: "smooth" })}
                className="mt-7 w-full bg-white text-[#003867] hover:bg-amber-50 font-extrabold py-3.5 rounded-full transition-colors shadow-lg active:scale-95"
              >
                {isRtl ? "اطلب موعدك الآن" : "Request your appointment"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

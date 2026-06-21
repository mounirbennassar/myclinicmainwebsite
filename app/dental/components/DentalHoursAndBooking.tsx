"use client";
import { useState, useEffect } from "react";
import { useLang } from "@/app/i18n/context";
import { trackFormSubmit } from "@/app/lib/tracking";

// Combined "Opening Hours" + "Booking" section. Uses the same id as the
// standalone booking form so CTAs scrolling to #dental-booking still land here.
export default function DentalHoursAndBooking({ service = "general" }: { service?: string }) {
  const { lang } = useLang();
  const isRtl = lang === "ar";

  const [city, setCity] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Capture UTMs and log a server-side click — same logic as the standalone form.
  useEffect(() => {
    import("@/app/lib/utm-client").then((m) => m.captureAndTrackUtm()).catch(() => {});
  }, []);

  const submit = async () => {
    if (!city || !name || !phone) {
      setError(isRtl ? "يرجى ملء جميع الحقول" : "Please fill in all fields");
      return;
    }
    if (!/^05\d{8}$/.test(phone)) {
      setError(isRtl ? "رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام" : "Phone must start with 05 and be 10 digits");
      return;
    }
    setSubmitting(true);
    setError("");

    let utm: Record<string, string> | undefined;
    let referrer: string | undefined;
    try {
      const raw = sessionStorage.getItem("mc_utm");
      if (raw) {
        const stored = JSON.parse(raw) as Record<string, string>;
        utm = {
          source: stored.utm_source,
          medium: stored.utm_medium,
          campaign: stored.utm_campaign,
          term: stored.utm_term,
          content: stored.utm_content,
          ref: stored.utm_ref,
        };
      }
      referrer = sessionStorage.getItem("mc_referrer") || undefined;
    } catch { /* ignore */ }

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, name, phone, vertical: "dental", service, utm, referrer }),
      });
      if (res.ok) {
        trackFormSubmit();
        setSuccess(true);
        setCity(""); setName(""); setPhone("");
      } else {
        setError(isRtl ? "حدث خطأ، حاول مرة أخرى" : "Something went wrong, please try again");
      }
    } catch {
      setError(isRtl ? "خطأ في الاتصال" : "Network error, please try again");
    }
    setSubmitting(false);
  };

  return (
    <section id="dental-booking" className="py-16 md:py-24 bg-gradient-to-b from-white to-[#003867]/[0.04] scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-10 md:mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#003867]/10 text-[#003867] text-[11px] font-bold uppercase tracking-widest">
            {isRtl ? "ساعات العمل والحجز" : "Hours & Booking"}
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            {isRtl ? "متى يمكنك زيارتنا" : "When you can visit us"}
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 items-stretch">
          {/* ── Left column: Opening Hours ── */}
          <div className="bg-[#003867] text-white p-8 md:p-10 rounded-3xl shadow-2xl shadow-[#003867]/20 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />

            <div className="relative">
              <h3 className="text-2xl font-extrabold mb-6 flex items-center gap-3">
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

              {/* Dental hours — highlighted */}
              <div className="mt-7 bg-white/10 backdrop-blur rounded-2xl p-5 md:p-6 border border-white/15">
                <h4 className="font-extrabold mb-4 flex items-center gap-2 text-base">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dentistry</span>
                  {isRtl ? "عيادة الأسنان" : "Dental Clinic"}
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-white/15 pb-3 text-sm">
                    <span className="font-medium">{isRtl ? "السبت – الخميس" : "Saturday – Thursday"}</span>
                    <span className="font-bold">{isRtl ? "10:00 ص – 10:00 م" : "10:00 AM – 10:00 PM"}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">{isRtl ? "الجمعة" : "Friday"}</span>
                    <span className="font-bold">{isRtl ? "4:00 م – 8:00 م" : "4:00 PM – 8:00 PM"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right column: Booking form ── */}
          <div className="bg-white rounded-3xl shadow-xl shadow-[#003867]/5 border border-[#003867]/10 overflow-hidden flex flex-col">
            <div className="bg-[#003867] text-white p-8 md:p-10">
              <h3 className="text-2xl md:text-3xl font-extrabold">
                {isRtl ? "احجز استشارتك المجانية" : "Book your free consultation"}
              </h3>
              <p className="mt-2 text-white/80">
                {isRtl ? "سيتواصل معك فريقنا خلال ساعة في أوقات العمل." : "Our team will reach out within an hour during working hours."}
              </p>
            </div>
            <div className="p-8 md:p-10 flex-1">
              {success ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-[#003867]/10 flex items-center justify-center mx-auto mb-5">
                    <svg className="w-8 h-8 text-[#003867]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h4 className="text-2xl font-extrabold text-[#003867]">{isRtl ? "تم استلام طلبك!" : "Request received!"}</h4>
                  <p className="text-slate-600 mt-2">{isRtl ? "سنتواصل معك قريباً." : "We'll contact you shortly."}</p>
                  <button onClick={() => setSuccess(false)} className="mt-5 text-[#003867] font-bold hover:underline">
                    {isRtl ? "إرسال طلب آخر" : "Submit another request"}
                  </button>
                </div>
              ) : (
                <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); submit(); }}>
                  {error && <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl font-medium">{error}</div>}
                  <div>
                    <label className="text-[11px] font-extrabold text-[#003867] uppercase tracking-widest">{isRtl ? "الاسم" : "Your Name"}</label>
                    <input className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 focus:ring-2 focus:ring-[#003867] focus:border-transparent" placeholder={isRtl ? "الاسم الكامل" : "Full name"} value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                  <div>
                    <label className="text-[11px] font-extrabold text-[#003867] uppercase tracking-widest">{isRtl ? "الجوال" : "Phone"}</label>
                    <input dir="ltr" maxLength={10} className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 focus:ring-2 focus:ring-[#003867]" placeholder="05X XXX XXXX" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} required />
                  </div>
                  <div>
                    <label className="text-[11px] font-extrabold text-[#003867] uppercase tracking-widest">{isRtl ? "المدينة" : "City"}</label>
                    <select className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 focus:ring-2 focus:ring-[#003867]" value={city} onChange={(e) => setCity(e.target.value)} required>
                      <option value="" disabled>{isRtl ? "اختر المدينة" : "Select city"}</option>
                      <option value="Riyadh">{isRtl ? "الرياض" : "Riyadh"}</option>
                      <option value="Jeddah">{isRtl ? "جدة" : "Jeddah"}</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#003867] hover:bg-[#002a4d] text-white font-extrabold py-4 rounded-full shadow-lg shadow-[#003867]/30 active:scale-95 disabled:opacity-50 transition-colors"
                  >
                    {submitting ? (isRtl ? "جارٍ الإرسال..." : "Submitting...") : (isRtl ? "اطلب موعدك الآن" : "Request your appointment")}
                  </button>
                  <p className="text-center text-xs text-slate-500">
                    {isRtl ? "بياناتك محمية ولن تُشارك مع أي طرف ثالث." : "Your information is private and never shared."}
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

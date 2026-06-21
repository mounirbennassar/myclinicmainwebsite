"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useLang } from "@/app/i18n/context";
import { trackFormSubmit } from "@/app/lib/tracking";

const AGES = [
  { v: "0-1", en: "0–1 yr", ar: "٠–١ سنة", icon: "child_care" },
  { v: "2-5", en: "2–5 yrs", ar: "٢–٥ سنوات", icon: "child_friendly" },
  { v: "6-9", en: "6–9 yrs", ar: "٦–٩ سنوات", icon: "school" },
  { v: "10-14", en: "10–14 yrs", ar: "١٠–١٤ سنة", icon: "sports_soccer" },
];

/**
 * Pediatric booking form. Kids leads are stored under the existing `medical`
 * vertical (pediatrics is a medical specialty, and the DB constrains vertical to
 * medical/dental). The chosen child age band is appended to the name so the call
 * centre sees it; campaign attribution still flows through UTMs.
 */
export default function KidsBookingForm() {
  const { lang } = useLang();
  const isRtl = lang === "ar";

  const [city, setCity] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

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
          source: stored.utm_source, medium: stored.utm_medium, campaign: stored.utm_campaign,
          term: stored.utm_term, content: stored.utm_content, ref: stored.utm_ref,
        };
      }
      referrer = sessionStorage.getItem("mc_referrer") || undefined;
    } catch { /* ignore */ }

    // Fold the child's age band into the lead name for the call centre.
    const leadName = age ? `${name} (${isRtl ? "عمر الطفل" : "child age"}: ${age})` : name;

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, name: leadName, phone, vertical: "medical", utm, referrer }),
      });
      if (res.ok) {
        trackFormSubmit();
        setSuccess(true);
        setCity(""); setName(""); setPhone(""); setAge("");
      } else {
        setError(isRtl ? "حدث خطأ، حاول مرة أخرى" : "Something went wrong, please try again");
      }
    } catch {
      setError(isRtl ? "خطأ في الاتصال" : "Network error, please try again");
    }
    setSubmitting(false);
  };

  const labelCls = "flex items-center gap-1.5 text-[12px] font-extrabold text-[#004d99]";
  const fieldCls = "mt-1.5 w-full bg-white border-2 border-slate-200 rounded-2xl p-3.5 outline-none transition-all focus:border-[#004d99] focus:ring-4 focus:ring-[#7DC8F7]/25 placeholder:text-slate-400";

  return (
    <section id="kids-booking" className="relative py-16 md:py-24 scroll-mt-24 overflow-hidden">
      {/* Playful backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-50 via-white to-amber-50/40" aria-hidden />
      <div
        className="absolute inset-0 opacity-[0.5] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(0,77,153,0.08) 1.5px, transparent 1.6px)",
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 0%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 0%, transparent 80%)",
        }}
        aria-hidden
      />

      <div className="relative max-w-3xl mx-auto px-4 md:px-8">
        <div className="text-center mb-20 md:mb-24">
          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-[#004d99] font-bold shadow-sm ${isRtl ? "text-[13px]" : "text-[11px] uppercase tracking-widest"}`}>
            {isRtl ? "احجز الآن" : "Book now"}
          </span>
          <h2 className={`mt-4 font-headline text-3xl md:text-4xl font-extrabold text-slate-900 ${isRtl ? "" : "tracking-tight"}`}>
            {isRtl ? "احجز موعد طفلك بكل سهولة" : "Book your child's visit"}
          </h2>
          <p className="mt-3 text-slate-500 font-medium">
            {isRtl ? "سيتواصل معك فريقنا خلال ساعة في أوقات العمل." : "Our team will reach out within an hour during working hours."}
          </p>
        </div>

        <div className="relative bg-white rounded-[2.5rem] shadow-[0_30px_70px_-30px_rgba(0,77,153,0.45)] ring-1 ring-slate-100 overflow-visible">
          {/* Mascot peeking on top */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 z-10">
            <div className="absolute inset-0 rounded-full bg-sky-200/50 blur-lg" />
            <Image src="/kids/mascot.jpg" alt="" width={120} height={120} className="relative rounded-full ring-4 ring-white shadow-xl object-cover" />
          </div>

          <div className="px-6 md:px-10 pt-16 pb-8 md:pb-10">
            {success ? (
              <div className="text-center py-10">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/30">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h4 className="font-headline text-2xl font-extrabold text-[#004d99]">{isRtl ? "تم استلام طلبك! 🎈" : "Request received! 🎈"}</h4>
                <p className="text-slate-600 mt-2">{isRtl ? "سنتواصل معكم قريباً لتأكيد موعد طفلكم." : "We'll contact you shortly to confirm your child's visit."}</p>
                <button onClick={() => setSuccess(false)} className="mt-5 text-[#004d99] font-bold hover:underline">
                  {isRtl ? "إرسال طلب آخر" : "Submit another request"}
                </button>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); submit(); }}>
                {error && <div className="bg-rose-50 text-rose-700 text-sm px-4 py-3 rounded-2xl font-medium border border-rose-100">{error}</div>}

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>
                      <span className="material-symbols-outlined text-[16px] text-sky-500" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                      {isRtl ? "اسم ولي الأمر" : "Parent's name"}
                    </label>
                    <input className={fieldCls} placeholder={isRtl ? "الاسم الكامل" : "Full name"} value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                  <div>
                    <label className={labelCls}>
                      <span className="material-symbols-outlined text-[16px] text-emerald-500" style={{ fontVariationSettings: "'FILL' 1" }}>call</span>
                      {isRtl ? "رقم الجوال" : "Phone"}
                    </label>
                    <input dir="ltr" maxLength={10} inputMode="numeric" className={fieldCls} placeholder="05X XXX XXXX" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} required />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>
                    <span className="material-symbols-outlined text-[16px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                    {isRtl ? "المدينة" : "City"}
                  </label>
                  <select className={fieldCls} value={city} onChange={(e) => setCity(e.target.value)} required>
                    <option value="" disabled>{isRtl ? "اختر المدينة" : "Select city"}</option>
                    <option value="Riyadh">{isRtl ? "الرياض" : "Riyadh"}</option>
                    <option value="Jeddah">{isRtl ? "جدة" : "Jeddah"}</option>
                  </select>
                </div>

                {/* Friendly child age picker */}
                <div>
                  <label className={labelCls}>
                    <span className="material-symbols-outlined text-[16px] text-rose-500" style={{ fontVariationSettings: "'FILL' 1" }}>cake</span>
                    {isRtl ? "عمر الطفل (اختياري)" : "Child's age (optional)"}
                  </label>
                  <div className="mt-2 grid grid-cols-4 gap-2.5">
                    {AGES.map((a) => {
                      const active = age === a.v;
                      return (
                        <button
                          type="button"
                          key={a.v}
                          onClick={() => setAge(active ? "" : a.v)}
                          className={`flex flex-col items-center gap-1.5 rounded-2xl py-3 px-1 border-2 transition-all cursor-pointer ${
                            active
                              ? "border-[#004d99] bg-[#EAF5FE] shadow-[0_3px_0_#7DC8F7] -translate-y-0.5"
                              : "border-slate-200 bg-white hover:border-[#7DC8F7]"
                          }`}
                          aria-pressed={active}
                        >
                          <span className={`material-symbols-outlined ${active ? "text-sky-500" : "text-slate-400"}`} style={{ fontVariationSettings: "'FILL' 1" }}>{a.icon}</span>
                          <span className={`text-[11px] font-bold ${active ? "text-[#004d99]" : "text-slate-500"}`} dir={isRtl ? "rtl" : "ltr"}>{isRtl ? a.ar : a.en}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#004d99] text-white font-extrabold py-4 rounded-full shadow-[0_6px_0_#FFC83D] hover:-translate-y-0.5 hover:shadow-[0_8px_0_#FFC83D] active:translate-y-0.5 active:shadow-[0_2px_0_#FFC83D] disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitting ? (
                    isRtl ? "جارٍ الإرسال..." : "Submitting..."
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                      {isRtl ? "احجز موعد طفلي" : "Book my child's visit"}
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-slate-500">
                  {isRtl ? "بياناتك محمية ولن تُشارك مع أي طرف ثالث." : "Your information is private and never shared."}
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

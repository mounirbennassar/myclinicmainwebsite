"use client";
import { useState, useEffect } from "react";
import { useLang } from "@/app/i18n/context";
import { trackFormSubmit, trackPhoneClick, trackWhatsAppClick } from "@/app/lib/tracking";

/*
 * Design-v2 booking: header + (contact rail | form card) grid, then the five
 * branches and the social row. Same id as before so every "book" CTA on the
 * page still lands here, and the same POST /api/appointments contract so leads
 * keep flowing to the VM Postgres.
 */
const WHATSAPP_LINK = `https://wa.me/966920022811?text=${encodeURIComponent("مرحباً، أود حجز موعد في عيادة الأسنان بعيادتي")}`;

const BRANCHES = [
  { ar: "الرياض — الصحافة، طريق الملك فهد", en: "Riyadh — Al Sahafa, King Fahd Rd", mapUrl: "https://maps.app.goo.gl/5XEWuSVKVzkJNyWt6" },
  { ar: "جدة — المحمدية، شارع الأمير سلطان", en: "Jeddah — Al Muhammadiyah, Prince Sultan St", mapUrl: "https://www.google.com/maps/place/My+Clinic/@21.6589018,39.1224875,17z" },
  { ar: "جدة — الخالدية، شارع الأمير سلطان", en: "Jeddah — Al Khalidiyah, Prince Sultan St", mapUrl: "https://maps.app.goo.gl/exmYNncSGTQAfDzV6" },
  { ar: "جدة — الصفا، شارع الأمير ماجد", en: "Jeddah — Al Safa, Prince Majed St", mapUrl: "https://maps.app.goo.gl/zWd9vWV6m6Sukb956" },
  { ar: "جدة — أبحر الشمالية، شارع الأمير نايف", en: "Jeddah — North Obhur, Prince Nayef St", mapUrl: "https://maps.app.goo.gl/vmem2gxxNnHzv4q17" },
];

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/myclinicksadental/",
    path: "M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 1.8c-3.1 0-3.5 0-4.7.1-1.1.1-1.5.2-1.8.3-.5.2-.8.4-1.1.7-.3.3-.5.6-.7 1.1-.1.3-.3.8-.3 1.8-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.1 1.1.2 1.5.3 1.8.2.5.4.8.7 1.1.3.3.6.5 1.1.7.3.1.8.3 1.8.3 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1.1-.1 1.5-.2 1.8-.3.5-.2.8-.4 1.1-.7.3-.3.5-.6.7-1.1.1-.3.3-.8.3-1.8.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1.1-.2-1.5-.3-1.8-.2-.5-.4-.8-.7-1.1-.3-.3-.6-.5-1.1-.7-.3-.1-.8-.3-1.8-.3-1.2-.1-1.6-.1-4.7-.1Zm0 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Zm5.2-3.1a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@myclinicdentalksa",
    path: "M16.6 3c.4 1.9 1.6 3.3 3.4 3.7l.5.1v3.3l-.7-.1a7 7 0 0 1-3.2-1.2v6.2c0 3.9-2.6 6.5-6.2 6.5A6.2 6.2 0 0 1 4 15.3c0-3.5 2.7-6.1 6.3-6.1h.8v3.4l-.7-.1h-.3a2.9 2.9 0 0 0-3 2.9c0 1.7 1.3 3 3 3s3-1.3 3-3.2V3h3.5Z",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/UC1GF_U6EyvDRUm6VM7MESmQ",
    path: "M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8ZM9.5 15.5v-7l6.5 3.5-6.5 3.5Z",
  },
  {
    label: "Snapchat",
    href: "https://t.snapchat.com/BVlAJHwV",
    path: "M12 2c3 0 5.4 2.3 5.5 5.4l.1 2c0 .2.2.3.4.3.3 0 .7-.2 1-.3.4-.2 1.1 0 1.2.5.1.4-.2.8-.7 1-.6.3-1.5.6-1.7 1.2-.1.4 0 .8.3 1.3.8 1.5 2 2.6 3.5 3.1.3.1.4.4.3.6-.3.6-1.5.9-2.4 1-.1 0-.2.1-.3.3-.1.3-.1.7-.3.8-.2.2-.6.1-1.1.1-.6-.1-1.3-.2-2 0-.6.2-1.1.6-1.7 1-.8.6-1.4.7-2.1.7s-1.3-.1-2.1-.7c-.6-.4-1.1-.8-1.7-1-.7-.2-1.4-.1-2 0-.5.1-.9.1-1.1-.1-.2-.2-.2-.5-.3-.8-.1-.2-.1-.3-.3-.3-.9-.1-2.1-.4-2.4-1-.1-.3.1-.5.3-.6 1.5-.5 2.7-1.6 3.5-3.1.3-.5.4-.9.3-1.3-.2-.6-1.1-1-1.7-1.2-.5-.2-.8-.6-.7-1 .1-.5.8-.7 1.2-.5.3.2.7.3 1 .3.2 0 .4-.1.4-.3l.1-2C6.6 4.3 9 2 12 2Z",
  },
];

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

  const inputCls =
    "mt-1.5 w-full bg-white border-[1.5px] border-[#B9BCC1] rounded-lg px-3.5 py-3 text-[15px] text-[#24272B] placeholder-[#797C82]/70 focus:outline-none focus:border-[#004d99] focus:ring-[3px] focus:ring-[#004d99]/25 transition-colors";
  const labelCls = "block text-[13px] font-bold text-[#003868]";

  return (
    <section id="dental-booking" className="py-20 md:py-28 bg-white scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* ── Header ── */}
        <div className="dv-reveal text-center max-w-[680px] mx-auto mb-12 md:mb-14">
          <span className="inline-flex items-center justify-center gap-3 text-[#004d99] font-bold text-[13px] md:text-sm tracking-[0.05em]">
            <span className="w-[26px] h-[2px] bg-[#004d99]" aria-hidden />
            {isRtl ? "احجز موعدك" : "Book your visit"}
            <span className="w-[26px] h-[2px] bg-[#004d99]" aria-hidden />
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl lg:text-[40px] font-extrabold text-[#003868] tracking-tight leading-[1.4]">
            {isRtl ? (
              <>رحلتكم تبدأ <span className="text-[#004d99]">بخطوة واحدة</span></>
            ) : (
              <>Your journey starts <span className="text-[#004d99]">with one step</span></>
            )}
          </h2>
          <p className="mt-4 text-base md:text-[16.5px] text-[#3D434D] leading-[1.9]">
            {isRtl
              ? "يسرنا استقبالكم في جميع فروعنا خلال ساعات العمل، ويسعد فريقنا بمساعدتكم في اختيار الموعد المناسب والإجابة عن جميع استفساراتكم. دعوا فريقنا يعتني بكافة التفاصيل لتبدأ رحلتكم العلاجية براحة واطمئنان."
              : "We look forward to welcoming you at any of our branches. Our team is happy to help you choose the right appointment and answer every question — let us take care of the details so your treatment journey starts with complete peace of mind."}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-start">
          {/* ── Contact rail ── */}
          <div className="dv-reveal flex flex-col gap-3.5 order-2 lg:order-1">
            <a
              href="tel:920022811"
              onClick={trackPhoneClick}
              className="flex items-center gap-4 bg-[#F2F6FA] rounded-2xl px-5 py-4 hover:bg-[#E4EDF5] transition-colors"
            >
              <span className="w-11 h-11 rounded-full bg-white shadow-[0_6px_18px_-8px_rgba(0,56,104,0.35)] inline-flex items-center justify-center text-[#004d99] shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" /></svg>
              </span>
              <span>
                <span className="block text-[12.5px] text-[#797C82]">{isRtl ? "اتصل بنا" : "Call us"}</span>
                <span className="block text-base font-bold text-[#003868]" dir="ltr">920 022 811</span>
              </span>
            </a>

            <a
              href={WHATSAPP_LINK}
              onClick={trackWhatsAppClick}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-[#F2F6FA] rounded-2xl px-5 py-4 hover:bg-[#E4EDF5] transition-colors"
            >
              <span className="w-11 h-11 rounded-full bg-white shadow-[0_6px_18px_-8px_rgba(0,56,104,0.35)] inline-flex items-center justify-center text-[#25D366] shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.6 0-3.1-.4-4.4-1.2L3 20l1.2-5.1A8.5 8.5 0 1 1 21 11.5ZM8.8 10.5c.6 1.9 2 3.3 3.9 3.9l1.2-1.2 2.1 1" /></svg>
              </span>
              <span>
                <span className="block text-[12.5px] text-[#797C82]">{isRtl ? "واتساب" : "WhatsApp"}</span>
                <span className="block text-base font-bold text-[#003868]" dir="ltr">9200 22 811</span>
              </span>
            </a>

            {/* Dental hours */}
            <div className="bg-[#F2F6FA] rounded-2xl px-5 py-4">
              <div className="flex items-center gap-4">
                <span className="w-11 h-11 rounded-full bg-white shadow-[0_6px_18px_-8px_rgba(0,56,104,0.35)] inline-flex items-center justify-center text-[#004d99] shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3 2" /></svg>
                </span>
                <span>
                  <span className="block text-[12.5px] text-[#797C82]">{isRtl ? "ساعات عمل عيادة الأسنان" : "Dental clinic hours"}</span>
                  <span className="block text-[15px] font-bold text-[#003868]">
                    {isRtl ? "السبت – الخميس · 10 ص – 10 م" : "Sat – Thu · 10 AM – 10 PM"}
                  </span>
                  <span className="block text-[13px] font-medium text-[#3D434D] mt-0.5">
                    {isRtl ? "الجمعة · 4 م – 8 م" : "Fri · 4 PM – 8 PM"}
                  </span>
                </span>
              </div>
            </div>

            {/* Branches */}
            <div className="mt-2">
              <h3 className="text-[15px] font-bold text-[#003868] mb-3 flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#004d99" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0ZM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" /></svg>
                {isRtl ? "فروعنا" : "Our branches"}
              </h3>
              <div className="flex flex-col gap-2">
                {BRANCHES.map((b, i) => (
                  <a
                    key={i}
                    href={b.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-3 bg-white border border-[#E3E6EA] rounded-xl px-4 py-3 hover:border-[#004d99]/40 hover:shadow-[0_10px_26px_-16px_rgba(0,77,153,0.45)] transition-all"
                  >
                    <span className="text-[14px] font-medium text-[#3D434D] group-hover:text-[#003868] transition-colors">
                      {isRtl ? b.ar : b.en}
                    </span>
                    <span className="text-[12px] font-bold text-[#004d99] whitespace-nowrap inline-flex items-center gap-1">
                      {isRtl ? "الخريطة" : "Map"}
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isRtl ? "" : "rotate-180"}><path d="m15 6-6 6 6 6" /></svg>
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Social */}
            <div className="mt-3 flex items-center gap-3">
              <span className="text-[13px] font-bold text-[#797C82]">{isRtl ? "تابعونا" : "Follow us"}</span>
              <div className="flex gap-2.5">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-10 h-10 rounded-full bg-[#F2F6FA] text-[#003868] inline-flex items-center justify-center hover:bg-[#004d99] hover:text-white transition-colors"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d={s.path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── Form card ── */}
          <div className="dv-reveal order-1 lg:order-2 bg-white rounded-[22px] shadow-[0_30px_70px_-30px_rgba(0,31,61,0.35)] ring-1 ring-[#E3E6EA] p-7 md:p-9">
            {success ? (
              <div className="text-center py-10 px-3">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#178038" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM8.5 12l2.5 2.5 4.5-5" /></svg>
                <h3 className="text-[22px] font-bold text-[#003868] mb-2">{isRtl ? "تم استلام طلبك بنجاح" : "Request received!"}</h3>
                <p className="text-[15.5px] leading-[1.9] text-[#3D434D] mb-6">
                  {isRtl ? "شكراً لك، سيتواصل معك فريقنا قريباً لتأكيد موعدك." : "Thank you — our team will contact you shortly to confirm your appointment."}
                </p>
                <button onClick={() => setSuccess(false)} className="text-[#004d99] font-bold hover:underline cursor-pointer">
                  {isRtl ? "إرسال طلب آخر" : "Submit another request"}
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-[21px] font-bold text-[#003868] mb-1.5">{isRtl ? "نموذج حجز موعد" : "Appointment request"}</h3>
                <p className="text-sm text-[#797C82] mb-6">
                  {isRtl ? "سنتواصل معك للتأكيد خلال ساعات العمل — بدون أي التزام." : "We'll reach out to confirm during working hours — no commitment."}
                </p>
                <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); submit(); }}>
                  {error && <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl font-medium">{error}</div>}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <label className={labelCls}>
                      {isRtl ? "الاسم الكامل" : "Full name"}
                      <input className={inputCls} placeholder={isRtl ? "اسمك الكريم" : "Your name"} value={name} onChange={(e) => setName(e.target.value)} required />
                    </label>
                    <label className={labelCls}>
                      {isRtl ? "رقم الجوال" : "Phone"}
                      <input dir="ltr" maxLength={10} inputMode="numeric" className={`${inputCls} text-left`} placeholder="05XXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} required />
                    </label>
                  </div>
                  <label className={labelCls}>
                    {isRtl ? "المدينة" : "City"}
                    <select className={`${inputCls} appearance-none cursor-pointer`} value={city} onChange={(e) => setCity(e.target.value)} required>
                      <option value="" disabled>{isRtl ? "اختر المدينة" : "Select city"}</option>
                      <option value="Riyadh">{isRtl ? "الرياض" : "Riyadh"}</option>
                      <option value="Jeddah">{isRtl ? "جدة" : "Jeddah"}</option>
                    </select>
                  </label>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#004d99] hover:bg-[#003868] text-white font-bold py-4 rounded-full shadow-lg shadow-[#004d99]/30 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {submitting ? (isRtl ? "جارٍ الإرسال..." : "Submitting...") : (isRtl ? "تأكيد طلب الحجز" : "Confirm booking request")}
                  </button>
                  <p className="text-center text-[12.5px] text-[#797C82]">
                    {isRtl ? "بياناتك محمية ولن تُشارك مع أي طرف ثالث." : "Your information is private and never shared."}
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

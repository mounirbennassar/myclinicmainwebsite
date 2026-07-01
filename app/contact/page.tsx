"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "@/app/i18n/context";
import { trackFormSubmit, trackPhoneClick, trackWhatsAppClick } from "@/app/lib/tracking";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";
import { BrandIcon, WhatsAppIcon } from "@/app/components/icons";

const PHONE_TEL = "920022811";
const PHONE_DISPLAY = "920 022 811";
const EMAIL = "info@myclinic.com.sa";
const WHATSAPP = `https://wa.me/966920022811?text=${encodeURIComponent(
  "مرحباً، أود الاستفسار عن خدمات عيادتي"
)}`;

const SUBJECTS = [
  { v: "general", en: "General inquiry", ar: "استفسار عام" },
  { v: "appointment", en: "Book an appointment", ar: "حجز موعد" },
  { v: "billing", en: "Billing & insurance", ar: "الفواتير والتأمين" },
  { v: "feedback", en: "Feedback & suggestions", ar: "ملاحظات واقتراحات" },
  { v: "other", en: "Other", ar: "أخرى" },
];

const SOCIALS = [
  { href: "https://www.instagram.com/myclinicksa/", icon: "fa-instagram", label: "Instagram" },
  { href: "https://www.tiktok.com/@myclinic_ksa", icon: "fa-tiktok", label: "TikTok" },
  { href: "https://www.linkedin.com/company/myclinicksa/", icon: "fa-linkedin-in", label: "LinkedIn" },
  { href: "https://www.facebook.com/MyClinicKSA/", icon: "fa-facebook-f", label: "Facebook" },
  { href: "https://www.youtube.com/channel/UCzD7SKMrFnKCZywENykDPCA", icon: "fa-youtube", label: "YouTube" },
];

export default function ContactPage() {
  const { lang } = useLang();
  const isRtl = lang === "ar";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [subject, setSubject] = useState("general");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    import("@/app/lib/utm-client").then((m) => m.captureAndTrackUtm()).catch(() => {});
  }, []);

  const submit = async () => {
    if (!name || !email || !phone || !city || !message) {
      setError(isRtl ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill in all required fields");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(isRtl ? "يرجى إدخال بريد إلكتروني صحيح" : "Please enter a valid email address");
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
        const s = JSON.parse(raw) as Record<string, string>;
        utm = {
          source: s.utm_source, medium: s.utm_medium, campaign: s.utm_campaign,
          term: s.utm_term, content: s.utm_content, ref: s.utm_ref,
        };
      }
      referrer = sessionStorage.getItem("mc_referrer") || undefined;
    } catch { /* ignore */ }

    const subjectLabel = SUBJECTS.find((s) => s.v === subject)?.en || subject;
    const note = `Contact form — ${subjectLabel}\nEmail: ${email}\n\n${message}`;

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, name, phone, vertical: "medical", note, utm, referrer }),
      });
      if (res.ok) {
        trackFormSubmit();
        setSuccess(true);
        setName(""); setEmail(""); setPhone(""); setCity(""); setSubject("general"); setMessage("");
      } else {
        setError(isRtl ? "حدث خطأ، حاول مرة أخرى" : "Something went wrong, please try again");
      }
    } catch {
      setError(isRtl ? "خطأ في الاتصال، حاول مرة أخرى" : "Network error, please try again");
    }
    setSubmitting(false);
  };

  const labelCls = "block text-[13px] font-bold text-primary mb-0.5";
  const fieldCls =
    "mt-2 w-full bg-white border border-outline-variant/60 rounded-xl px-4 py-3 text-on-surface outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 placeholder:text-on-surface-variant/40";

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="min-h-screen bg-surface flex flex-col">
      {/* ── Header ── */}
      <SiteNav />

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden hero-gradient">
          <div
            className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-50 pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(92,213,248,0.25) 0%, transparent 70%)" }}
            aria-hidden
          />
          <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-14 md:pt-20 pb-10 md:pb-14 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-primary text-xs font-extrabold uppercase tracking-[0.15em] shadow-clinical ring-1 ring-primary/10">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>support_agent</span>
              {isRtl ? "تواصل معنا" : "Contact us"}
            </span>
            <h1 className={`mt-6 font-headline font-extrabold text-primary text-4xl md:text-6xl ${isRtl ? "leading-[1.25]" : "tracking-tight leading-[1.05]"} [text-wrap:balance] text-glow`}>
              {isRtl ? "يسعدنا تواصلك معنا" : "We'd love to hear from you"}
            </h1>
            <p className="mt-5 text-on-surface-variant text-base md:text-lg max-w-2xl mx-auto leading-relaxed [text-wrap:pretty]">
              {isRtl
                ? "هل لديك سؤال أو ترغب بحجز موعد؟ تواصل مع فريق عيادتي عبر الهاتف أو البريد الإلكتروني أو واتساب، أو أرسل لنا رسالة وسنعاود الاتصال بك."
                : "Have a question or want to book a visit? Reach the My Clinic team by phone, email or WhatsApp — or send us a message and we'll get back to you."}
            </p>
          </div>
        </section>

        {/* ── Info + Form ── */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-14 items-start">
            {/* LEFT — contact channels */}
            <div>
              <h2 className="font-headline text-2xl md:text-3xl font-extrabold text-primary tracking-tight">
                {isRtl ? "طرق التواصل" : "Ways to reach us"}
              </h2>
              <p className="mt-3 text-on-surface-variant leading-relaxed">
                {isRtl
                  ? "فريقنا جاهز لخدمتك في جدة والرياض. نرد عادةً خلال ساعة عمل واحدة."
                  : "Our team is here for you across Jeddah & Riyadh. We usually reply within one business hour."}
              </p>

              <div className="mt-7 space-y-3.5">
                {/* Phone */}
                <a
                  href={`tel:${PHONE_TEL}`}
                  onClick={trackPhoneClick}
                  className="group flex items-center gap-4 bg-white rounded-2xl p-4 md:p-5 shadow-clinical ring-1 ring-outline-variant/30 hover:ring-primary/40 hover:-translate-y-0.5 transition-all"
                >
                  <span className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>call</span>
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">{isRtl ? "الهاتف الموحّد" : "Unified line"}</span>
                    <span className="block font-extrabold text-on-surface text-lg" dir="ltr">{PHONE_DISPLAY}</span>
                  </span>
                  <span className={`material-symbols-outlined text-on-surface-variant/40 group-hover:text-primary transition-colors ${isRtl ? "mr-auto rotate-180" : "ml-auto"}`}>arrow_forward</span>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${EMAIL}`}
                  className="group flex items-center gap-4 bg-white rounded-2xl p-4 md:p-5 shadow-clinical ring-1 ring-outline-variant/30 hover:ring-secondary/40 hover:-translate-y-0.5 transition-all"
                >
                  <span className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">{isRtl ? "البريد الإلكتروني" : "Email"}</span>
                    <span className="block font-extrabold text-on-surface text-base md:text-lg break-all" dir="ltr">{EMAIL}</span>
                  </span>
                  <span className={`material-symbols-outlined text-on-surface-variant/40 group-hover:text-secondary transition-colors ${isRtl ? "mr-auto rotate-180" : "ml-auto"}`}>arrow_forward</span>
                </a>

                {/* WhatsApp */}
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={trackWhatsAppClick}
                  className="group flex items-center gap-4 bg-white rounded-2xl p-4 md:p-5 shadow-clinical ring-1 ring-outline-variant/30 hover:ring-[#25D366]/50 hover:-translate-y-0.5 transition-all"
                >
                  <span className="w-12 h-12 rounded-xl bg-[#25D366]/12 text-[#1faa52] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <WhatsAppIcon className="text-2xl" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">{isRtl ? "واتساب" : "WhatsApp"}</span>
                    <span className="block font-extrabold text-on-surface text-base md:text-lg">{isRtl ? "تحدّث معنا الآن" : "Chat with us now"}</span>
                  </span>
                  <span className={`material-symbols-outlined text-on-surface-variant/40 group-hover:text-[#1faa52] transition-colors ${isRtl ? "mr-auto rotate-180" : "ml-auto"}`}>arrow_forward</span>
                </a>
              </div>

              {/* Locations */}
              <div className="mt-6 grid sm:grid-cols-2 gap-3.5">
                {[
                  { en: "Riyadh", ar: "الرياض", q: "My Clinic Riyadh" },
                  { en: "Jeddah", ar: "جدة", q: "My Clinic Jeddah" },
                ].map((loc) => (
                  <a
                    key={loc.en}
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.q)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white rounded-2xl p-4 md:p-5 shadow-clinical ring-1 ring-outline-variant/30 hover:ring-primary/40 hover:-translate-y-0.5 transition-all"
                  >
                    <span className="w-11 h-11 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                    </span>
                    <span className="block font-extrabold text-on-surface">{isRtl ? loc.ar : loc.en}</span>
                    <span className="mt-0.5 inline-flex items-center gap-1 text-[13px] font-bold text-primary">
                      {isRtl ? "عرض على الخريطة" : "View on map"}
                      <span className={`material-symbols-outlined text-[15px] ${isRtl ? "rotate-180" : ""}`}>arrow_forward</span>
                    </span>
                  </a>
                ))}
              </div>

              {/* Social */}
              <div className="mt-7">
                <p className="text-[12px] font-bold text-on-surface-variant uppercase tracking-widest mb-3">{isRtl ? "تابع عيادتي" : "Follow My Clinic"}</p>
                <div className="flex gap-2.5">
                  {SOCIALS.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      title={s.label}
                      className="w-10 h-10 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                    >
                      <BrandIcon name={s.icon} className="text-base" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT — form */}
            <div className="relative bg-white rounded-[2rem] shadow-[0_30px_70px_-30px_rgba(0,77,153,0.35)] ring-1 ring-outline-variant/30 p-6 md:p-9">
              {success ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/30">
                    <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                  </div>
                  <h3 className="font-headline text-2xl font-extrabold text-primary">{isRtl ? "تم استلام رسالتك!" : "Message received!"}</h3>
                  <p className="mt-2 text-on-surface-variant max-w-sm mx-auto">
                    {isRtl ? "شكراً لتواصلك مع عيادتي. سيعاود فريقنا الاتصال بك في أقرب وقت." : "Thanks for reaching out to My Clinic. Our team will get back to you shortly."}
                  </p>
                  <button onClick={() => setSuccess(false)} className="mt-6 text-primary font-bold hover:underline">
                    {isRtl ? "إرسال رسالة أخرى" : "Send another message"}
                  </button>
                </div>
              ) : (
                <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); submit(); }}>
                  <div>
                    <h2 className="font-headline text-2xl font-extrabold text-primary tracking-tight">{isRtl ? "أرسل لنا رسالة" : "Send us a message"}</h2>
                    <p className="mt-1.5 text-sm text-on-surface-variant">{isRtl ? "املأ النموذج وسنرد عليك في أقرب وقت ممكن." : "Fill in the form and we'll reply as soon as we can."}</p>
                  </div>

                  {error && (
                    <div className="bg-error-container text-on-error-container text-sm px-4 py-3 rounded-xl font-medium">{error}</div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>{isRtl ? "الاسم الكامل" : "Full name"} *</label>
                      <input className={fieldCls} placeholder={isRtl ? "اسمك" : "Your name"} value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div>
                      <label className={labelCls}>{isRtl ? "البريد الإلكتروني" : "Email"} *</label>
                      <input type="email" dir="ltr" className={fieldCls} placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>{isRtl ? "رقم الجوال" : "Phone"} *</label>
                      <input dir="ltr" maxLength={10} inputMode="numeric" className={fieldCls} placeholder="05X XXX XXXX" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} required />
                    </div>
                    <div>
                      <label className={labelCls}>{isRtl ? "المدينة" : "City"} *</label>
                      <select className={fieldCls} value={city} onChange={(e) => setCity(e.target.value)} required>
                        <option value="" disabled>{isRtl ? "اختر المدينة" : "Select city"}</option>
                        <option value="Riyadh">{isRtl ? "الرياض" : "Riyadh"}</option>
                        <option value="Jeddah">{isRtl ? "جدة" : "Jeddah"}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>{isRtl ? "الموضوع" : "Subject"}</label>
                    <select className={fieldCls} value={subject} onChange={(e) => setSubject(e.target.value)}>
                      {SUBJECTS.map((s) => (
                        <option key={s.v} value={s.v}>{isRtl ? s.ar : s.en}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelCls}>{isRtl ? "رسالتك" : "Message"} *</label>
                    <textarea
                      className={`${fieldCls} resize-y min-h-[120px]`}
                      placeholder={isRtl ? "كيف يمكننا مساعدتك؟" : "How can we help you?"}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      maxLength={1500}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-primary text-white font-extrabold py-4 rounded-full shadow-[0_8px_24px_-8px_rgba(0,77,153,0.6)] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-8px_rgba(0,77,153,0.7)] active:translate-y-0 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {submitting ? (
                      isRtl ? "جارٍ الإرسال..." : "Sending..."
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                        {isRtl ? "إرسال الرسالة" : "Send message"}
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs text-on-surface-variant">
                    {isRtl ? "بياناتك محمية ولن تُشارك مع أي طرف ثالث." : "Your information is private and never shared."}
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

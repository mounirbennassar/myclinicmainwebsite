"use client";

import { useState, type CSSProperties, type FormEvent } from "react";
import translations from "@/app/i18n/translations";
import { trackFormSubmit, trackPhoneClick, trackWhatsAppClick } from "@/app/lib/tracking";
import { WhatsAppIcon } from "@/app/components/icons";
import { COPY, PHONE_DISPLAY, PHONE_TEL, pick, whatsappLink } from "../_lib/content";
import { Arrow, Lines, PhoneIcon } from "./ui";

/**
 * The lead form. Payload, validation and tracking are identical to the live
 * home page's form (app/HomeClient.tsx) — it writes real leads to the portal.
 */
export default function Booking({ isRtl, city, setCity }: { isRtl: boolean; city: string; setCity: (c: string) => void }) {
  const t = translations[isRtl ? "ar" : "en"];
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!city || !name || !phone) {
      setError(isRtl ? "يرجى ملء جميع الحقول" : "Please fill in all fields");
      return;
    }
    if (!/^05\d{8}$/.test(phone)) {
      setError(isRtl ? "رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام" : "Phone number must start with 05 and be 10 digits");
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
        utm = { source: s.utm_source, medium: s.utm_medium, campaign: s.utm_campaign, term: s.utm_term, content: s.utm_content, ref: s.utm_ref };
      }
      referrer = sessionStorage.getItem("mc_referrer") || undefined;
    } catch {
      /* storage blocked — submit without attribution */
    }
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, name, phone, utm, referrer }),
      });
      if (res.ok) {
        trackFormSubmit();
        setSuccess(true);
        setCity("");
        setName("");
        setPhone("");
      } else {
        setError(isRtl ? "حدث خطأ، حاول مرة أخرى" : "Something went wrong, please try again");
      }
    } catch {
      setError(isRtl ? "خطأ في الاتصال" : "Network error, please try again");
    }
    setSubmitting(false);
  };

  const field = "w-full rounded-2xl bg-white/10 border border-white/15 px-5 py-4 text-white placeholder:text-white/45 outline-none focus:border-white/60 focus:bg-white/15 transition-colors";

  return (
    <section id="booking" className="px-3 sm:px-10 pb-24 sm:pb-32 scroll-mt-24">
      <div data-expand="" className="max-w-[1440px] mx-auto rounded-[32px] bg-primary text-white overflow-hidden grid lg:grid-cols-[1.15fr_1fr] relative">
        {/* Depth without filters: a gradient plus two hairline rings (the
            panel's clip-path is scroll-animated, so no blur/blend layers). */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-[#00376e]" aria-hidden="true" />
        <div className="absolute -top-40 -start-40 w-[520px] h-[520px] rounded-full border border-white/10" aria-hidden="true" />
        <div className="absolute -top-20 -start-20 w-[520px] h-[520px] rounded-full border border-white/10" aria-hidden="true" />

        <div className="relative p-8 sm:p-14 lg:p-20 flex flex-col justify-between gap-12">
          <div>
            <p data-rv="" className="rv eyebrow text-white/70 mb-5">{pick(COPY.bookEyebrow, isRtl)}</p>
            <Lines lines={isRtl ? COPY.bookTitle.ar : COPY.bookTitle.en} className="text-[2.75rem] sm:text-7xl leading-[.92]" />
            <p data-rv="" className="rv mt-7 text-white/75 max-w-[440px] leading-7" style={{ "--d": "150ms" } as CSSProperties}>
              {pick(COPY.bookDesc, isRtl)}
            </p>
          </div>
          <div data-rv="" className="rv flex flex-col sm:flex-row gap-3" style={{ "--d": "250ms" } as CSSProperties}>
            <a href={`tel:${PHONE_TEL}`} onClick={trackPhoneClick} data-magnetic="" className="btn btn-light inline-flex items-center justify-between gap-6 rounded-full ps-7 pe-1.5 py-1.5 text-sm font-semibold w-fit">
              <span>
                {pick(COPY.callUs, isRtl)} <span dir="ltr">{PHONE_DISPLAY}</span>
              </span>
              <span className="arrow w-11 h-11 rounded-full bg-ink text-white grid place-items-center">
                <PhoneIcon />
              </span>
            </a>
            <a
              href={whatsappLink(isRtl)}
              onClick={trackWhatsAppClick}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost on-dark inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-4 text-sm border-white/40 w-fit"
            >
              <WhatsAppIcon className="text-[18px]" />
              {t.whatsappUs}
            </a>
          </div>
        </div>

        <div className="relative p-3 sm:p-6 lg:p-8">
          <div data-rv="" className="rv h-full rounded-[26px] bg-ink/35 border border-white/15 p-7 sm:p-10 flex flex-col" style={{ "--d": "200ms" } as CSSProperties}>
            {success ? (
              <div className="m-auto text-center py-10">
                <div className="w-20 h-20 rounded-full bg-white text-primary grid place-items-center mx-auto mb-6">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="display text-3xl">{isRtl ? "تم إرسال طلبك بنجاح!" : "Request submitted!"}</h3>
                <p className="text-white/75 mt-3">{isRtl ? "سيتواصل معك منسقنا الطبي قريبا." : "Our medical coordinator will contact you soon."}</p>
                <button type="button" onClick={() => setSuccess(false)} className="mt-6 text-sm underline underline-offset-4 cursor-pointer">
                  {isRtl ? "إرسال طلب آخر" : "Submit another request"}
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
                <div>
                  <h3 className="display text-3xl sm:text-4xl">{t.requestYourAppointment}</h3>
                  <p className="text-white/65 text-sm mt-2">{t.formDesc}</p>
                </div>
                {error && (
                  <p role="alert" className="rounded-xl bg-white text-[#b3261e] text-sm px-4 py-3 font-medium">
                    {error}
                  </p>
                )}
                <label className="block">
                  <span className="eyebrow text-[10px] text-white/60">{t.yourName}</span>
                  <input className={`${field} mt-2`} placeholder={t.fullName} type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
                </label>
                <label className="block">
                  <span className="eyebrow text-[10px] text-white/60">{t.phone}</span>
                  <input
                    className={`${field} mt-2 tabular-nums`}
                    placeholder="05X XXX XXXX"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    dir="ltr"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  />
                </label>
                <div>
                  <span className="eyebrow text-[10px] text-white/60">{t.city}</span>
                  <div className="mt-2 grid grid-cols-2 gap-2" role="radiogroup" aria-label={t.city}>
                    {(["Jeddah", "Riyadh"] as const).map((c) => (
                      <button
                        key={c}
                        type="button"
                        role="radio"
                        aria-checked={city === c}
                        onClick={() => setCity(c)}
                        className={`rounded-2xl border px-5 py-4 text-sm transition-colors duration-300 cursor-pointer ${city === c ? "bg-white text-ink border-white" : "border-white/20 text-white/80 hover:border-white/50"}`}
                      >
                        {c === "Jeddah" ? t.jeddah : t.riyadh}
                      </button>
                    ))}
                  </div>
                </div>
                <button type="submit" disabled={submitting} className="btn btn-light mt-2 inline-flex items-center justify-between rounded-full ps-7 pe-1.5 py-1.5 text-sm font-semibold disabled:opacity-60 cursor-pointer">
                  {submitting ? (isRtl ? "جار الإرسال..." : "Submitting...") : t.requestAppointment}
                  <span className="arrow w-11 h-11 rounded-full bg-primary text-white grid place-items-center">
                    <Arrow />
                  </span>
                </button>
                <p className="text-center text-xs text-white/55">{t.privacyNote}</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

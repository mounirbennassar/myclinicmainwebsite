"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/app/i18n/context";
import { trackFormSubmit } from "@/app/lib/tracking";
import { AR, EN, PHONE_DISPLAY, PHONE_TEL, PROGRAMS } from "../content";

/**
 * My360 "request a call back" form.
 *
 * Posts to the same public /api/appointments endpoint every other booking form
 * on the site uses, with `vertical: "my360"` and `service` set to the chosen
 * program slug — that is what makes the lead show up under the My360 tab in the
 * dashboard, with the program in the service column. UTM capture and the
 * mc_ref cookie backstop come along for free, same as the dental form.
 */
export default function My360Form({ program }: { program?: string }) {
  const { lang } = useLang();
  const isRtl = lang === "ar";
  const t = (isRtl ? AR : EN).form;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [service, setService] = useState(program || "");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Capture UTMs and log the click server-side — same as every other LP form.
  useEffect(() => {
    import("@/app/lib/utm-client").then((m) => m.captureAndTrackUtm()).catch(() => {});
  }, []);

  const submit = async () => {
    if (!name || !phone || !city || !service) {
      setError(t.errFields);
      return;
    }
    if (!/^05\d{8}$/.test(phone)) {
      setError(t.errPhone);
      return;
    }
    setSubmitting(true);
    setError("");

    let utm: Record<string, string | undefined> | undefined;
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
    } catch {
      /* sessionStorage unavailable — the mc_ref cookie still attributes the lead */
    }

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, city, vertical: "my360", service, utm, referrer }),
      });
      if (res.ok) {
        trackFormSubmit();
        setSuccess(true);
        setName(""); setPhone(""); setCity(""); setService(program || "");
      } else {
        setError(t.errGeneric);
      }
    } catch {
      setError(t.errNetwork);
    }
    setSubmitting(false);
  };

  const field =
    "w-full rounded-xl border border-[#D6D8DC] bg-white px-4 py-3.5 text-[14.5px] text-[#24272B] outline-none transition-shadow placeholder:text-[#797C82] focus:border-[#004d99] focus:ring-4 focus:ring-[#004d99]/15";

  return (
    <div className="relative rounded-[22px] bg-white p-7 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)] md:p-8">
      {success ? (
        <div className="py-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#004d99]/10">
            <svg className="h-8 w-8 text-[#004d99]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h4 className="mt-5 text-2xl font-extrabold text-[#003868]">{t.successTitle}</h4>
          <p className="mt-2 text-[#797C82]">{t.successBody}</p>
          <button onClick={() => setSuccess(false)} className="mt-5 cursor-pointer font-bold text-[#004d99] hover:underline">
            {t.again}
          </button>
        </div>
      ) : (
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <div>
            <h3 className="text-[19px] font-extrabold text-[#003868]">{t.title}</h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-[#797C82]">{t.sub}</p>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>
          )}

          <input
            className={field}
            placeholder={t.name}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
          />
          <input
            className={field}
            dir="ltr"
            inputMode="numeric"
            maxLength={10}
            placeholder="05X XXX XXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
            autoComplete="tel"
            required
          />
          <select className={field} value={city} onChange={(e) => setCity(e.target.value)} required>
            <option value="" disabled>{t.city}</option>
            <option value="Riyadh">{t.riyadh}</option>
            <option value="Jeddah">{t.jeddah}</option>
          </select>
          <select className={field} value={service} onChange={(e) => setService(e.target.value)} required>
            <option value="" disabled>{t.program}</option>
            {PROGRAMS.map((p) => (
              <option key={p.slug} value={p.slug}>
                {(isRtl ? p.name.ar : p.name.en)} · {isRtl ? p.age.ar : p.age.en}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={submitting}
            className="w-full cursor-pointer rounded-full bg-[#004d99] py-3.5 text-[15px] font-extrabold text-white shadow-lg shadow-[#004d99]/25 transition-colors hover:bg-[#00294d] active:scale-[0.98] disabled:opacity-50"
          >
            {submitting ? t.submitting : t.submit}
          </button>

          <p className="text-center text-[11.5px] text-[#797C82]">
            {t.or}{" "}
            <a href={`tel:${PHONE_TEL}`} className="font-bold text-[#004d99]" dir="ltr">
              {PHONE_DISPLAY}
            </a>{" "}
            {t.directly}
          </p>
          <p className="text-center text-[11px] text-[#B9BCC1]">{t.privacy}</p>
        </form>
      )}
    </div>
  );
}

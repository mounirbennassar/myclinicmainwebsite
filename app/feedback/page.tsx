"use client";

import { useEffect } from "react";
import { useLang } from "@/app/i18n/context";
import { trackPhoneClick, trackWhatsAppClick } from "@/app/lib/tracking";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";
import { WhatsAppIcon } from "@/app/components/icons";

const PHONE_TEL = "920022811";
const PHONE_DISPLAY = "920 022 811";
const EMAIL = "info@myclinic.com.sa";
const WHATSAPP = `https://wa.me/966920022811?text=${encodeURIComponent(
  "مرحبا، لدي ملاحظة حول تجربتي في عيادتي"
)}`;

// ── Zoho Forms embed ────────────────────────────────────────────────────────
// When the Zoho form is ready, paste its public embed URL here (Zoho Forms →
// Share → Embed → copy the iframe src). The styled placeholder below is shown
// while this is empty and disappears automatically once a URL is set.
const ZOHO_FORM_URL: string = "";

// How a case moves through the patient-experience team.
const STEPS = [
  { icon: "inbox", en: "We receive it", ar: "نستلم ملاحظتك", enD: "Your feedback lands directly with the patient experience team — never in a shared inbox.", arD: "تصل ملاحظتك مباشرة إلى فريق تجربة المرضى، وليس إلى بريد عام." },
  { icon: "person_search", en: "We review it", ar: "نراجعها", enD: "A case owner is assigned and reviews the details with the branch or department involved.", arD: "يتولى الحالة مسؤول مختص يراجع التفاصيل مع الفرع أو القسم المعني." },
  { icon: "task_alt", en: "We resolve it", ar: "نعالجها", enD: "We work on a resolution and keep you informed of what changed because of your voice.", arD: "نعمل على الحل ونطلعك على ما تغير بفضل صوتك." },
  { icon: "notifications_active", en: "We follow up", ar: "نتابع معك", enD: "We close the loop with you and make sure the fix actually stuck.", arD: "نغلق الحالة معك ونتأكد أن المعالجة تمت فعلا." },
];

const PROMISES = [
  { icon: "schedule", en: "First response within 48h", ar: "استجابة أولى خلال 48 ساعة" },
  { icon: "lock", en: "Fully confidential", ar: "سرية تامة" },
  { icon: "fact_check", en: "Tracked until closure", ar: "متابعة حتى الإغلاق" },
];

const FAQS = [
  {
    en: "How quickly will I get a response?",
    ar: "متى سأتلقى ردا؟",
    enA: "We acknowledge every submission within one business day and give you a first substantive response within 48 hours. Most cases are fully resolved within five business days, depending on complexity.",
    arA: "نؤكد استلام كل طلب خلال يوم عمل واحد، ونرد عليك ردا أوليا خلال 48 ساعة. تحل معظم الحالات خلال خمسة أيام عمل حسب طبيعتها.",
  },
  {
    en: "Is my complaint confidential?",
    ar: "هل شكواي سرية؟",
    enA: "Yes. Complaints are handled only by the patient experience team and shared strictly on a need-to-know basis, in line with our privacy policy. Filing a complaint never affects the care you receive.",
    arA: "نعم. يتعامل مع الشكاوى فريق تجربة المرضى فقط، وتتم مشاركتها في أضيق نطاق وفق سياسة الخصوصية. تقديم الشكوى لا يؤثر ابدا على الرعاية التي تتلقاها.",
  },
  {
    en: "What information should I include?",
    ar: "ما المعلومات التي يجب ان اذكرها؟",
    enA: "The branch (Jeddah or Riyadh), the date of your visit, the department or doctor's name, the phone number you booked with, and a clear description of what happened. The more detail, the faster we can act.",
    arA: "الفرع (جدة او الرياض)، تاريخ الزيارة، اسم القسم او الطبيب، رقم الجوال المستخدم في الحجز، ووصف واضح لما حدث. كلما زادت التفاصيل كانت المعالجة اسرع.",
  },
  {
    en: "Can I submit on behalf of a family member?",
    ar: "هل يمكنني التقديم نيابة عن احد افراد عائلتي؟",
    enA: "Yes — with their consent. Include their name and visit details along with your own contact information so we can follow up with you directly.",
    arA: "نعم، بعد موافقتهم. اذكر اسم المريض وتفاصيل زيارته مع بيانات التواصل الخاصة بك لنتابع معك مباشرة.",
  },
  {
    en: "What if I'm not satisfied with the resolution?",
    ar: "ماذا لو لم اقتنع بالحل؟",
    enA: "Ask for the case to be escalated to the patient relations manager and we will re-review it. You also always have the right to contact the Saudi Ministry of Health call center on 937.",
    arA: "اطلب تصعيد الحالة إلى مدير علاقات المرضى وسنعيد دراستها. كما يحق لك دائما التواصل مع مركز اتصال وزارة الصحة على الرقم 937.",
  },
  {
    en: "Can I share a compliment too?",
    ar: "هل استطيع مشاركة راي ايجابي ايضا؟",
    enA: "Absolutely — compliments matter as much as complaints. We pass them to the doctor or team by name, and they shape who we recognize every month.",
    arA: "بالتاكيد — الثناء لا يقل اهمية عن الشكوى. نوصل رسالتك إلى الطبيب او الفريق بالاسم، وتدخل في تكريم الموظفين كل شهر.",
  },
];

export default function FeedbackPage() {
  const { lang } = useLang();
  const isRtl = lang === "ar";

  useEffect(() => {
    import("@/app/lib/utm-client").then((m) => m.captureAndTrackUtm()).catch(() => {});
  }, []);

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="min-h-screen bg-surface flex flex-col">
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
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>rate_review</span>
              {isRtl ? "الملاحظات والشكاوى" : "Feedback & Complaints"}
            </span>
            <h1 className={`mt-6 font-headline font-extrabold text-primary text-4xl md:text-6xl ${isRtl ? "leading-[1.25]" : "tracking-tight leading-[1.05]"} [text-wrap:balance] text-glow`}>
              {isRtl ? "رايك يصنع الفرق" : "Your voice makes us better"}
            </h1>
            <p className="mt-5 text-on-surface-variant text-base md:text-lg max-w-2xl mx-auto leading-relaxed [text-wrap:pretty]">
              {isRtl
                ? "نستقبل ملاحظاتك وشكاواك واقتراحاتك باهتمام كامل — فريق تجربة المرضى يتابع كل حالة حتى الحل."
                : "Every comment, complaint and suggestion is taken seriously — our patient experience team follows each case through to resolution."}
            </p>

            {/* Promises */}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {PROMISES.map((p) => (
                <span key={p.icon} className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 text-[13px] font-bold text-on-surface shadow-clinical ring-1 ring-outline-variant/30">
                  <span className="material-symbols-outlined text-lg text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>{p.icon}</span>
                  {isRtl ? p.ar : p.en}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Process + Form ── */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-14 items-start">
            {/* LEFT — how it works + other channels */}
            <div>
              <h2 className="font-headline text-2xl md:text-3xl font-extrabold text-primary tracking-tight">
                {isRtl ? "ماذا يحدث بعد الارسال؟" : "What happens after you submit?"}
              </h2>
              <p className="mt-3 text-on-surface-variant leading-relaxed">
                {isRtl
                  ? "مسار واضح من اربع خطوات — تعرف في كل مرحلة من يتابع حالتك وماذا يحدث."
                  : "A clear four-step path — you always know who owns your case and what happens next."}
              </p>

              <ol className="mt-7 space-y-3.5">
                {STEPS.map((s, i) => (
                  <li key={s.icon} className="flex items-start gap-4 bg-white rounded-2xl p-4 md:p-5 shadow-clinical ring-1 ring-outline-variant/30">
                    <span className="relative w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                      <span className={`absolute -top-1.5 ${isRtl ? "-left-1.5" : "-right-1.5"} w-5 h-5 rounded-full bg-secondary text-white text-[11px] font-extrabold flex items-center justify-center`}>{i + 1}</span>
                    </span>
                    <span className="min-w-0">
                      <span className="block font-extrabold text-on-surface">{isRtl ? s.ar : s.en}</span>
                      <span className="mt-0.5 block text-sm text-on-surface-variant leading-relaxed">{isRtl ? s.arD : s.enD}</span>
                    </span>
                  </li>
                ))}
              </ol>

              {/* Other channels */}
              <p className="mt-8 text-[12px] font-bold text-on-surface-variant uppercase tracking-widest">
                {isRtl ? "او تواصل معنا مباشرة" : "Or reach us directly"}
              </p>
              <div className="mt-3 space-y-3.5">
                <a
                  href={`tel:${PHONE_TEL}`}
                  onClick={trackPhoneClick}
                  className="group flex items-center gap-4 bg-white rounded-2xl p-4 shadow-clinical ring-1 ring-outline-variant/30 hover:ring-primary/40 hover:-translate-y-0.5 transition-all"
                >
                  <span className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>call</span>
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">{isRtl ? "الهاتف الموحد" : "Unified line"}</span>
                    <span className="block font-extrabold text-on-surface" dir="ltr">{PHONE_DISPLAY}</span>
                  </span>
                </a>
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={trackWhatsAppClick}
                  className="group flex items-center gap-4 bg-white rounded-2xl p-4 shadow-clinical ring-1 ring-outline-variant/30 hover:ring-[#25D366]/50 hover:-translate-y-0.5 transition-all"
                >
                  <span className="w-11 h-11 rounded-xl bg-[#25D366]/12 text-[#1faa52] flex items-center justify-center shrink-0">
                    <WhatsAppIcon className="text-xl" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">{isRtl ? "واتساب" : "WhatsApp"}</span>
                    <span className="block font-extrabold text-on-surface">{isRtl ? "تحدث معنا الان" : "Chat with us now"}</span>
                  </span>
                </a>
                <a
                  href={`mailto:${EMAIL}`}
                  className="group flex items-center gap-4 bg-white rounded-2xl p-4 shadow-clinical ring-1 ring-outline-variant/30 hover:ring-secondary/40 hover:-translate-y-0.5 transition-all"
                >
                  <span className="w-11 h-11 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">{isRtl ? "البريد الالكتروني" : "Email"}</span>
                    <span className="block font-extrabold text-on-surface break-all" dir="ltr">{EMAIL}</span>
                  </span>
                </a>
              </div>

              <p className="mt-5 text-xs text-on-surface-variant leading-relaxed">
                {isRtl
                  ? "لحالة طبية عاجلة، اتصل بنا مباشرة على 920022811 بدلا من هذه الصفحة."
                  : "For urgent medical matters please call us directly on 920 022 811 instead of using this page."}
              </p>
            </div>

            {/* RIGHT — Zoho form (placeholder until the embed URL is set) */}
            <div id="form" className="relative bg-white rounded-[2rem] shadow-[0_30px_70px_-30px_rgba(0,77,153,0.35)] ring-1 ring-outline-variant/30 p-6 md:p-9">
              <h2 className="font-headline text-2xl font-extrabold text-primary tracking-tight">
                {isRtl ? "قدم ملاحظتك او شكواك" : "Submit your feedback or complaint"}
              </h2>
              <p className="mt-1.5 text-sm text-on-surface-variant">
                {isRtl ? "يستغرق النموذج اقل من دقيقتين، ويصل مباشرة إلى فريق تجربة المرضى." : "Takes under two minutes and goes straight to the patient experience team."}
              </p>

              {ZOHO_FORM_URL ? (
                <iframe
                  src={ZOHO_FORM_URL}
                  title={isRtl ? "نموذج الملاحظات والشكاوى" : "Feedback & complaints form"}
                  loading="lazy"
                  className="mt-6 w-full min-h-[640px] rounded-xl border-0"
                />
              ) : (
                <div className="mt-6 rounded-2xl border-2 border-dashed border-outline-variant/70 bg-surface-container-low px-6 py-16 text-center">
                  <span className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>assignment</span>
                  </span>
                  <h3 className="mt-5 font-headline text-lg font-extrabold text-on-surface">
                    {isRtl ? "النموذج الالكتروني قادم قريبا" : "The online form is coming soon"}
                  </h3>
                  <p className="mt-2 text-sm text-on-surface-variant max-w-sm mx-auto leading-relaxed">
                    {isRtl
                      ? "نجهز حاليا نموذجا الكترونيا مخصصا للملاحظات والشكاوى. حتى ذلك الحين يسعدنا استقبال ملاحظتك عبر الهاتف او واتساب او البريد الالكتروني."
                      : "We're finalizing a dedicated online form. Until it's live, we'd love to hear from you by phone, WhatsApp or email."}
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <a
                      href={WHATSAPP}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={trackWhatsAppClick}
                      className="inline-flex items-center gap-2 bg-primary text-white font-extrabold text-sm px-5 py-3 rounded-full shadow-[0_8px_24px_-8px_rgba(0,77,153,0.6)] hover:-translate-y-0.5 transition-all"
                    >
                      <WhatsAppIcon className="text-lg" />
                      {isRtl ? "ارسل عبر واتساب" : "Send via WhatsApp"}
                    </a>
                    <a
                      href={`mailto:${EMAIL}?subject=${encodeURIComponent(isRtl ? "ملاحظة او شكوى" : "Feedback / Complaint")}`}
                      className="inline-flex items-center gap-2 bg-white text-primary font-extrabold text-sm px-5 py-3 rounded-full ring-1 ring-primary/20 hover:ring-primary/50 hover:-translate-y-0.5 transition-all"
                    >
                      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
                      {isRtl ? "ارسل بريدا الكترونيا" : "Send an email"}
                    </a>
                  </div>
                </div>
              )}

              <p className="mt-5 text-center text-xs text-on-surface-variant">
                {isRtl ? "بياناتك محمية ولن تشارك مع اي طرف ثالث." : "Your information is private and never shared."}
              </p>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="bg-surface-container-low border-y border-outline-variant/30">
          <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-20">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-primary text-xs font-extrabold uppercase tracking-[0.15em] shadow-clinical ring-1 ring-primary/10">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>help</span>
                {isRtl ? "الاسئلة الشائعة" : "FAQ"}
              </span>
              <h2 className="mt-5 font-headline text-2xl md:text-4xl font-extrabold text-primary tracking-tight">
                {isRtl ? "اسئلة يكثر طرحها" : "Frequently asked questions"}
              </h2>
            </div>

            <div className="mt-9 space-y-3">
              {FAQS.map((f) => (
                <details key={f.en} className="group bg-white rounded-2xl shadow-clinical ring-1 ring-outline-variant/30 open:ring-primary/30">
                  <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-5 md:px-6 py-4 md:py-5 [&::-webkit-details-marker]:hidden">
                    <span className="font-bold text-on-surface">{isRtl ? f.ar : f.en}</span>
                    <span className="material-symbols-outlined text-on-surface-variant/60 transition-transform group-open:rotate-180 shrink-0">expand_more</span>
                  </summary>
                  <p className="px-5 md:px-6 pb-5 text-sm md:text-[15px] text-on-surface-variant leading-relaxed">
                    {isRtl ? f.arA : f.enA}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

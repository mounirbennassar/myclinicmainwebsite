"use client";

import { useEffect } from "react";
import { useLang } from "@/app/i18n/context";
import { trackPhoneClick } from "@/app/lib/tracking";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";

const PHONE_TEL = "920022811";
const PHONE_DISPLAY = "920 022 811";

// Zoho Creator feedback form on the clinic's production account. Opened in a
// new tab on purpose: Zoho's `page-perma` share links answer
// X-Frame-Options: DENY, so they render blank inside an iframe. The Zoho team
// passes `?Channel=Mobile` from the app; the website sends no channel param.
const ZOHO_FEEDBACK_URL =
  "https://creatorapp.zohopublic.sa/myclinic/my-clinic/page-perma/Final_Webform/9wPfk9vemN3EAjYgV3Udeezq1FfQQzsZ0HnZk2CFnEnbAZxY6fC7sGOug71Jmjb5twpj2EtYHsjWgyHnx0mwCdSu6m3dj5gvpS9k";

// No icon font on this page: app/layout.tsx loads a subset of Material
// Symbols (only the glyphs the rest of the site uses), so any new icon name
// renders as stray fallback letters. Numbers + inline SVG only.
const STEPS = [
  { en: "We receive it", ar: "نستلم ملاحظتك", enD: "Your message lands directly with the patient experience team.", arD: "تصل رسالتك مباشرة إلى فريق تجربة المرضى." },
  { en: "We review it", ar: "نراجعها", enD: "A case owner reviews the details with the branch or department involved.", arD: "يتولى الحالة مسؤول مختص يراجعها مع الفرع او القسم المعني." },
  { en: "We resolve it", ar: "نعالجها", enD: "We work on a resolution and tell you what changed because of it.", arD: "نعمل على الحل ونطلعك على ما تغير بفضل ملاحظتك." },
  { en: "We follow up", ar: "نتابع معك", enD: "We close the loop with you and make sure the fix stuck.", arD: "نغلق الحالة معك ونتاكد ان المعالجة تمت فعلا." },
];

const FAQS = [
  {
    en: "How quickly will I get a response?",
    ar: "متى سأتلقى ردا؟",
    enA: "We acknowledge every submission within one business day and give you a first substantive response within 48 hours. Most cases are fully resolved within five business days, depending on complexity.",
    arA: "نؤكد استلام كل طلب خلال يوم عمل واحد، ونرد عليك ردا اوليا خلال 48 ساعة. تحل معظم الحالات خلال خمسة ايام عمل حسب طبيعتها.",
  },
  {
    en: "Is my complaint confidential?",
    ar: "هل شكواي سرية؟",
    enA: "Yes. Complaints are handled only by the patient experience team and shared strictly on a need-to-know basis, in line with our privacy policy. Filing a complaint never affects the care you receive.",
    arA: "نعم. يتعامل مع الشكاوى فريق تجربة المرضى فقط، وتتم مشاركتها في اضيق نطاق وفق سياسة الخصوصية. تقديم الشكوى لا يؤثر ابدا على الرعاية التي تتلقاها.",
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

function ArrowUpRight({ flip }: { flip: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`w-5 h-5 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 ${flip ? "-scale-x-100 group-hover:-translate-x-0.5" : "group-hover:translate-x-0.5"}`}
      aria-hidden
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

function Chevron() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5 shrink-0 text-on-surface-variant/50 transition-transform duration-300 group-open:rotate-180"
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

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
            className="absolute -top-32 -right-24 w-[32rem] h-[32rem] rounded-full opacity-60 pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(92,213,248,0.28) 0%, transparent 65%)" }}
            aria-hidden
          />
          <div
            className="absolute -bottom-40 -left-32 w-[28rem] h-[28rem] rounded-full opacity-40 pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(21,101,192,0.18) 0%, transparent 65%)" }}
            aria-hidden
          />
          <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-16 md:pt-24 pb-12 md:pb-16 text-center">
            <p className="text-[11px] md:text-xs font-extrabold uppercase tracking-[0.35em] text-secondary">
              {isRtl ? "تجربة المرضى" : "Patient experience"}
            </p>
            <h1 className={`mt-4 font-headline font-extrabold text-primary text-4xl md:text-6xl ${isRtl ? "leading-[1.3]" : "tracking-tight leading-[1.06]"} [text-wrap:balance]`}>
              {isRtl ? (
                <>صوتك يصنع <span className="bg-gradient-to-l from-primary via-tertiary to-secondary bg-clip-text text-transparent px-[0.12em] -mx-[0.12em]">رعاية افضل</span></>
              ) : (
                <>Your voice shapes <span className="bg-gradient-to-r from-primary via-tertiary to-secondary bg-clip-text text-transparent px-[0.12em] -mx-[0.12em]">better care</span></>
              )}
            </h1>
            <p className="mt-5 text-on-surface-variant text-base md:text-lg max-w-2xl mx-auto leading-relaxed [text-wrap:pretty]">
              {isRtl
                ? "شاركنا رايك او شكواك — كل رسالة تصل مباشرة إلى فريق تجربة المرضى وتتابع حتى الحل."
                : "Share a thought or raise a concern — every message goes straight to our patient experience team and is followed through to resolution."}
            </p>
            <p className="mt-7 text-[13px] md:text-sm font-bold text-on-surface-variant/80 tracking-wide">
              {isRtl
                ? "استجابة خلال 48 ساعة · سرية تامة · متابعة حتى الاغلاق"
                : "48h response · Fully confidential · Tracked to closure"}
            </p>
          </div>
        </section>

        {/* ── Call to action ── */}
        <section className="relative max-w-3xl mx-auto px-4 md:px-8 -mt-2 pb-14 md:pb-20">
          <div className="bg-white rounded-[2rem] shadow-[0_30px_70px_-30px_rgba(0,77,153,0.35)] ring-1 ring-outline-variant/30 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-primary via-tertiary to-secondary" aria-hidden />
            <div className="px-6 md:px-12 py-10 md:py-14 text-center">
              <h2 className="font-headline font-extrabold text-primary text-2xl md:text-3xl [text-wrap:balance]">
                {isRtl ? "حدثنا عن تجربتك" : "Tell us about your experience"}
              </h2>
              <p className="mt-3 text-on-surface-variant text-sm md:text-base leading-relaxed max-w-xl mx-auto [text-wrap:pretty]">
                {isRtl
                  ? "ثناء او اقتراح او شكوى — النموذج يستغرق دقيقتين تقريبا ويفتح في نافذة جديدة."
                  : "Compliment, suggestion or complaint — the form takes about two minutes and opens in a new tab."}
              </p>
              <a
                href={ZOHO_FEEDBACK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-8 w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-primary text-white font-extrabold text-base md:text-lg px-9 py-4 rounded-full shadow-[0_8px_24px_-8px_rgba(0,77,153,0.6)] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-8px_rgba(0,77,153,0.7)] active:translate-y-0 transition-all"
              >
                {isRtl ? "شاركنا ملاحظتك" : "Share your feedback"}
                <ArrowUpRight flip={isRtl} />
              </a>
            </div>
          </div>
          <p className="mt-5 text-center text-xs md:text-[13px] text-on-surface-variant">
            {isRtl ? (
              <>لحالة طبية عاجلة اتصل مباشرة على{" "}
                <a href={`tel:${PHONE_TEL}`} onClick={trackPhoneClick} dir="ltr" className="font-extrabold text-primary hover:underline">{PHONE_DISPLAY}</a>
                {" "}بدلا من هذه الصفحة.</>
            ) : (
              <>For urgent medical matters please call{" "}
                <a href={`tel:${PHONE_TEL}`} onClick={trackPhoneClick} dir="ltr" className="font-extrabold text-primary hover:underline">{PHONE_DISPLAY}</a>
                {" "}directly instead of using this page.</>
            )}
          </p>
        </section>

        {/* ── What happens next ── */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 pb-14 md:pb-24">
          <h2 className="text-center font-headline text-2xl md:text-4xl font-extrabold text-primary tracking-tight">
            {isRtl ? "ماذا يحدث بعد الارسال؟" : "What happens after you submit?"}
          </h2>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {STEPS.map((s, i) => (
              <div key={s.en} className="relative bg-white rounded-3xl p-6 shadow-clinical ring-1 ring-outline-variant/30 hover:-translate-y-1 hover:shadow-[0_20px_45px_-20px_rgba(0,77,153,0.35)] transition-all">
                <span className="inline-flex w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-secondary text-white font-headline font-extrabold text-lg items-center justify-center">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-headline font-extrabold text-on-surface text-lg">{isRtl ? s.ar : s.en}</h3>
                <p className="mt-1.5 text-sm text-on-surface-variant leading-relaxed">{isRtl ? s.arD : s.enD}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="bg-surface-container-low border-t border-outline-variant/30">
          <div className="max-w-3xl mx-auto px-4 md:px-8 py-14 md:py-24">
            <h2 className="text-center font-headline text-2xl md:text-4xl font-extrabold text-primary tracking-tight">
              {isRtl ? "اسئلة يكثر طرحها" : "Frequently asked questions"}
            </h2>
            <div className="mt-10 space-y-3">
              {FAQS.map((f) => (
                <details key={f.en} className="group bg-white rounded-2xl shadow-clinical ring-1 ring-outline-variant/30 open:ring-primary/30 transition-shadow">
                  <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-5 md:px-6 py-4 md:py-5 [&::-webkit-details-marker]:hidden">
                    <span className="font-bold text-on-surface">{isRtl ? f.ar : f.en}</span>
                    <Chevron />
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

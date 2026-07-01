"use client";

import { type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLang } from "@/app/i18n/context";
import { trackPhoneClick, trackWhatsAppClick } from "@/app/lib/tracking";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";

const PHONE_TEL = "920022811";
const PHONE_DISPLAY = "920 022 811";
const TELE_WA = `https://wa.me/966920022811?text=${encodeURIComponent(
  "مرحباً، أود حجز استشارة طبية عن بُعد (تطبيب عن بعد) في عيادتي"
)}`;

/* Brand palette — navy primary with aqua/teal accents carry the whole page. */
const AQUA = "#5cd5f8";
const TEAL = "#00677d"; // --color-secondary
const NAVY = "#004d99"; // --color-primary

/* Safe scroll reveal — framer-motion whileInView (GSAP ScrollTrigger reveals
   are known to leave elements stuck at opacity:0 on these pages). */
function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

const STATS = [
  { v: "27+", en: "Specialties", ar: "تخصص" },
  { v: "100+", en: "Doctors", ar: "طبيب" },
  { v: "4.9/5", en: "Patient rating", ar: "تقييم المرضى" },
  { v: "Minutes", varAr: "دقائق", en: "To connect", ar: "حتى تتواصل" },
];

const STEPS = [
  { icon: "event_available", en: ["Book your slot", "Request a virtual visit by phone, WhatsApp or our app and pick a time that suits you."], ar: ["احجز موعدك", "اطلب زيارة افتراضية عبر الهاتف أو واتساب أو تطبيقنا واختر الوقت المناسب لك."] },
  { icon: "lock", en: ["Get your secure link", "We send a private, encrypted video link — no software to install."], ar: ["استلم رابطك الآمن", "نرسل لك رابط فيديو خاص ومشفّر — دون الحاجة لتثبيت أي برنامج."] },
  { icon: "video_call", en: ["Meet your doctor", "Connect face-to-face with a My Clinic specialist and discuss your concern."], ar: ["قابل طبيبك", "تواصل وجهاً لوجه مع أخصائي في عيادتي وناقش حالتك بكل خصوصية."] },
  { icon: "receipt_long", en: ["Prescription & follow-up", "Receive an e-prescription, lab referrals and a follow-up plan instantly."], ar: ["وصفة ومتابعة", "احصل على وصفة إلكترونية وتحويلات مخبرية وخطة متابعة فوراً."] },
];

const BENEFITS = [
  { icon: "schedule", en: ["Care without the commute", "Skip traffic and waiting rooms — consult from home, work or while travelling."], ar: ["رعاية دون عناء التنقل", "تجنّب الازدحام وغرف الانتظار — استشر من منزلك أو عملك أو أثناء سفرك."] },
  { icon: "lock", en: ["Private & secure", "End-to-end encrypted video and protected medical records you can trust."], ar: ["خصوصية وأمان", "فيديو مشفّر بالكامل وسجلات طبية محمية يمكنك الوثوق بها."] },
  { icon: "groups", en: ["The same specialists", "Talk to the very same consultants who see patients in our Jeddah & Riyadh clinics."], ar: ["نفس النخبة من الأطباء", "تحدّث مع نفس الاستشاريين الذين يستقبلون المرضى في فروعنا بجدة والرياض."] },
  { icon: "medication", en: ["E-prescriptions", "Get medications prescribed digitally and delivered to your door."], ar: ["وصفات إلكترونية", "احصل على وصفاتك رقمياً مع إمكانية توصيل الأدوية إلى باب منزلك."] },
  { icon: "history", en: ["Easy follow-ups", "Review results and follow up on chronic conditions without a second trip."], ar: ["متابعة سهلة", "راجع نتائجك وتابع حالاتك المزمنة دون الحاجة لزيارة أخرى."] },
  { icon: "payments", en: ["Transparent pricing", "Clear consultation fees with no hidden costs, billed after your visit."], ar: ["أسعار واضحة", "رسوم استشارة واضحة دون تكاليف خفية، تُحتسب بعد زيارتك."] },
];

const SUITABLE = [
  { icon: "family_restroom", en: "Family Medicine", ar: "طب الأسرة", spec: "Family Medicine" },
  { icon: "dermatology", en: "Dermatology", ar: "الجلدية", spec: "Dermatology & Cosmetics" },
  { icon: "psychology", en: "Psychiatry & Psychology", ar: "الطب النفسي", spec: "Psychiatry & Psychology" },
  { icon: "restaurant", en: "Nutrition", ar: "التغذية", spec: "Nutrition" },
  { icon: "stethoscope", en: "Internal Medicine", ar: "الباطنية", spec: "Internal Medicine" },
  { icon: "metabolism", en: "Endocrinology & Diabetes", ar: "الغدد والسكري", spec: "Endocrinology & Diabetes" },
];

const FAQ = [
  { en: ["Is a telemedicine consultation as reliable as an in-person visit?", "For many concerns — follow-ups, prescriptions, skin and mental-health consults, and chronic-condition reviews — a video visit is just as effective. If your doctor decides you need a physical exam or tests, they'll arrange an in-clinic appointment for you."], ar: ["هل الاستشارة عن بُعد موثوقة مثل الزيارة الشخصية؟", "للعديد من الحالات — المتابعات، الوصفات، استشارات الجلد والصحة النفسية، ومراجعة الحالات المزمنة — تكون الزيارة بالفيديو فعّالة تماماً. وإذا رأى طبيبك حاجة لفحص سريري أو تحاليل، فسيرتّب لك موعداً في العيادة."] },
  { en: ["What do I need to join the call?", "Just a smartphone, tablet or computer with a camera and a stable internet connection. We send a secure link you open in your browser — nothing to download."], ar: ["ماذا أحتاج للانضمام إلى المكالمة؟", "فقط هاتف ذكي أو جهاز لوحي أو حاسوب بكاميرا واتصال إنترنت مستقر. نرسل لك رابطاً آمناً تفتحه في المتصفح — دون أي تحميل."] },
  { en: ["Can I get a prescription after the consultation?", "Yes. When clinically appropriate, your doctor issues an e-prescription, and we can arrange medication delivery as well as any lab or imaging referrals."], ar: ["هل يمكنني الحصول على وصفة بعد الاستشارة؟", "نعم. عند الحاجة الطبية، يصدر طبيبك وصفة إلكترونية، ويمكننا ترتيب توصيل الأدوية وكذلك أي تحويلات للمختبر أو الأشعة."] },
];

export default function TelemedicinePage() {
  const { lang } = useLang();
  const isRtl = lang === "ar";

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="min-h-screen bg-surface flex flex-col">
      <SiteNav />

      <main className="flex-1">
        {/* ─────────────────────────── Hero ─────────────────────────── */}
        <section
          className="relative overflow-hidden text-white"
          style={{ background: "linear-gradient(135deg,#06203f 0%,#04274d 46%,#013a6b 100%)" }}
        >
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute -top-28 right-[-6%] w-[34rem] h-[34rem] rounded-full" style={{ background: "radial-gradient(circle, rgba(92,213,248,0.22) 0%, transparent 70%)" }} />
            <div className="absolute bottom-[-32%] left-[-8%] w-[42rem] h-[42rem] rounded-full" style={{ background: "radial-gradient(circle, rgba(0,93,183,0.4) 0%, transparent 70%)" }} />
            <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-12 md:pt-16 pb-32 md:pb-40">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Copy */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="lg:col-span-6"
              >
                <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur text-white font-extrabold ${isRtl ? "text-[13px]" : "text-[11px] uppercase tracking-[0.18em]"}`}>
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>video_call</span>
                  {isRtl ? "الطب عن بُعد" : "Telemedicine"}
                </span>

                <h1 className={`mt-6 font-headline font-extrabold text-4xl md:text-5xl xl:text-[3.75rem] ${isRtl ? "leading-[1.25]" : "tracking-tight leading-[1.05]"} [text-wrap:balance]`}>
                  {isRtl ? (
                    <>طبيبك المتخصص <span style={{ color: AQUA }}>على بُعد نقرة.</span></>
                  ) : (
                    <>Your specialist, <span style={{ color: AQUA }}>one tap away.</span></>
                  )}
                </h1>

                <p className="mt-5 text-white/75 text-base md:text-lg max-w-xl leading-relaxed [text-wrap:pretty]">
                  {isRtl
                    ? "استشر نخبة أطباء عيادتي عبر مكالمة فيديو آمنة من أي مكان في المملكة — وصفات إلكترونية، تحويلات مخبرية، ومتابعة لحالتك دون مغادرة منزلك."
                    : "Consult My Clinic's leading specialists over a secure video call from anywhere in Saudi Arabia — e-prescriptions, lab referrals and follow-ups, without leaving home."}
                </p>

                <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2.5">
                  {[
                    { en: "Same trusted specialists", ar: "نفس الأطباء الموثوقين" },
                    { en: "Encrypted & private", ar: "مشفّر وخاص" },
                    { en: "From anywhere in KSA", ar: "من أي مكان في المملكة" },
                  ].map((t) => (
                    <li key={t.en} className="inline-flex items-center gap-1.5 text-white/85 text-sm font-bold">
                      <span className="material-symbols-outlined text-[18px]" style={{ color: AQUA, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      {isRtl ? t.ar : t.en}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <a
                    href={TELE_WA}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={trackWhatsAppClick}
                    className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-extrabold px-7 py-3.5 rounded-full shadow-[0_12px_30px_-10px_rgba(37,211,102,0.7)] hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-10px_rgba(37,211,102,0.8)] active:translate-y-0 transition-all"
                  >
                    <i className="fa-brands fa-whatsapp text-xl"></i>
                    {isRtl ? "ابدأ استشارة عن بُعد" : "Start a virtual visit"}
                    <span className={`material-symbols-outlined text-[20px] ${isRtl ? "rotate-180" : ""}`}>arrow_forward</span>
                  </a>
                  <a
                    href={`tel:${PHONE_TEL}`}
                    onClick={trackPhoneClick}
                    dir="ltr"
                    className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-extrabold px-7 py-3.5 rounded-full ring-1 ring-white/25 backdrop-blur hover:bg-white/20 transition-all"
                  >
                    <span className="material-symbols-outlined text-[20px]">call</span>
                    {PHONE_DISPLAY}
                  </a>
                </div>

                <Link href="/find-a-doctor" className="mt-5 inline-flex items-center gap-1.5 text-white/80 hover:text-white font-bold text-sm transition-colors">
                  {isRtl ? "أو تصفّح أطباءنا المتخصصين" : "or browse our specialists"}
                  <span className={`material-symbols-outlined text-[18px] ${isRtl ? "rotate-180" : ""}`}>arrow_forward</span>
                </Link>
              </motion.div>

              {/* Secure video-call visual */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
                className="lg:col-span-6 relative"
              >
                <div className={`hidden lg:block absolute inset-0 rounded-[2.4rem] bg-white/5 ring-1 ring-white/10 ${isRtl ? "-translate-x-5" : "translate-x-5"} translate-y-5`} aria-hidden />
                <div className="relative rounded-[2rem] overflow-hidden ring-1 ring-white/15 shadow-[0_50px_100px_-40px_rgba(0,0,0,0.7)]">
                  {/* call bar */}
                  <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between gap-2 px-3.5 py-3">
                    <span className="inline-flex items-center gap-1.5 bg-black/35 backdrop-blur text-white/90 text-[11px] font-bold px-2.5 py-1 rounded-full">
                      <span className="material-symbols-outlined text-[14px]">lock</span>
                      {isRtl ? "مشفّر" : "Encrypted"}
                    </span>
                    <span className="inline-flex items-center gap-1.5 bg-black/35 backdrop-blur text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      {isRtl ? "مباشر" : "Live"}
                    </span>
                  </div>

                  <div className="relative aspect-[4/3] lg:aspect-[5/4]">
                    <Image
                      src="/clinic/consultation.webp"
                      alt={isRtl ? "أخصائي عيادتي خلال استشارة بالفيديو" : "A My Clinic specialist during a video consultation"}
                      fill
                      priority
                      quality={78}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#06203f]/80 via-transparent to-[#06203f]/15" aria-hidden />
                  </div>

                  {/* specialist online chip */}
                  <div className={`absolute bottom-4 ${isRtl ? "right-4" : "left-4"} flex items-center gap-2.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl ring-1 ring-white/60 px-3.5 py-2.5`}>
                    <span className="relative w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>stethoscope</span>
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 ring-2 ring-white" />
                    </span>
                    <div className="leading-tight">
                      <div className="font-extrabold text-on-surface text-[13px]">{isRtl ? "أخصائيك متصل الآن" : "Your specialist online"}</div>
                      <div className="text-[11px] text-on-surface-variant">{isRtl ? "أكثر من 27 تخصصاً" : "27+ specialties"}</div>
                    </div>
                  </div>
                </div>

                {/* floating chip — e-prescription */}
                <div className={`absolute -bottom-5 ${isRtl ? "left-4 sm:left-8" : "right-4 sm:right-8"} flex items-center gap-2.5 bg-white rounded-2xl shadow-[0_20px_45px_-20px_rgba(0,0,0,0.4)] ring-1 ring-black/5 px-3.5 py-2.5`}>
                  <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${TEAL}14`, color: TEAL }}>
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>receipt_long</span>
                  </span>
                  <div className="leading-tight">
                    <div className="font-extrabold text-on-surface text-[13px]">{isRtl ? "وصفة إلكترونية" : "E-prescription"}</div>
                    <div className="text-[11px] text-on-surface-variant">{isRtl ? "وتحويلات مخبرية" : "& lab referrals"}</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ──────────────────── Stats strip ──────────────────── */}
        <section className="relative z-20 max-w-7xl mx-auto px-4 md:px-8 -mt-24 md:-mt-28">
          <Reveal className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 bg-white rounded-[2rem] shadow-[0_40px_90px_-45px_rgba(0,77,153,0.5)] ring-1 ring-outline-variant/30 p-6 md:p-8">
            {STATS.map((s) => (
              <div key={s.en} className="flex flex-col items-center text-center gap-1 px-2 sm:border-e sm:last:border-e-0 sm:border-outline-variant/30">
                <p className="font-headline text-2xl md:text-[1.9rem] font-extrabold text-primary leading-none">{isRtl && s.varAr ? s.varAr : s.v}</p>
                <p className="text-[12px] md:text-[13px] font-bold text-on-surface-variant">{isRtl ? s.ar : s.en}</p>
              </div>
            ))}
          </Reveal>
        </section>

        {/* ──────────────── How it works (timeline) ──────────────── */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <Reveal className="text-center max-w-2xl mx-auto">
            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-primary font-extrabold shadow-clinical ring-1 ring-primary/10 ${isRtl ? "text-[13px]" : "text-[11px] uppercase tracking-[0.15em]"}`}>
              {isRtl ? "كيف تعمل" : "How it works"}
            </span>
            <h2 className={`mt-5 font-headline text-3xl md:text-4xl xl:text-5xl font-extrabold text-primary ${isRtl ? "leading-[1.3]" : "tracking-tight leading-[1.08]"} [text-wrap:balance]`}>
              {isRtl ? "من الطلب إلى الوصفة" : "From request to prescription"}
            </h2>
            <p className="mt-5 text-on-surface-variant leading-[1.9] [text-wrap:pretty]">
              {isRtl ? "زيارة فيديو آمنة في أربع خطوات بسيطة." : "A secure video visit, in four simple steps."}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-12">
            <div className="bg-white rounded-[2.5rem] ring-1 ring-outline-variant/30 shadow-clinical p-6 sm:p-10 md:p-12">
              {/* Desktop horizontal timeline */}
              <div className="hidden lg:block relative">
                <div
                  className="absolute top-7 h-0.5 rounded-full"
                  style={{ left: "12.5%", right: "12.5%", background: `linear-gradient(to ${isRtl ? "left" : "right"}, ${AQUA}, ${TEAL} 45%, ${NAVY})` }}
                  aria-hidden
                />
                <ol className="relative grid grid-cols-4 gap-6">
                  {STEPS.map((s, i) => (
                    <li key={i} className="flex flex-col items-center text-center">
                      <span className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center text-white ring-4 ring-white" style={{ backgroundColor: NAVY, boxShadow: `0 14px 26px -12px ${NAVY}` }}>
                        <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                      </span>
                      <span className="mt-4 text-[10px] font-extrabold tracking-[0.16em]" style={{ color: TEAL }}>
                        {isRtl ? `الخطوة ${i + 1}` : `STEP ${String(i + 1).padStart(2, "0")}`}
                      </span>
                      <h3 className="mt-1.5 font-headline font-extrabold text-on-surface text-[15px] leading-snug">{isRtl ? s.ar[0] : s.en[0]}</h3>
                      <p className="mt-1.5 text-[13px] text-on-surface-variant leading-relaxed [text-wrap:pretty]">{isRtl ? s.ar[1] : s.en[1]}</p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Mobile vertical timeline */}
              <div className="lg:hidden relative">
                <div
                  className="absolute top-7 bottom-7 w-0.5 rounded-full"
                  style={{ insetInlineStart: "27px", background: `linear-gradient(to bottom, ${AQUA}, ${TEAL} 45%, ${NAVY})` }}
                  aria-hidden
                />
                <ol className="space-y-6">
                  {STEPS.map((s, i) => (
                    <li key={i} className="relative flex gap-4">
                      <span className="relative z-10 w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center text-white ring-4 ring-white" style={{ backgroundColor: NAVY, boxShadow: `0 14px 26px -12px ${NAVY}` }}>
                        <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                      </span>
                      <div className="pt-1">
                        <span className="text-[10px] font-extrabold tracking-[0.16em]" style={{ color: TEAL }}>
                          {isRtl ? `الخطوة ${i + 1}` : `STEP ${String(i + 1).padStart(2, "0")}`}
                        </span>
                        <h3 className="mt-0.5 font-headline font-extrabold text-on-surface text-base leading-snug">{isRtl ? s.ar[0] : s.en[0]}</h3>
                        <p className="mt-1 text-[13.5px] text-on-surface-variant leading-relaxed [text-wrap:pretty]">{isRtl ? s.ar[1] : s.en[1]}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ──────────────── Benefits ──────────────── */}
        <section className="relative overflow-hidden bg-surface-container-low border-y border-outline-variant/30">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
            <Reveal className="text-center max-w-2xl mx-auto">
              <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-primary font-extrabold shadow-clinical ring-1 ring-primary/10 ${isRtl ? "text-[13px]" : "text-[11px] uppercase tracking-[0.15em]"}`}>
                {isRtl ? "لماذا الطب عن بُعد" : "Why telemedicine"}
              </span>
              <h2 className={`mt-5 font-headline text-3xl md:text-4xl font-extrabold text-primary ${isRtl ? "leading-[1.3]" : "tracking-tight leading-[1.1]"} [text-wrap:balance]`}>
                {isRtl ? "رعاية تأتي إليك" : "Care that comes to you"}
              </h2>
              <p className="mt-5 text-on-surface-variant leading-[1.9] [text-wrap:pretty]">
                {isRtl
                  ? "كل ما تحتاجه من رعاية متخصصة — بخصوصية وراحة، أينما كنت."
                  : "Everything you need from specialist care — private, convenient, wherever you are."}
              </p>
            </Reveal>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {BENEFITS.map((b, i) => {
                const accent = i % 2 === 0 ? NAVY : TEAL;
                return (
                  <Reveal key={b.icon} delay={(i % 3) * 0.06}>
                    <div className="h-full bg-white rounded-[1.5rem] p-6 md:p-7 shadow-clinical ring-1 ring-outline-variant/30 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(0,77,153,0.5)] transition-all">
                      <span className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: `${accent}14`, color: accent }}>
                        <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>{b.icon}</span>
                      </span>
                      <h3 className="font-headline font-extrabold text-on-surface text-lg leading-tight">{isRtl ? b.ar[0] : b.en[0]}</h3>
                      <p className="mt-2.5 text-on-surface-variant text-[14.5px] leading-[1.8] [text-wrap:pretty]">{isRtl ? b.ar[1] : b.en[1]}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ──────────────── Suited specialties ──────────────── */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 w-full">
          <Reveal className="text-center max-w-2xl mx-auto">
            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-primary font-extrabold shadow-clinical ring-1 ring-primary/10 ${isRtl ? "text-[13px]" : "text-[11px] uppercase tracking-[0.15em]"}`}>
              {isRtl ? "متاح أونلاين" : "Available online"}
            </span>
            <h2 className={`mt-5 font-headline text-3xl md:text-4xl font-extrabold text-primary ${isRtl ? "leading-[1.3]" : "tracking-tight leading-[1.1]"} [text-wrap:balance]`}>
              {isRtl ? "تخصصات مناسبة للزيارة الافتراضية" : "Specialties suited to virtual visits"}
            </h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {SUITABLE.map((s, i) => (
              <Reveal key={s.spec} delay={(i % 6) * 0.05}>
                <Link
                  href={`/find-a-doctor?spec=${encodeURIComponent(s.spec)}`}
                  className="group h-full flex flex-col items-center text-center gap-3 bg-white rounded-2xl p-5 ring-1 ring-outline-variant/30 shadow-clinical hover:border-primary/30 hover:-translate-y-1 hover:shadow-[0_22px_44px_-28px_rgba(0,77,153,0.5)] transition-all"
                >
                  <span className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                  </span>
                  <span className="text-[13px] md:text-sm font-bold text-on-surface leading-tight">{isRtl ? s.ar : s.en}</span>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal className="text-center mt-10">
            <Link href="/specialties" className="inline-flex items-center gap-2 text-primary font-extrabold hover:gap-3 transition-all">
              {isRtl ? "استعرض كل التخصصات" : "See all specialties"}
              <span className={`material-symbols-outlined ${isRtl ? "rotate-180" : ""}`}>arrow_forward</span>
            </Link>
          </Reveal>
        </section>

        {/* ──────────────── FAQ ──────────────── */}
        <section className="bg-surface-container-low border-y border-outline-variant/30">
          <div className="max-w-3xl mx-auto px-4 md:px-8 py-16 md:py-24 w-full">
            <Reveal className="text-center max-w-2xl mx-auto">
              <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-primary font-extrabold shadow-clinical ring-1 ring-primary/10 ${isRtl ? "text-[13px]" : "text-[11px] uppercase tracking-[0.15em]"}`}>
                {isRtl ? "أسئلة شائعة" : "FAQ"}
              </span>
              <h2 className={`mt-5 font-headline text-3xl md:text-4xl font-extrabold text-primary ${isRtl ? "leading-[1.3]" : "tracking-tight leading-[1.1]"} [text-wrap:balance]`}>
                {isRtl ? "كل ما تريد معرفته" : "Everything you need to know"}
              </h2>
            </Reveal>
            <div className="mt-12 space-y-3.5">
              {FAQ.map((f, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <details className="group bg-white rounded-2xl ring-1 ring-outline-variant/30 shadow-clinical overflow-hidden">
                    <summary className="flex items-center justify-between gap-4 cursor-pointer p-5 md:p-6 font-headline font-extrabold text-on-surface list-none [&::-webkit-details-marker]:hidden">
                      {isRtl ? f.ar[0] : f.en[0]}
                      <span className="material-symbols-outlined text-primary transition-transform group-open:rotate-45 shrink-0">add</span>
                    </summary>
                    <p className="px-5 md:px-6 pb-6 -mt-1 text-on-surface-variant text-[14.5px] leading-[1.85] [text-wrap:pretty]">{isRtl ? f.ar[1] : f.en[1]}</p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ──────────────────────── Closing CTA ──────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <Reveal>
            <div
              className="relative overflow-hidden rounded-[2.5rem] text-white px-6 md:px-14 py-14 md:py-20 shadow-[0_50px_110px_-45px_rgba(0,77,153,0.8)]"
              style={{ background: "linear-gradient(135deg,#06203f 0%,#04274d 46%,#013a6b 100%)" }}
            >
              <div className="absolute -top-20 -right-16 w-80 h-80 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(92,213,248,0.32) 0%, transparent 70%)" }} aria-hidden />
              <div className="absolute -bottom-24 -left-16 w-96 h-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(0,93,183,0.45) 0%, transparent 70%)" }} aria-hidden />
              <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)", backgroundSize: "22px 22px" }} aria-hidden />

              <div className="relative max-w-3xl">
                <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 ring-1 ring-white/20 text-white font-extrabold backdrop-blur ${isRtl ? "text-[13px]" : "text-[11px] uppercase tracking-[0.15em]"}`}>
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>video_call</span>
                  {isRtl ? "ابدأ الآن" : "Get started"}
                </span>
                <h2 className={`mt-5 font-headline text-3xl md:text-5xl font-extrabold ${isRtl ? "leading-[1.3]" : "tracking-tight leading-[1.05]"} [text-wrap:balance]`}>
                  {isRtl ? "ابدأ رعايتك، من حيث أنت." : "Start your care, right where you are."}
                </h2>
                <p className="mt-5 text-white/80 text-base md:text-lg leading-[1.9] [text-wrap:pretty]">
                  {isRtl
                    ? "احجز استشارتك الافتراضية اليوم وتحدّث مع أخصائي خلال دقائق — عبر واتساب أو الهاتف."
                    : "Book your virtual consultation today and speak with a specialist within minutes — on WhatsApp or by phone."}
                </p>
                <div className="mt-9 flex flex-col sm:flex-row gap-3.5">
                  <a
                    href={TELE_WA}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={trackWhatsAppClick}
                    className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-extrabold px-8 py-4 rounded-full shadow-lg hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 transition-all"
                  >
                    <i className="fa-brands fa-whatsapp text-xl"></i>
                    {isRtl ? "احجز عبر واتساب" : "Book on WhatsApp"}
                  </a>
                  <a
                    href={`tel:${PHONE_TEL}`}
                    onClick={trackPhoneClick}
                    dir="ltr"
                    className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-extrabold px-8 py-4 rounded-full ring-1 ring-white/30 backdrop-blur hover:bg-white/20 transition-all"
                  >
                    <span className="material-symbols-outlined text-[21px]">call</span>
                    {PHONE_DISPLAY}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <SiteFooter />

      {/* Floating WhatsApp */}
      <a
        href={TELE_WA}
        onClick={trackWhatsAppClick}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={isRtl ? "تواصل عبر واتساب" : "Chat on WhatsApp"}
        className={`fixed bottom-6 ${isRtl ? "left-6" : "right-6"} z-40 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:scale-110 transition-all`}
      >
        <i className="fa-brands fa-whatsapp text-white text-2xl" />
      </a>
    </div>
  );
}

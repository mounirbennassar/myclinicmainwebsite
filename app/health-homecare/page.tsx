"use client";

import { type ReactNode } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLang } from "@/app/i18n/context";
import { trackPhoneClick, trackWhatsAppClick } from "@/app/lib/tracking";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";

const PHONE_TEL = "920022811";
const PHONE_DISPLAY = "920 022 811";
const WA_NUMBER = "966567729095";
const waUrl = (isRtl: boolean) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    isRtl
      ? "مرحباً، أود معرفة المزيد عن خدمات الرعاية الصحية المنزلية من عيادتي."
      : "Hello, I'd like to know more about My Clinic Home Healthcare services."
  )}`;

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

const QUICK = [
  { icon: "medical_services", en: "Doctor visits", ar: "زيارات الطبيب" },
  { icon: "vaccines", en: "Nursing care", ar: "رعاية تمريضية" },
  { icon: "physical_therapy", en: "Physiotherapy", ar: "علاج طبيعي" },
  { icon: "science", en: "Lab tests at home", ar: "فحوصات مخبرية منزلية" },
];

const SERVICES = [
  {
    icon: "physical_therapy",
    color: "#00677d",
    en: {
      title: "Physiotherapy",
      desc: "Home physiotherapy is a service where licensed physiotherapists provide personalized treatment to patients in the comfort of their own homes. This approach is especially beneficial for individuals who have difficulty traveling to a clinic due to mobility issues, chronic conditions, or post-surgical recovery.",
      items: ["Geriatric Physiotherapy", "Neurological Physiotherapy", "Orthopedic Physiotherapy", "Pediatric Physiotherapy", "Post-Operative Physiotherapy", "Sports Physiotherapy"],
      note: "",
    },
    ar: {
      title: "العلاج الطبيعي",
      desc: "العلاج الطبيعي المنزلي خدمة يقدّم فيها أخصائيو العلاج الطبيعي المرخّصون علاجاً شخصياً للمرضى في راحة منازلهم. ويُعد هذا النهج مفيداً بشكل خاص للأفراد الذين يجدون صعوبة في الذهاب إلى العيادة بسبب مشاكل الحركة أو الحالات المزمنة أو التعافي بعد الجراحة.",
      items: ["العلاج الطبيعي لكبار السن", "العلاج الطبيعي للأعصاب", "العلاج الطبيعي للعظام", "العلاج الطبيعي للأطفال", "العلاج الطبيعي بعد العملية الجراحية", "العلاج الطبيعي الرياضي"],
      note: "",
    },
  },
  {
    icon: "stethoscope",
    color: "#004d99",
    en: {
      title: "Physician Assessment",
      desc: "A home physician assessment involves a licensed doctor visiting patients in their home to provide comprehensive medical evaluation and care. Patients receive care in a familiar, comfortable environment, and we develop a customized treatment plan based on each patient's individual needs.",
      items: ["GP assessments", "Specialist", "Senior Specialist", "Consultant evaluations"],
      note: "We provide a treatment and follow-up plan based on the patient's condition — e.g. post-acute care programs and population health management programs.",
    },
    ar: {
      title: "التقييم من قبل طبيب",
      desc: "يتضمّن التقييم الطبي المنزلي زيارة طبيب مرخّص للمرضى في منازلهم لتقديم تقييم ورعاية طبية شاملة. يتلقّى المرضى الرعاية في بيئة مألوفة ومريحة، ونطوّر خطة علاج مخصّصة بناءً على احتياجات كل مريض.",
      items: ["تقييم طبيب عام", "أخصائي", "أخصائي أول", "استشاري"],
      note: "نقدّم خطة علاج ومتابعة بناءً على حالة المريض، مثل برنامج رعاية ما بعد الحالات الحادة وبرنامج إدارة صحة السكان.",
    },
  },
  {
    icon: "vaccines",
    color: "#0e7490",
    en: {
      title: "Nursing Care",
      desc: "Nursing care at home involves professional nurses providing a range of medical and personal care services in the comfort of your own home. It is especially beneficial for individuals who require ongoing medical attention but prefer to stay in their familiar environment — such as the elderly, those recovering from surgery, or patients with chronic illnesses.",
      items: ["Vital signs monitoring", "Laboratory test extraction", "Immunization injections", "IV fluids", "Wound care", "ECG at home", "Retinal imaging", "Vascular doppler"],
      note: "",
    },
    ar: {
      title: "التمريض",
      desc: "تتضمّن الرعاية التمريضية المنزلية ممرّضين محترفين يقدّمون مجموعة من خدمات الرعاية الطبية والشخصية للمرضى في منازلهم. وهي مفيدة بشكل خاص لمن يحتاجون إلى رعاية طبية مستمرة ويفضّلون البقاء في بيئتهم المألوفة، مثل كبار السن، أو المتعافين من الجراحة، أو مرضى الأمراض المزمنة.",
      items: ["مراقبة العلامات الحيوية", "استخراج عينات المختبر", "اللقاحات والتطعيمات", "السوائل الوريدية", "العناية بالجروح", "تخطيط القلب في المنزل", "تصوير الشبكية", "الموجات فوق الصوتية دوبلر"],
      note: "",
    },
  },
];

export default function HealthHomecarePage() {
  const { lang } = useLang();
  const isRtl = lang === "ar";
  const WA = waUrl(isRtl);

  const eyebrow = (en: string, ar: string) => (
    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-primary font-extrabold shadow-clinical ring-1 ring-primary/10 ${isRtl ? "text-[13px]" : "text-[11px] uppercase tracking-[0.15em]"}`}>
      {isRtl ? ar : en}
    </span>
  );

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="min-h-screen bg-surface flex flex-col">
      {/* ── Header ── */}
      <SiteNav />

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 hero-gradient" aria-hidden />
          <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-10 md:pt-16 pb-14 md:pb-20">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
              {/* Copy */}
              <div>
                <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-primary font-extrabold shadow-clinical ring-1 ring-primary/10 ${isRtl ? "text-[13px]" : "text-[11px] uppercase tracking-[0.15em]"}`}>
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>home_health</span>
                  {isRtl ? "الرعاية الصحية المنزلية" : "Home Healthcare"}
                </span>
                <h1 className={`mt-6 font-headline font-extrabold text-primary text-4xl md:text-5xl xl:text-[3.75rem] ${isRtl ? "leading-[1.22]" : "tracking-tight leading-[1.04]"} [text-wrap:balance] text-glow`}>
                  {isRtl ? "رعاية صحية تأتي إليك" : "Healthcare that comes to you"}
                </h1>
                <p className="mt-5 text-on-surface-variant text-base md:text-lg max-w-xl leading-relaxed [text-wrap:pretty]">
                  {isRtl
                    ? "زيارات الطبيب، ورعاية تمريضية، وعلاج طبيعي — يقدّمها مختصّون مرخّصون في راحة منزلك، في جدة والرياض."
                    : "Doctor visits, nursing care and physiotherapy — delivered by licensed professionals in the comfort of your home, across Jeddah & Riyadh."}
                </p>

                <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2.5">
                  {[
                    { en: "Licensed professionals", ar: "مختصّون مرخّصون" },
                    { en: "Care at home", ar: "رعاية في المنزل" },
                    { en: "Jeddah & Riyadh", ar: "جدة والرياض" },
                  ].map((t) => (
                    <li key={t.en} className="inline-flex items-center gap-1.5 text-on-surface-variant text-sm font-bold">
                      <span className="material-symbols-outlined text-[18px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      {isRtl ? t.ar : t.en}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <a
                    href={WA}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={trackWhatsAppClick}
                    className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-extrabold px-7 py-3.5 rounded-full shadow-[0_8px_24px_-8px_rgba(37,211,102,0.6)] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-8px_rgba(37,211,102,0.7)] active:translate-y-0 transition-all"
                  >
                    <i className="fa-brands fa-whatsapp text-xl"></i>
                    {isRtl ? "تواصل عبر واتساب" : "Contact us on WhatsApp"}
                  </a>
                  <a
                    href={`tel:${PHONE_TEL}`}
                    onClick={trackPhoneClick}
                    dir="ltr"
                    className="inline-flex items-center justify-center gap-2 bg-white text-primary font-extrabold px-7 py-3.5 rounded-full ring-1 ring-primary/15 shadow-clinical hover:-translate-y-0.5 transition-all"
                  >
                    <span className="material-symbols-outlined text-[20px]">call</span>
                    {PHONE_DISPLAY}
                  </a>
                </div>
              </div>

              {/* Image */}
              <div className="relative">
                {/* layered depth block behind the photo (desktop) */}
                <div className={`hidden lg:block absolute inset-0 rounded-[2.3rem] bg-secondary-fixed/50 ${isRtl ? "-translate-x-5" : "translate-x-5"} translate-y-5`} aria-hidden />
                <div className="relative aspect-[4/3] md:aspect-[3/2] lg:aspect-[5/4] rounded-[2rem] overflow-hidden ring-1 ring-outline-variant/40 shadow-[0_40px_90px_-45px_rgba(0,77,153,0.55)]">
                  <Image
                    src="/clinic/home-healthcare.webp"
                    alt={isRtl ? "فريق التمريض في عيادتي" : "My Clinic nursing team"}
                    fill
                    priority
                    quality={75}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/25 via-transparent to-transparent" aria-hidden />
                </div>

                {/* floating glass detail card */}
                <div className={`absolute bottom-4 ${isRtl ? "right-4" : "left-4"} flex items-center gap-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl ring-1 ring-white/60 p-3 pe-5 max-w-[16rem]`}>
                  <span className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home_health</span>
                  </span>
                  <div>
                    <div className="font-extrabold text-on-surface text-sm leading-tight">{isRtl ? "زيارات منزلية" : "In-home visits"}</div>
                    <div className="text-[12px] text-on-surface-variant">{isRtl ? "طبيب، ممرّض وعلاج طبيعي" : "Doctor, nurse & physio"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Quick services strip ── */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 -mt-2 md:-mt-4">
          <Reveal className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 bg-white rounded-[2rem] shadow-[0_30px_70px_-40px_rgba(0,77,153,0.4)] ring-1 ring-outline-variant/30 p-6 md:p-8">
            {QUICK.map((q) => (
              <div key={q.en} className="flex flex-col items-center text-center gap-2.5 px-2">
                <span className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>{q.icon}</span>
                </span>
                <span className="text-[13px] md:text-sm font-bold text-on-surface">{isRtl ? q.ar : q.en}</span>
              </div>
            ))}
          </Reveal>
        </section>

        {/* ── Intro band ── */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Image */}
            <Reveal className="order-2 lg:order-1">
              <div className="relative">
                <div className="hidden lg:block absolute inset-0 rounded-[2.3rem] bg-primary/5 -translate-x-5 translate-y-5" aria-hidden />
                <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden ring-1 ring-outline-variant/40 shadow-[0_30px_75px_-45px_rgba(0,77,153,0.5)]">
                  <Image
                    src="/clinic/consultation.webp"
                    alt={isRtl ? "طبيبة عيادتي تقدّم الرعاية لمريض" : "A My Clinic physician caring for a patient"}
                    fill
                    quality={72}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </Reveal>
            {/* Copy */}
            <Reveal delay={0.1} className="order-1 lg:order-2">
              {eyebrow("My Clinic Home Healthcare", "الرعاية المنزلية من عيادتي")}
              <h2 className={`mt-5 font-headline text-3xl md:text-4xl font-extrabold text-primary ${isRtl ? "leading-[1.3]" : "tracking-tight leading-[1.1]"} [text-wrap:balance]`}>
                {isRtl ? "رعاية متكاملة في راحة منزلك" : "Complete care in the comfort of home"}
              </h2>
              <p className="mt-6 text-on-surface-variant text-base md:text-lg leading-[1.9] [text-wrap:pretty]">
                {isRtl
                  ? "في عيادتي، نوفّر لك رعاية صحية منزلية آمنة ومريحة يقدّمها فريق من المتخصصين المؤهّلين — من زيارات الطبيب والممرّضة إلى العلاج الطبيعي والفحوصات المخبرية. استمتع برعاية مصمّمة حول احتياجاتك لتبقى صحتك أولوية دون عناء التنقّل."
                  : "At My Clinic, we bring you safe, convenient home healthcare delivered by a team of qualified professionals — from doctor and nurse visits to physiotherapy and lab tests. Experience care designed around your needs, so your health stays a priority without the hassle of travel."}
              </p>
              <div className="mt-7 flex flex-wrap gap-2.5">
                {[
                  { icon: "schedule", en: "On your schedule", ar: "في الوقت الذي يناسبك" },
                  { icon: "health_and_safety", en: "Safe & private", ar: "آمنة وخاصة" },
                  { icon: "groups", en: "Qualified team", ar: "فريق مؤهّل" },
                ].map((h) => (
                  <span key={h.en} className="inline-flex items-center gap-2 bg-surface-container-low text-on-surface font-bold text-[13px] px-3.5 py-2 rounded-full ring-1 ring-outline-variant/30">
                    <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>{h.icon}</span>
                    {isRtl ? h.ar : h.en}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Homecare services ── */}
        <section className="relative overflow-hidden bg-surface-container-low border-y border-outline-variant/30">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
            <Reveal className="text-center max-w-2xl mx-auto">
              {eyebrow("Our Services", "خدماتنا")}
              <h2 className={`mt-5 font-headline text-3xl md:text-4xl font-extrabold text-primary ${isRtl ? "leading-[1.3]" : "tracking-tight leading-[1.1]"} [text-wrap:balance]`}>
                {isRtl ? "خدمات الرعاية الصحية المنزلية" : "Home healthcare services"}
              </h2>
              <p className="mt-5 text-on-surface-variant leading-[1.9] [text-wrap:pretty]">
                {isRtl
                  ? "ثلاث خدمات أساسية يقدّمها مختصّون مرخّصون في منزلك."
                  : "Three core services, delivered by licensed specialists right at your home."}
              </p>
            </Reveal>

            <div className="mt-12 grid lg:grid-cols-3 gap-5 md:gap-7 items-stretch">
              {SERVICES.map((s, i) => {
                const c = isRtl ? s.ar : s.en;
                return (
                  <Reveal key={s.en.title} delay={i * 0.08}>
                    <div className="flex h-full flex-col bg-white rounded-[1.75rem] p-7 md:p-8 shadow-clinical ring-1 ring-outline-variant/30 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(0,77,153,0.5)] transition-all">
                      <span
                        className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${s.color}1a`, color: s.color }}
                      >
                        <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                      </span>
                      <h3 className="mt-5 font-headline text-xl md:text-2xl font-extrabold text-on-surface">{c.title}</h3>
                      <p className="mt-3 text-on-surface-variant text-[15px] leading-[1.85] [text-wrap:pretty]">{c.desc}</p>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {c.items.map((it) => (
                          <span key={it} className="inline-flex items-center gap-1.5 bg-surface-container-low ring-1 ring-outline-variant/30 text-on-surface text-[12.5px] font-semibold px-3 py-1.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} aria-hidden />
                            {it}
                          </span>
                        ))}
                      </div>

                      {c.note && (
                        <p className="mt-4 text-[13.5px] text-on-surface-variant/90 leading-relaxed border-s-2 ps-3" style={{ borderColor: `${s.color}55` }}>
                          {c.note}
                        </p>
                      )}

                      <a
                        href={WA}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={trackWhatsAppClick}
                        className="mt-6 inline-flex items-center gap-1.5 font-extrabold text-sm hover:gap-2.5 transition-all"
                        style={{ color: s.color }}
                      >
                        <i className="fa-brands fa-whatsapp text-base"></i>
                        {isRtl ? "اطلب هذه الخدمة" : "Request this service"}
                        <span className={`material-symbols-outlined text-[18px] ${isRtl ? "rotate-180" : ""}`}>arrow_forward</span>
                      </a>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Closing CTA band ── */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2.5rem] bg-primary text-white px-6 md:px-14 py-14 md:py-20 shadow-[0_40px_90px_-40px_rgba(0,77,153,0.7)]">
              <div className="absolute -top-20 -right-16 w-80 h-80 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(92,213,248,0.35) 0%, transparent 70%)" }} aria-hidden />
              <div className="absolute -bottom-24 -left-16 w-96 h-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)" }} aria-hidden />
              <div className="relative max-w-3xl">
                <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 text-white font-extrabold backdrop-blur ${isRtl ? "text-[13px]" : "text-[11px] uppercase tracking-[0.15em]"}`}>
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>home_health</span>
                  {isRtl ? "ابدأ الآن" : "Get started"}
                </span>
                <h2 className={`mt-5 font-headline text-3xl md:text-5xl font-extrabold ${isRtl ? "leading-[1.3]" : "tracking-tight leading-[1.05]"} [text-wrap:balance]`}>
                  {isRtl ? "احجز رعايتك المنزلية اليوم" : "Book your home care today"}
                </h2>
                <p className="mt-5 text-white/85 text-base md:text-lg leading-[1.9] [text-wrap:pretty]">
                  {isRtl
                    ? "فريقنا جاهز لزيارتك في المنزل. تواصل معنا عبر واتساب أو الهاتف وسنرتّب لك الرعاية المناسبة في الوقت الذي يناسبك."
                    : "Our team is ready to visit you at home. Reach us on WhatsApp or by phone and we'll arrange the right care at a time that suits you."}
                </p>
                <div className="mt-9 flex flex-col sm:flex-row gap-3.5">
                  <a
                    href={WA}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={trackWhatsAppClick}
                    className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-extrabold px-8 py-4 rounded-full shadow-lg hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 transition-all"
                  >
                    <i className="fa-brands fa-whatsapp text-xl"></i>
                    {isRtl ? "تواصل عبر واتساب" : "Chat on WhatsApp"}
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
    </div>
  );
}

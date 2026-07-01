"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLang } from "@/app/i18n/context";
import { trackPhoneClick } from "@/app/lib/tracking";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";

const PHONE_TEL = "920022811";
const PHONE_DISPLAY = "920 022 811";
const BOOKING_URL = "https://bamc.myclinic.com.sa:8443/";

/* ── Safe scroll reveal — framer-motion whileInView (GSAP ScrollTrigger reveals
   are known to leave elements stuck at opacity:0 on these pages). ── */
function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
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
  { value: "2017", en: "Founded", ar: "سنة التأسيس" },
  { value: "+24", en: "Specialties", ar: "تخصصاً" },
  { value: "+300", en: "Professionals", ar: "متخصص" },
  { value: "CBAHI", en: "Accredited", ar: "معتمدون" },
];

const CENTERS = [
  { en: "My Clinic Al Mohammadiyah", ar: "عيادتي المحمدية", metaEn: "Jeddah", metaAr: "جدة", flag: true },
  { en: "My Clinic Al Safa", ar: "عيادتي الصفا", metaEn: "Jeddah", metaAr: "جدة" },
  { en: "My Clinic Dental Center", ar: "مركز عيادتي لطب الأسنان", metaEn: "Al Khalidiyah, Jeddah", metaAr: "الخالدية، جدة" },
  { en: "My Clinic Al Tahlia", ar: "عيادتي التحلية", metaEn: "Jeddah", metaAr: "جدة" },
  { en: "My Clinic Obhour", ar: "عيادتي أبحر", metaEn: "Jeddah", metaAr: "جدة" },
  { en: "My Clinic Riyadh", ar: "عيادتي الرياض", metaEn: "Riyadh · New flagship", metaAr: "الرياض · المركز الجديد", flag: true },
];

const WHAT_WE_DO_CHIPS = [
  { icon: "shield_with_heart", en: "Preventive & routine care", ar: "الرعاية الوقائية والفحوصات" },
  { icon: "medical_services", en: "Specialized treatments", ar: "العلاجات المتخصصة" },
  { icon: "diagnosis", en: "Accurate, compassionate care", ar: "رعاية دقيقة ورحيمة" },
];

const VALUES = [
  {
    icon: "favorite",
    color: "#00677d",
    en: { title: "Caring", points: [
      "We act with empathy and respect",
      "To us, everyone matters",
      "We love our customers",
      "We always deliver for our customers with quality",
    ] },
    ar: { title: "الاهتمام", points: [
      "نحن نتصرف بتعاطف واحترام",
      "بالنسبة لنا، الجميع مهم",
      "نحن نحب عملاءنا",
      "الجودة أولاً لعملائنا",
    ] },
  },
  {
    icon: "rocket_launch",
    color: "#004d99",
    en: { title: "Ambitious", points: [
      "We are not afraid to go above and beyond the normal",
      "We make new possibilities happen",
      "We challenge the status quo",
      "We are industry shapers",
      "We deliver outstanding results",
    ] },
    ar: { title: "الطموح", points: [
      "نحن لسنا خائفين من الذهاب إلى ما هو مستحيل",
      "نحن نجعل الاحتمالات الجديدة تحدث",
      "نحن نتحدى الوضع الراهن",
      "نحن نواكب التطور",
      "نحن نقدم نتائج باهرة",
    ] },
  },
  {
    icon: "verified_user",
    color: "#134aa4",
    en: { title: "Responsible", points: [
      "We own our decisions and actions",
      "We make things happen when we make a commitment",
      "We demonstrate high professional standards",
      "We are accountable to ourselves, to our customers, and to our colleagues",
    ] },
    ar: { title: "المسؤولية", points: [
      "نحن نملك قراراتنا وأفعالنا",
      "نحن نحقق الأشياء عندما نلتزم",
      "نحن نظهر معايير مهنية عالية",
      "نحن مسؤولون أمام أنفسنا، وعملائنا، وزملائنا",
    ] },
  },
  {
    icon: "diversity_3",
    color: "#0e7490",
    en: { title: "Collaborative", points: [
      "We act together",
      "We treat our colleagues with the utmost respect",
      "We are open and transparent",
      "We embrace diverse perspectives",
      "We aim to deliver outstanding results",
    ] },
    ar: { title: "التعاون", points: [
      "نحن نعمل معاً",
      "نحن نتعامل مع زملائنا بمنتهى الاحترام",
      "نحن منفتحون وشفافون",
      "نحن نحتضن وجهات نظر متنوعة",
      "نحن نهدف إلى تحقيق نتائج باهرة",
    ] },
  },
];

export default function AboutPage() {
  const { lang } = useLang();
  const isRtl = lang === "ar";

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
        <section className="relative overflow-hidden hero-gradient">
          <div
            className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-50 pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(92,213,248,0.25) 0%, transparent 70%)" }}
            aria-hidden
          />
          <div className="relative max-w-4xl mx-auto px-4 md:px-8 pt-14 md:pt-20 pb-12 md:pb-16 text-center">
            {eyebrow("About Us", "عن عيادتي")}
            <h1 className={`mt-6 font-headline font-extrabold text-primary text-4xl md:text-6xl ${isRtl ? "leading-[1.25]" : "tracking-tight leading-[1.05]"} [text-wrap:balance] text-glow`}>
              {isRtl ? "تعرّف على عيادتي" : "Get to know My Clinic"}
            </h1>
            <p className="mt-5 text-on-surface-variant text-base md:text-lg max-w-2xl mx-auto leading-relaxed [text-wrap:pretty]">
              {isRtl
                ? "مجموعة رعاية صحية متعددة التخصصات، نعتني بالناس في جدة والرياض منذ عام 2017 — بأكثر من 24 تخصصاً وفريق يضم أكثر من 300 متخصص."
                : "A leading multispecialty healthcare group caring for people across Jeddah & Riyadh since 2017 — with 24+ specialties and a team of 300+ professionals."}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-white font-extrabold px-7 py-3.5 rounded-full shadow-[0_8px_24px_-8px_rgba(0,77,153,0.6)] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-8px_rgba(0,77,153,0.7)] active:translate-y-0 transition-all"
              >
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>event_available</span>
                {isRtl ? "احجز موعدك" : "Book an appointment"}
              </a>
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-primary font-extrabold px-7 py-3.5 rounded-full ring-1 ring-primary/15 shadow-clinical hover:-translate-y-0.5 transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">support_agent</span>
                {isRtl ? "تواصل معنا" : "Contact us"}
              </Link>
            </div>
          </div>
        </section>

        {/* ── Stats strip ── */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 -mt-2 md:-mt-4">
          <Reveal className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 bg-white rounded-[2rem] shadow-[0_30px_70px_-40px_rgba(0,77,153,0.4)] ring-1 ring-outline-variant/30 p-6 md:p-9">
            {STATS.map((s) => (
              <div key={s.en} className="text-center px-2">
                <div className="font-headline text-3xl md:text-5xl font-extrabold text-primary" dir="ltr">{s.value}</div>
                <div className="mt-1.5 text-[12px] md:text-sm font-bold text-on-surface-variant">{isRtl ? s.ar : s.en}</div>
              </div>
            ))}
          </Reveal>
        </section>

        {/* ── About story + Our centers ── */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-24">
          <div className="grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16 items-start">
            {/* Story */}
            <Reveal>
              {eyebrow("About Us", "عن عيادتي")}
              <h2 className={`mt-5 font-headline text-3xl md:text-4xl font-extrabold text-primary ${isRtl ? "leading-[1.3]" : "tracking-tight leading-[1.1]"} [text-wrap:balance]`}>
                {isRtl ? "رعاية صحية استثنائية، نُقدّمها باهتمام" : "Exceptional healthcare, delivered with care"}
              </h2>
              <div className="mt-6 space-y-5 text-on-surface-variant text-[15px] md:text-base leading-[1.9] [text-wrap:pretty]">
                <p>
                  {isRtl
                    ? "عيادتي تمثل اسماً بارزاً في القطاع الصحي كعيادات خارجية على مستوى المملكة العربية السعودية، تأسست في عام 2017 تحت إشراف مجموعة ناظر، وهي كيان رائد في مجال الرعاية الصحية."
                    : "My Clinic, a prominent name in the realm of multispecialty outpatient care in Saudi Arabia, was established in 2017 under the stewardship of Nazer Group, a leading healthcare industry entity."}
                </p>
                <p>
                  {isRtl
                    ? "منذ نشأتنا، كانت مهمتنا الشاملة هي تحسين حياة الناس من خلال الصحة والرفاهية والسعادة."
                    : "Since our inception, our overarching mission has been to enhance people's lives by promoting longevity, well-being, and happiness."}
                </p>
                <p>
                  {isRtl
                    ? "في عيادتي، نقدم خدمات رعاية صحية استثنائية تشمل أكثر من 24 تخصصاً، يقدمها فريق يضم أكثر من 300 متخصص في الرعاية الصحية مؤهلين تأهيلاً عالياً."
                    : "At My Clinic, we offer outstanding healthcare services in more than 24 specialties, delivered by a team of over 300 highly qualified healthcare professionals."}
                </p>
              </div>
            </Reveal>

            {/* Our centers */}
            <Reveal delay={0.1}>
              <div className="bg-white rounded-[2rem] shadow-clinical ring-1 ring-outline-variant/30 p-6 md:p-8">
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>apartment</span>
                  </span>
                  <div>
                    <h3 className="font-headline text-lg font-extrabold text-on-surface">{isRtl ? "مراكزنا" : "Our centers"}</h3>
                    <p className="text-[13px] text-on-surface-variant">{isRtl ? "جدة والرياض" : "Jeddah & Riyadh"}</p>
                  </div>
                </div>
                <div className="mt-5 space-y-2.5">
                  {CENTERS.map((c) => (
                    <div key={c.en} className="flex items-start gap-3 rounded-2xl bg-surface-container-low p-3.5 ring-1 ring-outline-variant/20">
                      <span className="material-symbols-outlined text-secondary mt-0.5 shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-on-surface text-[15px]">{isRtl ? c.ar : c.en}</span>
                          {c.flag && (
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                              {isRtl ? "رئيسي" : "Flagship"}
                            </span>
                          )}
                        </div>
                        <span className="block text-[13px] text-on-surface-variant mt-0.5">{isRtl ? c.metaAr : c.metaEn}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── What we do ── */}
        <section className="relative overflow-hidden bg-surface-container-low border-y border-outline-variant/30">
          <div className="max-w-4xl mx-auto px-4 md:px-8 py-16 md:py-24 text-center">
            <Reveal>
              {eyebrow("What we do", "ما الذي نفعله")}
              <h2 className={`mt-5 font-headline text-3xl md:text-4xl font-extrabold text-primary ${isRtl ? "leading-[1.3]" : "tracking-tight leading-[1.1]"} [text-wrap:balance]`}>
                {isRtl ? "نعتني برفاهيتك في كل خطوة" : "Caring for your well-being, every step"}
              </h2>
              <p className="mt-6 text-on-surface-variant text-base md:text-lg leading-[1.9] [text-wrap:pretty]">
                {isRtl
                  ? "في عيادتي، نحن ملتزمون بتعزيز رفاهيتك من خلال مجموعة واسعة من خدمات الرعاية الصحية. تمتد خبرتنا من الرعاية الوقائية إلى العلاجات المتخصصة، وكلها مصممة لتلبية احتياجاتك الصحية الفريدة. يلتزم فريقنا من المهنيين الطبيين المهرة بتقديم تشخيصات دقيقة وعلاجات فعالة ورعاية استثنائية. بدءاً من الفحوصات الروتينية وحتى التدخلات المتقدمة، نحن هنا لإرشادك في رحلتك نحو الصحة المثالية."
                  : "At My Clinic, we are dedicated to enhancing your well-being through a wide spectrum of healthcare services. Our expertise spans from preventive care to specialized treatments, all designed to address your unique health needs. Our team of skilled medical professionals is committed to providing accurate diagnoses, effective treatments, and compassionate care. From routine check-ups to advanced interventions, we are here to guide you on your journey to optimal health."}
              </p>
            </Reveal>
            <Reveal delay={0.1} className="mt-8 flex flex-wrap justify-center gap-3">
              {WHAT_WE_DO_CHIPS.map((c) => (
                <span key={c.en} className="inline-flex items-center gap-2 bg-white text-on-surface font-bold text-sm px-4 py-2.5 rounded-full shadow-clinical ring-1 ring-outline-variant/30">
                  <span className="material-symbols-outlined text-primary text-[19px]" style={{ fontVariationSettings: "'FILL' 1" }}>{c.icon}</span>
                  {isRtl ? c.ar : c.en}
                </span>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ── Purpose & Mission ── */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <Reveal className="text-center max-w-2xl mx-auto">
            {eyebrow("Purpose & Mission", "هدفنا ومهمتنا")}
            <h2 className={`mt-5 font-headline text-3xl md:text-4xl font-extrabold text-primary ${isRtl ? "leading-[1.3]" : "tracking-tight leading-[1.1]"} [text-wrap:balance]`}>
              {isRtl ? "ما الذي يقودنا" : "What drives us forward"}
            </h2>
          </Reveal>
          <div className="mt-10 grid md:grid-cols-2 gap-5 md:gap-7">
            {/* Purpose */}
            <Reveal>
              <div className="relative h-full bg-white rounded-[2rem] p-8 md:p-10 shadow-clinical ring-1 ring-outline-variant/30 overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary to-secondary" aria-hidden />
                <span className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>volunteer_activism</span>
                </span>
                <p className="mt-6 text-[12px] font-extrabold text-primary uppercase tracking-widest">{isRtl ? "هدفنا" : "Our Purpose"}</p>
                <p className="mt-2 font-headline text-2xl md:text-[28px] font-extrabold text-on-surface leading-snug [text-wrap:balance]">
                  {isRtl
                    ? "مساعدة الناس على العيش حياة أطول وأكثر صحة وسعادة، وخلق عالم أفضل."
                    : "Helping people live longer, healthier, happier lives and making a better world."}
                </p>
              </div>
            </Reveal>
            {/* Mission */}
            <Reveal delay={0.1}>
              <div className="relative h-full bg-white rounded-[2rem] p-8 md:p-10 shadow-clinical ring-1 ring-outline-variant/30 overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-secondary to-primary" aria-hidden />
                <span className="w-14 h-14 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>public</span>
                </span>
                <p className="mt-6 text-[12px] font-extrabold text-secondary uppercase tracking-widest">{isRtl ? "مهمتنا" : "Our Mission"}</p>
                <p className="mt-2 font-headline text-2xl md:text-[28px] font-extrabold text-on-surface leading-snug [text-wrap:balance]">
                  {isRtl
                    ? "أن نكون شركة الرعاية الصحية الأكثر تركيزاً على العملاء في العالم."
                    : "To be the world's most customer-centric healthcare company."}
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Core values ── */}
        <section className="relative overflow-hidden bg-surface-container-low border-y border-outline-variant/30">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
            <Reveal className="text-center max-w-3xl mx-auto">
              {eyebrow("Our Core Values", "قيمنا الأساسية")}
              <h2 className={`mt-5 font-headline text-3xl md:text-4xl font-extrabold text-primary ${isRtl ? "leading-[1.3]" : "tracking-tight leading-[1.1]"} [text-wrap:balance]`}>
                {isRtl ? "المبادئ التي توجّه كل ما نقوم به" : "The principles that guide everything we do"}
              </h2>
              <p className="mt-5 text-on-surface-variant leading-[1.9] [text-wrap:pretty]">
                {isRtl
                  ? "تعمل قيمنا الأساسية — التعاون والرعاية والطموح والمسؤولية — كمبادئ توجيهية بينما نعمل بجد للمساهمة في عالم أفضل. روحنا التعاونية توحّد ألمع العقول، ورعايتنا العميقة تعزّز التفاؤل، وطموحنا يغذّي حلول الرعاية الصحية المبتكرة، وإحساسنا بالمسؤولية يدفعنا لتقديم خدمات استثنائية ومخصصة لكل حالة."
                  : "Our core values—Collaboration, Care, Ambition, and Responsibility—serve as guiding principles as we work to contribute to a better world. Our collaborative ethos unites the brightest minds, our profound care fosters optimism, our ambition fuels innovative healthcare solutions, and our sense of responsibility anchors us in delivering exceptional and highly personalized care."}
              </p>
            </Reveal>

            <div className="mt-12 grid sm:grid-cols-2 gap-5 md:gap-7">
              {VALUES.map((v, i) => (
                <Reveal key={v.en.title} delay={(i % 2) * 0.08}>
                  <div className="h-full bg-white rounded-[1.75rem] p-7 md:p-8 shadow-clinical ring-1 ring-outline-variant/30 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(0,77,153,0.5)] transition-all">
                    <div className="flex items-center gap-4">
                      <span
                        className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${v.color}1a`, color: v.color }}
                      >
                        <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>{v.icon}</span>
                      </span>
                      <h3 className="font-headline text-xl md:text-2xl font-extrabold text-on-surface">
                        {isRtl ? v.ar.title : v.en.title}
                      </h3>
                    </div>
                    <ul className="mt-5 space-y-3">
                      {(isRtl ? v.ar.points : v.en.points).map((p, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-on-surface-variant text-[15px] leading-relaxed">
                          <span className="material-symbols-outlined text-[19px] mt-0.5 shrink-0" style={{ color: v.color, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Our Services CTA ── */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2.5rem] bg-primary text-white px-6 md:px-14 py-14 md:py-20 shadow-[0_40px_90px_-40px_rgba(0,77,153,0.7)]">
              <div className="absolute -top-20 -right-16 w-80 h-80 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(92,213,248,0.35) 0%, transparent 70%)" }} aria-hidden />
              <div className="absolute -bottom-24 -left-16 w-96 h-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)" }} aria-hidden />
              <div className="relative max-w-3xl">
                <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 text-white font-extrabold backdrop-blur ${isRtl ? "text-[13px]" : "text-[11px] uppercase tracking-[0.15em]"}`}>
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>medical_services</span>
                  {isRtl ? "خدماتنا" : "Our Services"}
                </span>
                <h2 className={`mt-5 font-headline text-3xl md:text-5xl font-extrabold ${isRtl ? "leading-[1.3]" : "tracking-tight leading-[1.05]"} [text-wrap:balance]`}>
                  {isRtl ? "رعاية شاملة مصممة لك وحدك" : "Comprehensive care, tailored to you"}
                </h2>
                <p className="mt-5 text-white/85 text-base md:text-lg leading-[1.9] [text-wrap:pretty]">
                  {isRtl
                    ? "ادخل إلى عالم من الرعاية الشاملة من خلال مجموعتنا المتنوعة من خدمات الرعاية الصحية المتخصصة. في عيادتي، ندرك أن احتياجات كل فرد فريدة من نوعها، ولهذا صُمّمت خدماتنا بدقة لتوفّر لك الاهتمام والعلاج الشخصي. فريق المتخصصين لدينا ملتزم بتقديم رعاية استثنائية، ورفاهيتك هي أولويتنا — لنضمن حصولك على أعلى مستويات الجودة التي تستحقها."
                    : "Step into a world of comprehensive and compassionate care with our diverse range of specialized healthcare services. At My Clinic, we understand that each individual's needs are unique, which is why our services are meticulously tailored to provide you with personalized attention and treatment. Our dedicated team is committed to delivering exceptional care — your well-being is our priority, and we're here to ensure you receive the highest quality of care you deserve."}
                </p>
                <div className="mt-9 flex flex-col sm:flex-row gap-3.5">
                  <a
                    href={BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-white text-primary font-extrabold px-8 py-4 rounded-full shadow-lg hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 transition-all"
                  >
                    <span className="material-symbols-outlined text-[21px]" style={{ fontVariationSettings: "'FILL' 1" }}>event_available</span>
                    {isRtl ? "احجز الآن" : "Book Now"}
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

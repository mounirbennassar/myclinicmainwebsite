"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useLang } from "@/app/i18n/context";
import { trackFormSubmit, trackPhoneClick, trackWhatsAppClick } from "@/app/lib/tracking";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";
import DoctorsCarousel from "@/app/components/DoctorsCarousel";
import type { Doctor } from "@/app/lib/doctors";

/* ── Brand palette ──────────────────────────────────────────────
   Site navy + teal carried from the design tokens, with a rose accent that is
   the signature of the women's-health experience. */
const NAVY = "#0B3D78";
const TEAL = "#0E7C84";
const ROSE = "#E5688E";
const DEEP_BG = "radial-gradient(120% 130% at 80% 0%,#0E5C7A 0%,#0A4078 45%,#082C57 100%)";
const HERO_BG = "linear-gradient(155deg,#FBEAF1 0%,#EDF3FD 46%,#F1FBFA 100%)";

const PHONE_TEL = "920022811";
const PHONE_DISPLAY = "920 022 811";
const WA_TEXT = "مرحباً، أود حجز موعد في قسم طب المرأة والأسرة في عيادتي";
const WHATSAPP_LINK = `https://wa.me/966920022811?text=${encodeURIComponent(WA_TEXT)}`;

/* Branches — same source data as the homepage locations rail. */
const branches = [
  { name: "Al Sahafa", nameAr: "الصحافة", city: "Riyadh", cityAr: "الرياض", image: "/clinic/riyadh.webp", mapUrl: "https://maps.app.goo.gl/5XEWuSVKVzkJNyWt6", isRiyadh: true },
  { name: "Al Mohammadiyah", nameAr: "المحمدية", city: "Jeddah", cityAr: "جدة", image: "/clinic/branch-mohammadiyah-building.webp", mapUrl: "https://www.google.com/maps/place/My+Clinic/@21.6589018,39.1224875,17z/data=!3m1!4b1!4m6!3m5!1s0x15c3d9a3312f53ab:0x9dbc0ed7bf423fab!8m2!3d21.6589018!4d39.1224875!16s%2Fg%2F11dyrcw8t2" },
  { name: "Al Safa", nameAr: "الصفا", city: "Jeddah", cityAr: "جدة", image: "/clinic/safa.webp", mapUrl: "https://maps.app.goo.gl/zWd9vWV6m6Sukb956" },
  { name: "Al Tahlia", nameAr: "التحلية", city: "Jeddah", cityAr: "جدة", image: "/clinic/branch-tahlia-building.webp", mapUrl: "https://maps.app.goo.gl/ST25xhT8Hpe8PZp87", isTahlia: true },
  { name: "Obhour", nameAr: "أبحر", city: "Jeddah", cityAr: "جدة", image: "/clinic/branch-obhour-building.webp", mapUrl: "https://maps.app.goo.gl/vmem2gxxNnHzv4q17" },
];

/* Services — value maps to the note sent with the lead. */
const SERVICES = [
  { icon: "pregnant_woman", accent: ROSE, en: ["Pregnancy & Childbirth", "Complete care before, during and after birth — reassurance for you and your baby at every step."], ar: ["متابعة الحمل والولادة", "رعايةٌ شاملة قبل وأثناء وبعد الولادة، لطمأنينتكِ وسلامة طفلكِ في كل خطوة."] },
  { icon: "child_care", accent: TEAL, en: ["Mother & Baby Care", "Close monitoring of your baby's growth and your health through the first journey of motherhood."], ar: ["رعاية الأم والطفل", "متابعةٌ دقيقة لنمو طفلكِ وصحتكِ في رحلة الأمومة الأولى، بدعمٍ متواصل."] },
  { icon: "health_and_safety", accent: ROSE, en: ["Women's Health & Screening", "Preventive screening programmes tailored to every stage of life for early detection and peace of mind."], ar: ["صحة المرأة والفحوصات الدورية", "برامجُ فحصٍ وقائية مصمّمة لكل مرحلةٍ عمرية، لاكتشافٍ مبكّر واطمئنانٍ دائم."] },
  { icon: "gynecology", accent: TEAL, en: ["Gynecology & Reproductive", "Precise diagnosis and treatment with the latest technology — in complete privacy and understanding."], ar: ["أمراض النساء والصحة الإنجابية", "تشخيصٌ وعلاجٌ دقيق بأحدث التقنيات، بخصوصيةٍ تامّة وعنايةٍ تتفهّم احتياجاتكِ."] },
  { icon: "family_restroom", accent: ROSE, en: ["Family & Primary Care", "One doctor who knows your family's history and cares for every member, from childhood onward."], ar: ["طب الأسرة والرعاية الأولية", "طبيبٌ واحد يعرف تاريخ عائلتكِ ويعتني بكل أفرادها، من الطفولة حتى ما بعدها."] },
  { icon: "spa", accent: TEAL, en: ["Nutrition & Wellbeing", "Integrated support for body and mind at every stage — nutrition plans and specialist counselling."], ar: ["التغذية والصحة النفسية", "دعمٌ متكامل لجسدكِ وعقلكِ في كل مرحلة، ببرامجَ تغذيةٍ واستشاراتٍ نفسية متخصصة."] },
];

const STATS = [
  { to: 15, prefix: "+", suffix: "", color: NAVY, en: "Years of care", ar: "سنة من الخبرة" },
  { to: 22, prefix: "+", suffix: "", color: NAVY, en: "Women's specialists", ar: "طبيبة متخصصة" },
  { to: 18, prefix: "", suffix: "K+", color: ROSE, en: "Patients cared for", ar: "مريضة سعيدة" },
  { to: 98, prefix: "", suffix: "%", color: TEAL, en: "Patient satisfaction", ar: "نسبة رضا المريضات" },
];

const JOURNEY = [
  { en: ["Book your appointment", "In a few simple steps by phone, WhatsApp or online — pick the time that suits you."], ar: ["احجزي موعدكِ", "بخطواتٍ بسيطة عبر الهاتف أو واتساب أو الموقع، اختاري الوقت الأنسب لكِ."] },
  { en: ["Consultation & diagnosis", "A thorough session with your specialist to understand your case and reach a clear diagnosis."], ar: ["الاستشارة والتشخيص", "جلسةٌ دقيقة مع الطبيبة المختصة لفهم حالتكِ ووضع تشخيصٍ واضح."] },
  { en: ["A personalized care plan", "A treatment and follow-up plan designed just for you, explained with full clarity."], ar: ["خطة رعايةٍ متكاملة", "خطةُ علاجٍ ومتابعةٍ مصمّمة خصيصاً لكِ، نشرحها لكِ بكل وضوحٍ وشفافية."] },
  { en: ["Ongoing follow-up", "We stay by your side every step, with regular follow-ups for lasting reassurance."], ar: ["المتابعة المستمرة", "نبقى إلى جانبكِ في كل خطوة، مع متابعةٍ دورية لاطمئنانكِ الدائم."] },
];

const WHY = [
  { icon: "verified", en: ["Specialist expertise", "Deep experience in women's & family medicine."], ar: ["خبرة متخصّصة", "خبراتٌ عالية في طب المرأة والأسرة."] },
  { icon: "lock", en: ["Complete privacy", "An environment designed for your comfort on every visit."], ar: ["خصوصيةٌ تامّة", "بيئةٌ مصمّمة لراحتكِ في كل زيارة."] },
  { icon: "biotech", en: ["Latest technology", "Precise diagnosis with the most advanced medicine offers."], ar: ["أحدث التقنيات", "تشخيصٌ دقيق بأحدث ما توصّل إليه الطب."] },
  { icon: "schedule", en: ["Flexible scheduling", "We respect your time with punctual appointments, no waiting."], ar: ["مواعيد مرنة", "نحترم وقتكِ بمواعيد دقيقة بلا انتظار."] },
  { icon: "medical_services", en: ["Integrated care", "Everything you and your family need under one roof."], ar: ["رعايةٌ متكاملة", "كل ما تحتاجينه أنتِ وأسرتكِ تحت سقفٍ واحد."] },
  { icon: "smartphone", en: ["Digital health record", "Track your results and appointments easily through our app."], ar: ["ملفٌّ صحي رقمي", "تابعي نتائجكِ ومواعيدكِ بسهولةٍ عبر تطبيقنا."] },
];

const TESTIMONIALS = [
  { grad: "linear-gradient(135deg,#F8B7CD,#E5688E)", enName: "Noura Al-Mutairi", arName: "نورة المطيري", enTag: "Pregnancy & birth", arTag: "متابعة حملٍ وولادة", en: "An experience that reassured me through the hardest stage of my pregnancy. My doctor truly listened, and the follow-up was precise at every step until my delivery.", ar: "«تجربةٌ طمأنتني في أصعب مراحل حملي. الطبيبة أصغت لي بصدقٍ حقيقي، وكانت المتابعة دقيقةً في كل خطوة حتى لحظة ولادتي.»" },
  { grad: "linear-gradient(135deg,#7FD0CE,#0E7C84)", enName: "Amal Al-Dosari", arName: "أمل الدوسري", enTag: "Family medicine", arTag: "طب الأسرة", en: "I finally found a place that cares for my health and my family's together. The privacy and professionalism exceeded my expectations — My Clinic is now our first choice.", ar: "«أخيراً وجدتُ مكاناً يعتني بصحتي وصحة عائلتي معاً. الخصوصية والاحترافية فاقت توقعاتي، وأصبحت عيادتي وجهتنا الأولى.»" },
  { grad: "linear-gradient(135deg,#9DBEE6,#0A4C8E)", enName: "Hind Al-Anzi", arName: "هند العنزي", enTag: "Routine screening", arTag: "فحوصاتٌ دورية", en: "From booking to follow-up, everything was easy and comfortable. I felt I was in safe hands. I recommend every woman try the care here.", ar: "«من الحجز حتى المتابعة، كان كل شيءٍ سهلاً ومريحاً. شعرتُ بأنني في أيدٍ أمينة. أنصح كل امرأة بتجربة الرعاية هنا.»" },
];

/* ── Framer-motion scroll reveal (whileInView — robust on these pages, unlike
   GSAP ScrollTrigger which can leave elements stuck at opacity:0 here). ── */
function Reveal({ children, className, delay = 0, y = 26 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.7, ease: [0.16, 0.84, 0.44, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/* ── GSAP count-up, triggered by a framer-motion in-view check. The span always
   renders a real number, so it degrades gracefully if motion is unavailable. ── */
function CountUp({ to, prefix = "", suffix = "", color, className }: { to: number; prefix?: string; suffix?: string; color?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  // Write straight to the DOM in the GSAP onUpdate — no per-frame React
  // re-render (which throttled the tween to a crawl). useGSAP runs in a layout
  // effect, so the reset-to-0 happens before paint and never flashes.
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !inView) return;
      const write = (n: number) => { el.textContent = `${prefix}${Math.round(n).toLocaleString("en-US")}${suffix}`; };
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { write(to); return; }
      const o = { n: 0 };
      write(0);
      gsap.to(o, { n: to, duration: 1.7, ease: "power3.out", onUpdate: () => write(o.n) });
    },
    { dependencies: [inView] }
  );

  return (
    <span ref={ref} className={className} style={color ? { color } : undefined}>
      {prefix}
      {to.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

const ArrowIcon = ({ isRtl, className }: { isRtl: boolean; className?: string }) => (
  <span className={`material-symbols-outlined ${isRtl ? "" : "rotate-180"} ${className ?? ""}`}>arrow_back</span>
);

export default function WomenFamilyMedicine({ doctors }: { doctors: Doctor[] }) {
  const { lang, ready } = useLang();
  const isRtl = lang === "ar";

  /* Hero mouse-parallax on the floating chips (GSAP). */
  const heroRef = useRef<HTMLElement>(null);
  const chipA = useRef<HTMLDivElement>(null);
  const chipB = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const hero = heroRef.current;
      if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const targets = [
        { el: chipA.current, d: 34 },
        { el: chipB.current, d: 26 },
      ].filter((t) => t.el) as { el: HTMLElement; d: number }[];
      const setters = targets.map((t) => ({
        x: gsap.quickTo(t.el, "x", { duration: 0.6, ease: "power3" }),
        y: gsap.quickTo(t.el, "y", { duration: 0.6, ease: "power3" }),
        d: t.d,
      }));
      const onMove = (e: MouseEvent) => {
        const r = hero.getBoundingClientRect();
        const nx = (e.clientX - (r.left + r.width / 2)) / r.width;
        const ny = (e.clientY - (r.top + r.height / 2)) / r.height;
        setters.forEach((s) => { s.x(nx * s.d); s.y(ny * s.d); });
      };
      const onLeave = () => setters.forEach((s) => { s.x(0); s.y(0); });
      hero.addEventListener("mousemove", onMove);
      hero.addEventListener("mouseleave", onLeave);
      return () => { hero.removeEventListener("mousemove", onMove); hero.removeEventListener("mouseleave", onLeave); };
    },
    { scope: heroRef }
  );

  /* Testimonials carousel. */
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setSlide((s) => (s + 1) % TESTIMONIALS.length), 5200);
    return () => clearInterval(t);
  }, [paused]);

  /* Branches rail. */
  const railRef = useRef<HTMLDivElement>(null);
  const scrollRail = (dir: "prev" | "next") => {
    const el = railRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(":scope > a")?.offsetWidth || 340;
    el.scrollBy({ left: (dir === "next" ? 1 : -1) * (isRtl ? -1 : 1) * (card + 24), behavior: "smooth" });
  };

  /* Booking form → /api/appointments (vertical=medical). */
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formCity, setFormCity] = useState("");
  const [formService, setFormService] = useState("");
  const [formDate, setFormDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Capture UTM params on first visit (same as homepage).
  useEffect(() => {
    import("@/app/lib/utm-client").then((m) => m.captureAndTrackUtm()).catch(() => {});
  }, []);

  const handleSubmit = async () => {
    if (!formName || !formPhone || !formCity) {
      setError(isRtl ? "يرجى ملء الاسم والجوال والمدينة" : "Please fill in name, phone and city");
      return;
    }
    if (!/^05\d{8}$/.test(formPhone)) {
      setError(isRtl ? "رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام" : "Phone must start with 05 and be 10 digits");
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
        utm = { source: stored.utm_source, medium: stored.utm_medium, campaign: stored.utm_campaign, term: stored.utm_term, content: stored.utm_content, ref: stored.utm_ref };
      }
      referrer = sessionStorage.getItem("mc_referrer") || undefined;
    } catch { /* ignore */ }

    const svc = SERVICES.find((s) => s.en[0] === formService);
    const noteParts = ["Women & Family Medicine"];
    if (svc) noteParts.push(`Service: ${svc.en[0]}`);
    if (formDate) noteParts.push(`Preferred date: ${formDate}`);

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: formCity, name: formName, phone: formPhone, vertical: "medical", note: noteParts.join(" · "), utm, referrer }),
      });
      if (res.ok) {
        trackFormSubmit();
        setSuccess(true);
        setFormName(""); setFormPhone(""); setFormCity(""); setFormService(""); setFormDate("");
      } else {
        setError(isRtl ? "حدث خطأ، حاول مرة أخرى" : "Something went wrong, please try again");
      }
    } catch {
      setError(isRtl ? "خطأ في الاتصال" : "Network error, please try again");
    }
    setSubmitting(false);
  };

  if (!ready) return <div className="min-h-screen bg-[#F5F9FE]" />;

  const inputCls = "w-full px-4 py-3.5 rounded-2xl border-[1.5px] border-[#E1EAF4] bg-[#F7FAFE] text-[#1C3552] text-[15px] outline-none transition-all focus:border-[#0E7C84] focus:ring-4 focus:ring-[#0E7C84]/15 placeholder:text-[#93A4BB]";
  const labelCls = "block text-[13.5px] font-bold text-[#42556F] mb-2";
  const eyebrow = (text: string, center = false) => (
    <div className={`inline-flex items-center gap-2.5 mb-4 ${center ? "justify-center" : ""}`}>
      <span className="w-6 h-0.5 rounded-full" style={{ background: TEAL }} />
      <span className="text-sm font-extrabold tracking-wide" style={{ color: TEAL }}>{text}</span>
      {center && <span className="w-6 h-0.5 rounded-full" style={{ background: TEAL }} />}
    </div>
  );

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="min-h-screen bg-[#F5F9FE] text-[#17263B] flex flex-col overflow-x-hidden">
      <SiteNav />

      <main className="flex-1">
        {/* ───────────────────────── Hero ───────────────────────── */}
        <section ref={heroRef} id="top" className="relative overflow-hidden" style={{ background: HERO_BG }}>
          {/* drifting blobs */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute -top-[14%] -right-[6%] w-[44vw] h-[44vw] max-w-[600px] max-h-[600px] rounded-full blur-[8px] animate-[ff-drift_22s_ease-in-out_infinite]" style={{ background: "radial-gradient(circle at 35% 35%,#CFE2F7,transparent 70%)" }} />
            <div className="absolute -bottom-[20%] right-[15%] w-[34vw] h-[34vw] max-w-[470px] max-h-[470px] rounded-full blur-[12px] animate-[ff-drift_26s_ease-in-out_infinite_reverse]" style={{ background: "radial-gradient(circle,#F8CFDF,transparent 70%)" }} />
            <div className="absolute top-[20%] -left-[8%] w-[32vw] h-[32vw] max-w-[440px] max-h-[440px] rounded-full blur-[12px] animate-[ff-drift_24s_ease-in-out_infinite]" style={{ background: "radial-gradient(circle,#CFEDEC,transparent 70%)" }} />
            <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(rgba(10,76,142,0.07) 1.4px,transparent 1.4px)", backgroundSize: "30px 30px", WebkitMaskImage: "radial-gradient(ellipse 72% 62% at 60% 34%,#000,transparent 80%)", maskImage: "radial-gradient(ellipse 72% 62% at 60% 34%,#000,transparent 80%)" }} />
          </div>

          <div className="relative z-[2] max-w-7xl mx-auto px-4 md:px-8 pt-10 md:pt-14 pb-20 md:pb-28 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* copy */}
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2.5 bg-white/75 backdrop-blur border border-[#F3D2E0] pl-4 pr-3.5 py-2.5 rounded-full shadow-[0_14px_30px_-18px_rgba(201,72,111,0.45)] mb-6">
                <span className="w-2.5 h-2.5 rounded-full animate-[ff-dot_2.4s_ease-in-out_infinite]" style={{ background: ROSE, boxShadow: "0 0 0 4px rgba(229,104,142,0.18)" }} />
                <span className="text-sm font-bold" style={{ color: NAVY }}>{isRtl ? "رعاية متكاملة للمرأة والأسرة" : "Complete care for women & family"}</span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.06 }}
                className={`font-headline font-extrabold text-[#0B3D78] tracking-tight mb-6 text-4xl md:text-5xl xl:text-[3.6rem] ${isRtl ? "leading-[1.3]" : "leading-[1.08]"}`}>
                {isRtl ? (
                  <>عناية تليق بكِ في{" "}<span className="relative whitespace-nowrap" style={{ color: ROSE }}>كل مرحلة
                    <svg viewBox="0 0 230 24" preserveAspectRatio="none" className="absolute left-0 right-0 -bottom-3 w-full h-[14px]" fill="none"><path d="M4 14C54 5 150 4 226 12" stroke={ROSE} strokeWidth="5" strokeLinecap="round" opacity=".5" /></svg>
                  </span>{" "}من حياتكِ.</>
                ) : (
                  <>Care worthy of you at{" "}<span className="relative whitespace-nowrap" style={{ color: ROSE }}>every stage
                    <svg viewBox="0 0 230 24" preserveAspectRatio="none" className="absolute left-0 right-0 -bottom-3 w-full h-[14px]" fill="none"><path d="M4 14C54 5 150 4 226 12" stroke={ROSE} strokeWidth="5" strokeLinecap="round" opacity=".5" /></svg>
                  </span>{" "}of life.</>
                )}
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.14 }}
                className="text-[#55677E] text-base md:text-[19px] leading-[1.9] max-w-xl mb-8">
                {isRtl
                  ? "من متابعة الحمل والولادة إلى صحة الأسرة، نُقدّم لكِ رعايةً دقيقةً ومتكاملة على أيدي نخبةٍ من المتخصِّصين في صحة المرأة والأسرة — بخصوصيةٍ تامّة وراحةٍ تستحقِّينها."
                  : "From pregnancy and childbirth to whole-family health, we deliver precise, integrated care from specialists devoted to women's & family health — in complete privacy and the comfort you deserve."}
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.22 }}
                className="flex flex-wrap items-center gap-3.5">
                <button onClick={() => document.getElementById("book")?.scrollIntoView({ behavior: "smooth" })}
                  className="inline-flex items-center gap-2.5 text-white font-bold text-[17px] px-7 py-4 rounded-full shadow-[0_22px_44px_-16px_rgba(201,72,111,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-transform cursor-pointer"
                  style={{ background: NAVY }}>
                  {isRtl ? "احجزي موعدكِ الآن" : "Book your appointment"}
                  <ArrowIcon isRtl={isRtl} className="text-[20px]" />
                </button>
                <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" onClick={trackWhatsAppClick}
                  className="inline-flex items-center gap-2.5 bg-white/85 text-[#0B3D78] font-bold text-[17px] px-6 py-4 rounded-full border border-[#E2E9F3] shadow-[0_14px_30px_-18px_rgba(11,61,120,0.3)] hover:-translate-y-0.5 hover:border-[#25D366] transition-all">
                  <svg width="21" height="21" viewBox="0 0 24 24" fill="#25D366"><path d="M12 2a9.9 9.9 0 0 0-8.5 15l-1.3 4.7 4.8-1.3A9.9 9.9 0 1 0 12 2Zm0 18a8.1 8.1 0 0 1-4.1-1.1l-.3-.2-2.8.8.8-2.7-.2-.3A8.1 8.1 0 1 1 12 20Z" /><path d="M8.9 7.3c-.2-.4-.3-.4-.5-.4h-.5c-.2 0-.4 0-.7.3-.2.3-.9.9-.9 2.1s.9 2.5 1 2.6c.1.2 1.7 2.7 4.3 3.7 2.1.8 2.6.7 3 .6.5-.1 1.4-.6 1.6-1.2.2-.6.2-1 .1-1.1l-.5-.3-1.6-.8c-.2-.1-.4-.1-.5.1l-.7.9c-.1.1-.3.1-.5.1-.7-.3-1.4-.6-2.2-1.5-.6-.7-1-1.4-1.1-1.6-.1-.2 0-.4.1-.5l.4-.5.2-.4c0-.1 0-.3-.1-.4l-.7-1.7Z" /></svg>
                  {isRtl ? "تواصلي عبر واتساب" : "Chat on WhatsApp"}
                </a>
              </motion.div>
            </div>

            {/* media */}
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.15 }}
              className="relative flex justify-center">
              <div className="relative w-full max-w-[470px]">
                <div className="relative z-[2] rounded-[28px] overflow-hidden h-[clamp(440px,56vw,560px)] bg-[#EAF1FB] shadow-[0_44px_90px_-44px_rgba(11,61,120,0.4)]">
                  <Image src="/female-family/hero.webp" alt={isRtl ? "طبيبة مع أم وطفلة في العيادة" : "A woman doctor with a mother and daughter"} fill priority quality={80} sizes="(max-width:1024px) 100vw, 470px" className="object-cover" style={{ objectPosition: "50% 30%" }} />
                </div>
                {/* floating chip — top (GSAP parallax wrapper → CSS float inner) */}
                <div ref={chipA} className="absolute top-6 -right-4 md:-right-5 z-[6] will-change-transform">
                  <div className="animate-[ff-float_6s_ease-in-out_infinite] flex items-center gap-2.5 bg-white/95 backdrop-blur text-[#0B3D78] px-4 py-3 rounded-2xl shadow-[0_22px_44px_-18px_rgba(11,61,120,0.45)] font-bold text-sm whitespace-nowrap border border-[#EFE1E9]">
                    <span className="w-2 h-2 rounded-full" style={{ background: ROSE, boxShadow: "0 0 0 4px rgba(229,104,142,0.2)" }} />
                    {isRtl ? "نخبة من الأطباء المتخصصين" : "A team of expert specialists"}
                  </div>
                </div>
                {/* floating chip — bottom */}
                <div ref={chipB} className="absolute -bottom-4 -left-4 md:-left-5 z-[6] will-change-transform">
                  <div className="animate-[ff-float2_7s_ease-in-out_infinite] bg-white rounded-[18px] px-5 py-3.5 shadow-[0_34px_64px_-26px_rgba(11,61,120,0.45)] flex items-center gap-3.5 border border-[#F3E3EA]">
                    <div className="w-12 h-12 rounded-[14px] text-white flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg,#E5688E,#0A4C8E)" }}>
                      <span className="material-symbols-outlined">clinical_notes</span>
                    </div>
                    <div>
                      <div className="text-2xl font-extrabold leading-none" style={{ color: NAVY }}><CountUp to={15} prefix="+" /></div>
                      <div className="text-[12.5px] font-semibold text-[#55677E] mt-1">{isRtl ? "عاماً في رعاية المرأة" : "years caring for women"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ───────────────────────── Stats ───────────────────────── */}
        <section className="relative z-[5] px-4 md:px-8 -mt-14 md:-mt-16">
          <Reveal className="max-w-[1180px] mx-auto bg-white border border-[#EAF1F9] rounded-[28px] shadow-[0_40px_90px_-50px_rgba(11,61,120,0.45)] p-7 md:p-10 grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <div key={i} className={`text-center px-2 ${i > 0 ? "lg:border-s lg:border-[#EAF1F9]" : ""}`}>
                <div className="font-headline text-[clamp(34px,4.4vw,50px)] font-extrabold leading-none">
                  <CountUp to={s.to} prefix={s.prefix} suffix={s.suffix} color={s.color} />
                </div>
                <div className="text-[15px] font-semibold text-[#5C6E85] mt-2">{isRtl ? s.ar : s.en}</div>
              </div>
            ))}
          </Reveal>
        </section>

        {/* ───────────────────────── Services ───────────────────────── */}
        <section id="services" className="max-w-7xl mx-auto px-4 md:px-8 pt-20 md:pt-28 pb-4">
          <Reveal className="max-w-[720px] mx-auto text-center mb-12 md:mb-16">
            {eyebrow(isRtl ? "خدماتنا" : "Our services", true)}
            <h2 className="font-headline text-[clamp(30px,4.2vw,48px)] font-extrabold text-[#0B3D78] leading-[1.18] tracking-tight mb-4">
              {isRtl ? "رعايةٌ شاملة لكل مرحلةٍ من حياتكِ" : "Comprehensive care for every stage of your life"}
            </h2>
            <p className="text-[#5C6E85] text-base md:text-lg leading-[1.9]">
              {isRtl ? "برامجُ طبية متكاملة مصمّمة بعنايةٍ لتلبية احتياجات المرأة والأسرة في مختلف المراحل العمرية." : "Integrated medical programmes carefully designed for the needs of women and families at every age."}
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s, i) => (
              <Reveal key={i} delay={(i % 3) * 0.08}>
                <div className="group h-full bg-white border border-[#EAF1F9] rounded-[26px] overflow-hidden shadow-[0_30px_60px_-40px_rgba(11,61,120,0.32)] hover:-translate-y-2.5 hover:shadow-[0_50px_90px_-40px_rgba(11,61,120,0.5)] transition-all duration-500">
                  <div className="relative h-[150px] overflow-hidden flex items-center justify-center" style={{ background: `linear-gradient(140deg, ${s.accent}14, ${s.accent}05)` }}>
                    <div className="absolute inset-0 opacity-60" style={{ backgroundImage: `radial-gradient(${s.accent}22 1.2px,transparent 1.2px)`, backgroundSize: "18px 18px" }} />
                    <span className="relative w-[70px] h-[70px] rounded-[20px] flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500" style={{ background: `linear-gradient(135deg, ${s.accent}, ${NAVY})` }}>
                      <span className="material-symbols-outlined text-[34px]" style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                    </span>
                  </div>
                  <div className="p-7">
                    <h3 className="text-[21px] font-extrabold text-[#0B3D78] mb-3">{isRtl ? s.ar[0] : s.en[0]}</h3>
                    <p className="text-[15.5px] leading-[1.85] text-[#5C6E85] mb-5">{isRtl ? s.ar[1] : s.en[1]}</p>
                    <button onClick={() => document.getElementById("book")?.scrollIntoView({ behavior: "smooth" })} className="flex items-center justify-between w-full cursor-pointer">
                      <span className="font-bold text-[15px]" style={{ color: s.accent }}>{isRtl ? "احجزي الآن" : "Book now"}</span>
                      <span className="w-10 h-10 rounded-full flex items-center justify-center transition-colors" style={{ background: `${s.accent}18`, color: s.accent }}>
                        <ArrowIcon isRtl={isRtl} className="text-[18px]" />
                      </span>
                    </button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ───────────────────────── Journey ───────────────────────── */}
        <section id="journey" className="relative py-20 md:py-28 mt-16" style={{ background: "linear-gradient(180deg,#FFFFFF,#EEF4FC)" }}>
          <div className="max-w-[1240px] mx-auto px-4 md:px-8">
            <Reveal className="max-w-[720px] mx-auto text-center mb-14 md:mb-20">
              {eyebrow(isRtl ? "رحلتكِ معنا" : "Your journey", true)}
              <h2 className="font-headline text-[clamp(30px,4.2vw,48px)] font-extrabold text-[#0B3D78] leading-[1.18] tracking-tight">
                {isRtl ? "أربع خطواتٍ نحو رعايةٍ تطمئنّين إليها" : "Four steps to care you can trust"}
              </h2>
            </Reveal>

            <div className="relative">
              <div className="hidden lg:block absolute top-[46px] inset-x-[11%] h-0.5 rounded-full" style={{ background: `linear-gradient(${isRtl ? "to left" : "to right"}, ${TEAL}, ${NAVY} 55%, ${ROSE})` }} aria-hidden />
              <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {JOURNEY.map((s, i) => {
                  const last = i === JOURNEY.length - 1;
                  return (
                    <Reveal key={i} delay={i * 0.1} className="text-center px-2">
                      <div className="w-[92px] h-[92px] mx-auto mb-5 rounded-full flex items-center justify-center shadow-[0_24px_50px_-24px_rgba(11,61,120,0.4)]" style={last ? { background: "linear-gradient(135deg,#0A4C8E,#E5688E)" } : { background: "#fff", border: "2px solid #DCEAF7" }}>
                        <span className="text-3xl font-extrabold" style={{ color: last ? "#fff" : "#0A4C8E" }}>{String(i + 1).padStart(2, "0")}</span>
                      </div>
                      <h3 className="text-[19px] font-extrabold text-[#0B3D78] mb-2.5">{isRtl ? s.ar[0] : s.en[0]}</h3>
                      <p className="text-[15px] leading-[1.8] text-[#5C6E85]">{isRtl ? s.ar[1] : s.en[1]}</p>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────────────── Why choose us ───────────────────────── */}
        <section id="why" className="relative overflow-hidden py-20 md:py-28" style={{ background: DEEP_BG }}>
          <div className="absolute -top-[10%] -left-[6%] w-[40vw] h-[40vw] max-w-[520px] max-h-[520px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,#0E7C8455,transparent 70%)" }} aria-hidden />
          <div className="absolute -bottom-[14%] -right-[8%] w-[34vw] h-[34vw] max-w-[460px] max-h-[460px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,#E5688E44,transparent 70%)" }} aria-hidden />

          <div className="relative z-[2] max-w-[1280px] mx-auto px-4 md:px-8 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <Reveal className="relative">
              <div className="relative rounded-[30px] overflow-hidden h-[clamp(380px,46vw,480px)] bg-[#0C355F] shadow-[0_50px_100px_-40px_rgba(0,0,0,0.6)]">
                <Image src="/clinic/lobby.webp" alt={isRtl ? "بيئة عيادتي" : "My Clinic environment"} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,transparent 50%,rgba(8,44,87,0.45))" }} />
              </div>
              <div className="absolute -bottom-6 -right-5 bg-white rounded-[20px] px-6 py-4 shadow-[0_34px_60px_-26px_rgba(0,0,0,0.5)] animate-[ff-float2_7s_ease-in-out_infinite]">
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-extrabold leading-none" style={{ color: TEAL }}><CountUp to={98} suffix="%" /></div>
                  <div className="text-[13px] font-semibold text-[#5C6E85] leading-tight whitespace-pre-line">{isRtl ? "رضا\nالمريضات" : "patient\nsatisfaction"}</div>
                </div>
              </div>
            </Reveal>

            <div>
              <Reveal>
                <div className="inline-flex items-center gap-2.5 mb-4">
                  <span className="w-6 h-0.5 rounded-full" style={{ background: "#5FD0CE" }} />
                  <span className="text-sm font-extrabold tracking-wide" style={{ color: "#7FE0DE" }}>{isRtl ? "لماذا عيادتي؟" : "Why My Clinic?"}</span>
                </div>
                <h2 className="font-headline text-[clamp(28px,3.8vw,44px)] font-extrabold text-white leading-[1.2] tracking-tight mb-4">
                  {isRtl ? "تجربةٌ طبية بمعايير تستحقّينها أنتِ وأسرتكِ" : "A medical experience worthy of you and your family"}
                </h2>
                <p className="text-[16.5px] leading-[1.9] text-[#BCD2E8] max-w-[50ch] mb-9">
                  {isRtl ? "نجمع بين الكفاءة الطبية العالية ولمسةٍ إنسانية صادقة، لنمنحكِ رعايةً تشعرين معها بالثقة والاطمئنان." : "We combine high clinical excellence with a genuine human touch, giving you care that feels confident and reassuring."}
                </p>
              </Reveal>

              <div className="grid sm:grid-cols-2 gap-x-7 gap-y-6">
                {WHY.map((w, i) => (
                  <Reveal key={i} delay={(i % 2) * 0.08} className="flex gap-3.5 items-start">
                    <div className="w-[46px] h-[46px] rounded-[13px] flex items-center justify-center shrink-0" style={{ background: "rgba(127,224,222,0.14)", border: "1px solid rgba(127,224,222,0.3)", color: "#7FE0DE" }}>
                      <span className="material-symbols-outlined text-[22px]">{w.icon}</span>
                    </div>
                    <div>
                      <h4 className="text-[16.5px] font-extrabold text-white mb-1">{isRtl ? w.ar[0] : w.en[0]}</h4>
                      <p className="text-sm leading-[1.7] text-[#A7C0DC]">{isRtl ? w.ar[1] : w.en[1]}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────────────── Doctors (real, from DB) ───────────────────────── */}
        <div id="doctors" className="bg-[#F5F9FE]">
          <DoctorsCarousel
            initialDoctors={doctors}
            eyebrowEn="Our medical team"
            eyebrowAr="فريقنا الطبي"
            headingEn="Meet our women's & family specialists"
            headingAr="أطباء طب المرأة والأسرة"
          />
        </div>

        {/* ───────────────────────── Branches ───────────────────────── */}
        <section className="py-16 md:py-24 overflow-x-clip" style={{ background: "linear-gradient(180deg,#EEF4FC,#FFFFFF)" }}>
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex items-end justify-between gap-4 mb-10 md:mb-14">
              <Reveal>
                {eyebrow(isRtl ? "فروعنا" : "Our branches")}
                <h2 className="font-headline text-[clamp(28px,3.8vw,44px)] font-extrabold text-[#0B3D78] leading-[1.18] tracking-tight">
                  {isRtl ? "قريبون منكِ في جدة والرياض" : "Close to you in Jeddah & Riyadh"}
                </h2>
              </Reveal>
              <div className="hidden md:flex gap-3 shrink-0 pb-1">
                <button onClick={() => scrollRail("prev")} aria-label={isRtl ? "السابق" : "Previous"} className="w-11 h-11 bg-white rounded-full shadow-md flex items-center justify-center text-[#0A4C8E] hover:bg-[#0A4C8E] hover:text-white transition-all hover:scale-110 cursor-pointer border border-[#E2ECF7]">
                  <span className="material-symbols-outlined">{isRtl ? "chevron_right" : "chevron_left"}</span>
                </button>
                <button onClick={() => scrollRail("next")} aria-label={isRtl ? "التالي" : "Next"} className="w-11 h-11 bg-white rounded-full shadow-md flex items-center justify-center text-[#0A4C8E] hover:bg-[#0A4C8E] hover:text-white transition-all hover:scale-110 cursor-pointer border border-[#E2ECF7]">
                  <span className="material-symbols-outlined">{isRtl ? "chevron_left" : "chevron_right"}</span>
                </button>
              </div>
            </div>

            <div ref={railRef} className="flex overflow-x-scroll snap-x snap-mandatory gap-6 pb-6 hide-scrollbar" style={{ scrollBehavior: "smooth" }}>
              {branches.map((b, i) => (
                <a key={i} href={b.mapUrl} target="_blank" rel="noopener noreferrer" className="w-[320px] sm:w-[360px] snap-start shrink-0 bg-white rounded-[24px] overflow-hidden shadow-[0_30px_60px_-42px_rgba(11,61,120,0.4)] border border-[#EAF1F9] group block">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image src={b.image} alt={`My Clinic ${b.name}`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="360px" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <span className="absolute bottom-4 left-4 bg-white text-[#0A4C8E] px-3 py-1 rounded-full text-xs font-bold">{isRtl ? b.cityAr : b.city}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-headline font-extrabold text-[#0B3D78] mb-2">{isRtl ? `${b.nameAr}، ${b.cityAr}` : `${b.name}, ${b.city}`}</h3>
                    <div className="space-y-2 text-[#5C6E85]">
                      <div className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-[#0E7C84] text-base mt-0.5">schedule</span>
                        <div className="text-xs space-y-1">
                          {b.isTahlia ? (
                            <>
                              <p className="font-medium">{isRtl ? "السبت – الخميس: 1:00 م – 9:00 م" : "Sat – Thu: 1:00 PM – 9:00 PM"}</p>
                              <p className="font-bold text-error">{isRtl ? "الجمعة: مغلق" : "Friday: Closed"}</p>
                            </>
                          ) : b.isRiyadh ? (
                            <>
                              <p className="font-medium">{isRtl ? "الأحد – الخميس: 9:00 ص – 9:00 م" : "Sun – Thu: 9:00 AM – 9:00 PM"}</p>
                              <p className="font-bold text-error">{isRtl ? "الجمعة: مغلق" : "Friday: Closed"}</p>
                            </>
                          ) : (
                            <>
                              <p className="font-medium">{isRtl ? "الأحد – الخميس: 9:00 ص – 9:00 م" : "Sun – Thu: 9:00 AM – 9:00 PM"}</p>
                              <p className="font-medium">{isRtl ? "الجمعة: 5:00 م – 9:00 م" : "Friday: 5:00 PM – 9:00 PM"}</p>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#0E7C84] text-base">call</span>
                        <span className="text-xs font-bold text-[#0A4C8E]" dir="ltr">920 022 811</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#0E7C84] text-base">location_on</span>
                        <span className="text-xs font-bold" style={{ color: ROSE }}>{isRtl ? "عرض على الخريطة" : "View on map"}</span>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────────────────── Testimonials ───────────────────────── */}
        <section id="reviews" className="py-20 md:py-28" style={{ background: "linear-gradient(180deg,#EEF4FC,#FFFFFF)" }}>
          <div className="max-w-[920px] mx-auto px-4 md:px-8 text-center">
            <Reveal>
              {eyebrow(isRtl ? "آراء المريضات" : "Patient stories", true)}
              <h2 className="font-headline text-[clamp(30px,4.2vw,48px)] font-extrabold text-[#0B3D78] leading-[1.18] tracking-tight mb-12">
                {isRtl ? "ثقةٌ تتجدّد مع كل زيارة" : "Trust renewed with every visit"}
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="relative bg-white border border-[#E7F0F9] rounded-[30px] shadow-[0_44px_90px_-50px_rgba(11,61,120,0.45)] p-9 md:p-14 min-h-[290px]"
                onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
                {TESTIMONIALS.map((tst, i) => (
                  <motion.div key={i} className={i === slide ? "" : "absolute inset-9 md:inset-14 pointer-events-none"}
                    initial={false} animate={{ opacity: i === slide ? 1 : 0, y: i === slide ? 0 : 14 }} transition={{ duration: 0.6, ease: "easeInOut" }}
                    aria-hidden={i !== slide}>
                    <div className="flex justify-center gap-1 mb-5" style={{ color: "#F5B53D" }}>
                      {[0, 1, 2, 3, 4].map((k) => <span key={k} className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>)}
                    </div>
                    <p className="text-[clamp(18px,2.1vw,24px)] leading-[1.75] font-medium text-[#1C3552] mb-7">{isRtl ? tst.ar : tst.en}</p>
                    <div className="flex items-center justify-center gap-3.5">
                      <div className="w-[52px] h-[52px] rounded-full" style={{ background: tst.grad }} />
                      <div className={isRtl ? "text-right" : "text-left"}>
                        <div className="font-extrabold text-[#0B3D78] text-base">{isRtl ? tst.arName : tst.enName}</div>
                        <div className="text-[13.5px] text-[#7587A0]">{isRtl ? tst.arTag : tst.enTag}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                <button onClick={() => { setSlide((s) => (s - 1 + TESTIMONIALS.length) % TESTIMONIALS.length); }} aria-label={isRtl ? "السابق" : "Previous"} className="absolute top-1/2 right-3.5 -translate-y-1/2 w-11 h-11 rounded-full bg-white border border-[#E2ECF7] shadow-md flex items-center justify-center text-[#0A4C8E] hover:bg-[#0A4C8E] hover:text-white transition-colors cursor-pointer">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
                <button onClick={() => { setSlide((s) => (s + 1) % TESTIMONIALS.length); }} aria-label={isRtl ? "التالي" : "Next"} className="absolute top-1/2 left-3.5 -translate-y-1/2 w-11 h-11 rounded-full bg-white border border-[#E2ECF7] shadow-md flex items-center justify-center text-[#0A4C8E] hover:bg-[#0A4C8E] hover:text-white transition-colors cursor-pointer">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
              </div>
            </Reveal>

            <div className="flex justify-center gap-2.5 mt-6">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setSlide(i)} aria-label={`${isRtl ? "شهادة" : "Testimonial"} ${i + 1}`} className="h-2.5 rounded-full transition-all cursor-pointer" style={{ width: i === slide ? 28 : 10, background: i === slide ? NAVY : "#C4D6EC" }} />
              ))}
            </div>
          </div>
        </section>

        {/* ───────────────────────── Booking + contact ───────────────────────── */}
        <section id="book" className="relative overflow-hidden py-20 md:py-28" style={{ background: DEEP_BG }}>
          <div className="absolute -top-[12%] -right-[8%] w-[38vw] h-[38vw] max-w-[500px] max-h-[500px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,#E5688E40,transparent 70%)" }} aria-hidden />
          <div className="relative z-[2] max-w-[1240px] mx-auto px-4 md:px-8 grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            {/* info */}
            <div>
              <Reveal>
                <div className="inline-flex items-center gap-2.5 mb-4">
                  <span className="w-6 h-0.5 rounded-full" style={{ background: "#5FD0CE" }} />
                  <span className="text-sm font-extrabold tracking-wide" style={{ color: "#7FE0DE" }}>{isRtl ? "احجزي موعدكِ" : "Book your visit"}</span>
                </div>
                <h2 className="font-headline text-[clamp(30px,4vw,46px)] font-extrabold text-white leading-[1.18] tracking-tight mb-4">
                  {isRtl ? "نسعدُ بالعناية بكِ" : "We'd be delighted to care for you"}
                </h2>
                <p className="text-[16.5px] leading-[1.9] text-[#BCD2E8] max-w-[46ch] mb-8">
                  {isRtl ? "احجزي موعدكِ في دقائق، وسيتواصل معكِ فريقنا لتأكيد الموعد واختيار الطبيب المناسب لحالتكِ." : "Book in minutes and our team will call you to confirm the time and match you with the right specialist for your needs."}
                </p>
              </Reveal>

              <Reveal delay={0.1} className="flex flex-col gap-4 mb-8">
                {[
                  { icon: "schedule", t: isRtl ? "ساعات العمل" : "Working hours", d: isRtl ? "السبت – الخميس · 9 ص – 9 م" : "Sat – Thu · 9 AM – 9 PM" },
                  { icon: "location_on", t: isRtl ? "الفروع" : "Branches", d: isRtl ? "6 فروع في جدة والرياض" : "6 branches in Jeddah & Riyadh" },
                  { icon: "call", t: PHONE_DISPLAY, d: isRtl ? "اتصلي أو تواصلي عبر واتساب" : "Call or reach us on WhatsApp", ltr: true },
                ].map((c, i) => (
                  <div key={i} className="flex items-center gap-3.5">
                    <div className="w-[46px] h-[46px] rounded-[13px] flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.1)", color: "#7FE0DE" }}>
                      <span className="material-symbols-outlined text-[21px]">{c.icon}</span>
                    </div>
                    <div>
                      <div className={`text-white font-bold text-[15.5px] ${c.ltr && isRtl ? "text-right" : ""}`} dir={c.ltr ? "ltr" : undefined}>{c.t}</div>
                      <div className="text-[#A7C0DC] text-sm">{c.d}</div>
                    </div>
                  </div>
                ))}
              </Reveal>

              <Reveal delay={0.16} className="flex flex-wrap gap-3">
                <a href={`tel:${PHONE_TEL}`} onClick={trackPhoneClick} dir="ltr" className="inline-flex items-center gap-2 bg-white/10 text-white font-bold px-6 py-3.5 rounded-full ring-1 ring-white/25 backdrop-blur hover:bg-white/20 transition-all">
                  <span className="material-symbols-outlined text-[20px]">call</span>{PHONE_DISPLAY}
                </a>
                <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" onClick={trackWhatsAppClick} className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3.5 rounded-full shadow-[0_16px_34px_-14px_rgba(37,211,102,0.8)] hover:-translate-y-0.5 transition-all">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a9.9 9.9 0 0 0-8.5 15l-1.3 4.7 4.8-1.3A9.9 9.9 0 1 0 12 2Zm3.6 13.6c-.2.6-1.1 1.1-1.6 1.2-.4.1-.9.2-3-.6-2.6-1-4.2-3.5-4.3-3.7-.1-.2-1-1.4-1-2.6s.7-1.8.9-2.1c.2-.3.4-.3.7-.3h.5c.2 0 .4 0 .6.4l.7 1.7c.1.1.1.3 0 .4l-.2.4-.4.5c-.1.1-.2.3-.1.5.1.2.5.9 1.1 1.6.8.9 1.5 1.2 2.2 1.5.2.1.4.1.5-.1l.7-.9c.1-.2.3-.2.5-.1l1.6.8.5.3c.1.1.1.5-.1 1.1Z" /></svg>
                  {isRtl ? "واتساب" : "WhatsApp"}
                </a>
              </Reveal>
            </div>

            {/* form */}
            <Reveal delay={0.12}>
              <div id="booking-form" className="bg-white rounded-[28px] p-7 md:p-10 shadow-[0_50px_100px_-44px_rgba(0,0,0,0.55)] scroll-mt-24">
                {success ? (
                  <div className="text-center py-10">
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h3 className="text-2xl font-extrabold text-[#0B3D78] mb-2">{isRtl ? "تم استلام طلبكِ ✓" : "Request received ✓"}</h3>
                    <p className="text-[#5C6E85] font-medium mb-6">{isRtl ? "سنتواصل معكِ خلال ساعاتٍ لتأكيد موعدكِ 💙" : "We'll contact you within hours to confirm your appointment 💙"}</p>
                    <button onClick={() => setSuccess(false)} className="font-bold hover:underline cursor-pointer" style={{ color: TEAL }}>{isRtl ? "إرسال طلب آخر" : "Submit another request"}</button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-[23px] font-extrabold text-[#0B3D78] mb-1.5">{isRtl ? "نموذج الحجز" : "Booking form"}</h3>
                    <p className="text-[14.5px] text-[#7587A0] mb-6">{isRtl ? "املئي بياناتكِ وسنتواصل معكِ في أقرب وقت." : "Fill in your details and we'll get back to you shortly."}</p>
                    <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                      {error && <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl font-medium">{error}</div>}
                      <div>
                        <label className={labelCls}>{isRtl ? "الاسم الكامل" : "Full name"}</label>
                        <input type="text" className={inputCls} placeholder={isRtl ? "اكتبي اسمكِ" : "Your name"} value={formName} onChange={(e) => setFormName(e.target.value)} required />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelCls}>{isRtl ? "رقم الجوال" : "Phone number"}</label>
                          <input type="tel" dir="ltr" maxLength={10} className={`${inputCls} text-right`} placeholder="05XXXXXXXX" value={formPhone} onChange={(e) => setFormPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} required />
                        </div>
                        <div>
                          <label className={labelCls}>{isRtl ? "المدينة" : "City"}</label>
                          <select className={inputCls} value={formCity} onChange={(e) => setFormCity(e.target.value)} required>
                            <option value="" disabled>{isRtl ? "اختاري المدينة" : "Select city"}</option>
                            <option value="Riyadh">{isRtl ? "الرياض" : "Riyadh"}</option>
                            <option value="Jeddah">{isRtl ? "جدة" : "Jeddah"}</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className={labelCls}>{isRtl ? "الخدمة المطلوبة" : "Service needed"}</label>
                        <select className={inputCls} value={formService} onChange={(e) => setFormService(e.target.value)}>
                          <option value="">{isRtl ? "اختاري الخدمة (اختياري)" : "Choose a service (optional)"}</option>
                          {SERVICES.map((s) => <option key={s.en[0]} value={s.en[0]}>{isRtl ? s.ar[0] : s.en[0]}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>{isRtl ? "التاريخ المفضّل" : "Preferred date"}</label>
                        <input type="date" className={inputCls} value={formDate} onChange={(e) => setFormDate(e.target.value)} />
                      </div>
                      <button type="submit" disabled={submitting} className="mt-1.5 w-full text-white font-bold text-[16.5px] py-4 rounded-2xl shadow-[0_20px_40px_-16px_rgba(10,76,142,0.7)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed" style={{ background: NAVY }}>
                        {submitting ? (isRtl ? "جارٍ الإرسال..." : "Submitting...") : (isRtl ? "تأكيد الحجز" : "Confirm booking")}
                      </button>
                      <p className="text-center text-xs text-[#7587A0]">{isRtl ? "بياناتكِ سرية ولن تُستخدم إلا لتأكيد موعدكِ." : "Your details are confidential and used only to confirm your appointment."}</p>
                    </form>
                  </>
                )}
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />

      {/* Floating buttons */}
      <div className={`fixed bottom-6 ${isRtl ? "left-6" : "right-6"} z-50 flex flex-col gap-3.5`}>
        <a href={WHATSAPP_LINK} onClick={trackWhatsAppClick} target="_blank" rel="noopener noreferrer" aria-label={isRtl ? "واتساب" : "WhatsApp"} className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_18px_36px_-12px_rgba(37,211,102,0.7)] animate-[ff-pulse_2.6s_infinite] hover:scale-110 transition-transform">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a9.9 9.9 0 0 0-8.5 15l-1.3 4.7 4.8-1.3A9.9 9.9 0 1 0 12 2Zm3.6 13.6c-.2.6-1.1 1.1-1.6 1.2-.4.1-.9.2-3-.6-2.6-1-4.2-3.5-4.3-3.7-.1-.2-1-1.4-1-2.6s.7-1.8.9-2.1c.2-.3.4-.3.7-.3h.5c.2 0 .4 0 .6.4l.7 1.7c.1.1.1.3 0 .4l-.2.4-.4.5c-.1.1-.2.3-.1.5.1.2.5.9 1.1 1.6.8.9 1.5 1.2 2.2 1.5.2.1.4.1.5-.1l.7-.9c.1-.2.3-.2.5-.1l1.6.8.5.3c.1.1.1.5-.1 1.1Z" /></svg>
        </a>
        <a href={`tel:${PHONE_TEL}`} onClick={trackPhoneClick} aria-label={isRtl ? "اتصال" : "Call"} className="w-14 h-14 rounded-full text-white flex items-center justify-center shadow-[0_18px_36px_-12px_rgba(10,76,142,0.7)] hover:scale-110 transition-transform" style={{ background: NAVY }}>
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>call</span>
        </a>
      </div>
    </div>
  );
}

"use client";

import { type ReactNode } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLang } from "@/app/i18n/context";
import { trackPhoneClick, trackWhatsAppClick } from "@/app/lib/tracking";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";
import { WhatsAppIcon } from "@/app/components/icons";

const PHONE_TEL = "920022811";
const PHONE_DISPLAY = "920 022 811";
const WA_NUMBER = "966567729095";
const waUrl = (isRtl: boolean, msg?: string) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    msg ??
      (isRtl
        ? "مرحباً، أرغب في حجز موعد عبر تيلي هوم من عيادتي."
        : "Hello, I'd like to book a consultation with My Clinic Telehome (home & virtual care).")
  )}`;

/* Brand journey palette — virtual phase reads aqua/teal, at-home phase reads navy.
   This carries the "from your screen to your front door" story through the page. */
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

/* What you get — the full Telehome offering at a glance */
type Offering = { phase: "virtual" | "home"; icon: string; en: string; ar: string };
const OFFERINGS: Offering[] = [
  { phase: "virtual", icon: "video_call", en: "Teleconsultation", ar: "استشارة طبية عن بُعد" },
  { phase: "home", icon: "science", en: "Lab Extraction", ar: "تحاليل منزلية" },
  { phase: "home", icon: "medication", en: "Medication delivery", ar: "توصيل الأدوية" },
  { phase: "home", icon: "vaccines", en: "Nurse", ar: "تمريض منزلي" },
  { phase: "home", icon: "physical_therapy", en: "Physiotherapy", ar: "علاج طبيعي منزلي" },
  { phase: "home", icon: "stethoscope", en: "Doctor", ar: "زيارة طبيب للمنزل" },
];

/* The journey — from your screen to your front door */
const JOURNEY: { phase: "virtual" | "home"; icon: string; en: [string, string]; ar: [string, string] }[] = [
  { phase: "virtual", icon: "calendar_month", en: ["Book your slot", "Request a virtual visit by phone, WhatsApp or our app and pick a time that suits you."], ar: ["احجز موعد الاستشارة", "تواصل معنا عبر التطبيق أو واتساب أو الهاتف، واختر الموعد الأنسب لك."] },
  { phase: "virtual", icon: "payments", en: ["Pay & check in via the app", "Complete the payment and check-in process to be ready for the consultation."], ar: ["أكمل الإجراءات عبر التطبيق", "أتمم الدفع وسجّل حضورك قبل موعد الاستشارة."] },
  { phase: "virtual", icon: "video_call", en: ["Talk to a doctor", "A teleconsultation, from the comfort of your home."], ar: ["قابل طبيبك عبر الفيديو", "تحدّث مع الطبيب بخصوصية وأنت في منزلك."] },
  { phase: "virtual", icon: "clinical_notes", en: ["Get your care plan", "Tests, meds, nursing or a doctor visit — added to your plan."], ar: ["تعرّف على الخطوة التالية", "بعد تقييم حالتك، يحدّد الطبيب ما تحتاجه من فحوصات أو أدوية أو رعاية منزلية."] },
  { phase: "home", icon: "pin_drop", en: ["Share where & when", "Your National Address and a time that suits you."], ar: ["أرسل لنا العنوان والموعد", "زوّدنا بعنوانك الوطني واختر الوقت الأنسب للزيارة."] },
  { phase: "home", icon: "mark_chat_read", en: ["We confirm", "We assign your dedicated team and send an SMS to confirm."], ar: ["نؤكّد لك الزيارة", "ننسّق مع الفريق المختص، ثم تصلك رسالة بتأكيد الموعد."] },
  { phase: "home", icon: "home_health", en: ["Care comes to you", "Nurses, specialists and medication, straight to your door."], ar: ["يصلك فريق الرعاية", "يأتيك الطبيب أو الممرّض أو الأخصائي، وتُوصّل أدويتك عند الحاجة."] },
  { phase: "home", icon: "smartphone", en: ["Results in your app", "Notes and next steps, at your fingertips."], ar: ["تابع رعايتك عبر التطبيق", "تجد النتائج والتوصيات وخطوات المتابعة في تطبيق عيادتي."] },
];

/* Section labels for each service card */
const BLOCK = {
  what: { en: "What it is", ar: "نبذة عن الخدمة" },
  how: { en: "How we deliver it", ar: "كيف تتم؟" },
  expect: { en: "What to expect", ar: "ماذا ستحصل عليه؟" },
};

type Service = {
  phase: "virtual" | "home";
  icon: string;
  en: { title: string; what: string; how: string; expect: string };
  ar: { title: string; what: string; how: string; expect: string };
};

const SERVICES: Service[] = [
  {
    phase: "virtual",
    icon: "video_call",
    en: {
      title: "Teleconsultation",
      what: "A scheduled video consultation with the very same consultants who see patients in our Jeddah & Riyadh clinics — your starting point for almost everything else. The doctor listens, assesses, and agrees a plan with you.",
      how: "Book your session through our app, then meet your doctor by video. Prescriptions and onward requests are issued straight from the consultation.",
      expect: "The same standard of care as an in-clinic visit. You leave with a clear plan and, if needed, a prescription or onward request.",
    },
    ar: {
      title: "استشارة طبية عن بُعد",
      what: "موعد مرئي مع أحد استشاريي عيادتي في جدة أو الرياض. يستمع الطبيب إلى شكواك، ويقيّم حالتك، ويضع معك خطة الرعاية المناسبة.",
      how: "احجز من تطبيق عيادتي، ثم انضم إلى الموعد عبر مكالمة فيديو آمنة. بعد الاستشارة، تصلك الوصفة الطبية وطلبات الفحوصات أو الخدمات اللازمة عبر التطبيق.",
      expect: "تحصل على عناية تضاهي الزيارة الحضورية، مع خطة واضحة لما بعد الاستشارة، ووصفة طبية أو طلب خدمة عند الحاجة.",
    },
  },
  {
    phase: "home",
    icon: "science",
    en: {
      title: "Home Lab & Sample Collection",
      what: "Laboratory sample collection, done at your home.",
      how: "After your consultation, a trained phlebotomist visits at your chosen time to collect your samples.",
      expect: "A short, professional visit, with samples handled to standard. Your results then come to you on our app.",
    },
    ar: {
      title: "التحاليل وسحب العينات في المنزل",
      what: "نسحب العينات المطلوبة في منزلك، من دون الحاجة إلى زيارة المختبر.",
      how: "بعد تحديد الفحوصات، يزورك أخصائي سحب عينات مدرّب في الموعد الذي تختاره.",
      expect: "زيارة مريحة وسريعة، مع حفظ العينات ونقلها وفق المعايير المعتمدة. تظهر النتائج لاحقاً في تطبيق عيادتي.",
    },
  },
  {
    phase: "home",
    icon: "medication",
    en: {
      title: "Medication Delivery",
      what: "Prescribed medication brought to your door, straight from your consultation — no pharmacy queue.",
      how: "Your prescription is prepared and delivered to the address and time you choose — in a vehicle equipped to all required specifications, keeping your medication safe and in the best condition.",
      expect: "Correctly dispensed medication with clear instructions. If an item is unavailable, we provide an approved alternative with the same active ingredient, in line with Ministry of Health requirements.",
    },
    ar: {
      title: "توصيل الأدوية إلى المنزل",
      what: "نوصّل لك الأدوية التي وصفها الطبيب إلى منزلك، لتوفّر عليك زيارة الصيدلية والانتظار.",
      how: "نجهّز وصفتك ونوصلها إلى العنوان وفي الموعد اللذين تختارهما، باستخدام مركبة مستوفية لاشتراطات نقل الأدوية وحفظها.",
      expect: "تستلم أدويتك المصروفة وفق الوصفة مع إرشادات الاستخدام. وإذا لم يتوفّر أحد الأصناف، نوفّر بديلاً معتمداً بالمادة الفعّالة نفسها، وفق اشتراطات وزارة الصحة.",
    },
  },
  {
    phase: "home",
    icon: "vaccines",
    en: {
      title: "Home Nursing",
      what: "A nurse comes to you to carry out the services you need, at home — in complete comfort and under our care.",
      how: "A licensed nurse follows your plan: vital signs monitoring, lab sample collection, vaccinations, injections, IV fluids, wound dressing, ECG, and catheter change.",
      expect: "Skilled, attentive care in your own home, fully documented and shared with your doctor.",
    },
    ar: {
      title: "التمريض المنزلي",
      what: "خدمات تمريضية يقدّمها لك ممرّض مرخّص في منزلك، بكل عناية وخصوصية.",
      how: "يطبّق الممرّض خطة الرعاية التي أقرّها الطبيب، وتشمل بحسب احتياجك: قياس العلامات الحيوية، سحب العينات، التطعيمات، الحقن، المحاليل الوريدية، العناية بالجروح، تخطيط القلب، وتغيير القسطرة.",
      expect: "رعاية آمنة ومنظّمة في منزلك، مع توثيق تفاصيل الزيارة وإطلاع طبيبك عليها.",
    },
  },
  {
    phase: "home",
    icon: "physical_therapy",
    en: {
      title: "Home Physiotherapy",
      what: "One-to-one physiotherapy from a therapist in your home — for anyone with mobility challenges, a chronic condition, or post-surgical recovery.",
      how: "We follow the plan your doctor has set for you, working through it together across visits so you steadily improve.",
      expect: "A tailored plan, hands-on sessions at home, and progress tracked visit by visit.",
    },
    ar: {
      title: "العلاج الطبيعي المنزلي",
      what: "جلسات علاج طبيعي فردية في منزلك، مناسبة لصعوبات الحركة والحالات المزمنة وبرامج التعافي بعد العمليات.",
      how: "يتابع الأخصائي الخطة العلاجية التي وضعها طبيبك، ويكيّف التمارين والجلسات مع تطوّر حالتك.",
      expect: "جلسات عملية تناسب احتياجك، مع متابعة التحسّن وتوثيق التقدّم في كل زيارة.",
    },
  },
  {
    phase: "home",
    icon: "stethoscope",
    en: {
      title: "Home Doctor Visit",
      what: "A licensed doctor visits for a full assessment and treatment plan.",
      how: "Choose the specialty you need. The doctor examines you, builds a plan based on your needs, and arranges any follow-up.",
      expect: "A thorough assessment, and a clear treatment and follow-up plan.",
    },
    ar: {
      title: "زيارة الطبيب في المنزل",
      what: "زيارة منزلية يجري خلالها طبيب مرخّص تقييماً شاملاً لحالتك ويضع الخطة العلاجية المناسبة.",
      how: "اختر التخصص المناسب لحالتك. يفحصك الطبيب في المنزل، ويحدّد العلاج والخطوات التالية، ويرتّب المتابعة عند الحاجة.",
      expect: "تقييم طبي متكامل، وخطة واضحة للعلاج والمتابعة.",
    },
  },
];

/* The two details that matter most */
const DETAILS: { icon: string; en: [string, string]; ar: [string, string] }[] = [
  { icon: "pin_drop", en: ["Your National Address", "So your team arrives at the right place, first time."], ar: ["عنوانك الوطني", "حتى يصل فريق الرعاية إلى منزلك بسهولة وفي الموعد المحدّد."] },
  { icon: "schedule", en: ["Your preferred time", "Choose the slot that fits — we build the visit around you."], ar: ["الموعد الأنسب لك", "اختر وقت الزيارة بما يتناسب مع جدولك."] },
];

export default function HealthHomecarePage() {
  const { lang } = useLang();
  const isRtl = lang === "ar";
  const WA = waUrl(isRtl);

  const phaseLabel = (p: "virtual" | "home") =>
    p === "virtual" ? (isRtl ? "عن بُعد" : "Virtual") : isRtl ? "في المنزل" : "At home";

  /* Telehome overview bento (mirrors the app card): two stats on the top corners,
     the video consultation filled in the center, the home services staggered
     around it. The middle column is nudged down for the honeycomb offset. */
  const bySvc = (en: string) => OFFERINGS.find((o) => o.en === en)!;
  const serviceTile = (o: Offering, filled = false, offset = false) => {
    const accent = o.phase === "virtual" ? TEAL : NAVY;
    return (
      <div className={`flex flex-col items-center text-center gap-2 sm:gap-2.5 ${offset ? "mt-5 sm:mt-10" : ""}`}>
        <span
          className="w-14 h-14 sm:w-[68px] sm:h-[68px] rounded-[18px] flex items-center justify-center shadow-[0_10px_24px_-14px_rgba(0,77,153,0.5)]"
          style={filled ? { background: `linear-gradient(135deg, ${TEAL}, ${NAVY})`, color: "#fff" } : { backgroundColor: `${accent}14`, color: accent }}
        >
          <span className="material-symbols-outlined text-[26px] sm:text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>{o.icon}</span>
        </span>
        <span className="text-[12px] sm:text-[15px] font-extrabold text-on-surface leading-tight">{isRtl ? o.ar : o.en}</span>
        <span className="text-[10.5px] sm:text-[12px] font-extrabold" style={{ color: accent }}>{phaseLabel(o.phase)}</span>
      </div>
    );
  };
  const statTile = (num: string, label: string) => (
    <div className="flex flex-col items-center text-center gap-1">
      <span className="font-headline text-[28px] sm:text-4xl md:text-[44px] font-extrabold leading-none" style={{ color: NAVY }}>{num}</span>
      <span className="text-[11.5px] sm:text-[14px] font-bold text-on-surface-variant leading-tight">{label}</span>
    </div>
  );

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="min-h-screen bg-surface flex flex-col">
      <SiteNav />

      <main className="flex-1">
        {/* ─────────────────────────── Hero ─────────────────────────── */}
        <section
          className="relative overflow-hidden text-white"
          style={{ background: "linear-gradient(135deg,#06203f 0%,#04274d 46%,#013a6b 100%)" }}
        >
          {/* decorative glows + faint grid */}
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
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>home_health</span>
                  {isRtl ? "استشارات عن بُعد ورعاية منزلية" : "Tele-consultation & Homecare"}
                </span>

                <h1 className={`mt-6 font-headline font-extrabold text-4xl md:text-5xl xl:text-[3.75rem] ${isRtl ? "leading-[1.25]" : "tracking-tight leading-[1.05]"} [text-wrap:balance]`}>
                  {isRtl ? (
                    <>رعايتك تبدأ <span style={{ color: AQUA }}>من مكانك.</span></>
                  ) : (
                    <>Your clinic, <span style={{ color: AQUA }}>wherever you are.</span></>
                  )}
                </h1>

                <p className="mt-5 text-white/75 text-base md:text-lg max-w-xl leading-relaxed [text-wrap:pretty]">
                  {isRtl
                    ? "استشر طبيبك عبر مكالمة فيديو آمنة، وإذا احتجت إلى فحوصات أو علاج أو زيارة منزلية، يتولى فريقنا تنسيقها لك. وتجد تفاصيل الرعاية والمتابعة كلها في تطبيق عيادتي."
                    : "Start with a teleconsultation with our leading specialists over a secure video call, then let the rest come to you. One team, one app, one journey — from the first call to the final follow-up."}
                </p>

                <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2.5">
                  {[
                    { en: "Virtual + at-home care", ar: "استشارات ورعاية منزلية" },
                    { en: "Encrypted & Private", ar: "خصوصية واتصال آمن" },
                    { en: "Licensed specialists", ar: "أطباء وأخصائيون مرخّصون" },
                  ].map((t) => (
                    <li key={t.en} className="inline-flex items-center gap-1.5 text-white/85 text-sm font-bold">
                      <span className="material-symbols-outlined text-[18px]" style={{ color: AQUA, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
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
                    className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-extrabold px-7 py-3.5 rounded-full shadow-[0_12px_30px_-10px_rgba(37,211,102,0.7)] hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-10px_rgba(37,211,102,0.8)] active:translate-y-0 transition-all"
                  >
                    <WhatsAppIcon className="text-xl" />
                    {isRtl ? "احجز موعدك" : "Book a consultation"}
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
              </motion.div>

              {/* Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
                className="lg:col-span-6 relative"
              >
                <div className={`hidden lg:block absolute inset-0 rounded-[2.4rem] bg-white/5 ring-1 ring-white/10 ${isRtl ? "-translate-x-5" : "translate-x-5"} translate-y-5`} aria-hidden />
                <div className="relative aspect-[4/3] lg:aspect-[5/4] rounded-[2rem] overflow-hidden ring-1 ring-white/15 shadow-[0_50px_100px_-40px_rgba(0,0,0,0.7)]">
                  <Image
                    src="/clinic/home-healthcare.webp"
                    alt={isRtl ? "فريق عيادتي أثناء تقديم الرعاية المنزلية" : "My Clinic home healthcare team"}
                    fill
                    preload
                    quality={78}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06203f]/70 via-[#06203f]/10 to-transparent" aria-hidden />
                </div>

                {/* floating glass chip — virtual */}
                <div className={`absolute top-4 ${isRtl ? "left-4" : "right-4"} flex items-center gap-2.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl ring-1 ring-white/60 px-3.5 py-2.5`}>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: AQUA, boxShadow: `0 0 0 4px ${AQUA}33` }} />
                  <div className="leading-tight">
                    <div className="font-extrabold text-on-surface text-[13px]">{isRtl ? "ابدأ باستشارة مرئية" : "Starts on video"}</div>
                    <div className="text-[11px] text-on-surface-variant">{isRtl ? "مع طبيب من عيادتي" : "Teleconsultation"}</div>
                  </div>
                </div>

                {/* floating glass chip — at door */}
                <div className={`absolute bottom-4 ${isRtl ? "right-4" : "left-4"} flex items-center gap-2.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl ring-1 ring-white/60 px-3.5 py-2.5`}>
                  <span className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>home_health</span>
                  </span>
                  <div className="leading-tight">
                    <div className="font-extrabold text-on-surface text-[13px]">{isRtl ? "والرعاية تصلك" : "Arrives at your door"}</div>
                    <div className="text-[11px] text-on-surface-variant">{isRtl ? "طبيب وتمريض وأدوية" : "Doctor, nurse & meds"}</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─────────── What comes to you (Telehome overview bento) ─────────── */}
        <section className="relative z-20 max-w-3xl mx-auto px-4 md:px-8 -mt-24 md:-mt-28">
          <Reveal className="bg-white rounded-[2rem] shadow-[0_40px_90px_-45px_rgba(0,77,153,0.5)] ring-1 ring-outline-variant/30 p-6 sm:p-10 md:p-12">
            <div className="grid grid-cols-3 gap-x-3 sm:gap-x-8 gap-y-7 sm:gap-y-9 items-start">
              {/* Row 1 — stat · teleconsultation (center) · stat */}
              {statTile("27+", isRtl ? "تخصصاً طبياً" : "Specialties")}
              {serviceTile(bySvc("Teleconsultation"), true, true)}
              {statTile("100+", isRtl ? "طبيب واستشاري" : "Doctors")}
              {/* Row 2 — medication · lab (center) · nurse */}
              {serviceTile(bySvc("Medication delivery"))}
              {serviceTile(bySvc("Lab Extraction"), false, true)}
              {serviceTile(bySvc("Nurse"))}
              {/* Row 3 — physiotherapy · (empty) · doctor */}
              {serviceTile(bySvc("Physiotherapy"))}
              <div aria-hidden />
              {serviceTile(bySvc("Doctor"))}
            </div>
          </Reveal>
        </section>

        {/* ──────────────── Journey: screen → front door ──────────────── */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <Reveal className="text-center max-w-2xl mx-auto">
            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-primary font-extrabold shadow-clinical ring-1 ring-primary/10 ${isRtl ? "text-[13px]" : "text-[11px] uppercase tracking-[0.15em]"}`}>
              {isRtl ? "خطوات الخدمة" : "How it works"}
            </span>
            <h2 className={`mt-5 font-headline text-3xl md:text-4xl xl:text-5xl font-extrabold text-primary ${isRtl ? "leading-[1.3]" : "tracking-tight leading-[1.08]"} [text-wrap:balance]`}>
              {isRtl ? "من الاستشارة إلى الرعاية في منزلك" : "From your screen to your front door"}
            </h2>
            <p className="mt-5 text-on-surface-variant leading-[1.9] [text-wrap:pretty]">
              {isRtl
                ? "احجز استشارتك أولاً، وبعد تقييم الطبيب ننسّق لك ما تحتاجه من خدمات منزلية."
                : "Eight simple steps: it begins with a virtual visit, then the care comes home to you."}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-12">
            <div className="bg-white rounded-[2.5rem] ring-1 ring-outline-variant/30 shadow-clinical p-6 sm:p-10 md:p-12">
              {/* phase legend */}
              <div className="hidden lg:grid grid-cols-8 gap-4 mb-6">
                <div className="col-span-4 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: TEAL }} />
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.14em]" style={{ color: TEAL }}>{isRtl ? "الاستشارة عن بُعد" : "On your screen"}</span>
                  <span className="flex-1 h-px bg-outline-variant/40 ms-1" />
                </div>
                <div className="col-span-4 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: NAVY }} />
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.14em]" style={{ color: NAVY }}>{isRtl ? "الرعاية في المنزل" : "At your door"}</span>
                  <span className="flex-1 h-px bg-outline-variant/40 ms-1" />
                </div>
              </div>

              {/* ── Desktop horizontal timeline ── */}
              <div className="hidden lg:block relative">
                <div
                  className="absolute top-7 h-0.5 rounded-full"
                  style={{ left: "6.25%", right: "6.25%", background: `linear-gradient(to ${isRtl ? "left" : "right"}, ${AQUA}, ${TEAL} 45%, ${NAVY} 60%)` }}
                  aria-hidden
                />
                <ol className="relative grid grid-cols-8 gap-4">
                  {JOURNEY.map((s, i) => {
                    const accent = s.phase === "virtual" ? TEAL : NAVY;
                    return (
                      <li key={i} className="flex flex-col items-center text-center">
                        <span
                          className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center text-white ring-4 ring-white"
                          style={{ backgroundColor: accent, boxShadow: `0 14px 26px -12px ${accent}` }}
                        >
                          <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                        </span>
                        <span className="mt-4 text-[10px] font-extrabold tracking-[0.14em]" style={{ color: accent }}>
                          {String(i + 1).padStart(2, "0")} · {phaseLabel(s.phase).toUpperCase()}
                        </span>
                        <h3 className="mt-1.5 font-headline font-extrabold text-on-surface text-[15px] leading-snug">{isRtl ? s.ar[0] : s.en[0]}</h3>
                        <p className="mt-1.5 text-[12.5px] text-on-surface-variant leading-relaxed [text-wrap:pretty]">{isRtl ? s.ar[1] : s.en[1]}</p>
                      </li>
                    );
                  })}
                </ol>
              </div>

              {/* ── Mobile vertical timeline ── */}
              <div className="lg:hidden relative">
                <div
                  className="absolute top-7 bottom-7 w-0.5 rounded-full"
                  style={{ insetInlineStart: "27px", background: `linear-gradient(to bottom, ${AQUA}, ${TEAL} 30%, ${NAVY})` }}
                  aria-hidden
                />
                <ol className="space-y-6">
                  {JOURNEY.map((s, i) => {
                    const accent = s.phase === "virtual" ? TEAL : NAVY;
                    return (
                      <li key={i} className="relative flex gap-4">
                        <span
                          className="relative z-10 w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center text-white ring-4 ring-white"
                          style={{ backgroundColor: accent, boxShadow: `0 14px 26px -12px ${accent}` }}
                        >
                          <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                        </span>
                        <div className="pt-1">
                          <span className="text-[10px] font-extrabold tracking-[0.14em]" style={{ color: accent }}>
                            {String(i + 1).padStart(2, "0")} · {phaseLabel(s.phase).toUpperCase()}
                          </span>
                          <h3 className="mt-0.5 font-headline font-extrabold text-on-surface text-base leading-snug">{isRtl ? s.ar[0] : s.en[0]}</h3>
                          <p className="mt-1 text-[13.5px] text-on-surface-variant leading-relaxed [text-wrap:pretty]">{isRtl ? s.ar[1] : s.en[1]}</p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ──────────────── Services: how each one works ──────────────── */}
        <section className="relative overflow-hidden bg-surface-container-low border-y border-outline-variant/30">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
            <Reveal className="text-center max-w-2xl mx-auto">
              <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-primary font-extrabold shadow-clinical ring-1 ring-primary/10 ${isRtl ? "text-[13px]" : "text-[11px] uppercase tracking-[0.15em]"}`}>
                {isRtl ? "خدماتنا" : "Our services"}
              </span>
              <h2 className={`mt-5 font-headline text-3xl md:text-4xl font-extrabold text-primary ${isRtl ? "leading-[1.3]" : "tracking-tight leading-[1.1]"} [text-wrap:balance]`}>
                {isRtl ? "اختر الخدمة المناسبة لك" : "How each service works"}
              </h2>
              <p className="mt-5 text-on-surface-variant leading-[1.9] [text-wrap:pretty]">
                {isRtl
                  ? "تعرّف على تفاصيل كل خدمة، وكيف ننسّقها لك، وما يمكنك توقّعه منها."
                  : "Every service in three clear parts: what it is, how we deliver it, and what to expect."}
              </p>
            </Reveal>

            <div className="mt-12 grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-7 items-stretch">
              {SERVICES.map((s, i) => {
                const c = isRtl ? s.ar : s.en;
                const accent = s.phase === "virtual" ? TEAL : NAVY;
                const msg = isRtl
                  ? `مرحباً، أرغب في حجز خدمة «${s.ar.title}» من عيادتي.`
                  : `Hello, I'd like to book "${s.en.title}" with My Clinic Telehome.`;
                return (
                  <Reveal key={s.en.title} delay={(i % 3) * 0.06}>
                    <div className="flex h-full flex-col bg-white rounded-2xl sm:rounded-[1.75rem] p-4 sm:p-6 md:p-7 shadow-clinical ring-1 ring-outline-variant/30 hover:-translate-y-1 hover:shadow-[0_28px_56px_-32px_rgba(0,77,153,0.5)] transition-all">
                      {/* header */}
                      <div className="flex flex-col sm:flex-row sm:items-start gap-2.5 sm:gap-4">
                        <span className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${accent}14`, color: accent }}>
                          <span className="material-symbols-outlined text-[24px] sm:text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                        </span>
                        <div className="flex-1 min-w-0 w-full">
                          <div className="flex items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9.5px] sm:text-[10px] font-extrabold tracking-wide" style={{ backgroundColor: `${accent}14`, color: accent }}>
                              <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>{s.phase === "virtual" ? "videocam" : "home_health"}</span>
                              {s.phase === "virtual" ? (isRtl ? "عن بُعد" : "VIRTUAL") : isRtl ? "في المنزل" : "AT HOME"}
                            </span>
                            <span className="font-headline text-2xl sm:text-3xl font-extrabold leading-none shrink-0" style={{ color: `${accent}26` }}>{String(i + 1).padStart(2, "0")}</span>
                          </div>
                          <h3 className="mt-1.5 sm:mt-2 font-headline text-[15px] sm:text-xl md:text-[1.4rem] font-extrabold text-on-surface leading-tight">{c.title}</h3>
                        </div>
                      </div>

                      {/* three blocks */}
                      <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                        {[
                          { label: isRtl ? BLOCK.what.ar : BLOCK.what.en, text: c.what },
                          { label: isRtl ? BLOCK.how.ar : BLOCK.how.en, text: c.how },
                        ].map((b) => (
                          <div key={b.label}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: accent }} />
                              <span className={`text-[10px] sm:text-[11px] font-extrabold text-on-surface-variant ${isRtl ? "" : "uppercase tracking-[0.12em]"}`}>{b.label}</span>
                            </div>
                            <p className="text-[13px] sm:text-[14.5px] text-on-surface-variant leading-[1.7] sm:leading-[1.8] [text-wrap:pretty]">{b.text}</p>
                          </div>
                        ))}

                        {/* what to expect — highlighted */}
                        <div className="rounded-2xl p-3 sm:p-4" style={{ backgroundColor: `${accent}0d` }}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="material-symbols-outlined text-[16px]" style={{ color: accent, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                            <span className={`text-[10px] sm:text-[11px] font-extrabold ${isRtl ? "" : "uppercase tracking-[0.12em]"}`} style={{ color: accent }}>{isRtl ? BLOCK.expect.ar : BLOCK.expect.en}</span>
                          </div>
                          <p className="text-[13px] sm:text-[14.5px] text-on-surface-variant leading-[1.7] sm:leading-[1.8] [text-wrap:pretty]">{c.expect}</p>
                        </div>
                      </div>

                      <a
                        href={waUrl(isRtl, msg)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={trackWhatsAppClick}
                        className="mt-auto pt-4 sm:pt-6 inline-flex items-center gap-1.5 font-extrabold text-[13px] sm:text-sm hover:gap-2.5 transition-all"
                        style={{ color: accent }}
                      >
                        <WhatsAppIcon className="text-base" />
                        {isRtl ? "استفسر واحجز" : "Book this service"}
                        <span className={`material-symbols-outlined text-[18px] ${isRtl ? "rotate-180" : ""}`}>arrow_forward</span>
                      </a>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ──────────────── Your care, on your terms ──────────────── */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Copy */}
            <Reveal>
              <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-primary font-extrabold shadow-clinical ring-1 ring-primary/10 ${isRtl ? "text-[13px]" : "text-[11px] uppercase tracking-[0.15em]"}`}>
                {isRtl ? "في الوقت والمكان المناسبين لك" : "You decide where & when"}
              </span>
              <h2 className={`mt-5 font-headline text-3xl md:text-4xl font-extrabold text-primary ${isRtl ? "leading-[1.3]" : "tracking-tight leading-[1.1]"} [text-wrap:balance]`}>
                {isRtl ? "ننسّق الزيارة بما يناسبك" : "Your care, on your terms"}
              </h2>
              <p className="mt-6 text-on-surface-variant text-base md:text-lg leading-[1.9] [text-wrap:pretty]">
                {isRtl
                  ? "بعد استشارتك، نرسل إليك عبر رسالة نصية نموذجاً قصيراً تحدّد فيه عنوانك الوطني والموعد المناسب لك. "
                  : "You're always in control of where your care happens and when it fits your day. After your consultation, we'll send you a short form by SMS — "}
                <span className="font-extrabold text-on-surface">{isRtl ? "لا تستغرق تعبئته أكثر من دقيقة" : "it takes only a minute"}</span>
                {isRtl ? "، وبعد إرساله نرتّب الزيارة ونؤكّد موعدها." : ", and it's what lets us plan every visit around you."}
              </p>

              <div className="mt-7 flex flex-wrap gap-2.5">
                {[
                  { icon: "verified_user", en: "Dedicated team assigned", ar: "فريق مخصّص لرعايتك" },
                  { icon: "lock", en: "Private & documented", ar: "خصوصية وتوثيق للزيارة" },
                ].map((h) => (
                  <span key={h.en} className="inline-flex items-center gap-2 bg-surface-container-low text-on-surface font-bold text-[13px] px-3.5 py-2 rounded-full ring-1 ring-outline-variant/30">
                    <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>{h.icon}</span>
                    {isRtl ? h.ar : h.en}
                  </span>
                ))}
              </div>
            </Reveal>

            {/* The two details card */}
            <Reveal delay={0.1}>
              <div className="relative bg-white rounded-[2rem] ring-1 ring-outline-variant/30 shadow-[0_40px_90px_-50px_rgba(0,77,153,0.5)] p-7 md:p-9">
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>checklist</span>
                  <span className={`text-[12px] font-extrabold text-on-surface-variant ${isRtl ? "" : "uppercase tracking-[0.14em]"}`}>{isRtl ? "نحتاج منك هذين التفصيلين" : "The two details that matter most"}</span>
                </div>

                <div className="space-y-5">
                  {DETAILS.map((d, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <span className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>{d.icon}</span>
                      </span>
                      <div>
                        <div className="font-extrabold text-on-surface">{isRtl ? d.ar[0] : d.en[0]}</div>
                        <div className="mt-0.5 text-[14px] text-on-surface-variant leading-relaxed [text-wrap:pretty]">{isRtl ? d.ar[1] : d.en[1]}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-7 pt-6 border-t border-outline-variant/40 flex items-start gap-3">
                  <span className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${TEAL}14`, color: TEAL }}>
                    <span className="material-symbols-outlined text-[19px]" style={{ fontVariationSettings: "'FILL' 1" }}>mark_chat_read</span>
                  </span>
                  <p className="text-[14px] text-on-surface-variant leading-relaxed [text-wrap:pretty]">
                    {isRtl
                      ? "بعد إرسال المعلومات، تصلك رسالة نصية بتأكيد موعد الزيارة."
                      : "Once we have these, we'll send you an SMS to confirm — and your visit is set."}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ──────────────────────── Closing CTA ──────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 pb-16 md:pb-24">
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
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>home_health</span>
                  {isRtl ? "احجز موعدك" : "Get started"}
                </span>
                <h2 className={`mt-5 font-headline text-3xl md:text-5xl font-extrabold ${isRtl ? "leading-[1.3]" : "tracking-tight leading-[1.05]"} [text-wrap:balance]`}>
                  {isRtl ? "ابدأ استشارتك من مكانك" : "Ready when you are."}
                </h2>
                <p className="mt-5 text-white/80 text-base md:text-lg leading-[1.9] [text-wrap:pretty]">
                  {isRtl
                    ? "تواصل معنا عبر واتساب أو الهاتف، وسيساعدك فريق عيادتي على حجز الاستشارة وترتيب الخدمات المنزلية التي تحتاجها."
                    : "Care that begins from your phone and arrives at your door. Reach us on WhatsApp or by phone and we'll arrange the right care at a time that suits you."}
                </p>
                <div className="mt-9 flex flex-col sm:flex-row gap-3.5">
                  <a
                    href={WA}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={trackWhatsAppClick}
                    className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-extrabold px-8 py-4 rounded-full shadow-lg hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 transition-all"
                  >
                    <WhatsAppIcon className="text-xl" />
                    {isRtl ? "تواصل معنا للحجز" : "Book a consultation"}
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
        href={WA}
        onClick={trackWhatsAppClick}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={isRtl ? "تواصل عبر واتساب" : "Chat on WhatsApp"}
        className={`fixed bottom-6 ${isRtl ? "left-6" : "right-6"} z-40 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:scale-110 transition-all`}
      >
        <WhatsAppIcon className="text-white text-2xl" />
      </a>
    </div>
  );
}

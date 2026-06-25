"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLang } from "@/app/i18n/context";
import { trackWhatsAppClick } from "@/app/lib/tracking";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";

const TELE_WA = `https://wa.me/966920022811?text=${encodeURIComponent("مرحباً، أود حجز استشارة طبية عن بُعد (تطبيب عن بعد) في عيادتي")}`;

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

const STEPS = [
  { icon: "event_available", en: ["Book your slot", "Request a virtual visit by phone, WhatsApp or our app and pick a time that suits you."], ar: ["احجز موعدك", "اطلب زيارة افتراضية عبر الهاتف أو واتساب أو تطبيقنا واختر الوقت المناسب لك."] },
  { icon: "link", en: ["Get your secure link", "We send a private, encrypted video link — no software to install."], ar: ["استلم رابطك الآمن", "نرسل لك رابط فيديو خاص ومشفّر — دون الحاجة لتثبيت أي برنامج."] },
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
        {/* Hero */}
        <section className="relative overflow-hidden bg-surface hero-gradient">
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] animate-[pulse_8s_ease-in-out_infinite]" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] animate-[pulse_10s_ease-in-out_1s_infinite]" />
          </div>
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 relative z-10 grid lg:grid-cols-12 gap-10 items-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-extrabold uppercase tracking-label mb-5">
                <span className="material-symbols-outlined text-sm">video_call</span>
                {isRtl ? "الطب عن بُعد" : "Telemedicine"}
              </div>
              <h1 className={`text-4xl md:text-6xl lg:text-7xl font-headline font-extrabold text-primary tracking-tighter text-glow mb-5 ${isRtl ? "leading-[1.4]" : "leading-[1.1]"}`}>
                {isRtl ? "طبيبك المتخصص... على بُعد نقرة" : "Your specialist, one tap away"}
              </h1>
              <p className="text-on-surface-variant text-base md:text-lg max-w-xl font-medium leading-relaxed opacity-90 mb-8">
                {isRtl
                  ? "استشر نخبة أطباء عيادتي عبر مكالمة فيديو آمنة من أي مكان في المملكة — وصفات إلكترونية، تحويلات مخبرية، ومتابعة لحالتك دون مغادرة منزلك."
                  : "Consult My Clinic's leading specialists over a secure video call from anywhere in Saudi Arabia — e-prescriptions, lab referrals and follow-ups, without leaving home."}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <a href={TELE_WA} onClick={trackWhatsAppClick} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-container text-white px-7 py-4 rounded-full font-bold shadow-lg shadow-primary/25 active:scale-95 transition-all">
                  <span className="material-symbols-outlined">video_call</span>
                  {isRtl ? "ابدأ استشارة عن بُعد" : "Start a virtual visit"}
                </a>
                <Link href="/find-a-doctor" className="inline-flex items-center gap-2 bg-surface-container-lowest text-primary border border-outline-variant/40 px-7 py-4 rounded-full font-bold hover:border-primary/40 transition-colors">
                  {isRtl ? "تصفّح الأطباء" : "Browse doctors"}
                </Link>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.15 }} className="lg:col-span-5">
              <div className="relative bg-surface-container-lowest rounded-[2rem] border border-outline-variant/20 shadow-[0_40px_80px_-30px_rgba(0,77,153,0.35)] p-6">
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary to-tertiary relative overflow-hidden flex items-center justify-center">
                  <span className="material-symbols-outlined text-white/90 text-7xl" style={{ fontVariationSettings: "'FILL' 1" }}>health_and_safety</span>
                  <div className="absolute bottom-3 inset-x-3 bg-white/15 backdrop-blur-md rounded-xl p-3 flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-white text-sm font-bold">{isRtl ? "متصل مع الطبيب" : "Connected with doctor"}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-5 text-center">
                  {[
                    { v: "27+", en: "Specialties", ar: "تخصص" },
                    { v: "100+", en: "Doctors", ar: "طبيب" },
                    { v: "4.9/5", en: "Rating", ar: "تقييم" },
                  ].map((s) => (
                    <div key={s.v} className="bg-surface-container rounded-xl py-3">
                      <p className="text-xl font-headline font-extrabold text-primary">{s.v}</p>
                      <p className="text-[11px] font-bold text-on-surface-variant">{isRtl ? s.ar : s.en}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 w-full">
          <Reveal className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm font-bold text-primary uppercase tracking-widest mb-3">{isRtl ? "كيف تعمل" : "How it works"}</p>
            <h2 className="text-3xl md:text-5xl font-headline font-extrabold text-on-surface tracking-tight">{isRtl ? "أربع خطوات بسيطة" : "Four simple steps"}</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <Reveal key={step.icon} delay={i * 0.08} className="relative">
                <div className="h-full bg-surface-container-lowest rounded-3xl p-7 border border-outline-variant/20 shadow-clinical">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl">{step.icon}</span>
                    </div>
                    <span className="text-5xl font-headline font-extrabold text-primary/10">{i + 1}</span>
                  </div>
                  <h3 className="font-headline font-extrabold text-primary text-lg mb-2">{isRtl ? step.ar[0] : step.en[0]}</h3>
                  <p className="text-on-surface-variant text-sm font-medium leading-relaxed">{isRtl ? step.ar[1] : step.en[1]}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="bg-surface-container-low border-y border-outline-variant/20">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 w-full">
            <Reveal className="text-center max-w-2xl mx-auto mb-14">
              <p className="text-sm font-bold text-primary uppercase tracking-widest mb-3">{isRtl ? "لماذا الطب عن بُعد" : "Why telemedicine"}</p>
              <h2 className="text-3xl md:text-5xl font-headline font-extrabold text-on-surface tracking-tight">{isRtl ? "رعاية تأتي إليك" : "Care that comes to you"}</h2>
            </Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {BENEFITS.map((b, i) => (
                <Reveal key={b.icon} delay={(i % 3) * 0.06}>
                  <div className="h-full bg-surface-container-lowest rounded-3xl p-7 border border-outline-variant/20 shadow-clinical hover:-translate-y-1 transition-transform">
                    <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-5">
                      <span className="material-symbols-outlined text-2xl">{b.icon}</span>
                    </div>
                    <h3 className="font-headline font-extrabold text-on-surface text-lg mb-2">{isRtl ? b.ar[0] : b.en[0]}</h3>
                    <p className="text-on-surface-variant text-sm font-medium leading-relaxed">{isRtl ? b.ar[1] : b.en[1]}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Suitable specialties */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 w-full">
          <Reveal className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm font-bold text-primary uppercase tracking-widest mb-3">{isRtl ? "متاح للاستشارة عن بُعد" : "Available online"}</p>
            <h2 className="text-3xl md:text-5xl font-headline font-extrabold text-on-surface tracking-tight">{isRtl ? "تخصصات مناسبة للزيارة الافتراضية" : "Specialties suited to virtual visits"}</h2>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {SUITABLE.map((s, i) => (
              <Reveal key={s.spec} delay={(i % 6) * 0.05}>
                <Link href={`/find-a-doctor?spec=${encodeURIComponent(s.spec)}`} className="group flex flex-col items-center text-center gap-3 bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/20 shadow-clinical hover:border-primary/30 hover:-translate-y-1 transition-all">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined">{s.icon}</span>
                  </div>
                  <span className="text-sm font-bold text-on-surface leading-tight">{isRtl ? s.ar : s.en}</span>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal className="text-center mt-10">
            <Link href="/specialties" className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
              {isRtl ? "استعرض كل التخصصات" : "See all specialties"}
              <span className={`material-symbols-outlined ${isRtl ? "rotate-180" : ""}`}>arrow_forward</span>
            </Link>
          </Reveal>
        </section>

        {/* FAQ */}
        <section className="bg-surface-container-low border-y border-outline-variant/20">
          <div className="max-w-3xl mx-auto px-4 md:px-8 py-16 md:py-24 w-full">
            <Reveal className="text-center mb-12">
              <p className="text-sm font-bold text-primary uppercase tracking-widest mb-3">{isRtl ? "أسئلة شائعة" : "FAQ"}</p>
              <h2 className="text-3xl md:text-4xl font-headline font-extrabold text-on-surface tracking-tight">{isRtl ? "كل ما تريد معرفته" : "Everything you need to know"}</h2>
            </Reveal>
            <div className="space-y-4">
              {FAQ.map((f, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <details className="group bg-surface-container-lowest rounded-2xl border border-outline-variant/20 overflow-hidden">
                    <summary className="flex items-center justify-between gap-4 cursor-pointer p-6 font-headline font-bold text-on-surface list-none">
                      {isRtl ? f.ar[0] : f.en[0]}
                      <span className="material-symbols-outlined text-primary transition-transform group-open:rotate-45 shrink-0">add</span>
                    </summary>
                    <p className="px-6 pb-6 -mt-1 text-on-surface-variant text-sm font-medium leading-relaxed">{isRtl ? f.ar[1] : f.en[1]}</p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA band */}
        <section className="bg-primary relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-[-20%] right-[10%] w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-[-30%] left-[5%] w-80 h-80 bg-secondary-fixed rounded-full blur-3xl" />
          </div>
          <div className="max-w-4xl mx-auto px-4 md:px-8 py-16 md:py-20 relative z-10 text-center">
            <h2 className="text-3xl md:text-5xl font-headline font-extrabold text-white mb-4">{isRtl ? "ابدأ رعايتك الآن — من حيث أنت" : "Start your care now — right where you are"}</h2>
            <p className="text-white/80 font-medium max-w-2xl mx-auto mb-8">{isRtl ? "احجز استشارتك الافتراضية اليوم وتحدّث مع أخصائي خلال دقائق." : "Book your virtual consultation today and speak with a specialist within minutes."}</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a href={TELE_WA} onClick={trackWhatsAppClick} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white text-primary px-7 py-4 rounded-full font-bold shadow-lg hover:scale-105 transition-transform">
                <i className="fa-brands fa-whatsapp text-lg text-[#25D366]" />
                {isRtl ? "احجز عبر واتساب" : "Book on WhatsApp"}
              </a>
              <Link href="/#booking-form" className="inline-flex items-center gap-2 bg-white/15 text-white border border-white/30 px-7 py-4 rounded-full font-bold hover:bg-white/25 transition-colors">
                {isRtl ? "نموذج الحجز" : "Booking form"}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />

      {/* Floating WhatsApp */}
      <a href={TELE_WA} onClick={trackWhatsAppClick} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" className={`fixed bottom-6 ${isRtl ? "left-6" : "right-6"} z-40 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:scale-110 transition-all`}>
        <i className="fa-brands fa-whatsapp text-white text-2xl" />
      </a>
    </div>
  );
}

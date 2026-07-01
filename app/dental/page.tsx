"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLang } from "@/app/i18n/context";
import { trackPhoneClick, trackWhatsAppClick } from "@/app/lib/tracking";
import SiteNav from "@/app/components/SiteNav";
import { WhatsAppIcon } from "@/app/components/icons";
import HeroParallaxBg from "./components/HeroParallaxBg";
import DentalHeroSplit from "./components/DentalHeroSplit";
import DentalPromisesScroll from "./components/DentalPromisesScroll";
import dynamic from "next/dynamic";

// Below the fold and carries the full ~97KB doctors dataset — client-only so
// the chunk stays entirely out of the landing page's critical JS; a min-height
// placeholder holds the space to avoid layout shift while it loads.
const DentalDoctorsStrip = dynamic(() => import("./components/DentalDoctorsStrip"), {
  ssr: false,
  loading: () => <div className="min-h-[520px]" />,
});
import DentalTestimonials from "./components/DentalTestimonials";
import DentalHoursAndBooking from "./components/DentalHoursAndBooking";
import SiteFooter from "@/app/components/SiteFooter";
import { dentalServiceCatalog } from "./content/services";

const WHATSAPP_LINK = `https://wa.me/966920022811?text=${encodeURIComponent("مرحباً، أود حجز موعد في عيادة الأسنان بعيادتي")}`;

const easeOut = [0.21, 0.47, 0.32, 0.98] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

export default function DentalHub() {
  const { lang } = useLang();
  const isRtl = lang === "ar";

  const heroRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const techRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroBgY = useTransform(heroProgress, [0, 1], ["0%", "30%"]);

  const { scrollYProgress: storyProgress } = useScroll({
    target: storyRef,
    offset: ["start end", "end start"],
  });
  const storyImg1Y = useTransform(storyProgress, [0, 1], ["10%", "-14%"]);
  const storyImg2Y = useTransform(storyProgress, [0, 1], ["-10%", "12%"]);

  const { scrollYProgress: processProgress } = useScroll({
    target: processRef,
    offset: ["start end", "end start"],
  });
  const processImgY = useTransform(processProgress, [0, 1], ["12%", "-12%"]);

  const { scrollYProgress: techProgress } = useScroll({
    target: techRef,
    offset: ["start end", "end start"],
  });
  const techBlobY = useTransform(techProgress, [0, 1], ["0%", "-20%"]);

  const t = isRtl ? AR : EN;

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="min-h-screen bg-white">
      <SiteNav />

      {/* ── Hero (Split-text + soft clinical backdrop) ───── */}
      <section
        ref={heroRef}
        className="relative overflow-hidden bg-white"
      >
        <motion.div style={{ y: heroBgY }} className="absolute inset-0 pointer-events-none">
          <HeroParallaxBg />
        </motion.div>

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-12 md:pt-16 pb-16 md:pb-24">
          <DentalHeroSplit
            lang={lang}
            onBookClick={() =>
              document.getElementById("dental-booking")?.scrollIntoView({ behavior: "smooth" })
            }
            onWhatsAppClick={() => {
              trackWhatsAppClick();
              window.open(WHATSAPP_LINK, "_blank");
            }}
          />
        </div>
      </section>

      {/* ── Promises (scroll-pinned 3D tooth + cards) ────── */}
      <DentalPromisesScroll lang={lang} />

      {/* ── Story / About the dental experience ─────────── */}
      <section ref={storyRef} className="pt-6 pb-16 md:py-28 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                style={{ y: storyImg1Y }}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: easeOut }}
                className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl shadow-[#003867]/10 will-change-transform"
              >
                <Image src="/dental/39.webp" alt={t.story.imageAlt1} fill sizes="(max-width:1024px) 50vw, 25vw" quality={70} className="object-cover" />
              </motion.div>
              <motion.div
                style={{ y: storyImg2Y }}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.1, ease: easeOut }}
                className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl shadow-[#00677d]/15 mt-10 will-change-transform"
              >
                <Image src="/dental/40.webp" alt={t.story.imageAlt2} fill sizes="(max-width:1024px) 50vw, 25vw" quality={70} className="object-cover" />
              </motion.div>
            </div>
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="lg:col-span-6 order-1 lg:order-2"
          >
            <motion.span variants={fadeUp} className="text-[11px] font-bold uppercase tracking-widest text-[#00677d]">{t.story.eyebrow}</motion.span>
            <motion.h2 variants={fadeUp} className="mt-3 text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {t.story.title}
            </motion.h2>
            <motion.div variants={fadeUp} className="mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-[#003867] to-[#00677d]" />
            <motion.div variants={fadeUp} className="mt-6 space-y-4 text-[15px] text-slate-600 leading-relaxed">
              {t.story.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </motion.div>
            <motion.div variants={fadeUp} className="mt-7 grid sm:grid-cols-2 gap-3">
              {t.story.bullets.map((b, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#00677d] mt-0.5 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <p className="text-[13px] text-slate-700 font-medium leading-relaxed">{b}</p>
                </div>
              ))}
            </motion.div>
            <motion.div variants={fadeUp} className="mt-8">
              <button
                onClick={() => document.getElementById("dental-booking")?.scrollIntoView({ behavior: "smooth" })}
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-[#003867] to-[#00677d] hover:from-[#002a4d] hover:to-[#005164] text-white px-7 py-3.5 rounded-full font-bold shadow-lg shadow-[#003867]/30 active:scale-95 transition-all hover:-translate-y-0.5"
              >
                {t.story.cta}
                <span className={`material-symbols-outlined text-[18px] transition-transform ${isRtl ? "group-hover:-translate-x-1 rotate-180" : "group-hover:translate-x-1"}`}>arrow_forward</span>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── What you'll find under one roof ─────────────── */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-[#00677d]/[0.05] via-white to-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center max-w-3xl mx-auto mb-14"
          >
            <motion.span variants={fadeUp} className="text-[11px] font-bold uppercase tracking-widest text-[#00677d]">{t.offering.eyebrow}</motion.span>
            <motion.h2 variants={fadeUp} className="mt-3 text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {t.offering.title}
            </motion.h2>
            <motion.div variants={fadeUp} className="mt-5 mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-[#003867] via-[#00677d] to-[#00677d]/40" />
            <motion.p variants={fadeUp} className="mt-5 text-lg text-slate-600 leading-relaxed">
              {t.offering.subtitle}
            </motion.p>
          </motion.div>

          <div
            className="group relative -mx-4 md:-mx-8 overflow-hidden"
            style={{
              maskImage: "linear-gradient(to right, transparent 0, black 5%, black 95%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to right, transparent 0, black 5%, black 95%, transparent 100%)",
            }}
            dir="ltr"
          >
            <motion.div
              className="flex gap-5 w-max will-change-transform"
              animate={{ x: isRtl ? ["-66.6667%", "0%"] : ["0%", "-66.6667%"] }}
              transition={{
                duration: 130,
                ease: "linear",
                repeat: Infinity,
              }}
            >
              {[...dentalServiceCatalog, ...dentalServiceCatalog, ...dentalServiceCatalog].map((s, i) => (
                <Link
                  key={i}
                  href={`/dental/${s.slug}`}
                  className="group/card relative shrink-0 w-[78vw] sm:w-[300px] md:w-[320px] bg-white rounded-2xl p-6 md:p-7 border border-[#003867]/10 hover:border-[#00677d]/40 hover:shadow-xl hover:shadow-[#00677d]/10 transition-all duration-300"
                  dir={isRtl ? "rtl" : "ltr"}
                >
                  <span className="absolute inset-x-0 top-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-[#003867]/0 via-[#00677d] to-[#003867]/0" />
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#003867]/10 to-[#00677d]/15 text-[#00677d] flex items-center justify-center">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-extrabold text-slate-900">{isRtl ? s.ar : s.en}</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{isRtl ? s.blurb.ar : s.blurb.en}</p>
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Patient experience / process ─────────────────── */}
      <section ref={processRef} className="py-20 md:py-28 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="lg:col-span-6"
          >
            <motion.span variants={fadeUp} className="text-[11px] font-bold uppercase tracking-widest text-[#00677d]">{t.process.eyebrow}</motion.span>
            <motion.h2 variants={fadeUp} className="mt-3 text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {t.process.title}
            </motion.h2>
            <motion.div variants={fadeUp} className="mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-[#003867] to-[#00677d]" />
            <motion.p variants={fadeUp} className="mt-5 text-lg text-slate-600 leading-relaxed max-w-xl">
              {t.process.subtitle}
            </motion.p>

            <motion.div variants={stagger} className="mt-10 space-y-5">
              {t.process.steps.map((s, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  whileHover={{ x: isRtl ? -4 : 4 }}
                  transition={{ type: "spring", stiffness: 260, damping: 24 }}
                  className="flex gap-5 bg-gradient-to-br from-white to-[#00677d]/[0.05] rounded-2xl p-6 border border-[#00677d]/15 hover:border-[#00677d]/40 hover:shadow-lg hover:shadow-[#00677d]/10 transition-all"
                >
                  <div className="shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#003867] to-[#00677d] text-white font-extrabold flex items-center justify-center shadow-md shadow-[#00677d]/30">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{s.title}</h3>
                    <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{s.body}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: easeOut }}
            className="lg:col-span-6"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-[#00677d]/20">
              <motion.div style={{ y: processImgY }} className="absolute inset-0 will-change-transform">
                <Image src="/dental/DSC04628_HDR.webp" alt={t.process.imageAlt} fill sizes="(max-width:1024px) 100vw, 50vw" quality={70} className="object-cover scale-110" />
              </motion.div>
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#003867]/45 via-[#00677d]/15 to-transparent" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Technology ───────────────────────────────────── */}
      <section ref={techRef} className="py-20 md:py-28 bg-gradient-to-br from-[#003867] via-[#003867] to-[#00677d] text-white relative overflow-hidden">
        <motion.div style={{ y: techBlobY }} className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-[28rem] h-[28rem] rounded-full bg-[#00677d]/30 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-[28rem] h-[28rem] rounded-full bg-white/5 blur-3xl" />
        </motion.div>
        <div className="relative max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center max-w-3xl mx-auto mb-14"
          >
            <motion.span variants={fadeUp} className="text-[11px] font-bold uppercase tracking-widest text-[#bfe7ee]">{t.tech.eyebrow}</motion.span>
            <motion.h2 variants={fadeUp} className="mt-3 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              {t.tech.title}
            </motion.h2>
            <motion.div variants={fadeUp} className="mt-5 mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-white/40 via-[#bfe7ee] to-white/10" />
            <motion.p variants={fadeUp} className="mt-5 text-lg text-white/85 leading-relaxed">
              {t.tech.subtitle}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto"
          >
            {t.tech.items.map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/15 hover:border-[#bfe7ee]/40 hover:bg-white/15 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/20 to-[#bfe7ee]/20 flex items-center justify-center text-white">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                </div>
                <h3 className="mt-5 text-lg font-extrabold">{item.title}</h3>
                <p className="mt-2 text-sm text-white/85 leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA banner before doctors ────────────────────── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: easeOut }}
            className="rounded-3xl bg-gradient-to-br from-[#003867] via-[#003867] to-[#00677d] text-white p-10 md:p-14 text-center relative overflow-hidden"
          >
            <motion.div
              animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#00677d]/40 blur-3xl pointer-events-none"
            />
            <motion.div
              animate={{ x: [0, -25, 0], y: [0, 15, 0] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none"
            />
            <div className="relative">
              <h3 className="text-3xl md:text-4xl font-extrabold leading-tight">
                {t.cta.title}
              </h3>
              <div className="mt-4 mx-auto h-1 w-20 rounded-full bg-gradient-to-r from-white/30 via-[#bfe7ee] to-white/10" />
              <p className="mt-5 text-white/90 text-lg max-w-2xl mx-auto">
                {t.cta.subtitle}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => document.getElementById("dental-booking")?.scrollIntoView({ behavior: "smooth" })}
                  className="bg-white text-[#003867] hover:bg-[#bfe7ee] px-8 py-4 rounded-full font-extrabold shadow-lg active:scale-95 transition-colors"
                >
                  {t.cta.primary}
                </button>
                <button
                  onClick={() => { trackWhatsAppClick(); window.open(WHATSAPP_LINK, "_blank"); }}
                  className="px-8 py-4 rounded-full font-bold bg-[#25D366] text-white border-2 border-[#25D366] hover:bg-[#1da851] hover:border-[#1da851] transition-colors inline-flex items-center gap-2"
                >
                  <WhatsAppIcon className="pointer-events-none text-[20px]" />
                  {t.cta.whatsapp}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Doctors / Testimonials / Hours+Form / Footer ─ */}
      <DentalDoctorsStrip limit={99} />
      <DentalTestimonials />
      <DentalHoursAndBooking service="general" />
      <SiteFooter />

      {/* ── Sticky Floating Buttons ──────────────────────── */}
      <div className={`fixed bottom-6 ${isRtl ? "left-6" : "right-6"} z-50 flex flex-col items-end gap-3`}>
        <motion.a
          href="tel:920022811"
          onClick={trackPhoneClick}
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2, ease: easeOut }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-14 h-14 bg-[#003867] rounded-full flex items-center justify-center shadow-lg shadow-[#003867]/30 hover:shadow-xl transition-shadow"
          aria-label="Call us"
        >
          <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>call</span>
        </motion.a>
        <div className={`flex items-center gap-2 ${isRtl ? "flex-row-reverse" : "flex-row"}`}>
          <motion.span
            initial={{ opacity: 0, x: isRtl ? -10 : 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.6, ease: easeOut }}
            className="bg-white text-[#25D366] text-xs font-bold px-3 py-1.5 rounded-full shadow-md border border-[#25D366]/20 whitespace-nowrap"
          >
            {isRtl ? "احجز الآن عبر واتساب" : "Chat now on WhatsApp"}
          </motion.span>
          <motion.a
            href={WHATSAPP_LINK}
            onClick={trackWhatsAppClick}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -6, 0],
            }}
            transition={{
              opacity: { duration: 0.5, delay: 1.4 },
              scale: { duration: 0.5, delay: 1.4, ease: easeOut },
              y: { duration: 2, delay: 2, repeat: Infinity, ease: "easeInOut" },
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/40 hover:shadow-xl hover:shadow-[#25D366]/50 transition-shadow"
            aria-label="Chat on WhatsApp"
          >
            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
            <svg viewBox="0 0 32 32" className="relative w-7 h-7 fill-white">
              <path d="M16.004 0C7.165 0 .004 7.161.004 16c0 2.822.737 5.561 2.137 7.978L.003 32l8.207-2.108A15.926 15.926 0 0 0 16.004 32C24.843 32 32 24.839 32 16S24.843 0 16.004 0zm0 29.09a13.05 13.05 0 0 1-6.64-1.813l-.476-.283-4.933 1.267 1.313-4.79-.31-.494A13.008 13.008 0 0 1 2.914 16c0-7.221 5.869-13.09 13.09-13.09S29.094 8.779 29.094 16s-5.869 13.09-13.09 13.09zm7.175-9.803c-.393-.197-2.326-1.148-2.687-1.279-.362-.131-.625-.197-.888.197s-1.02 1.279-1.25 1.542-.462.296-.855.099c-.393-.197-1.66-.612-3.163-1.95-1.17-1.043-1.96-2.33-2.19-2.723-.229-.393-.024-.605.172-.8.177-.177.393-.462.59-.693.197-.23.262-.394.393-.656.131-.262.066-.492-.033-.689-.099-.197-.888-2.14-1.217-2.93-.32-.769-.646-.665-.888-.677-.229-.011-.492-.014-.755-.014s-.69.099-1.05.492c-.362.394-1.381 1.35-1.381 3.293s1.414 3.82 1.611 4.083c.197.262 2.783 4.248 6.743 5.957.942.407 1.677.65 2.25.832.946.3 1.806.258 2.486.157.758-.113 2.326-.951 2.655-1.869.328-.918.328-1.705.23-1.869-.099-.164-.362-.262-.755-.46z" />
            </svg>
          </motion.a>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────
// Bilingual sales-grade copy lives here so JSX stays clean.

const EN = {
  hero: {
    eyebrow: "My Clinic Dental",
    title: "Your family's smile, taken care of.",
    subtitle:
      "Gentle, modern care for kids, parents, and grandparents. Our specialists listen, explain everything, and make dental visits calm and easy.",
    ctaPrimary: "Book your visit",
    ctaWhatsApp: "WhatsApp us",
    imageAlt: "A patient in consultation with a My Clinic dental specialist",
    badgeLabel: "Trusted by families across Saudi Arabia",
    badgeValue: "70+ dental specialists · 2 cities",
    ratingLabel: "Patients rate us",
  },
  promises: [
    { icon: "verified_user", title: "Specialist-led care", body: "Always a board-certified dentist. Never a trainee." },
    { icon: "shield", title: "Clean & safe", body: "Hospital-level sterilization. Your health comes first." },
    { icon: "schedule", title: "Same-day appointments", body: "Pain or emergency? We fit you in today." },
    { icon: "support_agent", title: "We handle insurance", body: "No paperwork headaches. We take care of it." },
  ],
  story: {
    eyebrow: "About Our Clinic",
    title: "Dentistry the way it should be.",
    paragraphs: [
      "At My Clinic, we believe a dental visit should feel comfortable from the very first moment. That's why we built a calm environment, brought in modern technology, and trained a team that pays attention to every detail of your experience — before, during, and after treatment.",
    ],
    bullets: [
      "Clear explanation before any procedure",
      "Treatment plans built around your needs",
      "Easy appointment scheduling",
      "Comfortable treatment options with modern technology",
      "Digital records and reports available when you need them",
      "Branches available: Riyadh — Jeddah",
    ],
    imageAlt1: "My Clinic modern dental exam room",
    imageAlt2: "My Clinic welcoming reception lobby",
    cta: "Book your visit",
  },
  offering: {
    eyebrow: "What We Do",
    title: "Your dental health, in safe hands.",
    subtitle:
      "We offer a complete suite of dental and pediatric services, led by a hand-picked team of specialists and consultants.",
    items: [
      { icon: "dentistry", title: "Cleanings & routine checkups", body: "Keep your smile healthy and strong." },
      { icon: "auto_awesome", title: "Smile makeovers & whitening", body: "Veneers, whitening, and beautiful results." },
      { icon: "build", title: "Crowns & implants", body: "Permanent solutions that feel natural." },
      { icon: "straighten", title: "Braces & clear aligners", body: "Straight teeth, your way, your timeline." },
      { icon: "child_care", title: "Pediatric dentistry", body: "Gentle, fun care kids actually enjoy." },
      { icon: "ecg_heart", title: "Gum & root canal treatment", body: "Save your natural teeth comfortably." },
      { icon: "medical_services", title: "Oral surgery", body: "Specialist surgical care with full comfort." },
      { icon: "favorite", title: "Senior dental care", body: "Specialized care for older adults." },
      { icon: "emergency", title: "Emergency cases", body: "Same-day relief when you need it most." },
    ],
  },
  process: {
    eyebrow: "Your First Visit",
    title: "Your dental visit experience.",
    subtitle: "We've made it simple, comfortable, and straightforward.",
    steps: [
      { title: "Listening to your needs", body: "We take time to understand your case, your questions, and your treatment goals with full attention." },
      { title: "A clear diagnosis", body: "Using digital imaging and modern tools to explain your case simply and clearly." },
      { title: "The right treatment plan", body: "We walk you through the options and the expected cost before we begin." },
    ],
    imageAlt: "Welcoming My Clinic reception",
  },
  tech: {
    eyebrow: "Modern & Comfortable",
    title: "The latest technology for a more comfortable experience.",
    subtitle: "We rely on advanced techniques that help us diagnose accurately and keep you comfortable throughout treatment.",
    items: [
      { icon: "monitor_heart", title: "3D imaging & advanced digital X-rays", body: "Precise, low-dose scans for an accurate diagnosis." },
      { icon: "precision_manufacturing", title: "Same-day restorations", body: "Select crowns and restorations completed in a single visit." },
      { icon: "spa", title: "Comfortable sedation & treatment options", body: "Sedation available for those who prefer to sleep through it." },
    ],
  },
  cta: {
    title: "Your smile deserves care you can trust.",
    subtitle: "Book your appointment today.",
    primary: "Book now",
    whatsapp: "WhatsApp us",
  },
};

const AR = {
  hero: {
    eyebrow: "عيادتي للأسنان",
    title: "الرعاية الأمثل لصحة أسنانك.",
    subtitle:
      "رعاية متكاملة لأسنانك بأحدث التقنيات وعلى يد نخبة من الأطباء.",
    ctaPrimary: "احجز موعدك",
    ctaWhatsApp: "تواصل واتساب",
    imageAlt: "مريض في استشارة مع طبيب أسنان استشاري في عيادتي",
    badgeLabel: "ثقة العائلات في المملكة",
    badgeValue: "+70 طبيب واستشاري أسنان",
    ratingLabel: "تقييم المرضى",
  },
  promises: [
    { icon: "verified_user", title: "+70 طبيب واستشاري أسنان", body: "نخبة من الأطباء والاستشاريين." },
    { icon: "shield", title: "نظافة على أعلى المستويات", body: "تعقيم بمعايير المستشفيات." },
    { icon: "schedule", title: "مواعيد مرنة", body: "تناسب جدولك ومتطلباتك." },
    { icon: "support_agent", title: "إجراءات تأمين مبسطة", body: "نتولى الإجراءات بدلاً عنك." },
  ],
  story: {
    eyebrow: "عن عيادتنا",
    title: "طب أسنان كما ينبغي أن يكون.",
    paragraphs: [
      "نؤمن في عيادتي أن زيارة الأسنان لابد أن تكون تجربة مريحة من بدايتها. لذا حرصنا على توفير بيئة هادئة، وتقنيات حديثة، وفريق يهتم بتفاصيل تجربتك قبل العلاج وأثناءه وبعده.",
    ],
    bullets: [
      "شرح واضح قبل أي إجراء",
      "خطط علاجية تناسب احتياجك",
      "تنسيق مواعيد بسهولة",
      "خيارات علاج مريحة وتقنيات حديثة",
      "ملفات وتقارير رقمية متاحة عند الحاجة",
      "الفروع المتاحة: الرياض - جدة",
    ],
    imageAlt1: "غرفة كشف أسنان حديثة في عيادتي",
    imageAlt2: "ردهة استقبال عيادتي",
    cta: "احجز موعدك",
  },
  offering: {
    eyebrow: "ما نقدمه",
    title: "صحة أسنانك بأيدٍ أمينة.",
    subtitle:
      "نقدّم في عيادتي مجموعة متكاملة من خدمات طب الأسنان والأطفال، بإشراف نخبة من الأطباء والاستشاريين.",
    items: [
      { icon: "dentistry", title: "تنظيف الأسنان والفحوصات الدورية", body: "حافظ على ابتسامتك قوية وصحية." },
      { icon: "auto_awesome", title: "تجميل الابتسامة والتبييض", body: "عدسات وتبييض ونتائج جميلة." },
      { icon: "build", title: "التركيبات والزراعة", body: "حلول دائمة تبدو طبيعية تماماً." },
      { icon: "straighten", title: "التقويم والمصففات الشفافة", body: "أسنان مستقيمة بأحدث الأساليب." },
      { icon: "child_care", title: "طب أسنان الأطفال", body: "رعاية حنونة يستمتع بها الأطفال." },
      { icon: "ecg_heart", title: "علاج اللثة والعصب", body: "احفظ أسنانك الطبيعية براحة." },
      { icon: "medical_services", title: "جراحة الفم والأسنان", body: "إجراءات جراحية بمعايير عالية وراحة تامة." },
      { icon: "favorite", title: "طب أسنان كبار السن", body: "رعاية متخصصة لمن هم في السن." },
      { icon: "emergency", title: "حالات الطوارئ", body: "علاج فوري عندما تحتاجه أكثر." },
    ],
  },
  process: {
    eyebrow: "زيارتك الأولى",
    title: "تجربتك في عيادة طب الأسنان.",
    subtitle: "بسيط وآمن وصريح.",
    steps: [
      { title: "الاستماع لاحتياجك", body: "نتعرف على حالتك، استفساراتك، وأهدافك العلاجية بكل اهتمام." },
      { title: "تشخيص واضح", body: "باستخدام الأشعة والتقنيات الرقمية لشرح الحالة بصورة بسيطة وواضحة." },
      { title: "خطة علاج مناسبة", body: "نوضح لك الخيارات العلاجية والتكلفة المتوقعة قبل البدء." },
    ],
    imageAlt: "ردهة استقبال عيادتي",
  },
  tech: {
    eyebrow: "حديث ومريح",
    title: "نستعمل أحدث التقنيات لتجربة أكثر راحة.",
    subtitle: "نعتمد على تقنيات متقدمة تساعد على دقة التشخيص وراحة المريض خلال العلاج.",
    items: [
      { icon: "monitor_heart", title: "تصوير 3D وأشعة رقمية متقدمة", body: "صور دقيقة وجرعة منخفضة لتشخيص أوضح." },
      { icon: "precision_manufacturing", title: "إجراء بعض التركيبات في نفس اليوم", body: "تيجان وتركيبات مختارة تنتهي في زيارة واحدة." },
      { icon: "spa", title: "خيارات تخدير وعلاج مريحة", body: "خيارات تخدير لمن يفضّل النوم خلال الجلسة." },
    ],
  },
  cta: {
    title: "ابتسامتك تستحق رعاية تثق بها.",
    subtitle: "احجز موعدك الآن.",
    primary: "احجز الآن",
    whatsapp: "تواصل واتساب",
  },
};

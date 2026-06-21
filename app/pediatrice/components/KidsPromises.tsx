"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Promise = { icon: string; title: string; body: string; tint: string };

type Copy = {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  imageAlt: string;
  stickerTop: string;
  stickerBottom: string;
  promises: Promise[];
};

const COPY: { en: Copy; ar: Copy } = {
  en: {
    eyebrow: "why families choose us",
    title: "Made gentle,",
    titleHighlight: "just for kids.",
    subtitle: "Every detail of a My Clinic visit is designed to keep your little one calm, comfortable and smiling.",
    imageAlt: "A warm, child-friendly clinic examination room",
    stickerTop: "4.8/5",
    stickerBottom: "loved by parents",
    promises: [
      { icon: "diversity_1", title: "Child-friendly specialists", body: "A hand-picked team trained to care for children with patience and warmth.", tint: "text-[#0067B2] bg-[#7DC8F7]/20" },
      { icon: "sentiment_very_satisfied", title: "Calm, playful spaces", body: "Bright, welcoming rooms designed to feel safe, never scary.", tint: "text-[#B27900] bg-[#FFC83D]/25" },
      { icon: "sanitizer", title: "Hospital-grade hygiene", body: "Spotless, sterilized environments to keep little immune systems protected.", tint: "text-[#00677d] bg-[#00677d]/10" },
      { icon: "schedule", title: "Flexible family hours", body: "Appointments that fit around school, naps and busy parents.", tint: "text-[#C2497A] bg-[#F9A8C0]/25" },
      { icon: "health_and_safety", title: "Simple insurance", body: "We handle the paperwork so you can focus on your child.", tint: "text-[#0067B2] bg-[#7DC8F7]/20" },
      { icon: "vaccines", title: "Gentle techniques", body: "Calming, low-stress methods for check-ups, vaccines and care.", tint: "text-[#B27900] bg-[#FFC83D]/25" },
    ],
  },
  ar: {
    eyebrow: "لماذا تختارنا العائلات",
    title: "رعاية لطيفة،",
    titleHighlight: "صُممت للأطفال.",
    subtitle: "كل تفاصيل زيارة عيادتي مصممة لإبقاء طفلك هادئاً ومرتاحاً ومبتسماً.",
    imageAlt: "غرفة فحص دافئة وملائمة للأطفال في عيادتي",
    stickerTop: "4.8/5",
    stickerBottom: "بحب الأهالي",
    promises: [
      { icon: "diversity_1", title: "أطباء متخصصون بالأطفال", body: "فريق مختار بعناية ومدرّب على رعاية الأطفال بصبر ودفء.", tint: "text-[#0067B2] bg-[#7DC8F7]/20" },
      { icon: "sentiment_very_satisfied", title: "أجواء هادئة وممتعة", body: "غرف مشرقة ومرحّبة تشعر طفلك بالأمان لا بالخوف.", tint: "text-[#B27900] bg-[#FFC83D]/25" },
      { icon: "sanitizer", title: "نظافة بمعايير المستشفيات", body: "بيئة معقّمة لحماية مناعة الصغار في كل زيارة.", tint: "text-[#00677d] bg-[#00677d]/10" },
      { icon: "schedule", title: "مواعيد مرنة للعائلة", body: "مواعيد تناسب المدرسة والقيلولة وانشغال الأهل.", tint: "text-[#C2497A] bg-[#F9A8C0]/25" },
      { icon: "health_and_safety", title: "تأمين مبسّط", body: "نتولّى الإجراءات لتتفرّغ أنت لطفلك.", tint: "text-[#0067B2] bg-[#7DC8F7]/20" },
      { icon: "vaccines", title: "أساليب لطيفة", body: "طرق هادئة ومريحة للفحوصات والتطعيمات والعلاج.", tint: "text-[#B27900] bg-[#FFC83D]/25" },
    ],
  },
};

export default function KidsPromises({ lang }: { lang: "en" | "ar" }) {
  const isRtl = lang === "ar";
  const c = COPY[lang];
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      gsap.from(".kp-row", {
        scrollTrigger: { trigger: ".kp-list", start: "top 78%" },
        x: isRtl ? -28 : 28,
        autoAlpha: 0,
        duration: 0.65,
        stagger: 0.1,
        ease: "power3.out",
      });
      gsap.from(".kp-figure", {
        scrollTrigger: { trigger: ".kp-figure", start: "top 80%" },
        y: 40,
        autoAlpha: 0,
        duration: 0.9,
        ease: "power3.out",
      });
    },
    { scope: sectionRef, dependencies: [lang], revertOnUpdate: true }
  );

  return (
    <section ref={sectionRef} dir={isRtl ? "rtl" : "ltr"} className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-[1fr_1.15fr] gap-12 lg:gap-20 items-start">
          {/* ── Sticky figure column ── */}
          <div className="lg:sticky lg:top-28">
            <p className="font-body italic font-semibold text-[#00677d] text-sm">
              {c.eyebrow}
            </p>
            <h2 className={`mt-4 font-headline text-4xl md:text-[2.9rem] font-extrabold text-slate-900 ${isRtl ? "leading-[1.3]" : "tracking-tight leading-[1.08]"} [text-wrap:balance]`}>
              {c.title}{" "}
              <span className="relative inline-block">
                <span className="relative z-10">{c.titleHighlight}</span>
                {/* Marker stroke behind the highlight */}
                <span className="absolute inset-x-0 bottom-1 h-[0.55em] bg-[#FFC83D]/45 -rotate-1 rounded-sm" aria-hidden />
              </span>
            </h2>
            <p className="mt-5 text-slate-600 leading-relaxed max-w-md [text-wrap:pretty]">{c.subtitle}</p>

            <div className="kp-figure relative mt-10 max-w-md">
              {/* Arch-masked photo */}
              <div className="relative aspect-[4/4.6] rounded-t-[12rem] rounded-b-[2rem] overflow-hidden ring-[6px] ring-white shadow-[0_36px_70px_-30px_rgba(0,77,153,0.45)]">
                <Image
                  src="/kids/space.jpg"
                  alt={c.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  quality={78}
                  className="object-cover"
                />
              </div>
              {/* Rating sticker */}
              <div className={`absolute -bottom-5 ${isRtl ? "-left-3" : "-right-3"} bg-white rounded-2xl px-5 py-3 shadow-[0_4px_0_#FFC83D] ring-1 ring-slate-100 rotate-2`}>
                <p className="font-headline text-xl font-extrabold text-[#004d99] tabular-nums" dir="ltr">{c.stickerTop}</p>
                <p className="text-[11px] font-bold text-slate-500">{c.stickerBottom}</p>
              </div>
              {/* Doodle squiggle */}
              <svg className={`absolute -top-7 ${isRtl ? "right-2" : "left-2"} w-16 text-[#7DC8F7]`} viewBox="0 0 100 24" fill="none" aria-hidden>
                <path d="M2 14 Q 14 2 26 14 T 50 14 T 74 14 T 98 14" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* ── Numbered promise list ── */}
          <ol className="kp-list mt-2 lg:mt-16">
            {c.promises.map((p, i) => (
              <li
                key={i}
                className="kp-row group flex items-start gap-5 md:gap-6 py-6 md:py-7 border-b border-dashed border-slate-200 last:border-none rounded-2xl px-3 -mx-3 hover:bg-sky-50/50 transition-colors duration-300"
              >
                <span className="font-headline text-sm font-extrabold text-slate-300 tabular-nums pt-1.5 group-hover:text-[#004d99] transition-colors" dir="ltr">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={`w-12 h-12 rounded-2xl ${p.tint} flex items-center justify-center shrink-0 group-hover:-rotate-6 group-hover:scale-105 transition-transform duration-300`}>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{p.icon}</span>
                </span>
                <div className="min-w-0">
                  <h3 className="font-headline font-bold text-slate-900 text-[17px] leading-snug">{p.title}</h3>
                  <p className="mt-1.5 text-[15px] text-slate-500 leading-relaxed [text-wrap:pretty]">{p.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

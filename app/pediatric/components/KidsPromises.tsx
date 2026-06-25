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
  promises: Promise[];
};

const COPY: { en: Copy; ar: Copy } = {
  en: {
    eyebrow: "why families choose us",
    title: "My Clinic is your",
    titleHighlight: "first choice.",
    subtitle: "We bring together medical expertise and a genuine focus on your child's comfort — so every visit leaves you feeling reassured.",
    imageAlt: "A warm, child-friendly clinic examination room",
    promises: [
      { icon: "diversity_1", title: "Leading pediatric specialists", body: "A team of consultants and specialists across every pediatric field, caring for your child with patience and warmth.", tint: "text-[#0067B2] bg-[#7DC8F7]/20" },
      { icon: "child_friendly", title: "Clinics designed for children", body: "Rooms and equipment built to feel safe and comfortable for little ones.", tint: "text-[#B27900] bg-[#FFC83D]/25" },
      { icon: "monitor_weight", title: "Growth tracked at every age", body: "Physical growth and developmental milestones followed at every stage.", tint: "text-[#00677d] bg-[#00677d]/10" },
      { icon: "vaccines", title: "Vaccinations & routine check-ups", body: "Immunizations and regular check-ups, always kept on schedule.", tint: "text-[#C2497A] bg-[#F9A8C0]/25" },
      { icon: "health_and_safety", title: "Smooth insurance & scheduling", body: "We handle the insurance paperwork and booking so your visit stays effortless.", tint: "text-[#0067B2] bg-[#7DC8F7]/20" },
      { icon: "stethoscope", title: "Care across subspecialties", body: "Specialized care covering a range of precise pediatric subspecialties.", tint: "text-[#B27900] bg-[#FFC83D]/25" },
    ],
  },
  ar: {
    eyebrow: "لماذا تختارنا العائلات",
    title: "عيادتي هي",
    titleHighlight: "خيارك الأول.",
    subtitle: "نحرص على تقديم تجربة صحية متكاملة تجمع بين الخبرة الطبية والاهتمام براحة الطفل، لنمنح الأهل شعوراً بالاطمئنان في كل زيارة.",
    imageAlt: "غرفة فحص دافئة وملائمة للأطفال في عيادتي",
    promises: [
      { icon: "diversity_1", title: "نخبة من استشاريي الأطفال", body: "نخبة من الاستشاريين والأخصائيين في مختلف تخصصات الأطفال يرعون طفلك بصبر ودفء.", tint: "text-[#0067B2] bg-[#7DC8F7]/20" },
      { icon: "child_friendly", title: "عيادات متكاملة للأطفال", body: "مساحات وتجهيزات صُممت ليشعر طفلك بالأمان والراحة في كل زيارة.", tint: "text-[#B27900] bg-[#FFC83D]/25" },
      { icon: "monitor_weight", title: "متابعة النمو في كل مرحلة", body: "متابعة دقيقة للنمو الجسدي والتطور في مختلف المراحل العمرية.", tint: "text-[#00677d] bg-[#00677d]/10" },
      { icon: "vaccines", title: "التطعيمات والفحوصات الدورية", body: "جدول تطعيمات منتظم وفحوصات دورية في مواعيدها دائماً.", tint: "text-[#C2497A] bg-[#F9A8C0]/25" },
      { icon: "health_and_safety", title: "تأمين ومواعيد سلسة", body: "نتولّى إجراءات التأمين وتنظيم المواعيد لتكون زيارتك سهلة وميسّرة.", tint: "text-[#0067B2] bg-[#7DC8F7]/20" },
      { icon: "stethoscope", title: "التخصصات الدقيقة للأطفال", body: "رعاية تخصصية تغطّي عدداً من التخصصات الدقيقة لطب الأطفال.", tint: "text-[#B27900] bg-[#FFC83D]/25" },
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

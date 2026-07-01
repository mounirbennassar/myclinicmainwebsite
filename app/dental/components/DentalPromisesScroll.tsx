"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Promise = { icon: string; title: string; body: string };

type Copy = {
  eyebrow: string;
  title: string;
  promises: Promise[];
  videoAlt: string;
};

const COPY: { en: Copy; ar: Copy } = {
  en: {
    eyebrow: "Why families choose us",
    title: "Our promises to you.",
    videoAlt: "3D rotating dental tooth",
    promises: [
      {
        icon: "verified_user",
        title: "+70 specialists & consultants",
        body: "A hand-picked team of board-certified specialists.",
      },
      {
        icon: "sanitizer",
        title: "Sterilization at the highest standard",
        body: "Hospital-level sterilization, every visit.",
      },
      {
        icon: "schedule",
        title: "Flexible appointments",
        body: "Times that suit your schedule and needs.",
      },
      {
        icon: "support_agent",
        title: "Simplified insurance process",
        body: "We handle the paperwork for you.",
      },
    ],
  },
  ar: {
    eyebrow: "لماذا تختارنا العائلات",
    title: "وعودنا لك.",
    videoAlt: "ضرس ثلاثي الأبعاد يدور",
    promises: [
      {
        icon: "verified_user",
        title: "+70 طبيب واستشاري أسنان",
        body: "نخبة من الأطباء والاستشاريين.",
      },
      {
        icon: "sanitizer",
        title: "نظافة على أعلى المستويات",
        body: "تعقيم بمعايير المستشفيات.",
      },
      {
        icon: "schedule",
        title: "مواعيد مرنة",
        body: "تناسب جدولك ومتطلباتك.",
      },
      {
        icon: "support_agent",
        title: "إجراءات تأمين مبسطة",
        body: "نتولى الإجراءات بدلاً عنك.",
      },
    ],
  },
};

export default function DentalPromisesScroll({ lang }: { lang: "en" | "ar" }) {
  const isRtl = lang === "ar";
  const c = COPY[lang];

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const lineRefs = useRef<Array<SVGLineElement | null>>([]);
  const dotRefs = useRef<Array<SVGCircleElement | null>>([]);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  useGSAP(
    () => {
      const video = videoRef.current;

      if (video) {
        const unlock = () => {
          video.play().then(() => video.pause()).catch(() => {});
        };
        if (video.readyState >= 1) unlock();
        else video.addEventListener("loadedmetadata", unlock, { once: true });
      }

      const intersectRect = (
        tcx: number,
        tcy: number,
        ccx: number,
        ccy: number,
        left: number,
        top: number,
        right: number,
        bottom: number
      ) => {
        const dx = ccx - tcx;
        const dy = ccy - tcy;
        let minT = Infinity;
        const test = (t: number, x: number, y: number) => {
          if (t > 0 && t < 1 && x >= left && x <= right && y >= top && y <= bottom && t < minT) {
            minT = t;
          }
        };
        if (dx !== 0) {
          let t = (left - tcx) / dx;
          test(t, left, tcy + t * dy);
          t = (right - tcx) / dx;
          test(t, right, tcy + t * dy);
        }
        if (dy !== 0) {
          let t = (top - tcy) / dy;
          test(t, tcx + t * dx, top);
          t = (bottom - tcy) / dy;
          test(t, tcx + t * dx, bottom);
        }
        if (minT === Infinity) return { x: ccx, y: ccy };
        return { x: tcx + minT * dx, y: tcy + minT * dy };
      };

      const layoutLines = () => {
        const stage = stageRef.current;
        const svg = svgRef.current;
        const tooth = videoWrapRef.current;
        if (!stage || !svg || !tooth) return;
        const svgRect = svg.getBoundingClientRect();
        if (svgRect.width === 0 && svgRect.height === 0) return;

        const w = stage.offsetWidth;
        const h = stage.offsetHeight;
        svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
        svg.setAttribute("width", String(w));
        svg.setAttribute("height", String(h));

        const tcx = tooth.offsetLeft + tooth.offsetWidth / 2;
        const tcy = tooth.offsetTop + tooth.offsetHeight / 2;

        cardRefs.current.forEach((card, i) => {
          if (!card) return;
          const cl = card.offsetLeft;
          const ct = card.offsetTop;
          const cr = cl + card.offsetWidth;
          const cb = ct + card.offsetHeight;
          const ccx = cl + card.offsetWidth / 2;
          const ccy = ct + card.offsetHeight / 2;
          const edge = intersectRect(tcx, tcy, ccx, ccy, cl, ct, cr, cb);

          const line = lineRefs.current[i];
          const dot = dotRefs.current[i];
          if (line) {
            line.setAttribute("x1", String(tcx));
            line.setAttribute("y1", String(tcy));
            line.setAttribute("x2", String(edge.x));
            line.setAttribute("y2", String(edge.y));
            const len = Math.hypot(edge.x - tcx, edge.y - tcy);
            gsap.set(line, { strokeDasharray: `${len} ${len}`, strokeDashoffset: len });
          }
          if (dot) {
            dot.setAttribute("cx", String(edge.x));
            dot.setAttribute("cy", String(edge.y));
            gsap.set(dot, { autoAlpha: 0 });
          }
        });
      };

      layoutLines();
      ScrollTrigger.addEventListener("refresh", layoutLines);

      const mm = gsap.matchMedia();

      // ── DESKTOP ─────────────────────────────────────────
      mm.add("(min-width: 768px)", () => {
        const launchOffset = 700;
        const startStates = [
          { x: -launchOffset, y: -launchOffset * 0.6, rotation: -8 },
          { x: launchOffset, y: -launchOffset * 0.6, rotation: 8 },
          { x: -launchOffset, y: launchOffset * 0.6, rotation: 8 },
          { x: launchOffset, y: launchOffset * 0.6, rotation: -8 },
        ];
        startStates.forEach((s, i) => {
          gsap.set(`.dps-card-${i + 1}`, {
            autoAlpha: 0,
            x: isRtl ? -s.x : s.x,
            y: s.y,
            rotation: isRtl ? -s.rotation : s.rotation,
            scale: 0.55,
          });
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=2800",
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            onUpdate: (self) => {
              if (video && Number.isFinite(video.duration) && video.duration > 0) {
                video.currentTime = video.duration * self.progress;
              }
            },
          },
          defaults: { ease: "power2.out" },
        });

        tl.fromTo(".dps-video-wrap", { scale: 0.92 }, { scale: 1.02, ease: "none", duration: 0.5 }, 0);
        tl.to(".dps-video-wrap", { scale: 1, ease: "none", duration: 0.5 }, 0.5);

        [".dps-card-1", ".dps-card-2", ".dps-card-3", ".dps-card-4"].forEach((sel, i) => {
          tl.to(
            sel,
            { autoAlpha: 1, x: 0, y: 0, rotation: 0, scale: 1, duration: 0.18, ease: "power3.out" },
            0.05 + i * 0.14
          );
        });

        [".dps-line-1", ".dps-line-2", ".dps-line-3", ".dps-line-4"].forEach((sel, i) => {
          tl.to(sel, { strokeDashoffset: 0, duration: 0.16, ease: "power2.inOut" }, 0.65 + i * 0.05);
        });

        [".dps-dot-1", ".dps-dot-2", ".dps-dot-3", ".dps-dot-4"].forEach((sel, i) => {
          tl.to(sel, { autoAlpha: 1, duration: 0.1, ease: "power2.out" }, 0.78 + i * 0.05);
        });

        tl.to(".dps-headline", { autoAlpha: 0.45, duration: 0.2 }, 0.6);

        const pulse = gsap.to(".dps-dot", {
          scale: 1.6,
          transformOrigin: "50% 50%",
          duration: 1.4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          stagger: 0.18,
        });

        return () => {
          pulse.kill();
        };
      });

      // ── MOBILE ──────────────────────────────────────────
      mm.add("(max-width: 767px)", () => {
        // Cards fly in from their respective side (1,3 from start; 2,4 from end).
        const offset = 240;
        const startStates = [
          { x: -offset }, // top start (LTR-left, RTL-right)
          { x: offset },  // top end
          { x: -offset }, // bottom start
          { x: offset },  // bottom end
        ];
        startStates.forEach((s, i) => {
          gsap.set(`.dps-card-${i + 1}`, {
            autoAlpha: 0,
            x: isRtl ? -s.x : s.x,
            y: 0,
            scale: 0.85,
          });
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "bottom 25%",
            scrub: 0.6,
            onUpdate: (self) => {
              if (video && Number.isFinite(video.duration) && video.duration > 0) {
                video.currentTime = video.duration * self.progress;
              }
            },
          },
          defaults: { ease: "power2.out" },
        });

        tl.fromTo(".dps-video-wrap", { scale: 0.94 }, { scale: 1.02, ease: "none", duration: 0.5 }, 0);
        tl.to(".dps-video-wrap", { scale: 1, ease: "none", duration: 0.5 }, 0.5);

        [".dps-card-1", ".dps-card-2", ".dps-card-3", ".dps-card-4"].forEach((sel, i) => {
          tl.to(
            sel,
            { autoAlpha: 1, x: 0, scale: 1, duration: 0.2, ease: "power3.out" },
            0.1 + i * 0.13
          );
        });
      });

      return () => {
        ScrollTrigger.removeEventListener("refresh", layoutLines);
      };
    },
    { scope: sectionRef, dependencies: [lang] }
  );

  const cardPositions = [
    "self-end justify-self-start md:self-start md:justify-self-start",
    "self-end justify-self-end md:self-start md:justify-self-end",
    "self-start justify-self-start md:self-end md:justify-self-start",
    "self-start justify-self-end md:self-end md:justify-self-end",
  ];

  return (
    <section
      ref={sectionRef}
      className="relative bg-white overflow-hidden"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="relative h-[560px] min-h-0 md:h-screen md:min-h-[680px] max-w-7xl mx-auto px-4 md:px-8 flex flex-col">
        {/* Headline */}
        <div className="dps-headline pt-0 md:pt-14 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#003867]/[0.06] text-[#00677d] text-[11px] font-bold uppercase tracking-[0.18em] ring-1 ring-[#00677d]/15">
            <span
              className="material-symbols-outlined text-sm"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              auto_awesome
            </span>
            {c.eyebrow}
          </span>
          <h2 className="mt-2 md:mt-5 text-2xl sm:text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            {c.title}
          </h2>
        </div>

        {/* Stage: 2x2 grid on all sizes. Tooth absolute-centered behind,
            cards in the 4 corners in front (close to the tooth). */}
        <div
          ref={stageRef}
          className="relative flex-1 grid grid-cols-2 grid-rows-2 gap-x-2 gap-y-1 md:gap-6 py-0 md:py-10 items-stretch"
        >
          {/* SVG overlay — desktop only */}
          <svg
            ref={svgRef}
            className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-20"
            preserveAspectRatio="none"
            aria-hidden
          >
            <defs>
              <linearGradient id="dps-line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#003867" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#00677d" stopOpacity="0.95" />
              </linearGradient>
            </defs>
            {[0, 1, 2, 3].map((i) => (
              <g key={i}>
                <line
                  ref={(el) => {
                    lineRefs.current[i] = el;
                  }}
                  className={`dps-line dps-line-${i + 1}`}
                  stroke="url(#dps-line-grad)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle
                  ref={(el) => {
                    dotRefs.current[i] = el;
                  }}
                  className={`dps-dot dps-dot-${i + 1}`}
                  r="4"
                  fill="#00677d"
                />
              </g>
            ))}
          </svg>

          {/* Tooth video — absolute-centered on all sizes (behind cards on mobile) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 md:z-30">
            <div
              ref={videoWrapRef}
              className="dps-video-wrap relative w-[72%] max-w-[320px] md:w-[42%] md:max-w-none aspect-square will-change-transform"
            >
              <video
                ref={videoRef}
                src="/dental/tooth.mp4"
                muted
                playsInline
                preload="metadata"
                disablePictureInPicture
                aria-label={c.videoAlt}
                className="relative w-full h-full object-contain"
              />
            </div>
          </div>

          {/* 4 cards: explicit grid placement on mobile, corner alignment on desktop */}
          {c.promises.map((p, i) => (
            <div
              key={i}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className={`dps-card-${i + 1} group relative z-30 md:z-10 ${cardPositions[i]} w-[97%] sm:w-[92%] md:w-[38%] max-w-none sm:max-w-none md:max-w-[340px] will-change-transform`}
              style={{ willChange: "transform, opacity" }}
            >
              <div className="relative bg-white/95 backdrop-blur rounded-2xl p-2.5 md:p-6 border border-slate-200/80 shadow-[0_18px_42px_-18px_rgba(0,56,103,0.38)] md:shadow-[0_28px_60px_-20px_rgba(0,56,103,0.30)] flex flex-row items-center gap-2.5 md:gap-0 md:flex-col md:items-start">
                {/* Icon medallion */}
                <div className="shrink-0 w-9 h-9 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-[#003867] to-[#00677d] text-white flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-[19px] md:text-[26px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {p.icon}
                  </span>
                </div>

                {/* Text block — title only on mobile (next to icon), title + body on desktop */}
                <div className="min-w-0 flex-1 md:mt-4">
                  <h3 className="text-[13px] md:text-base font-extrabold text-slate-900 leading-[1.2] md:leading-snug break-words">
                    {p.title}
                  </h3>
                  <p className="hidden md:block md:mt-2 md:text-[13px] md:text-slate-600 md:leading-relaxed">
                    {p.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

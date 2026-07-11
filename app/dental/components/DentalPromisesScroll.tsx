"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/*
 * Scroll-pinned "promises" stage: a 3D tooth turns as you scroll while four
 * promise cards fly in and connect to it with drawn lines.
 *
 * The tooth is a pre-rendered webp frame sequence (61 frames, ~160KB total)
 * blitted onto a <canvas>. The previous implementation scrubbed a 2.9MB
 * <video> via currentTime, which forces async seeks + decodes on every
 * scroll frame and stutters badly; drawing cached bitmaps is allocation-free
 * and stays comfortably inside a 60fps frame budget.
 */
const FRAME_COUNT = 61;
const frameSrc = (i: number) => `/dental/tooth-seq/f-${String(i).padStart(3, "0")}.webp`;

type Promise_ = { icon: string; title: string; body: string };

type Copy = {
  eyebrow: string;
  title: string;
  canvasAlt: string;
  promises: Promise_[];
};

const COPY: { en: Copy; ar: Copy } = {
  en: {
    eyebrow: "Why families choose us",
    title: "Our promises to you.",
    canvasAlt: "3D rotating dental tooth",
    promises: [
      { icon: "verified_user", title: "+70 specialists & consultants", body: "A hand-picked team of board-certified specialists." },
      { icon: "sanitizer", title: "Sterilization at the highest standard", body: "Hospital-level sterilization, every visit." },
      { icon: "schedule", title: "Flexible appointments", body: "Times that suit your schedule and needs." },
      { icon: "support_agent", title: "Simplified insurance process", body: "We handle the paperwork for you." },
    ],
  },
  ar: {
    eyebrow: "لماذا تختارنا العائلات",
    title: "وعودنا لك.",
    canvasAlt: "ضرس ثلاثي الأبعاد يدور",
    promises: [
      { icon: "verified_user", title: "+70 طبيب واستشاري أسنان", body: "نخبة من الأطباء والاستشاريين." },
      { icon: "sanitizer", title: "نظافة على أعلى المستويات", body: "تعقيم بمعايير المستشفيات." },
      { icon: "schedule", title: "مواعيد مرنة", body: "تناسب جدولك ومتطلباتك." },
      { icon: "support_agent", title: "إجراءات تأمين مبسطة", body: "نتولى الإجراءات بدلاً عنك." },
    ],
  },
};

export default function DentalPromisesScroll({ lang }: { lang: "en" | "ar" }) {
  const isRtl = lang === "ar";
  const c = COPY[lang];

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const lineRefs = useRef<Array<SVGLineElement | null>>([]);
  const dotRefs = useRef<Array<SVGCircleElement | null>>([]);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  useGSAP(
    () => {
      /* ── Frame sequence: lazy-load, cache, blit ───────────── */
      const frames: Array<HTMLImageElement | null> = new Array(FRAME_COUNT).fill(null);
      let lastDrawn = -1;
      let pendingFrame = 0;
      let loadStarted = false;

      const draw = (index: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        // Fall back to the nearest loaded frame so early scrolls still render.
        let img = frames[index];
        if (!img) {
          for (let d = 1; d < FRAME_COUNT && !img; d++) {
            img = frames[index - d] ?? frames[index + d] ?? null;
          }
        }
        if (!img) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };

      const setFrame = (index: number) => {
        pendingFrame = index;
        if (index !== lastDrawn) {
          lastDrawn = index;
          draw(index);
        }
      };

      const sizeCanvas = () => {
        const canvas = canvasRef.current;
        const wrap = canvasWrapRef.current;
        if (!canvas || !wrap) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const size = Math.round(wrap.clientWidth * dpr);
        if (canvas.width !== size) {
          canvas.width = size;
          canvas.height = size;
        }
        lastDrawn = -1;
        setFrame(pendingFrame);
      };

      const loadFrames = () => {
        if (loadStarted) return;
        loadStarted = true;
        for (let i = 0; i < FRAME_COUNT; i++) {
          const img = new Image();
          img.decoding = "async";
          img.src = frameSrc(i);
          img.onload = () => {
            frames[i] = img;
            // First arrivals: repaint whatever frame the scroll is asking for.
            if (lastDrawn === -1 || Math.abs(pendingFrame - i) <= 2) {
              lastDrawn = -1;
              setFrame(pendingFrame);
            }
          };
        }
      };

      // Begin fetching shortly before the section scrolls into reach.
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            loadFrames();
            io.disconnect();
          }
        },
        { rootMargin: "150% 0px" }
      );
      if (sectionRef.current) io.observe(sectionRef.current);

      const ro = new ResizeObserver(sizeCanvas);
      if (canvasWrapRef.current) ro.observe(canvasWrapRef.current);
      sizeCanvas();

      /* ── Connector-line geometry (tooth center → card edge) ── */
      const intersectRect = (
        tcx: number, tcy: number, ccx: number, ccy: number,
        left: number, top: number, right: number, bottom: number
      ) => {
        const dx = ccx - tcx;
        const dy = ccy - tcy;
        let minT = Infinity;
        const test = (t: number, x: number, y: number) => {
          if (t > 0 && t < 1 && x >= left && x <= right && y >= top && y <= bottom && t < minT) minT = t;
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

      let reducedMotion = false;

      const layoutLines = () => {
        const stage = stageRef.current;
        const svg = svgRef.current;
        const tooth = canvasWrapRef.current;
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
          const edge = intersectRect(tcx, tcy, cl + card.offsetWidth / 2, ct + card.offsetHeight / 2, cl, ct, cr, cb);

          const line = lineRefs.current[i];
          const dot = dotRefs.current[i];
          if (line) {
            line.setAttribute("x1", String(tcx));
            line.setAttribute("y1", String(tcy));
            line.setAttribute("x2", String(edge.x));
            line.setAttribute("y2", String(edge.y));
            const len = Math.hypot(edge.x - tcx, edge.y - tcy);
            gsap.set(line, { strokeDasharray: `${len} ${len}`, strokeDashoffset: reducedMotion ? 0 : len });
          }
          if (dot) {
            dot.setAttribute("cx", String(edge.x));
            dot.setAttribute("cy", String(edge.y));
            gsap.set(dot, { autoAlpha: reducedMotion ? 1 : 0 });
          }
        });
      };

      layoutLines();
      ScrollTrigger.addEventListener("refresh", layoutLines);

      const mm = gsap.matchMedia();

      /* ── Reduced motion: static, fully visible scene ──────── */
      mm.add("(prefers-reduced-motion: reduce)", () => {
        reducedMotion = true;
        loadFrames();
        setFrame(Math.floor(FRAME_COUNT / 2));
        layoutLines();
      });

      /* ── Desktop: pinned, scrubbed choreography ───────────── */
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const corner = [
          { x: -180, y: -90, rotation: -5 },
          { x: 180, y: -90, rotation: 5 },
          { x: -180, y: 90, rotation: 5 },
          { x: 180, y: 90, rotation: -5 },
        ];
        corner.forEach((s, i) => {
          gsap.set(`.dps-card-${i + 1}`, {
            autoAlpha: 0,
            x: isRtl ? -s.x : s.x,
            y: s.y,
            rotation: isRtl ? -s.rotation : s.rotation,
            scale: 0.9,
          });
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=1800",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            onUpdate: (self) => setFrame(Math.round(self.progress * (FRAME_COUNT - 1))),
          },
          defaults: { ease: "power2.out" },
        });

        tl.fromTo(".dps-canvas-wrap", { scale: 0.9 }, { scale: 1.04, ease: "none", duration: 0.5 }, 0)
          .to(".dps-canvas-wrap", { scale: 1, ease: "none", duration: 0.5 }, 0.5)
          .fromTo(".dps-glow", { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, ease: "none", duration: 0.6 }, 0.1);

        [".dps-card-1", ".dps-card-2", ".dps-card-3", ".dps-card-4"].forEach((sel, i) => {
          tl.to(sel, { autoAlpha: 1, x: 0, y: 0, rotation: 0, scale: 1, duration: 0.2, ease: "power3.out" }, 0.06 + i * 0.14);
        });

        [".dps-line-1", ".dps-line-2", ".dps-line-3", ".dps-line-4"].forEach((sel, i) => {
          tl.to(sel, { strokeDashoffset: 0, duration: 0.16, ease: "power2.inOut" }, 0.64 + i * 0.05);
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

        return () => pulse.kill();
      });

      /* ── Mobile: light scrub, no pin ──────────────────────── */
      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        const offset = 140;
        [-offset, offset, -offset, offset].forEach((x, i) => {
          gsap.set(`.dps-card-${i + 1}`, { autoAlpha: 0, x: isRtl ? -x : x, scale: 0.9 });
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "bottom 25%",
            scrub: 1,
            onUpdate: (self) => setFrame(Math.round(self.progress * (FRAME_COUNT - 1))),
          },
          defaults: { ease: "power2.out" },
        });

        tl.fromTo(".dps-canvas-wrap", { scale: 0.94 }, { scale: 1.02, ease: "none", duration: 0.5 }, 0)
          .to(".dps-canvas-wrap", { scale: 1, ease: "none", duration: 0.5 }, 0.5)
          .fromTo(".dps-glow", { autoAlpha: 0 }, { autoAlpha: 1, ease: "none", duration: 0.5 }, 0.1);

        [".dps-card-1", ".dps-card-2", ".dps-card-3", ".dps-card-4"].forEach((sel, i) => {
          tl.to(sel, { autoAlpha: 1, x: 0, scale: 1, duration: 0.2, ease: "power3.out" }, 0.1 + i * 0.13);
        });
      });

      return () => {
        ScrollTrigger.removeEventListener("refresh", layoutLines);
        io.disconnect();
        ro.disconnect();
      };
    },
    // revertOnUpdate: without it a language switch re-adds the callback without
    // reverting — stacking a second pinned ScrollTrigger (nested pin-spacers),
    // duplicate observers and refresh listeners.
    { scope: sectionRef, dependencies: [lang], revertOnUpdate: true }
  );

  const cardPositions = [
    "self-end justify-self-start md:self-start md:justify-self-start",
    "self-end justify-self-end md:self-start md:justify-self-end",
    "self-start justify-self-start md:self-end md:justify-self-start",
    "self-start justify-self-end md:self-end md:justify-self-end",
  ];

  return (
    <section ref={sectionRef} className="relative bg-white overflow-hidden" dir={isRtl ? "rtl" : "ltr"}>
      <div className="relative h-[560px] min-h-0 md:h-screen md:min-h-[680px] max-w-7xl mx-auto px-4 md:px-8 flex flex-col">
        {/* Headline */}
        <div className="dps-headline pt-0 md:pt-14 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#003867]/[0.06] text-[#00677d] text-[11px] font-bold uppercase tracking-[0.18em] ring-1 ring-[#00677d]/15">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            {c.eyebrow}
          </span>
          <h2 className="mt-2 md:mt-5 text-2xl sm:text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">{c.title}</h2>
        </div>

        {/* Stage: 2x2 grid, tooth canvas centered behind, cards in the corners */}
        <div
          ref={stageRef}
          className="relative flex-1 grid grid-cols-2 grid-rows-2 gap-x-2 gap-y-1 md:gap-6 py-0 md:py-10 items-stretch"
        >
          {/* SVG connector overlay — desktop only */}
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

          {/* Tooth canvas — centered on all sizes */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 md:z-30">
            <div
              ref={canvasWrapRef}
              className="dps-canvas-wrap relative w-[72%] max-w-[320px] md:w-[42%] md:max-w-[460px] aspect-square will-change-transform"
            >
              {/* Soft radial glow behind the tooth */}
              <div
                className="dps-glow absolute inset-[-12%] rounded-full will-change-transform"
                style={{
                  background:
                    "radial-gradient(circle, rgba(191,231,238,0.55) 0%, rgba(0,103,125,0.10) 45%, rgba(0,103,125,0) 70%)",
                }}
                aria-hidden
              />
              <canvas ref={canvasRef} role="img" aria-label={c.canvasAlt} className="relative w-full h-full" />
            </div>
          </div>

          {/* 4 promise cards */}
          {c.promises.map((p, i) => (
            <div
              key={i}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className={`dps-card-${i + 1} group relative z-30 md:z-10 ${cardPositions[i]} w-[97%] sm:w-[92%] md:w-[38%] max-w-none sm:max-w-none md:max-w-[340px] will-change-transform`}
            >
              <div className="relative bg-white/95 backdrop-blur rounded-2xl p-2.5 md:p-6 border border-slate-200/80 shadow-[0_18px_42px_-18px_rgba(0,56,103,0.38)] md:shadow-[0_28px_60px_-20px_rgba(0,56,103,0.30)] flex flex-row items-center gap-2.5 md:gap-0 md:flex-col md:items-start overflow-hidden">
                <span className="absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r from-[#003867]/0 via-[#00677d] to-[#003867]/0 opacity-70" aria-hidden />
                <div className="shrink-0 w-9 h-9 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-[#003867] to-[#00677d] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[19px] md:text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {p.icon}
                  </span>
                </div>
                <div className="min-w-0 flex-1 md:mt-4">
                  <h3 className="text-[13px] md:text-base font-extrabold text-slate-900 leading-[1.2] md:leading-snug break-words">
                    {p.title}
                  </h3>
                  <p className="hidden md:block md:mt-2 md:text-[13px] md:text-slate-600 md:leading-relaxed">{p.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, MotionPathPlugin);

/**
 * Animated morning-sky backdrop for the pediatric hero.
 *  - Glowing sun with a pulsing halo and slowly rotating rays.
 *  - Gradient clouds: two drift across the whole sky on a loop, two bob in place.
 *  - A paper plane flies along a dotted flight path every few seconds.
 *  - Small rainbow, sparkles and confetti for storybook charm.
 *  - Everything is decorative, behind the content, and respects
 *    prefers-reduced-motion (static scene, plane hidden).
 */
export default function KidsHeroBg() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        gsap.set(".kbg-plane", { autoAlpha: 0 });
        return;
      }

      // Sun: slow ray rotation + breathing halo.
      gsap.to(".kbg-sun-rays", { rotation: 360, duration: 60, ease: "none", repeat: -1, transformOrigin: "50% 50%" });
      gsap.to(".kbg-sun-halo", { scale: 1.18, opacity: 0.55, duration: 3.2, ease: "sine.inOut", repeat: -1, yoyo: true });

      // Two clouds traverse the whole sky, endlessly.
      gsap.utils.toArray<HTMLElement>(".kbg-cloud-traverse").forEach((el, i) => {
        const distance = window.innerWidth + 400;
        gsap.fromTo(
          el,
          { x: -320 },
          { x: distance, duration: 75 + i * 28, ease: "none", repeat: -1, delay: i * -38 }
        );
      });

      // Two clouds just breathe in place.
      gsap.utils.toArray<HTMLElement>(".kbg-cloud-bob").forEach((el, i) => {
        gsap.to(el, {
          x: i % 2 === 0 ? "+=42" : "-=36",
          y: i % 2 === 0 ? "-=10" : "+=8",
          duration: 11 + i * 3,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });

      // Paper plane along the dotted flight path, with soft takeoff/landing fades.
      const planeTl = gsap.timeline({ repeat: -1, repeatDelay: 4.5 });
      planeTl
        .set(".kbg-plane", { autoAlpha: 0 })
        .to(".kbg-plane", { autoAlpha: 1, duration: 0.6 }, 0.3)
        .to(
          ".kbg-plane",
          {
            motionPath: { path: "#kbg-flightpath", align: "#kbg-flightpath", alignOrigin: [0.5, 0.5], autoRotate: 18 },
            duration: 13,
            ease: "power1.inOut",
          },
          0
        )
        .to(".kbg-plane", { autoAlpha: 0, duration: 0.8 }, 12.0);

      // Sparkle twinkles + drifting confetti.
      gsap.utils.toArray<HTMLElement>(".kbg-twinkle").forEach((el, i) => {
        gsap.to(el, {
          opacity: 0.2,
          scale: 0.7,
          transformOrigin: "50% 50%",
          duration: 1.6 + (i % 3) * 0.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: i * 0.4,
        });
      });
      gsap.utils.toArray<HTMLElement>(".kbg-drift").forEach((el, i) => {
        gsap.to(el, {
          y: i % 2 === 0 ? "-=14" : "+=12",
          rotation: i % 2 === 0 ? 6 : -5,
          duration: 5 + (i % 3),
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });
    },
    { scope: wrapRef }
  );

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0 overflow-hidden pointer-events-none isolate"
      aria-hidden="true"
    >
      {/* Morning sky */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #DDF0FE 0%, #ECF7FE 38%, #FDFBF6 78%, #ffffff 100%)",
        }}
      />
      {/* Warm glow rising from the sun's corner */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 46% 40% at 86% 6%, rgba(255,214,107,0.35) 0%, rgba(255,214,107,0) 70%), radial-gradient(ellipse 50% 44% at 6% 84%, rgba(0,103,125,0.08) 0%, rgba(0,103,125,0) 72%)",
        }}
      />

      {/* Fine polka texture */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "radial-gradient(rgba(0,77,153,0.10) 1.5px, transparent 1.6px)",
          backgroundSize: "30px 30px",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 45%, black 0%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 45%, black 0%, transparent 80%)",
        }}
      />

      {/* Paper grain */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ── Sun ── */}
      <div className="absolute top-6 md:top-10 right-[5%] md:right-[7%] w-20 h-20 md:w-32 md:h-32">
        {/* Halo */}
        <div
          className="kbg-sun-halo absolute -inset-8 md:-inset-12 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,200,61,0.4) 0%, rgba(255,200,61,0) 65%)" }}
        />
        {/* Rays */}
        <svg className="kbg-sun-rays absolute -inset-5 md:-inset-7 w-[calc(100%+2.5rem)] h-[calc(100%+2.5rem)] md:w-[calc(100%+3.5rem)] md:h-[calc(100%+3.5rem)]" viewBox="0 0 100 100" fill="none">
          {Array.from({ length: 12 }).map((_, i) => (
            <rect
              key={i}
              x="48.6"
              y={i % 2 === 0 ? "2" : "5.5"}
              width="2.8"
              height={i % 2 === 0 ? "11" : "7"}
              rx="1.4"
              fill="#FFC83D"
              opacity={i % 2 === 0 ? 0.95 : 0.65}
              transform={`rotate(${i * 30} 50 50)`}
            />
          ))}
        </svg>
        {/* Core */}
        <div
          className="absolute inset-0 rounded-full shadow-[0_10px_36px_rgba(255,179,0,0.45)]"
          style={{ background: "radial-gradient(circle at 34% 30%, #FFE9A8 0%, #FFC83D 52%, #FFAE00 100%)" }}
        />
      </div>

      {/* ── Dotted flight path + paper plane (desktop sky only) ── */}
      <svg
        className="hidden md:block absolute top-0 left-0 w-full h-[300px]"
        viewBox="0 0 1440 300"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <path
          id="kbg-flightpath"
          d="M -70 200 C 170 90, 330 240, 560 160 C 670 122, 668 52, 600 72 C 538 90, 612 170, 770 140 C 990 98, 1190 170, 1520 92"
          stroke="#8FB9DD"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="0.5 12"
          opacity="0.65"
        />
        <g className="kbg-plane">
          <path d="M0 0 L26 8 L4 13 L6 19 Z" fill="#0067B2" transform="translate(-13,-9)" />
          <path d="M4 13 L26 8 L10 24 Z" fill="#7DC8F7" transform="translate(-13,-9)" />
        </g>
      </svg>

      {/* ── Clouds ── */}
      <Cloud id="ct1" className="kbg-cloud-traverse absolute top-[9%] left-0 w-36 md:w-44 opacity-90" />
      <Cloud id="ct2" className="kbg-cloud-traverse absolute top-[30%] left-0 w-24 md:w-32 opacity-60 hidden md:block" />
      <Cloud id="cb1" className="kbg-cloud-bob absolute top-[6%] left-[34%] w-28 md:w-36 opacity-75" />
      <Cloud id="cb2" className="kbg-cloud-bob absolute top-[40%] right-[12%] w-20 md:w-28 opacity-50 hidden md:block" />

      {/* ── Small rainbow (desktop only — collides with content on mobile) ── */}
      <svg className="kbg-drift hidden md:block absolute top-[44%] left-[3%] w-28 md:w-36 opacity-70" viewBox="0 0 200 110" fill="none">
        <path d="M14 104 C 14 44, 186 44, 186 104" stroke="#7DC8F7" strokeWidth="6" strokeLinecap="round" />
        <path d="M34 104 C 34 62, 166 62, 166 104" stroke="#FFC83D" strokeWidth="6" strokeLinecap="round" />
        <path d="M54 104 C 54 80, 146 80, 146 104" stroke="#F9A8C0" strokeWidth="6" strokeLinecap="round" />
      </svg>

      {/* ── Sparkles & confetti (desktop only — the mobile column is text-dense) ── */}
      <Sparkle className="kbg-drift kbg-twinkle hidden md:block absolute top-[20%] left-[26%] w-6 text-[#FFC83D]" />
      <Sparkle className="kbg-drift kbg-twinkle hidden md:block absolute top-[58%] left-[12%] w-5 text-[#7DC8F7]" />
      <Sparkle className="kbg-drift kbg-twinkle hidden md:block absolute top-[14%] right-[30%] w-4 text-[#F9A8C0]" />
      <Sparkle className="kbg-drift kbg-twinkle hidden md:block absolute bottom-[26%] right-[20%] w-6 text-[#00677d]" />
      {[
        { t: "66%", l: "42%", c: "#F9A8C0" },
        { t: "36%", l: "90%", c: "#FFC83D" },
        { t: "74%", l: "72%", c: "#7DC8F7" },
      ].map((d, i) => (
        <span
          key={i}
          className="kbg-drift hidden md:block absolute w-2 h-2 rounded-full opacity-50"
          style={{ top: d.t, left: d.l, backgroundColor: d.c }}
        />
      ))}

      {/* Soft ground wave into the next section */}
      <svg
        className="absolute bottom-0 left-0 w-full text-white"
        viewBox="0 0 1440 110"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,70 C240,110 480,104 720,76 C960,48 1200,30 1440,62 L1440,110 L0,110 Z"
        />
      </svg>
    </div>
  );
}

/** Puffy cloud built from overlapping circles sharing one userSpaceOnUse
 *  gradient, so the union paints seamlessly (white top → sky-tint base). */
function Cloud({ id, className }: { id: string; className?: string }) {
  const gid = `kbg-cloud-g-${id}`;
  return (
    <svg
      className={className}
      viewBox="0 0 140 64"
      fill="none"
      style={{ filter: "drop-shadow(0 10px 14px rgba(0,103,178,0.10))" }}
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#DCEEFB" />
        </linearGradient>
      </defs>
      <g fill={`url(#${gid})`}>
        <circle cx="36" cy="40" r="19" />
        <circle cx="63" cy="30" r="24" />
        <circle cx="93" cy="38" r="17" />
        <rect x="20" y="38" width="92" height="20" rx="10" />
      </g>
    </svg>
  );
}

function Sparkle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3c.6 4 2.4 5.9 6.5 6.5C14.4 10.1 12.6 12 12 16c-.6-4-2.4-5.9-6.5-6.5C9.6 8.9 11.4 7 12 3z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.25"
      />
    </svg>
  );
}

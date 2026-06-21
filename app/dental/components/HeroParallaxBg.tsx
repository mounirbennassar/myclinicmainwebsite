"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Comfortable, modern dental hero background:
 *  - Clean clinical base using the existing blue/teal brand colors.
 *  - A masked herodental.png echo for warmth without competing with the hero photo.
 *  - Fine blueprint grid and soft light bands animated with GSAP.
 *  - Respects prefers-reduced-motion.
 */
export default function HeroParallaxBg() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) return;

      gsap.to(".hpx-photo", {
        xPercent: -2,
        yPercent: 1.5,
        scale: 1.035,
        duration: 12,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.to(".hpx-grid", {
        backgroundPositionX: "+=56px",
        backgroundPositionY: "+=56px",
        duration: 26,
        ease: "none",
        repeat: -1,
      });

      gsap.to(".hpx-grid-fine", {
        backgroundPositionX: "-=24px",
        backgroundPositionY: "+=24px",
        duration: 18,
        ease: "none",
        repeat: -1,
      });

      gsap.utils.toArray<HTMLDivElement>(".hpx-band").forEach((el, i) => {
        gsap.to(el, {
          xPercent: i % 2 === 0 ? 7 : -6,
          yPercent: i % 2 === 0 ? -5 : 4,
          opacity: i % 2 === 0 ? 0.85 : 0.65,
          duration: 9 + i * 2,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });

      gsap.to(".hpx-scan", {
        xPercent: 55,
        opacity: 0.55,
        duration: 11,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0 overflow-hidden pointer-events-none isolate"
      aria-hidden="true"
    >
      {/* Calm clinical base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #ffffff 0%, #f8fbfd 43%, #eef8fb 100%)",
        }}
      />

      {/* Real dental image echo, masked so it feels like atmosphere instead of a second card. */}
      <div
        className="hpx-photo absolute -top-12 -bottom-20 right-[-18%] hidden w-[78%] md:block will-change-transform"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.15) 24%, rgba(0,0,0,0.72) 54%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.15) 24%, rgba(0,0,0,0.72) 54%, transparent 100%)",
        }}
      >
        <Image
          src="/dental/herodental.webp"
          alt=""
          fill
          sizes="(min-width: 1024px) 62vw, 100vw"
          quality={55}
          loading="lazy"
          className="object-cover object-center opacity-[0.17] saturate-[0.8]"
        />
      </div>

      {/* Brand color washes, broad and quiet. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 58% 46% at 78% 18%, rgba(0,103,125,0.14) 0%, rgba(0,103,125,0) 70%), radial-gradient(ellipse 50% 40% at 12% 88%, rgba(0,56,103,0.10) 0%, rgba(0,56,103,0) 72%)",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(110deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.50) 42%, rgba(255,255,255,0.72) 100%)",
        }}
      />

      {/* Animated blueprint grid, masked to keep the content area calm. */}
      <div
        className="hpx-grid absolute inset-0 opacity-[0.42]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,103,125,0.14) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,103,125,0.14) 1px, transparent 1px)
          `,
          backgroundSize: "56px 56px",
          backgroundPosition: "0 0",
          maskImage:
            "linear-gradient(90deg, rgba(0,0,0,0.30), rgba(0,0,0,0.82) 48%, rgba(0,0,0,0.18)), linear-gradient(180deg, transparent 0%, black 18%, black 76%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(90deg, rgba(0,0,0,0.30), rgba(0,0,0,0.82) 48%, rgba(0,0,0,0.18)), linear-gradient(180deg, transparent 0%, black 18%, black 76%, transparent 100%)",
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />

      <div
        className="hpx-grid-fine absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,56,103,0.18) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,56,103,0.18) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
          maskImage:
            "radial-gradient(ellipse 70% 62% at 64% 46%, black 0%, transparent 76%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 62% at 64% 46%, black 0%, transparent 76%)",
        }}
      />

      {/* Smooth animated light bands. */}
      <div
        className="hpx-band absolute -left-[18%] top-[14%] h-36 w-[72%] -rotate-[12deg] rounded-full blur-3xl will-change-transform"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0), rgba(191,231,238,0.42), rgba(255,255,255,0))",
        }}
      />
      <div
        className="hpx-band absolute right-[-22%] bottom-[8%] h-40 w-[76%] rotate-[10deg] rounded-full blur-3xl will-change-transform"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0), rgba(0,103,125,0.16), rgba(255,255,255,0))",
        }}
      />

      {/* A subtle moving vertical sheen that makes the grid feel alive. */}
      <div
        className="hpx-scan absolute -top-20 bottom-[-20%] left-[22%] w-40 rotate-[14deg] will-change-transform"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 48%, rgba(191,231,238,0.18) 52%, transparent 100%)",
          filter: "blur(18px)",
          opacity: 0.32,
        }}
      />

      {/* Subtle noise grain for premium texture */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}

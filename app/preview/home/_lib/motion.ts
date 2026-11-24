"use client";

/**
 * The v2 home's motion engine. ONE hook owns every scroll-linked animation so
 * the order is guaranteed: ScrollSmoother must exist before any ScrollTrigger
 * is created (React runs child effects before parent effects, so triggers set
 * up inside the sections would be born before the smoother and pin wrongly).
 *
 * Sections only declare intent with data attributes:
 *   [data-rv]            reveal once on enter (sets data-in; CSS does the rest)
 *   [data-parallax]      image drifts against the scroll (≥768px)
 *   [data-zoom-in]       image settles from a slight zoom as it enters
 *   [data-hero] / [data-hero-copy] / [data-hero-media]   hero scroll-out
 *   [data-hscroll] + [data-hscroll-track]   pinned horizontal gallery (desktop)
 *   [data-ticker]        velocity-reactive marquee
 *   [data-expand]        panel that grows from an inset to full bleed
 *   [data-magnetic]      pointer-magnetic button (fine pointers)
 *
 * GSAP only ever writes transforms/opacity and data-* attributes — never
 * className or text — so React re-renders can't fight it (see the /my360
 * removeChild crash in the perf notes).
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useGSAP } from "@gsap/react";
import type { RefObject } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother);

const HEADER_OFFSET = 84;

/** Smooth-scroll to an element id, through the smoother when one is running. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const smoother = ScrollSmoother.get();
  if (smoother) {
    smoother.scrollTo(el, !reduce, `top ${HEADER_OFFSET}px`);
    return;
  }
  const y = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
}

export function scrollToTop() {
  const smoother = ScrollSmoother.get();
  if (smoother) smoother.scrollTo(0, true);
  else window.scrollTo({ top: 0, behavior: "smooth" });
}

/** Re-measure every trigger after a layout change (expand/collapse, etc.). */
export function refreshScroll(delay = 0) {
  window.setTimeout(() => ScrollTrigger.refresh(), delay);
}

export function useHomeMotion(rootRef: RefObject<HTMLDivElement | null>, isRtl: boolean) {
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const q = (sel: string) => Array.from(root.querySelectorAll<HTMLElement>(sel));
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const cleanups: (() => void)[] = [];

      /* ── Reveals ─────────────────────────────────────────────────
         Mark everything already on screen as revealed BEFORE switching
         the hidden state on, so nothing visible ever blinks out. */
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            (e.target as HTMLElement).dataset.in = "";
            io.unobserve(e.target);
          }
        },
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
      );
      const vh = window.innerHeight;
      for (const el of q("[data-rv]")) {
        if (el.dataset.in !== undefined) continue;
        if (reduce || el.getBoundingClientRect().top < vh * 0.92) el.dataset.in = "";
        else io.observe(el);
      }
      root.dataset.motion = reduce ? "off" : "on";
      cleanups.push(() => io.disconnect());

      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop: "(min-width: 1024px)",
          tablet: "(min-width: 768px)",
          fine: "(pointer: fine)",
          motion: "(prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { desktop, tablet, fine, motion } = ctx.conditions as Record<string, boolean>;
          const wrapper = root.querySelector<HTMLElement>("#hv2-wrapper");
          const content = root.querySelector<HTMLElement>("#hv2-content");

          // 1. Smooth scrolling — desktop + mouse only. Touch devices keep
          //    native momentum scrolling (and its address-bar behaviour).
          if (desktop && fine && motion && wrapper && content) {
            ScrollSmoother.create({
              wrapper,
              content,
              smooth: 1.15,
              effects: true,
              smoothTouch: false,
            });
          }

          // 2. Header state, progress bar, floating actions.
          const header = root.querySelector<HTMLElement>("[data-hv2-header]");
          const fabs = root.querySelector<HTMLElement>("[data-hv2-fabs]");
          const bar = root.querySelector<HTMLElement>("#hv2-progress");
          const setBar = bar ? gsap.quickSetter(bar, "scaleX") : null;
          const hero = root.querySelector<HTMLElement>("[data-hero]");
          ScrollTrigger.create({
            start: 0,
            end: "max",
            onUpdate: (self) => {
              const y = self.scroll();
              setBar?.(self.progress);
              if (header) {
                header.dataset.solid = String(y > 40);
                header.dataset.hidden = String(self.direction === 1 && y > 640);
              }
              if (fabs) fabs.dataset.show = String(y > (hero?.offsetHeight ?? 700) * 0.55);
            },
          });

          if (!motion) return;

          // 3. Hero scroll-out: copy lifts and fades, photo sinks slower.
          const heroCopy = root.querySelector("[data-hero-copy]");
          const heroMedia = root.querySelector("[data-hero-media]");
          if (hero && heroCopy) {
            gsap.to(heroCopy, {
              yPercent: -14,
              opacity: 0,
              ease: "none",
              scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
            });
          }
          if (hero && heroMedia && tablet) {
            gsap.to(heroMedia, {
              yPercent: 16,
              ease: "none",
              scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
            });
          }

          // 4. Parallax + zoom-settle on imagery.
          if (tablet) {
            for (const el of q("[data-parallax]")) {
              const amt = Number(el.dataset.parallax || 8);
              gsap.fromTo(
                el,
                { yPercent: -amt },
                {
                  yPercent: amt,
                  ease: "none",
                  scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
                }
              );
            }
          }
          for (const el of q("[data-zoom-in]")) {
            gsap.fromTo(
              el,
              { scale: 1.16 },
              {
                scale: 1,
                ease: "none",
                scrollTrigger: { trigger: el, start: "top bottom", end: "top 35%", scrub: true },
              }
            );
          }

          // 5. Panels that open from an inset card to full bleed.
          if (tablet) {
            for (const el of q("[data-expand]")) {
              gsap.fromTo(
                el,
                { clipPath: "inset(7% 5% 7% 5% round 48px)" },
                {
                  clipPath: "inset(0% 0% 0% 0% round 32px)",
                  ease: "none",
                  scrollTrigger: { trigger: el, start: "top bottom", end: "top 30%", scrub: true },
                }
              );
            }
          }

          // 6. Programs: pinned horizontal gallery (desktop). Below 1024px the
          //    track is a native snap-scroller instead — see .hscroll-viewport.
          const hs = root.querySelector<HTMLElement>("[data-hscroll]");
          const track = root.querySelector<HTMLElement>("[data-hscroll-track]");
          const hsBar = root.querySelector<HTMLElement>("[data-hscroll-bar]");
          if (desktop && hs && track) {
            const dist = () => Math.max(0, track.scrollWidth - track.parentElement!.clientWidth);
            gsap.to(track, {
              x: () => (isRtl ? 1 : -1) * dist(),
              ease: "none",
              scrollTrigger: {
                trigger: hs,
                start: "top top",
                end: () => `+=${dist()}`,
                pin: true,
                scrub: 0.9,
                invalidateOnRefresh: true,
                anticipatePin: 1,
                onUpdate: (self) => {
                  if (hsBar) gsap.set(hsBar, { scaleX: self.progress });
                },
              },
            });
          }

          // 7. Ticker: constant drift that surges with scroll velocity and
          //    follows the scroll direction; paused while off screen.
          q("[data-ticker]").forEach((el, i) => {
            const forward = i % 2 === 0;
            const loop = gsap.fromTo(
              el,
              { xPercent: forward ? 0 : -50 },
              { xPercent: forward ? -50 : 0, duration: 42, ease: "none", repeat: -1 }
            );
            // Park the playhead far from zero so a reversed timeScale (scrolling
            // up) has room to run backwards instead of stalling at the start.
            loop.totalTime(loop.duration() * 400);
            let dir = 1;
            ScrollTrigger.create({
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
              onUpdate: (self) => {
                const v = self.getVelocity();
                if (self.direction !== dir) dir = self.direction;
                const boost = Math.min(Math.abs(v) / 260, 6);
                gsap.to(loop, {
                  timeScale: dir * (1 + boost),
                  duration: 0.25,
                  overwrite: true,
                  onComplete: () => {
                    gsap.to(loop, { timeScale: dir, duration: 1.4, ease: "power2.out" });
                  },
                });
              },
            });
          });

          // 8. Magnetic buttons. Listeners are released by the returned
          //    cleanup, which matchMedia runs whenever a condition flips.
          const unbind: (() => void)[] = [];
          if (fine) {
            for (const el of q("[data-magnetic]")) {
              const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
              const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
              const move = (e: PointerEvent) => {
                const r = el.getBoundingClientRect();
                xTo((e.clientX - (r.left + r.width / 2)) * 0.22);
                yTo((e.clientY - (r.top + r.height / 2)) * 0.32);
              };
              const leave = () => {
                xTo(0);
                yTo(0);
              };
              el.addEventListener("pointermove", move);
              el.addEventListener("pointerleave", leave);
              unbind.push(() => {
                el.removeEventListener("pointermove", move);
                el.removeEventListener("pointerleave", leave);
              });
            }
          }
          return () => unbind.forEach((fn) => fn());
        }
      );

      // Late layout shifts (web fonts swapping in) move every trigger.
      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      return () => {
        cleanups.forEach((fn) => fn());
        mm.revert();
      };
    },
    // revertOnUpdate is load-bearing: without it @gsap/react re-runs the
    // callback on a language switch WITHOUT reverting, stacking pinned
    // triggers and smoothers (same trap documented on /dental).
    { scope: rootRef, dependencies: [isRtl], revertOnUpdate: true }
  );
}

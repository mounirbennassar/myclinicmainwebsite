"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";

/** Right-pointing arrow; mirrored in RTL by the .flip-rtl rule. */
export function Arrow({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={`flip-rtl ${className}`} aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowUpRight({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function PhoneIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}

/**
 * A display heading split into masked lines that rise into place when the
 * heading scrolls into view (driven by [data-rv] → data-in, see motion.ts).
 * Lines are given explicitly per language — Arabic must never be split into
 * characters (it would break the letter joins), and explicit lines keep the
 * typographic rhythm the design intends.
 */
export function Lines({
  lines,
  as: Tag = "h2",
  className = "",
  mutedLast = false,
  delay = 0,
}: {
  lines: readonly string[];
  as?: ElementType;
  className?: string;
  /** Render the final line in a softer tone (the v5 "all of you." treatment). */
  mutedLast?: boolean;
  delay?: number;
}) {
  return (
    <Tag className={`display ${className}`} data-rv="" style={{ "--d": `${delay}ms` } as CSSProperties}>
      {lines.map((line, i) => (
        <span key={i} className="ln">
          <span style={{ "--i": i } as CSSProperties} className={mutedLast && i === lines.length - 1 ? "opacity-55" : undefined}>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}

/** Eyebrow + heading + optional side copy, the recurring v5 section header. */
export function SectionHead({
  eyebrow,
  lines,
  side,
  tone = "light",
  className = "",
}: {
  eyebrow: string;
  lines: readonly string[];
  side?: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div className={`flex flex-col lg:flex-row lg:items-end justify-between gap-8 ${className}`}>
      <div>
        <p data-rv="" className={`rv eyebrow mb-5 ${tone === "dark" ? "text-glow" : "text-primary"}`}>
          {eyebrow}
        </p>
        <Lines lines={lines} className="text-[2.75rem] sm:text-6xl lg:text-7xl leading-[.95] text-balance" />
      </div>
      {side ? (
        <div data-rv="" className="rv" style={{ "--d": "150ms" } as CSSProperties}>
          {side}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Counts up from 0 when scrolled into view. The number is React state, so
 * React owns the text node the whole time (GSAP writing textContent into
 * React children is what crashed /my360 on a language switch).
 */
export function CountUp({ to, duration = 1600, prefix = "", suffix = "", className = "" }: { to: number; duration?: number; prefix?: string; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(to);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || started.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    // Only animate counters that start below the fold; one already in view
    // keeps its final value (no flash of "0" on first paint).
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    // Park it at 0 on the next frame (it is below the fold, so unseen).
    let raf = requestAnimationFrame(() => setValue(0));
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        started.current = true;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          setValue(Math.round(to * (1 - Math.pow(1 - t, 3))));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`} dir="ltr">
      {`${prefix}${value.toLocaleString("en-US")}${suffix}`}
    </span>
  );
}

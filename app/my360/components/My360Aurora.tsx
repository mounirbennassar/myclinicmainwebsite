"use client";

import { useEffect, useRef } from "react";

/**
 * Animated hero backdrop: a slowly drifting constellation of navy dots that
 * link up when they come close, echoing the dot-star mark in the My360 logo.
 *
 * Deliberately cheap:
 *  - the coloured "aurora" wash is CSS gradients, not canvas paint;
 *  - the canvas only draws dots and short lines, no shadows or blurs;
 *  - the RAF loop stops when the hero scrolls out of view or the tab is hidden,
 *    so it never burns battery behind the rest of the page;
 *  - phones and `prefers-reduced-motion` paint one static frame, no rAF at all.
 *
 * Node count scales with area, capped, so a phone does far less work than a
 * desktop rather than the same work on fewer pixels.
 */

type Node = { x: number; y: number; vx: number; vy: number; r: number };

const NAVY = "0, 56, 104";
const LINK_DIST = 132; // px at CSS scale — beyond this, no line is drawn

export default function My360Aurora({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Hold the field still on phones and under reduced motion — a single
    // painted frame, no rAF loop. Phones are where the compositor was already
    // under pressure, and a drifting constellation is not worth the battery.
    const still =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(max-width: 767px)").matches;

    let nodes: Node[] = [];
    let width = 0;
    let height = 0;
    let raf = 0;
    let running = false;
    // Pointer parallax, in CSS px, eased toward the real cursor each frame.
    let px = 0, py = 0, tx = 0, ty = 0;

    const dpr = () => Math.min(window.devicePixelRatio || 1, 2);

    const seed = () => {
      // ~1 node per 13k CSS px², clamped so neither extreme gets silly.
      const count = Math.round(Math.min(90, Math.max(26, (width * height) / 13000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        r: 1.1 + Math.random() * 2.2,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      width = rect.width;
      height = rect.height;
      const ratio = dpr();
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      seed();
      // Paint immediately rather than waiting on the first rAF — otherwise the
      // field is blank for a frame, and stays blank entirely on phones, under
      // reduced motion, or whenever rAF is throttled (backgrounded tab).
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Links first, so dots sit on top of them.
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK_DIST * LINK_DIST) continue;
          const alpha = (1 - Math.sqrt(d2) / LINK_DIST) * 0.17;
          ctx.strokeStyle = `rgba(${NAVY}, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x + px, nodes[i].y + py);
          ctx.lineTo(nodes[j].x + px, nodes[j].y + py);
          ctx.stroke();
        }
      }

      for (const n of nodes) {
        // Bigger dots sit "closer", so they take more of the parallax shift.
        const depth = n.r / 3.3;
        ctx.fillStyle = `rgba(${NAVY}, ${0.16 + depth * 0.34})`;
        ctx.beginPath();
        ctx.arc(n.x + px * depth * 2, n.y + py * depth * 2, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const tick = () => {
      px += (tx - px) * 0.045;
      py += (ty - py) * 0.045;
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        // Wrap with a margin so dots never pop at the edge.
        if (n.x < -20) n.x = width + 20;
        else if (n.x > width + 20) n.x = -20;
        if (n.y < -20) n.y = height + 20;
        else if (n.y > height + 20) n.y = -20;
      }
      draw();
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || still) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      tx = ((e.clientX - rect.left) / rect.width - 0.5) * 22;
      ty = ((e.clientY - rect.top) / rect.height - 0.5) * 22;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Only animate while the hero is actually on screen.
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting && !document.hidden ? start() : stop()),
      { threshold: 0 }
    );
    io.observe(canvas);

    if (!still) {
      window.addEventListener("pointermove", onPointer, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
    }

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {/* Colour wash — three soft radial blobs drifting on long, offset cycles.
          CSS-driven so the canvas stays a cheap dots-and-lines pass. */}
      <div className="my360-blob my360-blob-a" />
      <div className="my360-blob my360-blob-b" />
      <div className="my360-blob my360-blob-c" />

      {/* Fine dot grid, faded out toward the bottom-right — straight from the
          design. Kept light: a photo now sits behind it. */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "radial-gradient(rgba(0,56,104,.10) 2.2px, transparent 2.2px)",
          backgroundSize: "26px 26px",
          maskImage: "linear-gradient(115deg, rgba(0,0,0,.9), transparent 62%)",
          WebkitMaskImage: "linear-gradient(115deg, rgba(0,0,0,.9), transparent 62%)",
        }}
      />

      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Fade the whole field into the page background at the bottom. */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-white" />
    </div>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import translations from "@/app/i18n/translations";
import { BRANCHES, COPY, formatHour, isBranchOpen, pick, riyadhNow, type Branch } from "../_lib/content";
import { Arrow, ArrowUpRight, SectionHead } from "./ui";

type City = "all" | "Jeddah" | "Riyadh";

export default function Locations({ isRtl, onBook }: { isRtl: boolean; onBook: (city: Branch["city"]) => void }) {
  const t = translations[isRtl ? "ar" : "en"];
  const [city, setCity] = useState<City>("all");
  // Open/closed depends on the clock, so it is computed after hydration only —
  // rendering it on the server would bake a stale status into cached HTML.
  const [now, setNow] = useState<{ day: number; hour: number } | null>(null);
  const [progress, setProgress] = useState({ ratio: 0, index: 1 });
  const trackRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState({ x: 0, w: 0 });

  useEffect(() => {
    const tick = () => setNow(riyadhNow());
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const visible = city === "all" ? BRANCHES : BRANCHES.filter((b) => b.city === city);
  const tabs: { id: City; label: string }[] = [
    { id: "all", label: pick(COPY.allCities, isRtl) },
    { id: "Jeddah", label: t.jeddah },
    { id: "Riyadh", label: t.riyadh },
  ];

  // Sliding pill under the active tab (measured, so it works in both directions).
  useLayoutEffect(() => {
    const wrap = tabsRef.current;
    const active = wrap?.querySelector<HTMLElement>(`[data-city="${city}"]`);
    if (!wrap || !active) return;
    const measure = () => setPill({ x: active.offsetLeft, w: active.offsetWidth });
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [city, isRtl]);

  const update = () => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".loc-card");
    const stepW = (card?.offsetWidth ?? 300) + 16;
    const max = el.scrollWidth - el.clientWidth;
    const left = Math.abs(el.scrollLeft);
    const perView = Math.max(1, Math.round(el.clientWidth / stepW));
    setProgress({
      ratio: max > 0 ? Math.max(left / max, perView / visible.length) : 1,
      index: Math.min(visible.length, Math.round(left / stepW) + perView),
    });
  };
  useEffect(() => {
    trackRef.current?.scrollTo({ left: 0 });
    update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city]);

  const step = (dir: 1 | -1) => {
    const el = trackRef.current;
    const card = el?.querySelector<HTMLElement>(".loc-card");
    el?.scrollBy({ left: dir * (isRtl ? -1 : 1) * ((card?.offsetWidth ?? 300) + 16), behavior: "smooth" });
  };

  return (
    <section id="locations" className="bg-ink text-white py-24 sm:py-32 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10">
        <SectionHead
          tone="dark"
          className="mb-12"
          eyebrow={t.ourLocations}
          lines={isRtl ? COPY.locTitle.ar : COPY.locTitle.en}
          side={
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div ref={tabsRef} className="relative inline-flex rounded-full bg-white/10 p-1 w-fit" role="tablist" aria-label={isRtl ? "تصفية الفروع حسب المدينة" : "Filter branches by city"}>
                <span className="tab-pill absolute top-1 bottom-1 left-0 rounded-full bg-white" style={{ width: pill.w, transform: `translateX(${pill.x}px)` }} aria-hidden="true" />
                {tabs.map((tb) => (
                  <button
                    key={tb.id}
                    type="button"
                    role="tab"
                    data-city={tb.id}
                    aria-selected={city === tb.id}
                    onClick={() => setCity(tb.id)}
                    className={`relative z-10 px-5 py-2.5 text-sm rounded-full transition-colors duration-500 cursor-pointer ${city === tb.id ? "text-ink" : "text-white/70 hover:text-white"}`}
                  >
                    {tb.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => step(-1)} aria-label={pick(COPY.prev, isRtl)} className="w-12 h-12 rounded-full border border-white/25 grid place-items-center hover:bg-white hover:text-ink transition-colors duration-500 cursor-pointer">
                  <Arrow className="w-4 h-4 rotate-180" />
                </button>
                <button type="button" onClick={() => step(1)} aria-label={pick(COPY.next, isRtl)} className="w-12 h-12 rounded-full bg-primary grid place-items-center hover:bg-white hover:text-ink transition-colors duration-500 cursor-pointer">
                  <Arrow />
                </button>
              </div>
            </div>
          }
        />

        <div ref={trackRef} onScroll={update} className="loc-track flex gap-4 overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0" aria-live="polite">
          {visible.map((b, i) => {
            const open = now ? isBranchOpen(b, now.day, now.hour) : null;
            return (
              <article
                key={`${city}-${b.id}`}
                className="loc-card zoom shrink-0 w-[86%] sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)] rounded-[24px] bg-white/5 border border-white/10 overflow-hidden flex flex-col hover:border-white/25 transition-colors"
                style={{ "--d": `${i * 80}ms` } as CSSProperties}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image src={b.image} alt={`${isRtl ? "عيادتي" : "My Clinic"} ${pick(b.name, isRtl)}`} fill sizes="(max-width: 640px) 86vw, (max-width: 1024px) 50vw, 33vw" quality={75} className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                  <span className="absolute top-4 start-4 rounded-full bg-ink/50 border border-white/20 px-3 py-1.5 text-[11px]">{b.city === "Jeddah" ? t.jeddah : t.riyadh}</span>
                  {open !== null && (
                    <span className={`absolute top-4 end-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] ${open ? "bg-primary text-white" : "bg-ink/70 text-white/80"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${open ? "bg-glow pulse" : "bg-white/40"}`} />
                      {pick(open ? COPY.openNow : COPY.closedNow, isRtl)}
                    </span>
                  )}
                  <h3 className="absolute bottom-4 start-5 display text-3xl">{pick(b.name, isRtl)}</h3>
                </div>
                <div className="p-6 sm:p-7 flex flex-col flex-1">
                  <p className="text-sm text-white/55">{pick(b.dental ? COPY.dentalClinic : COPY.multiSpecialty, isRtl)}</p>
                  <dl className="mt-5 flex flex-col text-sm">
                    {b.hours.map((h, k) => {
                      const today = now ? h.dayIdx.includes(now.day) : false;
                      return (
                        <div key={k} className={`flex justify-between gap-4 py-3 border-t border-white/10 ${today ? "text-white" : ""}`}>
                          <dt className={today ? "font-semibold" : "text-white/60"}>{pick(h.days, isRtl)}</dt>
                          <dd className={`tabular-nums ${h.from === null ? "text-white/40" : ""}`} dir={isRtl ? "rtl" : "ltr"}>
                            {h.from === null || h.to === null ? pick(COPY.closed, isRtl) : `${formatHour(h.from, isRtl)} – ${formatHour(h.to, isRtl)}`}
                          </dd>
                        </div>
                      );
                    })}
                  </dl>
                  <div className="mt-auto pt-6 flex gap-2">
                    <button type="button" onClick={() => onBook(b.city)} className="btn btn-light flex-1 inline-flex items-center justify-center gap-2 rounded-full py-3.5 text-sm font-medium cursor-pointer">
                      {pick(COPY.bookHere, isRtl)}
                      <span className="arrow">
                        <Arrow />
                      </span>
                    </button>
                    <a
                      href={b.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${pick(COPY.directions, isRtl)} ${pick(b.name, isRtl)}`}
                      className="w-12 h-12 shrink-0 rounded-full border border-white/25 grid place-items-center hover:bg-white hover:text-ink transition-colors duration-500"
                    >
                      <ArrowUpRight />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 flex items-center gap-6">
          <div className="flex-1 h-px bg-white/15 relative overflow-hidden">
            <div className="absolute inset-y-0 start-0 bg-white transition-[width] duration-500" style={{ width: `${progress.ratio * 100}%` }} />
          </div>
          <span className="text-xs text-white/60 tabular-nums" dir="ltr">
            {String(progress.index).padStart(2, "0")} / {String(visible.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}

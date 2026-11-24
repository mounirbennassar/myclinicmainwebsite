"use client";

import { useRouter } from "next/navigation";
import { Fragment, useEffect, useId, useMemo, useRef, useState, type CSSProperties, type FormEvent, type KeyboardEvent } from "react";
import translations, { type TranslationKey } from "@/app/i18n/translations";
import { doctorFilters, featuredFilterOrder, specNameToKey } from "@/app/lib/specialties";
import { BRANCHES, COPY, pick } from "../_lib/content";
import { Arrow } from "./ui";

/**
 * The hero's quick doctor finder. Native <select>s were replaced because they
 * pop the operating system's own menu — unstyled, abrupt, and unreadable over
 * the glass bar. These are custom listboxes: the panel glides up out of the
 * field (the bar sits at the bottom of the hero, and the hero clips its
 * overflow, so the panels always open upward), with search, groups, live
 * doctor counts and full keyboard support.
 */

export type FinderDoctor = { specialties: string[]; cities?: string[] };

type Option = { value: string; label: string; hint?: string; count?: number; group?: string };

// Search folds Arabic letter variants and drops diacritics, so "اطفال",
// "أطفال" and "pediatrics" all find the same row.
const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[ً-ٰٟ]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="m6 15 6-6 6 6" />
    </svg>
  );
}

function Dropdown({
  label,
  placeholder,
  value,
  options,
  onChange,
  open,
  onOpenChange,
  searchable = false,
  searchPlaceholder = "",
  emptyText,
  clearLabel,
  panelClassName = "",
}: {
  label: string;
  placeholder: string;
  value: string;
  options: Option[];
  onChange: (v: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyText: string;
  clearLabel: string;
  panelClassName?: string;
}) {
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const filtered = useMemo(() => {
    const q = norm(query);
    if (!q) return options;
    return options.filter((o) => norm(o.label).includes(q) || norm(o.value).includes(q));
  }, [query, options]);

  const selected = options.find((o) => o.value === value);

  const openPanel = () => {
    setQuery("");
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    onOpenChange(true);
  };
  const close = (refocus: boolean) => {
    onOpenChange(false);
    if (refocus) triggerRef.current?.focus({ preventScroll: true });
  };
  const choose = (v: string) => {
    onChange(v);
    close(true);
  };

  // Put the caret in the search box on desktop. Not on touch screens: the
  // keyboard would spring up and shove the hero around before they ask for it.
  useEffect(() => {
    if (!open || !searchable) return;
    if (window.matchMedia("(pointer: fine)").matches) inputRef.current?.focus({ preventScroll: true });
  }, [open, searchable]);

  // Keep the keyboard-highlighted option inside the list's visible window.
  // scrollTop is set by hand: scrollIntoView could also scroll the page.
  useEffect(() => {
    const list = listRef.current;
    const el = list?.querySelector<HTMLElement>(`[data-index="${active}"]`);
    if (!open || !list || !el) return;
    if (el.offsetTop < list.scrollTop) list.scrollTop = el.offsetTop - 8;
    else if (el.offsetTop + el.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = el.offsetTop + el.offsetHeight - list.clientHeight + 8;
  }, [active, open]);

  const onKey = (e: KeyboardEvent) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        openPanel();
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(filtered.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Home" && !searchable) {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End" && !searchable) {
      e.preventDefault();
      setActive(filtered.length - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const o = filtered[active];
      if (o) choose(o.value);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close(true);
    } else if (e.key === "Tab") {
      close(false);
    }
  };

  const optionId = (i: number) => `${id}-opt-${i}`;

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-activedescendant={open && !searchable && filtered[active] ? optionId(active) : undefined}
        onClick={() => (open ? close(false) : openPanel())}
        onKeyDown={onKey}
        className={`dd-trigger group w-full text-start rounded-2xl px-5 py-3.5 cursor-pointer transition-colors duration-300 ${open ? "bg-white/15" : "hover:bg-white/10"}`}
      >
        <span className="block eyebrow text-[10px] text-white/60">{label}</span>
        <span className="mt-1.5 flex items-center gap-3 pe-7">
          <span className={`flex-1 truncate text-[15px] transition-colors ${selected && value ? "text-white font-semibold" : "text-white/80"}`}>{selected && value ? selected.label : placeholder}</span>
          <Chevron className={`dd-chevron w-4 h-4 shrink-0 text-white/70 transition-transform duration-300 ${open ? "" : "rotate-180"}`} />
        </span>
      </button>
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label={`${clearLabel} ${label}`}
          className="absolute bottom-[15px] end-11 w-6 h-6 rounded-full bg-white/15 text-white grid place-items-center hover:bg-white/30 transition-colors cursor-pointer"
        >
          <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      )}

      <div className={`dd-panel absolute bottom-[calc(100%+12px)] start-0 z-40 w-full rounded-[20px] bg-white text-ink shadow-[0_30px_80px_-20px_rgba(11,31,58,0.55)] ring-1 ring-ink/5 overflow-hidden ${panelClassName}`} data-open={open} inert={!open}>
        {searchable && (
          <div className="p-2 border-b border-ink/[0.07]">
            <label className="flex items-center gap-2.5 rounded-xl bg-mist px-3.5 focus-within:ring-2 focus-within:ring-primary/30 transition-shadow">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-ink-muted shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onKey}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                aria-controls={`${id}-list`}
                aria-activedescendant={filtered[active] ? optionId(active) : undefined}
                className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-ink-muted/70"
              />
            </label>
          </div>
        )}
        <ul ref={listRef} id={`${id}-list`} role="listbox" aria-label={label} className="relative max-h-[min(300px,42svh)] overflow-y-auto overscroll-contain py-2">
          {filtered.length === 0 ? (
            <li className="px-4 py-8 text-sm text-ink-muted text-center">{emptyText}</li>
          ) : (
            filtered.map((o, i) => {
              const showGroup = !query && o.group && (i === 0 || filtered[i - 1].group !== o.group);
              const isSelected = o.value === value;
              const dim = o.count === 0;
              return (
                <Fragment key={o.value || "__all"}>
                  {showGroup && (
                    <li role="presentation" className="px-5 pt-3 pb-1.5 eyebrow text-[10px] text-ink-muted">
                      {o.group}
                    </li>
                  )}
                  <li
                    id={optionId(i)}
                    data-index={i}
                    role="option"
                    aria-selected={isSelected}
                    data-active={i === active}
                    onPointerMove={() => i !== active && setActive(i)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => choose(o.value)}
                    className={`dd-option mx-2 flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer ${dim ? "opacity-45" : ""}`}
                  >
                    <span className={`w-5 h-5 shrink-0 grid place-items-center rounded-full transition-colors ${isSelected ? "bg-primary text-white" : "text-transparent"}`} aria-hidden="true">
                      <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                        <path d="m5 12 5 5 9-10" />
                      </svg>
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className={`block truncate text-[14.5px] ${isSelected ? "font-semibold text-primary" : "text-ink"}`}>{o.label}</span>
                      {o.hint && <span className="block text-xs text-ink-muted mt-0.5">{o.hint}</span>}
                    </span>
                    {typeof o.count === "number" && (
                      <span className={`shrink-0 min-w-[1.75rem] h-6 px-2 rounded-full text-[11px] grid place-items-center tabular-nums ${isSelected ? "bg-primary/10 text-primary" : "bg-mist text-ink-muted"}`}>{o.count}</span>
                    )}
                  </li>
                </Fragment>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}

export default function HeroFinder({ isRtl, doctors }: { isRtl: boolean; doctors?: FinderDoctor[] }) {
  const t = translations[isRtl ? "ar" : "en"];
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [spec, setSpec] = useState("");
  const [city, setCity] = useState("");
  const [openKey, setOpenKey] = useState<"spec" | "city" | null>(null);

  // A tap anywhere outside the bar closes whichever panel is open.
  useEffect(() => {
    if (!openKey) return;
    const onDown = (e: PointerEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) setOpenKey(null);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [openKey]);

  const hasCounts = Boolean(doctors?.length);
  const inCity = (d: FinderDoctor, c: string) => !c || (d.cities ?? []).includes(c);
  const inSpec = (d: FinderDoctor, s: string) => !s || d.specialties.includes(s);

  const tSpec = (name: string) => {
    const key = specNameToKey[name];
    return key ? (t[`spec.${key}` as TranslationKey] as string) || name : name;
  };

  const specOptions = useMemo<Option[]>(() => {
    const count = (s: string) => (hasCounts ? doctors!.filter((d) => inSpec(d, s) && inCity(d, city)).length : undefined);
    const popular = pick(COPY.finderPopular, isRtl);
    const all = pick(COPY.finderAllSpecs, isRtl);
    return [
      { value: "", label: pick(COPY.finderAnySpecialty, isRtl), count: count("") },
      ...featuredFilterOrder.map((s) => ({ value: s, label: tSpec(s), count: count(s), group: popular })),
      ...doctorFilters
        .filter((s) => !featuredFilterOrder.includes(s))
        .map((s) => ({ value: s, label: tSpec(s), count: count(s), group: all })),
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctors, city, isRtl, hasCounts]);

  const cityOptions = useMemo<Option[]>(() => {
    const count = (c: string) => (hasCounts ? doctors!.filter((d) => inSpec(d, spec) && inCity(d, c)).length : undefined);
    const branchHint = (c: "Jeddah" | "Riyadh") => {
      const n = BRANCHES.filter((b) => b.city === c).length;
      return isRtl ? (n === 1 ? "فرع واحد" : `${n} فروع`) : `${n} branch${n === 1 ? "" : "es"}`;
    };
    return [
      { value: "", label: pick(COPY.finderAnyCity, isRtl), hint: isRtl ? "جدة والرياض" : "Jeddah & Riyadh", count: count("") },
      { value: "Jeddah", label: t.jeddah, hint: branchHint("Jeddah"), count: count("Jeddah") },
      { value: "Riyadh", label: t.riyadh, hint: branchHint("Riyadh"), count: count("Riyadh") },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctors, spec, isRtl, hasCounts]);

  const matches = hasCounts ? doctors!.filter((d) => inSpec(d, spec) && inCity(d, city)).length : null;

  const find = (e: FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (spec) p.set("spec", spec);
    if (city) p.set("city", city);
    const qs = p.toString();
    router.push(qs ? `/find-doctor?${qs}` : "/find-doctor");
  };

  const clearLabel = pick(COPY.finderClear, isRtl);

  return (
    <form
      ref={formRef}
      onSubmit={find}
      className="fade-up glass relative rounded-[24px] p-2 grid grid-cols-1 md:grid-cols-[1.25fr_1fr_auto] gap-2"
      style={{ "--d": "1000ms" } as CSSProperties}
      aria-label={pick(COPY.finderSubmit, isRtl)}
    >
      <Dropdown
        label={pick(COPY.finderSpecialty, isRtl)}
        placeholder={pick(COPY.finderAnySpecialty, isRtl)}
        value={spec}
        options={specOptions}
        onChange={setSpec}
        open={openKey === "spec"}
        onOpenChange={(o) => setOpenKey(o ? "spec" : null)}
        searchable
        searchPlaceholder={pick(COPY.finderSearch, isRtl)}
        emptyText={pick(COPY.finderNoResults, isRtl)}
        clearLabel={clearLabel}
        panelClassName="md:w-[380px]"
      />
      <div className="md:border-s md:border-white/15 md:ps-2">
        <Dropdown
          label={pick(COPY.finderCity, isRtl)}
          placeholder={pick(COPY.finderAnyCity, isRtl)}
          value={city}
          options={cityOptions}
          onChange={setCity}
          open={openKey === "city"}
          onOpenChange={(o) => setOpenKey(o ? "city" : null)}
          emptyText=""
          clearLabel={clearLabel}
          panelClassName="md:w-[300px]"
        />
      </div>
      <button type="submit" className="btn btn-primary rounded-2xl ps-7 pe-3 py-4 text-sm font-semibold inline-flex items-center justify-center gap-3 cursor-pointer">
        {pick(COPY.finderSubmit, isRtl)}
        {matches !== null && (
          <span key={matches} className="finder-count min-w-[2rem] h-7 px-2.5 rounded-full bg-white/15 text-[12px] grid place-items-center tabular-nums">
            {matches}
          </span>
        )}
        <span className="arrow">
          <Arrow />
        </span>
      </button>
    </form>
  );
}

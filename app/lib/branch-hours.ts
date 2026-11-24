/**
 * Opening hours for every My Clinic branch: the ONE place they live.
 *
 * Source: each branch's Google Maps listing, checked 2026-11-24. The home page
 * (branch cards + the opening-hours table), Women & Family Care and the
 * home-v2 preview all read from here, so a change is one edit.
 *
 * Every branch keeps one schedule Sunday to Thursday and only Saturday and
 * Friday differ, so a week is three spans.
 */

export type BranchId = "mohammadiyah" | "safa" | "obhour" | "tahlia" | "khalidiyyah" | "sahafa";

/** 24-hour clock, `to` exclusive; `null` = closed that day. */
export type Span = { from: number; to: number } | null;

export type WeekHours = { sunThu: Span; sat: Span; fri: Span };

type L = { en: string; ar: string };

const span = (from: number, to: number): Span => ({ from, to });

export const BRANCH_HOURS: Record<BranchId, WeekHours> = {
  mohammadiyah: { sunThu: span(9, 21), sat: span(13, 21), fri: span(17, 21) },
  safa: { sunThu: span(9, 21), sat: span(13, 21), fri: span(17, 21) },
  obhour: { sunThu: span(9, 21), sat: span(13, 21), fri: null },
  tahlia: { sunThu: span(13, 21), sat: span(13, 21), fri: null },
  khalidiyyah: { sunThu: span(10, 22), sat: span(10, 22), fri: span(16, 20) },
  sahafa: { sunThu: span(9, 21), sat: span(9, 21), fri: span(15, 19) },
};

/** Branches as the opening-hours table lists them, grouped by city. */
export const HOURS_BY_CITY: { city: L; branches: { id: BranchId; name: L; dental?: boolean }[] }[] = [
  {
    city: { en: "Jeddah", ar: "جدة" },
    branches: [
      { id: "mohammadiyah", name: { en: "Al Mohammadiyah", ar: "المحمدية" } },
      { id: "safa", name: { en: "Al Safa", ar: "الصفا" } },
      { id: "obhour", name: { en: "Obhour", ar: "أبحر" } },
      { id: "tahlia", name: { en: "Al Tahlia", ar: "التحلية" } },
      { id: "khalidiyyah", name: { en: "Al Khalidiyyah", ar: "الخالدية" }, dental: true },
    ],
  },
  {
    city: { en: "Riyadh", ar: "الرياض" },
    branches: [{ id: "sahafa", name: { en: "Al Sahafa", ar: "الصحافة" } }],
  },
];

export const DAY_LABELS = {
  sunThu: { en: "Sun – Thu", ar: "الأحد – الخميس" },
  satThu: { en: "Sat – Thu", ar: "السبت – الخميس" },
  sat: { en: "Sat", ar: "السبت" },
  fri: { en: "Fri", ar: "الجمعة" },
} satisfies Record<string, L>;

export const CLOSED: L = { en: "Closed", ar: "مغلق" };

/** "9:00 AM" / "9:00 ص", or "9 AM" / "9 ص" when compact. */
export function formatHour(h: number, isRtl: boolean, compact = false): string {
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const pm = h >= 12 && h < 24;
  const time = compact ? `${h12}` : `${h12}:00`;
  return `${time} ${isRtl ? (pm ? "م" : "ص") : pm ? "PM" : "AM"}`;
}

/** "9:00 AM – 9:00 PM", or "Closed" for a closed day. */
export function formatSpan(s: Span, isRtl: boolean, compact = false): string {
  if (!s) return isRtl ? CLOSED.ar : CLOSED.en;
  return `${formatHour(s.from, isRtl, compact)} – ${formatHour(s.to, isRtl, compact)}`;
}

const SUN_THU = [0, 1, 2, 3, 4];

/**
 * A branch's week as display rows, Saturday folded into "Sat – Thu" when it
 * matches the weekday hours. Day indexes follow Date#getDay(): 0 = Sunday.
 */
export function hoursRows(id: BranchId): { days: L; span: Span; dayIdx: number[] }[] {
  const h = BRANCH_HOURS[id];
  const sameSat = h.sat?.from === h.sunThu?.from && h.sat?.to === h.sunThu?.to;
  const rows = sameSat
    ? [{ days: DAY_LABELS.satThu, span: h.sunThu, dayIdx: [6, ...SUN_THU] }]
    : [
        { days: DAY_LABELS.sunThu, span: h.sunThu, dayIdx: SUN_THU },
        { days: DAY_LABELS.sat, span: h.sat, dayIdx: [6] },
      ];
  return [...rows, { days: DAY_LABELS.fri, span: h.fri, dayIdx: [5] }];
}

// Client-safe doctor search: normalization (Arabic letter variants, English
// transliteration), typo-tolerant ranked matching, and a bigram-similarity
// fallback for "did you mean" when nothing matches.
// Pure functions only — no db imports — so the directory (client component)
// can run every keystroke against it without a network round-trip.

import type { Doctor } from "./doctors";

/** Lowercase, drop titles/punctuation, unify common transliteration variants. */
export function normEn(s: string): string {
  let out = (s || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\b(dr|prof|professor|assoc|associate|doctor)\b\.?/g, " ")
    .replace(/[^a-z0-9 ]+/g, " ");
  // Variant spellings collapse to one canonical form so "mohammed" finds
  // "Mohamed" and "el-" finds "Al…". Order matters (longer first).
  const pairs: Array<[RegExp, string]> = [
    [/mohammed|muhammad|muhammed|mohamad/g, "mohamed"],
    [/ahmad/g, "ahmed"],
    [/abdull?ah/g, "abdullah"],
    [/abou|abo/g, "abu"],
    [/hossam|husam/g, "hussam"],
    [/yousef|youssef|yusuf/g, "yousuf"],
    [/shorouq|shurooq|shoroug/g, "shorooq"],
    [/\bel[ -]?/g, "al"],
    [/\bal[ -]/g, "al"],
    [/ee/g, "i"],
    [/ou/g, "u"],
  ];
  for (const [re, to] of pairs) out = out.replace(re, to);
  return out.replace(/\s+/g, " ").trim();
}

const AR_DIACRITICS = /[ً-ْٰـ]/g; // tashkeel + tatweel

/** Strip diacritics/titles, unify alef/yaa/taa-marbuta/hamza-seat variants. */
export function normAr(s: string): string {
  return (s || "")
    .replace(AR_DIACRITICS, "")
    .replace(/^\s*(?:ا?\.?\s*د\.?|الدكتور|دكتور|البروفيسور|بروفيسور)\.?\s*/u, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/[ىئ]/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/[^؀-ۿ0-9 ]+/g, " ")
    // Join a separately typed definite article: "ال زهراني" → "الزهراني".
    .replace(/(^|\s)ال\s+/g, "$1ال")
    .replace(/\s+/g, " ")
    .trim();
}

/** Normalize a user query in either script (or a mix). */
export function normQuery(q: string): string[] {
  const ar = normAr(q);
  const en = normEn(q);
  const hasArabic = /[؀-ۿ]/.test(q);
  const hasLatin = /[a-z]/i.test(q);
  const sources = [
    ...(hasArabic || !hasLatin ? ar.split(" ") : []),
    ...(hasLatin || !hasArabic ? en.split(" ") : []),
  ];
  return Array.from(new Set(sources.filter(Boolean)));
}

export type DoctorIndexEntry = {
  doctor: Doctor;
  /** Highest-value tokens: the doctor's own name in both scripts. */
  nameTokens: string[];
  /** Specialty labels (canonical EN, localized, raw title) + cities, tokenized. */
  fieldTokens: string[];
  /** Whole normalized name strings for substring + bigram matching. */
  nameJoined: string[];
};

/** Build once per doctors list + language (localized specialty labels). */
export function buildDoctorIndex(
  doctors: Doctor[],
  specLabel: (name: string) => string
): DoctorIndexEntry[] {
  return doctors.map((d) => {
    const nameEn = normEn(d.name_en);
    const nameAr = normAr(d.name_ar || "");
    const fields = [
      ...d.specialties.map((s) => normEn(s)),
      ...d.specialties.map((s) => normAr(specLabel(s))),
      ...d.specialties.map((s) => normEn(specLabel(s))),
      normEn(d.specialty_raw || ""),
      normEn(d.title || ""),
      normEn(d.qualification_en || ""),
      ...d.branches.map((b) => normEn(b)),
      ...d.cities.map((c) => normEn(c)),
      d.cities.includes("Jeddah") ? "جده" : "",
      d.cities.includes("Riyadh") ? "الرياض" : "",
    ];
    return {
      doctor: d,
      nameTokens: [...nameEn.split(" "), ...nameAr.split(" ")].filter(Boolean),
      fieldTokens: fields.flatMap((f) => f.split(" ")).filter(Boolean),
      nameJoined: [nameEn, nameAr].filter(Boolean),
    };
  });
}

/** Bounded Damerau-Levenshtein distance (adjacent swaps count as one typo). */
function editDistance(a: string, b: string, limit: number): number {
  if (Math.abs(a.length - b.length) > limit) return limit + 1;
  const prevPrev = new Array<number>(b.length + 1).fill(0);
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);

  for (let i = 1; i <= a.length; i++) {
    const current = new Array<number>(b.length + 1);
    current[0] = i;
    let rowMin = current[0];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(
        prev[j] + 1,
        current[j - 1] + 1,
        prev[j - 1] + cost
      );
      if (
        i > 1 &&
        j > 1 &&
        a[i - 1] === b[j - 2] &&
        a[i - 2] === b[j - 1]
      ) {
        current[j] = Math.min(current[j], prevPrev[j - 2] + 1);
      }
      rowMin = Math.min(rowMin, current[j]);
    }
    if (rowMin > limit) return limit + 1;
    for (let j = 0; j <= b.length; j++) prevPrev[j] = prev[j];
    prev = current;
  }
  return prev[b.length];
}

function fuzzyScore(query: string, candidate: string, name: boolean): number {
  if (candidate === query) return name ? 110 : 48;
  if (candidate.startsWith(query)) return name ? 72 : 28;
  if (query.length >= 3 && candidate.includes(query)) return name ? 44 : 20;
  if (query.length < 4 || candidate.length < 4) return 0;

  const limit = Math.min(2, query.length >= 6 ? 2 : 1);
  const distance = editDistance(query, candidate, limit);
  if (distance > limit) return 0;
  const similarity = 1 - distance / Math.max(query.length, candidate.length);
  if (similarity < (name ? 0.66 : 0.75)) return 0;
  return name ? Math.round(38 * similarity) : Math.round(12 * similarity);
}

/**
 * Ranked search. Every meaningful query token must hit somewhere (AND), while
 * one or two typing mistakes are tolerated for words of four+ characters.
 * Name exact/prefix matches outrank fuzzy names, which outrank metadata.
 */
export function searchDoctors(index: DoctorIndexEntry[], q: string): Doctor[] {
  const tokens = normQuery(q);
  if (!tokens.length) return [];
  const scored: Array<{ d: Doctor; score: number }> = [];
  for (const e of index) {
    let total = 0;
    let ok = true;
    for (const t of tokens) {
      let best = 0;
      for (const n of e.nameTokens) {
        best = Math.max(best, fuzzyScore(t, n, true));
        if (best === 110) break;
      }
      if (best < 110) {
        for (const j of e.nameJoined) {
          if (t.length >= 3 && j.includes(t)) best = Math.max(best, 36);
        }
        for (const f of e.fieldTokens) {
          best = Math.max(best, fuzzyScore(t, f, false));
        }
      }
      if (best === 0) { ok = false; break; }
      total += best;
    }
    // Prefer a whole-name hit over the same words scattered across fields.
    const wholeQueries = [normEn(q), normAr(q)].filter(Boolean);
    for (const query of wholeQueries) {
      for (const name of e.nameJoined) {
        if (name === query) total += 180;
        else if (name.startsWith(query)) total += 80;
        else if (query.length >= 4 && name.includes(query)) total += 45;
      }
    }
    if (ok) scored.push({ d: e.doctor, score: total });
  }
  scored.sort((a, b) => b.score - a.score || b.d.sort_order - a.d.sort_order);
  return scored.map((s) => s.d);
}

function bigrams(s: string): Set<string> {
  const out = new Set<string>();
  const t = s.replace(/\s+/g, " ");
  for (let i = 0; i < t.length - 1; i++) out.add(t.slice(i, i + 2));
  return out;
}

/** Fuzzy "did you mean" — top n doctors by name bigram similarity. */
export function closestDoctors(index: DoctorIndexEntry[], q: string, n = 4): Doctor[] {
  const query = [normEn(q), normAr(q)].filter(Boolean).join(" ");
  if (query.length < 3) return [];
  const qb = bigrams(query);
  const scored = index
    .map((e) => {
      let best = 0;
      for (const name of e.nameJoined) {
        const nb = bigrams(name);
        let hit = 0;
        for (const g of qb) if (nb.has(g)) hit++;
        const sim = (2 * hit) / (qb.size + nb.size);
        best = Math.max(best, sim);
      }
      return { d: e.doctor, sim: best };
    })
    .filter((s) => s.sim > 0.18)
    .sort((a, b) => b.sim - a.sim);
  return scored.slice(0, n).map((s) => s.d);
}

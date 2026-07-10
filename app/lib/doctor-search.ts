// Client-safe doctor search: normalization (Arabic letter variants, English
// transliteration), a prebuilt per-doctor index, ranked multi-token matching,
// and a bigram-similarity fallback for "did you mean" when nothing matches.
// Pure functions only — no db imports — so the directory (client component)
// can run every keystroke against it without a network round-trip.

import type { Doctor } from "./doctors";

/** Lowercase, drop titles/punctuation, unify common transliteration variants. */
export function normEn(s: string): string {
  let out = (s || "")
    .toLowerCase()
    .replace(/\b(dr|prof|professor|doctor)\b\.?/g, " ")
    .replace(/[^a-z0-9 ]+/g, " ");
  // Variant spellings collapse to one canonical form so "mohammed" finds
  // "Mohamed" and "el-" finds "Al…". Order matters (longer first).
  const pairs: Array<[RegExp, string]> = [
    [/mohammed|muhammad|muhammed|mohamad/g, "mohamed"],
    [/ahmad/g, "ahmed"],
    [/abdull?ah/g, "abdullah"],
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
    .replace(/^\s*(أ\.?\s*)?د\.?\s*/, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/[ىئ]/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/[^؀-ۿ0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Normalize a user query in either script (or a mix). */
export function normQuery(q: string): string[] {
  const ar = normAr(q);
  const en = normEn(q);
  // Tokens from both normalizations, deduped; Arabic tokens survive normEn's
  // stripping as empty strings, so filter those out.
  return Array.from(new Set([...ar.split(" "), ...en.split(" ")].filter(Boolean)));
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

/**
 * Ranked search. Every query token must hit somewhere (AND), score prefers
 * name-prefix > name-substring > specialty/city. Returns [] for empty queries.
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
        if (n === t) { best = Math.max(best, 100); break; }
        if (n.startsWith(t)) best = Math.max(best, 60);
        else if (t.length >= 3 && n.includes(t)) best = Math.max(best, 30);
      }
      if (best < 100) {
        for (const j of e.nameJoined) {
          if (t.length >= 3 && j.includes(t)) best = Math.max(best, 25);
        }
        for (const f of e.fieldTokens) {
          if (f === t) best = Math.max(best, 40);
          else if (f.startsWith(t)) best = Math.max(best, 20);
          // Substring tier: Arabic definite article ("قلب" in "القلب") and
          // mid-word hits like "cardio" in "cardiology".
          else if (t.length >= 3 && f.includes(t)) best = Math.max(best, 15);
        }
      }
      if (best === 0) { ok = false; break; }
      total += best;
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

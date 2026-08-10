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
    // "Abd al Rahman" / "Abdul Rahman" / "Abdelrahman" / "Abdulrahman" are the
    // same man, and the roster genuinely carries several of these spellings.
    // Glue the article to the name so they all collapse to one token; without
    // this the spaced forms never reach the single stored token — the length
    // gap is wider than the typo budget and neither contains the other.
    [/\babd\s*[uae]?l\s*/g, "abdul"],
    [/ph/g, "f"], // Mustapha ↔ Mustafa
    [/y\b/g, "i"], // Samy ↔ Sami, Fahmy ↔ Fahmi
    // Doubling carries no information in Arabic→Latin transliteration, and it
    // is where most near-miss spellings live: Julnnar/Gelnar, Hassan/Hasan,
    // Abdullah/Abdulah. Collapsing it on BOTH sides brings those pairs inside
    // the typo budget. Must run last, after the pairs above have settled.
    [/(.)\1+/g, "$1"],
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

/**
 * Everyday words patients actually type, per canonical specialty (the labels in
 * `doctorFilters`). Nobody searches "Otorhinolaryngology" — they search "ear",
 * "أذن", or "sinus". Without this table those queries return nothing at all,
 * because the only specialty text in the index is the clinical label itself.
 *
 * Written in plain script and normalized at index time, so Arabic entries may
 * be spelled with any alef/taa-marbuta variant. Overlap between specialties is
 * intentional: "chest" is honestly both cardiology and pulmonology.
 */
const SPECIALTY_TERMS: Record<string, string> = {
  "Allergy & Immunology": "allergy allergies allergic immunology immune asthma eczema sinus hayfever حساسية تحسس مناعة ربو اكزيما",
  "Audio-vestibular & Speech": "hearing hear ear deaf balance dizziness vertigo speech language audiology tinnitus سمع سمعيات اذن توازن دوخة دوار نطق تخاطب طنين",
  Cardiology: "heart cardiac cardiology chest palpitations pressure hypertension cholesterol artery قلب قلبية صدر ضغط شرايين كوليسترول خفقان",
  Dental: "dental dentist dentistry teeth tooth gum gums braces orthodontics implant whitening filling root canal smile اسنان سنان اسنانك لثة تقويم زراعة تبييض حشوة عصب ابتسامة",
  "Dermatology & Cosmetics": "skin dermatology dermatologist cosmetic cosmetics acne pimples hair loss laser botox filler eczema psoriasis rash mole جلد جلدية بشرة تجميل حبوب شباب شعر تساقط ليزر بوتوكس فيلر صدفية طفح",
  Emergency: "emergency urgent er accident trauma طوارئ اسعاف حوادث",
  "Endocrinology & Diabetes": "diabetes diabetic sugar endocrine endocrinology thyroid hormone hormones obesity insulin سكري سكر غدد درقية هرمونات سمنة انسولين",
  ENT: "ent ear nose throat sinus sinuses tonsils snoring voice hearing انف اذن حنجرة جيوب لوز شخير صوت",
  "Family Medicine": "family general practitioner gp primary care checkup اسرة عائلة عام ممارس فحص",
  "Gastroenterology & Hepatology": "stomach gastro gastroenterology digestive digestion liver hepatology colon bowel endoscopy colonoscopy ulcer reflux معدة هضمي هضم كبد قولون منظار قرحة ارتجاع امعاء",
  "General & Bariatric Surgery": "surgery surgeon surgical bariatric weight sleeve hernia gallbladder appendix جراحة جراح سمنة تكميم فتق مرارة زائدة عملية",
  "Geriatric Medicine": "geriatric elderly aging seniors old age كبار السن مسنين شيخوخة",
  Hematology: "blood hematology anemia clotting platelets leukemia دم دموية فقر الدم صفائح تخثر",
  "Internal Medicine": "internal internist general medicine باطنية باطني",
  Nephrology: "kidney kidneys renal nephrology dialysis كلى كلية غسيل الكلى",
  Neurology: "brain nerve nerves neurology neurologist headache migraine epilepsy seizure stroke numbness مخ اعصاب عصبية صداع شقيقة صرع تشنج جلطة تنميل",
  Nutrition: "nutrition nutritionist diet dietitian dietician weight slimming meal تغذية حمية غذائي وزن رجيم تنحيف",
  "Obstetrics & Gynecology": "gynecology gynecologist obstetrics obgyn pregnancy pregnant women woman birth delivery fertility ivf period uterus ovary نساء ولادة حمل حامل خصوبة اطفال انابيب دورة رحم مبيض",
  "Occupational Medicine": "occupational work workplace employment مهني عمل",
  Ophthalmology: "eye eyes vision sight ophthalmology ophthalmologist optometry cataract lasik glaucoma retina glasses عيون عين نظر ابصار ليزك مياه بيضاء زرقاء شبكية نظارات",
  Orthopedics: "bone bones joint joints knee shoulder hip spine back fracture orthopedic orthopedics sports injury عظام مفاصل ركبة كتف ورك عمود فقري ظهر كسر اصابة",
  Pediatrics: "child children kid kids baby babies infant newborn pediatric pediatrics vaccination اطفال طفل رضيع مواليد تطعيم لقاح",
  Physiotherapy: "physiotherapy physiotherapist physical therapy rehab rehabilitation exercise علاج طبيعي تاهيل",
  "Psychiatry & Psychology": "psychiatry psychiatrist psychology psychologist mental depression anxiety stress therapy counselling adhd نفسي نفسية اكتئاب قلق توتر ارشاد سلوكي فرط الحركة",
  "Pulmonology & Sleep Medicine": "lung lungs chest breathing breath respiratory pulmonology asthma copd sleep apnea snoring رئة رئوية صدرية تنفس ربو نوم شخير انقطاع النفس",
  Rheumatology: "rheumatology rheumatologist arthritis joint pain lupus gout osteoporosis روماتيزم مفاصل التهاب المفاصل ذئبة نقرس هشاشة",
  Urology: "urology urologist urinary bladder prostate stones kidney stone incontinence مسالك بولية مثانة بروستات حصوات حصى تبول",
};

/** Split a term list into its normalized English and Arabic tokens. */
function termTokens(terms: string): string[] {
  const out: string[] = [];
  for (const word of terms.split(/\s+/)) {
    if (!word) continue;
    const normalized = /[؀-ۿ]/.test(word) ? normAr(word) : normEn(word);
    for (const token of normalized.split(" ")) if (token) out.push(token);
  }
  return out;
}

/** Memoized per specialty — the table is static, the index is rebuilt often. */
const termCache = new Map<string, string[]>();
function specialtyTerms(specialty: string): string[] {
  let cached = termCache.get(specialty);
  if (!cached) {
    cached = termTokens(SPECIALTY_TERMS[specialty] || "");
    termCache.set(specialty, cached);
  }
  return cached;
}

export type DoctorIndexEntry = {
  doctor: Doctor;
  /** Highest-value tokens: the doctor's own name in both scripts. */
  nameTokens: string[];
  /** Specialty labels (canonical EN, localized, raw title) + cities, tokenized. */
  fieldTokens: string[];
  /** Whole normalized name strings for substring + bigram matching. */
  nameJoined: string[];
  /** The same names with spaces removed, so word breaks never block a match. */
  namePacked: string[];
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
      // The free-text specialty is the only clinical label some doctors carry
      // (a few have no canonical specialty at all), so index it in both
      // scripts rather than assuming it was written in English.
      normEn(d.specialty_raw || ""),
      normAr(d.specialty_raw || ""),
      normEn(d.title || ""),
      normAr(d.title_ar || ""),
      normEn(d.qualification_en || ""),
      normAr(d.qualification_ar || ""),
      ...d.branches.map((b) => normEn(b)),
      ...d.cities.map((c) => normEn(c)),
      d.cities.includes("Jeddah") ? "جده" : "",
      d.cities.includes("Riyadh") ? "الرياض" : "",
    ];
    const nameJoined = [nameEn, nameAr].filter(Boolean);
    return {
      doctor: d,
      nameTokens: [...nameEn.split(" "), ...nameAr.split(" ")].filter(Boolean),
      fieldTokens: [
        ...fields.flatMap((f) => f.split(" ")).filter(Boolean),
        ...d.specialties.flatMap(specialtyTerms),
      ],
      nameJoined,
      namePacked: nameJoined.map((n) => n.replace(/ /g, "")).filter((n) => n.length >= 4),
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
        // Word breaks differ between how a name is stored and how it is typed
        // ("Abu Shanab" vs "Abushanab"), so try the space-free form too.
        for (const p of e.namePacked) {
          if (t.length >= 4 && p.includes(t)) best = Math.max(best, 34);
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
      const packedQuery = query.replace(/ /g, "");
      if (packedQuery.length < 4) continue;
      for (const packed of e.namePacked) {
        if (packed === packedQuery) total += 160;
        else if (packed.startsWith(packedQuery)) total += 70;
        else if (packed.includes(packedQuery)) total += 40;
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

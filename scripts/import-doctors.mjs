/**
 * Import doctors from the source export into Neon.
 *
 *   node scripts/import-doctors.mjs
 *
 * - Dedupes by MYPAUserId (a doctor repeats once per branch in the export).
 * - Aggregates each doctor's branches → branches[] / cities[].
 * - Derives canonical specialties[] (one raw label can yield several, e.g.
 *   "Family Medicine and Pediatric") + a clean title (seniority).
 * - Idempotent: ON CONFLICT (source_user_id) refreshes source-derived fields
 *   while preserving dashboard-managed is_active / sort_order.
 */
import { readFileSync } from "fs";
import { createRequire } from "module";
import { neon } from "@neondatabase/serverless";

const require = createRequire(import.meta.url);
const XLSX = require("xlsx");

const env = {};
for (const l of readFileSync(".env.local", "utf-8").split("\n")) {
  const i = l.indexOf("=");
  if (i > 0 && !l.trimStart().startsWith("#")) env[l.slice(0, i).trim()] = l.slice(i + 1).trim();
}
const sql = neon(env.DATABASE_URL);

// ── Branch code → { city, name }. RYD1 is Riyadh; everything else is Jeddah.
// CJ01/CJ02/PRC names are best guesses — editable later in the dashboard.
const BRANCH = {
  RYD1: { city: "Riyadh", name: "Al Sahafa" },
  Safa: { city: "Jeddah", name: "Al Safa" },
  SAFA: { city: "Jeddah", name: "Al Safa" },
  NC01: { city: "Jeddah", name: "Al Mohammadiyah" },
  CJ01: { city: "Jeddah", name: "Al Tahlia" },
  CJ02: { city: "Jeddah", name: "Obhour" },
  PRC: { city: "Jeddah", name: "Al Khalidiyyah" },
};

// ── Canonical specialty rules (apply ALL that match a raw label) ───────────
const RULES = [
  [/allerg|immunolog/i, "Allergy & Immunology"],
  [/audio|vestibular|speech|hearing|audiolog/i, "Audio-vestibular & Speech"],
  [/cardio|heart/i, "Cardiology"],
  [/dental|dentist|orthodont|endodont|periodont|prosthodont|maxillofacial/i, "Dental"],
  [/derma|aesthetic|cosmetic|\bskin\b/i, "Dermatology & Cosmetics"],
  [/emergency/i, "Emergency"],
  [/endocrin|diabet/i, "Endocrinology & Diabetes"],
  [/\bent\b|ear.?nose|otolaryng|otorhinolaryng|head and neck/i, "ENT"],
  [/\bfamily\b|general practitioner|\bgp\b|primary care|preventative medicine|preventive medicine/i, "Family Medicine"],
  [/gastro|hepat/i, "Gastroenterology & Hepatology"],
  [/general surg|bariatric|laparoscop|vascular|endovascular/i, "General & Bariatric Surgery"],
  [/geriatr|geria|elderly/i, "Geriatric Medicine"],
  [/hematol|haematol|\bblood\b/i, "Hematology"],
  [/internal medicine/i, "Internal Medicine"],
  [/nephrol|kidney|dialysis/i, "Nephrology"],
  [/neurolog|neurosurg|\bneuro\b/i, "Neurology"],
  [/nutrition|diet/i, "Nutrition"],
  [/obstet|gyneco|gynaeco|obgyn|fertility|\bivf\b|maternal|fetal|women.?s? health/i, "Obstetrics & Gynecology"],
  [/occupational/i, "Occupational Medicine"],
  [/ophthalm|optometr|\beye\b|retina|cornea|glaucoma|vitreoretinal/i, "Ophthalmology"],
  [/orthop|spine|\bjoint\b|sports medicine/i, "Orthopedics"],
  [/pediatric|paediatric|adolescent|\bped\b|neonat|infant/i, "Pediatrics"],
  [/physio|physical therapy|rehab/i, "Physiotherapy"],
  [/psychiat|psycholog|mental|counsel/i, "Psychiatry & Psychology"],
  [/pulmon|respiratory|\bchest\b|\bsleep\b/i, "Pulmonology & Sleep Medicine"],
  [/rheumat/i, "Rheumatology"],
  [/urolog/i, "Urology"],
];

function canonicalSpecialties(raw) {
  const s = raw || "";
  const out = [];
  for (const [re, name] of RULES) if (re.test(s) && !out.includes(name)) out.push(name);
  return out;
}

function deriveTitle(raw) {
  const s = (raw || "").toLowerCase();
  if (/consultant/.test(s)) return "Consultant";
  if (/senior specialist|sr\.?\s*specialist/.test(s)) return "Senior Specialist";
  if (/specialist/.test(s)) return "Specialist";
  if (/professor/.test(s)) return "Professor";
  if (/general practitioner|practitioner|\bgp\b/.test(s)) return "General Practitioner";
  if (/optometrist/.test(s)) return "Optometrist";
  if (/dietitian|dietician/.test(s)) return "Dietitian";
  return "";
}

function slugify(name) {
  return "dr-" + (name || "")
    .replace(/^\s*dr\.?\s*/i, "")
    .toLowerCase()
    .normalize("NFKD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

const clean = (v) => (v == null || String(v).trim().toUpperCase() === "NULL" ? null : String(v).trim());

// ── Build deduped doctor records ───────────────────────────────────────────
const wb = XLSX.readFile("docs/Online Services Doctor Profiles Report.xlsx");
const rows = XLSX.utils.sheet_to_json(wb.Sheets["Sheet1"], { defval: null });

const byId = new Map();
for (const r of rows) {
  const id = r.MYPAUserId;
  if (!byId.has(id)) byId.set(id, []);
  byId.get(id).push(r);
}

const slugSeen = new Map();
const uniqueSlug = (base) => {
  const n = (slugSeen.get(base) || 0) + 1;
  slugSeen.set(base, n);
  return n === 1 ? base : `${base}-${n}`;
};

const unmapped = new Set();
const records = [];
for (const [userId, group] of byId) {
  const first = group[0];
  const name_en = clean(first.NameEn);
  if (!name_en) continue;

  const branchNames = new Set();
  const cities = new Set();
  for (const r of group) {
    const b = BRANCH[r.Company] || BRANCH[(r.Company || "").toUpperCase()];
    if (b) { branchNames.add(b.name); cities.add(b.city); }
    else { branchNames.add(String(r.Company)); }
  }

  const specialty_raw = clean(first.SpecialtyEn);
  const specialties = canonicalSpecialties(specialty_raw);
  if (!specialties.length && specialty_raw) unmapped.add(specialty_raw);

  records.push({
    source_user_id: userId,
    source_rec_id: first.DoctorRecId ?? null,
    slug: uniqueSlug(slugify(name_en)),
    name_en,
    name_ar: clean(first.NameAr),
    email: clean(first.Email),
    image_url: clean(first.ProfilePicUrl),
    qualification_en: clean(first.QualificationEn),
    specialty_raw,
    specialties,
    title: deriveTitle(specialty_raw),
    branches: [...branchNames],
    cities: [...cities],
  });
}

// ── Upsert in batches ──────────────────────────────────────────────────────
const COLS = ["source_user_id","source_rec_id","slug","name_en","name_ar","email","image_url","qualification_en","specialty_raw","specialties","title","branches","cities"];
async function upsert(batch) {
  const params = [];
  const tuples = batch.map((rec) => {
    const ph = COLS.map((c) => {
      params.push(rec[c]);
      const idx = params.length;
      if (c === "specialties" || c === "branches" || c === "cities") return `$${idx}::text[]`;
      return `$${idx}`;
    });
    return `(${ph.join(",")})`;
  });
  const updates = COLS.filter((c) => c !== "source_user_id").map((c) => `${c} = excluded.${c}`).join(", ");
  await sql.query(
    `insert into doctors (${COLS.join(",")}) values ${tuples.join(",")}
     on conflict (source_user_id) do update set ${updates}, updated_at = now()`,
    params
  );
}

console.log(`\nImporting ${records.length} unique doctors…`);
for (let i = 0; i < records.length; i += 50) await upsert(records.slice(i, i + 50));

// ── Report ─────────────────────────────────────────────────────────────────
const [{ count }] = await sql.query("select count(*)::int count from doctors");
const withSpec = records.filter((r) => r.specialties.length).length;
const cityDist = await sql.query("select unnest(cities) c, count(*)::int n from doctors group by 1 order by n desc");
const specDist = await sql.query("select unnest(specialties) s, count(*)::int n from doctors group by 1 order by n desc");
console.log(`\n✓ doctors in DB: ${count}`);
console.log(`  specialty coverage: ${withSpec}/${records.length} (${Math.round((withSpec / records.length) * 100)}%)`);
console.log(`  cities:`, cityDist.map((r) => `${r.c}=${r.n}`).join(", "));
console.log(`  specialties (${specDist.length}):`, specDist.map((r) => `${r.s}=${r.n}`).join(", "));
if (unmapped.size) {
  console.log(`\n  ⚠ ${unmapped.size} raw labels mapped to NO canonical specialty:`);
  for (const u of unmapped) console.log("     -", u);
}

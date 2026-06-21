// Generates a complete Doctors workbook (EN + AR + image links) from app/doctors-data.ts
// Run: node scripts/generate-doctors-excel.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import XLSX from "xlsx";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://myclinic.com.sa";
const OUT = path.join(ROOT, "MyClinic-Doctors-EN-AR.xlsx");

// --- Parse the doctors array out of the TS source (it is valid JSON sans trailing commas) ---
const src = fs.readFileSync(path.join(ROOT, "app/doctors-data.ts"), "utf8");
const start = src.indexOf("[", src.indexOf("=", src.indexOf("doctorsData")));
const end = src.lastIndexOf("]");
const jsonish = src.slice(start, end + 1).replace(/,(\s*[}\]])/g, "$1");
const doctors = JSON.parse(jsonish);

// --- Arabic translations for the 26 specialties (no specAr exists in source) ---
const specAr = {
  "Dental": "طب الأسنان",
  "Family Medicine": "طب الأسرة",
  "Pediatrics": "طب الأطفال",
  "Orthopedics": "جراحة العظام",
  "Obstetrics & Gynecology": "النساء والولادة",
  "Endocrinology & Diabetes": "الغدد الصماء والسكري",
  "ENT": "الأنف والأذن والحنجرة",
  "Dermatology & Cosmetics": "الجلدية والتجميل",
  "Internal Medicine": "الطب الباطني",
  "Allergy & Immunology": "الحساسية والمناعة",
  "Ophthalmology": "طب العيون",
  "Neurology": "طب الأعصاب",
  "Cardiology": "طب القلب",
  "Audio-vestibular & Speech": "السمعيات والاتزان والنطق",
  "Nephrology": "أمراض الكلى",
  "General Surgery": "الجراحة العامة",
  "Emergency": "الطوارئ",
  "Rheumatology": "الروماتيزم",
  "Pulmonology & Sleep Medicine": "الأمراض الصدرية وطب النوم",
  "Nutrition": "التغذية",
  "Gastroenterology & Hepatology": "الجهاز الهضمي والكبد",
  "Psychiatry & Psychology": "الطب النفسي وعلم النفس",
  "Hematology": "أمراض الدم",
  "Occupational Medicine": "طب المهن",
  "Geriatric Medicine": "طب المسنين",
  "General & Bariatric Surgery": "الجراحة العامة وجراحة السمنة",
};

// --- Which image files actually exist on disk ---
const imgDir = path.join(ROOT, "public/doctors");
const existing = new Set(fs.existsSync(imgDir) ? fs.readdirSync(imgDir) : []);

const header = [
  "#",
  "Name (EN)",
  "Name (AR)",
  "Title / Position (EN)",
  "Title / Position (AR)",
  "Specialty (EN)",
  "Specialty (AR)",
  "Education (EN)",
  "Education (AR)",
  "Languages",
  "Location",
  "Image File",
  "Image URL (live)",
  "Image Path (relative)",
  "Image Status",
];

const rows = doctors.map((d, i) => {
  const file = (d.img || "").split("/").pop() || "";
  const present = file && existing.has(file);
  return [
    i + 1,
    d.name || "",
    d.nameAr || "",
    d.title || "",
    d.titleAr || "",
    d.spec || "",
    specAr[d.spec] || "",
    (d.education || []).join("  |  "),
    (d.educationAr || []).join("  |  "),
    d.languages || "",
    d.location || "",
    file,
    d.img ? SITE + d.img : "",
    d.img || "",
    present ? "OK" : "MISSING FILE",
  ];
});

const aoa = [header, ...rows];
const ws = XLSX.utils.aoa_to_sheet(aoa);

// Column widths
ws["!cols"] = [
  { wch: 4 },  { wch: 26 }, { wch: 22 }, { wch: 34 }, { wch: 30 },
  { wch: 24 }, { wch: 24 }, { wch: 50 }, { wch: 50 }, { wch: 16 },
  { wch: 22 }, { wch: 26 }, { wch: 52 }, { wch: 30 }, { wch: 14 },
];
// Freeze header row + first two name columns, enable autofilter
ws["!freeze"] = { xSplit: 0, ySplit: 1, topLeftCell: "A2", activePane: "bottomLeft", state: "frozen" };
ws["!autofilter"] = { ref: `A1:O${rows.length + 1}` };

// --- Summary sheet: count by specialty (EN + AR) ---
const counts = {};
for (const d of doctors) counts[d.spec] = (counts[d.spec] || 0) + 1;
const summaryAoA = [
  ["Specialty (EN)", "Specialty (AR)", "Doctors"],
  ...Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([s, n]) => [s, specAr[s] || "", n]),
  ["TOTAL", "", doctors.length],
];
const wsSummary = XLSX.utils.aoa_to_sheet(summaryAoA);
wsSummary["!cols"] = [{ wch: 30 }, { wch: 28 }, { wch: 10 }];

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Doctors");
XLSX.utils.book_append_sheet(wb, wsSummary, "By Specialty");
wb.Workbook = { Views: [{ RTL: false }] };

XLSX.writeFile(wb, OUT);

const missing = rows.filter((r) => r[14] !== "OK").length;
console.log(`Wrote ${OUT}`);
console.log(`Doctors: ${doctors.length} | Specialties: ${Object.keys(counts).length} | Missing image files: ${missing}`);

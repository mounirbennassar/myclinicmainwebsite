#!/usr/bin/env node
/**
 * Fail the build when an icon is used in code but missing from the Material
 * Symbols subset in app/layout.tsx.
 *
 * Why this exists: the subset is passed to Google Fonts as `icon_names=…` so we
 * ship a ~50KB font instead of ~1.1MB. A name that is missing from it does NOT
 * degrade to a blank or a placeholder glyph — the browser draws the ligature's
 * literal text, so the page reads "manage_search" where the magnifier belongs.
 * Nothing errors, nothing warns, and it only shows up when somebody looks at
 * the page. Three icons had been broken this way (3d_rotation, filter_alt_off,
 * manage_search), one of them the main search field on /find-doctor.
 *
 * Run by `prebuild`, so a drifted subset breaks CI instead of the website.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const layout = readFileSync(join(ROOT, "app/layout.tsx"), "utf8");

const declared = layout.match(/MATERIAL_SYMBOLS_ICONS[^=]*=\s*(["'`])([\s\S]*?)\1/);
if (!declared) {
  console.error("check-icon-subset: could not find MATERIAL_SYMBOLS_ICONS in app/layout.tsx");
  process.exit(1);
}
const subset = new Set(declared[2].split(",").map((s) => s.trim()).filter(Boolean));

/** name -> files that reference it */
const used = new Map();
const note = (name, file) => {
  if (!used.has(name)) used.set(name, new Set());
  used.get(name).add(file);
};

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!/node_modules|\.next/.test(full)) walk(full);
      continue;
    }
    if (!/\.tsx?$/.test(entry.name)) continue;
    const src = readFileSync(full, "utf8");
    const rel = full.replace(ROOT, "");
    let m;

    // <span className="material-symbols-outlined">arrow_forward</span>
    const literal = /material-symbols-outlined[^>]*>\s*([a-z0-9_]{3,})\s*</g;
    while ((m = literal.exec(src))) note(m[1], rel);

    // …>{cond ? "filter_alt_off" : "search_off"}</span>
    const expr = /material-symbols-outlined[^>]*>\s*\{[^}]*\}/g;
    while ((m = expr.exec(src))) {
      for (const q of m[0].matchAll(/["']([a-z][a-z0-9_]{2,})["']/g)) note(q[1], rel);
    }

    // { icon: "stethoscope", … }
    const prop = /\bicon:\s*["']([a-z0-9_]{3,})["']/g;
    while ((m = prop.exec(src))) note(m[1], rel);

    // export const specIcons = ["vaccines", "hearing", …]
    const arrays = /\b\w*[Ii]cons\w*\s*(?::[^=]*)?=\s*\[([\s\S]*?)\]/g;
    while ((m = arrays.exec(src))) {
      for (const q of m[1].matchAll(/["']([a-z][a-z0-9_]{2,})["']/g)) note(q[1], rel);
    }
  }
}
walk(join(ROOT, "app"));

// Words the patterns above pick up that are not icons: a union member used as a
// discriminator, a font-variation axis. Keep this list short and explain each.
const NOT_ICONS = new Set([
  "virtual", // Offering.phase in app/health-homecare/page.tsx
  "wght", // fontVariationSettings axis
]);

const missing = [...used.keys()].filter((n) => !subset.has(n) && !NOT_ICONS.has(n)).sort();

if (missing.length) {
  console.error(`\n✖ ${missing.length} icon(s) used in code but missing from MATERIAL_SYMBOLS_ICONS`);
  console.error("  These render as their literal name on the page.\n");
  for (const name of missing) {
    console.error(`    ${name.padEnd(22)} ${[...used.get(name)].join(", ")}`);
  }
  console.error("\n  Fix: add them to MATERIAL_SYMBOLS_ICONS in app/layout.tsx (keep it sorted).\n");
  process.exit(1);
}

console.log(`✓ icon subset OK — ${used.size} icons referenced, all present in the subset`);

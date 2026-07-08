// Monogram fallback for doctors without a photo. Pure + client-safe (no db import),
// so both the home carousel and the dental cards can share it.
export function doctorInitials(name: string): string {
  const cleaned = (name || "")
    .replace(/^\s*(dr\.?|rdh\.?|prof\.?|د\.?|أ\.?)\s*/i, "")
    .trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase() || "MC";
}

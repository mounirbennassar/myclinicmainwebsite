/**
 * Inline SVGs for the My360 page. Deliberately NOT Material Symbols: every
 * glyph from that font has to be added to MATERIAL_SYMBOLS_ICONS in
 * app/layout.tsx or it renders as raw ligature text, and these shapes come
 * straight from the design rather than the icon set.
 */

const stroke = {
  fill: "none",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const PATHS: Record<string, React.ReactNode> = {
  shield: (
    <>
      <path d="M12 3l7 3v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />,
  stethoscope: (
    <>
      <path d="M5 3v6a5 5 0 0 0 10 0V3" />
      <path d="M10 14v3a5 5 0 0 0 10 0v-2" />
      <circle cx="20" cy="12" r="2" />
    </>
  ),
  grid: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="6" width="16" height="15" rx="2" />
      <path d="M4 11h16M8 3v5M16 3v5" />
    </>
  ),
  heart: <path d="M12 20s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9z" />,
  whatsapp: (
    <>
      <path d="M21 12a9 9 0 0 1-13.2 8L3 21l1-4.6A9 9 0 1 1 21 12z" />
      <path d="M9 10c.5 2.5 2.5 4.5 5 5l1.2-1.4 2.3 1" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  download: (
    <>
      <path d="M12 4v11" />
      <path d="M8 11l4 4 4-4" />
      <path d="M5 19h14" />
    </>
  ),
  team: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20c0-3.3 2.7-5.2 6-5.2s6 1.9 6 5.2" />
      <path d="M16.5 5.6a3.2 3.2 0 0 1 0 6.1" />
      <path d="M17.5 14.4c2.1.6 3.5 2.2 3.5 4.4" />
    </>
  ),
  clipboard: (
    <>
      <path d="M9 4h6v3H9z" />
      <path d="M15 5.5h2a2 2 0 0 1 2 2V19a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7.5a2 2 0 0 1 2-2h2" />
      <path d="M9 12.5l1.8 1.8L15 10" />
    </>
  ),
  chat: (
    <>
      <path d="M20 12.5a7.5 7.5 0 0 1-10.9 6.7L4 20.5l1.4-4.6A7.5 7.5 0 1 1 20 12.5z" />
      <path d="M9 11.5h6M9 14.5h3.5" />
    </>
  ),
  tag: (
    <>
      <path d="M4 11.6V5.5a1.5 1.5 0 0 1 1.5-1.5h6.1a2 2 0 0 1 1.4.6l6.9 6.9a2 2 0 0 1 0 2.8l-5.6 5.6a2 2 0 0 1-2.8 0L4.6 13a2 2 0 0 1-.6-1.4z" />
      <circle cx="8.5" cy="8.5" r="1.4" />
    </>
  ),
  route: (
    <>
      <circle cx="6" cy="18" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <path d="M15.5 6H10a3.5 3.5 0 0 0 0 7h4a3.5 3.5 0 0 1 0 7H8.5" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3.2 9.5h17.6M3.2 14.5h17.6" />
      <path d="M12 3c2.4 2.5 3.6 5.5 3.6 9S14.4 18.5 12 21c-2.4-2.5-3.6-5.5-3.6-9S9.6 5.5 12 3z" />
    </>
  ),
  pulse: (
    <>
      <path d="M3 12h3.5l2-5 3.5 10 2.5-6 1.5 3H21" />
    </>
  ),
  // Program marks
  grow: (
    <>
      <path d="M12 20v-7" />
      <path d="M12 13c0-4 3-6 7-6 0 4-3 6-7 6z" />
      <path d="M12 13c0-3-2.5-5-6-5 0 3 2.5 5 6 5z" />
    </>
  ),
  live: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" />
    </>
  ),
  thrive: (
    <>
      <path d="M6 18C6 10 12 5 20 4c-1 8-6 14-14 14z" />
      <path d="M4 20c1.5-3.5 4-7 8-9.5" />
    </>
  ),
  diabetes: <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />,
};

export default function My360Icon({
  name,
  className = "h-5 w-5",
}: {
  name: keyof typeof PATHS | string;
  className?: string;
}) {
  const d = PATHS[name];
  if (!d) return null;
  return (
    <svg viewBox="0 0 24 24" className={className} stroke="currentColor" aria-hidden {...stroke}>
      {d}
    </svg>
  );
}

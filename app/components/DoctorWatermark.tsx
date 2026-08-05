/**
 * My Clinic watermark for doctor portraits.
 *
 * Painted as a CSS background rather than an inline <svg> or <Image>: the
 * doctors carousel renders the full roster, so inlining the logo's paths would
 * repeat ~6KB of markup per card, and an <Image> per card would add a DOM node
 * and a loader round-trip each. As a background-image the browser fetches
 * /logo-dark.svg once and every card paints from cache. (The image loader
 * returns .svg untouched, so this never goes near Cloudinary.)
 *
 * logo-dark.svg is the navy-on-transparent lockup — logo.svg is the inverse and
 * carries an opaque navy backdrop, which would paint a solid box here.
 *
 * The white drop-shadow is what keeps it readable in both directions: at this
 * opacity navy alone disappears into dark hair or a dark suit, and the halo
 * gives it an edge without making the mark itself heavier.
 *
 * Placement and size are props, not `className` overrides: Tailwind utilities
 * of the same kind (top-3 vs bottom-3, max-w-[104px] vs max-w-[150px]) carry
 * equal specificity, so which one wins is decided by their order in the
 * generated stylesheet rather than the order they appear in the class string —
 * an override that happens to work is one refactor away from silently flipping.
 */
export default function DoctorWatermark({
  isRtl = false,
  placement = "top",
  maxWidth = 78,
  className = "",
}: {
  /** Arabic puts the mark top-left, English top-right. */
  isRtl?: boolean;
  /** "bottom" is for panels whose top corners are clipped (the pediatric arch). */
  placement?: "top" | "bottom";
  /** Cap in px — inline so it always beats the utility class. */
  maxWidth?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none select-none absolute z-10 ${
        placement === "top" ? "top-3" : "bottom-3"
      } ${isRtl ? "left-3" : "right-3"} w-[32%] aspect-[597/216] opacity-[0.22] ${className}`}
      style={{
        maxWidth,
        backgroundImage: "url('/logo-dark.svg')",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        filter: "drop-shadow(0 1px 1.5px rgba(255,255,255,0.65))",
      }}
    />
  );
}

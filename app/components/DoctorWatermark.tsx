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
 */
export default function DoctorWatermark({
  isRtl = false,
  className = "",
}: {
  /** Flips the mark to the corner opposite the specialty pill. */
  isRtl?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none select-none absolute z-10 bottom-3 ${
        isRtl ? "left-3" : "right-3"
      } w-[42%] max-w-[104px] aspect-[597/216] opacity-[0.22] ${className}`}
      style={{
        backgroundImage: "url('/logo-dark.svg')",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        filter: "drop-shadow(0 1px 1.5px rgba(255,255,255,0.65))",
      }}
    />
  );
}

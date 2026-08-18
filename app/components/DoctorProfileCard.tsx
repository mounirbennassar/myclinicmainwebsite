"use client";

import Image from "next/image";
import Link from "next/link";
import { doctorAvatar } from "@/app/lib/doctor-avatar";
import DoctorWatermark from "@/app/components/DoctorWatermark";
import type { DoctorCard } from "@/app/lib/doctors";

/**
 * The one doctor card used across the site — the home "World-Class Medical
 * Minds" carousel and the /find-doctor directory.
 *
 * It exists because those two had independently-maintained copies of the same
 * markup that had already drifted apart (different padding, different name
 * sizing, one missing the "View profile" affordance). Ordering is shared via
 * orderDoctorsForDisplay(); this shares the presentation, so the two pages
 * cannot diverge again.
 *
 * The card fills its container — the carousel gives it a fixed-width snap
 * track, the directory a grid cell — so layout stays the caller's business and
 * only the card's internals live here.
 */

type Props = {
  doctor: DoctorCard & { cities?: string[] };
  isRtl: boolean;
  /** Canonical-name → localized-label lookup, owned by the caller. */
  tSpec: (name: string) => string;
  /** next/image `sizes` — differs between a fixed track and a fluid grid. */
  sizes: string;
  /** Above-the-fold cards should not lazy-load. */
  eager?: boolean;
  /** Directory-only: the city line, which a home teaser has no use for. */
  showCity?: boolean;
};

export default function DoctorProfileCard({
  doctor: d,
  isRtl,
  tSpec,
  sizes,
  eager = false,
  showCity = false,
}: Props) {
  const subtitle =
    isRtl && d.specialties[0]
      ? tSpec(d.specialties[0])
      : d.specialty_raw || (d.specialties[0] ? tSpec(d.specialties[0]) : "");

  const cities = d.cities ?? [];
  const cityLabel = isRtl
    ? cities.includes("Riyadh") && cities.includes("Jeddah")
      ? "جدة، الرياض"
      : cities.includes("Riyadh")
        ? "الرياض"
        : "جدة"
    : cities.join(", ");

  return (
    <Link
      href={`/doctors/${d.slug}`}
      className="group block h-full bg-surface-container-lowest rounded-3xl overflow-hidden border border-outline-variant/20 shadow-clinical hover:shadow-xl hover:-translate-y-1 transition-all"
    >
      {/* bg-white, not bg-surface-container: many portraits are cut-out PNGs
          sitting on a white circular disc with transparency outside it. Against
          a tinted panel that disc reads as a hard circle behind the doctor;
          against white it disappears. */}
      <div className="relative aspect-[4/5] overflow-hidden bg-white">
        <Image
          src={d.image_url || doctorAvatar(d.name_en, d.name_ar)}
          alt={d.name_en}
          fill
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/55 via-transparent to-transparent" />
        <DoctorWatermark isRtl={isRtl} />
        {d.specialties[0] && (
          <span
            className={`absolute bottom-3 ${isRtl ? "right-3" : "left-3"} bg-secondary-fixed text-on-secondary-fixed px-2.5 py-1 rounded-full text-[10px] font-bold`}
          >
            {tSpec(d.specialties[0])}
          </span>
        )}
      </div>

      <div className="p-5">
        {/* Two lines, not one: at 18px a 260px card fits ~22 characters and the
            roster runs to 31 ("Assoc. Prof. Mohammed Alsofiani"), so a clamped
            single line cut real names. Smaller type plus a reserved two-line box
            shows every name in full while keeping cards the same height. */}
        <h3 className="font-headline font-extrabold text-primary text-[15px] leading-snug mb-1 line-clamp-2 min-h-[2.75em]">
          {isRtl && d.name_ar ? d.name_ar : d.name_en}
        </h3>
        <p className="text-on-surface-variant text-sm font-medium line-clamp-2 min-h-[2.5em]">{subtitle}</p>

        {showCity && cities[0] && (
          <p className="flex items-center gap-1 text-xs text-on-surface-variant/80 mt-2">
            <span className="material-symbols-outlined text-sm text-primary">location_on</span>
            <span className="line-clamp-1">{cityLabel}</span>
          </p>
        )}

        <span className="mt-3 inline-flex items-center gap-1 text-primary text-sm font-bold group-hover:gap-2 transition-all">
          {isRtl ? "عرض الملف" : "View profile"}
          <span className={`material-symbols-outlined text-base ${isRtl ? "rotate-180" : ""}`}>arrow_forward</span>
        </span>
      </div>
    </Link>
  );
}

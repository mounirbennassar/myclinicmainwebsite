"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLang } from "@/app/i18n/context";
import translations, { type TranslationKey } from "@/app/i18n/translations";
import { specNameToKey } from "@/app/lib/specialties";
import { trackWhatsAppClick } from "@/app/lib/tracking";
import type { Doctor } from "@/app/lib/doctors";
import { WhatsAppIcon } from "@/app/components/icons";

export default function DoctorProfile({ doctor }: { doctor: Doctor }) {
  const { lang } = useLang();
  const t = translations[lang];
  const isRtl = lang === "ar";

  const tSpec = (name: string) => {
    const key = specNameToKey[name];
    return key ? t[`spec.${key}` as TranslationKey] || name : name;
  };

  const name = isRtl && doctor.name_ar ? doctor.name_ar : doctor.name_en;
  const cityLabel = isRtl
    ? doctor.cities.map((c) => (c === "Riyadh" ? "الرياض" : "جدة")).join("، ")
    : doctor.cities.join(", ");
  const wa = `https://wa.me/966920022811?text=${encodeURIComponent(
    isRtl ? `مرحباً، أود حجز موعد مع ${name}` : `Hello, I'd like to book an appointment with ${doctor.name_en}`
  )}`;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12 w-full">
      <Link href="/find-doctor" className="inline-flex items-center gap-1.5 text-on-surface-variant hover:text-primary font-bold text-sm mb-6 transition-colors">
        <span className={`material-symbols-outlined text-base ${isRtl ? "rotate-180" : ""}`}>arrow_back</span>
        {isRtl ? "كل الأطباء" : "All doctors"}
      </Link>

      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Photo */}
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="lg:col-span-5">
          <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-surface-container shadow-[0_40px_80px_-30px_rgba(0,77,153,0.35)] border-4 border-white">
            {doctor.image_url && (
              <Image src={doctor.image_url} alt={doctor.name_en} fill preload className="object-cover object-top" sizes="(max-width:1024px) 100vw, 40vw" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
          </div>
        </motion.div>

        {/* Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="lg:col-span-7">
          <div className="flex flex-wrap gap-2 mb-4">
            {doctor.specialties.map((s) => (
              <span key={s} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">{tSpec(s)}</span>
            ))}
          </div>

          <h1 className="text-3xl md:text-5xl font-headline font-extrabold text-primary tracking-tight mb-2">{name}</h1>
          {doctor.specialty_raw && (
            <p className="text-on-surface-variant text-lg font-medium mb-6">
              {isRtl && doctor.specialties[0] ? tSpec(doctor.specialties[0]) : doctor.specialty_raw}
            </p>
          )}

          <div className="space-y-5 mb-8">
            {doctor.qualification_en && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-primary text-xl">school</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">{t.educationQualifications}</p>
                  <p className="text-on-surface leading-relaxed">{doctor.qualification_en}</p>
                </div>
              </div>
            )}
            {doctor.branches.length > 0 && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-primary text-xl">location_on</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">{t.location}</p>
                  <p className="text-on-surface">{cityLabel}{doctor.branches.length ? ` — ${doctor.branches.join(isRtl ? "، " : ", ")}` : ""}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/#booking-form" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-container text-white px-7 py-4 rounded-full font-bold shadow-lg shadow-primary/25 active:scale-95 transition-all">
              <span className="material-symbols-outlined">event</span>
              {t.requestAppointment}
            </Link>
            <a href={wa} onClick={trackWhatsAppClick} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-surface-container-lowest text-primary border border-outline-variant/40 px-7 py-4 rounded-full font-bold hover:border-primary/40 transition-colors">
              <WhatsAppIcon className="text-lg text-[#25D366]" />
              {isRtl ? "واتساب" : "WhatsApp"}
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

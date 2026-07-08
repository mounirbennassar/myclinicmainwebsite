"use client";
import Image from "next/image";
import type { Doctor } from "@/app/doctors-data";
import { useLang } from "@/app/i18n/context";
import { doctorInitials } from "@/app/lib/doctor-avatar";

const locationArMap: Record<string, string> = {
  "Jeddah Al Mohammadiyah": "جدة المحمدية",
  "Jeddah Al Safa": "جدة الصفا",
  "Jeddah Al Khalidiyyah": "جدة الخالدية",
  "Jeddah Al Mohammadiyah + Dental Center": "جدة المحمدية + مركز الأسنان",
  "Jeddah Al Mohammadiyah + Obhour": "جدة المحمدية + أبحر",
  "Riyadh Al Sahafa": "الرياض الصحافة",
};

export default function DentalDoctorCard({ doctor }: { doctor: Doctor }) {
  const { lang } = useLang();
  const isRtl = lang === "ar";
  const name = isRtl && doctor.nameAr ? doctor.nameAr : doctor.name;
  const title = isRtl && doctor.titleAr ? doctor.titleAr : doctor.title;
  const location = doctor.location ? (isRtl ? (locationArMap[doctor.location] || doctor.location) : doctor.location) : "";

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-[#003867]/10 hover:border-[#003867]/40 hover:shadow-xl hover:shadow-[#003867]/5 transition-all">
      <div className="relative aspect-[3/4] bg-gradient-to-br from-[#003867]/5 to-[#003867]/10 overflow-hidden">
        {doctor.img ? (
          <Image
            src={doctor.img}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#003867] to-[#00677d]">
            <span className="text-white font-extrabold text-4xl select-none">{doctorInitials(doctor.name)}</span>
          </div>
        )}
        <div className="absolute top-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur text-[10px] font-bold text-[#003867]"
             style={isRtl ? { right: 12 } : { left: 12 }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#003867]" />
          {isRtl ? "أسنان" : "Dental"}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-slate-900 text-sm leading-tight">{name}</h3>
        <p className="text-xs text-[#003867] font-semibold mt-1">{title}</p>
        {location && <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
          <span className="material-symbols-outlined text-[13px]">location_on</span>
          {location}
        </p>}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "@/app/i18n/context";
import { trackFormSubmit } from "@/app/lib/tracking";

/*
 * The 11 clinical units as a popup-driven grid: tapping a card opens a modal
 * with the unit's description and a compact booking form — no page navigation.
 * Two cards per row on mobile, three from lg up.
 *
 * Icons must exist in the Material Symbols subset in app/layout.tsx — the
 * prebuild check fails otherwise. `service` is what the lead is attributed to
 * in the dashboard when the modal form submits.
 */
type Unit = {
  service: string;
  icon: string;
  ar: string;
  en: string;
  descAr: string;
  descEn: string;
};

const UNITS: Unit[] = [
  {
    service: "root-canal", icon: "vital_signs",
    ar: "وحدة علاج جذور وأعصاب الأسنان المجهري", en: "Microscopic Root Canal & Endodontics Unit",
    descAr: "علاج جذور وأعصاب الأسنان تحت المجهر لدقة أعلى والحفاظ على سنك الطبيعي، مع خيارات علاج مريحة وبدون ألم.",
    descEn: "Microscope-assisted root canal treatment for maximum precision and preserving your natural tooth — with comfortable, pain-managed sessions.",
  },
  {
    service: "crowns-bridges", icon: "auto_awesome",
    ar: "وحدة التركيبات وتجميل الأسنان", en: "Prosthodontics & Cosmetic Dentistry Unit",
    descAr: "تيجان وجسور وفينير وابتسامة هوليوود بتصميم رقمي يتناغم مع ملامح وجهك ولون بشرتك.",
    descEn: "Crowns, bridges, veneers and Hollywood smiles — digitally designed to harmonize with your features and skin tone.",
  },
  {
    service: "orthodontics", icon: "align_horizontal_center",
    ar: "وحدة تقويم الأسنان والفكين", en: "Orthodontics & Dentofacial Orthopedics Unit",
    descAr: "تقويم الأسنان والفكين للأطفال والبالغين، بخيارات شفافة وتقليدية وخطة علاجية واضحة المدة.",
    descEn: "Orthodontics for children and adults, with clear-aligner and traditional options and a clearly scheduled plan.",
  },
  {
    service: "oral-surgery", icon: "surgical",
    ar: "وحدة جراحة الوجه والفكين وزراعة الأسنان", en: "Maxillofacial Surgery & Dental Implants Unit",
    descAr: "جراحة الوجه والفكين، وزراعة الأسنان، وخلع ضرس العقل على يد استشاريين بخبرات متقدمة.",
    descEn: "Maxillofacial surgery, dental implants and wisdom-tooth care performed by consultant surgeons.",
  },
  {
    service: "gums", icon: "health_and_safety",
    ar: "وحدة تجميل وجراحة اللثة وزراعة الأسنان", en: "Gum Aesthetics, Surgery & Implants Unit",
    descAr: "علاج وتجميل اللثة وزراعة الأسنان للحفاظ على أساس صحي وجميل لابتسامتك.",
    descEn: "Gum treatment, aesthetics and implant placement to keep the foundation of your smile healthy and beautiful.",
  },
  {
    service: "pediatric", icon: "child_care",
    ar: "وحدة طب أسنان الأطفال", en: "Pediatric Dentistry Unit",
    descAr: "رعاية لطيفة مصممة للأطفال تبني علاقة إيجابية مع طبيب الأسنان منذ الصغر.",
    descEn: "Gentle, kid-first care that builds a positive relationship with the dentist from an early age.",
  },
  {
    service: "special-needs", icon: "accessibility",
    ar: "وحدة الرعاية الخاصة في طب الأسنان", en: "Special-Care Dentistry Unit",
    descAr: "رعاية أسنان شاملة لذوي الاحتياجات الخاصة مع خيارات التخدير الواعي وبيئة مهيأة.",
    descEn: "Inclusive dental care for patients with special needs, with conscious-sedation options and an adapted environment.",
  },
  {
    service: "general", icon: "diagnosis",
    ar: "وحدة التشخيص والخطة العلاجية", en: "Diagnosis & Treatment Planning Unit",
    descAr: "تشخيص رقمي وتصوير ثلاثي الأبعاد وخطة علاجية واضحة وشفافة التكلفة من الزيارة الأولى.",
    descEn: "Digital diagnosis, 3D imaging and a clear, transparently priced treatment plan from the very first visit.",
  },
  {
    service: "tmj", icon: "medication",
    ar: "وحدة آلام الوجه ومفصل الفك واضطرابات النوم", en: "Facial Pain, TMJ & Sleep Disorders Unit",
    descAr: "تشخيص وعلاج آلام الوجه واضطرابات مفصل الفك ومشاكل النوم المرتبطة بها.",
    descEn: "Diagnosis and treatment of facial pain, TMJ disorders and the sleep problems linked to them.",
  },
  {
    service: "gbt-cleaning", icon: "shield_with_heart",
    ar: "وحدة وقاية الأسنان", en: "Preventive Dentistry Unit",
    descAr: "وقاية وتنظيف بتقنية GBT الحديثة وحماية طويلة الأمد لأسنان جميع أفراد العائلة.",
    descEn: "Prevention and modern GBT cleaning for long-term protection of the whole family's teeth.",
  },
  {
    service: "laser", icon: "precision_manufacturing",
    ar: "وحدة التقنيات المتقدمة", en: "Advanced Technologies Unit",
    descAr: "أحدث تقنيات الليزر والتصنيع الرقمي لعلاج أدق وتعافٍ أسرع وتجربة أكثر راحة.",
    descEn: "The latest laser and digital-workflow technologies for more precise treatment, faster recovery and greater comfort.",
  },
];

function UnitBookingForm({ unit, isRtl }: { unit: Unit; isRtl: boolean }) {
  const [city, setCity] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!city || !name || !phone) {
      setError(isRtl ? "يرجى ملء جميع الحقول" : "Please fill in all fields");
      return;
    }
    if (!/^05\d{8}$/.test(phone)) {
      setError(isRtl ? "رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام" : "Phone must start with 05 and be 10 digits");
      return;
    }
    setSubmitting(true);
    setError("");

    let utm: Record<string, string> | undefined;
    let referrer: string | undefined;
    try {
      const raw = sessionStorage.getItem("mc_utm");
      if (raw) {
        const stored = JSON.parse(raw) as Record<string, string>;
        utm = {
          source: stored.utm_source,
          medium: stored.utm_medium,
          campaign: stored.utm_campaign,
          term: stored.utm_term,
          content: stored.utm_content,
          ref: stored.utm_ref,
        };
      }
      referrer = sessionStorage.getItem("mc_referrer") || undefined;
    } catch { /* ignore */ }

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, name, phone, vertical: "dental", service: unit.service, utm, referrer }),
      });
      if (res.ok) {
        trackFormSubmit();
        setSuccess(true);
        setCity(""); setName(""); setPhone("");
      } else {
        setError(isRtl ? "حدث خطأ، حاول مرة أخرى" : "Something went wrong, please try again");
      }
    } catch {
      setError(isRtl ? "خطأ في الاتصال" : "Network error, please try again");
    }
    setSubmitting(false);
  };

  const inputCls =
    "mt-1 w-full bg-white border-[1.5px] border-[#B9BCC1] rounded-lg px-3 py-2.5 text-[14px] text-[#24272B] placeholder-[#797C82]/70 focus:outline-none focus:border-[#004d99] focus:ring-[3px] focus:ring-[#004d99]/25 transition-colors";
  const labelCls = "block text-[12px] font-bold text-[#003868]";

  if (success) {
    return (
      <div className="text-center py-6">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#178038" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM8.5 12l2.5 2.5 4.5-5" /></svg>
        <h4 className="text-lg font-bold text-[#003868]">{isRtl ? "تم استلام طلبك بنجاح" : "Request received!"}</h4>
        <p className="mt-1.5 text-[14px] text-[#3D434D] leading-relaxed">
          {isRtl ? "سيتواصل معك فريقنا قريباً لتأكيد موعدك." : "Our team will contact you shortly to confirm."}
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-3.5" onSubmit={(e) => { e.preventDefault(); submit(); }}>
      {error && <div className="bg-red-50 text-red-700 text-[13px] px-3.5 py-2.5 rounded-lg font-medium">{error}</div>}
      <div className="grid grid-cols-2 gap-3">
        <label className={labelCls}>
          {isRtl ? "الاسم الكامل" : "Full name"}
          <input className={inputCls} placeholder={isRtl ? "اسمك الكريم" : "Your name"} value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label className={labelCls}>
          {isRtl ? "رقم الجوال" : "Phone"}
          <input dir="ltr" maxLength={10} inputMode="numeric" className={`${inputCls} text-left`} placeholder="05XXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} required />
        </label>
      </div>
      <label className={labelCls}>
        {isRtl ? "المدينة" : "City"}
        <select className={`${inputCls} appearance-none cursor-pointer`} value={city} onChange={(e) => setCity(e.target.value)} required>
          <option value="" disabled>{isRtl ? "اختر المدينة" : "Select city"}</option>
          <option value="Riyadh">{isRtl ? "الرياض" : "Riyadh"}</option>
          <option value="Jeddah">{isRtl ? "جدة" : "Jeddah"}</option>
        </select>
      </label>
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-[#004d99] hover:bg-[#003868] text-white font-bold py-3 rounded-full shadow-lg shadow-[#004d99]/30 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
      >
        {submitting ? (isRtl ? "جارٍ الإرسال..." : "Submitting...") : (isRtl ? "احجز في هذه الوحدة" : "Book in this unit")}
      </button>
      <p className="text-center text-[11.5px] text-[#797C82]">
        {isRtl ? "بياناتك محمية ولن تُشارك مع أي طرف ثالث." : "Your information is private and never shared."}
      </p>
    </form>
  );
}

export default function DentalUnitsGrid({ onBookConsult }: { onBookConsult: () => void }) {
  const { lang } = useLang();
  const isRtl = lang === "ar";
  const [selected, setSelected] = useState<Unit | null>(null);

  // Close on Escape, and keep the page from scrolling behind the popup.
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [selected]);

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-[22px]">
        {UNITS.map((u) => (
          <button
            key={u.service + u.ar}
            type="button"
            onClick={() => setSelected(u)}
            className="dv-reveal group relative bg-white rounded-[16px] md:rounded-[20px] p-4 md:p-7 text-start shadow-[0_10px_30px_-16px_rgba(0,56,104,0.25)] hover:-translate-y-1.5 hover:shadow-[0_26px_50px_-22px_rgba(0,56,104,0.35)] transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <span className="w-11 h-11 md:w-[52px] md:h-[52px] rounded-xl md:rounded-2xl bg-[#F2F6FA] text-[#004d99] flex items-center justify-center group-hover:bg-[#004d99] group-hover:text-white transition-colors duration-300">
                <span className="material-symbols-outlined text-[22px] md:text-[26px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>
                  {u.icon}
                </span>
              </span>
              <span className="w-7 h-7 rounded-full border border-[#E3E6EA] text-[#004d99] flex items-center justify-center opacity-60 group-hover:opacity-100 group-hover:border-[#004d99]/40 transition-all duration-300" aria-hidden>
                <span className="material-symbols-outlined text-[16px]">add</span>
              </span>
            </div>
            <h3 className="mt-3.5 md:mt-5 text-[13.5px] md:text-[18px] font-bold text-[#003868] leading-[1.55] md:leading-[1.6]">
              {isRtl ? u.ar : u.en}
            </h3>
          </button>
        ))}

        {/* Booking card completes the grid */}
        <button
          type="button"
          onClick={onBookConsult}
          className="dv-reveal group relative rounded-[16px] md:rounded-[20px] p-4 md:p-7 bg-[#003868] text-start shadow-[0_18px_42px_-18px_rgba(0,31,61,0.6)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden cursor-pointer"
        >
          <img src="/dental/flower-white.png" alt="" className={`absolute -bottom-6 ${isRtl ? "-left-6" : "-right-6"} w-28 opacity-[0.12] pointer-events-none select-none`} aria-hidden />
          <span className="w-11 h-11 md:w-[52px] md:h-[52px] rounded-xl md:rounded-2xl bg-white/10 text-white flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px] md:text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>event_available</span>
          </span>
          <h3 className="mt-3.5 md:mt-5 text-[13.5px] md:text-[18px] font-bold text-white leading-[1.55] md:leading-[1.6]">
            {isRtl ? "لست متأكداً من القسم المناسب؟ فريقنا يوجهك للطبيب الصحيح." : "Not sure which unit you need? Our team will guide you to the right doctor."}
          </h3>
          <span className="mt-2 inline-flex items-center gap-1.5 text-[12px] md:text-[13.5px] font-bold text-[#9ec5ff] group-hover:text-white transition-colors">
            {isRtl ? "احجز استشارتك" : "Book a consultation"}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isRtl ? "" : "rotate-180"} aria-hidden>
              <path d="m15 6-6 6 6 6" />
            </svg>
          </span>
        </button>
      </div>

      {/* ── Unit popup: description + inline booking, no navigation ── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0b1f3a]/60 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className="relative bg-white rounded-[24px] shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              dir={isRtl ? "rtl" : "ltr"}
              role="dialog"
              aria-modal="true"
              aria-label={isRtl ? selected.ar : selected.en}
            >
              {/* Header */}
              <div className="relative bg-[#003868] text-white px-6 pt-6 pb-7 overflow-hidden">
                <img src="/dental/flower-white.png" alt="" className={`absolute -top-6 ${isRtl ? "-left-6" : "-right-6"} w-28 opacity-[0.1] pointer-events-none select-none`} aria-hidden />
                <button
                  onClick={() => setSelected(null)}
                  className={`absolute top-4 ${isRtl ? "left-4" : "right-4"} w-9 h-9 bg-white/15 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white hover:text-[#003868] transition-all cursor-pointer`}
                  aria-label={isRtl ? "إغلاق" : "Close"}
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
                <span className="w-[52px] h-[52px] rounded-2xl bg-white/10 text-white flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>
                    {selected.icon}
                  </span>
                </span>
                <h3 className="text-[19px] font-extrabold leading-[1.5] pe-10">{isRtl ? selected.ar : selected.en}</h3>
              </div>

              <div className="p-6">
                <p className="text-[14.5px] text-[#3D434D] leading-[1.95]">{isRtl ? selected.descAr : selected.descEn}</p>
                <div className="my-5 h-px bg-[#E3E6EA]" aria-hidden />
                <h4 className="text-[15px] font-bold text-[#003868] mb-3.5">
                  {isRtl ? "احجز موعدك في هذه الوحدة" : "Book an appointment in this unit"}
                </h4>
                <UnitBookingForm unit={selected} isRtl={isRtl} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

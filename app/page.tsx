"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useLang } from "./i18n/context";
import translations, { type TranslationKey } from "./i18n/translations";
import { trackFormSubmit, trackPhoneClick, trackWhatsAppClick } from "./lib/tracking";
import SiteNav from "./components/SiteNav";
import SiteFooter from "./components/SiteFooter";
import DoctorsCarousel from "./components/DoctorsCarousel";

const specKeys = [
  "allergyImmunology", "audioVestibular", "cardiology", "dental", "dermatologyCosmetics",
  "emergency", "endocrinologyDiabetes", "ent", "familyMedicine", "gastroenterology",
  "generalSurgery", "geriatricMedicine", "hematology", "internalMedicine", "nephrology",
  "neurology", "nutrition", "obGyn", "occupationalMedicine", "ophthalmology",
  "orthopedics", "pediatrics", "physiotherapy", "psychiatryPsychology", "pulmonologySleep",
  "rheumatology", "urology",
] as const;

const specIcons = [
  "vaccines", "hearing", "cardiology", "dentistry", "dermatology",
  "emergency", "metabolism", "ent", "family_restroom", "gastroenterology",
  "surgical", "elderly", "bloodtype", "stethoscope", "nephrology",
  "neurology", "restaurant", "health_and_safety", "work", "visibility",
  "skeleton", "child_care", "physical_therapy", "psychology", "pulmonology",
  "rheumatology", "water_drop",
];

const svcKeys = ["radiology", "laboratory", "pharmacy", "physiotherapy", "homeHealthcare", "myCare"] as const;
const svcIcons = ["radiology", "biotech", "local_pharmacy", "physical_therapy", "home_health", "support_agent"];
const svcImages = ["/clinic/mri.webp", "/clinic/lab.webp", "/clinic/pharmacy.webp", "/clinic/physiotherapy.webp", "/clinic/ax.webp", "/clinic/nurse-station.webp"];

const branches = [
  { name: "Al Sahafa", nameAr: "الصحافة", city: "Riyadh", cityAr: "الرياض", image: "/clinic/riyadh.webp", mapUrl: "https://maps.app.goo.gl/5XEWuSVKVzkJNyWt6", isDental: false, isRiyadh: true },
  { name: "Al Mohammadiyah", nameAr: "المحمدية", city: "Jeddah", cityAr: "جدة", image: "/clinic/branch-mohammadiyah-building.webp", mapUrl: "https://www.google.com/maps/place/My+Clinic/@21.6589018,39.1224875,17z/data=!3m1!4b1!4m6!3m5!1s0x15c3d9a3312f53ab:0x9dbc0ed7bf423fab!8m2!3d21.6589018!4d39.1224875!16s%2Fg%2F11dyrcw8t2?entry=ttu&g_ep=EgoyMDI2MDMzMC4wIKXMDSoASAFQAw%3D%3D", isDental: false, isRiyadh: false },
  { name: "Al Safa", nameAr: "الصفا", city: "Jeddah", cityAr: "جدة", image: "/clinic/safa.webp", mapUrl: "https://maps.app.goo.gl/zWd9vWV6m6Sukb956", isDental: false, isRiyadh: false },
  { name: "Al Khalidiyyah", nameAr: "الخالدية", city: "Jeddah", cityAr: "جدة", label: "Dental Clinic", labelAr: "عيادة الأسنان", image: "/clinic/branch-khalidiyyah-building.webp", mapUrl: "https://maps.app.goo.gl/exmYNncSGTQAfDzV6", isDental: true, isRiyadh: false },
  { name: "Al Tahlia", nameAr: "التحلية", city: "Jeddah", cityAr: "جدة", image: "/clinic/branch-tahlia-building.webp", mapUrl: "https://maps.app.goo.gl/ST25xhT8Hpe8PZp87", isDental: false, isRiyadh: false, isTahlia: true },
  { name: "Obhour", nameAr: "أبحر", city: "Jeddah", cityAr: "جدة", image: "/clinic/branch-obhour-building.webp", mapUrl: "https://maps.app.goo.gl/vmem2gxxNnHzv4q17", isDental: false, isRiyadh: false },
];

const slideImages = ["/clinic/reception.webp", "/clinic/lobby.webp", "/clinic/nurse-station.webp"];

const WHATSAPP_LINK = `https://wa.me/966920022811?text=${encodeURIComponent("مرحباً، أود حجز موعد في عيادتي")}`;

export default function Home() {
  const { lang, ready } = useLang();
  const t = translations[lang];
  const isRtl = lang === "ar";
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");
  const branchesByCity: Record<string, string[]> = {
    Jeddah: ["Al Mohammadiyah", "Al Safa", "Al Khalidiyyah (Dental)", "Al Tahlia", "Obhour"],
    Riyadh: ["Al Sahafa"],
  };
  const branchNameAr: Record<string, string> = {
    "Al Mohammadiyah": "المحمدية",
    "Al Safa": "الصفا",
    "Al Khalidiyyah (Dental)": "الخالدية (أسنان)",
    "Al Tahlia": "التحلية",
    "Obhour": "أبحر",
    "Al Sahafa": "الصحافة",
  };
  const locationsRef = useRef<HTMLDivElement>(null);

  // Scroll helper that works consistently across LTR and RTL.
  const scrollContainer = (container: HTMLElement | null, direction: 'prev' | 'next', amount: number) => {
    if (!container) return;
    const forward = direction === 'next' ? 1 : -1;
    const rtlFactor = isRtl ? -1 : 1;
    container.scrollBy({ left: forward * rtlFactor * amount, behavior: 'smooth' });
  };

  const scrollLocations = (direction: 'prev' | 'next') => {
    const container = locationsRef.current;
    const cardWidth = container?.querySelector<HTMLElement>(':scope > a')?.offsetWidth || 350;
    scrollContainer(container, direction, cardWidth + 24);
  };

  const handleFormSubmit = async () => {
    if (!selectedCity || !formName || !formPhone) {
      setFormError(lang === "ar" ? "يرجى ملء جميع الحقول" : "Please fill in all fields");
      return;
    }
    if (!/^05\d{8}$/.test(formPhone)) {
      setFormError(lang === "ar" ? "رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام" : "Phone number must start with 05 and be 10 digits");
      return;
    }
    setFormSubmitting(true);
    setFormError("");
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
        body: JSON.stringify({
          city: selectedCity,
          name: formName,
          phone: formPhone,
          utm,
          referrer,
        }),
      });
      if (res.ok) {
        trackFormSubmit();
        setFormSuccess(true);
        setSelectedCity("");
        setFormName(""); setFormPhone("");
      } else {
        setFormError(lang === "ar" ? "حدث خطأ، حاول مرة أخرى" : "Something went wrong, please try again");
      }
    } catch {
      setFormError(lang === "ar" ? "خطأ في الاتصال" : "Network error, please try again");
    }
    setFormSubmitting(false);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Capture UTM params on first visit and log a server-side click
  useEffect(() => {
    import("./lib/utm-client").then((m) => m.captureAndTrackUtm()).catch(() => {});
  }, []);

  const slideTitles = [
    <>{t.slide1Title} <em className="text-secondary not-italic">{t.slide1Highlight}</em> {t.slide1End}</>,
    <>{t.slide2Title} <em className="text-secondary not-italic">{t.slide2Highlight}</em></>,
    <>{t.slide3Title} <em className="text-secondary not-italic">{t.slide3Highlight}</em></>,
  ];
  const slideSubtitles = [t.slide1Subtitle, t.slide2Subtitle, t.slide3Subtitle];

  if (!ready) {
    return <div className="min-h-screen bg-surface" />;
  }

  return (
    <div className="bg-surface font-body text-on-surface antialiased overflow-x-hidden">
      {/* Main Navigation */}
      <SiteNav />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-surface hero-gradient">
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] animate-[pulse_8s_ease-in-out_infinite]"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] animate-[pulse_10s_ease-in-out_1s_infinite]"></div>
          <svg className="absolute inset-0 w-full h-full opacity-10" preserveAspectRatio="none" viewBox="0 0 100 100">
            <defs>
              <pattern height="10" id="grid" patternUnits="userSpaceOnUse" width="10">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.1"></path>
              </pattern>
            </defs>
            <rect fill="url(#grid)" height="100" width="100"></rect>
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10 py-12 md:py-20">
          {/* Title & Subtitle - order 1 on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:col-span-6 flex flex-col space-y-6 lg:space-y-8"
          >
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-extrabold uppercase tracking-label w-fit">
              {t.premiumHealthcare}
            </div>
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className={`text-4xl md:text-6xl lg:text-7xl font-headline font-extrabold text-primary tracking-tighter text-glow mb-4 ${isRtl ? "leading-[1.4]" : "leading-[1.1]"}`}>
                    {slideTitles[currentSlide]}
                  </h1>
                  <p className="text-on-surface-variant text-base md:text-lg max-w-lg font-medium leading-relaxed opacity-90">
                    {slideSubtitles[currentSlide]}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
            {/* Pagination Dots */}
            <div className="flex items-center gap-2">
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`border-0 w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    currentSlide === i ? "bg-primary w-8" : "bg-primary/20 hover:bg-primary/40"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </motion.div>

          {/* Image Slider - order 2 on mobile (between title & buttons), right column on desktop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="order-2 lg:col-span-6 lg:row-span-2 relative w-full"
          >
            <div className="relative w-full aspect-[4/5] lg:aspect-square">
              <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,77,153,0.3)] border-4 md:border-8 border-white group bg-surface-container">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0"
                  >
                    <Image
                      alt="My Clinic"
                      src={slideImages[currentSlide]}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority={currentSlide === 0}
                    />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent pointer-events-none z-10"></div>
              </div>
              <div
                className={`absolute -bottom-4 md:-bottom-8 ${isRtl ? "right-4 md:-right-12" : "left-4 md:-left-12"} p-4 md:p-8 glass-effect rounded-2xl shadow-2xl border border-white/50 backdrop-blur-xl w-[200px] md:max-w-[280px] animate-[float_4s_ease-in-out_infinite]`}
              >
                <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-secondary flex items-center justify-center text-white shadow-lg">
                    <span className="material-symbols-outlined text-sm md:text-base">medical_services</span>
                  </div>
                  <div>
                    <p className="text-[9px] md:text-[10px] font-bold text-primary uppercase tracking-widest">{t.multispecialtyCare}</p>
                    <p className="text-lg md:text-xl font-headline font-extrabold text-on-surface">{t.specialties27}</p>
                  </div>
                </div>
                <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                  <div className="bg-secondary h-full w-[99.8%] rounded-full"></div>
                </div>
              </div>
              <div className={`absolute top-4 md:top-12 ${isRtl ? "left-4 md:-left-8" : "right-4 md:-right-8"} p-4 md:p-6 bg-primary text-white rounded-2xl shadow-2xl border border-white/20`}>
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-2 md:w-3 h-2 md:h-3 bg-secondary-fixed rounded-full animate-pulse"></div>
                  <span className="text-xs md:text-sm font-bold uppercase tracking-widest">{isRtl ? "أفضل الأطباء في المملكة" : "Top Doctors in KSA"}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Buttons & Rating - order 3 on mobile (after image) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="order-3 lg:col-span-6 flex flex-col space-y-6 lg:space-y-8"
          >
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              <button
                onClick={() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative px-6 md:px-10 py-4 md:py-5 bg-primary text-white rounded-full font-bold text-sm md:text-base shadow-2xl shadow-primary/30 overflow-hidden transition-all hover:-translate-y-1 hover:shadow-primary/40 active:translate-y-0 cursor-pointer"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {t.requestAppointment}
                  <span className={`material-symbols-outlined transition-transform ${isRtl ? "group-hover:-translate-x-1 rotate-180" : "group-hover:translate-x-1"}`}>arrow_forward</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </button>
              <button
                onClick={() => { trackWhatsAppClick(); window.open(WHATSAPP_LINK, '_blank'); }}
                className="cursor-pointer px-6 md:px-10 py-4 md:py-5 bg-white text-primary border-2 border-primary/10 rounded-full font-bold text-sm md:text-base shadow-xl hover:bg-surface-container-low hover:border-primary/20 transition-all flex items-center gap-2"
              >
                <Image src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" width={20} height={20} className="pointer-events-none" unoptimized />
                {t.whatsappUs}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Specialties & Services Section */}
      <section className="py-16 md:py-24 bg-surface-container-low px-4 md:px-0 hidden">
        <div className="max-w-7xl mx-auto md:px-8">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-primary font-extrabold text-xs uppercase tracking-label block mb-4">{t.specialtiesServices}</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight">{t.comprehensiveCare}</h2>
            <p className="text-on-surface-variant mt-4 max-w-2xl mx-auto font-medium">{t.comprehensiveCareDesc}</p>
          </div>
          <div
            className="flex flex-wrap justify-center border border-outline-variant/10 rounded-2xl overflow-hidden"
          >
            {specKeys.map((key, i) => (
              <div key={key} className="w-1/3 sm:w-1/4 lg:w-1/5 xl:w-[16.666%] bg-surface-container-lowest p-4 md:p-5 flex flex-col items-center text-center border-b border-r border-outline-variant/10 hover:bg-primary group transition-all duration-500">
                <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-primary-fixed flex items-center justify-center group-hover:bg-white transition-colors mb-3">
                  <span className="material-symbols-outlined text-primary group-hover:text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>{specIcons[i]}</span>
                </div>
                <h4 className="text-xs md:text-sm font-extrabold text-primary group-hover:text-white mb-0.5 leading-tight">{t[`spec.${key}` as TranslationKey]}</h4>
                <p className="text-on-surface-variant text-[10px] group-hover:text-white/80 hidden lg:block">{t[`specDesc.${key}` as TranslationKey]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <DoctorsCarousel showTabs />

      {/* Additional Services Section */}
      <section className="py-16 md:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-secondary font-extrabold text-xs uppercase tracking-label block mb-4">{t.beyondMedicalCare}</span>
            <h2 className="text-3xl md:text-4xl font-headline font-extrabold text-primary tracking-tight">{t.premiumServicesFacilities}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {svcKeys.map((key, i) => (
              <div
                key={key}
                className="group relative rounded-2xl overflow-hidden shadow-clinical hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image src={svcImages[i]} alt={t[`svc.${key}` as TranslationKey] as string} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>{svcIcons[i]}</span>
                    </div>
                    <h4 className="text-lg font-extrabold">{t[`svc.${key}` as TranslationKey]}</h4>
                  </div>
                  <p className="text-white/80 text-sm font-medium">{t[`svc.${key}Desc` as TranslationKey]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-white px-4 md:px-0">
        <div className="max-w-7xl mx-auto md:px-8">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-secondary font-extrabold text-xs uppercase tracking-label block mb-4">{t.testimonials}</span>
            <h2 className="text-3xl md:text-4xl font-headline font-extrabold text-primary tracking-tight">{t.whatPatientsSay}</h2>
            <p className="text-on-surface-variant mt-3 max-w-xl mx-auto font-medium">{t.testimonialsDesc}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              { text: t.testimonial1, initials: "MA", name: "Modi Abdullah", color: "bg-primary" },
              { text: t.testimonial2, initials: "LJ", name: "Lina JI", color: "bg-secondary" },
              { text: t.testimonial3, initials: "RA", name: "Raghad Al-Ghamdi", color: "bg-tertiary" },
            ].map((review, i) => (
              <div key={i} className="bg-surface-container-lowest rounded-2xl p-8 shadow-clinical hover:-translate-y-1 transition-all duration-300">
                <div className="flex gap-1 text-yellow-400 mb-4">
                  {[1,2,3,4,5].map((s) => <span key={s} className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>)}
                </div>
                <p className="text-on-surface-variant italic mb-6 font-medium leading-relaxed">{review.text}</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${review.color} flex items-center justify-center text-white font-bold text-sm`}>{review.initials}</div>
                  <div>
                    <p className="font-bold text-on-surface">{review.name}</p>
                    <p className="text-xs text-on-surface-variant">{t.googleReview}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <button type="button" onClick={() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex items-center gap-3 px-8 py-4 bg-primary border-2 border-primary rounded-full font-bold text-white hover:bg-primary/90 hover:border-primary/90 transition-all shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-xl">calendar_month</span>
              {t.bookAppointmentCta}
            </button>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-16 md:py-24 bg-surface-container-low overflow-x-clip">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-end justify-between mb-12 md:mb-16">
            <div className="text-center flex-1">
              <span className="text-secondary font-extrabold text-xs uppercase tracking-label block mb-4">{t.ourLocations}</span>
              <h2 className="text-3xl md:text-4xl font-headline font-extrabold text-primary tracking-tight">{t.findLocation}</h2>
              <p className="text-on-surface-variant mt-3 max-w-xl mx-auto font-medium">{t.findLocationDesc}</p>
            </div>
            <div className="hidden md:flex gap-3 shrink-0 pb-1">
              <button onClick={() => scrollLocations('prev')} className="w-11 h-11 bg-white rounded-full shadow-md flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all hover:scale-110 cursor-pointer border border-outline-variant/20" aria-label="Previous locations">
                <span className="material-symbols-outlined">{isRtl ? "chevron_right" : "chevron_left"}</span>
              </button>
              <button onClick={() => scrollLocations('next')} className="w-11 h-11 bg-white rounded-full shadow-md flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all hover:scale-110 cursor-pointer border border-outline-variant/20" aria-label="Next locations">
                <span className="material-symbols-outlined">{isRtl ? "chevron_left" : "chevron_right"}</span>
              </button>
            </div>
          </div>
          <div className="relative">
            <div ref={locationsRef} className="flex overflow-x-scroll snap-x snap-mandatory gap-6 pb-6 md:pb-8 hide-scrollbar" style={{ scrollBehavior: 'smooth' }}>
              {branches.map((branch, i) => (
                <a key={i} href={branch.mapUrl} target="_blank" rel="noopener noreferrer" className="w-[320px] sm:w-[360px] snap-start shrink-0 bg-white rounded-2xl overflow-hidden shadow-clinical group block">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image src={branch.image} alt={`My Clinic ${branch.name}`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="360px" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 flex gap-2">
                      <span className="bg-white text-primary px-3 py-1 rounded-full text-xs font-bold">{isRtl ? branch.cityAr : branch.city}</span>
                      {branch.label && <span className="bg-secondary text-white px-3 py-1 rounded-full text-xs font-bold">{isRtl ? branch.labelAr : branch.label}</span>}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-headline font-extrabold text-primary mb-1">{isRtl ? `${branch.nameAr}، ${branch.cityAr}` : `${branch.name}, ${branch.city}`}</h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-on-surface-variant">
                        <span className="material-symbols-outlined text-primary text-base mt-0.5">schedule</span>
                        <div className="text-xs space-y-1">
                          {branch.isDental ? (
                            <>
                              <p className="font-bold text-primary text-[11px]">{t.dentalClinicLabel}</p>
                              <p className="font-medium">{t.dentalSatThu}</p>
                              <p className="font-medium">{t.dentalFri}</p>
                            </>
                          ) : (branch as any).isTahlia ? (
                            <>
                              <p className="font-medium">{isRtl ? "السبت – الخميس: 1:00 م – 9:00 م" : "Sat – Thu: 1:00 PM – 9:00 PM"}</p>
                              <p className="font-bold text-error">{t.friClosed}</p>
                            </>
                          ) : (
                            <>
                              <p className="font-medium">{t.sunThu}</p>
                              {branch.isRiyadh ? (
                                <p className="font-bold text-error">{t.friClosed}</p>
                              ) : (
                                <p className="font-medium">{t.fri}</p>
                              )}
                              <p className="font-medium">{t.sat}</p>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-on-surface-variant">
                        <span className="material-symbols-outlined text-primary text-base">call</span>
                        <span className="text-xs font-bold text-primary" dir="ltr">920 022 811</span>
                      </div>
                      <div className="flex items-center gap-2 text-on-surface-variant">
                        <span className="material-symbols-outlined text-primary text-base">location_on</span>
                        <span className="text-xs font-bold text-secondary">{t.viewOnMap}</span>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
            {/* Mobile-only arrows below cards */}
            <div className="flex md:hidden justify-center gap-4 mt-5">
              <button onClick={() => scrollLocations('prev')} className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center text-primary active:bg-primary active:text-white transition-all cursor-pointer border border-outline-variant/20" aria-label="Previous locations">
                <span className="material-symbols-outlined text-lg">{isRtl ? "chevron_right" : "chevron_left"}</span>
              </button>
              <button onClick={() => scrollLocations('next')} className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center text-primary active:bg-primary active:text-white transition-all cursor-pointer border border-outline-variant/20" aria-label="Next locations">
                <span className="material-symbols-outlined text-lg">{isRtl ? "chevron_left" : "chevron_right"}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Appointment & Info Section */}
      <section className="py-16 md:py-24 bg-surface px-4 md:px-0">
        <div className="max-w-7xl mx-auto md:px-8 grid lg:grid-cols-2 gap-12 md:gap-16">
          {/* Opening Hours & Patient Stories */}
          <div className="space-y-12">
            <div className="bg-primary text-white p-8 md:p-10 rounded-xl shadow-2xl">
              <h3 className="text-2xl font-extrabold mb-8 flex items-center gap-4">
                <span className="material-symbols-outlined">schedule</span>
                {t.openingHours}
              </h3>
              <div className="space-y-4">
                <div className="border-b border-white/20 pb-3">
                  <div className="flex justify-between">
                    <span className="font-medium">{isRtl ? "الأحد – الخميس" : "Sunday – Thursday"}</span>
                    <span className="font-bold">{isRtl ? "9:00 صباحًا – 9:00 مساءً" : "9:00 AM – 9:00 PM"}</span>
                  </div>
                  <p className="text-secondary-fixed font-bold text-xs mt-2">{isRtl ? "الرياض: مغلق يوم الجمعة" : "Riyadh: Closed on Friday"}</p>
                  <p className="text-secondary-fixed font-bold text-xs mt-1">{isRtl ? "التحلية: 1:00 مساءً – 9:00 مساءً، مغلق يوم الجمعة" : "Al Tahlia: 1:00 PM – 9:00 PM, Closed on Friday"}</p>
                </div>
                <div className="flex justify-between border-b border-white/20 pb-3">
                  <span className="font-medium">{isRtl ? "الجمعة" : "Friday"}</span>
                  <span className="font-bold">{isRtl ? "5:00 مساءً – 9:00 مساءً" : "5:00 PM – 9:00 PM"}</span>
                </div>
                <div className="flex justify-between border-b border-white/20 pb-3">
                  <span className="font-medium">{isRtl ? "السبت" : "Saturday"}</span>
                  <span className="font-bold">{isRtl ? "1:00 مساءً – 9:00 مساءً" : "1:00 PM – 9:00 PM"}</span>
                </div>
              </div>
              {/* Dental Hours */}
              <div className="mt-6 pt-6 border-t border-white/20">
                <h4 className="font-extrabold text-sm mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>dentistry</span>
                  {isRtl ? "عيادة الأسنان" : "Dental Clinic"}
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between border-b border-white/10 pb-3">
                    <span className="font-medium text-sm">{isRtl ? "السبت – الخميس" : "Saturday – Thursday"}</span>
                    <span className="font-bold text-sm">{isRtl ? "10:00 صباحًا – 10:00 مساءً" : "10:00 AM – 10:00 PM"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-sm">{isRtl ? "الجمعة" : "Friday"}</span>
                    <span className="font-bold text-sm">{isRtl ? "4:00 عصرًا – 8:00 مساءً" : "4:00 PM – 8:00 PM"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Appointment Form */}
          <div id="booking-form" className="bg-surface-container-lowest p-8 md:p-10 rounded-xl shadow-clinical scroll-mt-24">
            <div className="mb-10">
              <h3 className="text-3xl font-extrabold text-primary mb-2">{t.requestYourAppointment}</h3>
              <p className="text-on-surface-variant font-medium">{t.formDesc}</p>
            </div>
            {formSuccess ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h4 className="text-2xl font-extrabold text-primary mb-2">{lang === "ar" ? "تم إرسال طلبك بنجاح!" : "Request Submitted!"}</h4>
                <p className="text-on-surface-variant font-medium mb-6">{lang === "ar" ? "سيتواصل معك منسقنا الطبي قريباً." : "Our medical coordinator will contact you soon."}</p>
                <button onClick={() => setFormSuccess(false)} className="text-primary font-bold hover:underline cursor-pointer">{lang === "ar" ? "إرسال طلب آخر" : "Submit another request"}</button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleFormSubmit(); }}>
                {formError && (
                  <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl font-medium">{formError}</div>
                )}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-primary uppercase tracking-widest">{t.yourName}</label>
                    <input className="w-full bg-surface border-0 rounded-xl p-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary transition-all" placeholder={t.fullName} type="text" value={formName} onChange={(e) => setFormName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-primary uppercase tracking-widest">{t.phone}</label>
                    <input className="w-full bg-surface border-0 rounded-xl p-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary transition-all" placeholder="05X XXX XXXX" type="tel" dir="ltr" maxLength={10} value={formPhone} onChange={(e) => setFormPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-primary uppercase tracking-widest">{t.city}</label>
                  <select className="w-full bg-surface border-0 rounded-xl p-4 text-on-surface focus:ring-2 focus:ring-primary transition-all" required value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                    <option value="" disabled>{t.selectCity}</option>
                    <option value="Riyadh">{t.riyadh}</option>
                    <option value="Jeddah">{t.jeddah}</option>
                  </select>
                </div>
                <button
                  className="w-full bg-primary hover:bg-primary-container text-white font-extrabold py-5 rounded-full shadow-lg shadow-primary/30 active:scale-95 transition-all text-lg tracking-tight cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={formSubmitting}
                >
                  {formSubmitting ? (lang === "ar" ? "جارٍ الإرسال..." : "Submitting...") : t.requestAppointment}
                </button>
                <p className="text-center text-xs text-on-surface-variant font-medium">{t.privacyNote}</p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <SiteFooter />

      {/* Sticky Floating Buttons */}
      <div className={`fixed bottom-6 ${isRtl ? "left-6" : "right-6"} z-50 flex flex-col items-end gap-3`}>
        {/* Call Button — icon only */}
        <a
          href="tel:920022811"
          onClick={trackPhoneClick}
          className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-110 hover:shadow-xl transition-all"
          aria-label="Call us"
        >
          <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>call</span>
        </a>
        {/* WhatsApp Button — number as external label */}
        <div className={`flex items-center gap-2 ${isRtl ? "flex-row-reverse" : "flex-row"}`}>
          <span className="bg-white text-[#25D366] text-xs font-bold px-3 py-1.5 rounded-full shadow-md border border-[#25D366]/20 whitespace-nowrap">{isRtl ? "احجز الآن عبر واتساب" : "Chat now on WhatsApp"}</span>
          <a
            href={WHATSAPP_LINK}
            onClick={trackWhatsAppClick}
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:scale-110 hover:shadow-xl hover:shadow-[#25D366]/40 transition-all animate-bounce [animation-duration:2s] [animation-iteration-count:infinite]"
            aria-label="Chat on WhatsApp"
          >
            <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white">
              <path d="M16.004 0C7.165 0 .004 7.161.004 16c0 2.822.737 5.561 2.137 7.978L.003 32l8.207-2.108A15.926 15.926 0 0 0 16.004 32C24.843 32 32 24.839 32 16S24.843 0 16.004 0zm0 29.09a13.05 13.05 0 0 1-6.64-1.813l-.476-.283-4.933 1.267 1.313-4.79-.31-.494A13.008 13.008 0 0 1 2.914 16c0-7.221 5.869-13.09 13.09-13.09S29.094 8.779 29.094 16s-5.869 13.09-13.09 13.09zm7.175-9.803c-.393-.197-2.326-1.148-2.687-1.279-.362-.131-.625-.197-.888.197s-1.02 1.279-1.25 1.542-.462.296-.855.099c-.393-.197-1.66-.612-3.163-1.95-1.17-1.043-1.96-2.33-2.19-2.723-.229-.393-.024-.605.172-.8.177-.177.393-.462.59-.693.197-.23.262-.394.393-.656.131-.262.066-.492-.033-.689-.099-.197-.888-2.14-1.217-2.93-.32-.769-.646-.665-.888-.677-.229-.011-.492-.014-.755-.014s-.69.099-1.05.492c-.362.394-1.381 1.35-1.381 3.293s1.414 3.82 1.611 4.083c.197.262 2.783 4.248 6.743 5.957.942.407 1.677.65 2.25.832.946.3 1.806.258 2.486.157.758-.113 2.326-.951 2.655-1.869.328-.918.328-1.705.23-1.869-.099-.164-.362-.262-.755-.46z" />
            </svg>
          </a>
        </div>
      </div>

    </div>
  );
}

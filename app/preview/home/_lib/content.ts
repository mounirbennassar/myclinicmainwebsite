/**
 * Copy + static data for the v2 home page (internal preview at /preview/home).
 *
 * Wording that already exists on the live home page is read from
 * app/i18n/translations.ts at render time, so the two pages cannot drift;
 * only the NEW lines the v5 layout needs live here.
 *
 * Arabic is written WITHOUT tashkeel — a standing rule for this site.
 */

export type L = { en: string; ar: string };
export const pick = (l: L, isRtl: boolean) => (isRtl ? l.ar : l.en);

export const PHONE_TEL = "920022811";
export const PHONE_DISPLAY = "920 022 811";
export const whatsappLink = (isRtl: boolean) =>
  `https://wa.me/966920022811?text=${encodeURIComponent(
    isRtl ? "مرحبا، أود حجز موعد في عيادتي" : "Hello, I would like to book an appointment at My Clinic."
  )}`;

/* ─────────────────────────── Hero ─────────────────────────── */

export type HeroSlide = { lines: { en: [string, string]; ar: [string, string] }; sub: L; image: string; alt: L };

export const HERO_SLIDES: HeroSlide[] = [
  {
    lines: { en: ["Experience", "premium care."], ar: ["رعاية استثنائية", "تقدم بسلاسة."] },
    sub: {
      en: "A fully integrated, premium healthcare experience — designed around you.",
      ar: "تجربة صحية متكاملة وفاخرة، مصممة بالكامل لتتمحور حولك.",
    },
    image: "/clinic/lobby.jpg",
    alt: { en: "The bright, wood-lined lobby of a My Clinic branch", ar: "ردهة عيادتي المضيئة بتصميمها الخشبي" },
  },
  {
    lines: { en: ["A different", "standard of care."], ar: ["معيار مختلف", "للرعاية الصحية."] },
    sub: {
      en: "We go beyond treatment — delivering a coordinated, end-to-end healthcare experience.",
      ar: "لا نكتفي بالعلاج، بل نقدم تجربة صحية منسقة ومتكاملة من البداية وحتى المتابعة.",
    },
    image: "/clinic/facade.jpg",
    alt: { en: "The My Clinic building with its arched mashrabiya facade", ar: "مبنى عيادتي بواجهته المزخرفة" },
  },
  {
    lines: { en: ["Concierge care,", "redefined."], ar: ["رعاية ومتابعة شخصية", "بمفهوم جديد."] },
    sub: {
      en: "Your Care Coordinator manages every step — from scheduling to follow-ups and referrals.",
      ar: "منسق رعاية شخصي يدير كل خطوة في رحلتك، من حجز الموعد إلى المتابعة والتحويلات.",
    },
    image: "/clinic/reception.jpg",
    alt: { en: "A patient welcomed at the My Clinic reception desk", ar: "استقبال أحد المراجعين في عيادتي" },
  },
];

/* ───────────────────────── Sections ───────────────────────── */

export const COPY = {
  previewBadge: { en: "Internal preview", ar: "معاينة داخلية" },
  bookAppointment: { en: "Book appointment", ar: "احجز موعدك" },
  heroEyebrow: { en: "Premium healthcare · Jeddah & Riyadh", ar: "رعاية صحية متميزة · جدة والرياض" },
  heroStatus: { en: "6 branches across Jeddah & Riyadh", ar: "6 فروع في جدة والرياض" },
  scrollHint: { en: "Scroll to explore", ar: "مرر للاستكشاف" },
  finderSpecialty: { en: "Specialty", ar: "التخصص" },
  finderAnySpecialty: { en: "Any specialty", ar: "جميع التخصصات" },
  finderCity: { en: "City", ar: "المدينة" },
  finderAnyCity: { en: "All cities", ar: "جميع المدن" },
  finderSubmit: { en: "Find a doctor", ar: "ابحث عن طبيب" },

  statSpecialties: { en: "Medical specialties", ar: "تخصص طبي" },
  statDoctors: { en: "Doctors & consultants", ar: "طبيب واستشاري" },
  statBranches: { en: "Branches in 2 cities", ar: "فروع في مدينتين" },
  statPatients: { en: "Patients every month", ar: "مريض شهريا" },

  specEyebrow: { en: "Our specialties", ar: "تخصصاتنا" },
  specTitle: { en: ["Comprehensive care", "under one roof."], ar: ["رعاية شاملة", "تحت سقف واحد."] },
  specMore: { en: "View all 27 specialties", ar: "عرض التخصصات الـ27 كاملة" },
  specLess: { en: "Show fewer", ar: "عرض أقل" },

  svcTitle: { en: ["Everything you need,", "in one place."], ar: ["كل ما تحتاجه", "في مكان واحد."] },
  svcDesc: {
    en: "Radiology, laboratory, pharmacy and recovery services sit beside your doctor, so your care moves at your pace.",
    ar: "الأشعة والمختبر والصيدلية وخدمات التأهيل بجوار طبيبك، لتسير رعايتك بالوتيرة التي تناسبك.",
  },
  svcMore: { en: "View more services", ar: "عرض المزيد من الخدمات" },

  progEyebrow: { en: "Centers of care", ar: "مراكز الرعاية" },
  progTitle: { en: ["Programs built", "around your life."], ar: ["برامج مصممة", "حول حياتك."] },
  progDesc: {
    en: "Dedicated centers and care programs for every member of the family.",
    ar: "مراكز وبرامج رعاية متخصصة لكل فرد من أفراد العائلة.",
  },
  explore: { en: "Explore", ar: "اكتشف المزيد" },

  docTitle: { en: ["World-class", "medical minds."], ar: ["كفاءات طبية", "عالمية."] },
  docDesc: {
    en: "{n} consultants and specialists across Jeddah and Riyadh. Choose a specialty to meet the team.",
    ar: "أكثر من {n} استشاري وأخصائي في جدة والرياض. اختر التخصص للتعرف على الفريق.",
  },
  allDoctors: { en: "All", ar: "الكل" },
  viewProfile: { en: "View profile", ar: "عرض الملف" },
  dragHint: { en: "Drag to explore", ar: "اسحب للاستكشاف" },

  expEyebrow: { en: "The My Clinic experience", ar: "تجربة عيادتي" },
  expTitle: { en: ["Every detail,", "considered."], ar: ["كل التفاصيل", "مدروسة بعناية."] },

  locTitle: { en: ["Care, close", "to home."], ar: ["رعاية قريبة", "من منزلك."] },
  allCities: { en: "All cities", ar: "جميع المدن" },
  openNow: { en: "Open now", ar: "مفتوح الآن" },
  closedNow: { en: "Closed now", ar: "مغلق الآن" },
  bookHere: { en: "Book at this branch", ar: "احجز في هذا الفرع" },
  directions: { en: "Directions to", ar: "الاتجاهات إلى" },
  multiSpecialty: { en: "Multi-specialty clinic", ar: "مجمع طبي متعدد التخصصات" },
  dentalClinic: { en: "Dental clinic", ar: "عيادة الأسنان" },
  closed: { en: "Closed", ar: "مغلق" },
  prev: { en: "Previous", ar: "السابق" },
  next: { en: "Next", ar: "التالي" },

  storiesTitle: { en: ["In their", "own words."], ar: ["تجارب", "مرضانا."] },
  ratingLabel: { en: "Average patient rating", ar: "متوسط تقييم المرضى" },

  bookEyebrow: { en: "Your next step", ar: "خطوتك التالية" },
  bookTitle: { en: ["Let's make", "time for you."], ar: ["موعدك", "على بعد خطوة."] },
  bookDesc: {
    en: "Leave your details and our medical coordinator will call you — or reach us directly by phone or WhatsApp.",
    ar: "اترك بياناتك وسيتواصل معك منسقنا الطبي، أو تواصل معنا مباشرة عبر الهاتف أو واتساب.",
  },
  callUs: { en: "Call", ar: "اتصل" },

  footerStatement: { en: "Premium healthcare, close to you.", ar: "رعاية صحية متميزة، قريبة منك." },
  explorePages: { en: "Explore", ar: "تصفح" },
  services: { en: "Services", ar: "الخدمات" },
  getInTouch: { en: "Get in touch", ar: "تواصل معنا" },
  location: { en: "Jeddah & Riyadh, Saudi Arabia", ar: "جدة والرياض، المملكة العربية السعودية" },
} as const;

/* ───────────────────────── Services ───────────────────────── */

/** Titles/descriptions come from translations (`svc.<key>` / `svc.<key>Desc`). */
export const SERVICES: { key: string; image: string; tag: L; href?: string }[] = [
  { key: "radiology", image: "/clinic/mri.jpg", tag: { en: "Diagnostics", ar: "التشخيص" } },
  { key: "laboratory", image: "/clinic/lab.webp", tag: { en: "Diagnostics", ar: "التشخيص" } },
  { key: "pharmacy", image: "/clinic/pharmacy.jpg", tag: { en: "On site", ar: "داخل المجمع" } },
  { key: "physiotherapy", image: "/clinic/physiotherapy.jpg", tag: { en: "Recovery", ar: "التأهيل" } },
  { key: "homeHealthcare", image: "/clinic/home-phlebotomy.webp", tag: { en: "At home", ar: "في منزلك" }, href: "/health-homecare" },
  { key: "myCare", image: "/clinic/nurse-station.jpg", tag: { en: "Concierge", ar: "الكونسيرج" } },
];

/* ───────────────────────── Programs ───────────────────────── */

export const PROGRAMS: { name: L; tag: L; desc: L; href: string; image: string; alt: L; accent: string }[] = [
  {
    name: { en: "My 360", ar: "My 360" },
    tag: { en: "Proactive care programs", ar: "برامج رعاية استباقية" },
    desc: {
      en: "One clinic, one dedicated care team. Grow (0–18), Live (19–64), Thrive (65+) and Diabetes Management — each with a Consultant, Program GP and Care Coordinator. No membership fees.",
      ar: "عيادة واحدة وفريق رعاية مخصص لك. برامج رحلة طفلك وحياة وحياة متجددة وإدارة السكري، لكل منها استشاري وطبيب برنامج ومنسق رعاية، بدون رسوم عضوية.",
    },
    href: "/my360",
    image: "/clinic/consultation.webp",
    alt: { en: "A consultant reviewing an examination with a patient", ar: "استشارية تناقش الفحص مع أحد المرضى" },
    accent: "#78b4ff",
  },
  {
    name: { en: "My Clinic Dental", ar: "عيادتي للأسنان" },
    tag: { en: "Complete dental care", ar: "رعاية أسنان شاملة" },
    desc: {
      en: "From check-ups and cleaning to implants, orthodontics, veneers and whitening — in our dedicated dental clinic in Al Khalidiyyah, Jeddah.",
      ar: "من الفحص والتنظيف إلى زراعة الأسنان والتقويم والقشور والتبييض، في عيادة الأسنان المخصصة بحي الخالدية في جدة.",
    },
    href: "/dental",
    image: "/dental/39.webp",
    alt: { en: "A modern dental treatment room", ar: "غرفة علاج أسنان حديثة" },
    accent: "#5cd5f8",
  },
  {
    name: { en: "My Clinic Kids", ar: "عيادتي للأطفال" },
    tag: { en: "Pediatrics", ar: "طب الأطفال" },
    desc: {
      en: "Gentle, comprehensive care for your child by our pediatric consultants — vaccinations, growth follow-up, allergy and more.",
      ar: "رعاية طبية لطيفة ومتكاملة لطفلك على يد نخبة من استشاريي طب الأطفال: تطعيمات، متابعة نمو، حساسية، وأكثر.",
    },
    href: "/pediatric",
    image: "/kids/hero.jpg",
    alt: { en: "A pediatrician examining a smiling child", ar: "طبيبة أطفال تفحص طفلة مبتسمة" },
    accent: "#ffc56b",
  },
  {
    name: { en: "Women's Health", ar: "صحة المرأة" },
    tag: { en: "Obstetrics & gynecology", ar: "النساء والولادة" },
    desc: {
      en: "Pregnancy follow-up, gynecology, routine screenings and reproductive care by our women specialists.",
      ar: "متابعة الحمل والولادة، أمراض النساء، الفحوصات الدورية والصحة الإنجابية على أيدي نخبة من الاستشاريات المتخصصات.",
    },
    href: "/women-care",
    image: "/female-family/services/pregnancy.webp",
    alt: { en: "A mother-to-be with her doctor during a pregnancy follow-up", ar: "أم حامل مع طبيبتها أثناء متابعة الحمل" },
    accent: "#f4a7c4",
  },
  {
    name: { en: "Telehome", ar: "تيلي هوم" },
    tag: { en: "Home & virtual care", ar: "الرعاية المنزلية والافتراضية" },
    desc: {
      en: "Start with a teleconsultation, then care comes to you — lab tests, medication delivery, nursing, physiotherapy and doctor visits at home.",
      ar: "ابدأ باستشارة طبية عن بعد، ثم ننسق ما تحتاجه في منزلك: تحاليل، توصيل أدوية، تمريض، علاج طبيعي وزيارات طبيب.",
    },
    href: "/health-homecare",
    image: "/clinic/home-phlebotomy.webp",
    alt: { en: "A nurse drawing blood from a patient at home", ar: "ممرض يسحب عينة دم لمريض في منزله" },
    accent: "#7fe3c4",
  },
];

/* ──────────────────────── Experience ──────────────────────── */

export const EXPERIENCE_POINTS: { title: L; body: L }[] = [
  {
    title: { en: "Concierge Care Coordinators", ar: "منسقو رعاية الكونسيرج" },
    body: {
      en: "One coordinator manages your journey — from appointment scheduling to follow-ups and referrals.",
      ar: "منسق واحد يدير رحلتك الصحية، من حجز المواعيد إلى المتابعة والتحويلات.",
    },
  },
  {
    title: { en: "Diagnostics under one roof", ar: "التشخيص تحت سقف واحد" },
    body: {
      en: "Radiology, laboratory and pharmacy beside your doctor — no second trip.",
      ar: "الأشعة والمختبر والصيدلية بجوار طبيبك، دون الحاجة لزيارة أخرى.",
    },
  },
  {
    title: { en: "Care that follows you home", ar: "رعاية تصلك إلى منزلك" },
    body: {
      en: "Teleconsultations, home lab tests and medication delivery through Telehome.",
      ar: "استشارات عن بعد وتحاليل منزلية وتوصيل أدوية عبر تيلي هوم.",
    },
  },
];

/* ───────────────────────── Branches ───────────────────────── */

/** Day indexes follow Date#getDay(): 0 = Sunday … 6 = Saturday. */
type HoursRow = { days: L; from: number | null; to: number | null; dayIdx: number[] };

const SUN_THU = [0, 1, 2, 3, 4];
const SAT_THU = [6, 0, 1, 2, 3, 4];
const d = (en: string, ar: string): L => ({ en, ar });

const GENERAL_JEDDAH: HoursRow[] = [
  { days: d("Sun – Thu", "الأحد – الخميس"), from: 9, to: 21, dayIdx: SUN_THU },
  { days: d("Saturday", "السبت"), from: 13, to: 21, dayIdx: [6] },
  { days: d("Friday", "الجمعة"), from: 17, to: 21, dayIdx: [5] },
];

export type Branch = {
  id: string;
  name: L;
  city: "Jeddah" | "Riyadh";
  dental?: boolean;
  image: string;
  mapUrl: string;
  hours: HoursRow[];
};

// Hours mirror the live home page (app/HomeClient.tsx) — keep the two in step.
export const BRANCHES: Branch[] = [
  {
    id: "mohammadiyah",
    name: d("Al Mohammadiyah", "المحمدية"),
    city: "Jeddah",
    image: "/clinic/branch-mohammadiyah-building.webp",
    mapUrl: "https://www.google.com/maps/place/My+Clinic/@21.6589018,39.1224875,17z/data=!3m1!4b1!4m6!3m5!1s0x15c3d9a3312f53ab:0x9dbc0ed7bf423fab!8m2!3d21.6589018!4d39.1224875!16s%2Fg%2F11dyrcw8t2",
    hours: GENERAL_JEDDAH,
  },
  {
    id: "sahafa",
    name: d("Al Sahafa", "الصحافة"),
    city: "Riyadh",
    image: "/clinic/riyadh.webp",
    mapUrl: "https://maps.app.goo.gl/5XEWuSVKVzkJNyWt6",
    hours: [
      { days: d("Sun – Thu", "الأحد – الخميس"), from: 9, to: 21, dayIdx: SUN_THU },
      { days: d("Saturday", "السبت"), from: 13, to: 21, dayIdx: [6] },
      { days: d("Friday", "الجمعة"), from: 15, to: 19, dayIdx: [5] },
    ],
  },
  {
    id: "safa",
    name: d("Al Safa", "الصفا"),
    city: "Jeddah",
    image: "/clinic/branch-safa-building.webp",
    mapUrl: "https://maps.app.goo.gl/zWd9vWV6m6Sukb956",
    hours: GENERAL_JEDDAH,
  },
  {
    id: "khalidiyyah",
    name: d("Al Khalidiyyah", "الخالدية"),
    city: "Jeddah",
    dental: true,
    image: "/dental/40.webp",
    mapUrl: "https://maps.app.goo.gl/exmYNncSGTQAfDzV6",
    hours: [
      { days: d("Sat – Thu", "السبت – الخميس"), from: 10, to: 22, dayIdx: SAT_THU },
      { days: d("Friday", "الجمعة"), from: 16, to: 20, dayIdx: [5] },
    ],
  },
  {
    id: "tahlia",
    name: d("Al Tahlia", "التحلية"),
    city: "Jeddah",
    image: "/clinic/branch-tahlia-building.webp",
    mapUrl: "https://maps.app.goo.gl/ST25xhT8Hpe8PZp87",
    hours: [
      { days: d("Sat – Thu", "السبت – الخميس"), from: 13, to: 21, dayIdx: SAT_THU },
      { days: d("Friday", "الجمعة"), from: null, to: null, dayIdx: [5] },
    ],
  },
  {
    id: "obhour",
    name: d("Obhour", "أبحر"),
    city: "Jeddah",
    image: "/clinic/branch-obhour-building.webp",
    mapUrl: "https://maps.app.goo.gl/vmem2gxxNnHzv4q17",
    hours: GENERAL_JEDDAH,
  },
];

/** "9:00 AM" / "9:00 ص" from a 24h hour. */
export function formatHour(h: number, isRtl: boolean): string {
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const pm = h >= 12;
  return isRtl ? `${h12}:00 ${pm ? "م" : "ص"}` : `${h12}:00 ${pm ? "PM" : "AM"}`;
}

/** Whether a branch is open at a given Riyadh-local weekday + fractional hour. */
export function isBranchOpen(b: Branch, day: number, hour: number): boolean {
  const row = b.hours.find((r) => r.dayIdx.includes(day));
  if (!row || row.from === null || row.to === null) return false;
  return hour >= row.from && hour < row.to;
}

/** Current weekday + fractional hour in Asia/Riyadh, independent of the viewer's zone. */
export function riyadhNow(): { day: number; hour: number } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Riyadh",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  const hour = (Number(get("hour")) % 24) + Number(get("minute")) / 60;
  return { day, hour };
}

/* ─────────────────────── Specialty links ─────────────────────── */

/** Specialties that own a dedicated landing page link there instead of the directory. */
export const SPECIALTY_PAGES: Record<string, string> = {
  dental: "/dental",
  pediatrics: "/pediatric",
  obGyn: "/women-care",
};

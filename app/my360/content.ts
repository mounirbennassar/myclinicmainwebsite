/**
 * My360 landing-page copy, EN + AR.
 *
 * Every string here is lifted from the official program material the clinic
 * supplied — the four brochures (Grow / Live / Thrive / Diabetes), the age-range
 * memo, and the Arabic "My 360 (3 Phases)" document. The Arabic is the clinic's
 * own wording, not a translation of the English, which is why the two sides read
 * differently in places. Do not "improve" it without a new brochure to cite.
 *
 * Arabic is written WITHOUT tashkeel — a standing rule for this site.
 */

export const PHONE_TEL = "920022811";
export const PHONE_DISPLAY = "920 022 811";
export const WHATSAPP_NUMBER = "966542228111";
export const WHATSAPP_DISPLAY = "0542228111";
export const EMAIL = "COE@myclinic.com.sa";

export const whatsappLink = (isRtl: boolean) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    isRtl ? "مرحبا، أود الانضمام إلى أحد برامج عيادتي 360" : "Hello, I would like to enroll in a My360 program."
  )}`;

import type { My360Program } from "./programs";

type Program = {
  /** Doubles as the `service` value sent to the leads API — see ./programs.ts. */
  slug: My360Program;
  /** Program-specific accent, from the My Clinic specialty palette. */
  accent: string;
  tint: string;
  brochure: string;
  age: { en: string; ar: string };
  name: { en: string; ar: string };
  /** The Arabic sub-brand name — shown under the English name in both locales. */
  tagline: { en: string; ar: string };
  blurb: { en: string; ar: string };
  points: { en: string; ar: string }[];
};

export const PROGRAMS: Program[] = [
  {
    slug: "grow",
    accent: "#A11A4E",
    tint: "#FCECF4",
    brochure: "/my360/my360-grow.pdf",
    age: { en: "0–18 yrs", ar: "0–18 سنة" },
    name: { en: "My360 Grow", ar: "عيادتي 360 جرو" },
    tagline: { en: "نموك دائما", ar: "نموك دائما" },
    blurb: {
      en: "Care that grows with your child — from birth through adolescence.",
      ar: "رعاية تنمو مع طفلك — منذ الولادة وحتى نهاية المراهقة.",
    },
    points: [
      { en: "Vaccinations & growth milestones", ar: "تطعيمات ومتابعة مراحل النمو" },
      { en: "Developmental & emotional monitoring", ar: "متابعة التطور والصحة النفسية" },
      { en: "Psychology support in the teen years", ar: "دعم نفسي في سنوات المراهقة" },
    ],
  },
  {
    slug: "live",
    accent: "#02AEAD",
    tint: "#D2FBFB",
    brochure: "/my360/my360-live.pdf",
    age: { en: "19–64 yrs", ar: "19–64 سنة" },
    name: { en: "My360 Live", ar: "عيادتي 360 ليف" },
    tagline: { en: "صحتك اليوم", ar: "صحتك اليوم" },
    blurb: {
      en: "Care built to live well and live fully, through every adult year.",
      ar: "رعاية مستمرة لصحة أفضل في كل سنوات حياتك العملية.",
    },
    points: [
      { en: "Annual screenings & labs", ar: "فحوصات وتحاليل سنوية" },
      { en: "Lifestyle & longevity medicine", ar: "طب نمط الحياة وطول العمر" },
      { en: "Risk-based specialist referrals", ar: "إحالات تخصصية حسب الحاجة" },
    ],
  },
  {
    slug: "thrive",
    accent: "#68408F",
    tint: "#F4F0FE",
    brochure: "/my360/my360-thrive.pdf",
    age: { en: "65+ yrs", ar: "65+ سنة" },
    name: { en: "My360 Thrive", ar: "عيادتي 360 ثرايف" },
    tagline: { en: "عافيتك غدا", ar: "عافيتك غدا" },
    blurb: {
      en: "Care built for a better, longer life — with independence in focus.",
      ar: "رعاية صممت لحياة أفضل وأطول — مع التركيز على استقلاليتك.",
    },
    points: [
      { en: "Quarterly clinical reviews & labs", ar: "مراجعات وفحوصات ربع سنوية" },
      { en: "Chronic disease optimization", ar: "إدارة الحالات المزمنة" },
      { en: "Mobility, memory & independence", ar: "الحركة والذاكرة والاستقلالية" },
    ],
  },
  {
    slug: "diabetes",
    accent: "#F98122",
    tint: "#FBEACF",
    brochure: "/my360/my360-diabetes.pdf",
    age: { en: "Condition-based", ar: "حسب الحالة" },
    name: { en: "My360 Diabetes", ar: "عيادتي 360 للسكري" },
    tagline: { en: "تحكم بثقة", ar: "تحكم بثقة" },
    blurb: {
      en: "Diabetes is something you manage — not something that runs your life.",
      ar: "السكري حالة تديرها أنت — لا حالة تدير حياتك.",
    },
    points: [
      { en: "Quarterly bloodwork & screenings", ar: "تحاليل وفحوصات ربع سنوية" },
      { en: "Eye, foot, dental & heart care", ar: "رعاية العيون والقدم والأسنان والقلب" },
      { en: "Nutrition & psychology support", ar: "دعم التغذية والصحة النفسية" },
    ],
  },
];

export const EN = {
  meta: {
    badge: "My Clinic · My360 Health Programs",
    h1a: "Proactive care for ",
    h1b: "every stage",
    h1c: " of your life.",
    sub: "My360 is My Clinic's family of premium, proactive health programs — prevention, early detection and coordinated specialist care, delivered by a dedicated team that stays with you for life.",
    ctaBook: "Book an appointment",
    ctaWhatsApp: "WhatsApp us",
    heroCardTitle: "One care team",
    heroCardSub: "Consultant · GP · Coordinator",
    heroStatValue: "90%",
    heroStatLabel: "member satisfaction",
  },
  stats: [
    { value: 4, suffix: "", label: "Health programs" },
    { value: 5000, suffix: "+", label: "Members served" },
    { value: 8, suffix: " yrs", label: "Serving our patients" },
    { value: 90, suffix: "%", label: "Member satisfaction" },
  ],
  programs: {
    eyebrow: "The programs",
    title: "One family of programs, every stage of life",
    sub: "Each program pairs you with a dedicated care team and a personalized annual calendar — built around your age, risk factors and goals.",
    download: "Download brochure",
  },
  // NOTE: the `mark` keys below index My360Icons.tsx (inline SVG), NOT Material
  // Symbols. The field is called `mark` rather than `icon` on purpose —
  // scripts/check-icon-subset.mjs scans for `icon: "…"` and would demand these
  // be added to the Material Symbols subset in app/layout.tsx, where they don't
  // belong.
  why: {
    eyebrow: "Why My360",
    title: "Care that stays ahead of your health",
    sub: "Built on My Clinic's premium standards of care — the best Saudi doctors, seamless coordination and a true patient-first experience.",
    items: [
      {
        mark: "shield",
        title: "Prevention & early detection",
        body: "Regular assessments and screenings catch changes early — before they become complications.",
      },
      {
        mark: "phone",
        title: "One point of contact",
        body: "Your Care Coordinator manages every booking, follow-up and referral — one call does it all.",
      },
      {
        mark: "stethoscope",
        title: "Expert clinical oversight",
        body: "A Consultant leads your care plan, backed by a full network of specialists.",
      },
      {
        mark: "grid",
        title: "All specialties, one place",
        body: "Cardiology, ophthalmology, dental, nutrition, psychology and more — coordinated in one network.",
      },
      {
        mark: "calendar",
        title: "A personalized care calendar",
        body: "Structured annual touchpoints, tailored to your age, risk factors and health goals.",
      },
      {
        mark: "heart",
        title: "Wellbeing, not just labs",
        body: "Care for your body, mind and daily life — nutrition and mental wellbeing included.",
      },
    ],
  },
  team: {
    eyebrow: "Your core care team",
    title: "The people behind your plan",
    sub: "Every My360 member is supported by a dedicated core team working together to deliver continuous, coordinated care.",
    members: [
      {
        role: "Consultant (MRP)",
        tag: "Leads your care",
        body: "Your Most Responsible Physician — leads the multidisciplinary team, owns your care plan and coordinates every specialist.",
      },
      {
        role: "Program GP",
        tag: "Keeps you on track",
        body: "Your primary clinical contact — monitors progress, reviews results and keeps every touchpoint on schedule.",
      },
      {
        role: "Care Coordinator",
        tag: "One call away",
        body: "Your single point of contact for appointments, referrals and scheduling — from enrolment onward.",
      },
    ],
  },
  calendar: {
    eyebrow: "Annual care calendar",
    title: "A clear rhythm, every year",
    head: ["Touchpoint", "Grow", "Live", "Thrive"],
    ages: ["", "0–18", "19–64", "65+"],
    rows: [
      ["Program doctor visits", "1–5×/yr", "1–2×/yr", "4×/yr"],
      ["Screening labs", "Risk-based", "1–2×/yr", "4×/yr"],
      ["Dental", "1–2×/yr", "1×/yr", "1×/yr"],
      ["Ophthalmology", "1×/yr", "1×/yr", "1×/yr"],
      ["Nutrition", "1×/yr", "1×/yr", "1×/yr"],
      ["Psychology & wellbeing", "Age-based", "1×/yr", "1×/yr"],
    ],
    note: "Minimum / recommended touchpoints. Every calendar is personalized to your age, risk factors and goals — not one-size-fits-all.",
    diabetesTitle: "My360 Diabetes",
    diabetesBody:
      "Runs on its own quarterly rhythm — bloodwork and follow-ups every 3 months, plus annual eye, foot, dental and heart screening.",
    measureTitle: "How we measure progress",
    measures: [
      "Tracked every visit — BMI, blood pressure, activity",
      "Reviewed annually — HbA1c, LDL, screening completion",
      "80%+ satisfaction & care-plan adherence, every year",
    ],
  },
  quotes: {
    eyebrow: "From our doctors",
    title: "Led by people who care",
  },
  faq: {
    eyebrow: "FAQ",
    title: "Questions, answered",
    items: [
      {
        q: "What is My360?",
        a: "My360 is My Clinic's family of premium, proactive health programs: Grow (0–18), Live (19–64), Thrive (65+) and Diabetes. Each combines prevention, early detection and coordinated specialist care under one dedicated team.",
      },
      {
        q: "Which program is right for me?",
        a: "By age: Grow for children and adolescents (0–18), Live for adults (19–64), Thrive for seniors (65+). My360 Diabetes is for anyone managing diabetes, at any adult age. Our team can help you choose when you call.",
      },
      {
        q: "Who coordinates my care?",
        a: "A core team of three: a Consultant (MRP) who leads your care plan, a Program GP who monitors progress, and a Care Coordinator who handles every appointment, referral and follow-up.",
      },
      {
        q: "Is the care calendar fixed?",
        a: "No. The tables show minimum or recommended touchpoints — your calendar is personalized to your age, risk factors, health history and goals.",
      },
      {
        q: "Do I need a referral to join?",
        a: "No referral is required. You can enroll directly by reaching out to our team, and your Consultant will confirm eligibility at your first visit.",
      },
      {
        q: "How do I enroll?",
        a: "Call 920022811, WhatsApp 0542228111, or email COE@myclinic.com.sa. We're available Sun–Thu 9:00 AM–9:00 PM, Fri 5:00–9:00 PM and Sat 1:00–9:00 PM.",
      },
    ],
  },
  contact: {
    title: "Get started today",
    body: "Ready to join a My360 program, or still have questions? Reach out any time — our team is happy to help you choose and schedule your first appointment.",
    hours: "Sun–Thu 9 AM–9 PM · Fri 5–9 PM · Sat 1–9 PM",
  },
  form: {
    title: "Request a call back",
    sub: "Leave your details — our Care Coordinator will contact you.",
    name: "Full name",
    phone: "Mobile number",
    city: "Select city",
    riyadh: "Riyadh",
    jeddah: "Jeddah",
    program: "Choose a program",
    submit: "Request a call back",
    submitting: "Sending…",
    or: "or call",
    directly: "directly",
    successTitle: "Request received",
    successBody: "Our Care Coordinator will call you shortly.",
    again: "Send another request",
    errFields: "Please fill in all fields",
    errPhone: "Phone must start with 05 and be 10 digits",
    errGeneric: "Something went wrong, please try again",
    errNetwork: "Network error, please try again",
    privacy: "Your information is private and never shared.",
  },
  nav: [
    { href: "#programs", label: "Programs" },
    { href: "#why", label: "Why My360" },
    { href: "#team", label: "Care team" },
    { href: "#calendar", label: "Calendar" },
    { href: "#faq", label: "FAQ" },
  ],
};

export const AR: typeof EN = {
  meta: {
    badge: "عيادتي · برامج عيادتي 360 الصحية",
    h1a: "رعاية استباقية ",
    h1b: "لكل مرحلة",
    h1c: " من حياتك.",
    sub: "عيادتي 360 هي مجموعة برامج الرعاية الصحية الاستباقية من عيادتي — تجمع بين الوقاية والكشف المبكر والرعاية المنسقة مع مختلف التخصصات، مع فريق طبي مخصص يرافقك مدى الحياة.",
    ctaBook: "احجز موعدك",
    ctaWhatsApp: "تواصل عبر واتساب",
    heroCardTitle: "فريق رعاية واحد",
    heroCardSub: "استشاري · طبيب برنامج · منسق رعاية",
    heroStatValue: "90%",
    heroStatLabel: "رضا الأعضاء",
  },
  stats: [
    { value: 4, suffix: "", label: "برامج صحية" },
    { value: 5000, suffix: "+", label: "عضو استفاد من برامجنا" },
    // The unit lives in the label, not the suffix: the counter is wrapped in
    // dir="ltr" (digits must not reorder), and an Arabic word inside that
    // wrapper would be laid out left-to-right — i.e. backwards.
    { value: 8, suffix: "", label: "سنوات في خدمة مرضانا" },
    { value: 90, suffix: "%", label: "رضا الأعضاء" },
  ],
  programs: {
    eyebrow: "البرامج",
    title: "عائلة واحدة من البرامج لكل مراحل الحياة",
    sub: "كل برنامج يمنحك فريق رعاية مخصصا وجدول رعاية سنويا مصمما وفق عمرك وعوامل الخطورة وأهدافك الصحية.",
    download: "حمل الكتيب",
  },
  why: {
    eyebrow: "لماذا عيادتي 360؟",
    title: "رعاية تسبق المشكلة الصحية",
    sub: "مبنية على معايير عيادتي المتميزة في الرعاية — نخبة الأطباء السعوديين، وتنسيق سلس، وتجربة تضع المريض أولا.",
    items: [
      {
        mark: "shield",
        title: "الوقاية والكشف المبكر",
        body: "تقييمات وفحوصات دورية تكتشف أي تغير مبكرا — قبل أن يتحول إلى مضاعفات.",
      },
      {
        mark: "phone",
        title: "جهة تواصل واحدة",
        body: "منسق الرعاية يتولى كل حجز ومتابعة وإحالة — مكالمة واحدة تكفي.",
      },
      {
        mark: "stethoscope",
        title: "إشراف طبي متخصص",
        body: "استشاري يقود خطة رعايتك، بدعم من شبكة كاملة من الأطباء المتخصصين.",
      },
      {
        mark: "grid",
        title: "كل التخصصات في مكان واحد",
        body: "القلب والعيون والأسنان والتغذية والصحة النفسية وغيرها — ضمن شبكة واحدة منسقة.",
      },
      {
        mark: "calendar",
        title: "جدول رعاية مخصص لك",
        body: "نقاط متابعة سنوية منظمة، تصمم وفق عمرك وعوامل الخطورة وأهدافك.",
      },
      {
        mark: "heart",
        title: "اهتمام يتجاوز التحاليل",
        body: "نهتم بصحة جسمك وعقلك ونمط حياتك — التغذية والصحة النفسية جزء من رعايتك.",
      },
    ],
  },
  team: {
    eyebrow: "فريق الرعاية الأساسي",
    title: "الفريق الذي يقف خلف خطتك",
    sub: "كل عضو في عيادتي 360 يحظى بفريق أساسي مخصص يعمل معا لتقديم رعاية مستمرة ومنسقة.",
    members: [
      {
        role: "الاستشاري (MRP)",
        tag: "يقود رعايتك",
        body: "طبيبك المسؤول الأول — يقود الفريق متعدد التخصصات، ويملك خطة رعايتك، وينسق مع كل المتخصصين.",
      },
      {
        role: "طبيب البرنامج",
        tag: "يبقيك على المسار",
        body: "جهة تواصلك الطبية الأولى — يتابع تقدمك، ويراجع نتائج الفحوصات، ويضمن انتظام كل نقاط المتابعة.",
      },
      {
        role: "منسق الرعاية",
        tag: "على بعد مكالمة",
        body: "حلقة الوصل الخاصة بك للمواعيد والإحالات وتنظيم جدول الرعاية — من لحظة الانضمام وما بعدها.",
      },
    ],
  },
  calendar: {
    eyebrow: "جدول الرعاية السنوي",
    title: "إيقاع واضح، كل عام",
    head: ["نقاط المتابعة", "جرو", "ليف", "ثرايف"],
    ages: ["", "0–18", "19–64", "65+"],
    rows: [
      ["زيارات طبيب البرنامج", "1–5 مرات/سنة", "1–2 مرة/سنة", "4 مرات/سنة"],
      ["الفحوصات المخبرية", "حسب الحاجة", "1–2 مرة/سنة", "4 مرات/سنة"],
      ["الأسنان", "1–2 مرة/سنة", "مرة/سنة", "مرة/سنة"],
      ["العيون", "مرة/سنة", "مرة/سنة", "مرة/سنة"],
      ["التغذية", "مرة/سنة", "مرة/سنة", "مرة/سنة"],
      ["الصحة النفسية", "حسب العمر", "مرة/سنة", "مرة/سنة"],
    ],
    note: "الحد الأدنى / الموصى به من نقاط المتابعة. يخصص جدول الرعاية وفق العمر وعوامل الخطورة والأهداف الصحية — وليس بنظام واحد يناسب الجميع.",
    diabetesTitle: "عيادتي 360 للسكري",
    diabetesBody:
      "يعمل بإيقاع ربع سنوي خاص — تحاليل ومتابعات كل 3 أشهر، مع فحص سنوي للعيون والقدم والأسنان والقلب.",
    measureTitle: "كيف نقيس التقدم",
    measures: [
      "في كل زيارة — مؤشر كتلة الجسم وضغط الدم والنشاط البدني",
      "سنويا — السكر التراكمي والكوليسترول واستكمال الفحوصات",
      "رضا والتزام بخطة الرعاية بنسبة 80% أو أكثر سنويا",
    ],
  },
  quotes: {
    eyebrow: "من أطبائنا",
    title: "بقيادة أشخاص يهتمون بك",
  },
  faq: {
    eyebrow: "الأسئلة الشائعة",
    title: "إجابات لأكثر ما يسأل",
    items: [
      {
        q: "ما هي عيادتي 360؟",
        a: "عيادتي 360 هي مجموعة برامج الرعاية الصحية الاستباقية من عيادتي: جرو (0–18)، ليف (19–64)، ثرايف (65+)، وبرنامج السكري. يجمع كل برنامج بين الوقاية والكشف المبكر والرعاية المنسقة مع فريق واحد مخصص.",
      },
      {
        q: "أي برنامج يناسبني؟",
        a: "حسب العمر: جرو للأطفال والمراهقين (0–18)، ليف للبالغين (19–64)، ثرايف لكبار السن (65+). أما برنامج السكري فهو لأي بالغ يتعايش مع السكري. وفريقنا يساعدك على الاختيار عند الاتصال.",
      },
      {
        q: "من ينسق رعايتي؟",
        a: "فريق أساسي من ثلاثة: استشاري (MRP) يقود خطة رعايتك، وطبيب برنامج يتابع تقدمك، ومنسق رعاية يتولى كل موعد وإحالة ومتابعة.",
      },
      {
        q: "هل جدول الرعاية ثابت؟",
        a: "لا. الجداول تعرض الحد الأدنى أو الموصى به من نقاط المتابعة — ويخصص جدولك وفق عمرك وتاريخك الصحي وعوامل الخطورة وأهدافك.",
      },
      {
        q: "هل أحتاج إلى تحويل للانضمام؟",
        a: "لا يلزم أي تحويل. يمكنك الانضمام مباشرة بالتواصل مع فريقنا، ويؤكد الاستشاري أهليتك في زيارتك الأولى.",
      },
      {
        q: "كيف أنضم؟",
        a: "اتصل على 920022811، أو واتساب 0542228111، أو راسلنا على COE@myclinic.com.sa. متاحون الأحد–الخميس 9 ص–9 م، الجمعة 5–9 م، السبت 1–9 م.",
      },
    ],
  },
  contact: {
    title: "انضم إلينا اليوم",
    body: "جاهز للانضمام إلى أحد برامج عيادتي 360، أو لديك أسئلة؟ تواصل معنا في أي وقت — فريقنا سيسعده مساعدتك في الاختيار وحجز موعدك الأول.",
    hours: "الأحد–الخميس 9 ص–9 م · الجمعة 5–9 م · السبت 1–9 م",
  },
  form: {
    title: "اطلب اتصالا منا",
    sub: "اترك بياناتك — وسيتواصل معك منسق الرعاية.",
    name: "الاسم الكامل",
    phone: "رقم الجوال",
    city: "اختر المدينة",
    riyadh: "الرياض",
    jeddah: "جدة",
    program: "اختر البرنامج",
    submit: "اطلب اتصالا",
    submitting: "جار الإرسال…",
    or: "أو اتصل مباشرة على",
    directly: "",
    successTitle: "تم استلام طلبك",
    successBody: "سيتصل بك منسق الرعاية قريبا.",
    again: "إرسال طلب آخر",
    errFields: "يرجى ملء جميع الحقول",
    errPhone: "رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام",
    errGeneric: "حدث خطأ، حاول مرة أخرى",
    errNetwork: "خطأ في الاتصال، حاول مرة أخرى",
    privacy: "بياناتك محمية ولن تشارك مع أي طرف ثالث.",
  },
  nav: [
    { href: "#programs", label: "البرامج" },
    { href: "#why", label: "لماذا 360؟" },
    { href: "#team", label: "فريق الرعاية" },
    { href: "#calendar", label: "جدول الرعاية" },
    { href: "#faq", label: "الأسئلة الشائعة" },
  ],
};

/**
 * Doctor quotes. Photos: only Dr. ElBadawi has one in /public/doctors; the rest
 * fall back to the shared illustrated avatars via doctorAvatar().
 */
export const QUOTES = [
  {
    photo: null,
    nameEn: "Dr. Mervat Qutub",
    nameAr: "د. ميرفت قطب",
    roleEn: "Head of Paediatric Department",
    roleAr: "رئيسة قسم طب الأطفال",
    quoteEn: "At My360 Grow, we believe every child deserves the opportunity to reach their full potential.",
    quoteAr: "نؤمن في عيادتي 360 أن كل طفل يستحق الفرصة ليصل إلى كامل إمكاناته.",
  },
  {
    photo: null,
    nameEn: "Dr. Ibrahim Alqarni",
    nameAr: "د. إبراهيم القرني",
    roleEn: "Head of Family Medicine Department",
    roleAr: "رئيس قسم طب الأسرة",
    quoteEn:
      "Our focus is on prevention, early detection, and coordinated care; helping members maintain their health and achieve better long-term outcomes.",
    quoteAr:
      "نركز على الوقاية والكشف المبكر والرعاية المتكاملة، لمساعدة المستفيدين على الحفاظ على صحتهم وتحقيق نتائج صحية أفضل على المدى الطويل.",
  },
  {
    photo: null,
    nameEn: "Dr. Asim Alshanberi",
    nameAr: "د. عاصم الشنبري",
    roleEn: "My360 Thrive Consultant",
    roleAr: "استشاري عيادتي 360 ثرايف",
    quoteEn: "Our goal is not simply to add years to life, but to help add life to those years.",
    quoteAr: "هدفنا ليس فقط إضافة سنوات إلى الحياة، بل أن نضيف حياة إلى هذه السنوات.",
  },
  {
    photo: "/doctors/hussein-elbadawi.webp",
    nameEn: "Dr. Hussein ElBadawi",
    nameAr: "د. حسين البدوي",
    roleEn: "Head of Endocrinology Department",
    roleAr: "رئيس قسم الغدد الصماء",
    quoteEn:
      "My360 Diabetes is not just a medical service — it's a seamless ecosystem where clinical excellence meets genuine human support.",
    quoteAr:
      "برنامج عيادتي 360 للسكري ليس مجرد خدمة طبية — بل منظومة متكاملة يلتقي فيها التميز الطبي بالدعم الإنساني الحقيقي.",
  },
];

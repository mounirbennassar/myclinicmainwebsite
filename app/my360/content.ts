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
export const EMAIL = "my360@myclinic.com.sa";

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
  age: { en: string; ar: string };
  name: { en: string; ar: string };
  blurb: { en: string; ar: string };
  points: { en: string; ar: string }[];
};

export const PROGRAMS: Program[] = [
  {
    slug: "grow",
    accent: "#A11A4E",
    tint: "#FCECF4",
    age: { en: "0–18 yrs", ar: "0–18 سنة" },
    name: { en: "My360 Grow", ar: "عيادتي 360 جرو" },
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
    age: { en: "19–64 yrs", ar: "19–64 سنة" },
    name: { en: "My360 Live", ar: "عيادتي 360 ليف" },
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
    age: { en: "65+ yrs", ar: "65+ سنة" },
    name: { en: "My360 Thrive", ar: "عيادتي 360 ثرايف" },
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
    age: { en: "Condition-based", ar: "حسب الحالة" },
    name: { en: "My360 Diabetes", ar: "عيادتي 360 للسكري" },
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
    badge: "My360",
    h1a: "Proactive care for ",
    h1b: "every stage",
    h1c: " of your life.",
    sub: "My360 is My Clinic's family of premium, proactive health programs — prevention, early detection and coordinated specialist care, delivered by a dedicated team that stays with you for life.",
    ctaBook: "Book an appointment",
    ctaWhatsApp: "WhatsApp us",
  },
  stats: [
    { value: 4, suffix: "", label: "Health programs" },
    { value: 10000, suffix: "+", label: "Members served" },
    { value: 8, suffix: " yrs", label: "Serving our patients" },
    { value: 90, suffix: "%", label: "Member satisfaction" },
  ],
  programs: {
    eyebrow: "The programs",
    title: "One family of programs, every stage of life",
    sub: "Each program pairs you with a dedicated care team and a personalized annual calendar — built around your age, risk factors and goals.",
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
        role: "Clinical Excellence GP",
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
    title: "A care plan built around you",
    body:
      "Each program has a care calendar tailored specifically to your health conditions and needs. Your care team will design and tailor the program with you, so you have visibility of every touchpoint and confidence that the plan is designed to improve your health.",
  },
  testimonials: {
    eyebrow: "Member experiences",
    title: "What My360 members say",
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
        a: "A core team of three: a Consultant (MRP) who leads your care plan, a Clinical Excellence GP who monitors progress, and a Care Coordinator who handles every appointment, referral and follow-up.",
      },
      {
        q: "Do I need a referral to join?",
        a: "No referral is required. You can enroll directly by reaching out to our team, and your Consultant will confirm eligibility at your first visit.",
      },
      {
        q: "How do I enroll?",
        a: "Call 920022811, WhatsApp 0542228111, or email my360@myclinic.com.sa. We're available Sun–Thu 9:00 AM–9:00 PM, Fri 5:00–9:00 PM and Sat 1:00–9:00 PM.",
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
    badge: "My360",
    h1a: "رعاية استباقية ",
    h1b: "لكل مرحلة",
    h1c: " من حياتك.",
    sub: "عيادتي 360 هي مجموعة برامج الرعاية الصحية الاستباقية من عيادتي — تجمع بين الوقاية والكشف المبكر والرعاية المنسقة مع مختلف التخصصات، مع فريق طبي مخصص يرافقك مدى الحياة.",
    ctaBook: "احجز موعدك",
    ctaWhatsApp: "تواصل عبر واتساب",
  },
  stats: [
    { value: 4, suffix: "", label: "برامج صحية" },
    { value: 10000, suffix: "+", label: "عضو استفاد من برامجنا" },
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
        role: "طبيب التميز السريري",
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
    title: "خطة رعاية مصممة حولك",
    body:
      "لكل برنامج جدول رعاية يصمم خصيصا وفقا لحالتك الصحية واحتياجاتك. سيعمل فريق الرعاية معك على تصميم البرنامج وتخصيصه، لتكون على اطلاع بكل نقطة متابعة وتثق بأن الخطة وضعت لتحسين صحتك.",
  },
  testimonials: {
    eyebrow: "تجارب المستفيدين",
    title: "ماذا يقول مستفيدو My360؟",
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
        a: "فريق أساسي من ثلاثة: استشاري (MRP) يقود خطة رعايتك، وطبيب التميز السريري يتابع تقدمك، ومنسق رعاية يتولى كل موعد وإحالة ومتابعة.",
      },
      {
        q: "هل أحتاج إلى تحويل للانضمام؟",
        a: "لا يلزم أي تحويل. يمكنك الانضمام مباشرة بالتواصل مع فريقنا، ويؤكد الاستشاري أهليتك في زيارتك الأولى.",
      },
      {
        q: "كيف أنضم؟",
        a: "اتصل على 920022811، أو واتساب 0542228111، أو راسلنا على my360@myclinic.com.sa. متاحون الأحد–الخميس 9 ص–9 م، الجمعة 5–9 م، السبت 1–9 م.",
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

/** Anonymous member testimonials supplied as program-level experiences. */
export const TESTIMONIALS = [
  {
    programEn: "My360 Live",
    programAr: "My360 Live",
    memberEn: "My360 Live member",
    memberAr: "أحد مستفيدي My360 Live",
    accent: "#02AEAD",
    quoteEn:
      "I finally have one team looking at the full picture, not just separate appointments. I know what comes next and who to contact whenever I need support.",
    quoteAr:
      "أصبح لدي أخيرا فريق واحد ينظر إلى الصورة الصحية كاملة، وليس إلى مواعيد منفصلة. أعرف دائما ما هي الخطوة التالية ومن أتواصل معه عندما أحتاج إلى الدعم.",
  },
  {
    programEn: "My360 Diabetes",
    programAr: "My360 Diabetes",
    memberEn: "My360 Diabetes member",
    memberAr: "أحد مستفيدي My360 Diabetes",
    accent: "#F98122",
    quoteEn:
      "The regular follow-ups helped me understand my results, stay consistent with my care plan and feel more confident managing diabetes day to day.",
    quoteAr:
      "ساعدتني المتابعات المنتظمة على فهم نتائجي والالتزام بخطة الرعاية والشعور بثقة أكبر في إدارة السكري كل يوم.",
  },
];

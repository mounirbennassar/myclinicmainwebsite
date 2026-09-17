/**
 * My360 landing-page copy, EN + AR.
 *
 * Source of truth: "My 360 — Landing Page Content & Layout Guide" (Inception,
 * Aug 2026) plus the four program brochures (Grow / Live / Thrive / Diabetes).
 * The English below is lifted from that guide — headlines, card copy, the
 * 3-step "how to join", the care-journey milestones, the cadence rows, the FAQ
 * and the closing CTA are all its wording. Do not "improve" it without a new
 * revision of the guide to cite.
 *
 * ⚠️ ARABIC IS PROVISIONAL. The guide shipped English only; the clinic is
 * supplying the official Arabic separately. Everything in AR that is not in the
 * older brochures is a working translation written to keep the page whole and
 * the types satisfied — replace it wholesale when the Arabic copy lands.
 *
 * Arabic is written WITHOUT tashkeel — a standing rule for this site.
 */

export const PHONE_TEL = "920022811";
export const PHONE_DISPLAY = "920 022 811";
export const WHATSAPP_NUMBER = "966920022811";
export const WHATSAPP_DISPLAY = "920 022 811";
export const EMAIL = "my360@myclinic.com.sa";
export const WEBSITE_DISPLAY = "www.myclinic.com.sa";

export const whatsappLink = (isRtl: boolean) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    isRtl ? "مرحبا، أود الانضمام إلى أحد برامج My 360" : "Hello, I would like to enroll in a My360 program."
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
  /** Hero-pill label — the name minus the shared brand/program prefix. */
  short: { en: string; ar: string };
  /** The brochure tagline that sits under the program name. */
  tagline: { en: string; ar: string };
  /** "Who it's for" — one line, so a visitor can self-select at a glance. */
  who: { en: string; ar: string };
  points: { en: string; ar: string }[];
  /** Visit cadence, shown as the card's footer row. */
  rhythm: { en: string; ar: string };
};

/**
 * Card order follows the content guide's layout ("Diabetes / Grow / Live /
 * Thrive"), not the life-stage order used in the care-journey timeline below.
 */
export const PROGRAMS: Program[] = [
  {
    slug: "diabetes",
    accent: "#F98122",
    tint: "#FBEACF",
    age: { en: "Any age", ar: "أي عمر" },
    name: { en: "My 360 Diabetes Management Program", ar: "برنامج My 360 لإدارة السكري" },
    short: { en: "Diabetes", ar: "إدارة السكري" },
    tagline: {
      en: "Care Built Around You, So You Can Focus on Living",
      ar: "رعاية متكاملة تساعدك على التحكم بالسكري بانتظام وثقة",
    },
    who: {
      en: "Anyone managing diabetes who wants coordinated, continuous support.",
      ar: "لكل من يتابع السكري ويرغب في رعاية متكاملة ومستمرة.",
    },
    points: [
      { en: "A comprehensive health assessment", ar: "تقييم صحي شامل" },
      { en: "A dedicated physician and care coordinator", ar: "طبيب مخصص ومنسق رعاية" },
      { en: "A personalized care and treatment plan", ar: "خطة رعاية وعلاج مصممة لك" },
      { en: "Regular checkups and screenings, per the latest guidelines", ar: "فحوصات ومتابعات دورية" },
      { en: "A multidisciplinary team of consultants and specialists", ar: "فريق متكامل من الاستشاريين والأخصائيين" },
    ],
    rhythm: {
      en: "Regular clinic visits each year, with telemedicine check-ins in between.",
      ar: "زيارات دورية للعيادة وفق ما يوصى به سنويا، مع متابعة عن بعد بين الزيارات.",
    },
  },
  {
    slug: "grow",
    accent: "#A11A4E",
    tint: "#FCECF4",
    age: { en: "0–18 yrs", ar: "0–18 سنة" },
    name: { en: "My 360 Grow", ar: "برنامج رحلة طفلك" },
    short: { en: "Grow", ar: "رحلة طفلك" },
    tagline: {
      en: "Care for Every Step of Their Growth",
      ar: "رعاية ترافقه في كل مرحلة",
    },
    who: {
      en: "Children and adolescents, from birth through age 18.",
      ar: "الأطفال من الولادة وحتى عمر 18 عاما.",
    },
    points: [
      { en: "The Foundation (birth–24 months): up to 5 visits a year", ar: "مرحلة التأسيس (الولادة–24 شهرا): زيارات متكررة وتطعيمات ومتابعة مبكرة للنمو، حتى 5 زيارات سنويا" },
      { en: "The Growing Years (3–9): screening and checkup, year on year", ar: "سنوات النمو (3–9): وتيرة سنوية تتناوب بين الفحوصات والتقييم والمتابعة" },
      { en: "The Formative Years (10–18): psychology support added", ar: "سنوات التكوين (10–18): إضافة دعم الصحة النفسية والاستعداد للانتقال إلى رعاية البالغين" },
      { en: "Age-appropriate vaccinations and evidence-based screenings", ar: "تطعيمات مناسبة للعمر وفحوصات مبنية على تقييم الطبيب" },
      { en: "Milestone tracking and family-centered care", ar: "متابعة مراحل النمو، ورعاية تشارك الأسرة في قراراتها" },
    ],
    rhythm: {
      en: "Up to 5 visits a year in infancy, settling into an annual rhythm.",
      ar: "حتى 5 زيارات سنويا في مرحلة الرضاعة، ثم وتيرة سنوية منتظمة.",
    },
  },
  {
    slug: "live",
    accent: "#02AEAD",
    tint: "#D2FBFB",
    age: { en: "19–64 yrs", ar: "19–64 سنة" },
    name: { en: "My 360 Live", ar: "برنامج حياة" },
    short: { en: "Live", ar: "حياة" },
    tagline: {
      en: "Care Built to Live Well & Live Fully",
      ar: "رعاية مستمرة لحياة أفضل",
    },
    who: {
      en: "Adults at every stage of adult life (19–64+).",
      ar: "المستفيدين من عمر 19 إلى 64 عاما.",
    },
    points: [
      { en: "19–34 Baseline: core visits once a year", ar: "19–34: الزيارات الأساسية مرة سنويا" },
      { en: "35–40 Step Up: core visits twice a year", ar: "35–40: الزيارات الأساسية مرتان سنويا" },
      { en: "41–50 Stay Ahead: sustained engagement", ar: "41–50: متابعة مستمرة" },
      { en: "51–64 Sustained Care: a lifelong partnership", ar: "51–64: رعاية صحية طويلة المدى" },
      { en: "Sensory and dental wellness, risk-based specialist referrals", ar: "تقييمات صحية أساسية، والعناية بصحة العينين والأسنان والسمع، وإحالات للتخصصات حسب عوامل الخطورة" },
    ],
    rhythm: {
      en: "One to two core visits a year, stepping up as your risk profile does.",
      ar: "زيارة إلى زيارتين أساسيتين سنويا، مع خطط تساعدك على نمط حياة صحي طويل المدى.",
    },
  },
  {
    slug: "thrive",
    accent: "#68408F",
    tint: "#F4F0FE",
    age: { en: "65+ yrs", ar: "65+ سنة" },
    name: { en: "My 360 Thrive", ar: "برنامج حياة متجددة" },
    short: { en: "Thrive", ar: "حياة متجددة" },
    tagline: {
      en: "Care Built for a Better, Longer Life",
      ar: "رعاية لحياة أفضل وأطول",
    },
    who: {
      en: "Adults navigating every stage of aging.",
      ar: "البالغون في مختلف مراحل التقدم في العمر.",
    },
    points: [
      { en: "Preventive care and early detection of age-related concerns", ar: "الوقاية واكتشاف المشكلات المرتبطة بالتقدم في العمر مبكرا" },
      { en: "Independence and functional wellbeing: mobility and strength", ar: "دعم الاستقلالية والصحة الوظيفية (الحركة، القوة، والحفاظ على النشاط)" },
      { en: "Chronic disease optimization", ar: "تحسين متابعة الحالات المزمنة الشائعة مع التقدم في العمر" },
      { en: "Audiology, speech, ophthalmology, dental, cardiology, orthopedics", ar: "دعم صحي متخصص: السمع، التخاطب، العيون، الأسنان، القلب، والعظام" },
      { en: "Full-body screening reviewed annually", ar: "مراجعة الفحوصات الشاملة سنويا" },
    ],
    rhythm: {
      en: "Core team check-ins 4x a year, with full-body screening reviewed annually.",
      ar: "متابعة فريق الرعاية الأساسي 4 مرات سنويا، مع مراجعة الفحوصات الشاملة سنويا.",
    },
  },
];

export const EN = {
  meta: {
    badge: "My 360",
    /** The bilingual lockup tagline — rendered in both languages, always. */
    tagline: "Simply Better Living",
    taglineAlt: "رفيق حياتك",
    h1a: "One clinic. ",
    h1b: "One dedicated care team.",
    sub: "A personalized health journey that adapts to you at every age, from your child's first checkup to the care that keeps you living and thriving well.",
    ctaPrimary: "Find Your Program",
    ctaSecondary: "How My 360 Works",
    noFees: "No membership fees",
  },
  stats: [
    { value: 4, suffix: "", label: "Care programs" },
    { value: 10000, suffix: "+", label: "Members served" },
    { value: 8, suffix: " yrs", label: "Serving our patients" },
    { value: 90, suffix: "%", label: "Member satisfaction" },
  ],
  // NOTE: the `mark` keys below index My360Icons.tsx (inline SVG), NOT Material
  // Symbols. The field is called `mark` rather than `icon` on purpose —
  // scripts/check-icon-subset.mjs scans for `icon: "…"` and would demand these
  // be added to the Material Symbols subset in app/layout.tsx, where they don't
  // belong.
  why: {
    eyebrow: "Why My 360",
    title: "Healthcare Built Around You",
    sub: "My 360 brings together proactive, personalized care programs, thoughtfully designed around different life stages and health needs. Each program is built on one shared promise: coordinated, continuous care from a dedicated team that truly knows you.",
    items: [
      {
        mark: "team",
        title: "A Team, Not Just a Doctor",
        body: "Every member gets a dedicated Consultant, Program GP, and Care Coordinator working together on their care.",
      },
      {
        mark: "shield",
        title: "Proactive, Not Reactive",
        body: "Structured annual checkpoints and evidence-based screenings that catch concerns early before they grow.",
      },
      {
        mark: "clipboard",
        title: "A Plan Built Just for You",
        body: "Every care plan is personalized to every patient's age, health status, and goals.",
      },
      {
        mark: "chat",
        title: "Never On Your Own Between Visits",
        body: "Telemedicine check-ins and continuous follow-up keep your care consistent, wherever you are.",
      },
      {
        mark: "grid",
        title: "Specialists, Fully Coordinated",
        body: "A connected network of physicians, consultants, and specialists, working together to ensure every aspect of your care is covered.",
      },
      {
        mark: "tag",
        title: "No Membership Fees",
        body: "Every My 360 program is free to join, with no additional cost to enroll.",
      },
    ],
  },
  approach: {
    eyebrow: "How it works",
    title: "A Simple, Predictable Rhythm of Care",
    body: "Every My 360 program follows the same reliable rhythm: a first assessment to understand your needs, a personalized plan built around you, and a care team that stays with you at every step, with scheduling, follow-ups, and reminders handled for you.",
    steps: [
      {
        mark: "chat",
        title: "Say Hello",
        body: "Reach out by phone, WhatsApp, email, or in person at your next clinic visit.",
      },
      {
        mark: "stethoscope",
        title: "Get to Know Your Team",
        body: "A first assessment kicks off your personalized care plan.",
      },
      {
        mark: "route",
        title: "Start Your Journey",
        body: "Your Care Coordinator takes it from there, keeping you on track year-round.",
      },
    ],
    closing: "Our care goes beyond treating symptoms. It's about anticipating what your health needs next.",
  },
  programs: {
    eyebrow: "The programs",
    title: "Explore My 360 Programs",
    sub: "Life changes, and so do your health needs. My 360 is designed to support you through every stage: from childhood and adulthood to healthy aging, with dedicated care for those managing chronic conditions along the way.",
    whoLabel: "Who it's for",
    cta: "Ask about this program",
  },
  journey: {
    eyebrow: "Your care journey",
    title: "One Journey, Ongoing Care",
    body: "My 360 is designed to support you over time. Your care is connected across every step, with a dedicated team that understands your health, follows your progress, and stays by your side as your needs and priorities evolve.",
    milestones: [
      { age: "Birth – 24 months", label: "Grow: The Foundation", slug: "grow" },
      { age: "3–9 years", label: "Grow: The Growing Years", slug: "grow" },
      { age: "10–18 years", label: "Grow: The Formative Years", slug: "grow" },
      { age: "19–34 years", label: "Live: Baseline", slug: "live" },
      { age: "35–50 years", label: "Live: Step Up / Stay Ahead", slug: "live" },
      { age: "51–64 years", label: "Live: Sustained Care", slug: "live" },
      { age: "Aging adults", label: "Thrive", slug: "thrive" },
    ],
    parallel: {
      age: "At any stage",
      label: "Diabetes Management Program",
      note: "for individuals living with diabetes",
    },
  },
  team: {
    eyebrow: "Your care team",
    title: "A Care Team That Stays With You",
    sub: "Every My 360 program is anchored by the same core care team, so you always know who's looking after you.",
    members: [
      {
        role: "Consultant",
        tag: "Oversees your journey",
        body: "Oversees your overall care journey, reviews outcomes, and coordinates specialist care.",
      },
      {
        role: "Program GP",
        tag: "Annual reviews",
        body: "Conducts your annual (or more frequent) reviews and keeps every touchpoint on track.",
      },
      {
        role: "Care Coordinator",
        tag: "Bookings & referrals",
        body: "Your single point of contact for bookings, scheduling, and referrals.",
      },
    ],
  },
  year: {
    eyebrow: "Throughout the year",
    title: "A Closer Look at What Matters",
    body: "Each program follows a structured rhythm of tracking, review, and follow-up, adjusted to what matters most at your life stage.",
    groups: [
      {
        mark: "pulse",
        cadence: "Tracked at every visit",
        items: ["BMI", "Blood pressure", "Physical activity", "Growth percentiles (age-dependent)"],
        note: "",
      },
      {
        mark: "calendar",
        cadence: "Reviewed every 3 months",
        items: ["HbA1c", "LDL cholesterol", "Medication adherence"],
        note: "Diabetes & Thrive",
      },
      {
        mark: "shield",
        cadence: "Reviewed annually",
        items: ["Vaccination completion", "Vision & hearing", "Fall risk", "Cognitive health", "Preventive screening"],
        note: "",
      },
      {
        mark: "heart",
        cadence: "Ongoing monitoring",
        items: ["Nutrition", "Oral health", "Sleep", "Emotional wellbeing"],
        note: "",
      },
    ],
    closing: "By keeping track of the details that matter over time, your care team can build a clearer picture of your health and make each next step feel more considered.",
  },
  testimonials: {
    eyebrow: "Experts & member stories",
    title: "Backed by a Trusted Team of Specialists",
    sub: "Consultants, program GPs and specialists across every discipline, and the members whose care they coordinate.",
  },
  faq: {
    eyebrow: "FAQ",
    title: "Questions, answered",
    items: [
      {
        q: "Is there a cost to join My 360?",
        a: "No, there are no membership fees or additional charges to enroll in any My 360 program.",
      },
      {
        q: "Who is on my care team?",
        a: "Every member is supported by a Consultant, a Program GP, and a Care Coordinator, who work together throughout your journey.",
      },
      {
        q: "How often will I need to visit the clinic?",
        a: "It depends on your program and life stage. Visit frequency ranges from once a year to quarterly check-ins, with telemedicine support in between.",
      },
      {
        q: "Can I switch programs as my needs change?",
        a: "Yes. My 360 is designed as a continuum. As you move through life stages (or your health needs change), your care team helps transition you to the right program.",
      },
      {
        q: "What happens between clinic visits?",
        a: "Telemedicine check-ins keep your care consistent and let you stay in touch with your team wherever you are.",
      },
      {
        q: "How do I join?",
        a: "Call or WhatsApp 920022811, email my360@myclinic.com.sa, or speak to our team at your next clinic visit.",
      },
      {
        q: "Is My 360 available for children?",
        a: "Yes. My 360 Grow is a dedicated pediatric program for children and adolescents from birth through age 18.",
      },
    ],
  },
  contact: {
    eyebrow: "Join My 360",
    title: "Start Your My 360 Journey Today",
    body: "Getting started is simple. There are no membership fees, and your dedicated care team will guide you through the next steps from the moment you reach out.",
    hours: "Sun–Thu 9 AM–9 PM · Fri 5–9 PM · Sat 1–9 PM",
  },
  form: {
    title: "Request a call back",
    sub: "Leave your details and our Care Coordinator will contact you.",
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
    { href: "#why", label: "Why My 360" },
    { href: "#approach", label: "How it works" },
    { href: "#programs", label: "Programs" },
    { href: "#journey", label: "Care journey" },
    { href: "#team", label: "Care team" },
    { href: "#faq", label: "FAQ" },
  ],
};

export const AR: typeof EN = {
  meta: {
    badge: "My 360",
    tagline: "رفيق حياتك",
    taglineAlt: "Simply Better Living",
    h1a: "عيادة واحدة. ",
    h1b: "وفريق رعاية متكامل.",
    sub: "ورحلة صحية مصممة لتناسبك في كل مرحلة من مراحل الحياة، من أول فحص لطفلك إلى الرعاية التي تساعدك على مواصلة حياتك بصحة وحيوية.",
    ctaPrimary: "اكتشف برنامجك",
    ctaSecondary: "كيف يعمل My 360",
    noFees: "بدون رسوم عضوية",
  },
  stats: [
    { value: 4, suffix: "", label: "برامج رعاية" },
    { value: 10000, suffix: "+", label: "مستفيد من برامجنا" },
    // The unit lives in the label, not the suffix: the counter is wrapped in
    // dir="ltr" (digits must not reorder), and an Arabic word inside that
    // wrapper would be laid out left-to-right — i.e. backwards.
    { value: 8, suffix: "", label: "سنوات في خدمة مرضانا" },
    { value: 90, suffix: "%", label: "رضا المستفيدين" },
  ],
  why: {
    eyebrow: "لماذا My 360؟",
    title: "رعاية صحية مصممة حسب احتياجك",
    sub: "يجمع برنامج My 360 برامج رعاية صحية استباقية ومصممة حول احتياجاتك، بما يناسب مراحل الحياة المختلفة واحتياجاتك الصحية، أساسها منهجية واحدة: رعاية متكاملة ومستمرة يقدمها فريق متخصص يعرف احتياجاتك.",
    items: [
      {
        mark: "team",
        title: "فريق متكامل من أفضل الأطباء والخبراء",
        body: "يحصل كل مستفيد من البرنامج على استشاري وطبيب برنامج ومنسق رعاية يعملون معا لمتابعة تطوراته الصحية.",
      },
      {
        mark: "shield",
        title: "رعاية استباقية، لا تقتصر على علاج المشكلة",
        body: "متابعات وفحوصات منتظمة تساعد على اكتشاف أي مؤشرات مبكرا قبل أن تتطور.",
      },
      {
        mark: "clipboard",
        title: "إعداد خطة حسب احتياجك",
        body: "تصمم خطة الرعاية وفق عمرك وحالتك الصحية وأهدافك.",
      },
      {
        mark: "chat",
        title: "رعايتك مستمرة",
        body: "تتيح المتابعة عن بعد والتواصل المستمر مع فريقك الحفاظ على استمرارية رعايتك أينما كنت.",
      },
      {
        mark: "grid",
        title: "خبرات في تخصصات متنوعة",
        body: "شبكة مترابطة من الأطباء والاستشاريين والأخصائيين تعمل كفريق واحد لتغطية مختلف احتياجات رعايتك.",
      },
      {
        mark: "tag",
        title: "بدون رسوم عضوية",
        body: "جميع برامج My 360 متاحة للانضمام إليها دون رسوم إضافية.",
      },
    ],
  },
  approach: {
    eyebrow: "كيف يعمل",
    title: "رعاية منتظمة بخطوات واضحة",
    body: "يتبع كل برنامج من برامج My 360 مسارا واضحا ومنتظما: يبدأ بتقييم أولي لفهم احتياجاتك، ثم خطة رعاية مصممة لك، وفريق يتابع تطوراتك في كل خطوة، ويتولى تنظيم المواعيد والمتابعات نيابة عنك.",
    steps: [
      {
        mark: "chat",
        title: "ابدأ معنا",
        body: "تواصل معنا عبر الهاتف أو واتساب أو البريد الإلكتروني، أو تحدث مع فريقنا خلال زيارتك القادمة.",
      },
      {
        mark: "stethoscope",
        title: "تعرف على فريقك",
        body: "يبدأ تقييمك الأولي بوضع خطة رعاية تناسب احتياجاتك.",
      },
      {
        mark: "route",
        title: "ابدأ رحلتك",
        body: "يتولى منسق الرعاية بقية الخطوات ويساعدك على الاستمرار على المسار المناسب طوال العام.",
      },
    ],
    closing: "رعايتنا لا تقتصر على علاج الأعراض فقط، بل تهتم بما تحتاجه صحتك في الخطوة القادمة.",
  },
  programs: {
    eyebrow: "البرامج",
    title: "اكتشف برامج My 360",
    sub: "صمم برنامج My 360 ليرافقك في كل مرحلة، من الطفولة إلى البلوغ وصولا إلى التقدم في العمر بصحة، مع رعاية متخصصة لمن يتابعون حالات مزمنة خلال هذه الرحلة.",
    whoLabel: "هذا البرنامج مخصص لـ",
    cta: "استفسر عن هذا البرنامج",
  },
  journey: {
    eyebrow: "رحلتك مع الرعاية",
    title: "رحلة الرعاية المستمرة",
    body: "صمم برنامج My 360 ليرافقك على المدى الطويل خطوة بخطوة، مع فريق متخصص يفهم حالتك الصحية، ويتابع تقدمك، ويبقى إلى جانبك مع تغير احتياجاتك وأولوياتك.",
    milestones: [
      { age: "من الولادة إلى 24 شهرا", label: "رحلة طفلك", slug: "grow" },
      { age: "من 3 إلى 9 سنوات", label: "رحلة طفلك", slug: "grow" },
      { age: "من 10 إلى 18 سنة", label: "رحلة طفلك", slug: "grow" },
      { age: "من 19 إلى 34 سنة", label: "حياة", slug: "live" },
      { age: "من 35 إلى 50 سنة", label: "حياة", slug: "live" },
      { age: "من 51 إلى 64 سنة", label: "حياة", slug: "live" },
      { age: "مرحلة التقدم في العمر", label: "حياة متجددة", slug: "thrive" },
    ],
    parallel: {
      age: "في أي مرحلة",
      label: "برنامج إدارة السكري",
      note: "لمرضى السكري",
    },
  },
  team: {
    eyebrow: "فريق رعايتك",
    title: "فريق رعاية يتابع حالتك الصحية",
    sub: "يعتمد كل برنامج من برامج My 360 على فريق رعاية أساسي متكامل، لتعرف دائما من يتابع رعايتك.",
    members: [
      {
        role: "الاستشاري",
        tag: "يشرف على رحلتك",
        body: "يشرف على رحلتك الصحية، ويراجع النتائج، وينسق رعايتك مع التخصصات الطبية.",
      },
      {
        role: "طبيب البرنامج",
        tag: "المراجعات الدورية",
        body: "يتابع مراجعاتك السنوية أو الدورية، ويساعد على انتظام جميع مراحل الرعاية.",
      },
      {
        role: "منسق الرعاية",
        tag: "المواعيد والإحالات",
        body: "جهة التواصل الأساسية لحجز المواعيد وتنظيمها والإحالات.",
      },
    ],
  },
  year: {
    eyebrow: "رعايتك على مدار العام",
    title: "نظرة أقرب لصحتك",
    body: "يتبع كل برنامج وتيرة منتظمة للمتابعة والمراجعة، تعدل وفق ما يهم صحتك واحتياجات مرحلتك العمرية.",
    groups: [
      {
        mark: "pulse",
        cadence: "تتابع في كل زيارة",
        items: ["مؤشر كتلة الجسم", "ضغط الدم", "النشاط البدني", "مؤشرات النمو حسب العمر"],
        note: "",
      },
      {
        mark: "calendar",
        cadence: "تراجع كل 3 أشهر",
        items: ["السكر التراكمي HbA1c", "كوليسترول LDL", "الالتزام بالأدوية"],
        note: "برنامج إدارة السكري وبرنامج حياة متجددة",
      },
      {
        mark: "shield",
        cadence: "تراجع سنويا",
        items: ["استكمال التطعيمات", "صحة النظر والسمع", "خطورة الهبوط", "الصحة الإدراكية", "الفحوصات الوقائية"],
        note: "",
      },
      {
        mark: "heart",
        cadence: "متابعة مستمرة",
        items: ["التغذية", "صحة الفم والأسنان", "النوم", "الصحة النفسية"],
        note: "",
      },
    ],
    closing: "من خلال متابعة التفاصيل التي تهم صحتك مع مرور الوقت، يستطيع فريق رعايتك تكوين صورة أوضح عن حالتك، واتخاذ كل خطوة تالية بما يناسب احتياجاتك.",
  },
  testimonials: {
    eyebrow: "الخبراء وتجارب المرضى",
    title: "بدعم من فريق موثوق من الأطباء والأخصائيين",
    sub: "استشاريون وأطباء برامج وأخصائيون في مختلف التخصصات، والمستفيدون الذين ينسقون رعايتهم.",
  },
  faq: {
    eyebrow: "الأسئلة الشائعة",
    title: "إجابات لأكثر ما يسأل",
    items: [
      {
        q: "هل توجد رسوم للانضمام إلى My 360؟",
        a: "لا، لا توجد رسوم عضوية أو رسوم إضافية للانضمام إلى أي من برامج My 360.",
      },
      {
        q: "من هم الأطباء الموجودون في برامج My 360؟",
        a: "يحظى كل مستفيد بدعم استشاري وطبيب برنامج ومنسق رعاية يعملون معا طوال رحلته.",
      },
      {
        q: "كم مرة أحتاج إلى زيارة العيادة؟",
        a: "يعتمد ذلك على برنامجك ومرحلتك العمرية. قد تتراوح الزيارات من مرة سنويا إلى متابعات ربع سنوية، مع إمكانية المتابعة عن بعد بين الزيارات.",
      },
      {
        q: "هل يمكنني الانتقال إلى برنامج آخر مع تغير احتياجاتي؟",
        a: "نعم. صمم برنامج My 360 كرحلة رعاية مستمرة، ومع انتقالك بين مراحل الحياة أو تغير احتياجاتك الصحية، يساعدك فريق رعايتك على الانتقال إلى البرنامج الأنسب لك.",
      },
      {
        q: "ماذا يحدث بين زيارات العيادة؟",
        a: "تساعدك المتابعة عن بعد على استمرارية رعايتك، وتتيح لك البقاء على تواصل مع فريقك أينما كنت.",
      },
      {
        q: "كيف يمكنني الانضمام؟",
        a: "اتصل أو تواصل معنا عبر واتساب على 920022811، أو راسلنا على my360@myclinic.com.sa، كما يمكنك التحدث مع فريقنا خلال زيارتك القادمة لأحد فروع عيادتي.",
      },
      {
        q: "هل يتوفر برنامج My 360 للأطفال؟",
        a: "نعم، برنامج رحلة طفلك هو برنامج متخصص للأطفال من الولادة وحتى عمر 18 عاما.",
      },
    ],
  },
  contact: {
    eyebrow: "انضم إلى My 360",
    title: "ابدأ رحلتك مع برامج My 360 اليوم",
    body: "بخطوات بسيطة وبدون رسوم عضوية، سيرافقك فريق رعايتك ويوجهك في الخطوات التالية منذ لحظة تواصلك معنا.",
    hours: "الأحد–الخميس 9:00 ص – 9:00 م · الجمعة 5:00 – 9:00 م · السبت 1:00 – 9:00 م",
  },
  form: {
    title: "اطلب اتصالا منا",
    sub: "اترك بياناتك وسيتواصل معك منسق الرعاية.",
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
    { href: "#why", label: "لماذا My 360؟" },
    { href: "#approach", label: "كيف يعمل" },
    { href: "#programs", label: "البرامج" },
    { href: "#journey", label: "رحلة الرعاية" },
    { href: "#team", label: "فريق الرعاية" },
    { href: "#faq", label: "الأسئلة الشائعة" },
  ],
};

/**
 * Member testimonials, verbatim from the content guide.
 *
 * ⚠️ The guide flags these as PLACEHOLDER copy — "should be replaced with real,
 * approved quotes and credentials before launch". They are attributed
 * anonymously here for exactly that reason. Swap in approved, attributable
 * quotes before this page is promoted.
 */
export const TESTIMONIALS = [
  {
    programEn: "Diabetes Management Program",
    programAr: "برنامج My 360 لإدارة السكري",
    memberEn: "Member, Diabetes Management Program",
    memberAr: "أحد المستفيدين من برنامج إدارة السكري",
    accent: "#F98122",
    quoteEn:
      "For years I managed my diabetes on my own, juggling appointments and never quite sure if I was on track. With My 360, I finally have one team that knows my whole picture, and my numbers have never been more stable.",
    quoteAr:
      "لسنوات كنت أدير السكري بمفردي، أوفق بين المواعيد دون أن أعرف حقا إن كنت على المسار الصحيح. مع My 360 أصبح لدي أخيرا فريق واحد يعرف صورتي الصحية كاملة، ولم تكن قراءاتي يوما أكثر استقرارا.",
  },
  {
    programEn: "My 360 Grow",
    programAr: "برنامج رحلة طفلك",
    memberEn: "Parent of a My 360 Grow patient",
    memberAr: "والدة أحد أطفال برنامج رحلة طفلك",
    accent: "#A11A4E",
    quoteEn:
      "As a first-time parent, I worried about missing something important. Having a dedicated pediatric team tracking every milestone, and a coordinator who handles the scheduling, has taken so much pressure off us.",
    quoteAr:
      "كأم لأول مرة، كنت أخشى أن يفوتني شيء مهم. وجود فريق أطفال مخصص يتابع كل مرحلة نمو، ومنسق يتولى تنظيم المواعيد، خفف عنا ضغطا كبيرا.",
  },
  {
    programEn: "My 360 Live",
    programAr: "برنامج حياة",
    memberEn: "Member, My 360 Live",
    memberAr: "أحد المستفيدين من برنامج حياة",
    accent: "#02AEAD",
    quoteEn:
      "I used to only see a doctor when something was wrong. Now I have a plan that keeps me ahead of it: regular checkups, clear next steps, and a team that actually remembers my history.",
    quoteAr:
      "كنت لا أزور الطبيب إلا عند حدوث مشكلة. الآن لدي خطة تسبق المشكلة: فحوصات منتظمة، وخطوات واضحة، وفريق يتذكر تاريخي الصحي فعلا.",
  },
  {
    programEn: "My 360 Thrive",
    programAr: "برنامج حياة متجددة",
    memberEn: "Member, My 360 Thrive",
    memberAr: "أحد المستفيدين من برنامج حياة متجددة",
    accent: "#68408F",
    quoteEn:
      "At my age, I wanted a care team that understood how everything is connected, not just separate visits for separate problems. My 360 Thrive gives me that, and I feel more in control of my health than I have in years.",
    quoteAr:
      "في مثل عمري، أردت فريق رعاية يفهم كيف يرتبط كل شيء ببعضه، لا زيارات منفصلة لمشكلات منفصلة. برنامج حياة متجددة منحني ذلك، وأشعر بسيطرة على صحتي لم أشعر بها منذ سنوات.",
  },
];

/** The multi-program family quote — rendered as the featured, full-width card. */
export const FAMILY_TESTIMONIAL = {
  programEn: "Family · multiple programs",
  programAr: "عائلة · أكثر من برنامج",
  memberEn: "A My 360 family, on multiple programs",
  memberAr: "إحدى عائلات My 360، على أكثر من برنامج",
  quoteEn:
    "Our whole family is on My 360 now: my kids on Grow, my husband and I on Live. It's reassuring knowing everyone has the same standard of coordinated care, all through one clinic.",
  quoteAr:
    "عائلتنا كلها الآن على My 360: أطفالي على برنامج رحلة طفلك، وأنا وزوجي على برنامج حياة. من المطمئن أن يحظى الجميع بالمستوى نفسه من الرعاية المنسقة، عبر عيادة واحدة.",
};

// Bilingual content for every dental service page.
// Each service slug maps to a fully-formed content block; the shared
// <DentalServicePage> template reads from here so the 17 routes stay thin.

export type DentalService = {
  slug: string;
  hero: { en: { eyebrow: string; title: string; subtitle: string }; ar: { eyebrow: string; title: string; subtitle: string } };
  meta: { en: { title: string; description: string }; ar: { title: string; description: string } };
  benefits: { en: { title: string; items: { icon: string; title: string; body: string }[] }; ar: { title: string; items: { icon: string; title: string; body: string }[] } };
  procedure: { en: { title: string; steps: { title: string; body: string }[] }; ar: { title: string; steps: { title: string; body: string }[] } };
  faq: { en: { q: string; a: string }[]; ar: { q: string; a: string }[] };
  // Used to filter doctors-data to the most relevant specialists for this page.
  doctorMatch?: (specOrTitle: string) => boolean;
};

export const dentalServices: Record<string, DentalService> = {
  general: {
    slug: "general",
    meta: {
      en: { title: "General Dentistry in Riyadh & Jeddah | My Clinic", description: "Family-friendly checkups, fillings, and routine cleanings with My Clinic's dental specialists in Saudi Arabia. Book today." },
      ar: { title: "عيادة الأسنان العامة | عيادتي للأسنان", description: "كشف وفحص وعلاج عام للأسنان مع نخبة من الأطباء في الرياض وجدة. احجز موعدك الآن." },
    },
    hero: {
      en: { eyebrow: "General Dentistry", title: "Comprehensive dental care for the whole family", subtitle: "Routine checkups, fillings, cleanings, and preventive care from specialists who treat you like family." },
      ar: { eyebrow: "طب الأسنان العام", title: "رعاية شاملة لأسنان كل أفراد الأسرة", subtitle: "كشف دوري، حشوات، تنظيف، ووقاية من التسوس مع أطباء خبراء يعاملونك كفرد من العائلة." },
    },
    benefits: {
      en: {
        title: "Why patients choose My Clinic Dental",
        items: [
          { icon: "verified", title: "Specialist-led", body: "Every procedure is performed by board-certified dentists with hospital-grade sterilization." },
          { icon: "schedule", title: "Same-day appointments", body: "Walk-in slots and emergency availability across Jeddah and Riyadh." },
          { icon: "diversity_3", title: "Family-friendly", body: "Pediatric, adult, and senior care under one roof — book the whole family in one visit." },
        ],
      },
      ar: {
        title: "لماذا يختار المرضى عيادتي للأسنان",
        items: [
          { icon: "verified", title: "أطباء استشاريون", body: "كل إجراء يقوم به طبيب استشاري معتمد بأعلى معايير التعقيم." },
          { icon: "schedule", title: "مواعيد في نفس اليوم", body: "حجوزات مرنة ومواعيد طوارئ متوفرة في جدة والرياض." },
          { icon: "diversity_3", title: "للعائلة بأكملها", body: "أطفال وكبار وكبار السن في عيادة واحدة — احجز للعائلة كاملة في زيارة واحدة." },
        ],
      },
    },
    procedure: {
      en: {
        title: "How your visit works",
        steps: [
          { title: "1. Consultation & X-ray", body: "A 15-minute exam with digital imaging to map exactly what your teeth need." },
          { title: "2. Personalized treatment plan", body: "Transparent pricing, no surprises, and clear options for every procedure." },
          { title: "3. Treatment & follow-up", body: "Pain-managed treatment with a dedicated coordinator who follows up after every visit." },
        ],
      },
      ar: {
        title: "كيف تتم زيارتك",
        steps: [
          { title: "١. الكشف والأشعة", body: "فحص لمدة ١٥ دقيقة مع تصوير رقمي لتحديد احتياج أسنانك بدقة." },
          { title: "٢. خطة علاج مخصصة", body: "أسعار شفافة وخيارات واضحة لكل إجراء بدون مفاجآت." },
          { title: "٣. العلاج والمتابعة", body: "علاج بدون ألم ومنسق طبي يتابع معك بعد كل زيارة." },
        ],
      },
    },
    faq: {
      en: [
        { q: "How often should I visit the dentist?", a: "Every 6 months for a checkup and cleaning is the standard recommendation. Patients with gum disease or active treatment may need more frequent visits." },
        { q: "Do you accept insurance?", a: "Yes — we work with most major insurance providers in Saudi Arabia. Bring your insurance card to your visit and our coordinator will verify coverage." },
        { q: "Is the first consultation free?", a: "Initial consultations are complimentary for new patients. We'll do a full exam, X-rays if needed, and walk you through your options before any treatment is scheduled." },
      ],
      ar: [
        { q: "كم مرة يجب زيارة طبيب الأسنان؟", a: "كل ٦ أشهر للكشف والتنظيف الدوري. المرضى الذين يعانون من مشاكل اللثة أو علاج نشط قد يحتاجون زيارات متكررة." },
        { q: "هل تقبلون التأمين؟", a: "نعم، نتعامل مع معظم شركات التأمين في المملكة العربية السعودية. أحضر بطاقة التأمين معك وسيتولى المنسق التأكد من التغطية." },
        { q: "هل الاستشارة الأولى مجانية؟", a: "الاستشارة الأولى مجانية للمرضى الجدد. سنقوم بفحص شامل وأشعة عند الحاجة وشرح كافة الخيارات قبل أي علاج." },
      ],
    },
    doctorMatch: () => true,
  },

  implants: {
    slug: "implants",
    meta: {
      en: { title: "Dental Implants in Riyadh — Permanent Tooth Replacement | My Clinic", description: "Same-day dental implants, immediate-load implants, and bone grafting in Riyadh & Jeddah. Get a permanent solution from board-certified specialists." },
      ar: { title: "زراعة الأسنان في الرياض — حل دائم لتعويض الأسنان | عيادتي", description: "زراعة فورية، زراعة بدون جراحة، وتطعيم عظمي في الرياض وجدة مع أفضل الأطباء الاستشاريين. احجز استشارتك المجانية." },
    },
    hero: {
      en: { eyebrow: "Dental Implants", title: "A permanent replacement for missing teeth", subtitle: "Same-day implants, full-arch restoration, and bone grafting from specialists with thousands of cases. Eat, smile, and speak with confidence again." },
      ar: { eyebrow: "زراعة الأسنان", title: "حل دائم لتعويض الأسنان المفقودة", subtitle: "زراعة فورية، تركيب فك كامل، وتطعيم عظمي مع نخبة من الأطباء المتخصصين. كُل وابتسم وتحدث بثقة من جديد." },
    },
    benefits: {
      en: {
        title: "Why choose My Clinic for your implants",
        items: [
          { icon: "verified", title: "Board-certified surgeons", body: "Every implant is placed by an oral surgeon with international training and thousands of completed cases." },
          { icon: "bolt", title: "Same-day immediate load", body: "Eligible patients leave with a temporary crown the same day — no months of waiting with a gap." },
          { icon: "shield_with_heart", title: "Lifetime structural warranty", body: "We stand behind every implant we place with a structural warranty for the life of the implant." },
        ],
      },
      ar: {
        title: "لماذا تختار عيادتي للزراعة",
        items: [
          { icon: "verified", title: "جراحون استشاريون", body: "كل زراعة يقوم بها استشاري جراحة فم وأسنان بخبرة دولية وآلاف الحالات الناجحة." },
          { icon: "bolt", title: "زراعة فورية في نفس اليوم", body: "للحالات المناسبة، تركيب التاج المؤقت في نفس اليوم — بدون انتظار شهور." },
          { icon: "shield_with_heart", title: "ضمان مدى الحياة", body: "ضمان شامل على بنية الزرعة مدى الحياة لجميع زراعاتنا." },
        ],
      },
    },
    procedure: {
      en: {
        title: "Your implant journey",
        steps: [
          { title: "1. 3D scan & consultation", body: "Cone-beam CT imaging maps your jawbone density. Your specialist designs a precise placement plan." },
          { title: "2. Implant placement", body: "Painless surgical placement under local anesthesia or sedation. Most cases finish in under an hour." },
          { title: "3. Crown & follow-up", body: "Custom-crafted crown placed once the implant integrates with your bone. Ongoing checkups included." },
        ],
      },
      ar: {
        title: "رحلة زراعتك",
        steps: [
          { title: "١. أشعة ثلاثية الأبعاد واستشارة", body: "تصوير ثلاثي الأبعاد لتقييم كثافة العظم وتصميم خطة دقيقة لزرعتك." },
          { title: "٢. وضع الزرعة", body: "إجراء جراحي بدون ألم تحت تخدير موضعي أو إيقاظي. معظم الحالات تنتهي خلال ساعة." },
          { title: "٣. التاج والمتابعة", body: "تاج مخصص يتم تركيبه بعد اندماج الزرعة بالعظم. متابعة دورية ضمن الباقة." },
        ],
      },
    },
    faq: {
      en: [
        { q: "How much do dental implants cost?", a: "Implant pricing depends on bone condition, implant brand, and the type of crown. Our consultations include a full quote with no hidden fees — most cases range from SAR 4,500 to SAR 9,000 per tooth." },
        { q: "Is the procedure painful?", a: "Implant placement is performed under local anesthesia and is typically less painful than a tooth extraction. Sedation options are available for anxious patients." },
        { q: "How long do dental implants last?", a: "With proper hygiene and routine checkups, dental implants are designed to last a lifetime. We back every placement with a structural warranty." },
      ],
      ar: [
        { q: "كم تكلفة زراعة الأسنان؟", a: "تختلف التكلفة حسب حالة العظم ونوع الزرعة والتاج. كل استشارة تشمل عرض سعر شامل بدون رسوم خفية — السعر عادة بين ٤٥٠٠ و ٩٠٠٠ ريال للسن الواحد." },
        { q: "هل العملية مؤلمة؟", a: "تتم الزراعة تحت تخدير موضعي وعادة تكون أقل ألماً من خلع السن. خيارات التخدير الإيقاظي متوفرة للمرضى القلقين." },
        { q: "كم تدوم زراعة الأسنان؟", a: "مع العناية اليومية والمتابعة الدورية، الزراعة مصممة لتدوم مدى الحياة. نقدم ضماناً هيكلياً على كل زرعة." },
      ],
    },
    doctorMatch: (s) => /implant|surger|maxillofacial|oral/i.test(s),
  },

  orthodontics: {
    slug: "orthodontics",
    meta: {
      en: { title: "Invisalign & Braces in Riyadh | Orthodontist | My Clinic", description: "Invisalign, ceramic braces, and traditional orthodontics with certified orthodontists in Riyadh & Jeddah. Free consultation." },
      ar: { title: "تقويم الأسنان والإنفزلاين في الرياض | عيادتي", description: "تقويم شفاف (إنفزلاين)، تقويم سيراميك، وتقويم تقليدي مع أخصائيي تقويم معتمدين. استشارة مجانية." },
    },
    hero: {
      en: { eyebrow: "Orthodontics & Invisalign", title: "A straight, confident smile — invisible if you want it", subtitle: "Invisalign, ceramic braces, and traditional orthodontics from certified specialists. Free consultations and flexible payment plans." },
      ar: { eyebrow: "تقويم الأسنان والإنفزلاين", title: "ابتسامة مستقيمة وواثقة — وغير ظاهرة إذا أردت", subtitle: "تقويم شفاف، تقويم سيراميك، وتقويم تقليدي مع أخصائيين معتمدين. استشارات مجانية وخطط دفع مرنة." },
    },
    benefits: {
      en: {
        title: "Treatment options that fit your lifestyle",
        items: [
          { icon: "visibility_off", title: "Invisalign clear aligners", body: "Virtually invisible, removable, and comfortable. Ideal for adults and image-conscious teens." },
          { icon: "diamond", title: "Ceramic braces", body: "Tooth-colored brackets that blend in. The strength of metal braces with a fraction of the visibility." },
          { icon: "payments", title: "Flexible payment plans", body: "Up to 24 months of installments with zero interest — straightforward, no credit checks." },
        ],
      },
      ar: {
        title: "خيارات تناسب نمط حياتك",
        items: [
          { icon: "visibility_off", title: "إنفزلاين شفاف", body: "تقريبا غير مرئي، قابل للإزالة، ومريح. مثالي للبالغين والمراهقين الذين يهتمون بالمظهر." },
          { icon: "diamond", title: "تقويم سيراميك", body: "أقواس بلون السن تندمج مع لون الأسنان. قوة التقويم المعدني بمظهر أقل ظهوراً." },
          { icon: "payments", title: "خطط دفع مرنة", body: "تقسيط حتى ٢٤ شهر بدون فوائد — مباشر وبدون فحص ائتماني." },
        ],
      },
    },
    procedure: {
      en: {
        title: "From consultation to confident smile",
        steps: [
          { title: "1. Smile assessment", body: "Free consultation, 3D scan, and a preview of your final smile before you commit to any treatment." },
          { title: "2. Aligners or braces fitted", body: "Custom-made trays or brackets placed in a single appointment. We'll teach you exactly how to care for them." },
          { title: "3. Progress checkups", body: "Visits every 4–6 weeks to monitor progress. Most cases complete in 9–18 months." },
        ],
      },
      ar: {
        title: "من الاستشارة للابتسامة الواثقة",
        steps: [
          { title: "١. تقييم الابتسامة", body: "استشارة مجانية وتصوير ثلاثي الأبعاد ومعاينة لشكل ابتسامتك النهائي قبل أي قرار." },
          { title: "٢. تركيب التقويم أو الإنفزلاين", body: "صناعة مخصصة وتركيب في زيارة واحدة. سنشرح لك كيفية العناية بها بالتفصيل." },
          { title: "٣. متابعة دورية", body: "زيارة كل ٤–٦ أسابيع لمتابعة التقدم. معظم الحالات تكتمل في ٩–١٨ شهر." },
        ],
      },
    },
    faq: {
      en: [
        { q: "Am I a candidate for Invisalign?", a: "Most adults and teens with mild to moderate alignment issues are excellent candidates. Severe bite issues may need traditional braces — we'll know after a free 3D scan." },
        { q: "How long does treatment take?", a: "Invisalign typically takes 9–15 months. Traditional and ceramic braces average 12–24 months. Your specialist will give you a precise timeline at consultation." },
        { q: "Will it affect my speech?", a: "Most patients adjust within a few days. Aligners may cause a slight lisp initially that disappears as your tongue adapts." },
      ],
      ar: [
        { q: "هل أنا مرشح للإنفزلاين؟", a: "معظم البالغين والمراهقين بمشاكل تقويم بسيطة إلى متوسطة مرشحون ممتازون. حالات الإطباق الشديدة قد تحتاج تقويم تقليدي — سنعرف بعد تصوير ثلاثي الأبعاد مجاني." },
        { q: "كم تستغرق المدة؟", a: "الإنفزلاين عادة ٩–١٥ شهر. التقويم التقليدي والسيراميك من ١٢–٢٤ شهر. سيعطيك الأخصائي جدولاً زمنياً دقيقاً في الاستشارة." },
        { q: "هل يؤثر على النطق؟", a: "معظم المرضى يتأقلمون خلال أيام. قد يسبب الإنفزلاين تأتأة بسيطة في البداية تختفي مع تأقلم اللسان." },
      ],
    },
    doctorMatch: (s) => /orthodont|تقويم/i.test(s),
  },
};

// Stub records for the remaining 14 services. Once content is finalized, copy
// the shape above and replace the entry. Until then, the route file can still
// render — fields fall back to the General service.
export const dentalServiceSlugs = [
  "general", "implants", "orthodontics", "veneers", "general-dentistry",
  "oral-surgery", "pediatric", "root-canal", "whitening", "crowns-bridges",
  "gums", "emergency", "laser", "special-needs", "seniors", "holistic", "gbt-cleaning",
] as const;

export type DentalServiceSlug = (typeof dentalServiceSlugs)[number];

export function getService(slug: string): DentalService {
  return dentalServices[slug] ?? dentalServices.general;
}

// Display metadata for the hub grid — every service shown, even those without
// full content yet. `image` is optional: when set (e.g. "/dental/services/implants.webp")
// the card renders the photo. Otherwise it falls back to the gradient + icon design.
// `gradient` is a Tailwind from→via→to triplet used for the fallback card header.
export type DentalCatalogEntry = {
  slug: string;
  en: string;
  ar: string;
  icon: string;
  image?: string;
  gradient: string;
  blurb: { en: string; ar: string };
};

export const dentalServiceCatalog: DentalCatalogEntry[] = [
  { slug: "general", en: "General Dentistry", ar: "طب الأسنان العام", icon: "dentistry",
    gradient: "from-[#003867] via-[#1565c0] to-[#003867]",
    blurb: { en: "Routine checkups, fillings & cleanings.", ar: "كشف وفحص وحشوات دورية." } },
  { slug: "implants", en: "Dental Implants", ar: "زراعة الأسنان", icon: "screw_top",
    gradient: "from-[#003867] via-[#0a4a82] to-[#001e3d]",
    blurb: { en: "Permanent, natural-looking tooth replacement.", ar: "تعويض دائم للأسنان بمظهر طبيعي." } },
  { slug: "orthodontics", en: "Orthodontics & Invisalign", ar: "تقويم وإنفزلاين", icon: "align_horizontal_center",
    gradient: "from-[#003867] via-[#2563eb] to-[#003867]",
    blurb: { en: "Invisalign, ceramic & traditional braces.", ar: "إنفزلاين وتقويم سيراميك وتقليدي." } },
  { slug: "veneers", en: "Cosmetic & Veneers", ar: "تجميل وفينير", icon: "auto_awesome",
    gradient: "from-[#003867] via-[#3b82f6] to-[#0a4a82]",
    blurb: { en: "Hollywood smile, veneers & smile design.", ar: "ابتسامة هوليوود وفينير وتجميل الابتسامة." } },
  { slug: "whitening", en: "Teeth Whitening", ar: "تبييض الأسنان", icon: "lightbulb",
    gradient: "from-[#003867] via-[#0ea5e9] to-[#003867]",
    blurb: { en: "Laser & professional in-clinic whitening.", ar: "تبييض الأسنان بالليزر داخل العيادة." } },
  { slug: "root-canal", en: "Root Canal", ar: "علاج العصب", icon: "vital_signs",
    gradient: "from-[#003867] via-[#0a4a82] to-[#001e3d]",
    blurb: { en: "Pain-free root canal & nerve treatment.", ar: "علاج العصب وجذور الأسنان بدون ألم." } },
  { slug: "crowns-bridges", en: "Crowns & Bridges", ar: "تركيبات الأسنان", icon: "stadia_controller",
    gradient: "from-[#003867] via-[#1565c0] to-[#0a4a82]",
    blurb: { en: "Zirconia crowns, bridges & full restorations.", ar: "تيجان زيركون وجسور وتأهيل كامل للفم." } },
  { slug: "gums", en: "Gum Treatment", ar: "علاج اللثة", icon: "health_and_safety",
    gradient: "from-[#003867] via-[#1e40af] to-[#003867]",
    blurb: { en: "Gum disease, bleeding & deep cleaning.", ar: "علاج التهاب اللثة والنزيف والتنظيف العميق." } },
  { slug: "pediatric", en: "Pediatric Dentistry", ar: "أسنان الأطفال", icon: "child_care",
    gradient: "from-[#003867] via-[#3b82f6] to-[#1565c0]",
    blurb: { en: "Friendly, gentle care designed for kids.", ar: "رعاية لطيفة ومريحة مصممة للأطفال." } },
  { slug: "oral-surgery", en: "Oral Surgery", ar: "جراحة الفم والفكين", icon: "surgical",
    gradient: "from-[#003867] via-[#001e3d] to-[#0a4a82]",
    blurb: { en: "Wisdom teeth, jaw surgery & extractions.", ar: "ضرس العقل وجراحة الفكين والخلع." } },
  { slug: "emergency", en: "Dental Emergency", ar: "طوارئ الأسنان", icon: "emergency",
    gradient: "from-[#7f1d1d] via-[#003867] to-[#003867]",
    blurb: { en: "24/7 urgent care for pain & broken teeth.", ar: "طوارئ على مدار الساعة للألم والكسور." } },
  { slug: "gbt-cleaning", en: "GBT Cleaning", ar: "تنظيف GBT", icon: "shower",
    gradient: "from-[#003867] via-[#0ea5e9] to-[#1565c0]",
    blurb: { en: "Pain-free Airflow & guided biofilm therapy.", ar: "تنظيف بتقنية إيرفلو وعلاج البيوفيلم." } },
  { slug: "laser", en: "Laser Dentistry", ar: "ليزر الأسنان", icon: "laser_pointer",
    gradient: "from-[#003867] via-[#6366f1] to-[#003867]",
    blurb: { en: "Precise laser treatments, less recovery.", ar: "علاجات بالليزر بدقة وتعافي أسرع." } },
  { slug: "special-needs", en: "Special Needs", ar: "ذوي الاحتياجات", icon: "accessibility",
    gradient: "from-[#003867] via-[#1565c0] to-[#0a4a82]",
    blurb: { en: "Inclusive, accessible dental care.", ar: "رعاية أسنان شاملة لذوي الهمم." } },
  { slug: "seniors", en: "Geriatric Dentistry", ar: "أسنان كبار السن", icon: "elderly",
    gradient: "from-[#003867] via-[#0a4a82] to-[#001e3d]",
    blurb: { en: "Dentures & care designed for seniors.", ar: "تركيبات ورعاية متخصصة لكبار السن." } },
  { slug: "holistic", en: "Holistic Dentistry", ar: "طب الأسنان الحيوي", icon: "spa",
    gradient: "from-[#003867] via-[#1565c0] to-[#003867]",
    blurb: { en: "Mercury-free, biocompatible materials.", ar: "حشوات خالية من الزئبق ومواد آمنة." } },
];

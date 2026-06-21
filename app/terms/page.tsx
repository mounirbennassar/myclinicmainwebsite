"use client";
import Link from "next/link";
import { useLang } from "@/app/i18n/context";

const sections = [
  {
    heading: { en: "Acceptance of Terms", ar: "قبول الشروط" },
    body: {
      en: "By accessing or using My Clinic's website, mobile applications, or any of our digital platforms (collectively, the \"Services\"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our Services.\n\nThese Terms and Conditions apply to all users of our Services, including patients, visitors, and any other individuals who access our platforms.",
      ar: "باستخدامك لموقع عيادتي الإلكتروني أو تطبيقاتنا المحمولة أو أي من منصاتنا الرقمية (يُشار إليها إجمالاً بـ\"الخدمات\")، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على هذه الشروط، يرجى عدم استخدام خدماتنا.\n\nتنطبق هذه الشروط والأحكام على جميع مستخدمي خدماتنا، بما في ذلك المرضى والزوار وأي أفراد آخرين يصلون إلى منصاتنا.",
    },
  },
  {
    heading: { en: "About My Clinic", ar: "عن عيادتي" },
    body: {
      en: "My Clinic is a premium healthcare provider operating in the Kingdom of Saudi Arabia, with locations in Jeddah and Riyadh. We provide a wide range of medical specialties and services aimed at delivering exceptional, patient-centered care.\n\nOur Services are intended for residents and users located within the Kingdom of Saudi Arabia. Access from outside the Kingdom is permitted but may be subject to different regulations.",
      ar: "عيادتي هي مزود رعاية صحية متميز يعمل في المملكة العربية السعودية، مع فروع في جدة والرياض. نقدم مجموعة واسعة من التخصصات والخدمات الطبية الرامية إلى تقديم رعاية استثنائية تتمحور حول المريض.\n\nخدماتنا مخصصة للمقيمين والمستخدمين الموجودين داخل المملكة العربية السعودية.",
    },
  },
  {
    heading: { en: "Medical Services Disclaimer", ar: "إخلاء المسؤولية عن الخدمات الطبية" },
    body: {
      en: `The information provided on our platforms is for general informational purposes only and does not constitute medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.

Never disregard professional medical advice or delay in seeking it because of something you have read on our website or platforms.

My Clinic does not recommend or endorse any specific tests, physicians, products, procedures, opinions, or other information that may be mentioned on our platforms. Reliance on any information provided by My Clinic is solely at your own risk.

In case of a medical emergency, please call emergency services immediately or visit the nearest emergency room.`,
      ar: `المعلومات المقدمة على منصاتنا هي لأغراض إعلامية عامة فقط ولا تشكل نصيحة طبية أو تشخيصًا أو علاجًا. استشر دائمًا طبيبك أو مزود الرعاية الصحية المؤهل بشأن أي أسئلة تتعلق بحالتك الطبية.

لا تتجاهل أبدًا المشورة الطبية المتخصصة أو تتأخر في طلبها بسبب شيء قرأته على موقعنا أو منصاتنا.

في حالة الطوارئ الطبية، يرجى الاتصال بخدمات الطوارئ فورًا أو التوجه إلى أقرب غرفة طوارئ.`,
    },
  },
  {
    heading: { en: "Appointment Booking", ar: "حجز المواعيد" },
    body: {
      en: `When booking an appointment through our platforms, you agree to:

• Provide accurate and complete personal and medical information.
• Attend your appointment at the scheduled time or cancel with reasonable notice.
• Notify us promptly if you are unable to attend a scheduled appointment.
• Comply with My Clinic's patient policies and procedures during your visit.

My Clinic reserves the right to cancel or reschedule appointments in cases of emergency, physician unavailability, or other circumstances beyond our control. We will make reasonable efforts to notify you of any changes as soon as possible.

Repeated no-shows or late cancellations may result in restrictions on future appointment bookings.`,
      ar: `عند حجز موعد من خلال منصاتنا، فإنك توافق على:

• تقديم معلومات شخصية وطبية دقيقة وكاملة.
• الحضور في الموعد المحدد أو الإلغاء مع إشعار مسبق معقول.
• إخطارنا فورًا إذا كنت غير قادر على حضور موعد مجدول.
• الامتثال لسياسات وإجراءات عيادتي للمرضى أثناء زيارتك.

تحتفظ عيادتي بالحق في إلغاء المواعيد أو إعادة جدولتها في حالات الطوارئ أو عدم توفر الطبيب أو الظروف الأخرى خارجة عن إرادتنا.`,
    },
  },
  {
    heading: { en: "Patient Responsibilities", ar: "مسؤوليات المريض" },
    body: {
      en: `As a patient or user of our Services, you are responsible for:

• Providing accurate, current, and complete information about your health status and medical history.
• Informing your healthcare provider of any allergies, current medications, or pre-existing conditions.
• Following the medical advice and treatment plans prescribed by our healthcare professionals.
• Making timely payments for services rendered in accordance with My Clinic's billing policies.
• Treating My Clinic staff, other patients, and visitors with respect and courtesy.
• Complying with all applicable laws and regulations while using our Services.

Failure to provide accurate information may result in incorrect treatment or advice, for which My Clinic cannot be held responsible.`,
      ar: `بوصفك مريضًا أو مستخدمًا لخدماتنا، فأنت مسؤول عن:

• تقديم معلومات دقيقة وحديثة وكاملة عن حالتك الصحية وتاريخك الطبي.
• إخطار مزود الرعاية الصحية الخاص بك بأي حساسية أو أدوية حالية أو حالات موجودة مسبقًا.
• اتباع التوجيهات الطبية وخطط العلاج التي يصفها متخصصو الرعاية الصحية لدينا.
• سداد المدفوعات في الوقت المناسب مقابل الخدمات المقدمة وفقًا لسياسات الفواتير في عيادتي.
• معاملة موظفي عيادتي والمرضى الآخرين والزوار باحترام ولطف.

قد يؤدي عدم تقديم معلومات دقيقة إلى علاج أو نصيحة غير صحيحة، ولا يمكن تحميل عيادتي المسؤولية عن ذلك.`,
    },
  },
  {
    heading: { en: "Intellectual Property", ar: "الملكية الفكرية" },
    body: {
      en: "All content on our platforms, including but not limited to text, graphics, logos, images, audio clips, and software, is the property of My Clinic or its content suppliers and is protected by applicable intellectual property laws in the Kingdom of Saudi Arabia and internationally.\n\nYou may not reproduce, distribute, modify, transmit, or use any content from our platforms for commercial purposes without our prior written consent. Personal, non-commercial use is permitted provided that you do not modify the content and you retain all copyright and proprietary notices.",
      ar: "جميع المحتويات الموجودة على منصاتنا، بما في ذلك النصوص والرسومات والشعارات والصور ومقاطع الصوت والبرامج، هي ملك لعيادتي أو موردي محتواها وهي محمية بموجب قوانين الملكية الفكرية المعمول بها في المملكة العربية السعودية ودوليًا.\n\nلا يجوز لك إعادة إنتاج أو توزيع أو تعديل أو نقل أو استخدام أي محتوى من منصاتنا لأغراض تجارية دون موافقتنا الكتابية المسبقة.",
    },
  },
  {
    heading: { en: "Limitation of Liability", ar: "تحديد المسؤولية" },
    body: {
      en: `To the fullest extent permitted by applicable law, My Clinic shall not be liable for:

• Any indirect, incidental, special, consequential, or punitive damages arising from your use of, or inability to use, our Services.
• Any errors, inaccuracies, or omissions in content available on our platforms.
• Any unauthorized access to or use of our secure servers and/or any personal or financial information stored therein.
• Any interruption or cessation of transmission to or from our Services.
• Any bugs, viruses, trojan horses, or similar harmful components transmitted through our Services.

In no event shall My Clinic's total liability to you exceed the amount you have paid to My Clinic for the specific service giving rise to the claim.`,
      ar: `إلى أقصى حد يسمح به القانون المعمول به، لن تكون عيادتي مسؤولة عن:

• أي أضرار غير مباشرة أو عرضية أو خاصة أو تبعية أو عقابية ناشئة عن استخدامك لخدماتنا أو عدم قدرتك على استخدامها.
• أي أخطاء أو عدم دقة أو سهو في المحتوى المتاح على منصاتنا.
• أي وصول غير مصرح به إلى خوادمنا الآمنة أو المعلومات الشخصية أو المالية المخزنة فيها.
• أي انقطاع أو توقف في الإرسال إلى خدماتنا أو منها.`,
    },
  },
  {
    heading: { en: "Governing Law and Jurisdiction", ar: "القانون الحاكم والاختصاص القضائي" },
    body: {
      en: "These Terms and Conditions shall be governed by and construed in accordance with the laws of the Kingdom of Saudi Arabia. Any disputes arising under or in connection with these Terms and Conditions shall be subject to the exclusive jurisdiction of the competent courts of the Kingdom of Saudi Arabia.\n\nIf any provision of these Terms and Conditions is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.",
      ar: "تخضع هذه الشروط والأحكام وتُفسر وفقًا لقوانين المملكة العربية السعودية. تخضع أي نزاعات تنشأ بموجب هذه الشروط والأحكام أو فيما يتعلق بها للاختصاص القضائي الحصري للمحاكم المختصة في المملكة العربية السعودية.\n\nإذا تبين أن أي حكم من هذه الشروط والأحكام غير صالح أو غير قابل للتنفيذ، تستمر الأحكام المتبقية سارية المفعول.",
    },
  },
  {
    heading: { en: "Changes to Terms", ar: "التغييرات على الشروط" },
    body: {
      en: "My Clinic reserves the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting to our platforms. Your continued use of our Services following the posting of changes constitutes your acceptance of those changes.\n\nWe encourage you to review these Terms and Conditions periodically to stay informed of any updates.",
      ar: "تحتفظ عيادتي بالحق في تعديل هذه الشروط والأحكام في أي وقت. تسري التغييرات فور نشرها على منصاتنا. يُعدّ استمرارك في استخدام خدماتنا بعد نشر التغييرات قبولاً منك لتلك التغييرات.\n\nنشجعك على مراجعة هذه الشروط والأحكام بشكل دوري للاطلاع على أي تحديثات.",
    },
  },
  {
    heading: { en: "Contact Us", ar: "تواصل معنا" },
    body: {
      en: "If you have any questions about these Terms and Conditions, please contact us:\n\nPhone: 920022811\nWebsite: myclinic.com.sa\n\nMy Clinic — Kingdom of Saudi Arabia",
      ar: "إذا كانت لديك أي أسئلة حول هذه الشروط والأحكام، يرجى التواصل معنا:\n\nهاتف: 920022811\nالموقع: myclinic.com.sa\n\nعيادتي — المملكة العربية السعودية",
    },
  },
];

export default function TermsPage() {
  const { lang } = useLang();
  const isRtl = lang === "ar";

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="min-h-screen bg-surface">
      {/* Header */}
      <header className="sticky top-0 w-full z-50 glass-effect shadow-clinical">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-4 md:px-8 py-4">
          <Link href="/">
            <img src="/myclinic-frame-logo.webp" alt="My Clinic" className="h-12 w-auto" />
          </Link>
          <Link href="/" className="flex items-center gap-2 text-primary font-bold text-sm hover:underline">
            <span className="material-symbols-outlined text-base">arrow_back</span>
            {isRtl ? "العودة للرئيسية" : "Back to Home"}
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="mb-12">
          <span className="text-secondary font-extrabold text-xs uppercase tracking-[0.2em] block mb-4">
            {isRtl ? "عيادتي" : "My Clinic"}
          </span>
          <h1 className="text-3xl md:text-4xl font-headline font-extrabold text-primary tracking-tight mb-4">
            {isRtl ? "الشروط والأحكام" : "Terms and Conditions"}
          </h1>
          <p className="text-on-surface-variant font-medium">
            {isRtl ? "آخر تحديث: أبريل 2026" : "Last updated: April 2026"}
          </p>
        </div>

        <div className="space-y-10">
          {sections.map((section, i) => (
            <div key={i} className="border-b border-outline-variant/30 pb-10 last:border-0">
              <h2 className="text-xl font-extrabold text-primary mb-4">
                {isRtl ? section.heading.ar : section.heading.en}
              </h2>
              <div className="text-on-surface-variant font-medium leading-relaxed whitespace-pre-line text-sm md:text-base">
                {isRtl ? section.body.ar : section.body.en}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 bg-slate-50 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center text-sm text-slate-500">
          © {new Date().getFullYear()} My Clinic.{" "}
          {isRtl ? "جميع الحقوق محفوظة." : "All rights reserved."}
        </div>
      </footer>
    </div>
  );
}

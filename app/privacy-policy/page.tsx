"use client";
import Link from "next/link";
import { useLang } from "@/app/i18n/context";

const sections = [
  {
    heading: { en: "Compliance", ar: "الامتثال" },
    body: {
      en: "Our website/platforms and online services are intended for users located in the Kingdom of Saudi Arabia.\n\nWe comply with all applicable data protection laws in the Kingdom.",
      ar: "موقعنا الإلكتروني ومنصاتنا وخدماتنا الرقمية مخصصة للمستخدمين الموجودين في المملكة العربية السعودية.\n\nنلتزم بجميع قوانين حماية البيانات المعمول بها في المملكة.",
    },
  },
  {
    heading: { en: "Data Collection and Use", ar: "جمع البيانات واستخدامها" },
    body: {
      en: `We may collect, process and retain the following types of information about you (referred to as Data in this Privacy Policy) from our platforms including:

• Information capable of identifying you personally which you may provide at the time of voluntary registration for services we provide, or which is collected through your use of our websites (including when you make enquiries through our platform (Personal Information), and this may include name, address, email address, date of birth, mobile phone number, national ID number, Medical Record Number (MRN) username etc.
• Financial information (e.g. credit card details, banking details).
• Information relating to your use of the website (e.g. domain name, IP address, cookies, location data).
• Information relating to your purchase of or access to a product or service (e.g. purchase records, delivery details, payment receipts etc.).
• Any feedback or comments you provide online.
• Information which we consider to be sensitive personal information relating to your health, including:
  – About your individual health, including your medical history.
  – Your vital signs, such as weight, height, blood pressure, etc.
  – Any disabilities you may have or have had.
  – Any health care services that are being provided to you or have been provided to you.
  – Information about you that is collected before or during the provision of any health care services.
  – Information relating to your medical insurance coverage, if you choose to provide it for direct billing purposes.
• Any other information that you voluntarily choose to provide through the platforms from time to time.

The platform will record and track your use of the website using cookies and other monitoring tools. You may choose to turn off cookies in your browser and you may delete them from your hard drive. You do not need to have cookies turned on to use the website, but you will need them to use and access some parts of the Sites and to access personalized or secure content.

We will only collect, use, or process your Sensitive Personal Information (such as medical history, health conditions, or treatment details) after obtaining your explicit consent. You have the right to withdraw your consent at any time, without affecting the services provided to you or the legality of any processing done based on prior consent.`,
      ar: `قد نقوم بجمع ومعالجة والاحتفاظ بالأنواع التالية من المعلومات عنك من خلال منصاتنا، بما في ذلك:

• المعلومات التي يمكن أن تُعرّفك شخصيًا، والتي قد تقدمها عند التسجيل الطوعي في خدماتنا، أو التي يتم جمعها من خلال استخدامك لمواقعنا الإلكترونية، وقد تشمل: الاسم، العنوان، البريد الإلكتروني، تاريخ الميلاد، رقم الجوال، رقم الهوية الوطنية، رقم السجل الطبي، إلخ.
• المعلومات المالية (مثل بيانات بطاقة الائتمان والبيانات المصرفية).
• المعلومات المتعلقة باستخدامك للموقع (مثل اسم النطاق، عنوان IP، ملفات تعريف الارتباط، بيانات الموقع الجغرافي).
• المعلومات المتعلقة بشرائك أو وصولك إلى منتج أو خدمة.
• أي تغذية راجعة أو تعليقات تقدمها عبر الإنترنت.
• المعلومات الصحية الحساسة، بما في ذلك: تاريخك الطبي، علاماتك الحيوية، أي إعاقات، الخدمات الصحية المقدمة لك، ومعلومات التأمين الصحي.
• أي معلومات أخرى تختار تقديمها طوعًا عبر المنصات.

سيقوم النظام بتسجيل وتتبع استخدامك للموقع باستخدام ملفات تعريف الارتباط وأدوات المراقبة الأخرى. يمكنك إيقاف تشغيل ملفات تعريف الارتباط في متصفحك وحذفها من جهازك.

لن نقوم بجمع أو استخدام أو معالجة معلوماتك الصحية الحساسة إلا بعد الحصول على موافقتك الصريحة. يحق لك سحب موافقتك في أي وقت دون التأثير على الخدمات المقدمة لك.`,
    },
  },
  {
    heading: { en: "How We Use Your Information", ar: "كيف نستخدم معلوماتك" },
    body: {
      en: `We use your personal information when necessary to provide you with services (such as scheduling appointments, maintaining medical records, analyzing your data, etc.), to process transactions you have requested, or to operate the websites.

We may also use this personal information to:

• Track traffic patterns to and from the website.
• Notify you of marketing promotions that are displayed.
• Ensure that the content of the website is presented in the most effective manner for you.
• Review, develop, facilitate, or improve our provision of the website and the services available on it.
• Simplify the entry of your personal information into certain online forms.
• Enable you to log in to the website and access and use certain services provided through it.
• Contact you for follow-up purposes if a consultation session ends due to a technical failure.
• Respond to any inquiries, requests or comments you have submitted.
• Review, develop and improve the services we provide.
• Notify you of changes to the platforms or our services, where applicable.
• Comply with legal and regulatory obligations, including record keeping and, if necessary, in the exercise or defense of legal claims.

We use Sensitive Personal Information to ensure that we can provide the services you have requested and/or have provided to you to the best of our ability. We will use Sensitive Personal Information to help provide you with information about your health or medical records and to provide our services, including making recommendations and diagnoses.`,
      ar: `نستخدم معلوماتك الشخصية عند الضرورة لتزويدك بالخدمات (مثل جدولة المواعيد، والاحتفاظ بالسجلات الطبية، وتحليل بياناتك)، ولمعالجة المعاملات التي طلبتها، أو لتشغيل المواقع الإلكترونية.

قد نستخدم هذه المعلومات الشخصية أيضًا لـ:

• تتبع أنماط حركة المرور إلى الموقع ومنه.
• إخطارك بالعروض التسويقية المعروضة.
• ضمان تقديم محتوى الموقع بالطريقة الأكثر فعالية لك.
• مراجعة وتطوير وتحسين خدماتنا وموقعنا الإلكتروني.
• الرد على أي استفسارات أو طلبات أو تعليقات قدمتها.
• الامتثال للالتزامات القانونية والتنظيمية.

نستخدم المعلومات الصحية الحساسة لضمان تقديم الخدمات التي طلبتها بأفضل شكل ممكن، بما في ذلك تقديم التوصيات والتشخيصات وتخزين المعلومات في سجلاتك الطبية.`,
    },
  },
  {
    heading: { en: "Marketing", ar: "التسويق" },
    body: {
      en: `We may use your personal information to contact you directly to provide you with information about services you have requested from us or which we think may be of interest to you. You may opt out of receiving such communications at any time.

By continuing to access our Services and agreeing to this Privacy Policy, you hereby expressly consent to our use of your personal information for marketing purposes.

To opt out, please contact us at: 920022811`,
      ar: `قد نستخدم معلوماتك الشخصية للتواصل معك مباشرةً لتزويدك بمعلومات حول الخدمات التي طلبتها منا أو التي نعتقد أنها قد تهمك. يمكنك إلغاء الاشتراك في تلقي هذه الاتصالات في أي وقت.

باستمرارك في الوصول إلى خدماتنا والموافقة على سياسة الخصوصية هذه، فإنك توافق صراحةً على استخدامنا لمعلوماتك الشخصية لأغراض تسويقية.

للإلغاء، يرجى التواصل معنا على: 920022811`,
    },
  },
  {
    heading: { en: "Sharing Your Information", ar: "مشاركة معلوماتك" },
    body: {
      en: `We will not disclose your personal information to third parties except as set forth in this Privacy Policy or as otherwise permitted or required by law.

We may disclose Personal Information, which may include Sensitive Personal Information:

• To IT service providers and third-party cloud service providers used to store and process data.
• To members of our company.
• To competent regulatory, governmental or judicial authorities in response to a legally binding request.
• To emergency services or other specialist intervention providers, if we believe you or others may be in imminent danger.
• To your medical insurance provider, if you have directed us to do so for billing purposes.
• To third parties who maintain databases against which we need to compare your information.
• To another healthcare professional for the purposes of ensuring ongoing medical treatment.
• To communicate with patients about their care or welfare.
• To communicate with family members and others involved in the patient's care.
• To conduct anonymized retrospective medical research.
• For public health purposes.
• In accordance with customary and recognized professional practice and permitted by law.

Any third party acting as a supplier or subcontractor to us will be under a legally binding duty of confidentiality.`,
      ar: `لن نفصح عن معلوماتك الشخصية لأطراف ثالثة إلا وفقًا لما هو منصوص عليه في سياسة الخصوصية هذه أو ما يسمح به القانون أو يستوجبه.

قد نفصح عن المعلومات الشخصية، بما قد يشمل المعلومات الصحية الحساسة، إلى:

• مزودي خدمات تقنية المعلومات ومزودي خدمات السحابة الإلكترونية.
• أعضاء شركتنا.
• السلطات التنظيمية أو الحكومية أو القضائية المختصة استجابةً لطلب ملزم قانونًا.
• خدمات الطوارئ إذا اعتقدنا أنك أو غيرك في خطر وشيك.
• شركة التأمين الصحي الخاصة بك إذا طلبت منا ذلك لأغراض الفواتير.
• طرف ثالث متخصص في الرعاية الصحية لأغراض ضمان استمرارية العلاج.
• للتواصل مع المرضى حول رعايتهم أو رفاهيتهم.
• لإجراء أبحاث طبية مجهولة الهوية وأغراض الصحة العامة.`,
    },
  },
  {
    heading: { en: "Aggregated Non-Personal Data", ar: "البيانات المجمّعة غير الشخصية" },
    body: {
      en: "We may share anonymized data or derivatives of such data with third parties for research, statistical or epidemiological purposes in accordance with applicable law and/or regulations or courts. We will ensure that you cannot be identified from any such data before it is shared.",
      ar: "قد نشارك بيانات مجهولة الهوية أو مشتقات منها مع أطراف ثالثة لأغراض البحث والإحصاء ووبائيات الأمراض وفقًا للقوانين واللوائح المعمول بها. سنضمن عدم إمكانية التعرف عليك من أي بيانات من هذا القبيل قبل مشاركتها.",
    },
  },
  {
    heading: { en: "Proper Provision of Medical Services", ar: "التقديم السليم للخدمات الطبية" },
    body: {
      en: "If you use our medical services, such as telehealth services, you must ensure that you provide complete and accurate information as prompted by the data entry fields on our sites and the consulting physician.\n\nOur physicians rely on the information you provide to inform their assessment of you. If you provide inaccurate or incomplete information, the assessment you receive may be based on an incorrect understanding of your circumstances. We are not responsible for acting on information you provide that is incomplete or inaccurate.",
      ar: "إذا كنت تستخدم خدماتنا الطبية، مثل خدمات الرعاية الصحية عن بُعد، فيجب عليك التأكد من تقديم معلومات كاملة ودقيقة.\n\nيعتمد أطباؤنا على المعلومات التي تقدمها لتقييم حالتك. إذا قدمت معلومات غير دقيقة أو غير مكتملة، فقد يستند التقييم الذي تتلقاه إلى فهم غير صحيح لظروفك. لسنا مسؤولين عن التصرف بناءً على معلومات غير مكتملة أو غير دقيقة تقدمها.",
    },
  },
  {
    heading: { en: "Minors", ar: "القاصرون" },
    body: {
      en: "We are committed to protecting the privacy needs of children and encourage parents and guardians to take an active role in their children's online activities and interests. However, given the nature of medical services, our Services may be beneficial to children and the ability to access certain Services online may be more convenient and less stressful than accessing Services in a face-to-face setting.",
      ar: "نحن ملتزمون بحماية احتياجات خصوصية الأطفال ونشجع الآباء والأوصياء على أخذ دور فاعل في أنشطة أطفالهم وإهتماماتهم عبر الإنترنت. ومع ذلك، نظرًا لطبيعة الخدمات الطبية، قد تكون خدماتنا مفيدة للأطفال.",
    },
  },
  {
    heading: { en: "Security", ar: "الأمان" },
    body: {
      en: "We are committed to protecting the information you provide to us. We have implemented security policies, rules and technical measures to protect the personal information we have under our control, in accordance with applicable data protection laws. Our security measures are designed to prevent unauthorized access, improper use, disclosure, unauthorized modification, unlawful destruction or accidental loss.\n\nIn addition, we limit access to your personal information to those employees, agents, contractors and other third parties who have a business need to know.",
      ar: "نحن ملتزمون بحماية المعلومات التي تزودنا بها. لقد طبقنا سياسات وقواعد وتدابير تقنية أمنية لحماية المعلومات الشخصية التي نتحكم فيها، وفقًا لقوانين حماية البيانات المعمول بها. تم تصميم تدابيرنا الأمنية لمنع الوصول غير المصرح به وسوء الاستخدام والإفصاح والتعديل غير المصرح به والإتلاف غير المشروع أو الضياع العرضي.",
    },
  },
  {
    heading: { en: "Data Retention", ar: "الاحتفاظ بالبيانات" },
    body: {
      en: "We will only retain your data for as long as necessary to fulfill the purposes for which it was collected, to respond to any queries or complaints, to improve the services we provide to you, to comply with any legal obligations to which we may be subject, and to comply with medical best practice and regulatory requirements regarding the retention of medical records.\n\nWhen your personal information is no longer required, we will ensure that it is securely deleted or made inaccessible. Once your personal data is no longer required, we will securely retain, delete or anonymize it ensuring full compliance with legal obligations prescribed under the PDPL.",
      ar: "لن نحتفظ ببياناتك إلا للمدة اللازمة لتحقيق الأغراض التي جُمعت من أجلها، والرد على أي استفسارات أو شكاوى، وتحسين الخدمات التي نقدمها لك، والامتثال لأي التزامات قانونية، والامتثال لمتطلبات الاحتفاظ بالسجلات الطبية.\n\nعندما لا تكون معلوماتك الشخصية مطلوبة بعد الآن، سنضمن حذفها بشكل آمن أو جعلها غير قابلة للوصول.",
    },
  },
  {
    heading: { en: "Third-Party Websites", ar: "مواقع الأطراف الثالثة" },
    body: {
      en: "Our Sites may provide links to third-party websites for your convenience. If you access these links, you will leave our Sites. We do not control third-party websites or their privacy practices, which may differ from ours. We do not endorse or make any representations about third-party websites.\n\nThis Privacy Policy does not cover personal information you choose to provide to unrelated third parties. We encourage you to review the privacy policy of any company before providing your personal information.",
      ar: "قد توفر مواقعنا روابط لمواقع إلكترونية تابعة لأطراف ثالثة لراحتك. إذا وصلت إلى هذه الروابط، فستغادر مواقعنا. لا نتحكم في مواقع الأطراف الثالثة أو ممارسات الخصوصية الخاصة بها. لا تغطي سياسة الخصوصية هذه المعلومات الشخصية التي تختار تقديمها لأطراف ثالثة غير مرتبطة.",
    },
  },
  {
    heading: { en: "Inquiries and Complaints", ar: "الاستفسارات والشكاوى" },
    body: {
      en: `You have the following rights regarding your personal data:

• Right to access your personal data at any time.
• Right to request correction or deletion of inaccurate or outdated data.
• Right to restrict or object to the processing of your personal data.
• Right to withdraw consent for data processing where it is based on your prior consent.

To exercise these rights, please contact us at: 920022811`,
      ar: `لديك الحقوق التالية فيما يتعلق ببياناتك الشخصية:

• الحق في الوصول إلى بياناتك الشخصية في أي وقت.
• الحق في طلب تصحيح أو حذف البيانات غير الدقيقة أو القديمة.
• الحق في تقييد معالجة بياناتك الشخصية أو الاعتراض عليها.
• الحق في سحب الموافقة على معالجة البيانات حيثما تستند إلى موافقتك المسبقة.

لممارسة هذه الحقوق، يرجى التواصل معنا على: 920022811`,
    },
  },
  {
    heading: { en: "Transfer on Merger, Sale, or Similar Event", ar: "النقل عند الاندماج أو البيع أو الحدث المماثل" },
    body: {
      en: "In the event that the company is acquired by a third party, merged with, sold, or otherwise transferred to a third party of all or substantially all of its assets, or in the event of a change in control of the company, information collected by the company from users may be transferred or assigned as part of such merger, acquisition, sale, change of control, or other specified event, but to the extent permitted by applicable law, the obligations of this Privacy Policy will continue to be binding on the company's successors and assigns.",
      ar: "في حال استحواذ طرف ثالث على الشركة أو اندماجها أو بيعها أو نقلها، قد يتم نقل المعلومات التي جمعتها الشركة من المستخدمين أو تحويلها كجزء من هذه العملية، ولكن بقدر ما يسمح به القانون المعمول به، ستظل التزامات سياسة الخصوصية هذه ملزمة لخلفاء الشركة والمتنازل إليهم.",
    },
  },
  {
    heading: { en: "Governing Law", ar: "القانون الحاكم" },
    body: {
      en: `By providing information to the company, each user:

• Acknowledges that the company operates in the Kingdom of Saudi Arabia.
• Agrees to allow us to transfer and use such User's information wherever necessary, including across international borders, to improve the services and transactions provided by the company.
• Agrees that such use by us will be subject to the terms and conditions set forth in this document and the applicable laws of the Kingdom of Saudi Arabia.`,
      ar: `بتقديم معلوماتك للشركة، يقر كل مستخدم بما يلي:

• الاعتراف بأن الشركة تعمل في المملكة العربية السعودية.
• الموافقة على السماح لنا بنقل معلومات المستخدم واستخدامها أينما كان ذلك ضروريًا، بما في ذلك عبر الحدود الدولية.
• الموافقة على أن يخضع هذا الاستخدام للشروط والأحكام المنصوص عليها في هذه الوثيقة وقوانين المملكة العربية السعودية المعمول بها.`,
    },
  },
];

export default function PrivacyPage() {
  const { lang, setLang } = useLang();
  const isRtl = lang === "ar";

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="min-h-screen bg-surface">
      {/* Header */}
      <header className="sticky top-0 w-full z-50 glass-effect shadow-clinical">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-4 md:px-8 py-4">
          <Link href="/">
            <img src="/myclinic-frame-logo.webp" alt="My Clinic" className="h-12 w-auto" />
          </Link>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex items-center bg-surface-container rounded-full overflow-hidden text-[11px] font-bold border border-outline-variant/50">
              <button onClick={() => setLang("en")} className={`px-2.5 py-1.5 transition-all ${lang === "en" ? "bg-primary text-white" : "text-on-surface-variant"}`}>EN</button>
              <button onClick={() => setLang("ar")} className={`px-2.5 py-1.5 transition-all ${lang === "ar" ? "bg-primary text-white" : "text-on-surface-variant"}`}>AR</button>
            </div>
            <Link href="/" className="flex items-center gap-2 text-primary font-bold text-sm hover:underline">
              <span className={`material-symbols-outlined text-base ${isRtl ? "rotate-180" : ""}`}>arrow_back</span>
              <span className="hidden sm:inline">{isRtl ? "العودة للرئيسية" : "Back to Home"}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="mb-12">
          <span className="text-secondary font-extrabold text-xs uppercase tracking-[0.2em] block mb-4">
            {isRtl ? "عيادتي" : "My Clinic"}
          </span>
          <h1 className="text-3xl md:text-4xl font-headline font-extrabold text-primary tracking-tight mb-4">
            {isRtl ? "سياسة الخصوصية وحماية البيانات الشخصية" : "Privacy and Personal Data Protection"}
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

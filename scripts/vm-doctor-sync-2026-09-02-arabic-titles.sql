-- Arabic doctor titles from the clinic's system export (2026-09-02, via Mounir):
--   'Online Visible Doctors Mobile App Report.xlsx' (Sheet1: NameAr, TitleAr,
--   QualificationAr, SpecialtyAr, DoctorRecId, Company), 431 rows = 326 doctors
--   (one row per branch).
--
-- Why: the Arabic site renders title_ar as the line under the doctor's name
-- (app/lib/doctor-display.ts doctorTitle); when it is null the English
-- specialty_raw leaks into the Arabic page, which the client complained about.
-- 348 of the 394 live doctors had title_ar = null.
--
-- What this does, per matched doctor (matched by normalised Arabic name,
-- reviewed by hand, 4 links resolved manually; the public API does not
-- expose source_rec_id, so the stable key is slug):
--   * title_ar        <- TitleAr (overwrites an existing value only when the
--                        export's is at least as specific; 6 richer live titles
--                        are kept, identical values skipped)
--   * name_ar          <- one correction (dr-abdullah-bahakim, see below)
--   * qualification_ar <- QualificationAr ONLY where it is currently null/empty
-- Tashkeel/tatweel stripped, whitespace collapsed (house rule: no diacritics).
--   288 title_ar updates (6 overwrite an existing value),
--   283 qualification_ar fills, 288 rows touched.
--
-- Applied once to the VM database by deploy-vm.yml (marker-guarded). Re-running
-- it is harmless: every statement is idempotent and the check block still passes.

set client_encoding = 'UTF8';

begin;

-- Dr. Abdulaziz Alalwan | د. عبدالعزيز العلوان | 5637478329
update doctors set title_ar = 'استشاري طب الأسرة وطب اليافعين', qualification_ar = 'الزمالة الكندية في طب اليافعين', updated_at = now() where slug = 'dr-abdulaziz-alalwan';
-- Dr. Abdulaziz Alhumoud | د. عبدالعزيز الحمود | 5637514327
update doctors set title_ar = 'أخصائي أول في الطب الباطني', qualification_ar = 'البورد السعودي في الطب الباطني', updated_at = now() where slug = 'dr-abdulaziz-alhumoud';
-- Dr. Abdulaziz Alhuwaymil | د. عبدالعزيز الهويمل | 5637506093
update doctors set title_ar = 'استشاري أشعة تشخيصية وعلاج الألم', qualification_ar = 'البورد السعودي في الأشعة الزمالة الكندية في الأشعة العضلية الهيكلية والتداخلية', updated_at = now() where slug = 'dr-abdulaziz-alhuwaymil';
-- Dr. Abdulaziz Aljohani | د. عبدالعزيز الجهني | 5637530827
update doctors set title_ar = 'استشاري طب وجراحة العيون', qualification_ar = 'البورد الألماني في طب وجراحة العيون والزمالة الأوروبية في طب وجراحة العيون', updated_at = now() where slug = 'dr-abdulaziz-aljohani';
-- Dr. Abdulaziz Alsubaie | د. عبدالعزيز السبيعي | 5637521826
update doctors set title_ar = 'استشاري الباطنة والأمراض المعدية', qualification_ar = 'الزمالة الكندية في الأمراض المعدية', updated_at = now() where slug = 'dr-abdulaziz-alsubaie';
-- Dr. Abdulhaq Suliman | د. عبدالحق  سليمان | 5637422830
update doctors set title_ar = 'طب الأسرة', qualification_ar = 'ماجستير العلوم في طب الأسرة', updated_at = now() where slug = 'dr-abdulhaq-suliman';
-- Dr. Abdulkareem Samman | د. عبدالكريم سمان | 5637149076
update doctors set title_ar = 'استشاري طب الأطفال وقلب الأطفال', qualification_ar = 'البورد الأمريكي والكندي في طب الأطفال الزمالة الكندية في طب الأطفال و العيوب الخلقية للقلب', updated_at = now() where slug = 'dr-abdulkareem-samman';
-- Dr. Abdullah Abdullah | د. عبدالله عبدالله | 5637428826
update doctors set title_ar = 'استشاري جراحة الأوعية الدموية والقسطرة', qualification_ar = 'البورد الأمريكي والكندي في جراحة الأوعية الدموية', updated_at = now() where slug = 'dr-abdullah-abdullah';
-- Dr. Abdullah Alkutbi | د. عبدالله الكتبي | 5637514328
update doctors set title_ar = 'استشاري طب الأعصاب', qualification_ar = 'الزمالة الكندية في طب أعصاب السكتة الدماغية', updated_at = now() where slug = 'dr-abdullah-alkutbi';
-- Dr. Abdullah Almaghraby | د. عبدالله المغربي | 5637513576
update doctors set title_ar = 'استشاري طب الأطفال و الغدد الصماء للأطفال', qualification_ar = 'الزمالة الأمريكية في الغدد الصماء للأطفال', updated_at = now() where slug = 'dr-abdullah-almaghraby';
-- Dr. Abdullah Bahakim | د. عبدالرحمن باحكيم | 5637307327
update doctors set title_ar = 'استشاري الأنف والأذن والحنجرة ومناظير الجيوب الأنفية وقاع الجمجمة', qualification_ar = 'البورد الفرنسي في جراحة الأنف والأذن والحنجرة والرأس والرقبة، الزمالة الكندية في مناظير الجيوب الأنفية وقاع الجمجمة', updated_at = now() where slug = 'dr-abdullah-bahakim';
-- Dr. Abdullah Khafagy | د. عبدالله خفاجي | 5637160326
update doctors set title_ar = 'استشاري طب الأسرة', qualification_ar = 'البورد الأمريكي لطب الأسرة، البورد الأمريكي للطب المهني والبيئي', updated_at = now() where slug = 'dr-abdullah-khafagy';
-- Dr. Abdulmajeed Alghamdi | د. عبدالمجيد الغامدي | 5637478346
update doctors set title_ar = 'استشاري جراحة الكلى والمسالك البولية', qualification_ar = 'الزمالة الألمانية في جراحة الروبوت ومناظير الكلى والمسالك البولية البورد الأوروبي والألماني في جراحة المسالك البولية', updated_at = now() where slug = 'dr-abdulmajeed-alghamdi';
-- Dr. Abdulrahman Alamoudi | د. عبدالرحمن العمودي | 5637320084
update doctors set title_ar = 'استشاري الطب الباطني والغدد الصماء والسكري والسمنة', qualification_ar = 'البورد السعودي في الطب الباطني الزمالة في الغدد الصماء', updated_at = now() where slug = 'dr-abdulrahman-alamoudi';
-- Dr. Abdulrahman Albabtain | د. عبدالرحمن البابطين | 5637458916
update doctors set title_ar = 'استشاري طب الأسرة', qualification_ar = 'البورد السعودي في طب الأسرة', updated_at = now() where slug = 'dr-abdulrahman-albabtain';
-- Dr. Abdulrahman Bahhari | د. عبدالرحمن بحاري | 5637482826
update doctors set title_ar = 'أخصائي علاج نفسي', qualification_ar = 'أخصائي علم نفس', updated_at = now() where slug = 'dr-abdulrahman-bahhari';
-- Dr. Abdulrahman Hawari | د. عبدالرحمن حواري | 5637490326
update doctors set title_ar = 'أخصائي أول - طب الأطفال', qualification_ar = 'البورد السعودي في طب الأطفال', updated_at = now() where slug = 'dr-abdulrahman-hawari';
-- Dr. Abdulrahman Qattan | د. عبدالرحمن قطان | 5637534576
update doctors set title_ar = 'استشاري الأنف والأذن والحنجرة و جراحة أورام الغدة الدرقية وجارات الدرقية', updated_at = now() where slug = 'dr-abdulrahman-qattan';
-- Dr. Abdulrahman Watfah | د. عبدالرحمن وطفه | 5637344912
update doctors set title_ar = 'أخصائي الأنف والأذن والحنجرة', qualification_ar = 'ماجستير في طب وجراحة الأنف والأذن والحنجرة', updated_at = now() where slug = 'dr-abdulrahman-watfah';
-- Dr. Abdulwahab Bawahab | د. عبدالوهاب باوهاب | 5637515077
update doctors set title_ar = 'استشاري الغدد الصماء والسكري', qualification_ar = 'البورد الألماني في الطب الباطني', updated_at = now() where slug = 'dr-abdulwahab-bawahab';
-- Dr. Abeer Aljahdali | د. عبير الجحدلي | 5637476826
update doctors set title_ar = 'استشاري طب وجراحة العيون وأمراض الشبكية والالتهابات العنبية', qualification_ar = 'زمالة مستشفى الملك خالد التخصصي في أمراض الشبكية والالتهابات العنبية البورد السعودي في طب وجراحة العيون', updated_at = now() where slug = 'dr-abeer-aljahdali';
-- Dr. Abeer Saleh | د. عبير صالح | 5637527826
update doctors set title_ar = 'استشاري طب الأسرة', qualification_ar = 'البورد السعودي في طب الأسرة', updated_at = now() where slug = 'dr-abeer-saleh';
-- Dr. Abir Albadrani | د. عبير البدراني | 5637506265
update doctors set title_ar = 'استشاري النساء والولادة وجراحة الأورام النسائية وجراحة المناظير والتجميل النسائي الجراحي والغير جراح', qualification_ar = 'البورد السعودي والعربي في طب النساء والولادة الزمالة البريطانية في جراحة أورام النساء والمناظير', updated_at = now() where slug = 'dr-abir-al-badrani';
-- Dr. Adhwaa Khudhary | د. اضواء خضري | 5637308078
update doctors set title_ar = 'استشاري طب النساء والولادة', qualification_ar = 'البورد السعودي في طب النساء والولادة، الزمالة الكندية في الغدد الإنجابية وتأخر الحمل وجراحة المناظير', updated_at = now() where slug = 'dr-adhwaa-khudhary';
-- Dr. Adil Alsulami | د. عادل السلمي | 5637176826
update doctors set title_ar = 'استشاري الأمراض الصدرية', qualification_ar = 'زمالة الكلية الملكية الإيرلندية في الأمراض الصدرية', updated_at = now() where slug = 'dr-adil-alsulami';
-- Dr. Afnan Aboalwa | د. افنان ابو علوا | 5637285576
update doctors set title_ar = 'استشاري طب الأسرة والسكري', qualification_ar = 'البورد العربي والسعودي في طب الأسرة، الزمالة السعودية في السكري استشارية رضاعة طبيعية معتمدة', updated_at = now() where slug = 'dr-afnan-aboalwa';
-- Dr. Ahmad Almousa | د. احمد الموسى | 5637498596
update doctors set title_ar = 'استشاري أمراض وجراحة الجلد والليزر', qualification_ar = 'الزمالة الأمريكية في الليزر وجراحة الجلد البورد السعودي في الأمراض الجلدية', updated_at = now() where slug = 'dr-ahmad-almousa';
-- Dr. Ahmad Alshahrani | د. احمد الشهراني | 5637523329
update doctors set title_ar = 'الطب الباطني', qualification_ar = 'البورد السعودي لطب الباطنة. مستشفى الملك فيصل التخصصي', updated_at = now() where slug = 'dr-ahmad-alshahrani';
-- Dr. Ahmad Bakhsh | د. احمد بخش | 5637512079
update doctors set title_ar = 'استشاري طب الأطفال والأمراض الروماتيزمية', qualification_ar = 'البورد الأمريكي والكندي في طب الأطفال - جامعة تورنتو, الزمالة الأمريكية في أمراض الروماتيزم للأطفال - جامعة هارڤارد', updated_at = now() where slug = 'dr-ahmad-bakhsh';
-- Dr. Ahmad Imam | د. احمد امام | 5637320085
update doctors set title_ar = 'استشاري الغدد الصماء والسكري', qualification_ar = 'البورد الأمريكي في أمراض الغدد الصماء والسكري، البورد الأمريكي في الطب الباطني', updated_at = now() where slug = 'dr-ahmad-imam';
-- Dr. Ahmed Alsayed | د. احمد السيد | 5637512083
update doctors set title_ar = 'استشاري الأنف والأذن والحنجرة و مناظير الجيوب الأنفية وقاع الجمجمة', qualification_ar = 'البورد السعودي وجامعة الملك سعود في جراحة الأنف والأذن والحنجرة والرأس والرقبة زمالة جامعة الملك سعود في مناظير الجيوب الأنفية وقاع الجمجمة', updated_at = now() where slug = 'dr-ahmed-alsayed';
-- Dr. Ahmed Alshaer | د. احمد الشاعر | 5637524846
update doctors set title_ar = 'أخصائي أول الغدد الصماء والسكري', qualification_ar = 'البورد الكندي في الطب الباطني، الزمالة الكندية في الغدد الصماء', updated_at = now() where slug = 'dr-ahmed-alshaer';
-- Dr. Ahmed Altoub | د. احمد الطوب | 5637497076
update doctors set title_ar = 'استشاري جراحة القدم والكاحل والقدم السكرية', qualification_ar = 'البورد الأمريكي في جراحة القدم والكاحل', updated_at = now() where slug = 'dr-ahmed-altoub';
-- Dr. Ahmed Alwazzan | د. احمد الوزان | 5637147581
update doctors set title_ar = 'استشاري طب النساء والولادة وجراحة الأورام النسائية والمناظير', qualification_ar = 'البورد الكندي في طب النساء والولادة الزمالة الكندية في أورام النساء والمناظير', updated_at = now() where slug = 'dr-ahmed-alwazzan';
-- Dr. Ahmed Baabdallah | د. احمد باعبدالله | 5637367333
update doctors set title_ar = 'استشاري الأمراض الجلدية والليزر والتجميل', qualification_ar = 'البورد السعودي والأوروبي والعربي في طب الأمراض الجلدية، الليزر والتجميل', updated_at = now() where slug = 'dr-ahmed-baabdallah';
-- Dr. Ahmed Bamaga | د. احمد بامقا | 5637189576
update doctors set title_ar = 'استشاري طب أعصاب الأطفال و أمراض العضلات و الأعصاب الطرفية للكبار و الصغار', qualification_ar = 'البورد الكندي و الأمريكي في طب الأعصاب، أعصاب الأطفال و أمراض العضلات و الأعصاب الطرفية', updated_at = now() where slug = 'dr-ahmed-bamaga';
-- Dr. Ahmed Basndwah | د. احمد باسندوه | 5637435625
update doctors set title_ar = 'استشاري طب المخ والأعصاب وأمراض الباركنسون واعتلالات الحركة', qualification_ar = 'الزمالة السعودية لطب المخ والأعصاب الزمالة الكندية لأمراض اعتلالات الحركة', updated_at = now() where slug = 'dr-ahmed-basndwah';
-- Dr. Ahmed Elguindy | د. احمد الجندي | 5637342576
update doctors set title_ar = 'استشاري جراحة العظام والركبة والإصابات الرياضية', qualification_ar = 'دكتوراه في جراحة العظام والإصابات - القاهرة الزمالة الفرنسية في جراحة الركبة والإصابات الرياضية', updated_at = now() where slug = 'dr-ahmed-elguindy';
-- Dr. Ahmed Hashish | د. احمد حشيش | 5637146077
update doctors set title_ar = 'أخصائي الأنف والأذن والحنجرة', qualification_ar = 'ماجستير في جراحة الأنف والأذن والحنجرة', updated_at = now() where slug = 'dr-ahmed-hashish';
-- Dr. Ahmed Mohamed | د. احمد محمد | 5637386861
update doctors set title_ar = 'أخصائي أول - طب الأسرة', qualification_ar = 'الزمالة المصرية في طب الأسرة', updated_at = now() where slug = 'dr-ahmed-mohamed';
-- Dr. Ahmed Sheikh | د. احمد شيخ | 5637515076
update doctors set title_ar = 'استشاري السكري والسمنة وطب الأسرة', qualification_ar = 'زمالة في السكري و علاج السمنة (الولايات المتحدة الأمريكية) البورد البريطاني والسعودي والعربي في طب الأسرة', updated_at = now() where slug = 'dr-ahmed-sheikh';
-- Dr. Ahmed Zmi | د. احمد زمي | 5637398079
update doctors set title_ar = 'أخصائي أول - الأنف والأذن والحنجرة', qualification_ar = 'البورد المصري في طب وجراحة الأنف والأذن والحنجرة', updated_at = now() where slug = 'dr-ahmed-zmi';
-- Dr. Akram Bukhari | د. اكرم بخاري | 5637524081
update doctors set title_ar = 'المسالك البولية', qualification_ar = 'البورد الافريقي والكندي في طب المسالك البولية', updated_at = now() where slug = 'dr-akram-bukhari';
-- Dr. Alaa Alrehaily | د. الاء الرحيلي | 5637527827
update doctors set title_ar = 'استشاري الطب الباطني العام وأمراض تخثر الدم', qualification_ar = 'زمالة الكلية الملكية للأطباء والجراحين في كندا لطب الباطني العام, الزمالة الكندية في طب السمنة، وطب تخثر الدم، والطب المحيط بالعمليات', updated_at = now() where slug = 'dr-alaa-alrehaily';
-- Dr. Albaraa Alqassimi | د. البراء القاسمي | 5637378576
update doctors set title_ar = 'استشاري طب وجراحة القرنية والماء الأبيض وجراحات تصحيح النظر', qualification_ar = 'البورد السعودي في طب وجراحة العيون زمالة مستشفى الملك خالد التخصصي في جراحة القرنية والماء الأبيض وج', updated_at = now() where slug = 'dr-albaraa-alqassimi';
-- Dr. Ali Bassi | د. على باصي | 5637529331
update doctors set title_ar = 'استشاري طب النساء والولادة وجراحة الأورام النسائية وجراحة المناظير', qualification_ar = 'البورد الكندي في النساء والولادة, البورد الكندي في جراحة الأورام النسائية', updated_at = now() where slug = 'dr-ali-bassi';
-- Dr. Ali Bin Mahfooz | د. علي بن محفوظ | 5637482078
update doctors set title_ar = 'استشاري طب وجراحة المسالك البولية', qualification_ar = 'الزمالة الكندية في المثانة العصبية وديناميكية المسالك البولية', updated_at = now() where slug = 'dr-ali-bin-mahfooz';
-- Dr. Almotasimbellah Rayes | د. المعتصم بالله ريس | 5637272826
update doctors set title_ar = 'استشاري طب النساء والولادة تخصص طب الأمومة والأجنة', qualification_ar = 'الزمالة الكندية في طب الأمومة والأجنة والحمل الحرج', updated_at = now() where slug = 'dr-almotasimbellah-rayes';
-- Amal Alandejani | امال الانديجاني | 5637155827
update doctors set title_ar = 'أخصائي أول التغذية العلاجية', qualification_ar = 'ماجستير في التغذية العلاجية والصحة العامة دبلوم في التغذية الرياضية وإدارة السمنة', updated_at = now() where slug = 'dr-amal-alandejani';
-- Dr. Amer Khojah | د. عامر خوجه | 5637427386
update doctors set title_ar = 'استشاري طب الأطفال والحساسية والمناعة وروماتيزم الأطفال', qualification_ar = 'البورد الأمريكي في روماتيزم الأطفال البورد الأمريكي في الحساسية والمناعة', updated_at = now() where slug = 'dr-amer-khojah';
-- Amerah Bogari | أميرة بوقري | 5637537582
update doctors set title_ar = 'أخصائية أولى تغذية علاجية', updated_at = now() where slug = 'dr-amerah-bogari';
-- Dr. Amira Eltawdy | د. اميرة التاودي | 5637427329
update doctors set title_ar = 'استشاري الأمراض الجلدية والليزر والتجميل', qualification_ar = 'البورد الألماني الدولي في باثولوجيا الجلد دكتوراه وماجستير في طب الأمراض الجلدية مصر', updated_at = now() where slug = 'dr-amira-eltawdy';
-- Dr. Amro Albaz | د. عمرو الباز | 5637499327
update doctors set title_ar = 'استشاري جراحة العظام والعمود الفقري', qualification_ar = 'البورد السعودي في جراحة العظام الزمالة السعودية في جراحة العمود الفقري', updated_at = now() where slug = 'dr-amro-albaz';
-- Dr. Amro Hamdi | د. عمرو حمدي | 5637512826
update doctors set title_ar = 'استشاري جراحة العظام', qualification_ar = 'الزمالة الكندية في جراحة اليد و المعصم', updated_at = now() where slug = 'dr-amro-hamdi';
-- Dr. Anan Khattab | د. عنان خطاب | 5637532330
update doctors set title_ar = 'أخصائي تقييم النطق واللغة', qualification_ar = 'ماجستير العلوم في أمراض النطق واللغة', updated_at = now() where slug = 'dr-anan-khattab';
-- Dr. Anmar Fatani | د. انمار فطاني | 5637512081
update doctors set title_ar = 'استشاري طب الأعصاب', qualification_ar = 'البورد السعودي في طب الأعصاب', updated_at = now() where slug = 'dr-anmar-fatani';
-- Dr. Aseel Alghanemi | د. اسيل الغانمي | 5637367332
update doctors set title_ar = 'استشاري طب الأسرة', qualification_ar = 'البورد السعودي والعربي في طب الأسرة، الزمالة الكندية في الطب التلطيفي', updated_at = now() where slug = 'dr-aseel-alghanemi';
-- Dr. Ashraf Aljahdali | د. اشرف الجحدلي | 5637527853
update doctors set title_ar = 'استشاري طب وجراحة العيون', qualification_ar = 'البورد الألماني في طب وجراحة العيون', updated_at = now() where slug = 'dr-ashraf-aljahdali';
-- Dr. Ashraf Warsi | د. اشرف وارسي | 5637320082
update doctors set title_ar = 'استشاري أمراض الدم للبالغين', qualification_ar = 'البورد الأمريكي والكندي في الطب الباطني البورد الأمريكي والكندي في أمراض الدم للبالغين الزمالة الاكلينيكية في تجلط الدم', updated_at = now() where slug = 'dr-ashraf-warsi';
-- Dr. Asim Alshanberi | د. عاصم الشنبري | 5637195576
update doctors set title_ar = 'استشاري طب الأسرة وكبار السن', qualification_ar = 'الزمالة والبورد الأمريكي في طب الأسرة، الزمالة الأمريكية في طب كبار السن', updated_at = now() where slug = 'dr-asim-alshanberi';
-- Dr. Assad Almotowa | د. اسعد المطوع | 5637480593
update doctors set title_ar = 'استشاري جراحة العظام', qualification_ar = 'الزمالة البريطانية في جراحة العظام والعمود الفقري الزمالة الأمريكية في الإصابات والكسور', updated_at = now() where slug = 'dr-assad-almotowa';
-- Assoc. Prof. Mohammed Alsofiani | بروفيسور مشارك. محمد السفياني | 5637494830
update doctors set title_ar = 'استشاري سكري وغدد صماء', qualification_ar = 'بروفيسور مشارك بجامعة الملك سعود وجامعة جونز هوبكنز الأمريكية الزمالة الأمريكية في الغدد الصماء والسكري من جونز هوبكنز الأمريكية', updated_at = now() where slug = 'dr-assoc-prof-mohammed-alsofiani';
-- Dr. Ayedh Alghamdi | د. عايض الغامدي | 5637467201
update doctors set title_ar = 'استشاري الطب والعلاج النفسي', qualification_ar = 'الزمالة الكندية في الطب النفسي الجسدي', updated_at = now() where slug = 'dr-ayedh-alghamdi';
-- Dr. Ayman Awlia | د. ايمن اوليا | 5637363576
update doctors set title_ar = 'استشاري جراحة العظام والطرف العلوي وجراحة الركبة والمناظير', qualification_ar = 'البورد الكندي في جراحة العظام الزمالة الكندية في جراحة الطرف العلوي الزمالة الكندية في جراحة الركبة', updated_at = now() where slug = 'dr-ayman-awlia';
-- Dr. Aziz Albalawi | د. عزيز البلوي | 5637287826
update doctors set title_ar = 'استشاري طب وجراحة العيون وجراحة الشبكية والجسم الزجاجي', qualification_ar = 'البورد السعودي في طب وجراحة العيون، زمالة الملك خالد في طب العيون وأمراض وجراحة الشبكية والجسم الزجاجي', updated_at = now() where slug = 'dr-aziz-albalawi';
-- Dr. Bader Almehmadi | د. بدر المحمادي | 5637467149
update doctors set title_ar = 'أستاذ مساعد واستشاري أمراض الروماتيزم', qualification_ar = 'الزمالة الكندية في التهاب المفصل الروماتويدي و التصلب المجموعي', updated_at = now() where slug = 'dr-bader-almehmadi';
-- Dr. Badria Alnouh | د. بدرية النوح | 5637467157
update doctors set title_ar = 'استشاري نساء وولادة وجراحة المناظير النسائية والتجميل النسائي', qualification_ar = 'البورد السعودي والعربي في طب النساء و والولادة الزمالة الأسترالية في جراحة المناظير النسائية المتقدمة والتجميل النسائي', updated_at = now() where slug = 'dr-badria-alnouh';
-- Dr. Bandar Hetaimish | د. بندر حتيمش | 5637163331
update doctors set title_ar = 'استشاري جراحة العظام والمفاصل تخصص الطب الرياضي مناظير المفاصل وجراحة المفاصل الصناعية للأطراف السفلية', qualification_ar = 'البورد الكندي في جراحة العظام', updated_at = now() where slug = 'dr-bandar-hetaimish';
-- Dr. Bashair Ali | د. بشائر ابراهيم | 5637518098
update doctors set title_ar = 'أخصائي أول - حساسية ومناعة الأطفال', qualification_ar = 'زمالة في حساسية ومناعة الأطفال', updated_at = now() where slug = 'dr-bashair-ibrahim';
-- Basma AlGhamdi | بسمة الغامدي | 5637367327
update doctors set title_ar = 'ف', qualification_ar = 'ف', updated_at = now() where slug = 'dr-basma-alghamdi1';
-- Dr. Bushra Assery | د. بشرى عسيري | 5637507576
update doctors set title_ar = 'أستاذ مساعد واستشاري طب الأطفال', qualification_ar = 'البورد السعودي في طب الأطفال', updated_at = now() where slug = 'dr-bushra-assery';
-- Dr. Dekra Bazarah | د. ذكرى بازرعة | 5637271326
update doctors set title_ar = 'استشاري طب الأسرة ومدربة رضاعة طبيعية', qualification_ar = 'البورد العربي والسعودي في طب الأسرة الدبلوم الأمريكي في طب نمط الحياة', updated_at = now() where slug = 'dr-dekra-bazarah';
-- Dr. Dena Khawandanah | د. دينا خوندنه | 5637200076
update doctors set title_ar = 'استشاري الغدد الصماء والسكري', qualification_ar = 'البورد الأمريكي في أمراض الغدد الصماء والسكري البورد الأمريكي في الطب الباطني البورد الأمريكي في طب', updated_at = now() where slug = 'dr-dena-khawandanah';
-- Dr. Ekram Elshahidy | د. اكرام الشهيدي | 5637419836
update doctors set title_ar = 'أخصائي أول طب الأطفال', qualification_ar = 'البورد المصري في طب الأطفال ماجستير في طب الأطفال', updated_at = now() where slug = 'dr-ekram-elshahidy';
-- Dr. Eman Kasim | د. ايمان قاسم | 5637334468
update doctors set title_ar = 'استشاري طب النساء والولادة والتجميل النسائي', qualification_ar = 'البورد السعودي في طب النساء والولادة البورد الأمريكي في جراحات التجميل النسائية', updated_at = now() where slug = 'dr-eman-kasim';
-- Dr. Eman Mahmoud | د. ايمان محمود | 5637407828
update doctors set title_ar = 'أخصائي السمع والتوازن', qualification_ar = 'ماجستير في طب أمراض السمع والتوازن', updated_at = now() where slug = 'dr-eman-mahmoud';
-- Dr. Eman Obaid | د. ايمان عبيد | 5637145327
update doctors set title_ar = 'أخصائي السمع والتوازن', qualification_ar = 'البورد الأمريكي في السمعيات لعلاج طنين الأذن ماجستير في طب أمراض السمع والتوازن معتمدة في تشخيص وعلاج أمراض الدوار والتوازن - المعهد الأمريكي للتوازن - أمريكا', updated_at = now() where slug = 'dr-eman-obaid';
-- Dr. Enad Alsolami | د. عناد السلمي | 5637320083
update doctors set title_ar = 'استشاري أمراض وزراعة الكلى', qualification_ar = 'البورد الكندي والأمريكي في الطب الباطني وأمراض الكلى، الزمالة الكندية في زراعة الكلى', updated_at = now() where slug = 'dr-enad-alsolami';
-- Dr. Enas Hamama | د. ايناس حمامة | 5637387605
update doctors set title_ar = 'أخصائي أول - طب الأسرة', qualification_ar = 'الزمالة المصرية في طب الأسرة', updated_at = now() where slug = 'dr-enas-hamama';
-- Dr. Essam Alghamdi | د. عصام الغامدي | 5637365077
update doctors set title_ar = 'استشاري طب الأسرة', qualification_ar = 'البورد العربي في طب الأسرة', updated_at = now() where slug = 'dr-essam-alghmadi';
-- Dr. Eyad Faizo | د. اياد فيزو | 5637483721
update doctors set title_ar = 'استشاري جراحة المخ والأعصاب والعمود الفقري', qualification_ar = 'البورد الألماني في جراحة المخ والأعصاب والعمود الفقري الزمالة الألمانية في جراحة المخ والأعصاب الوظيفية', updated_at = now() where slug = 'dr-eyad-faizo';
-- Dr. Faeg Sawaf | د. فايق صواف | 5637321585
update doctors set title_ar = 'استشاري طب العظام', qualification_ar = 'الزمالة الكندية في جراحة الطب الرياضي و في جراحة المفاصل، الزمالة الاسترالية في المناظير والاندماج العظمي وترميم الجزء السفلي', updated_at = now() where slug = 'dr-faeg-sawaf';
-- Dr. Fahad Alruwaily | د. فهد الرويلي | 5637458940
update doctors set title_ar = 'استشاري طب وجراحة العيون وجراحة الشبكية والسائل الزجاجي', qualification_ar = 'البورد الألماني في طب وجراحة العيون الزمالة الألمانية في طب وجراحة الشبكية والسائل الزجاجي', updated_at = now() where slug = 'dr-fahad-alruwaily';
-- Dr. Fahad Bamehriz | د. فهد بامحرز | 5637494826
update doctors set title_ar = 'استشاري جراحة مناظير متقدمة وجهاز آلي وسمنة', qualification_ar = 'الزمالة الكندية في جراحة المناظير والجهاز الآلي والسمنة', updated_at = now() where slug = 'dr-fahad-bamehriz';
-- Dr. Faisla Almuhizi | د. فيصل المهيزع | 5637488082
update doctors set title_ar = 'استشاري الحساسية والربو والمناعة', qualification_ar = 'الزمالة الكندية في حساسية الدواء الزمالة السعودية في الحساسية والربو والمناعة البورد السعودي في الطب الباطني', updated_at = now() where slug = 'dr-faisal-almuhizi';
-- Dr. Fajr Alsaeedi | فجر الصعيدي | 5637524083
update doctors set title_ar = 'استشاري طب الأطفال', qualification_ar = 'البورد السعودي لطب الأطفال', updated_at = now() where slug = 'dr-fajr-alsaeedi';
-- Dr. Faris Alhejaili | د. فارس الحجيلي | 5637323829
update doctors set title_ar = 'استشاري الأمراض الصدرية', qualification_ar = 'البورد الكندي في أمراض الجهاز التنفسي واضطرابات النوم', updated_at = now() where slug = 'dr-faris-alhejaili';
-- Dr. Faris Althubaiti | د. فارس الثبيتي | 5637416078
update doctors set title_ar = 'استشاري المخ والأعصاب للأطفال', qualification_ar = 'البورد الفرنسي في طب الأطفال الزمالة الفرنسية الدقيقة في مخ وأعصاب الأطفال', updated_at = now() where slug = 'dr-faris-althubaiti';
-- Dr. Fatimah Albrekkan | د. فاطمة البريكان | 5637467153
update doctors set title_ar = 'استشاري الطب النفسي للبالغين والعلاج النفسي الديناميكي', qualification_ar = 'البورد الأمريكي في الطب النفسي', updated_at = now() where slug = 'dr-fatimah-albrekkan';
-- Dr. Fatma Salem | د. فاطمة سالم | 5637350076
update doctors set title_ar = 'استشاري الجهاز الهضمي والكبد والمناظير', qualification_ar = 'الزمالة السعودية في أمراض الجهاز الهضمي والكبد والمناظير البورد السعودي في الطب الباطني', updated_at = now() where slug = 'dr-fatma-salem';
-- Dr. Fawaz Alhumaid | د. فواز الحميد | 5637154330
update doctors set title_ar = 'استشاري المخ والأعصاب', qualification_ar = 'البورد الكندي في طب المخ والأعصاب، الزمالة الكندية في الفيزيولوجيا العصبية (تخطيط المخ والأعصاب والعضلات)', updated_at = now() where slug = 'dr-fawaz-alhumaid';
-- Dr. Fayez Felemban | د. فايز فلمبان | 5637511343
update doctors set title_ar = 'استشاري جراحة العظام تخصص الركبة و الورك و استبدال المفاصل', qualification_ar = 'البورد الكندي في جراحة العظام', updated_at = now() where slug = 'dr-fayez-felemban';
-- Dr. Ghufran Abudawood | د. غفران ابو داوود | 5637524850
update doctors set title_ar = 'أخصائي أول طب وجراحة العيون الجلوكوما والمياه البيضاء', qualification_ar = 'البورد السعودي في طب العيون، زمالة مدينة الأمير سلطان الطبية العسكرية في جراحات الجلوكوما والمياه البيضاء', updated_at = now() where slug = 'dr-ghufran-abudawood';
-- Dr. Hadeel Tours | د. هديل تورس | 5637163335
update doctors set title_ar = 'أخصائي علم النفس للكبار ومعالج زواج وأسرة', qualification_ar = 'ماجستير في علم النفس الأسري والزواجي', updated_at = now() where slug = 'dr-hadeel-tours';
-- Dr. Haifa Alfalah | د. هيفاء الفلاح | 5637522577
update doctors set title_ar = 'استشاري أمراض وجراحة الجلد والليزر', qualification_ar = 'الزمالة الأمريكية في الليزر وجراحة الجلد و البورد السعودي في الأمراض الجلدية و البورد العربي في الأمراض الجلدية', updated_at = now() where slug = 'dr-haifa-alfalah';
-- Dr. Hamid Madani | د. حامد مدني | 5637147576
update doctors set title_ar = 'استشاري أمراض الروماتيزم', qualification_ar = 'الزمالة الكندية في أمراض الروماتيزم البورد الأمريكي في أمراض الروماتيزم', updated_at = now() where slug = 'dr-hamid-madani';
-- Dr. Hammam Alghamdi | د. همام الغامدي | 5637498576
update doctors set title_ar = 'إستشاري طب الأسرة', qualification_ar = 'البورد السعودي في طب الأسرة', updated_at = now() where slug = 'dr-hammam-alghamdi';
-- Dr. Hamza Alofi | د. حمزة العوفي | 5637330577
update doctors set title_ar = 'استشاري جراحة العظام وإصابات الحوادث', qualification_ar = 'البورد الألماني في طب وجراحة العظام وإصابات الحوادث، الزمالة الألمانية في ترميم العظام والمفاصل، شهادة جراحة القدم والكاحل من الجمعية العمومية', updated_at = now() where slug = 'dr-hamza-alofi';
-- Dr. Hanaa Rajab | د. هناء رجب | 5637156576
update doctors set title_ar = 'استشاري الطب الباطني', qualification_ar = 'البورد السعودي في الطب الباطني', updated_at = now() where slug = 'dr-hanaa-rajab';
-- Dr. Haneen Imam | د. حنين امام | 5637333801
update doctors set title_ar = 'أخصائي نفسي إكلينيكي', qualification_ar = 'ماجستير علم النفس الإكلينيكي والمرضي بريطانيا', updated_at = now() where slug = 'dr-haneen-imam';
-- Dr. Hani Aslan | د. هاني اصلان | 5637398080
update doctors set title_ar = 'أخصائي طب وجراحة العيون', qualification_ar = 'ماجستير في طب وجراحة العيون', updated_at = now() where slug = 'dr-hani-aslan';
-- Dr. Hani Shalabi | د. هاني شلبي | 5637348577
update doctors set title_ar = 'استشاري الغدد الصماء والسكري والسمنة', qualification_ar = 'البورد والزمالة الأمريكية في الغدد الصماء والسكري والأيض', updated_at = now() where slug = 'dr-hani-shalabi';
-- Dr. Hanin Abduljabar | د. حنين عبدالجبار | 5637289326
update doctors set title_ar = 'استشاري طب النساء والولادة والغدد الإنجابية وتأخر الحمل والعقم', updated_at = now() where slug = 'dr-hanin-abduljabar';
-- Dr. Harbi Shawosh | د. حربي شاووش | 5637347078
update doctors set title_ar = 'استشاري طب الأطفال', qualification_ar = 'البورد العربي في طب الأطفال', updated_at = now() where slug = 'dr-harbi-shawosh';
-- Dr. Hashim Ballubaid | د. هاشم بالبيد | 5637483683
update doctors set title_ar = 'استشاري طب كبار السن', qualification_ar = 'البورد السعودي في طب الباطنة الزمالة الكندية في طب أمراض كبار السن', updated_at = now() where slug = 'dr-hashim-balubaid';
-- Dr. Hasnaa Ali | د. حسناء علي | 5637500076
update doctors set title_ar = 'أخصائي طب الأطفال', qualification_ar = 'ماجستير في طب الأطفال', updated_at = now() where slug = 'dr-hasnaa-ali';
-- Dr. Hassan Jaber | د. حسن جابر | 5637368076
update doctors set title_ar = 'استشاري جراحة المخ والأعصاب', qualification_ar = 'دكتوراه في جراحة المخ والأعصاب من ألمانيا', updated_at = now() where slug = 'dr-hassan-jaber';
-- Dr. Hatim Batawi | د. حاتم بتاوي | 5637509078
update doctors set title_ar = 'استشاري طب وجراحة العيون وأمراض وجراحة الشبكية والماء الأبيض', qualification_ar = 'البورد الكندي في طب وجراحة العيون الزمالة الكندية في أمراض و جراحة الشبكية', updated_at = now() where slug = 'dr-hatim-batawi';
-- Dr. Haziz Albiladi | د. حظيظ البلادي | 5637398827
update doctors set title_ar = 'استشاري الجهاز الهضمي والكبد والمناظير', qualification_ar = 'البورد العربي في الطب الباطني الزمالة السعودية في الجهاز الهضمي', updated_at = now() where slug = 'dr-haziz-albiladi';
-- Dr. Hind Alnajashi | د. هند النجاشي | 5637434828
update doctors set title_ar = 'استشاري مخ وأعصاب والتصلب العصبي المتعدد', qualification_ar = 'البورد السعودي في طب الأعصاب الزمالة الكندية في التصلب المتعدد والأمراض المناعية', updated_at = now() where slug = 'dr-hind-alnajashi';
-- Dr. Hind Alshanbari | د. هند الشنبري | 5637418342
update doctors set title_ar = 'استشاري طب الأطفال والأمراض المعدية', qualification_ar = 'البورد السعودي في طب الأطفال الزمالة السعودية في الأمراض المعدية للأطفال', updated_at = now() where slug = 'dr-hind-alshanbari';
-- Dr. Hisham Nasief | د. هشام نصيف | 5637528576
update doctors set title_ar = 'استشاري طب الأم والجنين (النساء والتوليد)', updated_at = now() where slug = 'dr-hisham-nasief';
-- Dr. Hossam Alamoodi | د. حسام العمودي | 5637174577
update doctors set title_ar = 'استشاري الأنف والأذن والحنجرة وأمراض التوازن', qualification_ar = 'البورد الكندي والزمالة الكندية في جراحة الأذن الوسطى وعصب السمع وأمراض التوازن', updated_at = now() where slug = 'dr-hossam-alamoodi';
-- Dr. Hossam Mousa | د. حسام موسى | 5637145331
update doctors set title_ar = 'استشاري طب الأسرة', qualification_ar = 'البورد العربي في طب الأسرة', updated_at = now() where slug = 'dr-hossam-mousa';
-- Dr. Husam Alim | د. حسام عالم | 5637367326
update doctors set title_ar = 'استشاري الغدد الصماء والسكري والسمنة ورعاية كبار السن', qualification_ar = 'البورد الأمريكي في أمراض الغدد الصماء والسكري الزمالة الأمريكية في طب كبار السن', updated_at = now() where slug = 'dr-husam-alim';
-- Dr. Husam Malibary | د. حسام مليباري | 5637414586
update doctors set title_ar = 'استشاري أمراض الحساسية والمناعة', qualification_ar = 'البورد الكندي في الطب الباطني الزمالة الكندية في أمراض الحساسية المناعة', updated_at = now() where slug = 'dr-husam-malibary';
-- Dr. Ibrahim Alfawaz | د. ابراهيم الفواز | 5637467200
update doctors set title_ar = 'استشاري مشارك طب الأسرة', qualification_ar = 'البورد السعودي في طب الأسرة', updated_at = now() where slug = 'dr-ibrahim-alfawaz';
-- Dr. Ibrahim Alharbi | د. ابراهيم الحربي | 5637434827
update doctors set title_ar = 'استشاري أمراض دم وأورام أطفال', qualification_ar = 'البورد الكندي في الأطفال وأمراض الدم والأورام لدى الأطفال', updated_at = now() where slug = 'dr-ibrahim-alharbi';
-- Dr. Ibrahim Alnouri | د. ابراهيم النوري | 5637221077
update doctors set title_ar = 'استشاري جراحة الأنف والأذن والحنجرة والرأس والعنق', qualification_ar = 'البورد الأوروبي والزمالة في طب وجراحة الأنف والأذن والحنجرة والرأس والعنق للأطفال', updated_at = now() where slug = 'dr-ibrahim-alnoury';
-- Dr. Islam Abouelmagd | د. اسلام ابو المجد | 5637386860
update doctors set title_ar = 'أخصائي أول طب الأسرة وطب الأطفال', qualification_ar = 'دكتوراه في طب الأسرة ماجستير في طب الأطفال', updated_at = now() where slug = 'dr-islam-abouelmagd';
-- Dr. Jamil Waly | د. جميل ولي | 5637145328
update doctors set title_ar = 'استشاري طب الأطفال و أمراض الحساسية و المناعة', qualification_ar = 'البورد الأمريكي في طب الأطفال، الزمالة الكندية في أمراض الحساسية و المناعة', updated_at = now() where slug = 'dr-jamil-waly';
-- Dr. Khadijah Alattas | د. خديجة العطاس | 5637147579
update doctors set title_ar = 'استشاري طب وجراحة العيون', qualification_ar = 'الزمالة الكندية في الشبكية', updated_at = now() where slug = 'dr-khadijah-alattas';
-- Dr. Khaled Yaghmour | د. خالد يغمور | 5637323828
update doctors set title_ar = 'استشاري طب الأسرة', qualification_ar = 'البورد العربي والسعودي في طب الأسرة', updated_at = now() where slug = 'dr-khaled-yaghmour';
-- Dr. Khalid Alfares | د. خالد الفارس | 5637444743
update doctors set title_ar = 'استشاري الطب الباطني والغدد الصماء والسكري', qualification_ar = 'البورد الأمريكي في الطب الباطني الزمالة الأمريكية في الغدد الصماء والسكري', updated_at = now() where slug = 'dr-khalid-alfares';
-- Dr. Khalid Alhussaini | د. خالد الحصيني | 5637487326
update doctors set title_ar = 'استشاري الجهاز الهضمي والكبد والمناظير', qualification_ar = 'البورد السعودي في طب الباطنة الزمالة السعودية في الجهاز الهضمي وأمراض الكبد الزمالة الأوروبية والبريطانية في الجهاز الهضمي وأمراض الكبد', updated_at = now() where slug = 'dr-khalid-alhussaini';
-- Dr. Khalid Almatham | د. خالد المعثم | 5637492579
update doctors set title_ar = 'استشاري أمراض الكلى', qualification_ar = 'الزمالة الكندية في أمراض الكلى والالتهابات الكبيرة', updated_at = now() where slug = 'dr-khalid-almatham';
-- Dr. Khalid Alsahhar | د. خالد السحار | 5637431826
update doctors set title_ar = 'أخصائي جراحة العظام', qualification_ar = 'شهادة تخصص في جراحة العظام', updated_at = now() where slug = 'dr-khalid-alsahhar';
-- Dr. Khalid Bin Naji | د. خالد بن ناجي | 5637483770
update doctors set title_ar = 'استشاري أمراض القلب وتصوير القلب المتقدم', qualification_ar = 'الزمالة الكندية في تصوير القلب المتقدم', updated_at = now() where slug = 'dr-khalid-bin-naji';
-- Dr. Khulood Alaidaroos | د. خلود العيدروس | 5637383829
update doctors set title_ar = 'أخصائي طب الأطفال', qualification_ar = 'بكالوريوس في الطب والجراحة', updated_at = now() where slug = 'dr-khulood-alaidaroos';
-- Dr. Lila Aissawi | د. ليلى عيسوي | 5637260077
update doctors set title_ar = 'أخصائي طب النساء والولادة', qualification_ar = 'دبلوم التجميل النسائي دبلوم في طب النساء والولادة', updated_at = now() where slug = 'dr-laila-aissawi';
-- Dr. Laila Alghamri | د. ليلى الغمري | 5637435626
update doctors set title_ar = 'استشاري طب الأسرة', qualification_ar = 'البورد العربي والسعودي في طب الأسرة', updated_at = now() where slug = 'dr-laila-alghamri';
-- Dr. Laila Salamah | د. ليلى سلامة | 5637473826
update doctors set title_ar = 'أخصائي نطق وتخاطب وبلع', qualification_ar = 'ماجستير العلوم في اضطرابات النطق واللغة مرخصة من برامج فييس وبرومت وهانن لاضطرابات النطق والتخاطب والبلع', updated_at = now() where slug = 'dr-laila-salamah';
-- Dr. Lama Ghandoura | د. لمى غندوره | 5637437096
update doctors set title_ar = 'أخصائي أول - طب الأسرة', qualification_ar = 'البورد السعودي في طب الأسرة', updated_at = now() where slug = 'dr-lama-ghandoura';
-- Dr. Lojain Almadfaa | د. لجين المدفع | 5637529326
update doctors set title_ar = 'طب الأطفال', qualification_ar = 'البورد السعودي في طب الاطفال، مستشفى الحرس الوطني، جدة', updated_at = now() where slug = 'dr-lojain-almadfaa';
-- Dr. Lolwah Alashgar | د. لولوة الاشقر | 5637460329
update doctors set title_ar = 'استشاري الغدد الصماء والسكري', qualification_ar = 'الزمالة السعودية في الغدد الصماء والسكري', updated_at = now() where slug = 'dr-lolwah-alashgar';
-- Dr. Lowloh Alotaibi | د. لولوه العتيبي | 5637518826
update doctors set title_ar = 'الطب الباطني', qualification_ar = 'استشاري طب باطني / إدارة مرض السكري', updated_at = now() where slug = 'dr-lowloh-alotaibi';
-- Dr. Lujain Idriss | د. لجين ادريس | 5637377828
update doctors set title_ar = 'استشاري طب وجراحة القرنية والماء الأبيض وجراحات تصحيح النظر والتهابات القزحية', qualification_ar = 'البورد السعودي في طب وجراحة العيون زمالة مستشفى الملك خالد التخصصي في جراحة القرنية والماء الأبيض وج', updated_at = now() where slug = 'dr-lujain-idriss';
-- Dr. Maan Abuzaid | د. معن ابو زيد | 5637506169
update doctors set title_ar = 'استشاري طب الأطفال وحديثي الولادة', qualification_ar = 'البورد السعودي في طب الاطفال الزمالة السعودية في طب الأطفال حديثي الولادة', updated_at = now() where slug = 'dr-maan-abuzaid';
-- Dr. Mahmoud Alageeli | د. محمود العقيلي | 5637433331
update doctors set title_ar = 'استشاري جراحة الأنف والأذن والحنجرة، والرأس والعنق', qualification_ar = 'الزمالة الكندية في الأنف و أذن و حنجرة و جراحة الرأس و الرقبة', updated_at = now() where slug = 'dr-mahmoud-alageeli';
-- Dr. Majed Albarrak | د. ماجد البراك | 5637469333
update doctors set title_ar = 'استشاري جراحة الأنف والأذن والحنجرة والغدد النكافية والدرقيةوالرأس والرقبةوتجميل وترميم الوجه والأنف', qualification_ar = 'البورد الكندي في طب الأنف والأذن والحنجرة وجراحات الرأس والرقبة للكبار والأطفال البورد الكندي في جراحة أورام الرأس والرقبة', updated_at = now() where slug = 'dr-majed-albarrak';
-- Dr. Majed Alnabulsi | د. ماجد النابلسي | 5637333578
update doctors set title_ar = 'استشاري الطب باطني', qualification_ar = 'البورد الأمريكي في الطب الباطني، البورد الأمريكي لطب نمط الحياة', updated_at = now() where slug = 'dr-majed-alnabulsi';
-- Dr. Majed Sejiny | د. ماجد سجيني | 5637314826
update doctors set title_ar = 'استشاري جراحة المسالك البولية والمناظير', qualification_ar = 'البورد الفرنسي والأوروبي في جراحة المسالك البولية، الزمالة الفرنسية في جراحات المناظير', updated_at = now() where slug = 'dr-majed-sejiny';
-- Dr. Mamdouh Masri | د. ممدوح مصري | 5637506092
update doctors set title_ar = 'استشاري جراحة العظام والمناظير والمفاصل الصناعية والطب الرياضي', qualification_ar = 'الزمالة الكندية في جراحة العظام والأطراف العلوية والطب الرياضي وجراحة المفاصل الصناعية', updated_at = now() where slug = 'dr-mamdouh-masri';
-- Dr. Mana Alshahrani | د. مانع الشهراني | 5637505327
update doctors set title_ar = 'استشاري طب الأسرة وطب النوم', qualification_ar = 'زمالة جامعة الملك سعود لطب النوم زمالة الجمعية الأوروبية لطب النوم', updated_at = now() where slug = 'dr-mana-alshahrani';
-- Dr. Mansoor Radwi | د. منصور رضوي | 5637432576
update doctors set title_ar = 'استشاري أمراض الدم للبالغين', qualification_ar = 'البورد الأمريكي والكندي في الطب الباطني وأمراض الدم للبالغين الزمالة الكندية في النزيف واضطرابات الت', updated_at = now() where slug = 'dr-mansoor-radwi';
-- Dr. Maram Alshareef | د. مرام الشريف | 5637249576
update doctors set title_ar = 'استشاري طب الأسرة والآلام المزمنة', qualification_ar = 'البورد العربي والسعودي في طب الأسرة، البورد الكندي في علاج الألم المزمن', updated_at = now() where slug = 'dr-maram-alshareef';
-- Dr. Marwa Alsaggaf | د. مروة السقاف | 5637277329
update doctors set title_ar = 'طبيبة في قسم صحة المرأة', qualification_ar = 'بكالوريوس في الطب والجراحة', updated_at = now() where slug = 'dr-marwa-alsaggaf';
-- Dr. Marwan Elkassas | د. مروان القصاص | 5637403326
update doctors set title_ar = 'أخصائي أول - طب الأطفال', qualification_ar = 'البورد العربي والمصري في طب الأطفال', updated_at = now() where slug = 'dr-marwan-elkassas';
-- Dr. Marwan Flimban | د. مروان فلمبان | 5637526334
update doctors set title_ar = 'طب الأطفال', qualification_ar = 'بورد السعودي للاطفال العام مستشفى الملك فيصل التخصصي', updated_at = now() where slug = 'dr-marwan-flimban';
-- Dr. Maryam Alyarimi | د. مريم اليريمي | 5637344833
update doctors set title_ar = 'أخصائي الغدد الصماء', qualification_ar = 'البورد السعودي في الطب الباطني', updated_at = now() where slug = 'dr-maryam-alyarimi';
-- Dr. Maryam Bamashmous | د. مريم بامشموس | 5637241326
update doctors set title_ar = 'أخصائي السمع والتوازن', qualification_ar = 'بكالوريوس في الطب والجراحة ماجستير في طب السمع والاتزان - إسبانيا', updated_at = now() where slug = 'dr-maryam-bamashmous';
-- Dr. Maryam Dabbour | د. مريم دبور | 5637467158
update doctors set title_ar = 'استشاري طب الأطفال والأمراض الصدرية والتليف الكيسي وزراعة الرئة للأطفال', qualification_ar = 'البورد السعودي في طب الأطفال الزمالة السعودية في الأمراض الصدرية للأطفال الزمالة الكندية في طب الأطفال للتليف الكيسي وزراعة الرئة', updated_at = now() where slug = 'dr-maryam-dabbour';
-- Dr. Maysoon Algain | د. ميسون القين | 5637231576
update doctors set title_ar = 'استشاري الأمراض الجلدية والليزر والتجميل', qualification_ar = 'البورد الفرنسي في الجلدية الزمالة الأمريكية في جراحة سرطانات الجلد، الزمالة الكندية في التجميل', updated_at = now() where slug = 'dr-maysoon-algain';
-- Dr. Mazin Merdad | د. مازن مرداد | 5637168576
update doctors set title_ar = 'استشاري جراحة الأنف والأذن والحنجرة والرأس والعنق', qualification_ar = 'الزمالة الأمريكية في جراحة أورام الرأس والرقبة', updated_at = now() where slug = 'dr-mazin-merdad';
-- Dr. Menal Dogan | د. منال دوغان | 5637527835
update doctors set title_ar = 'طب الأطفال', qualification_ar = 'البورد السعودي .مستشفى الحرس الوطني', updated_at = now() where slug = 'dr-menal-dogan';
-- Dr. Mirfat Moqbel | د. ميرفت مقبل | 5637333576
update doctors set title_ar = 'أخصائي أول - تجميل وإصلاح الأسنان', qualification_ar = 'البورد السعودي في إصلاح الأسنان', updated_at = now() where slug = 'dr-mirfat-moqbel';
-- Dr. Mohamed Abbas | د. محمد عباس | 5637145326
update doctors set title_ar = 'أخصائي جراحة العامة', qualification_ar = 'ماجستير الجراحة العامة، بكالوريوس في الطب والجراحة', updated_at = now() where slug = 'dr-mohamed-abbass';
-- Dr. Mohamed Abu Elhasan | د. محمد ابو الحسن | 5637247330
update doctors set title_ar = 'أخصائي الغدد الصماء', qualification_ar = 'بكالوريوس في الطب والجراحة', updated_at = now() where slug = 'dr-mohamed-abu-elhasan';
-- Dr. Mohamed Alfawaz | د. محمد الفواز | 5637193327
update doctors set title_ar = 'استشاري الجهاز الهضمي والكبد', qualification_ar = 'الزمالة الكندية والأمريكية في طب الباطنة والجهاز الهضمي والكبد', updated_at = now() where slug = 'dr-mohamed-alfawaz';
-- Dr. Mohamed Elrefaei | د. محمد الرفاعي | 5637365601
update doctors set title_ar = 'أخصائي أول - طب وجراحة العيون', qualification_ar = 'الزمالة المصرية في طب وجراحة العيون ماجستير في طب وجراحة العيون - مصر', updated_at = now() where slug = 'dr-mohamed-elrefaei';
-- Dr. Mohamed Elsherief | د. محمد الشريف | 5637414587
update doctors set title_ar = 'أخصائي الأنف والأذن والحنجرة', qualification_ar = 'ماجستير في طب وجراحة الأنف والأذن والحنجرة', updated_at = now() where slug = 'dr-mohamed-elsherief';
-- Dr. Mohamed Jamjoom | د. محمد جمجوم | 5637228622
update doctors set title_ar = 'استشاري جراحة العظام واستبدال المفاصل الصناعية', qualification_ar = 'الزمالة الكندية في جراحة العظام', updated_at = now() where slug = 'dr-mohamed-jamjoom';
-- Dr. Mohamed Sabry | د. محمد صبري | 5637525577
update doctors set title_ar = 'أخصائي الأنف والأذن والحنجرة', qualification_ar = 'حاصل على درجة الماجستير في طب الأنف والأذن والحنجرة من مصر', updated_at = now() where slug = 'dr-mohamed-sabry';
-- Dr. Mohamed Zahran | د. محمد زهران | 5637146076
update doctors set title_ar = 'استشاري الأنف والأذن والحنجرة', qualification_ar = 'زمالة الكلية الملكية الإيرلندية للأنف والأذن والحنجرة', updated_at = now() where slug = 'dr-mohamed-zahran';
-- Dr. Mohamed Zahrani | د. محمد زهراني | 5637200079
update doctors set title_ar = 'استشاري أمراض القلب', qualification_ar = 'البورد الكندي والأمريكي في الباطنة وأمراض القلب، الزمالة الكندية في أشعة وصمامات القلب', updated_at = now() where slug = 'dr-mohamed-zahrani';
-- Dr. Mohammad Alsahan | د. محمد الصحن | 5637458920
update doctors set title_ar = 'استشاري جراحة العظام والإصابات الرياضية واستبدال المفاصل', qualification_ar = 'البورد الكندي في جراحة العظام الزمالة الكندية في الإصابات الرياضية و استبدال المفاصل', updated_at = now() where slug = 'dr-mohammad-alsahan';
-- Dr. Mohammad Munshi | د. محمد منشي | 5637492589
update doctors set title_ar = 'استشاري الجلدية والتجميل', qualification_ar = 'البورد السويسري والأوروبي في الأمراض الجلدية والتناسلية، الزمالة السويسرية في الأمراض الجلدية الاكلينيكة', updated_at = now() where slug = 'dr-mohammad-munshi';
-- Dr. Mohammed Abdelkader | د. محمد عبدالقادر | 5637398826
update doctors set title_ar = 'أخصائي جراحة العظام', qualification_ar = 'ماجستير في جراحة العظام - القاهرة', updated_at = now() where slug = 'dr-mohammed-abdelkader';
-- Dr. Mohammed Aldulaym | د. محمد الدليم | 5637483702
update doctors set title_ar = 'استشاري-أول طب وجراحة عيون الأطفال والحول', qualification_ar = 'البورد السعودي في طب عيون الأطفال زمالة مستشفى الملك خالد التخصصي للعيون في طب عيون الأطفال والحول', updated_at = now() where slug = 'dr-mohammed-aldulaym';
-- Dr. Mohammed Aljaffer | د. محمد الجعفر | 5637479828
update doctors set title_ar = 'استشاري طب نفسي جسدي وعصبي', qualification_ar = 'الزمالة الكندية في الطب النفسي العصبي والطب النفسي الجنائي', updated_at = now() where slug = 'dr-mohammed-aljaffer';
-- Dr. Mohammed Aljunaid | د. محمد الجنيد | 5637379338
update doctors set title_ar = 'استشاري طب الأسرة', qualification_ar = 'البورد السعودي في طب الأسرة', updated_at = now() where slug = 'dr-mohammed-aljunaid';
-- Dr. Mohammed Alotaibi | د. محمد العتيبي | 5637524844
update doctors set title_ar = 'استشاري طب وجراحة عظام الأطفال', qualification_ar = 'البورد الكندي في جراحة العظام و زمالة الكلية الملكية الكندية لجراحة العظام و الزمالة الكندية في طب وجراحة عظام الأطفال و الزمالة الكندية في طب وجراحة عظام الأطفال وتطويل الأطراف - جامعة ميقيل', updated_at = now() where slug = 'dr-mohammed-alotaibi';
-- Dr. Mohammed Alsobki | د. محمد السبكي | 5637471576
update doctors set title_ar = 'أخصائي السمع والتوازن', qualification_ar = 'ماجستير في طب السمع والاتزان', updated_at = now() where slug = 'dr-mohammed-alsobki';
-- Dr. Mohammed Attiah | د. محمد عطية | 5637153577
update doctors set title_ar = 'استشاري جراحة العظام', qualification_ar = 'الزمالة الكندية في جراحة عظام وجنف الأطفال', updated_at = now() where slug = 'dr-mohammed-attiah';
-- Dr. Mohammed Ayoub | د. محمد ايوب | 5637506168
update doctors set title_ar = 'استشاري الجهاز الهضمي والكبد والتغذية للأطفال', qualification_ar = 'البورد الأمريكي و الكندي للأطفال العام البورد الكندي للجهاز الهضمي و الكبد و زراعة الكبد للأطفال', updated_at = now() where slug = 'dr-mohammed-ayoub';
-- Dr. Mohammed Kheyami | د. محمد خيمي | 5637512084
update doctors set title_ar = 'استشاري طب الأسرة', qualification_ar = 'البورد السعودي في طب الأسرة', updated_at = now() where slug = 'dr-mohammed-kheyami';
-- Dr. Mohammed Omar | د. محمد عمر | 5637193329
update doctors set title_ar = 'استشاري الطب الباطني والأمراض المعدية', qualification_ar = 'البورد الأمريكي في الطب الباطن، البورد الأمريكي في الأمراض المعدية', updated_at = now() where slug = 'dr-mohammed-omar';
-- Dr. Mohamed Torky | د. محمد تركي | 5637374826
update doctors set title_ar = 'استشاري جراحة الكلى والمسالك البولية والتناسلية', qualification_ar = 'دكتوراه في جراحة الكلى والمسالك البولية والتناسلية مصر', updated_at = now() where slug = 'dr-mohmed-torky';
-- Dr. Mohsen Baduqayl | د. محسن بادقيل | 5637257076
update doctors set title_ar = 'استشاري الطب الباطني والأمراض الصدرية', qualification_ar = 'البورد الأمريكي في أمراض الغدد الصماء والسكري البورد الأمريكي في الطب الباطني البورد الأمريكي في طب', updated_at = now() where slug = 'dr-mohsen-baduqayl';
-- Dr. Muath Alammar | د. معاذ العمار | 5637480598
update doctors set title_ar = 'استشاري وأستاذ مشارك في طب الأسرة والطب الوقائي', qualification_ar = 'البورد السعودي والعربي في طب الأسرة والزمالة الكندية في الطب الوقائي', updated_at = now() where slug = 'dr-muath-alammar';
-- Dr. Muhammad Mujammami | د. محمد مجممي | 5637506161
update doctors set title_ar = 'استشاري وبروفيسور مشارك في الغدد الصم والسكري والغدة الدرقية و أورام الغدد', qualification_ar = 'الزمالة الكندية في الغدد الصم والسكري والاستقلاب، الزمالة الكندية في أورام الغدد، شهادة التميز الأمريكية في أشعة الغدة الدرقية والرقبة', updated_at = now() where slug = 'dr-muhammad-mujammami';
-- Dr. Muhannad Safiyah | د. مهند صافيه | 5637427458
update doctors set title_ar = 'طبيب عام', qualification_ar = 'بكالريوس الطب و الجراحه العامه', updated_at = now() where slug = 'dr-muhannad-safiyah';
-- Dr. Mutaz Amer | د. معتز عامر | 5637319332
update doctors set title_ar = 'استشاري طب الأسرة', qualification_ar = 'البورد السعودي في طب الأسرة', updated_at = now() where slug = 'dr-mutaz-amer';
-- Dr. Muthar Alani | د. مضر العاني | 5637488088
update doctors set title_ar = 'استشاري مشارك طب وجراحة الأنف والأذن والحنجرة', qualification_ar = 'البورد العراقي في طب وجراحة الأنف والأذن والحنجرة', updated_at = now() where slug = 'dr-muthar-alani';
-- Dr. Nada Zaher | د. ندى زاهر | 5637514326
update doctors set title_ar = 'أخصائي أول - طب الأسرة', qualification_ar = 'البورد السعودي في طب الأسرة', updated_at = now() where slug = 'dr-nada-zaher';
-- Dr. Nashwa Aldardeir | د. نشوه الدردير | 5637425936
update doctors set title_ar = 'استشاري طب النساء والولادة والمسالك البولية النسائية وجراحة الحوض الترميمية', qualification_ar = 'البورد الألماني في طب النساء والولادة الزمالة الألمانية في المسالك البولية وجراحة الحوض الترميمية', updated_at = now() where slug = 'dr-nashwa-aldardeir';
-- Dr. Nasreen Ashour | د. نسرين عاشور | 5637418343
update doctors set title_ar = 'استشاري طب المخ والأعصاب للبالغين', qualification_ar = 'البورد السعودي في طب المخ و الأعصاب للبالغين البورد السعودي في الطب الباطني', updated_at = now() where slug = 'dr-nasreen-ashour';
-- Dr. Nasser Alenezi | د. ناصر العنزي | 5637467198
update doctors set title_ar = 'استشاري جراحة العظام والعمود الفقري لدى الكبار والأطفال', qualification_ar = 'البورد السعودي في جراحة العظام الزمالة الكندية في جراحة العظام والعمود الفقري', updated_at = now() where slug = 'dr-nasser-alenezi';
-- Dr. Nawaf Alfawzan | د. نواف الفوزان | 5637532327
update doctors set title_ar = 'استشاري مشارك طب الأسرة', qualification_ar = 'البورد السعودي في طب الأسرة', updated_at = now() where slug = 'dr-nawaf-alfawzan';
-- Dr. Nawal Assiri | د. نوال عسيري | 5637459578
update doctors set title_ar = 'استشاري طب النساء والولادة والتجميل النسائي', qualification_ar = 'البورد السعودي والعربي في طب النساء والولادة والتجميل النسائي', updated_at = now() where slug = 'dr-nawal-assiri';
-- Dr. Nesrain Alhamedi | د. نسرين الحامدي | 5637266078
update doctors set title_ar = 'استشاري طب الأسرة لصحة المرأة', qualification_ar = 'البورد العربي والسعودي في طب الأسرة، استشارية رضاعة طبيعية معتمدة', updated_at = now() where slug = 'dr-nesrain-alhamedi';
-- Dr. Noran Abuouf | د. نوران ابو عوف | 5637383828
update doctors set title_ar = 'استشاري طب الأطفال', qualification_ar = 'البورد السعودي في طب الأطفال ماجستير العلوم السريرية - تغذية إكلينيكية - بريطانيا', updated_at = now() where slug = 'dr-noran-abuouf';
-- Dr. Nouf Alzahrani | د. نوف الزهراني | 5637458104
update doctors set title_ar = 'اخصائي نفسي', qualification_ar = 'بكالوريوس في العلوم الاجتماعية تخصص علم النفس', updated_at = now() where slug = 'dr-nouf-alzahrani';
-- Dr. Nour Gazzaz | د. نور قزاز | 5637509077
update doctors set title_ar = 'استشاري الغدد الصماء والسكري للأطفال', qualification_ar = 'البورد الكندي في طب الأطفال الزمالة الكندية في الغدد الصماء والسكري للأطفال استشاري الغدد الصماء والسكري للأطفال', updated_at = now() where slug = 'dr-nour-gazzaz';
-- Dr. Nourhan Jastaniah | د. نورهان جستنيه | 5637529327
update doctors set title_ar = 'أخصائي أول أمراض الحساسية والمناعة اطفال', qualification_ar = 'البورد السعودي اطفال من مستشفى الملك فهد للقوات المسلحة والزمالة في امراض الحساسية والمناعة من مستشفى الملك فيصل التخصصي', updated_at = now() where slug = 'dr-nourhan-jastaniah';
-- Dr. Nouri Abbas | د. نوري عباس | 5637498589
update doctors set title_ar = 'أخصائي أول - طب الأطفال', qualification_ar = 'البورد السعودي في طب الأطفال', updated_at = now() where slug = 'dr-nouri-abbas';
-- Dr. Ola Sallam | د. علا سلام | 5637397381
update doctors set title_ar = 'أخصائي طب النساء والولادة', qualification_ar = 'ماجستير في طب النساء والولادة', updated_at = now() where slug = 'dr-ola-sallam';
-- Dr. Omar Albassam | د. عمر البسام | 5637464076
update doctors set title_ar = 'استشاري أمراض القلب وقسطرة القلب التداخلية والهيكلية', qualification_ar = 'البورد الكندي في أمراض الباطنة و القلب وقسطرة القلب التداخلية و الهيكلية البورد الأمريكي في أمراض الباطنة و القلب والأوعية و قسطرة القلب التداخلية', updated_at = now() where slug = 'dr-omar-albassam';
-- Dr. Omar Alrahbeeni | د. عمر الرهبيني | 5637489579
update doctors set title_ar = 'استشاري مشارك طب الأسرة', qualification_ar = 'البورد السعودي في طب الأسرة', updated_at = now() where slug = 'dr-omar-alrahbeeni';
-- Dr. Omar Ashour | د. عمر عاشور | 5637377826
update doctors set title_ar = 'استشاري أمراض الكلى وضغط الدم', qualification_ar = 'البورد السعودي في الطب الباطني والزمالة الكندية في أمراض الكلى للبالغين وضغط الدم والغسيل المنزلي والبيرتوني', updated_at = now() where slug = 'dr-omar-ashour';
-- Dr. Osama Bajouh | د. اسامة باجوه | 5637407826
update doctors set title_ar = 'استشاري طب النساء والولادة والعقم', qualification_ar = 'الزمالة الفرنسية في طب النساء والولادة والعقم وأطفال الأنابيب', updated_at = now() where slug = 'dr-osama-bajouh';
-- Dr. Osama Bawazeer | د. اسامة باوزير | 5637147585
update doctors set title_ar = 'استشاري جراحة الأطفال الخدج والمناظير', qualification_ar = 'الزمالة الكندية، الأمريكية والبريطانية في الجراحة', updated_at = now() where slug = 'dr-osama-bawazeer';
-- Prof. Abdulkareem Almomen | بروفيسور. عبدالكريم المؤمن | 5637491077
update doctors set title_ar = 'استشاري الطب الباطني وأمراض الدم', qualification_ar = 'البورد الأمريكي في الطب الباطني وأمراض الدم الزمالة الكندية في الطب الباطني البورد الدولي في علم السموم المعدنية - ألمانيا', updated_at = now() where slug = 'dr-prof-abdulkareem-almomen';
-- Prof. Abdullah Alshamrani | د. عبدالله الشمراني | 5637466364
update doctors set title_ar = 'استشاري طب الأطفال وطب الأمراض الصدرية وطب النوم للأطفال', qualification_ar = 'الزمالة البريطانية في طب الأطفال الزمالة الكندية في الأمراض الصدرية و طب النوم', updated_at = now() where slug = 'dr-prof-abdullah-al-shamrani';
-- Prof. Abdullah Alzahrani | بروفيسور. عبدالله الزهراني | 5637524076
update doctors set title_ar = 'علاج حالات داء السكري والسمنه', qualification_ar = 'البورد السعودي لطب الأسرة & البورد العربي لطب الأسرة', updated_at = now() where slug = 'dr-prof-abdullah-alzahrani';
-- Prof. Ahmed Alrumayyan | بروفيسور. احمد الرميان | 5637498583
update doctors set title_ar = 'استشاري طب المخ والأعصاب للأطفال', qualification_ar = 'البورد الأمريكي والكندي في طب الأطفال البورد الكندي في طب أعصاب الأطفال', updated_at = now() where slug = 'dr-prof-ahmed-al-rumayyan';
-- Prof. Ashraf Abosamra | بروفيسور. اشرف ابو سمره | 5637526335
update doctors set title_ar = 'استشاري المسالك البولية', qualification_ar = 'زمالة كلية الجراحة الملكية الكندية و ز مالة الجمعية العالمية لجراحة اورام المسالك البولية', updated_at = now() where slug = 'dr-prof-ashraf-abosamra';
-- Prof. Bassam Bin Abbas | بروفيسور. بسام بن عباس | 5637467151
update doctors set title_ar = 'أستاذ واستشاري طب الأطفال والغدد الصماء والسكري', qualification_ar = 'البورد الأمريكي في طب الأطفال من جامعة ييل والبورد الأمريكي في الغدد الصماء والسكري عند الأطفال من جامعة ستانفورد', updated_at = now() where slug = 'dr-prof-bassam-bin-abbas';
-- Prof. Fahad Albashiri | بروفيسور. فهد البشيري | 5637486576
update doctors set title_ar = 'استشاري طب المخ والأعصاب والصرع للأطفال', qualification_ar = 'الزمالة الكندية في أمراض الصرع للأطفال زمالة طب أعصاب الأطفال - مستشفى الملك فيصل التخصصي ومركز الأبحاث البورد السعودي في طب الأطفال', updated_at = now() where slug = 'dr-prof-fahad-albashiri';
-- Prof. Fawzi Aljassir | بروفيسور. فوزي الجاسر | 5637492581
update doctors set title_ar = 'استشاري جراحة العظام والمفاصل', qualification_ar = 'البورد الكندي في جراحة العظام الزمالة الكندية في جراحة إصابات الملاعب والجراحات الترميمية وجراحة المفاصل الصناعية وجراحة أورام العظام', updated_at = now() where slug = 'dr-prof-fawzi-aljassir';
-- Prof. Lina Raffa | د. لينا رفه | 5637230826
update doctors set title_ar = 'أستاذة واستشارية طب عيون الأطفال والحول لدى البالغين', qualification_ar = 'الزمالة الكندية والبورد السويدي في طب عيون الأطفال والحول للبالغين', updated_at = now() where slug = 'dr-prof-lina-raffa';
-- Prof. Mohammed Alnaami | بروفيسور. محمد النعمي | 5637470076
update doctors set title_ar = 'استشاري الجراحة العامة وجراحة المناظير المتقدمة والسمنة', qualification_ar = 'البورد الكندي في الجراحة العامة والزمالة الكندية في جراحة السمنة والاستقلاب', updated_at = now() where slug = 'dr-prof-mohammed-alnaami';
-- Prof. Rajab Alzahrani | بروفيسور. رجب الزهراني | 5637518827
update doctors set title_ar = 'استشاري أنف وأذن وحنجرة', qualification_ar = 'البورد السعودي بمرتبة الشرف، الزمالة الأوروبية، الزمالة الألمانية', updated_at = now() where slug = 'dr-prof-rajab-alzahrani';
-- Prof. Riyad Al Lehebi | بروفيسور. رياض اللهيبي | 5637466366
update doctors set title_ar = 'استشاري الأمراض الصدرية وطب النوم والربو', qualification_ar = 'البورد الأمريكي والكندي في الطب الباطني والأمراض التنفسية الزمالة الكندية في الربو وأمراض الجهاز التنفسي المتقدمة وطب النوم', updated_at = now() where slug = 'dr-prof-riyad-al-lehebi';
-- Prof. Sami Bahlas | بروفيسور. سامي بحلس | 5637527086
update doctors set title_ar = 'الروماتيزم والأمراض المناعية', qualification_ar = 'البورد الكندي في طب الباطنة والروماتيزم', updated_at = now() where slug = 'dr-prof-sami-bahlas';
-- Dr. Raed Altayeb | د. رائد الطيب | 5637431077
update doctors set title_ar = 'استشاري طب المخ واعصاب والأعصاب الطرفية والعضلات', qualification_ar = 'البورد الامريكي لطب المخ والأعصاب الزمالة الامريكية لطب الأعصاب الطرفية والعضلات والجهاز العصبي', updated_at = now() where slug = 'dr-raed-altayeb';
-- Rahaf Mukhymir | رهف مخيمر | 5637229369
update doctors set title_ar = 'أخصائي بصريات', qualification_ar = 'بكالوريوس في أخصائي البصريات', updated_at = now() where slug = 'dr-rahaf-mukhymir';
-- Dr. Rajiah Mourad | د. راجية مراد | 5637205328
update doctors set title_ar = 'استشاري طب وجراحة الأنف والأذن والحنجرة واضطرابات النوم', qualification_ar = 'البورد السعودي وزمالة البورد الأوروبي في جراحة الأنف والأذن والحنجرة وجراحات الشخير', updated_at = now() where slug = 'dr-rajiah-mourad';
-- Dr. Rania Harere | د. رانية حريري | 5637458113
update doctors set title_ar = 'استشاري طب الأسرة', qualification_ar = 'البورد السعودي في طب الأسرة', updated_at = now() where slug = 'dr-rania-harere';
-- Dr. Raniya Bamuzahim | د. رانية بامزاحم | 5637340326
update doctors set title_ar = 'طبيب عام', qualification_ar = 'طبيب عام', updated_at = now() where slug = 'dr-raniya-bamuzahim';
-- Dr. Rawan Alhazmi | د. روان الحازمي | 5637496326
update doctors set title_ar = 'استشاري طب النساء والولادة', qualification_ar = 'البورد السعودي في طب النساء والولادة', updated_at = now() where slug = 'dr-rawan-alhazmi';
-- Dr. Rayan Alsharief | د. ريان الشريف | 5637193328
update doctors set title_ar = 'استشاري طب وجراحة العيون', qualification_ar = 'البورد الكندي في طب وجراحة العيون، الزمالة الكندية في أمراض وجراحة الشبكية', updated_at = now() where slug = 'dr-rayan-alsharief';
-- Dr. Reem Alnazawi | د. ريم النزاوي | 5637259329
update doctors set title_ar = 'استشاري الغدد الصماء والسكري والسمنة', qualification_ar = 'البورد الأمريكي في أمراض الغدد الصماء والسكري، البورد الأمريكي في الطب الباطني', updated_at = now() where slug = 'dr-reem-alnazawi';
-- Dr. Renad Alshawbaki | د. رناد الشوبكي | 5637518099
update doctors set title_ar = 'استشاري الطب الباطني', qualification_ar = 'البورد السعودي في الطب الباطني', updated_at = now() where slug = 'dr-renad-alshawbaki';
-- Dr. Riham Orabi | د. ريهام عرابي | 5637398077
update doctors set title_ar = 'أخصائي طب الأطفال', qualification_ar = 'ماجستير في طب الأطفال - القاهرة عضو الكلية الملكية لطب الأطفال', updated_at = now() where slug = 'dr-riham-orabi';
-- Dr. Roaa Mahroos | د. رؤى محروس | 5637506160
update doctors set title_ar = 'استشاري الطب الباطني وأمراض الروماتيزم', qualification_ar = 'البورد السعودي في الطب الباطني الزمالة السعودية في أمراض الروماتيزم للكبار', updated_at = now() where slug = 'dr-roaa-mahroos';
-- Dr. Roba Jamalallail | د. ربى جمل الليل | 5637526330
update doctors set title_ar = 'جراحة عظام الأطفال', qualification_ar = 'البورد السعودي لجراحة العظام', updated_at = now() where slug = 'dr-roba-jamalallail';
-- Dr. Rowa Attar | د. رواء عطار | 5637440076
update doctors set title_ar = 'استشاري أمراض القلب وتصوير القلب للأمراض الهيكلية', qualification_ar = 'البورد الأمريكي في طب القلب والأوعية الدموية تخصص دقيق في تصوير القلب المتقدم', updated_at = now() where slug = 'dr-rowa-attar';
-- Dr. Saddiq Habiballah | د. صديق حبيب الله | 5637416827
update doctors set title_ar = 'استشاري طب الأطفال و أمراض الحساسية و المناعة', qualification_ar = 'البورد الأمريكي في طب الأطفال البورد الأمريكي في أمراض الحساسية و المناعة', updated_at = now() where slug = 'dr-saddiq-habiballah';
-- Dr. Saeed Alghamdi | د. سعيد الغامدي | 5637430677
update doctors set title_ar = 'استشاري أمراض القلب وتصوير القلب', qualification_ar = 'البورد الفرنسي في أمراض القلب الزمالة الفرنسية في تصوير القلب', updated_at = now() where slug = 'dr-saeed-alghamdi';
-- Dr. Saleh Alghamdi | د. صالح الغامدي | 5637314077
update doctors set title_ar = 'استشاري طب وجراحة الأنف والأذن والحنجرة، والرأس والرقبة، واضطرابات النوم والشخير', qualification_ar = 'البورد الأوروبي والسعودي في جراحات الأنف والأذن والحنجرة والرأس والعنق واضطرابات النوم', updated_at = now() where slug = 'dr-saleh-alghamdi';
-- Dr. Salem Bazaraah | د. سالم بازرعه | 5637288576
update doctors set title_ar = 'الزمالة الأمريكية والكندية في أمراض الجهاز الهضمي والمناظير العلاجية', qualification_ar = 'استشاري أمراض الجهاز الهضمي والكبد والمناظير العلاجية', updated_at = now() where slug = 'dr-salem-bazaraah';
-- Dr. Salma Alkhammash | د. سلمى الخماش | 5637348607
update doctors set title_ar = 'استشاري أمراض المناعة والحساسية', qualification_ar = 'الزمالة الكندية في أمراض المناعة والحساسية الزمالة البريطانية في أمراض المناعة', updated_at = now() where slug = 'dr-salma-alkhammash';
-- Dr. Salma Omran | د. سلمى عمران | 5637460330
update doctors set title_ar = 'التغذية العلاجية', qualification_ar = 'بكالوريوس في التغذية العلاجية', updated_at = now() where slug = 'dr-salma-omran';
-- Dr. Salman Alsaleh | د. سلمان الصالح | 5637491076
update doctors set title_ar = 'استشاري طب الباطنة وأمراض الروماتيزم', qualification_ar = 'البورد الأمريكي والكندي في أمراض الروماتيزم البورد الأمريكي والكندي في طب الباطنة', updated_at = now() where slug = 'dr-salman-alsaleh';
-- Samahah Mukhtar | سماحه مختار | 5637428077
update doctors set title_ar = 'أخصائي بصريات', qualification_ar = 'بكالوريوس في أخصائي البصريات', updated_at = now() where slug = 'dr-samahah-mukhtar';
-- Dr. Samaher Hashim | د. سماهر هاشم | 5637374827
update doctors set title_ar = 'استشاري الأمراض الصدرية والعناية المركزة', qualification_ar = 'الزمالة والبورد الأمريكي في الأمراض الباطنية الزمالة والبورد الأمريكي في الأمراض الصدرية الزمالة وال', updated_at = now() where slug = 'dr-samaher-hashim';
-- Dr. Sami Alobaidi | د. سامي العبيدي | 5637207576
update doctors set title_ar = 'استشاري أمراض وزراعة الكلى', qualification_ar = 'البورد الأمريكي في أمراض الطب الباطني و أمراض الكلى، الزمالة الأمريكية في زراعة الكلى', updated_at = now() where slug = 'dr-sami-alobaidi';
-- Dr. Saniah Awaidah | د. سنية عويضة | 5637240576
update doctors set title_ar = 'استشاري طب الأطفال والغدد الصماء والسكري', qualification_ar = 'البورد السعودي والعربي في طب الأطفال، الزمالة السعودية في الغدد الصماء للأطفال', updated_at = now() where slug = 'dr-saniah-awaidah';
-- Sara Aleid | ساره العيد | 5637465577
update doctors set title_ar = 'أخصائية تغذية', qualification_ar = 'بكالوريوس في الصحة وعلوم التأهيل', updated_at = now() where slug = 'dr-sara-aleid';
-- Dr. Sarah Aljoudi | د. ساره الجودي | 5637506094
update doctors set title_ar = 'استشاري الأمراض الجلدية والتجميل', qualification_ar = 'البورد السعودي والأوروبي والعربي في طب الأمراض الجلدية، الليزر والتجميل', updated_at = now() where slug = 'dr-sarah-aljoudi';
-- Dr. Sarah Badawod | د. ساره باداود | 5637484329
update doctors set title_ar = 'استشاري غدد صماء و سكري', qualification_ar = 'البورد الكندي في الطب الباطني الزمالة الكندية في الغدد الصماء والسكري', updated_at = now() where slug = 'dr-sarah-badawod';
-- Dr. Sarah Dahlan | د. ساره دحلان | 5637425114
update doctors set title_ar = 'استشاري الطب الباطني وأمراض الكلى وضغط الدم', qualification_ar = 'البورد الكندي والأمريكي في الطب الباطني البورد الكندي في أمراض الكلى الزمالة الكندية في التهاب كبيبا', updated_at = now() where slug = 'dr-sarah-dahlan';
-- Dr. Sarah Malaekah | د. ساره ملايكة | 5637512078
update doctors set title_ar = 'استشاري طب و روماتيزم الأطفال', qualification_ar = 'الزمالة الكندية في روماتيزم الأطفال', updated_at = now() where slug = 'dr-sarah-malaekah';
-- Dr. Saud Alzahrani | د. سعود الزهراني | 5637366728
update doctors set title_ar = 'استشاري الغدد الصماء والسكري', qualification_ar = 'البورد الأمريكي في الغدد الصماء والسكري', updated_at = now() where slug = 'dr-saud-alzahrani';
-- Dr. Saud Bahaidarah | د. سعود باحيدره | 5637355326
update doctors set title_ar = 'استشاري طب أمراض قلب الأطفال والقسطرة التداخلية', qualification_ar = 'زمالة مستشفى الملك فيصل التخصصي ومركز الأبحاث في طب أمراض قلب الأطفال البورد السعودي والعربي في طب', updated_at = now() where slug = 'dr-saud-bahaidarah';
-- Dr. Seraj Aboalnaja | د. سراج ابو النجا | 5637147582
update doctors set title_ar = 'استشاري أمراض القلب وقسطرة القلب التداخلية والهيكلية', qualification_ar = 'البورد الكندي في الطب الباطني البورد الأمريكي في أمراض القلب البورد الأمريكي في الطب الباطني وأمراض', updated_at = now() where slug = 'dr-seraj-aboalnaja';
-- Dr. Seraj Makkawi | د. سراج مكاوي | 5637428828
update doctors set title_ar = 'استشاري طب المخ و الاعصاب للكبار', qualification_ar = 'البورد الكندي والأمريكي في طب الأعصاب للكبار', updated_at = now() where slug = 'dr-seraj-makkawi';
-- Dr. Shahd Baarimah | د. شهد باعارمه | 5637527082
update doctors set title_ar = 'أخصائي أول طب أطفال', qualification_ar = 'البورد السعودي لطب الاطفال', updated_at = now() where slug = 'dr-shahd-baarimah';
-- Dr. Shaima Alshareef | د. شيماء الشريف | 5637444691
update doctors set title_ar = 'استشاري طب الأسرة', qualification_ar = 'بورد طب الأسرة', updated_at = now() where slug = 'dr-shaima-alshareef';
-- Dr. Sharifa Alshehri | د. شريفة الشهري | 5637355328
update doctors set title_ar = 'استشاري طب الأسرة والسكري', qualification_ar = 'البورد السعودي والعربي والأردني في طب الأسرة الزمالة السعودية في السكري', updated_at = now() where slug = 'dr-sharifa-alshehri';
-- Dr. Shatha Ali | د. شذا علي | 5637444576
update doctors set title_ar = 'أخصائي أول - الطب النفسي', qualification_ar = 'بكالوريوس في الطب والجراحة البورد السعودي في الطب النفسي', updated_at = now() where slug = 'dr-shatha-ali';
-- Dr. Shirin Alkhilafi | د. شيرين الخليفي | 5637191826
update doctors set title_ar = 'استشاري الأمراض الجلدية والتجميل', qualification_ar = 'البورد السعودي والبورد العربي في أمراض الجلدية والتجميل ماجستير في طب الجلدية لندن', updated_at = now() where slug = 'dr-shirin-alkhilafi';
-- Dr. Shorooq Banjar | د. شروق بنجر | 5637412331
update doctors set title_ar = 'استشاري أمراض المناعة والحساسية', qualification_ar = 'البورد الأمريكي والكندي في الطب الباطني الزمالة الأمريكية والكندية في المناعة والحساسية', updated_at = now() where slug = 'dr-shorooq-banjar';
-- Dr. Shoroug Ibrahim | د. شروق ابراهيم | 5637221080
update doctors set title_ar = 'استشاري طب الأسرة', qualification_ar = 'البورد السعودي والعربي في طب الأسرة', updated_at = now() where slug = 'dr-shoroug-ibrahim';
-- Dr. Soad Mandoura | د. سعاد مندورة | 5637158077
update doctors set title_ar = 'استشاري الأمراض الجلدية والتجميل', qualification_ar = 'البورد العربي والسعودي في طب الأمراض الجلدية وجراحة الجلد', updated_at = now() where slug = 'dr-soad-mandoura';
-- Dr. Souzan Alkafy | د. سوزان الكافي | 5637502326
update doctors set title_ar = 'استشاري طب النساء والولادة والعقم وأطفال الأنابيب', qualification_ar = 'الزمالة الكندية في أمراض النساء والولادة الزمالة الكندية في أمراض العقم وأطفال الأنابيب البورد الأمريكي في أمراض النساء والولادة', updated_at = now() where slug = 'dr-souzan-al-kafy';
-- Dr. Suhaib Khayat | د. صهيب خياط | 5637512080
update doctors set title_ar = 'استشاري أمراض النساء و الولادة', qualification_ar = 'الزمالة الكندية في طب المسالك البولية النسائية وجراحة ترميم الحوض', updated_at = now() where slug = 'dr-suhaib-khayat';
-- Dr. Suzan Alzaidi | د. سوزان الزايدي | 5637434077
update doctors set title_ar = 'استشاري جراحة الأنف والأذن والحنجرة، والرأس والعنق، والجراحات المجهرية للحبال الصوتية', qualification_ar = 'الزمالة الإيطالية في الجراحات المجهرية بالليزر للحبال الصوتية البورد السعودي والأوربي في جراحة الأنف', updated_at = now() where slug = 'dr-suzan-alzaidi';
-- Taghreed Altassan | تغريد الطاسان | 5637526337
update doctors set title_ar = 'أخصائية خدمة اجتماعية', qualification_ar = 'ماجستير في الخدمة الاجتماعية', updated_at = now() where slug = 'dr-taghreed-altassan';
-- Dr. Taha Habibullah | د. طه حبيب الله | 5637321586
update doctors set title_ar = 'استشاري الأمراض الجلدية والتجميل', qualification_ar = 'البورد الأوروبي والعربي والسعودي في طب الأمراض الجلدية', updated_at = now() where slug = 'dr-taha-habibullah';
-- Dr. Taha Samman | د. طه سمان | 5637262326
update doctors set title_ar = 'استشاري جراحة العظام تخصص إصابات الملاعب ومناظير المفاصل', qualification_ar = 'البورد السعودي والعربي في طب وجراحة العظام الزمالة الكندية في الطب الرياضي', updated_at = now() where slug = 'dr-taha-samman';
-- Dr. Talal Almaghamsi | د. طلال المغامسي | 5637509831
update doctors set title_ar = 'استشاري طب الأطفال وأمراض الرئة لدى الأطفال', qualification_ar = 'الزمالة الكندية للامراض الصدرية للاطفال', updated_at = now() where slug = 'dr-talal-almaghamsi';
-- Dr. Tayba Wahedi | د. طيبة واحدي | 5637524082
update doctors set title_ar = 'غدد صماء وسكري للكبار', qualification_ar = 'البورد السعودي (باطنية) مستشفى الملك عبدالعزيز الجامعي، جدة، الزمالة السعودية للغدد الصماء والسكري، مدينة الملك فهد الطبية، الرياض', updated_at = now() where slug = 'dr-tayba-wahedi';
-- Dr. Turki Alahmadi | د. تركي الاحمدي | 5637147584
update doctors set title_ar = 'استشاري الأمراض الصدرية للأطفال', qualification_ar = 'الزمالة الكندية في الجهاز التنفسي للأطفال', updated_at = now() where slug = 'dr-turki-alahmadi';
-- Dr. Wael Abdelkafy | د. وائل عبدالكافي | 5637372577
update doctors set title_ar = 'استشاري جراحة الأنف والأذن والحنجرة والرأس والرقبة', qualification_ar = 'دكتوراه - مصر - والزمالة الأمريكية في طب وجراحة الأنف والأذن والحنجرة الزمالة السويسرية في جراحة الأذن', updated_at = now() where slug = 'dr-wael-abdelkafy';
-- Dr. Wael Auwad | د. وائل عواد | 5637158084
update doctors set title_ar = 'استشاري أمراض النساء والمسالك البولية النسائية', qualification_ar = 'الزمالة البريطانية في طب النساء والولادة الزمالة البريطانية في جراحات التجميل النسائية الدكتوراه الب', updated_at = now() where slug = 'dr-wael-auwad';
-- Dr. Wael Mojeeb | د. وائل مجيب | 5637367329
update doctors set title_ar = 'استشاري جراحة العظام', qualification_ar = 'البورد الألماني في جراحة العظام و الحوادث الزمالة الألمانية في جراحة أورام العظام والعضلات', updated_at = now() where slug = 'dr-wael-mojeeb';
-- Dr. Wafa Alaslani | د. وفاء العصلاني | 5637512082
update doctors set title_ar = 'استشاري أمراض الرئة للأطفال', qualification_ar = 'الزمالة في امراض الرئة للأطفال', updated_at = now() where slug = 'dr-wafa-alaslani';
-- Dr. Wafa Alghamdi | د. وفاء الغامدي | 5637527083
update doctors set title_ar = 'الأمراض الجلدية', qualification_ar = 'البورد السعودي (جلدية) مستشفى الملك فهد للقوات المسلحة', updated_at = now() where slug = 'dr-wafa-alghamdi';
-- Dr. Wafa Almuqri | د. وفاء  المقري | 5637404828
update doctors set title_ar = 'طبيب عام', qualification_ar = 'بكالريوس الطب و الجراحة العامة', updated_at = now() where slug = 'dr-wafa-almuqri';
-- Dr. Wafa Maqbul | د. وفاء مقبول | 5637247328
update doctors set title_ar = 'استشاري الأنف والأذن والحنجرة', updated_at = now() where slug = 'dr-wafa-maqbul';
-- Dr. Wail Yar | د. وائل يار | 5637371076
update doctors set title_ar = 'استشاري طب النوم', qualification_ar = 'البورد الأمريكي في الطب الوقائي والصحة العامة الزمالة الأمريكية في اضطرابات النوم للبالغين والأطفال', updated_at = now() where slug = 'dr-wail-yar';
-- Dr. Walaa Aldabbagh | د. ولاء الدباغ | 5637243577
update doctors set title_ar = 'استشاري الطب الباطني وأمراض الروماتيزم', qualification_ar = 'البورد السعودي في طب الباطنة، الزمالة السعودية في أمراض الروماتيزم والمفاصل', updated_at = now() where slug = 'dr-walaa-aldabbagh';
-- Dr. Waleed Alghamdi | د. وليد الغامدي | 5637294576
update doctors set title_ar = 'استشاري الجهاز الهضمي وزراعة الكبد', qualification_ar = 'البورد الكندي والأمريكي في الطب الباطني والجهاز الهضمي، الزمالة الكندية في أمراض وزراعة الكبد', updated_at = now() where slug = 'dr-waleed-alghamdi';
-- Dr. Waleed Alhemayed | د. وليد الحميد | 5637523328
update doctors set title_ar = 'استشاري طب القلب والأشعة الصوتية للقلب', qualification_ar = 'البورد السعودي في طب الباطنة، البورد السعودي في أمراض القلب للكبار، الزمالة السعودية في الأشعة الصوتية والمناظير للقلب لدى الكبار', updated_at = now() where slug = 'dr-waleed-alhemayed';
-- Dr. Waleed Alhuzaim | د. وليد الحزيم | 5637526326
update doctors set title_ar = 'استشاري الجهاز الهضمي', qualification_ar = 'البورد الكندي في الطب الباطني البورد الأمريكي في الطب الباطني الزمالة الكندية في أمراض الجهاز الهضمي', updated_at = now() where slug = 'dr-waleed-alhuzaim';
-- Dr. Waleed Badoghaish | د. وليد بادغيش | 5637506264
update doctors set title_ar = 'استشاري الجهاز الهضمي والكبد والمناظير', qualification_ar = 'البورد والزمالة الأمريكية في الطب الباطني والجهاز الهضمي والكبد', updated_at = now() where slug = 'dr-waleed-badoghaish';
-- Dr. Waleed Eid | د. وليد عيد | 5637315577
update doctors set title_ar = 'أخصائي الأنف والأذن والحنجرة', qualification_ar = 'ماجستير في طب وجراحة الأنف والأذن والحنجرة', updated_at = now() where slug = 'dr-waleed-eid';
-- Dr. Waleed Khayyat | د. وليد خياط | 5637504577
update doctors set title_ar = 'أخصائي أول - طب وجراحة العيون', qualification_ar = 'البورد السعودي في طب وجراحة العيون', updated_at = now() where slug = 'dr-waleed-khayyat';
-- Dr. Waseem Tayeb | د. وسيم طيب | 5637445368
update doctors set title_ar = 'استشاري جراحة الكلى والمسالك البولية والتناسلية', qualification_ar = 'الزمالة الفرنسية في جراحة المناظير وأورام المسالك البولية البورد السعودي في جراحة المسالك البولية', updated_at = now() where slug = 'dr-waseem-tayeb';
-- Dr. Wedyan Aboznadah | د. وديان ابو زناده | 5637515078
update doctors set title_ar = 'استشاري الغدد الصماء', qualification_ar = 'البورد السعودي في الطب الباطني، البورد الكندي في الغدد الصماء والأيض، الزمالة الكندية في الغدد الصماء التناسلية والصحة الإنجابية', updated_at = now() where slug = 'dr-wedyan-aboznadah';
-- Dr. Yaser Bamashmos | د. ياسر بامشموس | 5637483664
update doctors set title_ar = 'استشاري طب الأطفال', qualification_ar = 'البورد السعودي في طب الأطفال', updated_at = now() where slug = 'dr-yaser-bamashmos';
-- Dr. Yasir Khayat | د. ياسر خياط | 5637308077
update doctors set title_ar = 'استشاري الجهاز الهضمي والكبد', qualification_ar = 'البورد الأمريكي والكندي في الطب الباطني الزمالة الكندية في الجهاز الهضمي الزمالة الأوروبية في المناظير المتقدمة', updated_at = now() where slug = 'dr-yasir-khayat';
-- Dr. Yosra Turkistani | د. يسرا تركستاني | 5637320086
update doctors set title_ar = 'استشاري أمراض القلب والطب الباطني', qualification_ar = 'البورد الكندي والأمريكي في الطب الباطني وأمراض القلب للبالغين الزمالة الكندية والبورد الأمريكي في أشعة القلب الصوتية', updated_at = now() where slug = 'dr-yosra-turkistani';
-- Dr. Yousuf Alqurashi | د. يوسف القرشي | 5637370326
update doctors set title_ar = 'استشاري جراحة الأنف والأذن والحنجرة وأورام الرأس والعنق', qualification_ar = 'الزمالة الكندية في جراحة أورام الرأس والعنق', updated_at = now() where slug = 'dr-yousuf-alqurashi';
-- Dr. Zaki Nawawi | د. زكي نواوي | 5637448328
update doctors set title_ar = 'استشاري جراحة العظام والمفاصل وتقويم الأطراف للأطفال والكبار', qualification_ar = 'دكتوراه في جراحة العظام والمفاصل وعظام الأطفال وتقويم الأطراف للأطفال والكبار - ألمانيا', updated_at = now() where slug = 'dr-zaki-nawawi';
-- Dr. Ziyad Mirza | د. زياد مرزا | 5637509076
update doctors set title_ar = 'استشاري الجهاز الهضمي، والكبد والتغذية لدى الأطفال', qualification_ar = 'البورد السعودي في طب الأطفال الزمالة السعودية في طب الجهاز الهضمي لدى الأطفال', updated_at = now() where slug = 'dr-ziyad-mirza';

-- Data fix: slug and name_en say Abdullah and the export says عبدالله, but
-- name_ar said عبدالرحمن (which is why the name match failed). Correct it.
update doctors set name_ar = 'د. عبدالله باحكيم', updated_at = now() where slug = 'dr-abdullah-bahakim';

-- Fail the deploy loudly if the roster drifted from the snapshot this was
-- generated against (renamed slug, deleted doctor), instead of a silent no-op.
do $$
declare
  expected_titles int := 288;
  expected_quals  int := 283;
  n int;
begin
  select count(*) into n
    from doctors d
    join (values
      ('dr-abdulaziz-alalwan', 'استشاري طب الأسرة وطب اليافعين'),
      ('dr-abdulaziz-alhumoud', 'أخصائي أول في الطب الباطني'),
      ('dr-abdulaziz-alhuwaymil', 'استشاري أشعة تشخيصية وعلاج الألم'),
      ('dr-abdulaziz-aljohani', 'استشاري طب وجراحة العيون'),
      ('dr-abdulaziz-alsubaie', 'استشاري الباطنة والأمراض المعدية'),
      ('dr-abdulhaq-suliman', 'طب الأسرة'),
      ('dr-abdulkareem-samman', 'استشاري طب الأطفال وقلب الأطفال'),
      ('dr-abdullah-abdullah', 'استشاري جراحة الأوعية الدموية والقسطرة'),
      ('dr-abdullah-alkutbi', 'استشاري طب الأعصاب'),
      ('dr-abdullah-almaghraby', 'استشاري طب الأطفال و الغدد الصماء للأطفال'),
      ('dr-abdullah-bahakim', 'استشاري الأنف والأذن والحنجرة ومناظير الجيوب الأنفية وقاع الجمجمة'),
      ('dr-abdullah-khafagy', 'استشاري طب الأسرة'),
      ('dr-abdulmajeed-alghamdi', 'استشاري جراحة الكلى والمسالك البولية'),
      ('dr-abdulrahman-alamoudi', 'استشاري الطب الباطني والغدد الصماء والسكري والسمنة'),
      ('dr-abdulrahman-albabtain', 'استشاري طب الأسرة'),
      ('dr-abdulrahman-bahhari', 'أخصائي علاج نفسي'),
      ('dr-abdulrahman-hawari', 'أخصائي أول - طب الأطفال'),
      ('dr-abdulrahman-qattan', 'استشاري الأنف والأذن والحنجرة و جراحة أورام الغدة الدرقية وجارات الدرقية'),
      ('dr-abdulrahman-watfah', 'أخصائي الأنف والأذن والحنجرة'),
      ('dr-abdulwahab-bawahab', 'استشاري الغدد الصماء والسكري'),
      ('dr-abeer-aljahdali', 'استشاري طب وجراحة العيون وأمراض الشبكية والالتهابات العنبية'),
      ('dr-abeer-saleh', 'استشاري طب الأسرة'),
      ('dr-abir-al-badrani', 'استشاري النساء والولادة وجراحة الأورام النسائية وجراحة المناظير والتجميل النسائي الجراحي والغير جراح'),
      ('dr-adhwaa-khudhary', 'استشاري طب النساء والولادة'),
      ('dr-adil-alsulami', 'استشاري الأمراض الصدرية'),
      ('dr-afnan-aboalwa', 'استشاري طب الأسرة والسكري'),
      ('dr-ahmad-almousa', 'استشاري أمراض وجراحة الجلد والليزر'),
      ('dr-ahmad-alshahrani', 'الطب الباطني'),
      ('dr-ahmad-bakhsh', 'استشاري طب الأطفال والأمراض الروماتيزمية'),
      ('dr-ahmad-imam', 'استشاري الغدد الصماء والسكري'),
      ('dr-ahmed-alsayed', 'استشاري الأنف والأذن والحنجرة و مناظير الجيوب الأنفية وقاع الجمجمة'),
      ('dr-ahmed-alshaer', 'أخصائي أول الغدد الصماء والسكري'),
      ('dr-ahmed-altoub', 'استشاري جراحة القدم والكاحل والقدم السكرية'),
      ('dr-ahmed-alwazzan', 'استشاري طب النساء والولادة وجراحة الأورام النسائية والمناظير'),
      ('dr-ahmed-baabdallah', 'استشاري الأمراض الجلدية والليزر والتجميل'),
      ('dr-ahmed-bamaga', 'استشاري طب أعصاب الأطفال و أمراض العضلات و الأعصاب الطرفية للكبار و الصغار'),
      ('dr-ahmed-basndwah', 'استشاري طب المخ والأعصاب وأمراض الباركنسون واعتلالات الحركة'),
      ('dr-ahmed-elguindy', 'استشاري جراحة العظام والركبة والإصابات الرياضية'),
      ('dr-ahmed-hashish', 'أخصائي الأنف والأذن والحنجرة'),
      ('dr-ahmed-mohamed', 'أخصائي أول - طب الأسرة'),
      ('dr-ahmed-sheikh', 'استشاري السكري والسمنة وطب الأسرة'),
      ('dr-ahmed-zmi', 'أخصائي أول - الأنف والأذن والحنجرة'),
      ('dr-akram-bukhari', 'المسالك البولية'),
      ('dr-alaa-alrehaily', 'استشاري الطب الباطني العام وأمراض تخثر الدم'),
      ('dr-albaraa-alqassimi', 'استشاري طب وجراحة القرنية والماء الأبيض وجراحات تصحيح النظر'),
      ('dr-ali-bassi', 'استشاري طب النساء والولادة وجراحة الأورام النسائية وجراحة المناظير'),
      ('dr-ali-bin-mahfooz', 'استشاري طب وجراحة المسالك البولية'),
      ('dr-almotasimbellah-rayes', 'استشاري طب النساء والولادة تخصص طب الأمومة والأجنة'),
      ('dr-amal-alandejani', 'أخصائي أول التغذية العلاجية'),
      ('dr-amer-khojah', 'استشاري طب الأطفال والحساسية والمناعة وروماتيزم الأطفال'),
      ('dr-amerah-bogari', 'أخصائية أولى تغذية علاجية'),
      ('dr-amira-eltawdy', 'استشاري الأمراض الجلدية والليزر والتجميل'),
      ('dr-amro-albaz', 'استشاري جراحة العظام والعمود الفقري'),
      ('dr-amro-hamdi', 'استشاري جراحة العظام'),
      ('dr-anan-khattab', 'أخصائي تقييم النطق واللغة'),
      ('dr-anmar-fatani', 'استشاري طب الأعصاب'),
      ('dr-aseel-alghanemi', 'استشاري طب الأسرة'),
      ('dr-ashraf-aljahdali', 'استشاري طب وجراحة العيون'),
      ('dr-ashraf-warsi', 'استشاري أمراض الدم للبالغين'),
      ('dr-asim-alshanberi', 'استشاري طب الأسرة وكبار السن'),
      ('dr-assad-almotowa', 'استشاري جراحة العظام'),
      ('dr-assoc-prof-mohammed-alsofiani', 'استشاري سكري وغدد صماء'),
      ('dr-ayedh-alghamdi', 'استشاري الطب والعلاج النفسي'),
      ('dr-ayman-awlia', 'استشاري جراحة العظام والطرف العلوي وجراحة الركبة والمناظير'),
      ('dr-aziz-albalawi', 'استشاري طب وجراحة العيون وجراحة الشبكية والجسم الزجاجي'),
      ('dr-bader-almehmadi', 'أستاذ مساعد واستشاري أمراض الروماتيزم'),
      ('dr-badria-alnouh', 'استشاري نساء وولادة وجراحة المناظير النسائية والتجميل النسائي'),
      ('dr-bandar-hetaimish', 'استشاري جراحة العظام والمفاصل تخصص الطب الرياضي مناظير المفاصل وجراحة المفاصل الصناعية للأطراف السفلية'),
      ('dr-bashair-ibrahim', 'أخصائي أول - حساسية ومناعة الأطفال'),
      ('dr-basma-alghamdi1', 'ف'),
      ('dr-bushra-assery', 'أستاذ مساعد واستشاري طب الأطفال'),
      ('dr-dekra-bazarah', 'استشاري طب الأسرة ومدربة رضاعة طبيعية'),
      ('dr-dena-khawandanah', 'استشاري الغدد الصماء والسكري'),
      ('dr-ekram-elshahidy', 'أخصائي أول طب الأطفال'),
      ('dr-eman-kasim', 'استشاري طب النساء والولادة والتجميل النسائي'),
      ('dr-eman-mahmoud', 'أخصائي السمع والتوازن'),
      ('dr-eman-obaid', 'أخصائي السمع والتوازن'),
      ('dr-enad-alsolami', 'استشاري أمراض وزراعة الكلى'),
      ('dr-enas-hamama', 'أخصائي أول - طب الأسرة'),
      ('dr-essam-alghmadi', 'استشاري طب الأسرة'),
      ('dr-eyad-faizo', 'استشاري جراحة المخ والأعصاب والعمود الفقري'),
      ('dr-faeg-sawaf', 'استشاري طب العظام'),
      ('dr-fahad-alruwaily', 'استشاري طب وجراحة العيون وجراحة الشبكية والسائل الزجاجي'),
      ('dr-fahad-bamehriz', 'استشاري جراحة مناظير متقدمة وجهاز آلي وسمنة'),
      ('dr-faisal-almuhizi', 'استشاري الحساسية والربو والمناعة'),
      ('dr-fajr-alsaeedi', 'استشاري طب الأطفال'),
      ('dr-faris-alhejaili', 'استشاري الأمراض الصدرية'),
      ('dr-faris-althubaiti', 'استشاري المخ والأعصاب للأطفال'),
      ('dr-fatimah-albrekkan', 'استشاري الطب النفسي للبالغين والعلاج النفسي الديناميكي'),
      ('dr-fatma-salem', 'استشاري الجهاز الهضمي والكبد والمناظير'),
      ('dr-fawaz-alhumaid', 'استشاري المخ والأعصاب'),
      ('dr-fayez-felemban', 'استشاري جراحة العظام تخصص الركبة و الورك و استبدال المفاصل'),
      ('dr-ghufran-abudawood', 'أخصائي أول طب وجراحة العيون الجلوكوما والمياه البيضاء'),
      ('dr-hadeel-tours', 'أخصائي علم النفس للكبار ومعالج زواج وأسرة'),
      ('dr-haifa-alfalah', 'استشاري أمراض وجراحة الجلد والليزر'),
      ('dr-hamid-madani', 'استشاري أمراض الروماتيزم'),
      ('dr-hammam-alghamdi', 'إستشاري طب الأسرة'),
      ('dr-hamza-alofi', 'استشاري جراحة العظام وإصابات الحوادث'),
      ('dr-hanaa-rajab', 'استشاري الطب الباطني'),
      ('dr-haneen-imam', 'أخصائي نفسي إكلينيكي'),
      ('dr-hani-aslan', 'أخصائي طب وجراحة العيون'),
      ('dr-hani-shalabi', 'استشاري الغدد الصماء والسكري والسمنة'),
      ('dr-hanin-abduljabar', 'استشاري طب النساء والولادة والغدد الإنجابية وتأخر الحمل والعقم'),
      ('dr-harbi-shawosh', 'استشاري طب الأطفال'),
      ('dr-hashim-balubaid', 'استشاري طب كبار السن'),
      ('dr-hasnaa-ali', 'أخصائي طب الأطفال'),
      ('dr-hassan-jaber', 'استشاري جراحة المخ والأعصاب'),
      ('dr-hatim-batawi', 'استشاري طب وجراحة العيون وأمراض وجراحة الشبكية والماء الأبيض'),
      ('dr-haziz-albiladi', 'استشاري الجهاز الهضمي والكبد والمناظير'),
      ('dr-hind-alnajashi', 'استشاري مخ وأعصاب والتصلب العصبي المتعدد'),
      ('dr-hind-alshanbari', 'استشاري طب الأطفال والأمراض المعدية'),
      ('dr-hisham-nasief', 'استشاري طب الأم والجنين (النساء والتوليد)'),
      ('dr-hossam-alamoodi', 'استشاري الأنف والأذن والحنجرة وأمراض التوازن'),
      ('dr-hossam-mousa', 'استشاري طب الأسرة'),
      ('dr-husam-alim', 'استشاري الغدد الصماء والسكري والسمنة ورعاية كبار السن'),
      ('dr-husam-malibary', 'استشاري أمراض الحساسية والمناعة'),
      ('dr-ibrahim-alfawaz', 'استشاري مشارك طب الأسرة'),
      ('dr-ibrahim-alharbi', 'استشاري أمراض دم وأورام أطفال'),
      ('dr-ibrahim-alnoury', 'استشاري جراحة الأنف والأذن والحنجرة والرأس والعنق'),
      ('dr-islam-abouelmagd', 'أخصائي أول طب الأسرة وطب الأطفال'),
      ('dr-jamil-waly', 'استشاري طب الأطفال و أمراض الحساسية و المناعة'),
      ('dr-khadijah-alattas', 'استشاري طب وجراحة العيون'),
      ('dr-khaled-yaghmour', 'استشاري طب الأسرة'),
      ('dr-khalid-alfares', 'استشاري الطب الباطني والغدد الصماء والسكري'),
      ('dr-khalid-alhussaini', 'استشاري الجهاز الهضمي والكبد والمناظير'),
      ('dr-khalid-almatham', 'استشاري أمراض الكلى'),
      ('dr-khalid-alsahhar', 'أخصائي جراحة العظام'),
      ('dr-khalid-bin-naji', 'استشاري أمراض القلب وتصوير القلب المتقدم'),
      ('dr-khulood-alaidaroos', 'أخصائي طب الأطفال'),
      ('dr-laila-aissawi', 'أخصائي طب النساء والولادة'),
      ('dr-laila-alghamri', 'استشاري طب الأسرة'),
      ('dr-laila-salamah', 'أخصائي نطق وتخاطب وبلع'),
      ('dr-lama-ghandoura', 'أخصائي أول - طب الأسرة'),
      ('dr-lojain-almadfaa', 'طب الأطفال'),
      ('dr-lolwah-alashgar', 'استشاري الغدد الصماء والسكري'),
      ('dr-lowloh-alotaibi', 'الطب الباطني'),
      ('dr-lujain-idriss', 'استشاري طب وجراحة القرنية والماء الأبيض وجراحات تصحيح النظر والتهابات القزحية'),
      ('dr-maan-abuzaid', 'استشاري طب الأطفال وحديثي الولادة'),
      ('dr-mahmoud-alageeli', 'استشاري جراحة الأنف والأذن والحنجرة، والرأس والعنق'),
      ('dr-majed-albarrak', 'استشاري جراحة الأنف والأذن والحنجرة والغدد النكافية والدرقيةوالرأس والرقبةوتجميل وترميم الوجه والأنف'),
      ('dr-majed-alnabulsi', 'استشاري الطب باطني'),
      ('dr-majed-sejiny', 'استشاري جراحة المسالك البولية والمناظير'),
      ('dr-mamdouh-masri', 'استشاري جراحة العظام والمناظير والمفاصل الصناعية والطب الرياضي'),
      ('dr-mana-alshahrani', 'استشاري طب الأسرة وطب النوم'),
      ('dr-mansoor-radwi', 'استشاري أمراض الدم للبالغين'),
      ('dr-maram-alshareef', 'استشاري طب الأسرة والآلام المزمنة'),
      ('dr-marwa-alsaggaf', 'طبيبة في قسم صحة المرأة'),
      ('dr-marwan-elkassas', 'أخصائي أول - طب الأطفال'),
      ('dr-marwan-flimban', 'طب الأطفال'),
      ('dr-maryam-alyarimi', 'أخصائي الغدد الصماء'),
      ('dr-maryam-bamashmous', 'أخصائي السمع والتوازن'),
      ('dr-maryam-dabbour', 'استشاري طب الأطفال والأمراض الصدرية والتليف الكيسي وزراعة الرئة للأطفال'),
      ('dr-maysoon-algain', 'استشاري الأمراض الجلدية والليزر والتجميل'),
      ('dr-mazin-merdad', 'استشاري جراحة الأنف والأذن والحنجرة والرأس والعنق'),
      ('dr-menal-dogan', 'طب الأطفال'),
      ('dr-mirfat-moqbel', 'أخصائي أول - تجميل وإصلاح الأسنان'),
      ('dr-mohamed-abbass', 'أخصائي جراحة العامة'),
      ('dr-mohamed-abu-elhasan', 'أخصائي الغدد الصماء'),
      ('dr-mohamed-alfawaz', 'استشاري الجهاز الهضمي والكبد'),
      ('dr-mohamed-elrefaei', 'أخصائي أول - طب وجراحة العيون'),
      ('dr-mohamed-elsherief', 'أخصائي الأنف والأذن والحنجرة'),
      ('dr-mohamed-jamjoom', 'استشاري جراحة العظام واستبدال المفاصل الصناعية'),
      ('dr-mohamed-sabry', 'أخصائي الأنف والأذن والحنجرة'),
      ('dr-mohamed-zahran', 'استشاري الأنف والأذن والحنجرة'),
      ('dr-mohamed-zahrani', 'استشاري أمراض القلب'),
      ('dr-mohammad-alsahan', 'استشاري جراحة العظام والإصابات الرياضية واستبدال المفاصل'),
      ('dr-mohammad-munshi', 'استشاري الجلدية والتجميل'),
      ('dr-mohammed-abdelkader', 'أخصائي جراحة العظام'),
      ('dr-mohammed-aldulaym', 'استشاري-أول طب وجراحة عيون الأطفال والحول'),
      ('dr-mohammed-aljaffer', 'استشاري طب نفسي جسدي وعصبي'),
      ('dr-mohammed-aljunaid', 'استشاري طب الأسرة'),
      ('dr-mohammed-alotaibi', 'استشاري طب وجراحة عظام الأطفال'),
      ('dr-mohammed-alsobki', 'أخصائي السمع والتوازن'),
      ('dr-mohammed-attiah', 'استشاري جراحة العظام'),
      ('dr-mohammed-ayoub', 'استشاري الجهاز الهضمي والكبد والتغذية للأطفال'),
      ('dr-mohammed-kheyami', 'استشاري طب الأسرة'),
      ('dr-mohammed-omar', 'استشاري الطب الباطني والأمراض المعدية'),
      ('dr-mohmed-torky', 'استشاري جراحة الكلى والمسالك البولية والتناسلية'),
      ('dr-mohsen-baduqayl', 'استشاري الطب الباطني والأمراض الصدرية'),
      ('dr-muath-alammar', 'استشاري وأستاذ مشارك في طب الأسرة والطب الوقائي'),
      ('dr-muhammad-mujammami', 'استشاري وبروفيسور مشارك في الغدد الصم والسكري والغدة الدرقية و أورام الغدد'),
      ('dr-muhannad-safiyah', 'طبيب عام'),
      ('dr-mutaz-amer', 'استشاري طب الأسرة'),
      ('dr-muthar-alani', 'استشاري مشارك طب وجراحة الأنف والأذن والحنجرة'),
      ('dr-nada-zaher', 'أخصائي أول - طب الأسرة'),
      ('dr-nashwa-aldardeir', 'استشاري طب النساء والولادة والمسالك البولية النسائية وجراحة الحوض الترميمية'),
      ('dr-nasreen-ashour', 'استشاري طب المخ والأعصاب للبالغين'),
      ('dr-nasser-alenezi', 'استشاري جراحة العظام والعمود الفقري لدى الكبار والأطفال'),
      ('dr-nawaf-alfawzan', 'استشاري مشارك طب الأسرة'),
      ('dr-nawal-assiri', 'استشاري طب النساء والولادة والتجميل النسائي'),
      ('dr-nesrain-alhamedi', 'استشاري طب الأسرة لصحة المرأة'),
      ('dr-noran-abuouf', 'استشاري طب الأطفال'),
      ('dr-nouf-alzahrani', 'اخصائي نفسي'),
      ('dr-nour-gazzaz', 'استشاري الغدد الصماء والسكري للأطفال'),
      ('dr-nourhan-jastaniah', 'أخصائي أول أمراض الحساسية والمناعة اطفال'),
      ('dr-nouri-abbas', 'أخصائي أول - طب الأطفال'),
      ('dr-ola-sallam', 'أخصائي طب النساء والولادة'),
      ('dr-omar-albassam', 'استشاري أمراض القلب وقسطرة القلب التداخلية والهيكلية'),
      ('dr-omar-alrahbeeni', 'استشاري مشارك طب الأسرة'),
      ('dr-omar-ashour', 'استشاري أمراض الكلى وضغط الدم'),
      ('dr-osama-bajouh', 'استشاري طب النساء والولادة والعقم'),
      ('dr-osama-bawazeer', 'استشاري جراحة الأطفال الخدج والمناظير'),
      ('dr-prof-abdulkareem-almomen', 'استشاري الطب الباطني وأمراض الدم'),
      ('dr-prof-abdullah-al-shamrani', 'استشاري طب الأطفال وطب الأمراض الصدرية وطب النوم للأطفال'),
      ('dr-prof-abdullah-alzahrani', 'علاج حالات داء السكري والسمنه'),
      ('dr-prof-ahmed-al-rumayyan', 'استشاري طب المخ والأعصاب للأطفال'),
      ('dr-prof-ashraf-abosamra', 'استشاري المسالك البولية'),
      ('dr-prof-bassam-bin-abbas', 'أستاذ واستشاري طب الأطفال والغدد الصماء والسكري'),
      ('dr-prof-fahad-albashiri', 'استشاري طب المخ والأعصاب والصرع للأطفال'),
      ('dr-prof-fawzi-aljassir', 'استشاري جراحة العظام والمفاصل'),
      ('dr-prof-lina-raffa', 'أستاذة واستشارية طب عيون الأطفال والحول لدى البالغين'),
      ('dr-prof-mohammed-alnaami', 'استشاري الجراحة العامة وجراحة المناظير المتقدمة والسمنة'),
      ('dr-prof-rajab-alzahrani', 'استشاري أنف وأذن وحنجرة'),
      ('dr-prof-riyad-al-lehebi', 'استشاري الأمراض الصدرية وطب النوم والربو'),
      ('dr-prof-sami-bahlas', 'الروماتيزم والأمراض المناعية'),
      ('dr-raed-altayeb', 'استشاري طب المخ واعصاب والأعصاب الطرفية والعضلات'),
      ('dr-rahaf-mukhymir', 'أخصائي بصريات'),
      ('dr-rajiah-mourad', 'استشاري طب وجراحة الأنف والأذن والحنجرة واضطرابات النوم'),
      ('dr-rania-harere', 'استشاري طب الأسرة'),
      ('dr-raniya-bamuzahim', 'طبيب عام'),
      ('dr-rawan-alhazmi', 'استشاري طب النساء والولادة'),
      ('dr-rayan-alsharief', 'استشاري طب وجراحة العيون'),
      ('dr-reem-alnazawi', 'استشاري الغدد الصماء والسكري والسمنة'),
      ('dr-renad-alshawbaki', 'استشاري الطب الباطني'),
      ('dr-riham-orabi', 'أخصائي طب الأطفال'),
      ('dr-roaa-mahroos', 'استشاري الطب الباطني وأمراض الروماتيزم'),
      ('dr-roba-jamalallail', 'جراحة عظام الأطفال'),
      ('dr-rowa-attar', 'استشاري أمراض القلب وتصوير القلب للأمراض الهيكلية'),
      ('dr-saddiq-habiballah', 'استشاري طب الأطفال و أمراض الحساسية و المناعة'),
      ('dr-saeed-alghamdi', 'استشاري أمراض القلب وتصوير القلب'),
      ('dr-saleh-alghamdi', 'استشاري طب وجراحة الأنف والأذن والحنجرة، والرأس والرقبة، واضطرابات النوم والشخير'),
      ('dr-salem-bazaraah', 'الزمالة الأمريكية والكندية في أمراض الجهاز الهضمي والمناظير العلاجية'),
      ('dr-salma-alkhammash', 'استشاري أمراض المناعة والحساسية'),
      ('dr-salma-omran', 'التغذية العلاجية'),
      ('dr-salman-alsaleh', 'استشاري طب الباطنة وأمراض الروماتيزم'),
      ('dr-samahah-mukhtar', 'أخصائي بصريات'),
      ('dr-samaher-hashim', 'استشاري الأمراض الصدرية والعناية المركزة'),
      ('dr-sami-alobaidi', 'استشاري أمراض وزراعة الكلى'),
      ('dr-saniah-awaidah', 'استشاري طب الأطفال والغدد الصماء والسكري'),
      ('dr-sara-aleid', 'أخصائية تغذية'),
      ('dr-sarah-aljoudi', 'استشاري الأمراض الجلدية والتجميل'),
      ('dr-sarah-badawod', 'استشاري غدد صماء و سكري'),
      ('dr-sarah-dahlan', 'استشاري الطب الباطني وأمراض الكلى وضغط الدم'),
      ('dr-sarah-malaekah', 'استشاري طب و روماتيزم الأطفال'),
      ('dr-saud-alzahrani', 'استشاري الغدد الصماء والسكري'),
      ('dr-saud-bahaidarah', 'استشاري طب أمراض قلب الأطفال والقسطرة التداخلية'),
      ('dr-seraj-aboalnaja', 'استشاري أمراض القلب وقسطرة القلب التداخلية والهيكلية'),
      ('dr-seraj-makkawi', 'استشاري طب المخ و الاعصاب للكبار'),
      ('dr-shahd-baarimah', 'أخصائي أول طب أطفال'),
      ('dr-shaima-alshareef', 'استشاري طب الأسرة'),
      ('dr-sharifa-alshehri', 'استشاري طب الأسرة والسكري'),
      ('dr-shatha-ali', 'أخصائي أول - الطب النفسي'),
      ('dr-shirin-alkhilafi', 'استشاري الأمراض الجلدية والتجميل'),
      ('dr-shorooq-banjar', 'استشاري أمراض المناعة والحساسية'),
      ('dr-shoroug-ibrahim', 'استشاري طب الأسرة'),
      ('dr-soad-mandoura', 'استشاري الأمراض الجلدية والتجميل'),
      ('dr-souzan-al-kafy', 'استشاري طب النساء والولادة والعقم وأطفال الأنابيب'),
      ('dr-suhaib-khayat', 'استشاري أمراض النساء و الولادة'),
      ('dr-suzan-alzaidi', 'استشاري جراحة الأنف والأذن والحنجرة، والرأس والعنق، والجراحات المجهرية للحبال الصوتية'),
      ('dr-taghreed-altassan', 'أخصائية خدمة اجتماعية'),
      ('dr-taha-habibullah', 'استشاري الأمراض الجلدية والتجميل'),
      ('dr-taha-samman', 'استشاري جراحة العظام تخصص إصابات الملاعب ومناظير المفاصل'),
      ('dr-talal-almaghamsi', 'استشاري طب الأطفال وأمراض الرئة لدى الأطفال'),
      ('dr-tayba-wahedi', 'غدد صماء وسكري للكبار'),
      ('dr-turki-alahmadi', 'استشاري الأمراض الصدرية للأطفال'),
      ('dr-wael-abdelkafy', 'استشاري جراحة الأنف والأذن والحنجرة والرأس والرقبة'),
      ('dr-wael-auwad', 'استشاري أمراض النساء والمسالك البولية النسائية'),
      ('dr-wael-mojeeb', 'استشاري جراحة العظام'),
      ('dr-wafa-alaslani', 'استشاري أمراض الرئة للأطفال'),
      ('dr-wafa-alghamdi', 'الأمراض الجلدية'),
      ('dr-wafa-almuqri', 'طبيب عام'),
      ('dr-wafa-maqbul', 'استشاري الأنف والأذن والحنجرة'),
      ('dr-wail-yar', 'استشاري طب النوم'),
      ('dr-walaa-aldabbagh', 'استشاري الطب الباطني وأمراض الروماتيزم'),
      ('dr-waleed-alghamdi', 'استشاري الجهاز الهضمي وزراعة الكبد'),
      ('dr-waleed-alhemayed', 'استشاري طب القلب والأشعة الصوتية للقلب'),
      ('dr-waleed-alhuzaim', 'استشاري الجهاز الهضمي'),
      ('dr-waleed-badoghaish', 'استشاري الجهاز الهضمي والكبد والمناظير'),
      ('dr-waleed-eid', 'أخصائي الأنف والأذن والحنجرة'),
      ('dr-waleed-khayyat', 'أخصائي أول - طب وجراحة العيون'),
      ('dr-waseem-tayeb', 'استشاري جراحة الكلى والمسالك البولية والتناسلية'),
      ('dr-wedyan-aboznadah', 'استشاري الغدد الصماء'),
      ('dr-yaser-bamashmos', 'استشاري طب الأطفال'),
      ('dr-yasir-khayat', 'استشاري الجهاز الهضمي والكبد'),
      ('dr-yosra-turkistani', 'استشاري أمراض القلب والطب الباطني'),
      ('dr-yousuf-alqurashi', 'استشاري جراحة الأنف والأذن والحنجرة وأورام الرأس والعنق'),
      ('dr-zaki-nawawi', 'استشاري جراحة العظام والمفاصل وتقويم الأطراف للأطفال والكبار'),
      ('dr-ziyad-mirza', 'استشاري الجهاز الهضمي، والكبد والتغذية لدى الأطفال')
    ) as v(slug, title_ar) on v.slug = d.slug
   where d.title_ar = v.title_ar;
  if n <> expected_titles then
    raise exception 'arabic-titles sync: expected % doctors with the new title_ar, found %', expected_titles, n;
  end if;

  select count(*) into n from doctors
   where coalesce(qualification_ar, '') <> ''
     and slug in (
       'dr-abdulaziz-alalwan',
       'dr-abdulaziz-alhumoud',
       'dr-abdulaziz-alhuwaymil',
       'dr-abdulaziz-aljohani',
       'dr-abdulaziz-alsubaie',
       'dr-abdulhaq-suliman',
       'dr-abdulkareem-samman',
       'dr-abdullah-abdullah',
       'dr-abdullah-alkutbi',
       'dr-abdullah-almaghraby',
       'dr-abdullah-bahakim',
       'dr-abdullah-khafagy',
       'dr-abdulmajeed-alghamdi',
       'dr-abdulrahman-alamoudi',
       'dr-abdulrahman-albabtain',
       'dr-abdulrahman-bahhari',
       'dr-abdulrahman-hawari',
       'dr-abdulrahman-watfah',
       'dr-abdulwahab-bawahab',
       'dr-abeer-aljahdali',
       'dr-abeer-saleh',
       'dr-abir-al-badrani',
       'dr-adhwaa-khudhary',
       'dr-adil-alsulami',
       'dr-afnan-aboalwa',
       'dr-ahmad-almousa',
       'dr-ahmad-alshahrani',
       'dr-ahmad-bakhsh',
       'dr-ahmad-imam',
       'dr-ahmed-alsayed',
       'dr-ahmed-alshaer',
       'dr-ahmed-altoub',
       'dr-ahmed-alwazzan',
       'dr-ahmed-baabdallah',
       'dr-ahmed-bamaga',
       'dr-ahmed-basndwah',
       'dr-ahmed-elguindy',
       'dr-ahmed-hashish',
       'dr-ahmed-mohamed',
       'dr-ahmed-sheikh',
       'dr-ahmed-zmi',
       'dr-akram-bukhari',
       'dr-alaa-alrehaily',
       'dr-albaraa-alqassimi',
       'dr-ali-bassi',
       'dr-ali-bin-mahfooz',
       'dr-almotasimbellah-rayes',
       'dr-amal-alandejani',
       'dr-amer-khojah',
       'dr-amira-eltawdy',
       'dr-amro-albaz',
       'dr-amro-hamdi',
       'dr-anan-khattab',
       'dr-anmar-fatani',
       'dr-aseel-alghanemi',
       'dr-ashraf-aljahdali',
       'dr-ashraf-warsi',
       'dr-asim-alshanberi',
       'dr-assad-almotowa',
       'dr-assoc-prof-mohammed-alsofiani',
       'dr-ayedh-alghamdi',
       'dr-ayman-awlia',
       'dr-aziz-albalawi',
       'dr-bader-almehmadi',
       'dr-badria-alnouh',
       'dr-bandar-hetaimish',
       'dr-bashair-ibrahim',
       'dr-basma-alghamdi1',
       'dr-bushra-assery',
       'dr-dekra-bazarah',
       'dr-dena-khawandanah',
       'dr-ekram-elshahidy',
       'dr-eman-kasim',
       'dr-eman-mahmoud',
       'dr-eman-obaid',
       'dr-enad-alsolami',
       'dr-enas-hamama',
       'dr-essam-alghmadi',
       'dr-eyad-faizo',
       'dr-faeg-sawaf',
       'dr-fahad-alruwaily',
       'dr-fahad-bamehriz',
       'dr-faisal-almuhizi',
       'dr-fajr-alsaeedi',
       'dr-faris-alhejaili',
       'dr-faris-althubaiti',
       'dr-fatimah-albrekkan',
       'dr-fatma-salem',
       'dr-fawaz-alhumaid',
       'dr-fayez-felemban',
       'dr-ghufran-abudawood',
       'dr-hadeel-tours',
       'dr-haifa-alfalah',
       'dr-hamid-madani',
       'dr-hammam-alghamdi',
       'dr-hamza-alofi',
       'dr-hanaa-rajab',
       'dr-haneen-imam',
       'dr-hani-aslan',
       'dr-hani-shalabi',
       'dr-harbi-shawosh',
       'dr-hashim-balubaid',
       'dr-hasnaa-ali',
       'dr-hassan-jaber',
       'dr-hatim-batawi',
       'dr-haziz-albiladi',
       'dr-hind-alnajashi',
       'dr-hind-alshanbari',
       'dr-hossam-alamoodi',
       'dr-hossam-mousa',
       'dr-husam-alim',
       'dr-husam-malibary',
       'dr-ibrahim-alfawaz',
       'dr-ibrahim-alharbi',
       'dr-ibrahim-alnoury',
       'dr-islam-abouelmagd',
       'dr-jamil-waly',
       'dr-khadijah-alattas',
       'dr-khaled-yaghmour',
       'dr-khalid-alfares',
       'dr-khalid-alhussaini',
       'dr-khalid-almatham',
       'dr-khalid-alsahhar',
       'dr-khalid-bin-naji',
       'dr-khulood-alaidaroos',
       'dr-laila-aissawi',
       'dr-laila-alghamri',
       'dr-laila-salamah',
       'dr-lama-ghandoura',
       'dr-lojain-almadfaa',
       'dr-lolwah-alashgar',
       'dr-lowloh-alotaibi',
       'dr-lujain-idriss',
       'dr-maan-abuzaid',
       'dr-mahmoud-alageeli',
       'dr-majed-albarrak',
       'dr-majed-alnabulsi',
       'dr-majed-sejiny',
       'dr-mamdouh-masri',
       'dr-mana-alshahrani',
       'dr-mansoor-radwi',
       'dr-maram-alshareef',
       'dr-marwa-alsaggaf',
       'dr-marwan-elkassas',
       'dr-marwan-flimban',
       'dr-maryam-alyarimi',
       'dr-maryam-bamashmous',
       'dr-maryam-dabbour',
       'dr-maysoon-algain',
       'dr-mazin-merdad',
       'dr-menal-dogan',
       'dr-mirfat-moqbel',
       'dr-mohamed-abbass',
       'dr-mohamed-abu-elhasan',
       'dr-mohamed-alfawaz',
       'dr-mohamed-elrefaei',
       'dr-mohamed-elsherief',
       'dr-mohamed-jamjoom',
       'dr-mohamed-sabry',
       'dr-mohamed-zahran',
       'dr-mohamed-zahrani',
       'dr-mohammad-alsahan',
       'dr-mohammad-munshi',
       'dr-mohammed-abdelkader',
       'dr-mohammed-aldulaym',
       'dr-mohammed-aljaffer',
       'dr-mohammed-aljunaid',
       'dr-mohammed-alotaibi',
       'dr-mohammed-alsobki',
       'dr-mohammed-attiah',
       'dr-mohammed-ayoub',
       'dr-mohammed-kheyami',
       'dr-mohammed-omar',
       'dr-mohmed-torky',
       'dr-mohsen-baduqayl',
       'dr-muath-alammar',
       'dr-muhammad-mujammami',
       'dr-muhannad-safiyah',
       'dr-mutaz-amer',
       'dr-muthar-alani',
       'dr-nada-zaher',
       'dr-nashwa-aldardeir',
       'dr-nasreen-ashour',
       'dr-nasser-alenezi',
       'dr-nawaf-alfawzan',
       'dr-nawal-assiri',
       'dr-nesrain-alhamedi',
       'dr-noran-abuouf',
       'dr-nouf-alzahrani',
       'dr-nour-gazzaz',
       'dr-nourhan-jastaniah',
       'dr-nouri-abbas',
       'dr-ola-sallam',
       'dr-omar-albassam',
       'dr-omar-alrahbeeni',
       'dr-omar-ashour',
       'dr-osama-bajouh',
       'dr-osama-bawazeer',
       'dr-prof-abdulkareem-almomen',
       'dr-prof-abdullah-al-shamrani',
       'dr-prof-abdullah-alzahrani',
       'dr-prof-ahmed-al-rumayyan',
       'dr-prof-ashraf-abosamra',
       'dr-prof-bassam-bin-abbas',
       'dr-prof-fahad-albashiri',
       'dr-prof-fawzi-aljassir',
       'dr-prof-lina-raffa',
       'dr-prof-mohammed-alnaami',
       'dr-prof-rajab-alzahrani',
       'dr-prof-riyad-al-lehebi',
       'dr-prof-sami-bahlas',
       'dr-raed-altayeb',
       'dr-rahaf-mukhymir',
       'dr-rajiah-mourad',
       'dr-rania-harere',
       'dr-raniya-bamuzahim',
       'dr-rawan-alhazmi',
       'dr-rayan-alsharief',
       'dr-reem-alnazawi',
       'dr-renad-alshawbaki',
       'dr-riham-orabi',
       'dr-roaa-mahroos',
       'dr-roba-jamalallail',
       'dr-rowa-attar',
       'dr-saddiq-habiballah',
       'dr-saeed-alghamdi',
       'dr-saleh-alghamdi',
       'dr-salem-bazaraah',
       'dr-salma-alkhammash',
       'dr-salma-omran',
       'dr-salman-alsaleh',
       'dr-samahah-mukhtar',
       'dr-samaher-hashim',
       'dr-sami-alobaidi',
       'dr-saniah-awaidah',
       'dr-sara-aleid',
       'dr-sarah-aljoudi',
       'dr-sarah-badawod',
       'dr-sarah-dahlan',
       'dr-sarah-malaekah',
       'dr-saud-alzahrani',
       'dr-saud-bahaidarah',
       'dr-seraj-aboalnaja',
       'dr-seraj-makkawi',
       'dr-shahd-baarimah',
       'dr-shaima-alshareef',
       'dr-sharifa-alshehri',
       'dr-shatha-ali',
       'dr-shirin-alkhilafi',
       'dr-shorooq-banjar',
       'dr-shoroug-ibrahim',
       'dr-soad-mandoura',
       'dr-souzan-al-kafy',
       'dr-suhaib-khayat',
       'dr-suzan-alzaidi',
       'dr-taghreed-altassan',
       'dr-taha-habibullah',
       'dr-taha-samman',
       'dr-talal-almaghamsi',
       'dr-tayba-wahedi',
       'dr-turki-alahmadi',
       'dr-wael-abdelkafy',
       'dr-wael-auwad',
       'dr-wael-mojeeb',
       'dr-wafa-alaslani',
       'dr-wafa-alghamdi',
       'dr-wafa-almuqri',
       'dr-wail-yar',
       'dr-walaa-aldabbagh',
       'dr-waleed-alghamdi',
       'dr-waleed-alhemayed',
       'dr-waleed-alhuzaim',
       'dr-waleed-badoghaish',
       'dr-waleed-eid',
       'dr-waleed-khayyat',
       'dr-waseem-tayeb',
       'dr-wedyan-aboznadah',
       'dr-yaser-bamashmos',
       'dr-yasir-khayat',
       'dr-yosra-turkistani',
       'dr-yousuf-alqurashi',
       'dr-zaki-nawawi',
       'dr-ziyad-mirza'
     );
  if n <> expected_quals then
    raise exception 'arabic-titles sync: expected % doctors with qualification_ar filled, found %', expected_quals, n;
  end if;
  select count(*) into n from doctors where slug = 'dr-abdullah-bahakim' and name_ar = 'د. عبدالله باحكيم';
  if n <> 1 then
    raise exception 'arabic-titles sync: dr-abdullah-bahakim name_ar fix did not land';
  end if;
end $$;

commit;

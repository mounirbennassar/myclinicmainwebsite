# Arabic doctor titles sync: match report (2026-09-02)

Source: `Online Visible Doctors Mobile App Report.xlsx` (Sheet1) vs the live roster snapshot `live-doctors.json` (394 active doctors).
Output: `scripts/vm-doctor-sync-2026-09-02-arabic-titles.sql`

## Counts

- Excel rows: 431; unique DoctorRecId: 326
- Matched to a live DB doctor: 316 (after dropping ambiguous claims)
- Unmatched Excel doctors: 9
- Ambiguous (no update emitted): 0
- Update statements emitted: 288
  - title_ar set to a new value: 288 (of which 6 overwrite an existing non-null title_ar; 282 fill a null)
  - qualification_ar filled (was null/empty): 283
  - matched but nothing to change (title identical, qualification already set): 28
- DB doctors with title_ar null before: 348; after this sync: 66
- DB doctors with qualification_ar null/empty before: 359; after: 76

Match tiers used: T1 exact: 305, T1-name_en exact: 1, T4 token-containment: 2, T5 fuzzy: 4, manual: 4

## Data-quality notes on the Excel

- Excel special characters found and removed from stored values: LEFT-TO-RIGHT MARK (U+200E), NO-BREAK SPACE (U+00A0, converted to a space), fatha/shadda tashkeel, one tatweel.
- One TitleAr used a backslash as a separator ("أمراض الرئة \ الصدرية"); slashes are normalised to " / ".
- Two DB name_ar values carry a shadda (dr-saddiq-habiballah "صدّيق", dr-waleed-alhemayed "الحميّد"); not touched by this sync, stripped only in the SQL comment lines.
- QualificationAr is single-line in the export (no newlines). Several credentials are separated by "، " or just by a double space; whitespace was collapsed, so those are stored as ONE line (matching the existing Arabic qualification rows in the DB, which also use "، " on one line).
- No DoctorRecId had differing TitleAr/QualificationAr/NameAr values across its branch rows.
- 5637435625 (د.أحمد باسندوة): stripped trailing doctor name from TitleAr: 'استشاري طب المخ والأعصاب وأمراض الباركنسون واعتلالات الحركة د.أحمد باسندوة' -> 'استشاري طب المخ والأعصاب وأمراض الباركنسون واعتلالات الحركة'

## Unmatched Excel doctors (no update emitted)

| DoctorRecId | NameAr | TitleAr | Company | why |
|---|---|---|---|---|
| 5637179076 | د. أم سلمى كمال | اخصائي طب اطفال | NC01 | none (best fuzzy 0.727: د. ام سلمى احمد) -- Closest DB row is dr-omsalamah-ahmed (د. ام سلمى احمد, Pediatric Specialist, so the specialty agrees); same first name, different surname (Kamal vs Ahmed). Left unmatched; confirm with the clinic before linking. |
| 5637425827 | د. خالد البذلي | استشاري طب المخ والأعصاب للبالغين وطب الأعصاب الطرفية والعضلات | NC01 | none (best fuzzy 0.696: د. خالد الحصيني) |
| 5637475327 | د. خالد بن سعد | استشاري أطفال عام | RYD1 | none (best fuzzy 0.696: د. خالد بن ناجي) |
| 5637456596 | د. فهد السلمي | استشاري طب الباطنة والصدرية | NC01/Safa | none (best fuzzy 0.783: د. شهد السليماني) |
| 5637533826 | د. محمد الشنبري | استشاري الأنف والأذن والحنجرة و جراحة أورام الغدة الدرقية وجارات الدرقية | CJ01/CJ02 | none (best fuzzy 0.870: د. محمد الشريف) |
| 5637428827 | د. محمود شاهين | استشاري الطب الباطني وأمراض الكلى | Safa | none (best fuzzy 0.700: د. محمد منشي) |
| 5637147580 | د. نواف المرزوقي | استشاري طب وجراحة العيون | NC01 | none (best fuzzy 0.667: د. وفاء  المقري) |
| 5637527084 | د. نوف الشهري | استشاري الغدد الصماء | CJ01/Safa | none (best fuzzy 0.818: د. نوف الزهراني) |
| 5637524847 | رنا الشدي | أخصائية تغذية علاجية | RYD1 | none (best fuzzy 0.762: د. رناد الشوبكي) |

## Ambiguous (no update emitted)

None.

## Manual resolutions applied (in the sync file)

| DoctorRecId | Excel NameAr | Excel TitleAr | DB slug | DB name_en | DB specialty_raw | reasoning |
|---|---|---|---|---|---|---|
| 5637512083 | د. أحمد السيد | استشاري الأنف والأذن والحنجرة و مناظير الجيوب الأنفية وقاع الجمجمة | dr-ahmed-alsayed | Dr. Ahmed Alsayed | ENT Rhinology & Endoscopic Skull Base Surgery Consultant | Excel title is ENT + endoscopic sinus/skull base = dr-ahmed-alsayed (ENT Rhinology & Endoscopic Skull Base Surgery Consultant); the other candidate dr-ahmed-elsayed is a Prosthodontist. |
| 5637414587 | د. محمد الشريف | أخصائي الأنف والأذن والحنجرة | dr-mohamed-elsherief | Dr. Mohamed Elsherief | ENT Specialist | Excel title says أخصائي (Specialist) = dr-mohamed-elsherief (ENT Specialist); dr-mohammad-alshareef is the ENT Consultant. |
| 5637532330 | عنان خطاب | أخصائي تقييم النطق واللغة | dr-anan-khattab | Dr. Anan Khattab | Speech Language Assessment Specialist | Two Excel records for the same person; this title (أخصائي تقييم النطق واللغة) is the literal translation of the DB specialty_raw "Speech Language Assessment Specialist", the other record (5637386826, أخصائي نطق وتخاطب) is older/bachelor-level. |
| 5637307327 | د. عبدالله باحكيم | استشاري الأنف والأذن والحنجرة ومناظير الجيوب الأنفية وقاع الجمجمة | dr-abdullah-bahakim | Dr. Abdullah Bahakim | ENT Rhinology and Endoscopic Skull Base Surgery Consultant | DB row has name_en "Dr. Abdullah Bahakim" but name_ar "د. عبدالرحمن باحكيم" (DB data bug, the Arabic name is wrong); unique surname + identical rare specialty (ENT Rhinology & Endoscopic Skull Base). Consider also fixing name_ar to "د. عبدالله باحكيم". |

Dropped as a duplicate record: 5637386826 (عنان خطاب, أخصائي نطق وتخاطب). Also applied: name_ar of dr-abdullah-bahakim corrected to "د. عبدالله باحكيم".

## Existing titles kept (export value less specific, NOT overwritten)

| DB slug | kept title_ar | export TitleAr (ignored) |
|---|---|---|
| dr-hatim-alalwani | استشاري الغدد الصماء | الغدد الصماء |
| dr-ahmed-zugail | استشاري المسالك البولية | المسالك البولية |
| dr-afnan-kamal | استشاري امراض صدرية للبالغين | أمراض الرئة / الصدرية |
| dr-shahad-alsulaimani | اخصائي أول أمراض الجلدية | الأمراض الجلدية |
| dr-nabigah-alzawawi | استشاري طب النساء و التوليد -  العقم وتاخر الحمل | التوليد وأمراض النساء |
| dr-ruba-habibullah | استشاري أمراض النساء والتوليد | التوليد وأمراض النساء |

## Non-exact matches accepted (please eyeball)

Tiers T3/T4 are token-containment (one name is a subset of the other), T5 is a fuzzy ratio >= 0.9. "spec" is a crude Arabic/English keyword sanity check of the Excel title against the DB specialty.

| tier | Excel NameAr | Excel TitleAr | DB slug | DB name_en | DB name_ar | DB specialty_raw | spec |
|---|---|---|---|---|---|---|---|
| T5 fuzzy ratio=0.960 (next 0.750) | د. حاتم العلوني | الغدد الصماء | dr-hatim-alalwani | Dr. Hatim Alalwani | د. حاتم العلواني | Endocrinology Consultant | ok |
| manual | د. أحمد السيد | استشاري الأنف والأذن والحنجرة و مناظير الجيوب الأنفية وقاع الجمجمة | dr-ahmed-alsayed | Dr. Ahmed Alsayed | د. احمد السيد | ENT Rhinology & Endoscopic Skull Base Surgery Consultant | manual |
| T4 token-containment (ال-stripped) | د. أحمد وزان | استشاري طب النساء والولادة وجراحة الأورام النسائية والمناظير | dr-ahmed-alwazzan | Dr. Ahmed Alwazzan | د. احمد الوزان | Obstetrics and Gynecology Consultant | ok |
| T4 token-containment (ال-stripped) | د. حامد المدني | استشاري أمراض الروماتيزم | dr-hamid-madani | Dr. Hamid Madani | د. حامد مدني | Rheumatology Consultant | ok |
| T5 fuzzy ratio=0.952 (next 0.600) | د. شهد باعرمه | أخصائي أول طب أطفال | dr-shahd-baarimah | Dr. Shahd Baarimah | د. شهد باعارمه | Pediatric | ok |
| manual | د. عبدالله باحكيم | استشاري الأنف والأذن والحنجرة ومناظير الجيوب الأنفية وقاع الجمجمة | dr-abdullah-bahakim | Dr. Abdullah Bahakim | د. عبدالرحمن باحكيم | ENT Rhinology and Endoscopic Skull Base Surgery Consultant | manual |
| T5 fuzzy ratio=0.963 (next 0.667) | د. غفران أبوداود | أخصائي أول طب وجراحة العيون الجلوكوما والمياه البيضاء | dr-ghufran-abudawood | Dr. Ghufran Abudawood | د. غفران ابو داوود | Ophthalmology Glaucoma and Cataract Surgery Sr. Specialist | ok |
| manual | د. محمد الشريف | أخصائي الأنف والأذن والحنجرة | dr-mohamed-elsherief | Dr. Mohamed Elsherief | د. محمد الشريف | ENT Specialist | manual |
| T5 fuzzy ratio=0.900 (next 0.727) | سارا العيد | أخصائية تغذية | dr-sara-aleid | Sara Aleid | ساره العيد | Clinical Dietitian | ok |
| manual | عنان خطاب | أخصائي تقييم النطق واللغة | dr-anan-khattab | Dr. Anan Khattab | د. عنان خطاب | Speech Language Assessment Specialist | manual |

## Exact matches whose specialty keyword check disagrees (please eyeball)

None.

## Existing title_ar values being overwritten

| DB slug | old title_ar | new title_ar |
|---|---|---|
| dr-abdulrahman-qattan | استشاري الأنف والأذن والحنجرة | استشاري الأنف والأذن والحنجرة و جراحة أورام الغدة الدرقية وجارات الدرقية |
| dr-ahmed-alwazzan | استشاري طب النساء والولادة | استشاري طب النساء والولادة وجراحة الأورام النسائية والمناظير |
| dr-amerah-bogari | أخصائي اول تغذية علاجية | أخصائية أولى تغذية علاجية |
| dr-hanin-abduljabar | استشاري طب النساء والولادة و الغدد الصماء والعقم | استشاري طب النساء والولادة والغدد الإنجابية وتأخر الحمل والعقم |
| dr-hisham-nasief | استشاري طب النساء والولادة | استشاري طب الأم والجنين (النساء والتوليد) |
| dr-wafa-maqbul | استشاري الأنف و الأذن و الحنجرة | استشاري الأنف والأذن والحنجرة |

## DB doctors still without title_ar after this sync

| slug | name_en | name_ar | specialty_raw |
|---|---|---|---|
| dr-abdelrahman-alhilou | Dr. Abdelrahman Alhilou | د. عبدالرحمن الحلو | Endodontics Consultant |
| dr-abdulrahman-tehsin | Dr. Abdulrahman Tehsin | د. عبدالرحمن تحسين | General Dentist |
| dr-abrar-almarghalani | Abrar Almarghalani | د. أبرار المرغلاني | Sr. Registrar In Operative & Esthetic Dentistry |
| dr-ahmed-elsayed | Dr. Ahmed Elsayed | د. أحمد السيد | Prosthodontist |
| dr-ahmed-ghannam | Dr. Ahmed Ghannam | د.أحمد غنام | General Dentist |
| dr-ahmed-younis | Dr. Ahmed Younis | د. أحمد يونس | Endodontic Specialist |
| dr-ahood-aldahri | Dr. Ahood Aldahri | د. عهود الدهري | General Dentist |
| dr-alaa-babeer | Dr. Alaa Babeer | د. علاء بابعير | Endodontist Sr. Specialist |
| dr-alaa-kabbarah | Alaa Kabbarah | علاء كباره | Consultant Dental Public health |
| dr-alaa-samman | Dr. Alaa Samman | د. علاء السمان | Orthodontic Specialist |
| dr-alamuddin-bakhit | Dr. Alamuddin Bakhit | د. علم الدين بخيت | Endodontics Consultant |
| dr-ali-elatrouni | Dr. Ali Elatrouni | د. علي العطروني | Oral Maxillo Facial Surgery & implantology Consultant |
| dr-ammar-almarghlani | Dr. Ammar Almarghlani | د. عمار المرغلاني | Consultant in Periodontics and Implant Dentistry |
| dr-amr-azhari | Dr. Amr Azhari | د. عمرو أزهري | Consultant in Restorative and Cosmetic Dentistry |
| dr-anhar-basunbul | Dr. Anhar Basunbul | د. أنهار باسنبل | Maxillofacial Prosthodontics & Oral Oncology Consultant |
| dr-bayan-alsharif | Dr. Bayan Alsharif | د. بيان الشريف | General Dentist |
| dr-dana-alyafi | Dr. Dana Alyafi | د. دانة اليافي | Orthodontics Consultant |
| dr-elham-elsahafi | Dr. Elham Elsahafi | د. إالهام الصحفي | Consultant in Oral Medicine and Aesthetic Dentistry |
| dr-emad-albadawi | Dr. Emad Albadawi | د. عماد البدوي | Pediatric Dentistry Consultant 
TMJ Disorders and Orofacial Pain Consultant |
| dr-eyad-fathi | Dr. Eyad Fathi | د. إياد فتحي | Prosthodontics Specialist |
| dr-fahad-aladwani | Dr. Fahad Aladwani | د. فهد العدواني | Periodontics & Dental Implants Sr. Specialist |
| dr-fahad-essa | Dr. Fahad Essa | د. فهد عيسى | Internal Medicine & Pulmonology Consultant |
| dr-fawziah-gomri | Dr. Fawziah Gomri | د. فوزيه قمري | General Dentist |
| dr-feras-mirdad | Dr. Feras Mirdad | د. فراس مرداد | Specialist in Prosthodontics and Cosmetic Dentistry |
| dr-fetoun-alhashemy | Dr. Fetoun Alhashemy | د. فتون الهاشمي | Pedodontics Sr. Specialist |
| dr-futoon-abualfaraj | Dr. Futoon Abualfaraj | د. فتون أبو الفرج | Dental Hygienist |
| dr-hammam-bahammam | Dr. Hammam Bahammam | د. همام باهمام | Pediatric Dentistry Consultant |
| dr-hani-mawardi | Dr. Hani Mawardi | د. هاني ماوردي | Periodontics, Dental Implant, & Oral Medicine Consultant |
| dr-hasan-abed | Dr. Hasan Abed | د. حسن عابد | Conscious Sedation & Special Care Dentistry Consultant |
| dr-hayel-makhashin | Dr. Hayel Makhashin | د. هايل مخاشن | Oral & Maxillofacial Surgery Sr. Specialist |
| dr-heba-binabid | Dr. Heba Binabid | د. هبه بن عابد | Dental Esthetic & Restorative Specialist |
| dr-hisham-komo | Dr. Hisham Komo | د. هشام كومو | Oral & Maxillofacial Surgery Consultant |
| dr-hussam-shawli | Dr. Hussam Shawli | د. حسام شاولي | Oral & Maxillofacial Surgery and Dental Implant Consultant |
| dr-ibrahim-abdulmalik | Dr. Ibrahim Abdulmalik | د. إبراهيم عبدالمالك | General Dentist |
| dr-jawdat-jamluddin | Dr. Jawdat Jamluddin | د. جودت جمال الدين | Periodonitic Specialist |
| dr-kawthar-albeedh | Dr. Kawthar Albeedh | د. كوثر البيض | General Dentist |
| dr-lalyan-bahha | Dr. Lalyan Bahha | د. لليان بحه | Consultant Prosthodontics & Cosmetic Dentistry |
| dr-lama-samanoudi | Dr. Lama Samanoudi | د. لمى سمنودي | General Dentist |
| dr-lina-alsharif | Dr. Lina AlSharif | د. لينا الشريف | Senior Registrar in Endodontics |
| dr-lojain-bassyouni | Dr. Lojain Bassyouni | د. لوجين بسيوني | Oral & Maxillofacial Surgery Consultant |
| dr-lujain-khoj | Dr. Lujain Khoj | د. لجين خوج | Pulmonary |
| dr-majed-althubaiti | Dr. Majed Althubaiti | د. ماجد الثبيتي | Consultant in Periodontics & Implant Dentistry |
| dr-majed-basharahil | Dr. Majed Basharahil | د. ماجد باشراحيل | Pedodontics Specialist |
| dr-manab-benten | Dr. Manab Benten | د. مناب بنتن | Orofacial Pain, TMJ & Sleep Medicine Consultant |
| dr-marwan-salah-eldin | Dr. Marwan Salah Eldin | د. مروان صلاح الدين | Endodontics Specialist |
| dr-maysaa-alsharqawi | Dr. Maysaa Alsharqawi | د. ميساء الشرقاوي | General Dentist |
| dr-mohammed-hefne | Dr. Mohammed Hefne | د. محمد حفني | Prosthodontics Consultant |
| dr-muthanna-bajnied | Dr. Muthanna Bajnied | د. مثنى باجنيد | Dental Esthetic & Restorative Specialist |
| dr-nada-kalakattawi | Dr. Nada Kalakattawi | د. ندى كلكتاوي | Pediatric Nephrology Consultant |
| dr-nawras-kherallah | Dr. Nawras Kherallah | د. نورس خير الله | Periodontist & Oral Implantologist Specialist |
| dr-omsalamah-ahmed | Dr. Omsalamah Ahmed | د. ام سلمى احمد | Pediatric Specialist |
| dr-osama-basri | Dr. Osama Basri | د. أسامة بصري | Orthodontics and dentofacial orthopedics |
| dr-rami-saab | Dr. Rami Saab | د. رامي صعب | Oral & Maxillofacial Surgery Consultant |
| dr-rawah-eshky | Dr. Rawah Eshky | د. رواح عشقي | Orthodontics & Dentofacial Orthopedics Consultant |
| dr-reyouf-mousa | Dr. Reyouf Mousa | د. ريوف موسى | General Dentist |
| dr-saeed-bintalib | Dr. Saeed BinTalib | د. سعيد بن طالب | General Dentist |
| dr-sami-lodhi | Dr. Sami Lodhi | د. سامي لودي | General Dentist |
| dr-shahad-abudawood | Dr. Shahad Abudawood | د. شهد أبوداود | Pedodontics Consultant |
| dr-siraj-dakhil | Dr. Siraj Dakhil | د. سراج دخيل | Endodontics Consultant |
| dr-tahani-azizalrahman | Dr. Tahani Azizalrahman | د. تهاني عزيز الرحمن | Pediatric Dentistry Specialist |
| dr-waad-bajaber | Dr. Waad Bajaber | د. وعد باجابر | General Dentist |
| dr-wafaa-kattan | Dr. Wafaa Kattan | د. وفاء قطان | Operative & Esthetic Dentistry Specialist |
| dr-walaa-alamoudi | Dr. Walaa Alamoudi | د. ولاء العمودي | Pedodontics Specialist |
| dr-walaa-hassan | Dr. Walaa Hassan | د. ولاء حسان | Endodontic Specialist |
| dr-waleed-taju | Dr. Waleed Taju | د. وليد تاجو | Consultant in Orthodontics and Dentofacial Orthopedics |
| dr-yusra-khadwardi | Dr. Yusra Khadwardi | د. يسرا خداوردي | General Dentist |

## Validation

Executed on a throwaway PostgreSQL 17.7 cluster seeded with the 394 live doctors: applied with `psql -v ON_ERROR_STOP=1 -q -f` (exit 0), 288 rows updated, every value equal to the expected string, no tashkeel left, re-apply is a no-op (exit 0), and a drift test (renamed slug + nulled title) raised the check exception, exit 3, with the transaction rolled back.

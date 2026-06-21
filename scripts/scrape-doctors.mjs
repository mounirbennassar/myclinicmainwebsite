import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const BASE = "https://www.myclinic.com.sa";

// All doctors extracted from myclinic.com.sa/ads/generic organized by specialty
const rawDoctors = [
  // ALLERGY & IMMUNOLOGY
  { name: "Dr. Shorooq Banjar", title: "Consultant", spec: "Allergy & Immunology", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0f5/c91/6800f5c91adc8365922975.png" },
  { name: "Dr. Husam Malibary", title: "Consultant", spec: "Allergy & Immunology", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0ba/ab0/6800baab016cd076089564.png" },
  { name: "Dr. Salma Alkhammash", title: "Consultant", spec: "Allergy & Immunology", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/fc0/614/67ffc0614bcdf208134285.jpg" },
  { name: "Dr. Jamil Waly", title: "Pediatric & Allergy Immunology Consultant", spec: "Allergy & Immunology", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0bb/fec/6800bbfecfbd0312996134.png" },
  { name: "Dr. Saddiq Habiballah", title: "Pediatric & Allergy Immunology Consultant", spec: "Allergy & Immunology", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/fc0/d07/67ffc0d075195508052899.png" },
  { name: "Dr. Amer Khojah", title: "Pediatric Allergy Immunology & Pediatric Rheumatology Consultant", spec: "Allergy & Immunology", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/4a9/818/6804a9818892a832035554.png" },
  { name: "Dr. Walaa Almasri", title: "Internal Medicine & Allergy & Reproductive Immunology Consultant", spec: "Allergy & Immunology", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/4b2/d7d/6804b2d7d837b516842343.png" },
  { name: "Dr. Faisal AlMuhizi", title: "Allergy, Asthma & Immunology Consultant", spec: "Allergy & Immunology", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/4cd/ca8/6804cdca8776f923236873.png" },

  // AUDIO-VESTIBULAR & SPEECH
  { name: "Dr. Eman Obaid", title: "Audio-Vestibular Specialist", spec: "Audio-vestibular & Speech", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0e6/439/6800e6439d753839239330.png" },
  { name: "Dr. Eman Mahmoud", title: "Audio-Vestibular Specialist", spec: "Audio-vestibular & Speech", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0e6/1ea/6800e61ea0d8f809776867.png" },
  { name: "Dr. Anan Khattab", title: "Speech & Language Specialist", spec: "Audio-vestibular & Speech", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0ea/ae0/6800eaae0dfc2442227789.png" },
  { name: "Dr. Nora Halawani", title: "Speech Language & Swallowing Assessment Specialist", spec: "Audio-vestibular & Speech", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/fab/c13/67ffabc13ddbd583478359.png" },
  { name: "Dr. Maryam Bamashmous", title: "Audio-Vestibular Specialist", spec: "Audio-vestibular & Speech", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/5e8/3cd/6805e83cdb113762962633.png" },

  // CARDIOLOGY
  { name: "Dr. Yosra Turkistani", title: "Adult Cardiology Consultant", spec: "Cardiology", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/fac/fdd/67ffacfdd0cd9381037317.jpg" },
  { name: "Dr. Seraj Aboalnaja", title: "Cardiovascular Disease & Internal Medicine Consultant", spec: "Cardiology", img: "https://www.myclinic.com.sa/storage/app/uploads/public/665/c5f/da4/665c5fda402fd955694064.png" },
  { name: "Dr. Munawar Almajnoni", title: "Cardiology, Internal Medicine & Cardiac Echocardiography Consultant", spec: "Cardiology", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0b3/16a/6800b316a5cf5152605866.jpg" },
  { name: "Dr. Mohammed Zahrani", title: "Cardiology Consultant", spec: "Cardiology", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0b2/733/6800b27336905769180365.jpg" },
  { name: "Dr. Saeed Alghamdi", title: "Cardiology & Cardiac Echocardiography Consultant", spec: "Cardiology", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0f5/8c4/6800f58c47a76506072540.png" },
  { name: "Dr. Khalid Aljohani", title: "Interventional Cardiology Consultant", spec: "Cardiology", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/4b4/322/6804b432263c2708587982.jpg" },
  { name: "Dr. Khalid Bin Naji", title: "Cardiology & Advanced Cardiac Imaging Consultant", spec: "Cardiology", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/88e/469/68088e46955fd182484885.png" },

  // DENTAL
  { name: "Dr. Fotoun Abualfaraj", title: "Dental Hygienist", spec: "Dental", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/faa/b54/67ffaab54a19b861793867.png" },
  { name: "Dr. Walaa Alamoudi", title: "Pedodontics Specialist", spec: "Dental", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/faf/fa3/67ffaffa3c106896972575.jpg" },
  { name: "Dr. Wafaa Kattan", title: "Operative & Esthetic Dentistry Specialist", spec: "Dental", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/fb0/649/67ffb064944b6721398826.jpg" },
  { name: "Dr. Usra Khadwardi", title: "Dentist", spec: "Dental", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/fb1/0fa/67ffb10fa0342732927471.jpg" },
  { name: "Dr. Tahani Azizalrahman", title: "Pediatric Dentistry Specialist", spec: "Dental", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/fb1/6d6/67ffb16d65629461328302.jpg" },
  { name: "Dr. Siraj Dakhil", title: "Endodontics Consultant", spec: "Dental", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/fb2/5e3/67ffb25e361d8704767903.jpg" },
  { name: "Dr. Shahad Abudawood", title: "Pediatric Dentist Consultant", spec: "Dental", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/fb8/0d4/67ffb80d47c54322790701.jpg" },
  { name: "Dr. Rami Saab", title: "Oral & Maxillofacial Surgery Consultant", spec: "Dental", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/fc1/e7a/67ffc1e7a67cd093806087.jpg" },
  { name: "Dr. Nawras Kherallah", title: "Periodontist & Oral Implantologist Specialist", spec: "Dental", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0b5/689/6800b56894479573088862.png" },
  { name: "Dr. Muthanna Bajnied", title: "Dental Esthetic & Restorative Specialist", spec: "Dental", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0b3/548/6800b354809b5979470324.jpg" },
  { name: "Dr. Mohammed Hefne", title: "Prosthodontics Consultant", spec: "Dental", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0ae/dd9/6800aedd9e94e476737413.png" },
  { name: "Dr. Hisham Komo", title: "Oral & Maxillofacial Surgery Consultant", spec: "Dental", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0b9/c87/6800b9c876a8c677311038.png" },
  { name: "Dr. Hani Mawardi", title: "Periodontics, Dental Implant & Oral Medicine Consultant", spec: "Dental", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0e0/90b/6800e090b1b0a547640868.png" },
  { name: "Dr. Fahad Aladwani", title: "Periodontics & Dental Implants Consultant", spec: "Dental", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0e6/f59/6800e6f5961b7744823287.png" },
  { name: "Dr. Dana Alyafi", title: "Orthodontics Consultant", spec: "Dental", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0e5/bb3/6800e5bb30bca231844091.png" },
  { name: "Dr. Ammar Almarghlani", title: "Periodontics & Implant Dentistry Consultant", spec: "Dental", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0e2/641/6800e264153ea661393761.jpg" },
  { name: "Dr. Lilian Bahha", title: "Prosthodontics Sr. Specialist", spec: "Dental", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0f9/d7a/6800f9d7a4e9b239441566.jpg" },

  // DERMATOLOGY & COSMETICS
  { name: "Dr. Taha Habibullah", title: "Dermatology & Aesthetics Medicine Consultant", spec: "Dermatology & Cosmetics", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/fb1/c35/67ffb1c356602483443524.jpg" },
  { name: "Dr. Soad Mandoura", title: "Dermatology & Aesthetic Medicine Consultant", spec: "Dermatology & Cosmetics", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/fb1/e9f/67ffb1e9f062d124219733.jpg" },
  { name: "Dr. Shereen Al Khilafi", title: "Dermatology & Cosmetology Consultant", spec: "Dermatology & Cosmetics", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/fb2/d67/67ffb2d67b7bf805992323.jpg" },
  { name: "Dr. Maysoon Algain", title: "Dermatology Cutaneous Oncology & Cosmetic Consultant", spec: "Dermatology & Cosmetics", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0ac/697/6800ac697e128993210098.png" },
  { name: "Dr. Jehad Hariri", title: "Dermatology & Dermatopathology Consultant", spec: "Dermatology & Cosmetics", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0bc/18e/6800bc18e604c523403821.png" },
  { name: "Dr. Amira EL Tawdy", title: "Dermatology & Aesthetics Medicine Consultant", spec: "Dermatology & Cosmetics", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0fe/f4d/6800fef4d379a782766542.jpg" },
  { name: "Dr. Mohammad Munshi", title: "Dermatology Consultant", spec: "Dermatology & Cosmetics", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/5e9/d8d/6805e9d8d816f884907919.png" },

  // EMERGENCY
  { name: "Dr. Mohammed Elamin", title: "General Practitioner", spec: "Emergency", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0ae/c42/6800aec4221f3354182202.jpg" },
  { name: "Dr. Ahdab Abdulaziz", title: "Emergency Doctor", spec: "Emergency", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/107/493/6801074934635323932742.jpg" },
  { name: "Dr. Safwan Almawal", title: "Emergency Medicine Specialist", spec: "Emergency", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/4a3/b9c/6804a3b9c0d50666169490.jpg" },

  // ENDOCRINOLOGY & DIABETES
  { name: "Dr. Saud Alzahrani", title: "Endocrinology Consultant", spec: "Endocrinology & Diabetes", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/fb8/b43/67ffb8b431589656340478.jpg" },
  { name: "Dr. Reem Alnazawi", title: "Endocrinology, Diabetes & Metabolism Consultant", spec: "Endocrinology & Diabetes", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/fc1/a21/67ffc1a2162bd373262856.jpg" },
  { name: "Dr. Hussein Elbadawi", title: "Endocrinology & Diabetes Consultant", spec: "Endocrinology & Diabetes", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0bb/aa3/6800bbaa35cf1932842655.png" },
  { name: "Dr. Hani Shalabi", title: "Endocrinology, Diabetes & Metabolism Consultant", spec: "Endocrinology & Diabetes", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0e0/66c/6800e066c6bf8579535621.png" },
  { name: "Dr. Ahmad Imam", title: "Endocrinology & Diabetes Consultant", spec: "Endocrinology & Diabetes", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0ee/2b6/6800ee2b6009c388940524.jpg" },

  // ENT
  { name: "Dr. Yousuf Alqurashi", title: "ENT, Head & Neck Oncology Surgery Consultant", spec: "ENT", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/fac/d7a/67ffacd7a2def142880289.png" },
  { name: "Dr. Waleed Eid", title: "ENT Specialist", spec: "ENT", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/faf/818/67ffaf81847a4084690755.jpg" },
  { name: "Dr. Wael Abdelkafy", title: "ENT, Head & Neck Surgery Consultant", spec: "ENT", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/fb0/cf3/67ffb0cf37642493725842.png" },
  { name: "Dr. Saleh Alghamdi", title: "Otolaryngology, Head & Neck Surgery, Sleep Medicine Consultant", spec: "ENT", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/fc0/913/67ffc09133339225642544.jpg" },
  { name: "Dr. Rajiah Murad", title: "ENT & Sleep Surgery Consultant", spec: "ENT", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/fc2/286/67ffc228622d9307841392.jpg" },
  { name: "Dr. Ibrahim Alnoury", title: "ENT, Head & Neck Surgery Consultant", spec: "ENT", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0bb/e57/6800bbe571ef4605860422.png" },
  { name: "Dr. Abdullah Bahakim", title: "ENT Rhinology & Endoscopic Skull Base Surgery Consultant", spec: "ENT", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0ea/4b5/6800ea4b5428c132812630.png" },

  // FAMILY MEDICINE
  { name: "Dr. Wail Yar", title: "Family, Sleep & Preventive Medicine Consultant", spec: "Family Medicine", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/fb0/3b8/67ffb03b84e20128073187.png" },
  { name: "Dr. Shoroug Ibrahim", title: "Family Medicine Consultant", spec: "Family Medicine", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/fb2/a07/67ffb2a07aa8a833354714.png" },
  { name: "Dr. Sharifa Alshehri", title: "Family Medicine & Diabetes Consultant", spec: "Family Medicine", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/fb3/081/67ffb3081dc2a505244794.jpg" },
  { name: "Dr. Mohammed Aljunaid", title: "Family Medicine Consultant", spec: "Family Medicine", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0ae/81b/6800ae81b8580673065767.png" },
  { name: "Dr. Khaled Yaghmour", title: "Family Medicine Consultant", spec: "Family Medicine", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0bc/9fb/6800bc9fb97a9382149008.png" },
  { name: "Dr. Rania Harere", title: "Family Medicine Consultant", spec: "Family Medicine", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/4a9/3f5/6804a93f52223647906342.jpg" },

  // GASTROENTEROLOGY & HEPATOLOGY
  { name: "Dr. Yasir Khayyat", title: "Gastroenterology, Hepatology & Endoscopy Consultant", spec: "Gastroenterology & Hepatology", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/fad/2bc/67ffad2bcd855616180096.jpg" },
  { name: "Dr. Mohammed Alfawaz", title: "Gastroenterology Consultant", spec: "Gastroenterology & Hepatology", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0ae/560/6800ae5604743271087597.jpg" },
  { name: "Dr. Haziz Albiladi", title: "Gastroenterology, Hepatology & Endoscopy Consultant", spec: "Gastroenterology & Hepatology", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0b9/062/6800b9062804b869769385.png" },

  // GENERAL SURGERY
  { name: "Dr. Mohammad Abbas", title: "General Surgery Specialist", spec: "General Surgery", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0ad/e81/6800ade8160f4899906460.png" },
  { name: "Dr. Ahmed Alzahrani", title: "General, Laparoscopic & Bariatric Surgery Consultant", spec: "General Surgery", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0f8/5b7/6800f85b70bba553503153.png" },
  { name: "Dr. Baraah Tatwany", title: "General Surgery Sr. Specialist", spec: "General Surgery", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0ff/b1b/6800ffb1b6341094619046.png" },
  { name: "Dr. Abdullah Abdullah", title: "Vascular & Endovascular Surgery Consultant", spec: "General Surgery", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0ff/84c/6800ff84ce80c314471536.png" },

  // GERIATRIC MEDICINE
  { name: "Dr. Hashim Balubaid", title: "Geriatric Medicine Consultant", spec: "Geriatric Medicine", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/4ce/298/6804ce2986a9f917665460.png" },

  // HEMATOLOGY
  { name: "Dr. Ashraf Warsi", title: "Hematology Consultant", spec: "Hematology", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0f6/362/6800f63624fba438870558.png" },
  { name: "Dr. Abdulkareem Almomen", title: "Internal Medicine & Hematology Consultant", spec: "Hematology", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/4c0/65a/6804c065aa132753644950.png" },

  // INTERNAL MEDICINE
  { name: "Dr. Walaa Aldabbagh", title: "Internal Medicine & Rheumatology Consultant", spec: "Internal Medicine", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/faf/c0d/67ffafc0dc8ec954745864.jpg" },
  { name: "Dr. Suhail Khojah", title: "Internal Medicine & Nephrology Consultant", spec: "Internal Medicine", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/fb2/362/67ffb2362c498935389616.jpg" },
  { name: "Dr. Sarah Dahlan", title: "Internal Medicine, Nephrology & Blood Pressure Consultant", spec: "Internal Medicine", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/fb8/f3a/67ffb8f3ac00d692632570.png" },
  { name: "Dr. Mohsen Baduqayl", title: "Internal & Respiratory Medicine Consultant", spec: "Internal Medicine", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0b2/9fa/6800b29fa3965515416640.jpg" },
  { name: "Dr. Majed Alnabulsi", title: "Internal Medicine Consultant", spec: "Internal Medicine", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0a8/d6e/6800a8d6ef2fc494301183.jpg" },
  { name: "Dr. Hanaa Ragab", title: "Internal Medicine Consultant", spec: "Internal Medicine", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0e8/cac/6800e8cac8f9a992244789.png" },
  { name: "Dr. Mohammed Samannodi", title: "Internal Medicine & Infectious Diseases Consultant", spec: "Internal Medicine", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0f7/a83/6800f7a83a62a813161672.png" },

  // NEPHROLOGY
  { name: "Dr. Sami Al Obaidi", title: "Nephrology Consultant", spec: "Nephrology", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/fb9/82b/67ffb982bb660732883634.jpg" },
  { name: "Dr. Enad Alsolami", title: "Nephrology Consultant", spec: "Nephrology", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0e6/663/6800e6663fa50117869213.png" },
  { name: "Dr. Omar Ashour", title: "Nephrology & Blood Pressure Consultant", spec: "Nephrology", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/fc3/33d/67ffc333d36b3677611022.jpg" },
  { name: "Dr. Nada Kalakattawi", title: "Pediatric Nephrology Consultant", spec: "Nephrology", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0b3/88e/6800b388ec4e2385271722.jpg" },

  // NEUROLOGY
  { name: "Dr. Rami Algahtani", title: "Adult Neurology Consultant", spec: "Neurology", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/fc2/08b/67ffc208b3af8223137378.jpg" },
  { name: "Dr. Nesreen Ashour", title: "Adult Neurology Consultant", spec: "Neurology", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0a8/110/6800a81109527178820665.png" },
  { name: "Dr. Khaled Albazli", title: "Adult Neurology & Neuromuscular Medicine Consultant", spec: "Neurology", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0bc/7f0/6800bc7f0ec4b084227032.png" },
  { name: "Dr. Hassan Jaber", title: "Neurosurgery Consultant", spec: "Neurology", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0b7/a2e/6800b7a2edaa8888872495.png" },
  { name: "Dr. Fawaz Alhumaid", title: "Neurology Consultant", spec: "Neurology", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0e7/906/6800e790619b1286941463.png" },
  { name: "Dr. Raed Altayeb", title: "Neurologist & Neuromuscular Medicine Consultant", spec: "Neurology", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/4a9/fa4/6804a9fa41b24704775983.png" },

  // NUTRITION
  { name: "Dr. Lina Akkad", title: "Sr. Clinical Dietitian", spec: "Nutrition", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/fab/e01/67ffabe0172c6520767947.png" },
  { name: "Dr. Amal Alandejani", title: "Sr. Clinical Dietitian", spec: "Nutrition", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/105/fde/680105fde3ef3371200482.png" },
  { name: "Dr. Sara Aleid", title: "Clinical Dietitian", spec: "Nutrition", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/4a1/654/6804a1654560d036165799.jpg" },

  // OBSTETRICS & GYNECOLOGY
  { name: "Dr. Wael Auwad", title: "Gynecology & Urogynecology Consultant", spec: "Obstetrics & Gynecology", img: "https://www.myclinic.com.sa/storage/app/uploads/public/655/ba1/e60/655ba1e606df6780667338.jpg" },
  { name: "Dr. Ahmad Alwazzan", title: "Obstetrics & Gynecology Consultant", spec: "Obstetrics & Gynecology", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/fa6/427/67ffa64271e9f546050419.png" },
  { name: "Dr. Hatim Aljifree", title: "General Gynecology & Gynecology Oncology Consultant", spec: "Obstetrics & Gynecology", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/fa5/94c/67ffa594ce0e5340408040.png" },
  { name: "Dr. Hanin Abduljabar", title: "OB-GYN, Reproductive Endocrinology & Infertility Consultant", spec: "Obstetrics & Gynecology", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/fa5/c54/67ffa5c546e51874970150.png" },
  { name: "Dr. Nedaa Bahkali", title: "Maternal Fetal Medicine & Advanced OB-GYN Consultant", spec: "Obstetrics & Gynecology", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/fa4/d56/67ffa4d564e66146261414.jpg" },
  { name: "Dr. Osama Bajouh", title: "Obstetrics, Gynecology & Infertility Consultant", spec: "Obstetrics & Gynecology", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/e67/9c7/67fe679c79a93464576369.png" },

  // OCCUPATIONAL MEDICINE
  { name: "Dr. Abdullah Khafagy", title: "Family & Occupational Medicine Consultant", spec: "Occupational Medicine", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/106/341/680106341154a990036411.png" },

  // OPHTHALMOLOGY
  { name: "Dr. Nooran Badeeb", title: "Ophthalmology Consultant", spec: "Ophthalmology", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/fc3/ec7/67ffc3ec781eb380615272.jpg" },
  { name: "Dr. Nawaf Al Marzouki", title: "Ophthalmology Consultant", spec: "Ophthalmology", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0b3/cd1/6800b3cd152f2009280252.jpg" },
  { name: "Dr. Lujain Idriss", title: "Cornea, Cataract, Refractive Surgery & Uveitis Consultant", spec: "Ophthalmology", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0a8/385/6800a838505fe335258839.png" },
  { name: "Dr. Albaraa AlQassimi", title: "Cornea, Cataract & Refractive Surgery Consultant", spec: "Ophthalmology", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0f9/263/6800f92636f51732923191.png" },
  { name: "Dr. Aziz Albalawi", title: "Ophthalmology, Vitreo & Retinal Consultant", spec: "Ophthalmology", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0f7/d98/6800f7d9887a2123634405.png" },

  // ORTHOPEDICS
  { name: "Dr. Taha Samman", title: "Orthopedic Consultant Sports Injuries & Arthroscopic Surgeries", spec: "Orthopedics", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/fb1/8ec/67ffb18ecb415957574750.jpg" },
  { name: "Dr. Hamza Alofi", title: "Orthopedic & Trauma Surgery Consultant", spec: "Orthopedics", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0e8/8c2/6800e88c2259a556009623.png" },
  { name: "Dr. Fayig Sawaf", title: "Orthopedic Consultant", spec: "Orthopedics", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0e7/d28/6800e7d280e9d547337200.png" },
  { name: "Dr. Ayman Awlia", title: "Orthopedic, Upper Limb & Comprehensive Knee Surgery Consultant", spec: "Orthopedics", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/4a0/5e9/6804a05e91403820536688.jpg" },
  { name: "Dr. Bandar Hetaimish", title: "Orthopedic Consultant Sports Medicine & Arthroscopy", spec: "Orthopedics", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/4ab/1ad/6804ab1adf05c339650324.png" },

  // PEDIATRICS
  { name: "Dr. Turki Alahmadi", title: "Pediatric Pulmonology Consultant", spec: "Pediatrics", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/fb1/3c2/67ffb13c26f99049140048.jpg" },
  { name: "Dr. Saud Bahaidarah", title: "Interventional Pediatric Cardiology Consultant", spec: "Pediatrics", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/fb8/4d4/67ffb84d4cf1c679927921.jpg" },
  { name: "Dr. Saniah Awidah", title: "Pediatric & Endocrinology Consultant", spec: "Pediatrics", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/fb9/44a/67ffb944a49e1976519084.jpg" },
  { name: "Dr. Riham Orabi", title: "Pediatric Specialist", spec: "Pediatrics", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/fc1/742/67ffc1742c124942130166.png" },
  { name: "Dr. Osama Bawazer", title: "Pediatric & Neonatology Surgery Consultant", spec: "Pediatrics", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/fc2/53c/67ffc253cb79f367290712.jpg" },
  { name: "Dr. Om Salamah Kamal", title: "Pediatric Specialist", spec: "Pediatrics", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/fc3/b01/67ffc3b0167c5481082474.jpg" },

  // PHYSIOTHERAPY (no specific doctors extracted with images)

  // PSYCHIATRY & PSYCHOLOGY
  // (not in extracted data with images)

  // PULMONOLOGY & SLEEP MEDICINE
  { name: "Dr. Faris Alhejaili", title: "Pulmonary & Sleep Medicine Consultant", spec: "Pulmonology & Sleep Medicine", img: "https://www.myclinic.com.sa/storage/app/uploads/public/680/0e7/526/6800e7526a0ba958768725.png" },

  // RHEUMATOLOGY
  { name: "Dr. Walaa Aldabbagh", title: "Internal Medicine & Rheumatology Consultant", spec: "Rheumatology", img: "https://www.myclinic.com.sa/storage/app/uploads/public/67f/faf/c0d/67ffafc0dc8ec954745864.jpg" },

  // UROLOGY (not in extracted data with images)
];

const outDir = join(process.cwd(), 'public', 'doctors');
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

function slugify(name) {
  return name.toLowerCase().replace(/^dr\.\s*/, '').replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
}

async function downloadImage(url, filename) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    const ext = url.match(/\.(jpg|jpeg|png)$/i)?.[1] || 'jpg';
    const fullPath = join(outDir, `${filename}.${ext}`);
    writeFileSync(fullPath, buffer);
    return `/doctors/${filename}.${ext}`;
  } catch (e) {
    console.error(`  FAILED: ${url} - ${e.message}`);
    return null;
  }
}

async function main() {
  console.log(`Processing ${rawDoctors.length} doctors...`);
  const results = [];

  for (let i = 0; i < rawDoctors.length; i++) {
    const doc = rawDoctors[i];
    const slug = slugify(doc.name);
    console.log(`[${i + 1}/${rawDoctors.length}] ${doc.name} (${doc.spec})`);

    const localImg = await downloadImage(doc.img, slug);
    if (localImg) {
      results.push({
        name: doc.name,
        title: doc.title,
        spec: doc.spec,
        img: localImg,
      });
    }
  }

  // Generate TypeScript data file
  const tsContent = `// Auto-generated from myclinic.com.sa - ${new Date().toISOString().split('T')[0]}
export const doctorsData = ${JSON.stringify(results, null, 2)} as const;

export type Doctor = (typeof doctorsData)[number];
`;

  writeFileSync(join(process.cwd(), 'app', 'doctors-data.ts'), tsContent);
  console.log(`\nDone! ${results.length} doctors saved to app/doctors-data.ts`);
  console.log(`Images saved to public/doctors/`);
}

main();

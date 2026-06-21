import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Map doctor names to their profile IDs
const doctorUrls = {
  "Dr. Shorooq Banjar": 296, "Dr. Husam Malibary": 205, "Dr. Salma Alkhammash": 101,
  "Dr. Jamil Waly": 198, "Dr. Saddiq Habiballah": 104, "Dr. Amer Khojah": 379,
  "Dr. Walaa Almasri": 419, "Dr. Faisal AlMuhizi": 469,
  "Dr. Eman Obaid": 248, "Dr. Eman Mahmoud": 249, "Dr. Anan Khattab": 310,
  "Dr. Nora Halawani": 35, "Dr. Maryam Bamashmous": 480,
  "Dr. Yosra Turkistani": 49, "Dr. Munawar Almajnoni": 140,
  "Dr. Mohammed Zahrani": 145, "Dr. Saeed Alghamdi": 302,
  "Dr. Khalid Aljohani": 411, "Dr. Khalid Bin Naji": 497,
  "Dr. Fotoun Abualfaraj": 32, "Dr. Walaa Alamoudi": 61, "Dr. Wafaa Kattan": 63,
  "Dr. Usra Khadwardi": 67, "Dr. Tahani Azizalrahman": 72, "Dr. Siraj Dakhil": 79,
  "Dr. Shahad Abudawood": 86, "Dr. Rami Saab": 117, "Dr. Nawras Kherallah": 131,
  "Dr. Muthanna Bajnied": 138, "Dr. Mohammed Hefne": 148,
  "Dr. Hisham Komo": 209, "Dr. Hani Mawardi": 222,
  "Dr. Fahad Aladwani": 240, "Dr. Dana Alyafi": 255,
  "Dr. Ammar Almarghlani": 257, "Dr. Lilian Bahha": 269,
  "Dr. Taha Habibullah": 74, "Dr. Soad Mandoura": 78, "Dr. Shereen Al Khilafi": 82,
  "Dr. Maysoon Algain": 172, "Dr. Jehad Hariri": 196,
  "Dr. Amira EL Tawdy": 345, "Dr. Mohammad Munshi": 490,
  "Dr. Mohammed Elamin": 149, "Dr. Ahdab Abdulaziz": 316, "Dr. Safwan Almawal": 397,
  "Dr. Saud Alzahrani": 90, "Dr. Reem Alnazawi": 111,
  "Dr. Hussein Elbadawi": 203, "Dr. Hani Shalabi": 221, "Dr. Ahmad Imam": 304,
  "Dr. Yousuf Alqurashi": 47, "Dr. Waleed Eid": 57, "Dr. Wael Abdelkafy": 65,
  "Dr. Saleh Alghamdi": 103, "Dr. Rajiah Murad": 119,
  "Dr. Ibrahim Alnoury": 201, "Dr. Abdullah Bahakim": 311,
  "Dr. Wail Yar": 62, "Dr. Shoroug Ibrahim": 80, "Dr. Sharifa Alshehri": 84,
  "Dr. Mohammed Aljunaid": 150, "Dr. Khaled Yaghmour": 191, "Dr. Rania Harere": 382,
  "Dr. Yasir Khayyat": 50, "Dr. Mohammed Alfawaz": 151, "Dr. Haziz Albiladi": 213,
  "Dr. Mohammad Abbas": 158, "Dr. Ahmed Alzahrani": 283,
  "Dr. Baraah Tatwany": 340, "Dr. Abdullah Abdullah": 341,
  "Dr. Hashim Balubaid": 456,
  "Dr. Ashraf Warsi": 292, "Dr. Abdulkareem Almomen": 477,
  "Dr. Walaa Aldabbagh": 60, "Dr. Suhail Khojah": 76, "Dr. Sarah Dahlan": 92,
  "Dr. Mohsen Baduqayl": 143, "Dr. Majed Alnabulsi": 182,
  "Dr. Hanaa Ragab": 224, "Dr. Mohammed Samannodi": 285,
  "Dr. Sami Al Obaidi": 96, "Dr. Enad Alsolami": 247,
  "Dr. Omar Ashour": 124, "Dr. Nada Kalakattawi": 137,
  "Dr. Rami Algahtani": 118, "Dr. Nesreen Ashour": 130,
  "Dr. Khaled Albazli": 192, "Dr. Hassan Jaber": 218,
  "Dr. Fawaz Alhumaid": 234, "Dr. Raed Altayeb": 372,
  "Dr. Lina Akkad": 39, "Dr. Amal Alandejani": 321, "Dr. Sara Aleid": 401,
  "Dr. Wael Auwad": 4, "Dr. Ahmad Alwazzan": 18, "Dr. Hatim Aljifree": 14,
  "Dr. Hanin Abduljabar": 15, "Dr. Nedaa Bahkali": 10, "Dr. Osama Bajouh": 8,
  "Dr. Abdullah Khafagy": 319,
  "Dr. Nooran Badeeb": 128, "Dr. Nawaf Al Marzouki": 133,
  "Dr. Lujain Idriss": 185, "Dr. Albaraa AlQassimi": 277, "Dr. Aziz Albalawi": 284,
  "Dr. Taha Samman": 73, "Dr. Hamza Alofi": 225,
  "Dr. Fayig Sawaf": 232, "Dr. Ayman Awlia": 362, "Dr. Bandar Hetaimish": 363,
  "Dr. Turki Alahmadi": 70, "Dr. Saud Bahaidarah": 89,
  "Dr. Saniah Awidah": 95, "Dr. Riham Orabi": 107,
  "Dr. Osama Bawazer": 122, "Dr. Om Salamah Kamal": 125,
  "Dr. Faris Alhejaili": 237,
};

// Load existing doctors data
const dataPath = join(process.cwd(), 'app', 'doctors-data.ts');
const dataContent = readFileSync(dataPath, 'utf-8');
const match = dataContent.match(/export const doctorsData = (\[[\s\S]*?\]) as const/);
const doctors = JSON.parse(match[1]);

async function fetchDoctorDetail(id) {
  const url = `https://www.myclinic.com.sa/doctor-detail/${id}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const html = await res.text();

    // Extract education - look for qualifications/education section
    const educationMatches = [];
    // Look for text that appears to be qualifications
    const eduPatterns = [
      /Board[^<]{3,80}/gi,
      /Fellowship[^<]{3,80}/gi,
      /Master[^<]{3,60}/gi,
      /Bachelor[^<]{3,60}/gi,
      /M\.?B\.?B\.?S[^<]{0,60}/gi,
      /M\.?D\.?[^<]{0,60}/gi,
      /Ph\.?D[^<]{3,60}/gi,
      /Diploma[^<]{3,60}/gi,
      /Certificate[^<]{3,60}/gi,
      /MRCP[^<]{0,60}/gi,
      /FRCS[^<]{0,60}/gi,
      /FRCPC[^<]{0,60}/gi,
    ];

    for (const pat of eduPatterns) {
      const m = html.matchAll(pat);
      for (const found of m) {
        let text = found[0].replace(/<[^>]*>/g, '').trim();
        // Clean up HTML entities
        text = text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#039;/g, "'");
        if (text.length > 5 && text.length < 200 && !educationMatches.includes(text)) {
          educationMatches.push(text);
        }
      }
    }

    // Extract languages
    let languages = "Arabic, English"; // default
    const langMatch = html.match(/(?:Languages?|اللغات)[^<]*<[^>]*>([^<]*(?:Arabic|English|French|Urdu|Hindi|Turkish|German|Spanish)[^<]*)/i);
    if (langMatch) {
      languages = langMatch[1].replace(/<[^>]*>/g, '').trim();
    }
    // Also try simpler pattern
    const langBlock = html.match(/((?:Arabic|English)(?:\s*[,،&]\s*(?:Arabic|English|French|Urdu|Hindi|Turkish|German|Spanish))*)/i);
    if (langBlock) {
      languages = langBlock[1].replace(/،/g, ',').trim();
    }

    // Extract location
    let location = "";
    const locMatch = html.match(/(?:Jeddah|Riyadh)\s*(?:Al\s*)?[A-Za-z]+/i);
    if (locMatch) {
      location = locMatch[0].trim();
    }

    return {
      education: educationMatches.slice(0, 4), // max 4 items
      languages,
      location,
    };
  } catch (e) {
    console.error(`  Error fetching ${id}: ${e.message}`);
    return null;
  }
}

async function main() {
  console.log(`Fetching details for ${doctors.length} doctors...`);

  const BATCH_SIZE = 5;
  const updatedDoctors = [...doctors];

  for (let i = 0; i < updatedDoctors.length; i += BATCH_SIZE) {
    const batch = updatedDoctors.slice(i, i + BATCH_SIZE);
    const promises = batch.map(async (doc, idx) => {
      const id = doctorUrls[doc.name];
      if (!id) {
        console.log(`[${i + idx + 1}] ${doc.name} - NO URL, skipping`);
        return;
      }
      console.log(`[${i + idx + 1}/${updatedDoctors.length}] ${doc.name} (ID: ${id})`);
      const details = await fetchDoctorDetail(id);
      if (details) {
        updatedDoctors[i + idx] = {
          ...doc,
          education: details.education.length > 0 ? details.education : undefined,
          languages: details.languages || "Arabic, English",
          location: details.location || undefined,
        };
      }
    });
    await Promise.all(promises);
    // Small delay between batches
    if (i + BATCH_SIZE < updatedDoctors.length) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  // Clean undefined values
  const cleanDoctors = updatedDoctors.map(doc => {
    const clean = { name: doc.name, title: doc.title, spec: doc.spec, img: doc.img };
    if (doc.education?.length) clean.education = doc.education;
    if (doc.languages) clean.languages = doc.languages;
    if (doc.location) clean.location = doc.location;
    return clean;
  });

  // Write updated TypeScript data file
  const tsContent = `// Auto-generated from myclinic.com.sa - ${new Date().toISOString().split('T')[0]}
export const doctorsData = ${JSON.stringify(cleanDoctors, null, 2)};

export type Doctor = (typeof doctorsData)[number];
`;

  writeFileSync(dataPath, tsContent);

  const withEdu = cleanDoctors.filter(d => d.education?.length > 0).length;
  const withLoc = cleanDoctors.filter(d => d.location).length;
  console.log(`\nDone! Updated ${cleanDoctors.length} doctors`);
  console.log(`  With education: ${withEdu}`);
  console.log(`  With location: ${withLoc}`);
}

main();

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const dataPath = join(process.cwd(), 'app', 'doctors-data.ts');
const dataContent = readFileSync(dataPath, 'utf-8');
const match = dataContent.match(/export const doctorsData = (\[[\s\S]*?\]);/);
const doctors = JSON.parse(match[1]);

function cleanEducation(eduArray) {
  if (!eduArray) return [];
  return eduArray
    .filter(e => {
      // Remove entries with HTML artifacts
      if (e.includes('<') || e.includes('>') || e.includes('\"') || e.includes('style=')) return false;
      if (e.includes('md-') || e.includes('phone-call') || e.includes('class=')) return false;
      if (e.includes('color:') || e.includes('text-decoration')) return false;
      if (e.length < 8) return false;
      return true;
    })
    .map(e => {
      // Clean up text
      return e
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#039;/g, "'")
        .replace(/\s+/g, ' ')
        .trim();
    })
    .filter((e, i, arr) => arr.indexOf(e) === i); // dedupe
}

const cleaned = doctors.map(doc => {
  const clean = {
    name: doc.name,
    title: doc.title,
    spec: doc.spec,
    img: doc.img,
  };

  const edu = cleanEducation(doc.education);
  if (edu.length > 0) clean.education = edu;
  if (doc.languages) clean.languages = doc.languages;
  if (doc.location) clean.location = doc.location;

  return clean;
});

const tsContent = `// Auto-generated from myclinic.com.sa - ${new Date().toISOString().split('T')[0]}
export const doctorsData = ${JSON.stringify(cleaned, null, 2)};

export type Doctor = (typeof doctorsData)[number];
`;

writeFileSync(dataPath, tsContent);

const withEdu = cleaned.filter(d => d.education?.length > 0).length;
console.log(`Cleaned ${cleaned.length} doctors`);
console.log(`  With clean education: ${withEdu}`);
console.log(`\nSample:`, JSON.stringify(cleaned[0], null, 2));
console.log(`\nSample 2:`, JSON.stringify(cleaned[15], null, 2));

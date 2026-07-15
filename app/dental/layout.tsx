// Dental section uses the root LangProvider via app/layout.tsx — this layout
// adds the dental page chrome and loads the dentists once for every page
// beneath it (the hub plus all 16 service pages).
//
// The dentists used to come from the hardcoded app/doctors-data.ts, so the CMS
// could not change them. They now come from the `doctors` table; reading them
// here (a server component) rather than in the strip (a client component) keeps
// the names in the server-rendered HTML.
import { DoctorsProvider } from "@/app/components/DoctorsProvider";
import { getDoctorsBySpecialty } from "@/app/lib/doctors";

// Backstop only — doctor mutations call revalidatePath("/", "layout"), so CMS
// edits show up on the next request rather than when this timer lapses.
export const revalidate = 300;

export default async function DentalLayout({ children }: { children: React.ReactNode }) {
  // null = no limit: the strip lists every dentist, not the default 16.
  const dentists = await getDoctorsBySpecialty("Dental", null).catch(() => []);

  return (
    <div className="font-body antialiased">
      <DoctorsProvider doctors={dentists}>{children}</DoctorsProvider>
    </div>
  );
}

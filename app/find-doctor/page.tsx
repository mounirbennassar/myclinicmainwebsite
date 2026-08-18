import { Suspense } from "react";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";
import { getAllActiveDoctors, orderDoctorsForDisplay } from "@/app/lib/doctors";
import DoctorDirectory from "./DoctorDirectory";

// Dashboard edits purge this via revalidatePath(); the timer is just the
// backstop for when that doesn't land. See app/page.tsx.
export const revalidate = 300;

export default async function FindADoctorPage() {
  // Same sequence as the home "World-Class Medical Minds" carousel: featured
  // doctors pinned first, then the deterministic specialty mix. The directory
  // preserves incoming order when browsing (search re-ranks by relevance,
  // which should win), so what the visitor sees here matches the home page.
  const doctors = orderDoctorsForDisplay(await getAllActiveDoctors());
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <SiteNav />
      <main className="flex-1">
        <Suspense fallback={<div className="min-h-[60vh]" />}>
          <DoctorDirectory doctors={doctors} />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}

import { Suspense } from "react";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";
import { getAllActiveDoctors } from "@/app/lib/doctors";
import DoctorDirectory from "./DoctorDirectory";

// Re-generate the directory hourly (doctors change rarely; dashboard edits can
// trigger on-demand revalidation later).
export const revalidate = 3600;

export default async function FindADoctorPage() {
  const doctors = await getAllActiveDoctors();
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

import { Suspense } from "react";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";
import { getAllActiveDoctors } from "@/app/lib/doctors";
import DoctorDirectory from "./DoctorDirectory";

// Dashboard edits purge this via revalidatePath(); the timer is just the
// backstop for when that doesn't land. See app/page.tsx.
export const revalidate = 300;

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

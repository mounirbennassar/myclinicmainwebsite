import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteNav from "@/app/components/SiteNav";
import SiteFooter from "@/app/components/SiteFooter";
import { getDoctorBySlug, getAllDoctorSlugs } from "@/app/lib/doctors";
import DoctorProfile from "./DoctorProfile";

// Prerendered at build for every active slug. An edit purges this page by its
// literal path (revalidateDoctorPages), so the timer is only the backstop.
export const revalidate = 300;
export const dynamicParams = true; // render doctors added after build on-demand

export async function generateStaticParams() {
  // Prerendering the roster is an optimization, not a requirement: with
  // dynamicParams above, any slug missing from this list still renders on
  // demand at request time. Letting a database blip throw here instead takes
  // the whole build down — `next build` dies with "Failed to collect page data
  // for /doctors/[slug]" and the deploy fails, even though every other page
  // compiled fine. Degrade to zero prerendered profiles instead.
  try {
    const slugs = await getAllDoctorSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doctor = await getDoctorBySlug(slug);
  if (!doctor) return { title: "Doctor — My Clinic | عيادتي" };
  const spec = doctor.specialty_raw || doctor.specialties[0] || "";
  const title = `${doctor.name_en}${spec ? ` — ${spec}` : ""} | My Clinic عيادتي`;
  const description = `${doctor.name_en}${spec ? `, ${spec}` : ""} at My Clinic${doctor.cities.length ? ` (${doctor.cities.join(", ")})` : ""}. Book an appointment online.`;
  return {
    title,
    description,
    alternates: { canonical: `/doctors/${doctor.slug}` },
    openGraph: {
      title,
      description,
      images: doctor.image_url ? [{ url: doctor.image_url, alt: doctor.name_en }] : undefined,
      type: "profile",
    },
  };
}

export default async function DoctorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doctor = await getDoctorBySlug(slug);
  if (!doctor || !doctor.is_active) notFound();

  return (
    <div className="min-h-screen bg-surface flex flex-col font-body antialiased">
      <SiteNav />
      <main className="flex-1">
        <DoctorProfile doctor={doctor} />
      </main>
      <SiteFooter />
    </div>
  );
}

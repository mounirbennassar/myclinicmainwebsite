import { NextResponse } from "next/server";
import { getAllActiveDoctors, getDoctorsBySpecialty } from "@/app/lib/doctors";

// Public read endpoint for carousels. Cached + revalidated hourly.
export const revalidate = 3600;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const specialty = searchParams.get("specialty");
    const limitParam = Number(searchParams.get("limit"));
    const limit = Number.isFinite(limitParam) && limitParam > 0 ? limitParam : undefined;

    const doctors = specialty
      ? await getDoctorsBySpecialty(specialty, limit ?? 16)
      : await getAllActiveDoctors();

    return NextResponse.json({ doctors });
  } catch {
    return NextResponse.json({ error: "Failed to fetch doctors" }, { status: 500 });
  }
}

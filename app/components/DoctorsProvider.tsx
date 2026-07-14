"use client";
import { createContext, useContext } from "react";
import type { Doctor } from "@/app/lib/doctors";

/**
 * Carries a section's doctors from its *server* layout down to the client
 * components that render them (the dental + pediatric strips).
 *
 * Those pages are client components all the way down, so they cannot query the
 * DB themselves, and fetching in a useEffect would keep the doctor names out of
 * the server-rendered HTML. Reading them in the server layout and handing them
 * over as props keeps the names in the SSR output — and means every page under
 * the layout (all 16 dental service pages included) gets them for free.
 */
const DoctorsContext = createContext<Doctor[]>([]);

export function DoctorsProvider({
  doctors,
  children,
}: {
  doctors: Doctor[];
  children: React.ReactNode;
}) {
  return <DoctorsContext.Provider value={doctors}>{children}</DoctorsContext.Provider>;
}

export function useDoctors(): Doctor[] {
  return useContext(DoctorsContext);
}

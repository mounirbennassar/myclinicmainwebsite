"use client";
import { useState, useEffect, createContext, useContext, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";

type User = {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "admin" | "agent";
  allowed_cities: string[];
  can_export: boolean;
};

const UserContext = createContext<User | null>(null);
export const useUser = () => useContext(UserContext);

export type Vertical = "all" | "medical" | "dental" | "pediatric";

// Reads the ?vertical= query param. "all" means no filter.
export function useVertical(): Vertical {
  const params = useSearchParams();
  const v = params.get("vertical");
  return v === "medical" || v === "dental" || v === "pediatric" ? v : "all";
}

// Shared display metadata so the dashboard, reports, and any future
// vertical-scoped view label the active segment identically.
export const VERTICAL_LABELS: Record<Vertical, string> = {
  all: "All verticals",
  medical: "Medical",
  dental: "Dental",
  pediatric: "Pediatric",
};

export const VERTICAL_BADGE: Record<Vertical, string> = {
  all: "bg-slate-100 text-slate-600",
  medical: "bg-[#004d99]/10 text-[#004d99]",
  dental: "bg-teal-500/10 text-teal-700",
  pediatric: "bg-amber-500/10 text-amber-700",
};

function VerticalToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const current = useVertical();

  const setVertical = (v: Vertical) => {
    const next = new URLSearchParams(params.toString());
    if (v === "all") next.delete("vertical");
    else next.set("vertical", v);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const opts: { value: Vertical; label: string }[] = [
    { value: "all", label: "All" },
    { value: "medical", label: "Medical" },
    { value: "dental", label: "Dental" },
    { value: "pediatric", label: "Pediatric" },
  ];

  return (
    <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-[11px] font-semibold">
      {opts.map((o) => (
        <button
          key={o.value}
          onClick={() => setVertical(o.value)}
          className={`px-2.5 py-1 rounded-md transition-colors ${
            current === o.value ? "bg-white text-[#004d99] shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50/50" />}>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </Suspense>
  );
}

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const vertical = useVertical();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setUser(d.user))
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-slate-200 border-t-[#004d99] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  // Carry the active vertical across tabs so the segment stays "sticky" — pick
  // Dental on Appointments and the Reports tab opens scoped to Dental too,
  // instead of silently resetting to All. (UTM/Team ignore it; it just rides
  // along so returning to a vertical-aware page restores the selection.)
  const vQuery = vertical !== "all" ? `?vertical=${vertical}` : "";
  const navItems = [
    { label: "Appointments", href: `/dashboard${vQuery}`, active: pathname === "/dashboard" },
    ...(user.role === "super_admin" || user.role === "admin"
      ? [
          { label: "Reports", href: `/dashboard/reports${vQuery}`, active: pathname === "/dashboard/reports" },
          { label: "UTM Links", href: `/dashboard/utm${vQuery}`, active: pathname === "/dashboard/utm" },
          { label: "Doctors", href: `/dashboard/doctors${vQuery}`, active: pathname === "/dashboard/doctors" },
          { label: "Team", href: `/dashboard/team${vQuery}`, active: pathname === "/dashboard/team" },
        ]
      : []),
  ];

  return (
    <UserContext.Provider value={user}>
      <div dir="ltr" lang="en" className="min-h-screen bg-slate-50/50" style={{ fontFamily: "var(--font-manrope), sans-serif" }}>
        <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Image src="/logo-dark.svg" alt="My Clinic" width={120} height={28} className="h-7 w-auto" />
              <div className="w-px h-5 bg-slate-200 hidden md:block" />
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      item.active
                        ? "bg-[#004d99]/10 text-[#004d99]"
                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-3">
              {(user.role === "super_admin" || user.role === "admin") && pathname.startsWith("/dashboard") && pathname !== "/dashboard/team" && pathname !== "/dashboard/utm" && pathname !== "/dashboard/whatsapp" && pathname !== "/dashboard/doctors" && (
                <VerticalToggle />
              )}
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-semibold text-slate-700">{user.name}</span>
                <span className="text-[10px] text-slate-400">{user.role === "super_admin" ? "Super Admin" : user.role === "admin" ? "Admin" : "Agent"}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#004d99] flex items-center justify-center text-white text-xs font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
                title="Logout"
              >
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
              </button>
            </div>
          </div>
          {/* Mobile nav */}
          <div className="md:hidden border-t border-slate-100 px-4 py-2 flex gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  item.active
                    ? "bg-[#004d99]/10 text-[#004d99]"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </header>
        {children}
      </div>
    </UserContext.Provider>
  );
}

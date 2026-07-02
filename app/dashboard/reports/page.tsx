"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useUser, useVertical, VERTICAL_LABELS, VERTICAL_BADGE } from "../layout";
import { useRouter } from "next/navigation";
import { dentalServiceCatalog } from "../../dental/content/services";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";

type Appointment = {
  id: string;
  city: string;
  name: string;
  phone: string;
  status: string;
  created_at: string;
  assigned_to: string | null;
  assigned_to_name: string | null;
  status_changed_by: string | null;
  status_changed_at: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_link_id: string | null;
  vertical: string | null;
  service: string | null;
};

type CampaignRow = {
  key: string;
  campaign: string;
  source: string;
  medium: string;
  leads: number;
  booked: number;
  notEligible: number;
  clicks: number;
  convRate: number;
};

type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
};

type Period = "today" | "week" | "month" | "custom";

const STATUS_LABELS: Record<string, string> = {
  new: "Inquiry",
  out_of_jeddah: "Out of Jeddah",
  out_of_riyadh: "Out of Riyadh",
  wrong_no: "Wrong No",
  duplicate: "Duplicate",
  no_answer: "No Answer",
  not_interested: "Not Interested",
  by_mistake: "By Mistake",
  not_eligible: "Not Eligible",
  dental: "Dental",
  booked: "Booked",
  // Legacy values — retained so historical records still render a readable label.
  contacted: "Contacted",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  completed: "Completed",
};

const statusLabel = (s: string) =>
  STATUS_LABELS[s] || (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

const STATUS_COLORS_MAP: Record<string, string> = {
  new: "#3b82f6",
  out_of_jeddah: "#94a3b8",
  out_of_riyadh: "#64748b",
  wrong_no: "#ef4444",
  duplicate: "#a1a1aa",
  no_answer: "#f59e0b",
  not_interested: "#dc2626",
  by_mistake: "#78716c",
  not_eligible: "#52525b",
  dental: "#14b8a6",
  booked: "#10b981",
  // Legacy
  contacted: "#f59e0b",
  confirmed: "#10b981",
  cancelled: "#ef4444",
  completed: "#64748b",
};

// Treat legacy success states as booked so historical conversion rates stay comparable.
const BOOKED_STATUSES = ["booked", "confirmed", "completed"];
const isBooked = (s: string) => BOOKED_STATUSES.includes(s);
// "Lost" was a catch-all for several rejection statuses. The report now focuses
// on Not Eligible specifically so we can break it down by reason.
const isNotEligible = (s: string) => s === "not_eligible";

function getDateRange(period: Period, customStart?: string, customEnd?: string): { start: Date; end: Date } {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayEnd.getDate() + 1);

  switch (period) {
    case "today":
      return { start: todayStart, end: todayEnd };
    case "week": {
      const weekStart = new Date(todayStart);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      return { start: weekStart, end: todayEnd };
    }
    case "month": {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      return { start: monthStart, end: todayEnd };
    }
    case "custom": {
      const s = customStart ? new Date(customStart) : todayStart;
      const e = customEnd ? new Date(customEnd) : todayEnd;
      e.setDate(e.getDate() + 1);
      return { start: s, end: e };
    }
  }
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

export default function ReportsPage() {
  const user = useUser();
  const vertical = useVertical();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [utmLinks, setUtmLinks] = useState<{ id: string; campaign: string; source: string; medium: string; clicks: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>("month");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [showExportMenu, setShowExportMenu] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.role !== "super_admin" && user.role !== "admin" && user.role !== "marketing") {
      router.push("/dashboard");
    }
  }, [user, router]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [apptRes, teamRes, utmRes] = await Promise.all([
        fetch("/api/appointments"),
        fetch("/api/team"),
        fetch("/api/utm"),
      ]);
      const [apptJson, teamJson, utmJson] = await Promise.all([apptRes.json(), teamRes.json(), utmRes.json()]);
      if (apptRes.ok) setAppointments(apptJson.data || []);
      if (teamRes.ok) setTeam(teamJson.data || []);
      if (utmRes.ok) setUtmLinks(utmJson.data || []);
    } catch { /* silent */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const { start, end } = useMemo(() => getDateRange(period, customStart, customEnd), [period, customStart, customEnd]);

  const filtered = useMemo(() =>
    appointments.filter((a) => {
      const d = new Date(a.created_at);
      const v = a.vertical || "medical";
      const matchVertical = vertical === "all" || v === vertical;
      return d >= start && d < end && matchVertical;
    }),
  [appointments, start, end, vertical]);

  const agents = useMemo(() => team.filter((m) => m.role === "agent"), [team]);
  const admins = useMemo(() => team.filter((m) => m.role === "admin" || m.role === "super_admin"), [team]);

  // ── KPI Stats ──
  const kpi = useMemo(() => {
    const total = filtered.length;
    const sInquiry = filtered.filter((a) => a.status === "new").length;
    const sNoAnswer = filtered.filter((a) => a.status === "no_answer").length;
    const sBooked = filtered.filter((a) => isBooked(a.status)).length;
    const sDental = filtered.filter((a) => a.status === "dental").length;
    const sLost = filtered.filter((a) => isNotEligible(a.status)).length;
    const responded = total - sInquiry;
    const responseRate = total > 0 ? Math.round((responded / total) * 100) : 0;
    const conversionRate = total > 0 ? Math.round((sBooked / total) * 100) : 0;
    return { total, sInquiry, sNoAnswer, sBooked, sDental, sLost, responseRate, conversionRate };
  }, [filtered]);

  // ── Leads Over Time ──
  const leadsOverTime = useMemo(() => {
    const map = new Map<string, { date: string; total: number; inquiry: number; booked: number; lost: number }>();
    filtered.forEach((a) => {
      const d = new Date(a.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
      if (!map.has(d)) map.set(d, { date: d, total: 0, inquiry: 0, booked: 0, lost: 0 });
      const entry = map.get(d)!;
      entry.total++;
      if (a.status === "new") entry.inquiry++;
      if (isBooked(a.status)) entry.booked++;
      if (isNotEligible(a.status)) entry.lost++;
    });
    return Array.from(map.values());
  }, [filtered]);

  // ── Status Distribution ──
  const statusDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    filtered.forEach((a) => { counts[a.status] = (counts[a.status] || 0) + 1; });
    return Object.entries(counts)
      .map(([name, value]) => ({ name: statusLabel(name), value, color: STATUS_COLORS_MAP[name] || "#94a3b8" }))
      .sort((a, b) => b.value - a.value);
  }, [filtered]);

  // ── City Distribution ──
  const cityDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    filtered.forEach((a) => { counts[a.city] = (counts[a.city] || 0) + 1; });
    return Object.entries(counts).map(([city, count]) => ({ city, count }));
  }, [filtered]);

  // ── Agent Performance ──
  const agentPerformance = useMemo(() => {
    return agents.map((agent) => {
      const assigned = filtered.filter((a) => a.assigned_to === agent.id);
      const sInquiry = assigned.filter((a) => a.status === "new").length;
      const sNoAnswer = assigned.filter((a) => a.status === "no_answer").length;
      const sBooked = assigned.filter((a) => isBooked(a.status)).length;
      const sDental = assigned.filter((a) => a.status === "dental").length;
      const sLost = assigned.filter((a) => isNotEligible(a.status)).length;
      const total = assigned.length;
      const conversion = total > 0 ? Math.round((sBooked / total) * 100) : 0;
      return { id: agent.id, name: agent.name, total, sInquiry, sNoAnswer, sBooked, sDental, sLost, conversion };
    }).sort((a, b) => b.total - a.total);
  }, [agents, filtered]);

  // ── Leader Assignment Activity ──
  const leaderActivity = useMemo(() => {
    const assignedLeads = filtered.filter((a) => a.assigned_to);
    const leaderMap = new Map<string, { name: string; totalAssigned: number; booked: number; noAnswer: number; lost: number }>();

    admins.forEach((admin) => {
      leaderMap.set(admin.id, { name: admin.name, totalAssigned: 0, booked: 0, noAnswer: 0, lost: 0 });
    });

    // Count status changes by each leader (from status_changed_by field)
    assignedLeads.forEach((a) => {
      if (a.status_changed_by) {
        const changerName = a.status_changed_by.split(" (")[0];
        const leader = admins.find((l) => l.name === changerName);
        if (leader && leaderMap.has(leader.id)) {
          const entry = leaderMap.get(leader.id)!;
          entry.totalAssigned++;
          if (isBooked(a.status)) entry.booked++;
          if (a.status === "no_answer") entry.noAnswer++;
          if (isNotEligible(a.status)) entry.lost++;
        }
      }
    });

    return Array.from(leaderMap.values()).sort((a, b) => b.totalAssigned - a.totalAssigned);
  }, [admins, filtered]);

  // ── Daily Breakdown ──
  const dailyBreakdown = useMemo(() => {
    const map = new Map<string, { date: string; total: number; inquiry: number; noAnswer: number; booked: number; dental: number; lost: number; assigned: number }>();
    filtered.forEach((a) => {
      const d = new Date(a.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
      if (!map.has(d)) map.set(d, { date: d, total: 0, inquiry: 0, noAnswer: 0, booked: 0, dental: 0, lost: 0, assigned: 0 });
      const entry = map.get(d)!;
      entry.total++;
      if (a.status === "new") entry.inquiry++;
      if (a.status === "no_answer") entry.noAnswer++;
      if (isBooked(a.status)) entry.booked++;
      if (a.status === "dental") entry.dental++;
      if (isNotEligible(a.status)) entry.lost++;
      if (a.assigned_to) entry.assigned++;
    });
    return Array.from(map.values());
  }, [filtered]);

  // ── Campaign Performance ──
  const campaignPerformance = useMemo<CampaignRow[]>(() => {
    const map = new Map<string, CampaignRow>();
    filtered.forEach((a) => {
      if (!a.utm_campaign && !a.utm_source) return;
      const campaign = a.utm_campaign || "(none)";
      const source = a.utm_source || "(none)";
      const medium = a.utm_medium || "(none)";
      const key = `${campaign}__${source}__${medium}`;
      if (!map.has(key)) {
        map.set(key, { key, campaign, source, medium, leads: 0, booked: 0, notEligible: 0, clicks: 0, convRate: 0 });
      }
      const row = map.get(key)!;
      row.leads++;
      if (isBooked(a.status)) row.booked++;
      if (isNotEligible(a.status)) row.notEligible++;
    });

    // Merge click counts from utm_links (aggregate by campaign+source+medium)
    const clicksByKey = new Map<string, number>();
    utmLinks.forEach((l) => {
      const k = `${l.campaign}__${l.source}__${l.medium}`;
      clicksByKey.set(k, (clicksByKey.get(k) ?? 0) + (l.clicks ?? 0));
    });
    clicksByKey.forEach((clicks, key) => {
      if (!map.has(key)) {
        const [campaign, source, medium] = key.split("__");
        map.set(key, { key, campaign, source, medium, leads: 0, booked: 0, notEligible: 0, clicks, convRate: 0 });
      } else {
        map.get(key)!.clicks = clicks;
      }
    });

    return Array.from(map.values())
      .map((r) => ({ ...r, convRate: r.clicks > 0 ? Math.round((r.leads / r.clicks) * 100) : 0 }))
      .sort((a, b) => b.leads - a.leads || b.clicks - a.clicks);
  }, [filtered, utmLinks]);

  const getCampaignExportData = () =>
    campaignPerformance.map((c) => ({
      Campaign: c.campaign, Source: c.source, Medium: c.medium,
      Clicks: c.clicks, Leads: c.leads, Booked: c.booked, "Not Eligible": c.notEligible,
      "Click → Lead %": c.convRate,
    }));

  // ── Dental Page Performance (one row per dental service slug) ──
  // Always computed from `filtered`, so the date-range and vertical filters
  // already cascade. Service catalog drives the row order so unused pages
  // still appear with zeros — telling you which pages aren't pulling weight.
  const dentalPagePerformance = useMemo(() => {
    const counts = new Map<string, { leads: number; booked: number; noAnswer: number; lost: number; inquiry: number }>();
    filtered.forEach((a) => {
      if (a.vertical !== "dental" || !a.service) return;
      if (!counts.has(a.service)) {
        counts.set(a.service, { leads: 0, booked: 0, noAnswer: 0, lost: 0, inquiry: 0 });
      }
      const row = counts.get(a.service)!;
      row.leads++;
      if (a.status === "new") row.inquiry++;
      if (a.status === "no_answer") row.noAnswer++;
      if (isBooked(a.status)) row.booked++;
      if (isNotEligible(a.status)) row.lost++;
    });
    return dentalServiceCatalog.map((s) => {
      const c = counts.get(s.slug) || { leads: 0, booked: 0, noAnswer: 0, lost: 0, inquiry: 0 };
      const conv = c.leads > 0 ? Math.round((c.booked / c.leads) * 100) : 0;
      return { slug: s.slug, name: s.en, nameAr: s.ar, ...c, conv };
    }).sort((a, b) => b.leads - a.leads);
  }, [filtered]);

  const getDentalPageExportData = () =>
    dentalPagePerformance.map((r) => ({
      Page: r.name, Slug: `/dental/${r.slug}`,
      Leads: r.leads, Inquiry: r.inquiry, "No Answer": r.noAnswer,
      Booked: r.booked, "Not Eligible": r.lost, "Conversion %": r.conv,
    }));

  // ── Export Helpers ──
  // xlsx / jspdf are imported on demand inside the excel/pdf branches so the
  // heavy libraries stay out of the reports page bundle.
  const exportTable = async (data: Record<string, unknown>[], filename: string, format: "csv" | "excel" | "pdf") => {
    if (!data.length) return;

    if (format === "csv") {
      const headers = Object.keys(data[0]);
      const csv = [headers.join(","), ...data.map((r) => headers.map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `${filename}.csv`; a.click();
      URL.revokeObjectURL(url);
    } else if (format === "excel") {
      const XLSX = await import("xlsx");
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Report");
      XLSX.writeFile(wb, `${filename}.xlsx`);
    } else if (format === "pdf") {
      const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
        import("jspdf"),
        import("jspdf-autotable"),
      ]);
      const doc = new jsPDF();
      doc.setFontSize(14);
      doc.text(`My Clinic — ${filename}`, 14, 18);
      doc.setFontSize(8);
      doc.text(`Period: ${formatDate(start)} - ${formatDate(end)} | Exported: ${new Date().toLocaleString("en-GB")}`, 14, 25);
      autoTable(doc, {
        startY: 30,
        head: [Object.keys(data[0])],
        body: data.map((r) => Object.values(r).map((v) => String(v ?? ""))),
        styles: { fontSize: 7 },
        headStyles: { fillColor: [0, 77, 153] },
      });
      doc.save(`${filename}.pdf`);
    }
    setShowExportMenu(null);
  };

  const getAgentExportData = () =>
    agentPerformance.map((a) => ({
      Agent: a.name, Assigned: a.total, Inquiry: a.sInquiry, "No Answer": a.sNoAnswer,
      Booked: a.sBooked, Dental: a.sDental, "Not Eligible": a.sLost, "Conversion %": a.conversion,
    }));

  const getDailyExportData = () =>
    dailyBreakdown.map((d) => ({
      Date: d.date, Total: d.total, Inquiry: d.inquiry, "No Answer": d.noAnswer,
      Booked: d.booked, Dental: d.dental, "Not Eligible": d.lost, Assigned: d.assigned,
    }));

  const getLeadDetailExportData = () =>
    filtered.map((a) => ({
      Patient: a.name, Phone: a.phone, City: a.city,
      Status: statusLabel(a.status),
      "Assigned To": a.assigned_to_name || "Unassigned",
      "Status Changed By": a.status_changed_by || "-",
      "Status Changed At": a.status_changed_at ? new Date(a.status_changed_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) : "-",
      Submitted: new Date(a.created_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }),
    }));

  const ExportButton = ({ id, getData, filename }: { id: string; getData: () => Record<string, unknown>[]; filename: string }) => (
    <div className="relative">
      <button
        onClick={() => setShowExportMenu(showExportMenu === id ? null : id)}
        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white border border-slate-200 text-slate-500 hover:border-[#004d99]/40 hover:text-[#004d99] transition-colors"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
        Export
      </button>
      {showExportMenu === id && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setShowExportMenu(null)} />
          <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-40 min-w-[120px]">
            <button onClick={() => exportTable(getData(), filename, "excel")} className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2">
              <span className="w-4 text-center text-emerald-600 font-bold text-[9px]">XLS</span> Excel
            </button>
            <button onClick={() => exportTable(getData(), filename, "csv")} className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2">
              <span className="w-4 text-center text-blue-600 font-bold text-[9px]">CSV</span> CSV
            </button>
            <button onClick={() => exportTable(getData(), filename, "pdf")} className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2">
              <span className="w-4 text-center text-red-600 font-bold text-[9px]">PDF</span> PDF
            </button>
          </div>
        </>
      )}
    </div>
  );

  if (user?.role !== "super_admin" && user?.role !== "admin" && user?.role !== "marketing") return null;

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg font-bold text-slate-900">Reports</h1>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${VERTICAL_BADGE[vertical]}`}>
              {VERTICAL_LABELS[vertical]}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{formatDate(start)} - {formatDate(end)} &middot; {filtered.length} leads</p>
        </div>
        <div className="flex items-center gap-2">
          {(["today", "week", "month", "custom"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                period === p ? "bg-[#004d99] text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-[#004d99]/40"
              }`}
            >
              {p === "today" ? "Today" : p === "week" ? "This Week" : p === "month" ? "This Month" : "Custom"}
            </button>
          ))}
        </div>
      </div>

      {/* Custom date range */}
      {period === "custom" && (
        <div className="bg-white rounded-xl border border-slate-200/80 p-3 mb-6 flex flex-col md:flex-row gap-2 md:gap-3 items-end">
          <div className="flex-1">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">From</label>
            <input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="flex-1">
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">To</label>
            <input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-slate-200 border-t-[#004d99] rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
            {[
              { label: "Total Leads", value: kpi.total, color: "text-[#004d99]", bg: "bg-[#004d99]/5" },
              { label: "Inquiry", value: kpi.sInquiry, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "No Answer", value: kpi.sNoAnswer, color: "text-amber-600", bg: "bg-amber-50" },
              { label: "Booked", value: kpi.sBooked, color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Not Eligible", value: kpi.sLost, color: "text-slate-600", bg: "bg-slate-100" },
              { label: "Response Rate", value: `${kpi.responseRate}%`, color: "text-teal-600", bg: "bg-teal-50" },
              { label: "Conversion", value: `${kpi.conversionRate}%`, color: "text-purple-600", bg: "bg-purple-50" },
            ].map((s) => (
              <div key={s.label} className={`${s.bg} rounded-xl p-3 md:p-4`}>
                <p className={`text-xl md:text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {/* Leads Over Time */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-4 md:p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-800">Leads Over Time</h2>
                <ExportButton id="timeline" getData={getDailyExportData} filename={`leads-timeline-${new Date().toISOString().slice(0, 10)}`} />
              </div>
              {leadsOverTime.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={leadsOverTime} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                    <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} allowDecimals={false} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                    <Bar dataKey="total" fill="#004d99" radius={[4, 4, 0, 0]} name="Total" />
                    <Bar dataKey="booked" fill="#10b981" radius={[4, 4, 0, 0]} name="Booked" />
                    <Bar dataKey="lost" fill="#64748b" radius={[4, 4, 0, 0]} name="Not Eligible" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[260px] flex items-center justify-center text-sm text-slate-300">No data for this period</div>
              )}
            </div>

            {/* Status Distribution */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-4 md:p-5">
              <h2 className="text-sm font-bold text-slate-800 mb-4">Status Distribution</h2>
              {statusDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={statusDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`} style={{ fontSize: 11 }}>
                      {statusDistribution.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[260px] flex items-center justify-center text-sm text-slate-300">No data for this period</div>
              )}
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {/* City Distribution */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-4 md:p-5">
              <h2 className="text-sm font-bold text-slate-800 mb-4">Leads by City</h2>
              {cityDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={cityDistribution} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis type="number" tick={{ fontSize: 10, fill: "#94a3b8" }} allowDecimals={false} />
                    <YAxis type="category" dataKey="city" tick={{ fontSize: 11, fill: "#64748b" }} width={70} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                    <Bar dataKey="count" fill="#004d99" radius={[0, 4, 4, 0]} name="Leads" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-sm text-slate-300">No data</div>
              )}
            </div>

            {/* Agent Performance Chart */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-4 md:p-5">
              <h2 className="text-sm font-bold text-slate-800 mb-4">Agent Performance</h2>
              {agentPerformance.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={agentPerformance} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis type="number" tick={{ fontSize: 10, fill: "#94a3b8" }} allowDecimals={false} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} width={90} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                    <Bar dataKey="sBooked" stackId="a" fill="#10b981" name="Booked" />
                    <Bar dataKey="sNoAnswer" stackId="a" fill="#f59e0b" name="No Answer" />
                    <Bar dataKey="sInquiry" stackId="a" fill="#3b82f6" name="Inquiry" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-sm text-slate-300">No agents</div>
              )}
            </div>
          </div>

          {/* Agent Performance Table */}
          <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden mb-6">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800">Agent Performance Details</h2>
              <ExportButton id="agents" getData={getAgentExportData} filename={`agent-performance-${new Date().toISOString().slice(0, 10)}`} />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Agent</th>
                    <th className="text-center px-3 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Assigned</th>
                    <th className="text-center px-3 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Inquiry</th>
                    <th className="text-center px-3 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">No Answer</th>
                    <th className="text-center px-3 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Booked</th>
                    <th className="text-center px-3 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Dental</th>
                    <th className="text-center px-3 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Not Eligible</th>
                    <th className="text-center px-3 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Conversion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {agentPerformance.length === 0 ? (
                    <tr><td colSpan={8} className="text-center py-8 text-sm text-slate-300">No agent data</td></tr>
                  ) : (
                    agentPerformance.map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50/50">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-[10px] font-bold">{a.name.charAt(0)}</div>
                            <span className="text-sm font-medium text-slate-700">{a.name}</span>
                          </div>
                        </td>
                        <td className="text-center px-3 py-3 text-sm font-semibold text-slate-800">{a.total}</td>
                        <td className="text-center px-3 py-3 text-sm text-blue-600">{a.sInquiry}</td>
                        <td className="text-center px-3 py-3 text-sm text-amber-600">{a.sNoAnswer}</td>
                        <td className="text-center px-3 py-3 text-sm text-emerald-600">{a.sBooked}</td>
                        <td className="text-center px-3 py-3 text-sm text-teal-600">{a.sDental}</td>
                        <td className="text-center px-3 py-3 text-sm text-red-500">{a.sLost}</td>
                        <td className="text-center px-3 py-3">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${a.conversion >= 50 ? "bg-emerald-50 text-emerald-700" : a.conversion >= 25 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-600"}`}>
                            {a.conversion}%
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Leader Assignment Activity */}
          <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden mb-6">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-800">Leader / Admin Activity</h2>
              <p className="text-[10px] text-slate-400 mt-0.5">Status changes by leaders and admins on assigned leads</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Leader / Admin</th>
                    <th className="text-center px-3 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                    <th className="text-center px-3 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Booked</th>
                    <th className="text-center px-3 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">No Answer</th>
                    <th className="text-center px-3 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Not Eligible</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {leaderActivity.length === 0 || leaderActivity.every((l) => l.totalAssigned === 0) ? (
                    <tr><td colSpan={5} className="text-center py-8 text-sm text-slate-300">No leader activity in this period</td></tr>
                  ) : (
                    leaderActivity.filter((l) => l.totalAssigned > 0).map((l, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">{l.name.charAt(0)}</div>
                            <span className="text-sm font-medium text-slate-700">{l.name}</span>
                          </div>
                        </td>
                        <td className="text-center px-3 py-3 text-sm font-semibold text-slate-800">{l.totalAssigned}</td>
                        <td className="text-center px-3 py-3 text-sm text-emerald-600">{l.booked}</td>
                        <td className="text-center px-3 py-3 text-sm text-amber-600">{l.noAnswer}</td>
                        <td className="text-center px-3 py-3 text-sm text-red-500">{l.lost}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Campaign Performance */}
          <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden mb-6">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-800">Campaign Performance</h2>
                <p className="text-[10px] text-slate-400 mt-0.5">Clicks from /go short-links vs. leads attributed via utm_* params</p>
              </div>
              <ExportButton id="campaigns" getData={getCampaignExportData} filename={`campaign-performance-${new Date().toISOString().slice(0, 10)}`} />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Campaign</th>
                    <th className="text-left px-3 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Source / Medium</th>
                    <th className="text-center px-3 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Clicks</th>
                    <th className="text-center px-3 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Leads</th>
                    <th className="text-center px-3 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Booked</th>
                    <th className="text-center px-3 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Not Eligible</th>
                    <th className="text-center px-3 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Click → Lead</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {campaignPerformance.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-8 text-sm text-slate-300">No campaign data in this period</td></tr>
                  ) : (
                    campaignPerformance.map((c) => (
                      <tr key={c.key} className="hover:bg-slate-50/50">
                        <td className="px-5 py-3 text-sm font-medium text-slate-700">{c.campaign}</td>
                        <td className="px-3 py-3 text-xs text-slate-500">{c.source} <span className="text-slate-300">/</span> {c.medium}</td>
                        <td className="text-center px-3 py-3 text-sm font-semibold text-slate-800">{c.clicks}</td>
                        <td className="text-center px-3 py-3 text-sm font-semibold text-slate-800">{c.leads}</td>
                        <td className="text-center px-3 py-3 text-sm text-emerald-600">{c.booked}</td>
                        <td className="text-center px-3 py-3 text-sm text-slate-600">{c.notEligible}</td>
                        <td className="text-center px-3 py-3">
                          {c.clicks > 0 ? (
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.convRate >= 10 ? "bg-emerald-50 text-emerald-700" : c.convRate >= 3 ? "bg-amber-50 text-amber-700" : "bg-slate-50 text-slate-500"}`}>
                              {c.convRate}%
                            </span>
                          ) : <span className="text-xs text-slate-300">—</span>}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Dental Pages Performance — only when filtering to dental (or all) */}
          {(vertical === "dental" || vertical === "all") && (
            <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden mb-6">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-800">Dental Pages Performance</h2>
                  <p className="text-[10px] text-slate-400 mt-0.5">Leads attributed to each /dental landing page</p>
                </div>
                <ExportButton id="dentalPages" getData={getDentalPageExportData} filename={`dental-pages-${new Date().toISOString().slice(0, 10)}`} />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Landing Page</th>
                      <th className="text-center px-3 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Leads</th>
                      <th className="text-center px-3 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Inquiry</th>
                      <th className="text-center px-3 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">No Answer</th>
                      <th className="text-center px-3 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Booked</th>
                      <th className="text-center px-3 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Not Eligible</th>
                      <th className="text-center px-3 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Conversion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {dentalPagePerformance.every((r) => r.leads === 0) ? (
                      <tr><td colSpan={7} className="text-center py-8 text-sm text-slate-300">No dental leads in this period</td></tr>
                    ) : (
                      dentalPagePerformance.map((r) => (
                        <tr key={r.slug} className={`hover:bg-slate-50/50 ${r.leads === 0 ? "opacity-50" : ""}`}>
                          <td className="px-5 py-3">
                            <div>
                              <p className="text-sm font-medium text-slate-700">{r.name}</p>
                              <p className="text-[10px] text-slate-400 font-mono">/dental/{r.slug}</p>
                            </div>
                          </td>
                          <td className="text-center px-3 py-3 text-sm font-semibold text-slate-800">{r.leads}</td>
                          <td className="text-center px-3 py-3 text-sm text-blue-600">{r.inquiry}</td>
                          <td className="text-center px-3 py-3 text-sm text-amber-600">{r.noAnswer}</td>
                          <td className="text-center px-3 py-3 text-sm text-emerald-600">{r.booked}</td>
                          <td className="text-center px-3 py-3 text-sm text-red-500">{r.lost}</td>
                          <td className="text-center px-3 py-3">
                            {r.leads > 0 ? (
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${r.conv >= 50 ? "bg-emerald-50 text-emerald-700" : r.conv >= 25 ? "bg-amber-50 text-amber-700" : "bg-slate-50 text-slate-500"}`}>
                                {r.conv}%
                              </span>
                            ) : <span className="text-xs text-slate-300">—</span>}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Daily Breakdown */}
          <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden mb-6">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800">Daily Breakdown</h2>
              <ExportButton id="daily" getData={getDailyExportData} filename={`daily-breakdown-${new Date().toISOString().slice(0, 10)}`} />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                    <th className="text-center px-3 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total</th>
                    <th className="text-center px-3 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Inquiry</th>
                    <th className="text-center px-3 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">No Answer</th>
                    <th className="text-center px-3 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Booked</th>
                    <th className="text-center px-3 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Dental</th>
                    <th className="text-center px-3 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Not Eligible</th>
                    <th className="text-center px-3 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Assigned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {dailyBreakdown.length === 0 ? (
                    <tr><td colSpan={8} className="text-center py-8 text-sm text-slate-300">No data for this period</td></tr>
                  ) : (
                    dailyBreakdown.map((d, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="px-5 py-3 text-sm font-medium text-slate-700">{d.date}</td>
                        <td className="text-center px-3 py-3 text-sm font-semibold text-slate-800">{d.total}</td>
                        <td className="text-center px-3 py-3 text-sm text-blue-600">{d.inquiry}</td>
                        <td className="text-center px-3 py-3 text-sm text-amber-600">{d.noAnswer}</td>
                        <td className="text-center px-3 py-3 text-sm text-emerald-600">{d.booked}</td>
                        <td className="text-center px-3 py-3 text-sm text-teal-600">{d.dental}</td>
                        <td className="text-center px-3 py-3 text-sm text-red-500">{d.lost}</td>
                        <td className="text-center px-3 py-3 text-sm text-slate-500">{d.assigned}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detailed Lead Report */}
          <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-800">Detailed Lead Report</h2>
                <p className="text-[10px] text-slate-400 mt-0.5">{filtered.length} leads in period</p>
              </div>
              <ExportButton id="details" getData={getLeadDetailExportData} filename={`lead-details-${new Date().toISOString().slice(0, 10)}`} />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Patient</th>
                    <th className="text-left px-3 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Phone</th>
                    <th className="text-left px-3 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">City</th>
                    <th className="text-left px-3 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="text-left px-3 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Assigned To</th>
                    <th className="text-left px-3 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Changed By</th>
                    <th className="text-left px-3 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-8 text-sm text-slate-300">No leads in this period</td></tr>
                  ) : (
                    filtered.slice(0, 100).map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50/50">
                        <td className="px-5 py-2.5 text-sm font-medium text-slate-700">{a.name}</td>
                        <td className="px-3 py-2.5 text-sm text-slate-600">{a.phone}</td>
                        <td className="px-3 py-2.5 text-sm text-slate-600">{a.city}</td>
                        <td className="px-3 py-2.5">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md" style={{ backgroundColor: `${STATUS_COLORS_MAP[a.status] || "#94a3b8"}15`, color: STATUS_COLORS_MAP[a.status] || "#94a3b8" }}>
                            {statusLabel(a.status)}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-xs text-slate-500">{a.assigned_to_name || <span className="text-slate-300">-</span>}</td>
                        <td className="px-3 py-2.5">
                          {a.status_changed_by ? (
                            <div>
                              <p className="text-[10px] text-slate-500">{a.status_changed_by}</p>
                              {a.status_changed_at && <p className="text-[9px] text-slate-300">{new Date(a.status_changed_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</p>}
                            </div>
                          ) : <span className="text-xs text-slate-300">-</span>}
                        </td>
                        <td className="px-3 py-2.5">
                          <p className="text-xs text-slate-500">{new Date(a.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</p>
                          <p className="text-[9px] text-slate-300">{new Date(a.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</p>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {filtered.length > 100 && (
                <div className="px-5 py-3 border-t border-slate-100 text-center">
                  <p className="text-xs text-slate-400">Showing first 100 of {filtered.length} leads. Export for full data.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </main>
  );
}

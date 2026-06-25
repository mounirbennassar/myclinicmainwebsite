"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useUser, useVertical, VERTICAL_LABELS, VERTICAL_BADGE } from "./layout";
import { dentalServiceCatalog } from "../dental/content/services";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Appointment = {
  id: string;
  city: string;
  branch: string;
  department: string;
  name: string;
  phone: string;
  status: string;
  created_at: string;
  status_changed_by: string | null;
  status_changed_at: string | null;
  assigned_to: string | null;
  assigned_to_name: string | null;
  channel: string | null;
  note: string | null;
  created_by: string | null;
  vertical: string | null;
  service: string | null;
};

type Agent = {
  id: string;
  name: string;
  role: string;
  is_active: boolean;
};

// Keep legacy values ("new", "contacted", "confirmed", "cancelled", "completed") working for
// historical records; the active dropdown lists only the labels below. The value "new" is the
// initial stage and is relabeled "Inquiry" — renaming the underlying key would have required a
// data migration the user explicitly wanted to avoid.
const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "new", label: "Inquiry" },
  { value: "out_of_jeddah", label: "Out of Jeddah" },
  { value: "out_of_riyadh", label: "Out of Riyadh" },
  { value: "wrong_no", label: "Wrong No" },
  { value: "duplicate", label: "Duplicate" },
  { value: "no_answer", label: "No Answer" },
  { value: "not_interested", label: "Not Interested" },
  { value: "by_mistake", label: "By Mistake" },
  { value: "not_eligible", label: "Not Eligible" },
  { value: "dental", label: "Dental" },
  { value: "booked", label: "Booked" },
];

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
  // Legacy values — retained so existing records still display a readable label.
  contacted: "Contacted",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  completed: "Completed",
};

const statusLabel = (s: string) =>
  STATUS_LABELS[s] || (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-700 ring-1 ring-blue-500/20",
  out_of_jeddah: "bg-slate-500/10 text-slate-600 ring-1 ring-slate-500/20",
  out_of_riyadh: "bg-slate-500/10 text-slate-600 ring-1 ring-slate-500/20",
  wrong_no: "bg-red-500/10 text-red-700 ring-1 ring-red-500/20",
  duplicate: "bg-slate-500/10 text-slate-600 ring-1 ring-slate-500/20",
  no_answer: "bg-amber-500/10 text-amber-700 ring-1 ring-amber-500/20",
  not_interested: "bg-red-500/10 text-red-700 ring-1 ring-red-500/20",
  by_mistake: "bg-slate-500/10 text-slate-600 ring-1 ring-slate-500/20",
  not_eligible: "bg-slate-500/10 text-slate-600 ring-1 ring-slate-500/20",
  dental: "bg-teal-500/10 text-teal-700 ring-1 ring-teal-500/20",
  booked: "bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20",
  // Legacy values
  contacted: "bg-amber-500/10 text-amber-700 ring-1 ring-amber-500/20",
  confirmed: "bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20",
  cancelled: "bg-red-500/10 text-red-700 ring-1 ring-red-500/20",
  completed: "bg-slate-500/10 text-slate-600 ring-1 ring-slate-500/20",
};

const STAT_ICONS: Record<string, React.ReactNode> = {
  total: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 002.25 2.25h.75" /></svg>,
  today: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>,
  pending: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>,
  confirmed: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
};

export default function Dashboard() {
  const user = useUser();
  const vertical = useVertical();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterService, setFilterService] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filterAgent, setFilterAgent] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({ name: "", phone: "", city: "Jeddah", channel: "Call" as string, note: "", otherChannel: "" });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

  const canExport = user?.role === "super_admin" || user?.role === "admin" || user?.can_export;
  const canAssign = user?.role === "super_admin" || user?.role === "admin";
  const canDelete = user?.role === "super_admin";

  // `scoped` = the active segment the user is looking at: the vertical (and the
  // dental page, when one is chosen) plus the structural city/agent filters. The
  // stat cards and the "X of Y" denominator read from this, so the numbers always
  // track the selected vertical/page instead of the global, all-verticals total.
  const scoped = appointments.filter((a) => {
    const matchCity = !filterCity || a.city === filterCity;
    const matchAgent = !filterAgent || (filterAgent === "unassigned" ? !a.assigned_to : a.assigned_to === filterAgent);
    // Treat legacy rows with NULL vertical as 'medical' so they keep showing in the medical view.
    const v = a.vertical || "medical";
    const matchVertical = vertical === "all" || v === vertical;
    const matchService = !filterService || a.service === filterService;
    return matchCity && matchAgent && matchVertical && matchService;
  });

  // The table layers the transient lookups (free-text search + status) on top of
  // the scope. Status is intentionally kept out of `scoped` so the status-specific
  // cards (Inquiry / Booked) keep showing a full breakdown of the segment.
  const filtered = scoped.filter((a) => {
    const matchSearch =
      !search ||
      a.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.phone?.includes(search) ||
      a.department?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((a) => a.id)));
    }
  };

  const getExportData = () => {
    const rows = selectedIds.size > 0
      ? filtered.filter((a) => selectedIds.has(a.id))
      : filtered;
    return rows.map((a) => ({
      Name: a.name,
      Phone: a.phone,
      City: a.city,
      Status: statusLabel(a.status),
      Date: new Date(a.created_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }),
    }));
  };

  const exportCSV = () => {
    const rows = getExportData();
    if (!rows.length) return;
    const headers = Object.keys(rows[0]);
    const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => `"${String(r[h as keyof typeof r]).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `appointments-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const exportExcel = () => {
    const rows = getExportData();
    if (!rows.length) return;
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Appointments");
    XLSX.writeFile(wb, `appointments-${new Date().toISOString().slice(0, 10)}.xlsx`);
    setShowExportMenu(false);
  };

  const exportPDF = () => {
    const rows = getExportData();
    if (!rows.length) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("My Clinic — Appointments", 14, 18);
    doc.setFontSize(9);
    doc.text(`Exported: ${new Date().toLocaleString("en-GB")}`, 14, 25);
    autoTable(doc, {
      startY: 30,
      head: [Object.keys(rows[0])],
      body: rows.map((r) => Object.values(r)),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 77, 153] },
    });
    doc.save(`appointments-${new Date().toISOString().slice(0, 10)}.pdf`);
    setShowExportMenu(false);
  };

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/appointments");
      const json = await res.json();
      if (res.ok) setAppointments(json.data || []);
    } catch { /* silent */ }
    setLoading(false);
  }, []);

  const fetchAgents = useCallback(async () => {
    if (user?.role !== "super_admin" && user?.role !== "admin") return;
    try {
      const res = await fetch("/api/team");
      const json = await res.json();
      if (res.ok) {
        setAgents((json.data || []).filter((m: Agent) => m.role === "agent" && m.is_active));
      }
    } catch { /* silent */ }
  }, [user?.role]);

  useEffect(() => {
    fetchAppointments();
    fetchAgents();
    const interval = setInterval(fetchAppointments, 30000);
    return () => clearInterval(interval);
  }, [fetchAppointments, fetchAgents]);

  // If the user filters to a dental page, then flips the vertical toggle to a
  // vertical without a service dropdown (Medical or Pediatric), the filter
  // stays active and the list goes empty. Clear it when no longer relevant.
  // ("all" and "dental" keep the dropdown, so the filter stays meaningful.)
  useEffect(() => {
    if (vertical !== "dental" && vertical !== "all" && filterService) setFilterService("");
  }, [vertical, filterService]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        const changedBy = data.status_changed_by || null;
        const changedAt = data.status_changed_at || null;
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: newStatus, status_changed_by: changedBy, status_changed_at: changedAt } : a))
        );
        if (selectedAppointment?.id === id) {
          setSelectedAppointment({ ...selectedAppointment, status: newStatus, status_changed_by: changedBy, status_changed_at: changedAt });
        }
      }
    } catch { /* silent */ }
  };

  const assignLead = async (appointmentId: string, agentId: string) => {
    const agent = agents.find((a) => a.id === agentId);
    try {
      const res = await fetch("/api/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: appointmentId, assigned_to: agentId || null, assigned_to_name: agent?.name || null }),
      });
      if (res.ok) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === appointmentId ? { ...a, assigned_to: agentId || null, assigned_to_name: agent?.name || null } : a))
        );
        if (selectedAppointment?.id === appointmentId) {
          setSelectedAppointment({ ...selectedAppointment, assigned_to: agentId || null, assigned_to_name: agent?.name || null });
        }
      }
    } catch { /* silent */ }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    setCreateLoading(true);
    const channel = createForm.channel === "Other" ? (createForm.otherChannel || "Other") : createForm.channel;
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: createForm.name,
          phone: createForm.phone,
          city: createForm.city,
          channel,
          note: createForm.note || null,
          manual: true,
        }),
      });
      const data = await res.json();
      if (res.ok && data.data) {
        setAppointments((prev) => [data.data, ...prev]);
        setShowCreateModal(false);
        setCreateForm({ name: "", phone: "", city: "Jeddah", channel: "Call", note: "", otherChannel: "" });
      } else {
        setCreateError(data.error || "Failed to create lead");
      }
    } catch {
      setCreateError("Network error");
    }
    setCreateLoading(false);
  };

  const deleteLead = async (id: string) => {
    try {
      const res = await fetch("/api/appointments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setAppointments((prev) => prev.filter((a) => a.id !== id));
        if (selectedAppointment?.id === id) setSelectedAppointment(null);
      }
    } catch { /* silent */ }
    setDeleteConfirmId(null);
  };

  const bulkDeleteLeads = async () => {
    const idsToDelete = Array.from(selectedIds);
    if (idsToDelete.length === 0) return;
    try {
      const res = await fetch("/api/appointments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: idsToDelete }),
      });
      if (res.ok) {
        setAppointments((prev) => prev.filter((a) => !selectedIds.has(a.id)));
        if (selectedAppointment && selectedIds.has(selectedAppointment.id)) setSelectedAppointment(null);
        setSelectedIds(new Set());
      }
    } catch { /* silent */ }
    setShowBulkDeleteConfirm(false);
  };

  const stats = {
    total: scoped.length,
    today: scoped.filter((a) => new Date(a.created_at).toDateString() === new Date().toDateString()).length,
    new: scoped.filter((a) => a.status === "new").length,
    confirmed: scoped.filter((a) => a.status === "booked" || a.status === "confirmed").length,
  };

  // Human-readable label for the active scope, shown beside the page title.
  const scopeServiceName = filterService
    ? dentalServiceCatalog.find((s) => s.slug === filterService)?.en
    : null;
  const scopeLabel = scopeServiceName
    ? `${VERTICAL_LABELS[vertical]} · ${scopeServiceName}`
    : VERTICAL_LABELS[vertical];

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
      {/* Welcome + Refresh */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg font-bold text-slate-900">Appointments</h1>
            {canAssign && (
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${VERTICAL_BADGE[vertical]}`}>
                {scopeLabel}
              </span>
            )}
          </div>
          {user?.role === "agent" && (
            <p className="text-xs text-slate-400 mt-0.5">Showing your assigned leads</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setShowCreateModal(true); setCreateError(""); }}
            className="bg-[#004d99] text-white px-3.5 py-2 rounded-lg text-sm font-semibold hover:bg-[#003d7a] transition-all flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Add Lead
          </button>
          <button
            onClick={fetchAppointments}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
            title="Refresh"
          >
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M2.985 19.644l3.181-3.182" />
            </svg>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        {[
          { label: "Total Requests", value: stats.total, key: "total", accent: "text-[#004d99]", bg: "bg-[#004d99]/5" },
          { label: "Today", value: stats.today, key: "today", accent: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Inquiry", value: stats.new, key: "pending", accent: "text-amber-600", bg: "bg-amber-50" },
          { label: "Booked", value: stats.confirmed, key: "confirmed", accent: "text-emerald-600", bg: "bg-emerald-50" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200/80 p-4 md:p-5">
            <div className={`w-9 h-9 rounded-lg ${stat.bg} ${stat.accent} flex items-center justify-center mb-3`}>
              {STAT_ICONS[stat.key]}
            </div>
            <p className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3 md:p-4 mb-4 md:mb-6">
        <div className="flex flex-col md:flex-row gap-2 md:gap-3">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
            <input
              type="text"
              placeholder="Search name, phone, department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-[#004d99]/20 focus:border-[#004d99] transition-all placeholder:text-slate-300"
            />
          </div>
          <select value={filterCity} onChange={(e) => setFilterCity(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#004d99]/20 focus:border-[#004d99] text-slate-600">
            <option value="">All Cities</option>
            <option value="Jeddah">Jeddah</option>
            <option value="Riyadh">Riyadh</option>
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#004d99]/20 focus:border-[#004d99] text-slate-600">
            <option value="">All Status</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          {(vertical === "dental" || vertical === "all") && (
            <select value={filterService} onChange={(e) => setFilterService(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#004d99]/20 focus:border-[#004d99] text-slate-600">
              <option value="">All Dental Pages</option>
              {dentalServiceCatalog.map((s) => (
                <option key={s.slug} value={s.slug}>{s.en}</option>
              ))}
            </select>
          )}
          {canAssign && (
            <select value={filterAgent} onChange={(e) => setFilterAgent(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#004d99]/20 focus:border-[#004d99] text-slate-600">
              <option value="">All Agents</option>
              <option value="unassigned">Unassigned</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Count + Export */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <p className="text-xs text-slate-400 font-medium">
            {selectedIds.size > 0 ? `${selectedIds.size} selected — ` : ""}{filtered.length} of {scoped.length} appointments
          </p>
          {canDelete && selectedIds.size > 0 && (
            <button
              onClick={() => setShowBulkDeleteConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
              Delete ({selectedIds.size})
            </button>
          )}
        </div>
        {canExport && (
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-600 hover:border-[#004d99]/40 hover:text-[#004d99] transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
              Export{selectedIds.size > 0 ? ` (${selectedIds.size})` : ""}
            </button>
            {showExportMenu && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowExportMenu(false)} />
                <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-40 min-w-[140px]">
                  <button onClick={exportExcel} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                    <span className="w-5 text-center text-emerald-600 font-bold text-[10px]">XLS</span> Excel
                  </button>
                  <button onClick={exportCSV} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                    <span className="w-5 text-center text-blue-600 font-bold text-[10px]">CSV</span> CSV
                  </button>
                  <button onClick={exportPDF} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                    <span className="w-5 text-center text-red-600 font-bold text-[10px]">PDF</span> PDF
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-slate-200 border-t-[#004d99] rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-12 h-12 text-slate-200 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 002.25 2.25h.75" /></svg>
            <p className="text-slate-400 text-sm font-medium">No appointments found</p>
            <p className="text-slate-300 text-xs mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    {canExport && (
                      <th className="w-10 px-3 py-3">
                        <input type="checkbox" checked={selectedIds.size === filtered.length && filtered.length > 0} onChange={toggleSelectAll} className="w-3.5 h-3.5 rounded border-slate-300 text-[#004d99] cursor-pointer" />
                      </th>
                    )}
                    <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Patient</th>
                    <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Phone</th>
                    <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">City</th>
                    <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                    {canAssign && (
                      <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Assigned To</th>
                    )}
                    <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((a) => (
                    <tr key={a.id} className={`hover:bg-slate-50/80 transition-colors group ${selectedIds.has(a.id) ? "bg-[#004d99]/5" : ""}`}>
                      {canExport && (
                        <td className="w-10 px-3 py-3.5">
                          <input type="checkbox" checked={selectedIds.has(a.id)} onChange={() => toggleSelect(a.id)} className="w-3.5 h-3.5 rounded border-slate-300 text-[#004d99] cursor-pointer" />
                        </td>
                      )}
                      <td className="px-5 py-3.5"><p className="font-semibold text-slate-800 text-sm">{a.name}</p></td>
                      <td className="px-5 py-3.5"><a href={`tel:${a.phone}`} className="text-[#004d99] font-medium text-sm hover:underline">{a.phone}</a></td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{a.city}</td>
                      <td className="px-5 py-3.5">
                        <div className="relative inline-block">
                          <select value={a.status} onChange={(e) => updateStatus(a.id, e.target.value)} className={`${STATUS_COLORS[a.status] || STATUS_COLORS.new} text-[11px] font-semibold pl-2.5 pr-6 py-1 rounded-md border-0 cursor-pointer appearance-none`}>
                            {!STATUS_OPTIONS.some((s) => s.value === a.status) && a.status && (
                              <option value={a.status}>{statusLabel(a.status)}</option>
                            )}
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                          </select>
                          <svg className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 opacity-70" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                        </div>
                        {a.status_changed_by && (
                          <p className="text-[10px] text-slate-400 mt-1 leading-tight">
                            {a.status_changed_by}{a.status_changed_at && <> &middot; {new Date(a.status_changed_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</>}
                          </p>
                        )}
                      </td>
                      {canAssign && (
                        <td className="px-5 py-3.5">
                          <select
                            value={a.assigned_to || ""}
                            onChange={(e) => assignLead(a.id, e.target.value)}
                            className={`text-[11px] font-medium px-2 py-1 rounded-md border cursor-pointer ${a.assigned_to ? "bg-teal-50 text-teal-700 border-teal-200" : "bg-slate-50 text-slate-400 border-slate-200"}`}
                          >
                            <option value="">Unassigned</option>
                            {agents.map((ag) => (
                              <option key={ag.id} value={ag.id}>{ag.name}</option>
                            ))}
                          </select>
                        </td>
                      )}
                      <td className="px-5 py-3.5">
                        <p className="text-sm text-slate-600">{new Date(a.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</p>
                        <p className="text-xs text-slate-300">{new Date(a.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setSelectedAppointment(a)} className="opacity-0 group-hover:opacity-100 text-[#004d99] hover:text-[#003d7a] text-sm font-medium transition-opacity">View</button>
                          {canDelete && (
                            <button onClick={() => setDeleteConfirmId(a.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity" title="Delete lead">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-slate-100/80">
              {filtered.map((a) => (
                <div key={a.id} className="px-4 py-3.5 active:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelectedAppointment(a)}>
                  <div className="flex justify-between items-start mb-1.5">
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{a.name}</p>
                      <a href={`tel:${a.phone}`} className="text-[#004d99] text-xs font-medium" onClick={(e) => e.stopPropagation()}>{a.phone}</a>
                    </div>
                    <span className={`${STATUS_COLORS[a.status] || STATUS_COLORS.new} text-[10px] font-semibold px-2 py-0.5 rounded-md`}>
                      {statusLabel(a.status)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-[11px] text-slate-400">{a.city}</p>
                    {a.assigned_to_name && (
                      <span className="text-[10px] bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded font-medium">{a.assigned_to_name}</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1">{new Date(a.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
                  {a.status_changed_by && (
                    <p className="text-[10px] text-slate-400 mt-0.5">{a.status_changed_by}{a.status_changed_at && <> &middot; {new Date(a.status_changed_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</>}</p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setSelectedAppointment(null)}>
          <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl shadow-slate-900/10 w-full md:max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 pt-5 pb-4 flex justify-between items-start border-b border-slate-100">
              <div>
                <p className="text-xs text-slate-400 font-medium mb-0.5">Appointment Details</p>
                <h3 className="text-lg font-bold text-slate-900">{selectedAppointment.name}</h3>
              </div>
              <button onClick={() => setSelectedAppointment(null)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-300 hover:text-slate-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="px-6 py-4 space-y-3">
              {[
                { label: "Phone", value: selectedAppointment.phone, isPhone: true },
                { label: "City", value: selectedAppointment.city },
                { label: "Channel", value: selectedAppointment.channel || "Website" },
                { label: "Created By", value: selectedAppointment.created_by || "Landing Page" },
                { label: "Submitted", value: new Date(selectedAppointment.created_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) },
              ].map((field) => (
                <div key={field.label} className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-medium">{field.label}</span>
                  {field.isPhone ? (
                    <a href={`tel:${field.value}`} className="text-sm font-semibold text-[#004d99] hover:underline">{field.value}</a>
                  ) : (
                    <span className="text-sm font-semibold text-slate-700">{field.value}</span>
                  )}
                </div>
              ))}
              {selectedAppointment.note && (
                <div>
                  <span className="text-xs text-slate-400 font-medium block mb-1">Note</span>
                  <p className="text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2">{selectedAppointment.note}</p>
                </div>
              )}
              {canAssign && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-medium">Assigned To</span>
                  <select
                    value={selectedAppointment.assigned_to || ""}
                    onChange={(e) => assignLead(selectedAppointment.id, e.target.value)}
                    className={`text-[11px] font-medium px-2 py-1 rounded-md border cursor-pointer ${selectedAppointment.assigned_to ? "bg-teal-50 text-teal-700 border-teal-200" : "bg-slate-50 text-slate-400 border-slate-200"}`}
                  >
                    <option value="">Unassigned</option>
                    {agents.map((ag) => (
                      <option key={ag.id} value={ag.id}>{ag.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="pt-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-medium">Status</span>
                  <div className="relative inline-block">
                    <select value={selectedAppointment.status} onChange={(e) => updateStatus(selectedAppointment.id, e.target.value)} className={`${STATUS_COLORS[selectedAppointment.status] || STATUS_COLORS.new} text-[11px] font-semibold pl-2.5 pr-6 py-1 rounded-md border-0 cursor-pointer appearance-none`}>
                      {!STATUS_OPTIONS.some((s) => s.value === selectedAppointment.status) && selectedAppointment.status && (
                        <option value={selectedAppointment.status}>{statusLabel(selectedAppointment.status)}</option>
                      )}
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                    <svg className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 opacity-70" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                  </div>
                </div>
                {selectedAppointment.status_changed_by && (
                  <p className="text-[10px] text-slate-400 text-right mt-1">
                    {selectedAppointment.status_changed_by}{selectedAppointment.status_changed_at && <> &middot; {new Date(selectedAppointment.status_changed_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</>}
                  </p>
                )}
              </div>
            </div>
            <div className="px-6 pb-6 pt-2 space-y-2">
              <div className="flex gap-2">
                <a href={`tel:${selectedAppointment.phone}`} className="flex-1 bg-[#004d99] text-white text-center py-2.5 rounded-lg font-semibold text-sm hover:bg-[#003d7a] transition-all flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                  Call
                </a>
                <a href={`https://wa.me/${selectedAppointment.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#25D366] text-white text-center py-2.5 rounded-lg font-semibold text-sm hover:bg-[#1da851] transition-all flex items-center justify-center gap-2">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
                  WhatsApp
                </a>
              </div>
              {canDelete && (
                <button
                  onClick={() => setDeleteConfirmId(selectedAppointment.id)}
                  className="w-full bg-red-50 text-red-600 py-2.5 rounded-lg font-semibold text-sm hover:bg-red-100 transition-all flex items-center justify-center gap-2 border border-red-100"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                  Delete Lead
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Create Lead Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 pt-5 pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Add Lead</h3>
              <p className="text-xs text-slate-400 mt-0.5">Create a manual lead entry</p>
            </div>
            <form onSubmit={handleCreateLead} className="px-6 py-5 space-y-4">
              {createError && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg font-medium border border-red-100">{createError}</div>}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Patient Name</label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  placeholder="Full name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Phone</label>
                <input
                  type="tel"
                  value={createForm.phone}
                  onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                  placeholder="+966 5XX XXX XXXX"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">City</label>
                <select
                  value={createForm.city}
                  onChange={(e) => setCreateForm({ ...createForm, city: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm"
                >
                  <option value="Jeddah">Jeddah</option>
                  <option value="Riyadh">Riyadh</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Channel</label>
                <div className="flex gap-2">
                  {["Call", "WhatsApp", "Other"].map((ch) => (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => setCreateForm({ ...createForm, channel: ch })}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        createForm.channel === ch
                          ? "bg-[#004d99] text-white border-[#004d99]"
                          : "bg-white text-slate-600 border-slate-200 hover:border-[#004d99]/40"
                      }`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>
              {createForm.channel === "Other" && (
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Channel Name</label>
                  <input
                    type="text"
                    value={createForm.otherChannel}
                    onChange={(e) => setCreateForm({ ...createForm, otherChannel: e.target.value })}
                    placeholder="e.g. Walk-in, Email, Referral..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm"
                    required
                  />
                </div>
              )}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Note <span className="text-slate-300 normal-case">(optional)</span></label>
                <textarea
                  value={createForm.note}
                  onChange={(e) => setCreateForm({ ...createForm, note: e.target.value })}
                  placeholder="Add any additional notes about this lead..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm resize-none"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 bg-slate-100 text-slate-600 py-2.5 rounded-lg font-semibold text-sm hover:bg-slate-200 transition-all">Cancel</button>
                <button type="submit" disabled={createLoading} className="flex-1 bg-[#004d99] text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-[#003d7a] transition-all disabled:opacity-50">
                  {createLoading ? "Creating..." : "Create Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setDeleteConfirmId(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 pt-6 pb-4 text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Delete Lead</h3>
              <p className="text-sm text-slate-500">Are you sure you want to delete this lead? This action cannot be undone.</p>
            </div>
            <div className="px-6 pb-6 flex gap-2">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 bg-slate-100 text-slate-600 py-2.5 rounded-lg font-semibold text-sm hover:bg-slate-200 transition-all">Cancel</button>
              <button onClick={() => deleteLead(deleteConfirmId)} className="flex-1 bg-red-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-red-700 transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}
      {/* Bulk Delete Confirmation Modal */}
      {showBulkDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setShowBulkDeleteConfirm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 pt-6 pb-4 text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Delete {selectedIds.size} Lead{selectedIds.size > 1 ? "s" : ""}</h3>
              <p className="text-sm text-slate-500">Are you sure you want to delete {selectedIds.size} selected lead{selectedIds.size > 1 ? "s" : ""}? This action cannot be undone.</p>
            </div>
            <div className="px-6 pb-6 flex gap-2">
              <button onClick={() => setShowBulkDeleteConfirm(false)} className="flex-1 bg-slate-100 text-slate-600 py-2.5 rounded-lg font-semibold text-sm hover:bg-slate-200 transition-all">Cancel</button>
              <button onClick={bulkDeleteLeads} className="flex-1 bg-red-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-red-700 transition-all">Delete All</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

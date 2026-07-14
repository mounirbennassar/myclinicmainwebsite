"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useUser } from "../layout";
import { useRouter } from "next/navigation";
import { doctorFilters } from "@/app/lib/specialties";

type Doctor = {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string | null;
  email: string | null;
  image_url: string | null;
  qualification_en: string | null;
  qualification_ar: string | null;
  specialty_raw: string | null;
  specialties: string[];
  title: string | null;
  title_ar: string | null;
  languages: string | null;
  gender: string | null;
  branches: string[];
  cities: string[];
  is_active: boolean;
  sort_order: number;
};

const CITIES = ["Jeddah", "Riyadh"];
const EMPTY = {
  name_en: "", name_ar: "", email: "", image_url: "", title: "", title_ar: "",
  specialty_raw: "", qualification_en: "", qualification_ar: "", languages: "", gender: "",
  specialties: [] as string[], cities: [] as string[], branches: "",
  is_active: true, sort_order: 0,
};

export default function DoctorsPage() {
  const user = useUser();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [fSpec, setFSpec] = useState("");
  const [fCity, setFCity] = useState("");
  const [fStatus, setFStatus] = useState<"" | "active" | "inactive">("");
  const [page, setPage] = useState(1);
  const perPage = 12;

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Doctor | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Mirrors DOCTOR_ROLES in app/lib/auth.ts — the API enforces this too; this is
  // only so a wrong-role user isn't left staring at an empty page.
  const canManageDoctors =
    user?.role === "super_admin" || user?.role === "admin" || user?.role === "doctors_manager";

  useEffect(() => {
    if (user && !canManageDoctors) router.push("/dashboard");
  }, [user, canManageDoctors, router]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/doctors/manage");
      const json = await res.json();
      if (res.ok) setDoctors(json.doctors || []);
    } catch { /* silent */ }
    setLoading(false);
  };
  useEffect(() => { fetchDoctors(); }, []);
  useEffect(() => { setPage(1); }, [search, fSpec, fCity, fStatus]);

  const openCreate = () => { setEditId(null); setForm({ ...EMPTY }); setFormError(""); setModalOpen(true); };
  const openEdit = (d: Doctor) => {
    setEditId(d.id);
    setForm({
      name_en: d.name_en, name_ar: d.name_ar || "", email: d.email || "", image_url: d.image_url || "",
      title: d.title || "", title_ar: d.title_ar || "", specialty_raw: d.specialty_raw || "",
      qualification_en: d.qualification_en || "", qualification_ar: d.qualification_ar || "",
      languages: d.languages || "", gender: d.gender || "",
      specialties: d.specialties || [], cities: d.cities || [], branches: (d.branches || []).join(", "),
      is_active: d.is_active, sort_order: d.sort_order || 0,
    });
    setFormError(""); setModalOpen(true);
  };

  const toggleArr = (key: "specialties" | "cities", val: string) =>
    setForm((f) => ({ ...f, [key]: f[key].includes(val) ? f[key].filter((x) => x !== val) : [...f[key], val] }));

  const handleUpload = async (file: File) => {
    setUploading(true); setFormError("");
    try {
      const fd = new FormData(); fd.append("file", file);
      const res = await fetch("/api/doctors/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) setForm((f) => ({ ...f, image_url: data.url }));
      else setFormError(data.error || "Upload failed");
    } catch { setFormError("Upload failed"); }
    setUploading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name_en.trim()) { setFormError("English name is required"); return; }
    setSaving(true); setFormError("");
    const payload = {
      name_en: form.name_en, name_ar: form.name_ar, email: form.email, image_url: form.image_url,
      title: form.title, title_ar: form.title_ar, specialty_raw: form.specialty_raw,
      qualification_en: form.qualification_en, qualification_ar: form.qualification_ar,
      languages: form.languages, gender: form.gender,
      specialties: form.specialties, cities: form.cities,
      branches: form.branches.split(",").map((s) => s.trim()).filter(Boolean),
      is_active: form.is_active, sort_order: Number(form.sort_order) || 0,
    };
    try {
      const res = editId
        ? await fetch(`/api/doctors/${editId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        : await fetch("/api/doctors", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (res.ok) { setModalOpen(false); fetchDoctors(); }
      else setFormError(data.error || "Failed to save");
    } catch { setFormError("Network error"); }
    setSaving(false);
  };

  const toggleActive = async (d: Doctor) => {
    await fetch(`/api/doctors/${d.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ is_active: !d.is_active }) });
    fetchDoctors();
  };
  const doDelete = async () => {
    if (!confirmDelete) return;
    await fetch(`/api/doctors/${confirmDelete.id}`, { method: "DELETE" });
    setConfirmDelete(null); fetchDoctors();
  };

  const filtered = doctors.filter((d) => {
    const s = search.trim().toLowerCase();
    const haystack = [d.name_en, d.specialty_raw, d.title, d.slug, d.email, d.qualification_en]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    // Arabic is matched against the raw query — lowercasing does nothing for it,
    // and the name/title need to stay searchable in both scripts.
    const matchSearch =
      !s ||
      haystack.includes(s) ||
      (d.name_ar || "").includes(search.trim()) ||
      (d.title_ar || "").includes(search.trim());
    const matchSpec = !fSpec || d.specialties.includes(fSpec);
    const matchCity = !fCity || d.cities.includes(fCity);
    const matchStatus = !fStatus || (fStatus === "active" ? d.is_active : !d.is_active);
    return matchSearch && matchSpec && matchCity && matchStatus;
  });
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  if (!canManageDoctors) return null;

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Doctors</h1>
          <p className="text-xs text-slate-400 mt-0.5">{doctors.length} total · {doctors.filter((d) => d.is_active).length} active</p>
        </div>
        <button onClick={openCreate} className="bg-[#004d99] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#003d7a] transition-all flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Add Doctor
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3 md:p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-2 md:gap-3">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
            <input type="text" placeholder="Search name or specialty..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-[#004d99]/20 focus:border-[#004d99] transition-all placeholder:text-slate-300" />
          </div>
          <select value={fSpec} onChange={(e) => setFSpec(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-600 max-w-[200px]">
            <option value="">All specialties</option>
            {doctorFilters.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={fCity} onChange={(e) => setFCity(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-600">
            <option value="">All cities</option>
            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={fStatus} onChange={(e) => setFStatus(e.target.value as typeof fStatus)} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-600">
            <option value="">All status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <p className="text-xs text-slate-400 mb-3 font-medium">{filtered.length} doctors</p>

      {/* List */}
      <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-slate-200 border-t-[#004d99] rounded-full animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20"><p className="text-slate-400 text-sm font-medium">No doctors found</p></div>
        ) : (
          <div className="divide-y divide-slate-100">
            {paginated.map((d) => (
              <div key={d.id} className="px-5 py-3.5 flex items-center gap-3 justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden bg-slate-100 shrink-0">
                    {d.image_url && <Image src={d.image_url} alt={d.name_en} fill className="object-cover object-top" sizes="44px" />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-slate-800 text-sm truncate">{d.name_en}</p>
                      {!d.is_active && <span className="bg-red-50 text-red-500 text-[10px] font-bold px-1.5 py-0.5 rounded">Inactive</span>}
                    </div>
                    <p className="text-xs text-slate-400 truncate">{d.specialty_raw || d.specialties.join(", ")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="hidden md:flex items-center gap-1">
                    {d.cities.map((c) => <span key={c} className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">{c}</span>)}
                  </div>
                  <a href={`/doctors/${d.slug}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors" title="View public page">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                  </a>
                  <button onClick={() => openEdit(d)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors" title="Edit">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" /></svg>
                  </button>
                  <button onClick={() => toggleActive(d)} className={`p-1.5 rounded-lg hover:bg-slate-100 transition-colors ${d.is_active ? "text-emerald-500 hover:text-red-500" : "text-red-400 hover:text-emerald-500"}`} title={d.is_active ? "Deactivate" : "Activate"}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={d.is_active ? "M5.636 5.636a9 9 0 1012.728 0M12 3v9" : "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"} /></svg>
                  </button>
                  <button onClick={() => setConfirmDelete(d)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-slate-400">Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, filtered.length)} of {filtered.length}</p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-30">Previous</button>
            <span className="px-3 text-sm text-slate-500">{page} / {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-30">Next</button>
          </div>
        </div>
      )}

      {/* Add / Edit modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 pt-5 pb-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h3 className="text-lg font-bold text-slate-900">{editId ? "Edit Doctor" : "Add Doctor"}</h3>
            </div>
            <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
              {formError && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg font-medium border border-red-100">{formError}</div>}

              {/* Photo */}
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                  {form.image_url ? <Image src={form.image_url} alt="" fill className="object-cover object-top" sizes="80px" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg></div>}
                </div>
                <div className="flex-1 space-y-2">
                  <input type="text" value={form.image_url} onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))} placeholder="Image URL (or upload →)" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
                  <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="text-xs font-semibold text-[#004d99] hover:underline disabled:opacity-50">
                    {uploading ? "Uploading…" : "Upload photo"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Name (EN) *</label>
                  <input type="text" value={form.name_en} onChange={(e) => setForm((f) => ({ ...f, name_en: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm" required />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Name (AR)</label>
                  <input type="text" dir="rtl" value={form.name_ar} onChange={(e) => setForm((f) => ({ ...f, name_ar: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Display specialty (EN) <span className="text-slate-400 normal-case font-medium">· shown on the site</span>
                  </label>
                  <input type="text" value={form.specialty_raw} onChange={(e) => setForm((f) => ({ ...f, specialty_raw: e.target.value }))} placeholder="Endodontics Consultant" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Display specialty (AR)</label>
                  <input type="text" dir="rtl" value={form.title_ar} onChange={(e) => setForm((f) => ({ ...f, title_ar: e.target.value }))} placeholder="استشاري علاج عصب وجذور الأسنان" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Seniority <span className="text-slate-400 normal-case font-medium">· filters only</span>
                  </label>
                  <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Consultant" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="doctor@myclinic.com.sa" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Specialties (drive filters &amp; landing pages)</label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-slate-50 rounded-lg border border-slate-200">
                  {doctorFilters.map((s) => (
                    <button key={s} type="button" onClick={() => toggleArr("specialties", s)} className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${form.specialties.includes(s) ? "bg-[#004d99] text-white border-[#004d99]" : "bg-white text-slate-600 border-slate-200 hover:border-[#004d99]/40"}`}>{s}</button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Cities</label>
                  <div className="flex gap-2">
                    {CITIES.map((c) => (
                      <button key={c} type="button" onClick={() => toggleArr("cities", c)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${form.cities.includes(c) ? "bg-[#004d99] text-white border-[#004d99]" : "bg-white text-slate-600 border-slate-200 hover:border-[#004d99]/40"}`}>{c}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Branches (comma-separated)</label>
                  <input type="text" value={form.branches} onChange={(e) => setForm((f) => ({ ...f, branches: e.target.value }))} placeholder="Al Mohammadiyah, Al Safa" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Qualifications (EN) <span className="text-slate-400 normal-case font-medium">· one per line</span>
                  </label>
                  <textarea value={form.qualification_en} onChange={(e) => setForm((f) => ({ ...f, qualification_en: e.target.value }))} rows={3} placeholder={"Doctorate of Endodontics - USA\nBoard Certified"} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm resize-y" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Qualifications (AR)</label>
                  <textarea dir="rtl" value={form.qualification_ar} onChange={(e) => setForm((f) => ({ ...f, qualification_ar: e.target.value }))} rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm resize-y" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Languages</label>
                  <input type="text" value={form.languages} onChange={(e) => setForm((f) => ({ ...f, languages: e.target.value }))} placeholder="English, Arabic" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Gender <span className="text-slate-400 normal-case font-medium">· only picks the fallback avatar</span>
                  </label>
                  <select value={form.gender} onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-600">
                    <option value="">Guess from name</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Featured order</label>
                  <input type="number" value={form.sort_order} onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))} className="w-20 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm" />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active</label>
                  <button type="button" onClick={() => setForm((f) => ({ ...f, is_active: !f.is_active }))} className={`relative w-10 h-5 rounded-full transition-colors ${form.is_active ? "bg-[#004d99]" : "bg-slate-200"}`}>
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.is_active ? "translate-x-5" : ""}`} />
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 bg-slate-100 text-slate-600 py-2.5 rounded-lg font-semibold text-sm hover:bg-slate-200 transition-all">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 bg-[#004d99] text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-[#003d7a] transition-all disabled:opacity-50">{saving ? "Saving…" : editId ? "Save Changes" : "Create Doctor"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setConfirmDelete(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Delete doctor?</h3>
            <p className="text-sm text-slate-500 mb-5"><strong>{confirmDelete.name_en}</strong> will be permanently removed. Consider deactivating instead.</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 bg-slate-100 text-slate-600 py-2.5 rounded-lg font-semibold text-sm hover:bg-slate-200">Cancel</button>
              <button onClick={doDelete} className="flex-1 bg-red-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

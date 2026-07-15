"use client";
import { useState, useEffect } from "react";
import { useUser } from "../layout";
import { useRouter } from "next/navigation";
import {
  ADMIN_ROLES,
  CITY_SCOPED_ROLES,
  ROLES,
  ROLE_HINTS,
  ROLE_LABELS,
  type Role,
  hasRole,
} from "../../lib/roles";

const ROLE_BADGE: Record<Role, string> = {
  super_admin: "bg-purple-100 text-purple-700",
  admin: "bg-blue-100 text-blue-700",
  agent: "bg-teal-100 text-teal-700",
  marketing: "bg-amber-100 text-amber-700",
  content_manager: "bg-rose-100 text-rose-700",
  doctors_manager: "bg-emerald-100 text-emerald-700",
};

type TeamMember = {
  id: string;
  email: string;
  name: string;
  roles: Role[];
  allowed_cities: string[];
  is_active: boolean;
  can_export: boolean;
  created_at: string;
};

const CITIES = ["Jeddah", "Riyadh"];

/**
 * Roles are checkboxes, not a dropdown: one person is often two jobs — an agent
 * who also manages the doctors directory, a marketer who also writes the blog.
 * Their access is the union of everything ticked.
 */
function RolePicker({ value, onToggle }: { value: Role[]; onToggle: (role: Role) => void }) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
        Roles
      </label>
      <div className="rounded-lg border border-slate-200 divide-y divide-slate-100 overflow-hidden">
        {ROLES.map((role) => {
          const checked = value.includes(role);
          return (
            <label
              key={role}
              className={`flex items-start gap-2.5 px-3 py-2 cursor-pointer transition-colors ${
                checked ? "bg-[#004d99]/5" : "bg-white hover:bg-slate-50"
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(role)}
                className="mt-0.5 w-4 h-4 shrink-0 rounded border-slate-300 accent-[#004d99]"
              />
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-slate-700 leading-tight">
                  {ROLE_LABELS[role]}
                </span>
                <span className="block text-[11px] text-slate-400 leading-snug mt-0.5">
                  {ROLE_HINTS[role]}
                </span>
              </span>
            </label>
          );
        })}
      </div>
      <p className="text-xs text-slate-400 mt-1.5">
        {value.length === 0
          ? "Pick at least one role."
          : "Access is the sum of every role ticked."}
      </p>
    </div>
  );
}

export default function TeamPage() {
  const user = useUser();
  const router = useRouter();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editMember, setEditMember] = useState<TeamMember | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [filterActive, setFilterActive] = useState<"" | "active" | "inactive">("");
  const [filterRole, setFilterRole] = useState<"" | Role>("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  // Form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formCities, setFormCities] = useState<string[]>([]);
  const [formRoles, setFormRoles] = useState<Role[]>(["agent"]);
  const [formCanExport, setFormCanExport] = useState(false);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Only the cities of a member who can actually see leads are meaningful.
  const formNeedsCities = hasRole(formRoles, ...CITY_SCOPED_ROLES);

  useEffect(() => {
    if (user && !hasRole(user.roles, ...ADMIN_ROLES)) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/team");
      const json = await res.json();
      if (res.ok) setMembers(json.data || []);
    } catch { /* silent */ }
    setLoading(false);
  };

  useEffect(() => { fetchTeam(); }, []);

  const resetForm = () => {
    setFormName("");
    setFormEmail("");
    setFormCities([]);
    setFormRoles(["agent"]);
    setFormCanExport(false);
    setFormError("");
  };

  const toggleRole = (role: Role) => {
    setFormRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRoles.length) return setFormError("Pick at least one role");
    setFormError("");
    setFormLoading(true);

    const email = formEmail.includes("@") ? formEmail : `${formEmail}@myclinic.com.sa`;

    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: formName, allowed_cities: formCities, memberRoles: formRoles, can_export: formCanExport }),
      });
      const data = await res.json();

      if (res.ok) {
        setGeneratedPassword(data.generated_password);
        setShowCreate(false);
        resetForm();
        fetchTeam();
      } else {
        setFormError(data.error || "Failed to create");
      }
    } catch {
      setFormError("Network error");
    }
    setFormLoading(false);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editMember) return;
    if (!formRoles.length) return setFormError("Pick at least one role");
    setFormError("");
    setFormLoading(true);

    try {
      const res = await fetch(`/api/team/${editMember.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formName, allowed_cities: formCities, memberRoles: formRoles, can_export: formCanExport }),
      });
      const data = await res.json();

      if (res.ok) {
        setEditMember(null);
        resetForm();
        fetchTeam();
      } else {
        setFormError(data.error || "Failed to update");
      }
    } catch {
      setFormError("Network error");
    }
    setFormLoading(false);
  };

  const toggleActive = async (member: TeamMember) => {
    await fetch(`/api/team/${member.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !member.is_active }),
    });
    fetchTeam();
  };

  const resetPassword = async (member: TeamMember) => {
    const res = await fetch(`/api/team/${member.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reset_password: true }),
    });
    const data = await res.json();
    if (res.ok && data.generated_password) {
      setGeneratedPassword(data.generated_password);
    }
  };

  const openEdit = (member: TeamMember) => {
    setEditMember(member);
    setFormName(member.name);
    setFormCities(member.allowed_cities || []);
    setFormRoles(member.roles || []);
    setFormCanExport(member.can_export ?? false);
    setFormError("");
  };

  const toggleCity = (city: string) => {
    setFormCities((prev) => prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]);
  };

  const filtered = members.filter((m) => {
    const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase());
    const matchActive = !filterActive || (filterActive === "active" ? m.is_active : !m.is_active);
    // "Agent" now means everyone who holds Agent, not everyone who is only that.
    const matchRole = !filterRole || hasRole(m.roles, filterRole);
    return matchSearch && matchActive && matchRole;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [search, filterActive, filterRole]);

  if (!hasRole(user?.roles, ...ADMIN_ROLES)) return null;

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-bold text-slate-900">Team Management</h1>
        <button
          onClick={() => { setShowCreate(true); resetForm(); }}
          className="bg-[#004d99] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#003d7a] transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Add Member
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-3 md:p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-2 md:gap-3">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
            <input type="text" placeholder="Search name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-[#004d99]/20 focus:border-[#004d99] transition-all placeholder:text-slate-300" />
          </div>
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value as typeof filterRole)} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-600">
            <option value="">All Roles</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>{ROLE_LABELS[r]}</option>
            ))}
          </select>
          <select value={filterActive} onChange={(e) => setFilterActive(e.target.value as typeof filterActive)} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-600">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <p className="text-xs text-slate-400 mb-3 font-medium">{filtered.length} team members</p>

      {/* Team list */}
      <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-slate-200 border-t-[#004d99] rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 text-sm font-medium">No team members found</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {paginated.map((m) => (
              <div key={m.id} className="px-5 py-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-0 justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${m.is_active ? "bg-[#004d99]" : "bg-slate-300"}`}>
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-slate-800 text-sm truncate">{m.name}</p>
                      {m.roles?.map((role) => (
                        <span key={role} className={`${ROLE_BADGE[role] || "bg-slate-100 text-slate-600"} text-[10px] font-bold px-1.5 py-0.5 rounded`}>
                          {ROLE_LABELS[role] ?? role}
                        </span>
                      ))}
                      {m.can_export && (
                        <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-1.5 py-0.5 rounded">Export</span>
                      )}
                      {!m.is_active && (
                        <span className="bg-red-50 text-red-500 text-[10px] font-bold px-1.5 py-0.5 rounded">Inactive</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate">{m.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                  {hasRole(m.roles, ...CITY_SCOPED_ROLES) && m.allowed_cities?.map((city) => (
                    <span key={city} className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">{city}</span>
                  ))}
                  {hasRole(m.roles, ...CITY_SCOPED_ROLES) && (!m.allowed_cities || m.allowed_cities.length === 0) && (
                    <span className="text-[10px] text-slate-300">No cities</span>
                  )}
                  <div className="flex items-center gap-1 ml-auto md:ml-4">
                    <button onClick={() => openEdit(m)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors" title="Edit">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" /></svg>
                    </button>
                    <button onClick={() => resetPassword(m)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors" title="Reset Password">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg>
                    </button>
                    <button onClick={() => toggleActive(m)} className={`p-1.5 rounded-lg hover:bg-slate-100 transition-colors ${m.is_active ? "text-emerald-500 hover:text-red-500" : "text-red-400 hover:text-emerald-500"}`} title={m.is_active ? "Deactivate" : "Activate"}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={m.is_active ? "M5.636 5.636a9 9 0 1012.728 0M12 3v9" : "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"} /></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-slate-400">
            Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  p === page
                    ? "bg-[#004d99] text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 pt-5 pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Add Team Member</h3>
            </div>
            <form onSubmit={handleCreate} className="px-6 py-5 space-y-4">
              {formError && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg font-medium border border-red-100">{formError}</div>}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Name</label>
                <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Full name" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm" required />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Email</label>
                <div className="flex">
                  <input type="text" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="username" className="flex-1 bg-slate-50 border border-slate-200 rounded-l-lg px-4 py-2.5 text-sm" required />
                  <span className="bg-slate-100 border border-l-0 border-slate-200 rounded-r-lg px-3 py-2.5 text-sm text-slate-500">@myclinic.com.sa</span>
                </div>
              </div>
              <RolePicker value={formRoles} onToggle={toggleRole} />
              {formNeedsCities && (
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Allowed Cities</label>
                  <div className="flex gap-2">
                    {CITIES.map((city) => (
                      <button key={city} type="button" onClick={() => toggleCity(city)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${formCities.includes(city) ? "bg-[#004d99] text-white border-[#004d99]" : "bg-white text-slate-600 border-slate-200 hover:border-[#004d99]/40"}`}>
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Allow Export</label>
                <button type="button" onClick={() => setFormCanExport(!formCanExport)} className={`relative w-10 h-5 rounded-full transition-colors ${formCanExport ? "bg-[#004d99]" : "bg-slate-200"}`}>
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${formCanExport ? "translate-x-5" : ""}`} />
                </button>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowCreate(false)} className="flex-1 bg-slate-100 text-slate-600 py-2.5 rounded-lg font-semibold text-sm hover:bg-slate-200 transition-all">Cancel</button>
                <button type="submit" disabled={formLoading || !formRoles.length} className="flex-1 bg-[#004d99] text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-[#003d7a] transition-all disabled:opacity-50">
                  {formLoading ? "Creating..." : "Create Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => { setEditMember(null); resetForm(); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 pt-5 pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Edit Member</h3>
              <p className="text-xs text-slate-400 mt-0.5">{editMember.email}</p>
            </div>
            <form onSubmit={handleUpdate} className="px-6 py-5 space-y-4">
              {formError && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg font-medium border border-red-100">{formError}</div>}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Name</label>
                <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm" required />
              </div>
              <RolePicker value={formRoles} onToggle={toggleRole} />
              {formNeedsCities && (
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Allowed Cities</label>
                  <div className="flex gap-2">
                    {CITIES.map((city) => (
                      <button key={city} type="button" onClick={() => toggleCity(city)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${formCities.includes(city) ? "bg-[#004d99] text-white border-[#004d99]" : "bg-white text-slate-600 border-slate-200 hover:border-[#004d99]/40"}`}>
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Allow Export</label>
                <button type="button" onClick={() => setFormCanExport(!formCanExport)} className={`relative w-10 h-5 rounded-full transition-colors ${formCanExport ? "bg-[#004d99]" : "bg-slate-200"}`}>
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${formCanExport ? "translate-x-5" : ""}`} />
                </button>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => { setEditMember(null); resetForm(); }} className="flex-1 bg-slate-100 text-slate-600 py-2.5 rounded-lg font-semibold text-sm hover:bg-slate-200 transition-all">Cancel</button>
                <button type="submit" disabled={formLoading || !formRoles.length} className="flex-1 bg-[#004d99] text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-[#003d7a] transition-all disabled:opacity-50">
                  {formLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Generated Password Modal */}
      {generatedPassword && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setGeneratedPassword("")}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Generated Password</h3>
              <p className="text-xs text-slate-400 mb-4">Share this with the team member. It will only be shown once.</p>
              <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 mb-4 flex items-center justify-between">
                <code className="text-lg font-mono font-bold text-[#004d99] tracking-wider">{generatedPassword}</code>
                <button
                  onClick={() => navigator.clipboard.writeText(generatedPassword)}
                  className="p-1.5 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                  title="Copy"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" /></svg>
                </button>
              </div>
              <button onClick={() => setGeneratedPassword("")} className="w-full bg-[#004d99] text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-[#003d7a] transition-all">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

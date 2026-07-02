"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useUser } from "../layout";
import { useRouter } from "next/navigation";

type UtmLink = {
  id: string;
  slug: string;
  destination_url: string;
  source: string;
  medium: string;
  campaign: string;
  term: string | null;
  content: string | null;
  label: string | null;
  created_by: string | null;
  created_at: string;
  clicks: number;
  last_click_at: string | null;
  conversions: number;
  confirmed_conversions: number;
};

const MEDIUM_PRESETS = ["cpc", "social", "email", "sms", "whatsapp", "display", "referral", "affiliate"];
const SOURCE_PRESETS = ["google", "meta", "instagram", "tiktok", "snapchat", "x", "linkedin", "newsletter", "influencer"];

function buildRawUrl(l: Pick<UtmLink, "destination_url" | "source" | "medium" | "campaign" | "term" | "content">): string {
  try {
    const url = new URL(l.destination_url);
    url.searchParams.set("utm_source", l.source);
    url.searchParams.set("utm_medium", l.medium);
    url.searchParams.set("utm_campaign", l.campaign);
    if (l.term) url.searchParams.set("utm_term", l.term);
    if (l.content) url.searchParams.set("utm_content", l.content);
    return url.toString();
  } catch {
    return l.destination_url;
  }
}

export default function UtmPage() {
  const user = useUser();
  const router = useRouter();
  const [origin, setOrigin] = useState("");
  const [links, setLinks] = useState<UtmLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const [formDestination, setFormDestination] = useState("");
  const [formSource, setFormSource] = useState("");
  const [formMedium, setFormMedium] = useState("");
  const [formCampaign, setFormCampaign] = useState("");
  const [formTerm, setFormTerm] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formLabel, setFormLabel] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formError, setFormError] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);

  useEffect(() => {
    if (user && user.role !== "super_admin" && user.role !== "admin" && user.role !== "marketing") {
      router.push("/dashboard");
    }
  }, [user, router]);

  useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
  }, []);

  const fetchLinks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/utm");
      const json = await res.json();
      if (res.ok) setLinks(json.data || []);
    } catch { /* silent */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchLinks(); }, [fetchLinks]);

  const resetForm = () => {
    setFormDestination(origin ? `${origin}/` : "");
    setFormSource("");
    setFormMedium("");
    setFormCampaign("");
    setFormTerm("");
    setFormContent("");
    setFormLabel("");
    setFormSlug("");
    setFormError("");
  };

  const openCreate = () => {
    resetForm();
    setShowCreate(true);
  };

  const previewUrl = useMemo(() => {
    if (!formDestination || !formSource || !formMedium || !formCampaign) return "";
    return buildRawUrl({
      destination_url: formDestination,
      source: formSource,
      medium: formMedium,
      campaign: formCampaign,
      term: formTerm || null,
      content: formContent || null,
    });
  }, [formDestination, formSource, formMedium, formCampaign, formTerm, formContent]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSubmitting(true);
    try {
      const res = await fetch("/api/utm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination_url: formDestination,
          source: formSource,
          medium: formMedium,
          campaign: formCampaign,
          term: formTerm || null,
          content: formContent || null,
          label: formLabel || null,
          slug: formSlug || null,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setShowCreate(false);
        resetForm();
        fetchLinks();
      } else {
        setFormError(data.error || "Failed to create");
      }
    } catch {
      setFormError("Network error");
    }
    setFormSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this link and all its click data?")) return;
    const res = await fetch(`/api/utm/${id}`, { method: "DELETE" });
    if (res.ok) fetchLinks();
  };

  const copyText = async (text: string, key: string) => {
    const finish = (ok: boolean) => {
      setCopied(ok ? key : `fail-${key}`);
      setTimeout(() => setCopied((c) => (c === key || c === `fail-${key}` ? null : c)), 1800);
    };

    // Preferred path: Clipboard API (requires secure context — HTTPS or localhost)
    if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        finish(true);
        return;
      } catch { /* fall through to execCommand */ }
    }

    // Fallback: hidden textarea + document.execCommand (works on http://)
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-1000px";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, text.length);
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      finish(ok);
    } catch {
      finish(false);
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return links;
    return links.filter((l) =>
      [l.slug, l.campaign, l.source, l.medium, l.label, l.destination_url].some((v) => v && v.toLowerCase().includes(q))
    );
  }, [links, search]);

  const totals = useMemo(() => {
    const clicks = links.reduce((sum, l) => sum + l.clicks, 0);
    const conversions = links.reduce((sum, l) => sum + l.conversions, 0);
    const confirmed = links.reduce((sum, l) => sum + l.confirmed_conversions, 0);
    const convRate = clicks > 0 ? Math.round((conversions / clicks) * 100) : 0;
    return { clicks, conversions, confirmed, convRate, links: links.length };
  }, [links]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-slate-200 border-t-[#004d99] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">UTM Links</h1>
          <p className="text-sm text-slate-500 mt-1">Create trackable campaign links and measure clicks &amp; conversions.</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#004d99] text-white text-sm font-semibold hover:bg-[#003d7a] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New link
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <KpiCard label="Total links" value={totals.links} />
        <KpiCard label="Total clicks" value={totals.clicks} />
        <KpiCard label="Conversions" value={totals.conversions} sub={`${totals.confirmed} confirmed`} />
        <KpiCard label="Click → lead" value={`${totals.convRate}%`} />
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by slug, campaign, source, label..."
          className="w-full md:w-80 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#004d99] focus:ring-1 focus:ring-[#004d99]"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Link</th>
                <th className="text-left px-4 py-3 font-semibold">Campaign</th>
                <th className="text-left px-4 py-3 font-semibold">Source / medium</th>
                <th className="text-right px-4 py-3 font-semibold">Clicks</th>
                <th className="text-right px-4 py-3 font-semibold">Leads</th>
                <th className="text-left px-4 py-3 font-semibold">Created</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                    {links.length === 0 ? "No links yet — create your first campaign link." : "No matches."}
                  </td>
                </tr>
              ) : (
                filtered.map((l) => {
                  const shortUrl = origin ? `${origin}/go/${l.slug}` : `/go/${l.slug}`;
                  const rawUrl = buildRawUrl(l);
                  return (
                    <tr key={l.id} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3 align-top">
                        <div className="font-semibold text-slate-700">{l.label || l.campaign}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="text-xs text-[#004d99] bg-[#004d99]/5 px-2 py-0.5 rounded">/go/{l.slug}</code>
                          <button
                            type="button"
                            onClick={() => copyText(shortUrl, `short-${l.id}`)}
                            className="text-[11px] text-slate-500 hover:text-slate-700"
                            title={shortUrl}
                          >
                            {copied === `short-${l.id}` ? "Copied!" : copied === `fail-short-${l.id}` ? "Copy failed" : "Copy short"}
                          </button>
                          <span className="text-slate-300">·</span>
                          <button
                            type="button"
                            onClick={() => copyText(rawUrl, `raw-${l.id}`)}
                            className="text-[11px] text-slate-500 hover:text-slate-700"
                            title={rawUrl}
                          >
                            {copied === `raw-${l.id}` ? "Copied!" : copied === `fail-raw-${l.id}` ? "Copy failed" : "Copy full"}
                          </button>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 truncate max-w-md" title={l.destination_url}>
                          → {l.destination_url}
                        </div>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <div className="text-slate-700 font-medium">{l.campaign}</div>
                        {l.content && <div className="text-[11px] text-slate-400">{l.content}</div>}
                      </td>
                      <td className="px-4 py-3 align-top">
                        <div className="text-slate-700">{l.source}</div>
                        <div className="text-[11px] text-slate-400">{l.medium}</div>
                      </td>
                      <td className="px-4 py-3 align-top text-right">
                        <div className="font-bold text-slate-800">{l.clicks}</div>
                        {l.last_click_at && (
                          <div className="text-[11px] text-slate-400">
                            {new Date(l.last_click_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 align-top text-right">
                        <div className="font-bold text-slate-800">{l.conversions}</div>
                        {l.confirmed_conversions > 0 && (
                          <div className="text-[11px] text-emerald-600">{l.confirmed_conversions} confirmed</div>
                        )}
                      </td>
                      <td className="px-4 py-3 align-top text-slate-500 text-xs">
                        {new Date(l.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                        {l.created_by && <div className="text-[11px] text-slate-400">{l.created_by}</div>}
                      </td>
                      <td className="px-4 py-3 align-top text-right">
                        <button
                          onClick={() => handleDelete(l.id)}
                          className="text-xs text-slate-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl my-8">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">New UTM link</h2>
              <button onClick={() => setShowCreate(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <Field label="Destination URL" required>
                <input
                  type="url"
                  required
                  value={formDestination}
                  onChange={(e) => setFormDestination(e.target.value)}
                  placeholder={origin ? `${origin}/` : "https://..."}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#004d99] focus:ring-1 focus:ring-[#004d99]"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Source" required>
                  <input
                    list="utm-sources"
                    required
                    value={formSource}
                    onChange={(e) => setFormSource(e.target.value)}
                    placeholder="google"
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#004d99] focus:ring-1 focus:ring-[#004d99]"
                  />
                  <datalist id="utm-sources">
                    {SOURCE_PRESETS.map((s) => <option key={s} value={s} />)}
                  </datalist>
                </Field>
                <Field label="Medium" required>
                  <input
                    list="utm-mediums"
                    required
                    value={formMedium}
                    onChange={(e) => setFormMedium(e.target.value)}
                    placeholder="cpc"
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#004d99] focus:ring-1 focus:ring-[#004d99]"
                  />
                  <datalist id="utm-mediums">
                    {MEDIUM_PRESETS.map((m) => <option key={m} value={m} />)}
                  </datalist>
                </Field>
              </div>
              <Field label="Campaign" required>
                <input
                  required
                  value={formCampaign}
                  onChange={(e) => setFormCampaign(e.target.value)}
                  placeholder="spring_promo"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#004d99] focus:ring-1 focus:ring-[#004d99]"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Term (optional)">
                  <input
                    value={formTerm}
                    onChange={(e) => setFormTerm(e.target.value)}
                    placeholder="dental_whitening"
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#004d99] focus:ring-1 focus:ring-[#004d99]"
                  />
                </Field>
                <Field label="Content (optional)">
                  <input
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    placeholder="banner_top"
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#004d99] focus:ring-1 focus:ring-[#004d99]"
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Internal label (optional)">
                  <input
                    value={formLabel}
                    onChange={(e) => setFormLabel(e.target.value)}
                    placeholder="Spring IG story"
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#004d99] focus:ring-1 focus:ring-[#004d99]"
                  />
                </Field>
                <Field label="Custom short slug (optional)">
                  <input
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="auto-generated"
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#004d99] focus:ring-1 focus:ring-[#004d99]"
                  />
                </Field>
              </div>

              {previewUrl && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-1">Preview</div>
                  <div className="text-xs text-slate-700 break-all font-mono">{previewUrl}</div>
                </div>
              )}

              {formError && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{formError}</div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-4 py-2 rounded-lg bg-[#004d99] text-white text-sm font-semibold hover:bg-[#003d7a] disabled:opacity-60"
                >
                  {formSubmitting ? "Creating..." : "Create link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

function KpiCard({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">{label}</div>
      <div className="text-2xl font-bold text-slate-800 mt-1">{value}</div>
      {sub && <div className="text-[11px] text-slate-400 mt-0.5">{sub}</div>}
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-slate-600 mb-1 inline-block">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </span>
      {children}
    </label>
  );
}

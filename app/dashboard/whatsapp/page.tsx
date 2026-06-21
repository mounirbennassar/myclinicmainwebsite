"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useUser } from "../layout";
import { useRouter } from "next/navigation";

type Template = {
  id: number;
  templateName: string;
  mediaType: string | null;
  msgText: string | null;
  mediaFileName: string | null;
  templateStatus: string;
  isActive: boolean;
};

type CampaignHistoryItem = {
  id: number;
  templateId: number;
  campaignName: string;
  processingCount: number;
  sentTotal: number;
  deliveredTotal: number;
  seenTotal: number;
  failTotal: number;
  createdAt: string;
};

type Envelope<T> = {
  dataObj: T;
  isSuccess: boolean;
  responseCode: number;
  message: string | null;
};

type Tab =
  | "overview"
  | "templates"
  | "send-template"
  | "send-text"
  | "history"
  | "lookup";

const TABS: { value: Tab; label: string }[] = [
  { value: "overview", label: "Overview" },
  { value: "templates", label: "Templates" },
  { value: "send-template", label: "Send Template" },
  { value: "send-text", label: "Send Text" },
  { value: "history", label: "Campaign History" },
  { value: "lookup", label: "Contact Lookup" },
];

function Pill({ children, tone = "slate" }: { children: React.ReactNode; tone?: "slate" | "green" | "red" | "amber" | "blue" }) {
  const tones: Record<string, string> = {
    slate: "bg-slate-100 text-slate-700",
    green: "bg-emerald-50 text-emerald-700",
    red: "bg-rose-50 text-rose-700",
    amber: "bg-amber-50 text-amber-800",
    blue: "bg-blue-50 text-[#004d99]",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}

function Card({ title, children, right }: { title: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <section className="bg-white border border-slate-200/80 rounded-xl">
      <header className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700">{title}</h2>
        {right}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

function ResultBox({ result }: { result: { ok?: boolean; status?: number; raw?: string; data?: unknown } | null }) {
  if (!result) return null;
  const isOk = result.ok ?? true;
  return (
    <div className={`mt-3 rounded-lg border ${isOk ? "border-emerald-200 bg-emerald-50/50" : "border-rose-200 bg-rose-50/50"} p-3`}>
      <div className="flex items-center gap-2 text-xs font-semibold mb-2">
        <Pill tone={isOk ? "green" : "red"}>{isOk ? "Success" : "Error"}</Pill>
        {result.status !== undefined && <span className="text-slate-500">HTTP {result.status}</span>}
      </div>
      <pre className="text-[11px] text-slate-700 whitespace-pre-wrap break-words max-h-64 overflow-auto font-mono">
        {JSON.stringify(result.data ?? result.raw ?? result, null, 2)}
      </pre>
    </div>
  );
}

function normalizePhone(input: string): string {
  return input.replace(/[^\d]/g, "");
}

export default function WhatsAppTestPage() {
  const user = useUser();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");

  // Templates state
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [templatesError, setTemplatesError] = useState<string | null>(null);

  // Campaign history state
  const [history, setHistory] = useState<CampaignHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  // Send template state
  const [stTemplate, setStTemplate] = useState<number | "">("");
  const [stContact, setStContact] = useState("");
  const [stName, setStName] = useState("");
  const [stAttrs, setStAttrs] = useState<string[]>(["", "", "", ""]);
  const [stResult, setStResult] = useState<{ ok: boolean; status: number; data: unknown; raw: string } | null>(null);
  const [stSending, setStSending] = useState(false);

  // Send text state
  const [txtContact, setTxtContact] = useState("");
  const [txtMessage, setTxtMessage] = useState("Hello from My Clinic — this is a WhatsApp test message.");
  const [txtResult, setTxtResult] = useState<{ ok: boolean; status: number; data: unknown; raw: string } | null>(null);
  const [txtSending, setTxtSending] = useState(false);

  // Lookup state
  const [lookupContact, setLookupContact] = useState("");
  const [lookupResult, setLookupResult] = useState<unknown>(null);
  const [lookupLoading, setLookupLoading] = useState(false);

  useEffect(() => {
    if (user && user.role !== "super_admin" && user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, router]);

  const loadTemplates = useCallback(async () => {
    setTemplatesLoading(true);
    setTemplatesError(null);
    try {
      const res = await fetch("/api/whatsapp/templates");
      const json: Envelope<Template[]> | { error: string; raw?: string } = await res.json();
      if (!res.ok || "error" in json) {
        setTemplatesError("error" in json ? json.error : `HTTP ${res.status}`);
        setTemplates([]);
      } else if (json.isSuccess) {
        setTemplates(json.dataObj || []);
      } else {
        setTemplatesError(json.message || "Anantya returned isSuccess=false");
      }
    } catch (e) {
      setTemplatesError(e instanceof Error ? e.message : "Network error");
    }
    setTemplatesLoading(false);
  }, []);

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const res = await fetch("/api/whatsapp/campaign-history");
      const json: Envelope<CampaignHistoryItem[]> | { error: string } = await res.json();
      if (!res.ok || "error" in json) {
        setHistoryError("error" in json ? json.error : `HTTP ${res.status}`);
        setHistory([]);
      } else if (json.isSuccess) {
        setHistory(json.dataObj || []);
      } else {
        setHistoryError(json.message || "Anantya returned isSuccess=false");
      }
    } catch (e) {
      setHistoryError(e instanceof Error ? e.message : "Network error");
    }
    setHistoryLoading(false);
  }, []);

  useEffect(() => {
    if (tab === "overview" || tab === "templates" || tab === "send-template") {
      if (templates.length === 0 && !templatesLoading && !templatesError) loadTemplates();
    }
    if (tab === "overview" || tab === "history") {
      if (history.length === 0 && !historyLoading && !historyError) loadHistory();
    }
  }, [tab, templates.length, templatesLoading, templatesError, loadTemplates, history.length, historyLoading, historyError, loadHistory]);

  const stats = useMemo(() => {
    const totals = history.reduce(
      (acc, h) => {
        acc.delivered += h.deliveredTotal;
        acc.seen += h.seenTotal;
        acc.failed += h.failTotal;
        acc.sent += h.sentTotal;
        return acc;
      },
      { delivered: 0, seen: 0, failed: 0, sent: 0 },
    );
    return {
      ...totals,
      campaigns: history.length,
      activeTemplates: templates.filter((t) => t.isActive && t.templateStatus === "Accepted").length,
    };
  }, [history, templates]);

  const sendTemplate = async () => {
    if (!stTemplate || !stContact) return;
    setStSending(true);
    setStResult(null);
    const body: Record<string, unknown> = {
      templateId: stTemplate,
      contactNo: normalizePhone(stContact),
      contactName: stName,
    };
    stAttrs.forEach((v, i) => {
      if (v) body[`attribute${i + 1}`] = v;
    });
    try {
      const res = await fetch("/api/whatsapp/send-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      setStResult(json);
    } catch (e) {
      setStResult({ ok: false, status: 0, data: null, raw: e instanceof Error ? e.message : "Network error" });
    }
    setStSending(false);
  };

  const sendText = async () => {
    if (!txtContact || !txtMessage) return;
    setTxtSending(true);
    setTxtResult(null);
    try {
      const res = await fetch("/api/whatsapp/send-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactNo: normalizePhone(txtContact), msgText: txtMessage }),
      });
      const json = await res.json();
      setTxtResult(json);
    } catch (e) {
      setTxtResult({ ok: false, status: 0, data: null, raw: e instanceof Error ? e.message : "Network error" });
    }
    setTxtSending(false);
  };

  const lookup = async () => {
    if (!lookupContact) return;
    setLookupLoading(true);
    setLookupResult(null);
    try {
      const res = await fetch(`/api/whatsapp/contact-exist?contactNo=${encodeURIComponent(normalizePhone(lookupContact))}`);
      const json = await res.json();
      setLookupResult(json);
    } catch (e) {
      setLookupResult({ error: e instanceof Error ? e.message : "Network error" });
    }
    setLookupLoading(false);
  };

  if (!user) return null;

  const selectedTemplate = templates.find((t) => t.id === stTemplate);

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Pill tone="green">Test sandbox</Pill>
            <Pill tone="blue">Anantya.ai · myclinic</Pill>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">WhatsApp Business API</h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Live test surface against <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[12px]">apiv1.anantya.ai</code>. All
            calls flow through our server with the <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[12px]">X-API-Key</code> header
            so the key is never exposed to the browser.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex flex-wrap gap-1">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t.value
                ? "border-[#004d99] text-[#004d99]"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === "overview" && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card title="Connection">
            <ul className="text-sm text-slate-700 space-y-2">
              <li className="flex justify-between"><span className="text-slate-500">Base URL</span><code className="text-[12px]">apiv1.anantya.ai</code></li>
              <li className="flex justify-between"><span className="text-slate-500">Account</span><span className="font-semibold">myclinic</span></li>
              <li className="flex justify-between"><span className="text-slate-500">Auth header</span><code className="text-[12px]">X-API-Key</code></li>
              <li className="flex justify-between items-center"><span className="text-slate-500">Templates loaded</span>{templatesLoading ? <Pill>loading…</Pill> : templatesError ? <Pill tone="red">error</Pill> : <Pill tone="green">{templates.length}</Pill>}</li>
              <li className="flex justify-between items-center"><span className="text-slate-500">Campaign history</span>{historyLoading ? <Pill>loading…</Pill> : historyError ? <Pill tone="red">error</Pill> : <Pill tone="green">{history.length} runs</Pill>}</li>
            </ul>
          </Card>
          <Card title="Aggregate stats">
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Active templates" value={stats.activeTemplates} />
              <Stat label="Campaigns" value={stats.campaigns} />
              <Stat label="Delivered (lifetime)" value={stats.delivered} />
              <Stat label="Seen (lifetime)" value={stats.seen} />
              <Stat label="Sent (lifetime)" value={stats.sent} />
              <Stat label="Failed (lifetime)" value={stats.failed} tone={stats.failed > 0 ? "red" : "slate"} />
            </div>
          </Card>
          <Card title="What you can do" >
            <ul className="text-sm text-slate-700 space-y-2 list-disc pl-5">
              <li><strong>Send approved templates</strong> — appointment reminders, doctor visit announcements, packages, branch openings.</li>
              <li><strong>Send free-form text</strong> within the 24-hour customer service window.</li>
              <li><strong>Send media</strong> — images, documents, audio (PDF lab results, prescriptions, etc.).</li>
              <li><strong>Run bulk campaigns</strong> against a contact list with per-row attributes (name, branch, doctor…).</li>
              <li><strong>Pull conversation history</strong> for any number — used for inbox views, audit, and lead enrichment.</li>
              <li><strong>Track delivery status</strong> per message (sent/delivered/seen/failed).</li>
              <li><strong>Manage contacts</strong> — check existence, rename, attach descriptions/labels.</li>
              <li><strong>Sync leads</strong> via the Leads endpoints (CRUD).</li>
            </ul>
          </Card>
          <Card title="Suggested test plan">
            <ol className="text-sm text-slate-700 space-y-2 list-decimal pl-5">
              <li>Open the <strong>Templates</strong> tab — confirm we see the production My&nbsp;Clinic templates pulled live.</li>
              <li>Open <strong>Campaign History</strong> — confirm last campaign runs and their delivery counters.</li>
              <li>Use <strong>Contact Lookup</strong> with your own WhatsApp number to confirm contact-existence call works.</li>
              <li>Use <strong>Send Template</strong> to send the <code>announcement</code> or <code>package</code> template to your number.</li>
              <li>Reply on WhatsApp, then use <strong>Send Text</strong> to send a free-form follow-up (must be inside the 24h window).</li>
            </ol>
          </Card>
        </div>
      )}

      {/* TEMPLATES */}
      {tab === "templates" && (
        <Card
          title={`Templates (${templates.length})`}
          right={
            <button onClick={loadTemplates} className="text-xs font-semibold text-[#004d99] hover:underline">
              Refresh
            </button>
          }
        >
          {templatesLoading && <p className="text-sm text-slate-500">Loading templates from Anantya…</p>}
          {templatesError && <p className="text-sm text-rose-600">{templatesError}</p>}
          {!templatesLoading && !templatesError && (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {templates.map((t) => (
                <div key={t.id} className="border border-slate-200 rounded-lg p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-slate-800">{t.templateName}</h3>
                    <span className="text-[10px] text-slate-400">#{t.id}</span>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    <Pill tone={t.templateStatus === "Accepted" ? "green" : "amber"}>{t.templateStatus}</Pill>
                    {t.mediaType && <Pill tone="blue">{t.mediaType}</Pill>}
                    {t.isActive ? <Pill tone="green">active</Pill> : <Pill tone="red">inactive</Pill>}
                  </div>
                  <p className="text-[12px] text-slate-600 whitespace-pre-wrap line-clamp-5" dir="auto">
                    {t.msgText || "—"}
                  </p>
                  {t.mediaFileName && (
                    <p className="text-[10px] text-slate-400 truncate" title={t.mediaFileName}>media: {t.mediaFileName}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* SEND TEMPLATE */}
      {tab === "send-template" && (
        <div className="grid gap-4 lg:grid-cols-3">
          <Card title="Send a template message">
            <div className="space-y-3">
              <Field label="Template">
                <select
                  value={stTemplate}
                  onChange={(e) => setStTemplate(e.target.value ? Number(e.target.value) : "")}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
                >
                  <option value="">— pick a template —</option>
                  {templates
                    .filter((t) => t.isActive && t.templateStatus === "Accepted")
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.templateName} (#{t.id})
                      </option>
                    ))}
                </select>
              </Field>
              <Field label="Recipient phone (digits only, with country code)">
                <input
                  value={stContact}
                  onChange={(e) => setStContact(e.target.value)}
                  placeholder="9665XXXXXXXX"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                />
              </Field>
              <Field label="Recipient name (optional)">
                <input
                  value={stName}
                  onChange={(e) => setStName(e.target.value)}
                  placeholder="e.g. Mounir"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                />
              </Field>
              <details>
                <summary className="text-xs font-semibold text-slate-500 cursor-pointer">Template variables (Attribute1–Attribute4)</summary>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {stAttrs.map((v, i) => (
                    <input
                      key={i}
                      value={v}
                      onChange={(e) => setStAttrs((a) => a.map((x, j) => (j === i ? e.target.value : x)))}
                      placeholder={`Attribute${i + 1}`}
                      className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
                    />
                  ))}
                </div>
              </details>
              <button
                disabled={!stTemplate || !stContact || stSending}
                onClick={sendTemplate}
                className="bg-[#004d99] text-white font-semibold rounded-lg px-4 py-2 text-sm disabled:opacity-50"
              >
                {stSending ? "Sending…" : "Send template"}
              </button>
              <ResultBox result={stResult} />
            </div>
          </Card>
          <Card title="Template preview">
            {selectedTemplate ? (
              <div className="space-y-2">
                <div className="flex gap-1.5 flex-wrap">
                  <Pill tone={selectedTemplate.templateStatus === "Accepted" ? "green" : "amber"}>{selectedTemplate.templateStatus}</Pill>
                  {selectedTemplate.mediaType && <Pill tone="blue">{selectedTemplate.mediaType}</Pill>}
                </div>
                <p className="text-sm text-slate-700 whitespace-pre-wrap" dir="auto">
                  {selectedTemplate.msgText || "—"}
                </p>
                {selectedTemplate.mediaFileName && (
                  <p className="text-[11px] text-slate-400">media: {selectedTemplate.mediaFileName}</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-400">Pick a template to see its content.</p>
            )}
          </Card>
          <Card title="Notes">
            <ul className="text-[12px] text-slate-600 space-y-2 list-disc pl-4">
              <li>Anantya endpoint: <code>POST /api/Campaign/SendSingleTemplateMessage</code></li>
              <li>Phone must include country code, digits only (e.g. <code>9665XXXXXXXX</code>).</li>
              <li>Only <em>Accepted</em> templates can be sent — rejected ones won&rsquo;t deliver.</li>
              <li>Attribute1–13 fill placeholders defined inside the template body.</li>
            </ul>
          </Card>
        </div>
      )}

      {/* SEND TEXT */}
      {tab === "send-text" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card title="Send free-form text (24h window)">
            <div className="space-y-3">
              <Field label="Recipient phone">
                <input
                  value={txtContact}
                  onChange={(e) => setTxtContact(e.target.value)}
                  placeholder="9665XXXXXXXX"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                />
              </Field>
              <Field label="Message">
                <textarea
                  value={txtMessage}
                  onChange={(e) => setTxtMessage(e.target.value)}
                  rows={5}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-y"
                />
              </Field>
              <button
                disabled={!txtContact || !txtMessage || txtSending}
                onClick={sendText}
                className="bg-[#004d99] text-white font-semibold rounded-lg px-4 py-2 text-sm disabled:opacity-50"
              >
                {txtSending ? "Sending…" : "Send text"}
              </button>
              <ResultBox result={txtResult} />
            </div>
          </Card>
          <Card title="When does this work?">
            <p className="text-sm text-slate-600">
              WhatsApp only allows <strong>free-form text</strong> when the user has messaged you within the last <strong>24 hours</strong>.
              Outside of that window you must use an approved <em>template</em> — see the <button className="underline text-[#004d99]" onClick={() => setTab("send-template")}>Send Template</button> tab.
            </p>
            <p className="text-sm text-slate-600 mt-3">
              Endpoint: <code className="text-[12px] bg-slate-100 px-1 rounded">POST /api/Messages/sendtext</code>
            </p>
          </Card>
        </div>
      )}

      {/* CAMPAIGN HISTORY */}
      {tab === "history" && (
        <Card
          title={`Campaign history (${history.length})`}
          right={
            <button onClick={loadHistory} className="text-xs font-semibold text-[#004d99] hover:underline">
              Refresh
            </button>
          }
        >
          {historyLoading && <p className="text-sm text-slate-500">Loading…</p>}
          {historyError && <p className="text-sm text-rose-600">{historyError}</p>}
          {!historyLoading && !historyError && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase text-slate-400 border-b border-slate-200">
                    <th className="py-2 pr-3 font-semibold">Campaign</th>
                    <th className="py-2 pr-3 font-semibold">Tpl</th>
                    <th className="py-2 pr-3 font-semibold">Sent</th>
                    <th className="py-2 pr-3 font-semibold">Delivered</th>
                    <th className="py-2 pr-3 font-semibold">Seen</th>
                    <th className="py-2 pr-3 font-semibold">Failed</th>
                    <th className="py-2 pr-3 font-semibold">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h) => (
                    <tr key={h.id} className="border-b border-slate-50">
                      <td className="py-2 pr-3 font-mono text-[11px]">{h.campaignName}</td>
                      <td className="py-2 pr-3">#{h.templateId}</td>
                      <td className="py-2 pr-3">{h.sentTotal}</td>
                      <td className="py-2 pr-3 text-emerald-700">{h.deliveredTotal}</td>
                      <td className="py-2 pr-3 text-[#004d99]">{h.seenTotal}</td>
                      <td className={`py-2 pr-3 ${h.failTotal > 0 ? "text-rose-600 font-semibold" : ""}`}>{h.failTotal}</td>
                      <td className="py-2 pr-3 text-slate-500 text-[12px]">{new Date(h.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* LOOKUP */}
      {tab === "lookup" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card title="Does this number exist as a contact?">
            <div className="space-y-3">
              <Field label="Phone (with country code)">
                <input
                  value={lookupContact}
                  onChange={(e) => setLookupContact(e.target.value)}
                  placeholder="9665XXXXXXXX"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                />
              </Field>
              <button
                disabled={!lookupContact || lookupLoading}
                onClick={lookup}
                className="bg-[#004d99] text-white font-semibold rounded-lg px-4 py-2 text-sm disabled:opacity-50"
              >
                {lookupLoading ? "Checking…" : "Check"}
              </button>
              {lookupResult !== null && (
                <pre className="mt-3 bg-slate-50 border border-slate-200 rounded-lg p-3 text-[11px] font-mono whitespace-pre-wrap break-words max-h-64 overflow-auto">
                  {JSON.stringify(lookupResult, null, 2)}
                </pre>
              )}
            </div>
          </Card>
          <Card title="What this checks">
            <p className="text-sm text-slate-600">
              Calls <code className="text-[12px] bg-slate-100 px-1 rounded">GET /api/Contacts/contactexist</code>. Useful before
              creating a lead or sending a template — confirms whether Anantya already knows the number from prior conversations.
            </p>
            <p className="text-sm text-slate-600 mt-3">
              Other lookup endpoints we proxy:
            </p>
            <ul className="text-[12px] text-slate-600 list-disc pl-5 mt-1 space-y-1">
              <li><code>/api/whatsapp/contacts?channelName=&amp;id=</code></li>
              <li><code>/api/whatsapp/messages?contactNo=&amp;channelName=</code></li>
              <li><code>/api/whatsapp/message-status?msgId=</code></li>
            </ul>
          </Card>
        </div>
      )}
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function Stat({ label, value, tone = "slate" }: { label: string; value: number; tone?: "slate" | "red" }) {
  return (
    <div className="border border-slate-200 rounded-lg p-3">
      <div className="text-[11px] uppercase tracking-wider text-slate-400">{label}</div>
      <div className={`text-2xl font-bold ${tone === "red" ? "text-rose-600" : "text-slate-800"}`}>{value}</div>
    </div>
  );
}

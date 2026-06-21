// Server-side helpers for the Anantya.ai WhatsApp Business API.
// Docs: https://apiv1.anantya.ai/swagger/index.html
// All requests authenticate via the X-API-Key header.

const BASE_URL = process.env.ANANTYA_BASE_URL || "https://apiv1.anantya.ai";
const API_KEY = process.env.ANANTYA_API_KEY || "";

export type AnantyaEnvelope<T> = {
  dataObj: T;
  isSuccess: boolean;
  responseCode: number;
  message: string | null;
};

export type Template = {
  id: number;
  templateName: string;
  mediaType: string | null;
  msgText: string | null;
  mediaFileName: string | null;
  templateStatus: string;
  isActive: boolean;
};

export type CampaignHistoryItem = {
  id: number;
  templateId: number;
  processingCount: number;
  sentTotal: number;
  deliveredTotal: number;
  seenTotal: number;
  failTotal: number;
  campaignName: string;
  orderNo: string | null;
  mediaType: string | null;
  msgText: string | null;
  mediaFileName: string | null;
  fileExt: string | null;
  createdAt: string;
};

export type ContactRecord = {
  id: number;
  contactNo: string;
  contactName: string | null;
  whatsAppName: string | null;
  createdAt: string;
  channelName: string | null;
  contactDescription: string | null;
  isActive: boolean;
  labels: string | null;
  msgText: string | null;
  msgTime: string | null;
};

function assertConfigured(): void {
  if (!API_KEY) {
    throw new Error("ANANTYA_API_KEY is not configured. Set it in .env.local");
  }
}

async function request<T>(
  path: string,
  init: RequestInit & { query?: Record<string, string | number | boolean | undefined> } = {},
): Promise<{ ok: boolean; status: number; data: T | null; raw: string }> {
  assertConfigured();
  const url = new URL(path, BASE_URL);
  if (init.query) {
    for (const [k, v] of Object.entries(init.query)) {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
    }
  }
  const headers = new Headers(init.headers || {});
  headers.set("X-API-Key", API_KEY);
  headers.set("accept", "application/json");
  if (init.body && !headers.has("Content-Type") && typeof init.body === "string") {
    headers.set("Content-Type", "application/json");
  }
  const res = await fetch(url, { ...init, headers, cache: "no-store" });
  const raw = await res.text();
  let data: T | null = null;
  try {
    data = raw ? (JSON.parse(raw) as T) : null;
  } catch {
    data = null;
  }
  return { ok: res.ok, status: res.status, data, raw };
}

export const anantya = {
  request,
  baseUrl: BASE_URL,
  isConfigured: () => Boolean(API_KEY),

  getTemplates: () =>
    request<AnantyaEnvelope<Template[]>>("/api/Campaign/GetTemplates", { method: "GET" }),

  getTemplateById: (templateId: number) =>
    request<AnantyaEnvelope<Template>>("/api/Campaign/GetTemplateById", {
      method: "GET",
      query: { templateId },
    }),

  getCampaignHistory: () =>
    request<AnantyaEnvelope<CampaignHistoryItem[]>>("/api/Campaign/GetCampaignHistory", {
      method: "POST",
      body: "{}",
    }),

  contactExists: (contactNo: string) =>
    request<AnantyaEnvelope<boolean>>("/api/Contacts/contactexist", {
      method: "GET",
      query: { contactNo },
    }),

  getContacts: (channelName: string, id: number = 0) =>
    request<AnantyaEnvelope<ContactRecord[]>>("/api/Contacts/getcontacts", {
      method: "GET",
      query: { channelName, id },
    }),

  getMessages: (contactNo: string, channelName: string, id: number = 0) =>
    request<AnantyaEnvelope<unknown[]>>("/api/Messages/getmessages", {
      method: "GET",
      query: { contactNo, channelName, id },
    }),

  getMessageStatus: (msgId: number) =>
    request<AnantyaEnvelope<unknown>>("/api/Messages/getStatus", {
      method: "GET",
      query: { msgId },
    }),

  sendText: (contactNo: string, msgText: string) =>
    request<AnantyaEnvelope<unknown>>("/api/Messages/sendtext", {
      method: "POST",
      body: JSON.stringify({ contactNo, msgText }),
    }),

  sendSingleTemplate: (templateId: number, form: FormData) =>
    request<AnantyaEnvelope<unknown>>("/api/Campaign/SendSingleTemplateMessage", {
      method: "POST",
      query: { templateId },
      body: form,
    }),
};

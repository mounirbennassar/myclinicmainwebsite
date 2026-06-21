"use client";

// Captures UTM params from the URL into sessionStorage and pings the
// server-side click tracker once per session. Call this from landing pages
// so raw `?utm_source=...` URLs (that bypass /go/<slug>) still produce a
// click row, which is what powers the UTM dashboard's Clicks column.

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "utm_ref"] as const;
const STORAGE_KEY = "mc_utm";
const REFERRER_KEY = "mc_referrer";
const TRACKED_KEY = "mc_utm_tracked";

export function captureAndTrackUtm(): void {
  if (typeof window === "undefined") return;

  let stored: Record<string, string> | null = null;

  try {
    const params = new URLSearchParams(window.location.search);
    const existing = sessionStorage.getItem(STORAGE_KEY);

    if (!existing) {
      const captured: Record<string, string> = {};
      UTM_KEYS.forEach((k) => {
        const v = params.get(k);
        if (v) captured[k] = v;
      });
      if (Object.keys(captured).length > 0) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(captured));
        stored = captured;
      }
      if (document.referrer) {
        sessionStorage.setItem(REFERRER_KEY, document.referrer);
      }
    } else {
      stored = JSON.parse(existing);
    }
  } catch { /* ignore */ }

  if (!stored) return;

  // Dedupe: only one click per (session × link signature).
  const signature = [
    stored.utm_ref || "",
    stored.utm_source || "",
    stored.utm_medium || "",
    stored.utm_campaign || "",
    stored.utm_term || "",
    stored.utm_content || "",
  ].join("|");

  try {
    if (sessionStorage.getItem(TRACKED_KEY) === signature) return;
    sessionStorage.setItem(TRACKED_KEY, signature);
  } catch { /* ignore — still fire below */ }

  const payload = {
    ref: stored.utm_ref,
    source: stored.utm_source,
    medium: stored.utm_medium,
    campaign: stored.utm_campaign,
    term: stored.utm_term,
    content: stored.utm_content,
    referrer: (() => {
      try { return sessionStorage.getItem(REFERRER_KEY) || undefined; } catch { return undefined; }
    })(),
  };

  // Fire-and-forget; keepalive so it survives navigation.
  try {
    fetch("/api/utm/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  } catch { /* ignore */ }
}

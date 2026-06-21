/* Conversion tracking helpers for all ad platforms */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    ttq?: { track: (...args: unknown[]) => void };
    snaptr?: (...args: unknown[]) => void;
    twq?: (...args: unknown[]) => void;
    lintrk?: (...args: unknown[]) => void;
  }
}

/** Fire when the appointment form is submitted successfully */
export function trackFormSubmit() {
  // GA4 (recommended event — appears in Reports → Engagement → Events)
  window.gtag?.("event", "generate_lead", {
    value: 1.0,
    currency: "SAR",
  });
  // Google Ads
  window.gtag?.("event", "conversion", {
    send_to: "AW-18200624514/NnjtCIjg0LYcEIL73eZD",
    value: 1.0,
    currency: "SAR",
  });
  // Meta
  window.fbq?.("track", "CompleteRegistration");
  // TikTok
  window.ttq?.track("SubmitApplication");
  // Snapchat
  window.snaptr?.("track", "SIGN_UP");
  // X (Twitter)
  window.twq?.("event", "tw-rbu47-rbu4d", {});
  // LinkedIn
  window.lintrk?.("track", { conversion_id: 27409489 });
}

/** Fire when a phone call link is clicked */
export function trackPhoneClick() {
  // GA4 custom event
  window.gtag?.("event", "phone_click", {
    method: "tel",
    value: 1.0,
    currency: "SAR",
  });
  // Google Ads
  window.gtag?.("event", "conversion", {
    send_to: "AW-18200624514/tlVSCOz2xbccEIL73eZD",
    value: 1.0,
    currency: "SAR",
  });
  // Meta
  window.fbq?.("track", "CustomizeProduct");
  // TikTok
  window.ttq?.track("CustomizeProduct");
  // Snapchat
  window.snaptr?.("track", "CUSTOM_EVENT_2");
  // X (Twitter)
  window.twq?.("event", "tw-rbu47-rbu49", {});
  // LinkedIn
  window.lintrk?.("track", { conversion_id: 27409473 });
}

/** Fire when a WhatsApp link is clicked */
export function trackWhatsAppClick() {
  // GA4 custom event
  window.gtag?.("event", "whatsapp_click", {
    method: "whatsapp",
    value: 1.0,
    currency: "SAR",
  });
  // Google Ads
  window.gtag?.("event", "conversion", {
    send_to: "AW-18200624514/ukGMCO_2xbccEIL73eZD",
    value: 1.0,
    currency: "SAR",
  });
  // Meta
  window.fbq?.("track", "Contact");
  // TikTok
  window.ttq?.track("Contact");
  // Snapchat
  window.snaptr?.("track", "CUSTOM_EVENT_1");
  // X (Twitter)
  window.twq?.("event", "tw-rbu47-rbu4a", {});
  // LinkedIn
  window.lintrk?.("track", { conversion_id: 27409481 });
}

import axiosInstance from "../api/axios";

// Lightweight send helper. Non-blocking, swallow errors.
export async function sendAnalyticsEvent(payload) {
  try {
    try {
      if (typeof console !== "undefined") {
        const host =
          (typeof window !== "undefined" &&
            window.location &&
            window.location.hostname) ||
          null;
        if (!host || host === "localhost" || host === "127.0.0.1") {
          try {
            console.debug &&
              console.debug(
                "sendAnalyticsEvent -> payload",
                JSON.stringify(payload)
              );
          } catch (e) {
            console.debug &&
              console.debug("sendAnalyticsEvent -> payload", payload);
          }
        }
      }
    } catch (e) {}
    // Keep request short-lived and fire-and-forget
    await axiosInstance.post(`/analytics/event`, payload, { timeout: 2000 });
  } catch (err) {
    // swallow error — analytics must not break UX
    // console.debug("analytics send error:", err?.message || err);
  }
}

// Helper to generate a small session id
export function makeSessionId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

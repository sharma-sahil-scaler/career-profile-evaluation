import { GTM_ID, COOKIE_KEY } from "../constants/analytics";
import { getCookie } from "./cookie";

/**
 * Lazy loads Google Tag Manager by injecting the GTM script
 */
export function lazyLoadGtm() {
  if (typeof window === "undefined") return;

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];

  // Check if GTM is already loaded
  if (window.dataLayer.find((item) => item["gtm.start"])) {
    return;
  }

  // Push GTM start event
  window.dataLayer.push({
    "gtm.start": new Date().getTime(),
    event: "gtm.js",
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;

  const firstScript = document.getElementsByTagName("script")[0];
  if (firstScript && firstScript.parentNode) {
    firstScript.parentNode.insertBefore(script, firstScript);
  }
}

export function pushServerEvents() {
  if (typeof window === "undefined") return;

  const serverEvents = getCookie(COOKIE_KEY);

  if (serverEvents) {
    try {
      const events = JSON.parse(serverEvents);

      if (Array.isArray(events)) {
        window.dataLayer = window.dataLayer || [];
        events.forEach((event) => {
          window.dataLayer.push(event);
        });
      }
    } catch (error) {
      console.error("Error parsing server events:", error);
    }
  }
}

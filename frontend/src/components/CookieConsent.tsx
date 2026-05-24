import { useState } from "react";
import { Link } from "@tanstack/react-router";

const CONSENT_KEY = "cookie_consent";

export default function CookieConsent() {
  const [consent, setConsent] = useState<string | null>(() => {
    try {
      const search =
        typeof globalThis !== "undefined" && globalThis.location
          ? globalThis.location.search
          : "";
      const params = new URLSearchParams(search);
      const force = params.get("cookies") === "prompt";
      const stored = localStorage.getItem(CONSENT_KEY);
      return force ? null : stored;
    } catch (e) {
      // If anything fails, show the banner
      console.warn("CookieConsent init error", e);
      return null;
    }
  });

  const accept = () => {
    try {
      localStorage.setItem(CONSENT_KEY, "accepted");
    } catch (e) {
      console.warn("Could not persist cookie consent", e);
    }
    setConsent("accepted");
  };

  const decline = () => {
    try {
      localStorage.setItem(CONSENT_KEY, "declined");
    } catch (e) {
      console.warn("Could not persist cookie consent", e);
    }
    setConsent("declined");
  };

  if (consent) return null;

  return (
    <section
      aria-label="Cookie consent"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 z-50 max-w-3xl mx-auto md:mx-0 bg-white border shadow-lg rounded-lg p-4 flex items-start gap-4"
    >
      <div className="flex-1 text-sm text-gray-700">
        This site uses cookies to improve your experience. Read our{" "}
        <Link to="/privacy" className="underline text-bookterracotta">
          privacy policy
        </Link>
        .
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={accept}
          aria-label="Accept cookies"
          className="px-3 py-1 rounded text-white text-sm"
          style={{
            backgroundColor: "#d97706",
            boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
          }}
        >
          Accept
        </button>
        <button
          onClick={decline}
          aria-label="Decline cookies"
          className="px-3 py-1 rounded border text-sm text-gray-700"
        >
          Decline
        </button>
      </div>
    </section>
  );
}

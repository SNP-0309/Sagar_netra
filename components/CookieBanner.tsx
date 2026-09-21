"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const STORAGE_KEY = "sagarnetra_cookie_consent";

type ConsentState = "accepted" | "rejected" | null;

export default function CookieBanner() {
  const [consent, setConsent] = useState<ConsentState>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as ConsentState;
      if (stored === "accepted" || stored === "rejected") {
        setConsent(stored);
      } else {
        // Slight delay so it doesn't flash on first paint
        const timer = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // localStorage unavailable (SSR / private mode)
      setVisible(true);
    }
  }, []);

  function handleAccept() {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch { /* ignore */ }
    setConsent("accepted");
    setVisible(false);
  }

  function handleReject() {
    try {
      localStorage.setItem(STORAGE_KEY, "rejected");
    } catch { /* ignore */ }
    setConsent("rejected");
    setVisible(false);
  }

  // Don't render if consent already given or banner not due yet
  if (consent !== null || !visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie consent"
      aria-describedby="cookie-desc"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-[360px] z-50 animate-fade-up"
    >
      <div className="surface-card p-5 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-8 h-8 rounded-md bg-[rgba(13,115,119,0.2)] border border-[rgba(14,255,236,0.15)] flex items-center justify-center flex-shrink-0"
            aria-hidden="true"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#14FFEC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
          </div>
          <div>
            <p className="text-[#E8F4F8] text-sm font-semibold">Cookie Notice</p>
            <p id="cookie-desc" className="text-[#5E849E] text-xs mt-1 leading-relaxed">
              We use essential cookies only. No third-party tracking or advertising
              cookies.{" "}
              <Link
                href="/privacy"
                className="text-[#14FFEC] underline underline-offset-2 hover:text-[#0AAFA3] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#14FFEC] rounded"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleReject}
            className="btn-secondary flex-1 text-sm py-2 justify-center"
            aria-label="Reject non-essential cookies"
          >
            Reject
          </button>
          <button
            onClick={handleAccept}
            className="btn-primary flex-1 text-sm py-2 justify-center"
            aria-label="Accept cookies"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

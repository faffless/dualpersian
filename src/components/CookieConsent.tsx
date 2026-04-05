"use client";

import { useState, useEffect } from "react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("dp-cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("dp-cookie-consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("dp-cookie-consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] bg-warm-brown/95 backdrop-blur-sm border-t border-warm-border/30 px-4 py-3">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-cream/90 text-center sm:text-left">
          We use essential cookies to keep you signed in. See our{" "}
          <a href="/cookies" className="underline text-white hover:text-primary-light">Cookie Policy</a>.
        </p>
        <div className="flex gap-2 shrink-0">
          <button onClick={decline} className="px-4 py-1.5 text-sm text-cream/70 hover:text-white border border-cream/30 rounded-lg transition-colors">
            Decline
          </button>
          <button onClick={accept} className="px-4 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary-light transition-colors">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

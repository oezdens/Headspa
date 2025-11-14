import React, { useEffect, useState } from "react";

const STORAGE_KEY = "cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      // Remove any previously stored consent to ensure banner shows
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore if not available
    }
    setVisible(true);
  }, []);

  function accept() {
    // Do not persist consent; simply hide banner for current session
    setVisible(false);
  }

  function dismiss() {
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie Banner"
      className="fixed inset-x-0 bottom-6 flex justify-center z-50 pointer-events-none"
    >
      <div className="pointer-events-auto max-w-3xl mx-4 w-full md:w-auto bg-black/95 border border-yellow-400 rounded-lg px-5 py-4 shadow-lg text-white flex items-center gap-4">
        <div className="text-sm leading-snug">
          Diese Website verwendet Cookies, um die Benutzererfahrung zu verbessern. Durch das Klicken auf \"Akzeptieren\" erklärst du dich mit der Verwendung einverstanden.
        </div>

        <div className="ml-2 flex-shrink-0 flex gap-3 items-center">
          <button
            onClick={accept}
            className="bg-yellow-400 text-black font-semibold text-sm px-4 py-2 rounded shadow-sm hover:brightness-95 transition"
          >
            Akzeptieren
          </button>
          <a
            href="#"
            className="text-sm underline text-yellow-300 hover:text-yellow-200"
            onClick={(e) => { e.preventDefault(); dismiss(); }}
          >
            Mehr erfahren
          </a>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";

/** Non-blocked visitor assist. No ja/zh/ru (aligns with geo policy). English stays canonical. */
const INCLUDED_LANGUAGES =
  "en,es,pt,fr,de,it,ko,th,vi,id,hi,ar,tr,pl,nl,sv,no,da,fi";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages?: string;
            autoDisplay?: boolean;
            layout?: number;
          },
          elementId: string,
        ) => void;
      };
    };
  }
}

function mountWidget() {
  const host = document.getElementById("google_translate_element");
  if (!host || !window.google?.translate?.TranslateElement) return;
  host.innerHTML = "";
  new window.google.translate.TranslateElement(
    {
      pageLanguage: "en",
      includedLanguages: INCLUDED_LANGUAGES,
      autoDisplay: false,
    },
    "google_translate_element",
  );
}

export function TranslateAssist() {
  useEffect(() => {
    window.googleTranslateElementInit = () => {
      mountWidget();
    };

    const existing = document.getElementById("google-translate-script");
    if (existing) {
      mountWidget();
      return;
    }

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Keep script cached across navigations; only clear init if unmounted permanently.
    };
  }, []);

  return (
    <div className="mx-auto mt-6 max-w-md rounded-lg border border-border/70 bg-surface px-4 py-3 text-left">
      <p className="text-[10px] font-bold tracking-[0.24em] text-accent uppercase">
        Translate
      </p>
      <p className="mt-1 text-[11px] leading-snug text-muted">
        English is the original. Optional assist for visitors — not a full multilingual site.
      </p>
      <div id="google_translate_element" className="sf6-translate-host mt-2" />
      <p className="mt-2 text-[10px] leading-snug text-muted/70">
        Frame numbers and character names should stay readable. Amazon links remain amazon.com.
      </p>
    </div>
  );
}

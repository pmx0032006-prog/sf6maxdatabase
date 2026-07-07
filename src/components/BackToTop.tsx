"use client";

import { useEffect, useState } from "react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 360);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="back-to-top fixed bottom-4 right-4 z-40 flex items-center gap-1.5 rounded-full border border-accent/45 bg-[#0a0f0c]/92 px-3.5 py-2 text-[11px] font-bold tracking-wide text-accent shadow-[0_8px_28px_rgba(0,0,0,0.35)] backdrop-blur-sm transition hover:border-accent hover:bg-accent/15 hover:text-accent-mint sm:bottom-6 sm:right-6 sm:px-4 sm:text-xs"
      aria-label="ページトップへ戻る"
    >
      <span aria-hidden className="text-sm leading-none">
        ↑
      </span>
      <span className="hidden sm:inline" translate="no">
        TOP
      </span>
    </button>
  );
}

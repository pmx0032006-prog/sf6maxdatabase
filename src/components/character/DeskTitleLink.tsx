"use client";

import type { ReactNode } from "react";

/** Fired by the title link so MoveDesk can reset its selection. */
export const DESK_RESET_EVENT = "sf6-desk-reset";

/** Character title that returns to the top of the character page. */
export function DeskTitleLink({ children, label }: { children: ReactNode; label: string }) {
  return (
    <button
      type="button"
      title={label}
      onClick={() => {
        window.dispatchEvent(new Event(DESK_RESET_EVENT));
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className="cursor-pointer text-left transition hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
    >
      {children}
    </button>
  );
}

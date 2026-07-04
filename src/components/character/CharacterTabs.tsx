"use client";

import { useState, type ReactNode } from "react";

export type CharacterTab = "frame" | "strategy" | "metagame";

type CharacterTabsProps = {
  frameContent: ReactNode;
  strategyContent: ReactNode;
  metagameContent: ReactNode;
};

const tabs: { id: CharacterTab; label: string }[] = [
  { id: "frame", label: "01 FRAME DATA" },
  { id: "strategy", label: "02 CLASSIC" },
  { id: "metagame", label: "03 MODERN" },
];

export function CharacterTabs({
  frameContent,
  strategyContent,
  metagameContent,
}: CharacterTabsProps) {
  const [active, setActive] = useState<CharacterTab>("frame");

  const panel =
    active === "frame"
      ? frameContent
      : active === "strategy"
        ? strategyContent
        : metagameContent;

  return (
    <div>
      <div className="border-b border-border/80 bg-surface">
        <div className="mx-auto flex w-full max-w-[1440px] gap-0 overflow-x-auto px-3 sm:px-5 lg:px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              className={`shrink-0 border-b-2 px-4 py-4 text-[10px] font-bold tracking-[0.18em] transition-colors duration-300 ease-out sm:px-6 sm:text-[11px] ${
                active === tab.id
                  ? "border-accent text-accent"
                  : "border-transparent text-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mx-auto w-full max-w-[1440px] px-3 py-8 sm:px-5 sm:py-10 lg:px-6 lg:py-12">
        {panel}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { roster, type Character } from "@/data/characters";

const MAX_RESULTS = 6;

function matchesQuery(char: Character, query: string) {
  const trimmed = query.trim();
  if (!trimmed) return false;
  const q = trimmed.toLowerCase();
  return (
    char.en.toLowerCase().includes(q) ||
    char.slug.toLowerCase().includes(q) ||
    char.ja.includes(trimmed)
  );
}

export function HeaderCharacterSearch() {
  const listId = useId();
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return roster.filter((char) => matchesQuery(char, query)).slice(0, MAX_RESULTS);
  }, [query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  function goTo(char: Character) {
    setOpen(false);
    setQuery("");
    router.push(`/characters/${char.slug}`);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
      return;
    }

    if (!open || results.length === 0) {
      if (event.key === "Enter" && results.length === 1) {
        event.preventDefault();
        goTo(results[0]);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % results.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + results.length) % results.length);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      goTo(results[activeIndex] ?? results[0]);
    }
  }

  return (
    <div ref={rootRef} className="header-character-search relative w-full min-w-0">
      <label htmlFor={listId} className="sr-only">
        Search fighter
      </label>
      <input
        ref={inputRef}
        id={listId}
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder="Search fighter…"
        autoComplete="off"
        spellCheck={false}
        className="w-full rounded border border-white/15 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold tracking-[0.04em] text-white placeholder:text-white/35 outline-none transition focus:border-accent/50 focus:bg-white/[0.07] sm:px-3 sm:py-1.5 sm:text-[11px]"
      />
      {open && query.trim() && results.length > 0 ? (
        <ul
          role="listbox"
          aria-label="Fighter results"
          className="absolute left-0 right-0 top-[calc(100%+0.25rem)] z-[60] overflow-hidden rounded-md border border-white/12 bg-[#0d1410] py-1 shadow-[0_16px_40px_rgba(0,0,0,0.45)]"
        >
          {results.map((char, index) => (
            <li key={char.slug} role="option" aria-selected={index === activeIndex}>
              <Link
                href={`/characters/${char.slug}`}
                onClick={() => {
                  setOpen(false);
                  setQuery("");
                }}
                className={`flex items-center justify-between gap-2 px-2.5 py-1.5 text-[10px] transition sm:px-3 sm:text-[11px] ${
                  index === activeIndex
                    ? "bg-accent/[0.14] text-accent-mint"
                    : "text-white/80 hover:bg-white/[0.05] hover:text-accent"
                }`}
              >
                <span className="font-bold tracking-[0.08em]" translate="no">
                  {char.en}
                </span>
                <span className="truncate text-white/45">{char.ja}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
      {open && query.trim() && results.length === 0 ? (
        <p className="absolute left-0 right-0 top-[calc(100%+0.25rem)] z-[60] rounded-md border border-white/12 bg-[#0d1410] px-2.5 py-2 text-[10px] text-white/45 sm:px-3 sm:text-[11px]">
          No fighter found
        </p>
      ) : null}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FAVORITES_STORAGE_KEY,
  readFavorites,
  type FavoriteCharacter,
} from "@/lib/favorites";

export function FavoriteSlots() {
  const [favorites, setFavorites] = useState<FavoriteCharacter[]>([]);

  useEffect(() => {
    const sync = () => setFavorites(readFavorites());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("sf6-favorites-updated", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("sf6-favorites-updated", sync);
    };
  }, []);

  if (favorites.length === 0) return null;

  return (
    <nav
      className="hidden items-center gap-1 border-l border-white/10 pl-3 lg:flex"
      aria-label="Favorite characters"
    >
      <span className="text-[8px] font-bold tracking-[0.2em] text-white/40 uppercase">
        Pin
      </span>
      {favorites.map((item) => (
        <Link
          key={item.slug}
          href={`/characters/${item.slug}`}
          className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-white/70 hover:border-accent/40 hover:text-accent"
          translate="no"
        >
          {item.en}
        </Link>
      ))}
    </nav>
  );
}

export function notifyFavoritesUpdated(): void {
  window.dispatchEvent(new Event("sf6-favorites-updated"));
}

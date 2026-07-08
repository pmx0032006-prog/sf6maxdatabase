"use client";

import { useEffect, useState } from "react";
import {
  isFavorite,
  readFavorites,
  toggleFavorite,
  writeFavorites,
  type FavoriteCharacter,
} from "@/lib/favorites";
import { notifyFavoritesUpdated } from "@/components/FavoriteSlots";

type CharacterFavoriteButtonProps = {
  slug: string;
  en: string;
};

export function CharacterFavoriteButton({
  slug,
  en,
}: CharacterFavoriteButtonProps) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(isFavorite(readFavorites(), slug));
  }, [slug]);

  return (
    <button
      type="button"
      onClick={() => {
        const next = toggleFavorite(readFavorites(), { slug, en });
        writeFavorites(next);
        setActive(isFavorite(next, slug));
        notifyFavoritesUpdated();
      }}
      className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[10px] font-bold tracking-wide transition ${
        active
          ? "border-accent/50 bg-accent/15 text-accent"
          : "border-white/15 bg-white/[0.04] text-white/60 hover:border-accent/35 hover:text-accent"
      }`}
      aria-pressed={active}
    >
      <span aria-hidden>{active ? "★" : "☆"}</span>
      {active ? "Pinned" : "Pin character"}
    </button>
  );
}

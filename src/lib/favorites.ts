export const FAVORITES_STORAGE_KEY = "sf6max-favorites";
export const MAX_FAVORITES = 3;

export type FavoriteCharacter = {
  slug: string;
  en: string;
};

export function readFavorites(): FavoriteCharacter[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as FavoriteCharacter[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item) =>
          item &&
          typeof item.slug === "string" &&
          typeof item.en === "string",
      )
      .slice(0, MAX_FAVORITES);
  } catch {
    return [];
  }
}

export function writeFavorites(items: FavoriteCharacter[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    FAVORITES_STORAGE_KEY,
    JSON.stringify(items.slice(0, MAX_FAVORITES)),
  );
}

export function toggleFavorite(
  current: FavoriteCharacter[],
  entry: FavoriteCharacter,
): FavoriteCharacter[] {
  const index = current.findIndex((item) => item.slug === entry.slug);
  if (index >= 0) {
    return current.filter((item) => item.slug !== entry.slug);
  }
  const next = [entry, ...current.filter((item) => item.slug !== entry.slug)];
  return next.slice(0, MAX_FAVORITES);
}

export function isFavorite(
  current: FavoriteCharacter[],
  slug: string,
): boolean {
  return current.some((item) => item.slug === slug);
}

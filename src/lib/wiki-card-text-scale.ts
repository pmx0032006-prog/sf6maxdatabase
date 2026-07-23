export type WikiCardTextScale = "default" | "readable";

/** Larger, more readable card typography for all wiki-full-ui characters. */
export function getWikiCardTextScale(_characterSlug: string): WikiCardTextScale {
  return "readable";
}

export function wikiCardStatSize(
  scale: WikiCardTextScale,
): "sm" | "card" | "card-lg" | "card-xl" {
  return scale === "readable" ? "card-xl" : "sm";
}

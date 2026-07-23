import { getBaseSlug, getMoveKey } from "@/lib/move-sort";

const MARISA_MOVE_INPUT: Record<string, string> = {
  "214k_lp_lk": "214k_lp+lk",
  "214k_lplk": "214k_lp+lk",
  "214_lplk": "214k_lp+lk",
  "214k_lk": "214k_lp+lk",
};

export function formatMarisaMoveInput(
  imageSlug: string,
  wikiInput?: string | null,
): string | undefined {
  const key = getMoveKey(getBaseSlug(imageSlug));
  return MARISA_MOVE_INPUT[key] ?? undefined;
}

/** マノン — 623→63214・4HK→3HK・236LP派生 など */

const MANON_ALIASES: Record<string, string[]> = {
  "236lp2lp": ["236lp"],
  "236lplk": ["236lp"],
  "236lp_2lp": ["236lp"],
  "236ppod2lp": ["236pp", "236pp_k"],
  "4hk": ["3hk"],
  "623lp": ["63214lp"],
  "623mp": ["63214mp"],
  "623hp": ["63214hp"],
  "623ppod": ["63214pp"],
};

function addUnique(out: string[], key: string) {
  const v = key.toLowerCase();
  if (v && !out.includes(v)) out.push(v);
}

function normalizeManonKey(rawKey: string): string {
  return rawKey
    .toLowerCase()
    .replace(/^manon_/, "")
    .replace(/236lp2lp/gi, "236lp")
    .replace(/236lplk/gi, "236lp")
    .replace(/236lp_2lp/gi, "236lp")
    .replace(/236ppod2lp/gi, "236pp")
    .replace(/623ppod/gi, "63214pp")
    .replace(/623lp/gi, "63214lp")
    .replace(/623mp/gi, "63214mp")
    .replace(/623hp/gi, "63214hp")
    .replace(/4hk/gi, "3hk")
    .replace(/ppod/gi, "pp")
    .replace(/_+$/, "");
}

export function expandManonLookupKeys(rawKey: string): string[] {
  const out: string[] = [];
  const add = (k: string) => addUnique(out, k);

  const key = rawKey.toLowerCase().replace(/_+$/, "");
  if (!key) return out;

  add(key);

  const normalized = normalizeManonKey(key);
  if (normalized !== key) add(normalized);

  for (const candidate of [key, normalized]) {
    if (!candidate) continue;
    const aliases = MANON_ALIASES[candidate];
    if (aliases) {
      for (const alias of aliases) add(alias);
    }
  }

  return out;
}

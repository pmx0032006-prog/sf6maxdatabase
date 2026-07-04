/** ルーク — Sand Blast強度表記・TC など */

const LUKE_ALIASES: Record<string, string[]> = {
  "236lk": ["236lp"],
  "236mk": ["236mp"],
  "236hk": ["236hp"],
  "2mkhp": ["2mk_2hp"],
  "5lpmp": ["5lp_mp"],
  "5lpmphp": ["5lp_mp_hp"],
  "5mpmp": ["5mp_mp"],
  "5mpmpmp": ["5mp_mp_mp"],
  "5mpmpmpmp": ["5mp_mp_mp_mp"],
  "6hphp": ["6hp_hp"],
};

function addUnique(out: string[], key: string) {
  const v = key.toLowerCase();
  if (v && !out.includes(v)) out.push(v);
}

function normalizeLukeKey(rawKey: string): string {
  return rawKey
    .toLowerCase()
    .replace(/^ruke_/, "")
    .replace(/236lk/gi, "236lp")
    .replace(/236mk/gi, "236mp")
    .replace(/236hk/gi, "236hp")
    .replace(/2mkhp/gi, "2mk_2hp")
    .replace(/5lpmphp/gi, "5lp_mp_hp")
    .replace(/5lpmp/gi, "5lp_mp")
    .replace(/5mpmpmpmp/gi, "5mp_mp_mp_mp")
    .replace(/5mpmpmp/gi, "5mp_mp_mp")
    .replace(/5mpmp/gi, "5mp_mp")
    .replace(/6hphp/gi, "6hp_hp")
    .replace(/_+$/, "");
}

export function expandLukeLookupKeys(rawKey: string): string[] {
  const out: string[] = [];
  const add = (k: string) => addUnique(out, k);

  const key = rawKey.toLowerCase().replace(/_+$/, "");
  if (!key) return out;

  add(key);

  const normalized = normalizeLukeKey(key);
  if (normalized !== key) add(normalized);

  for (const candidate of [key, normalized]) {
    if (!candidate) continue;
    const aliases = LUKE_ALIASES[candidate];
    if (aliases) {
      for (const alias of aliases) add(alias);
    }
  }

  return out;
}

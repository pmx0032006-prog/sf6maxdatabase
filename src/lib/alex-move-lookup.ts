/** アレックス — Prowler Stance(2PP)派生・236HP→ODパワボム・TC など */

const ALEX_ALIASES: Record<string, string[]> = {
  "2lkhk": ["2lk_2hk"],
  "2pp_6hp": ["2pp_6p"],
  "2pp_6lp": ["2pp_6p"],
  "2pp_hkhk": ["2pp_hk_hk"],
  "5mphp": ["5mp_hp"],
  "63214ppod": ["63214pp"],
  "236hp_63214ppod": ["63214pp", "236hp"],
  "236hp_63214ppod_pp": ["pp_sa2", "63214pp"],
};

function addUnique(out: string[], key: string) {
  const v = key.toLowerCase();
  if (v && !out.includes(v)) out.push(v);
}

function normalizeAlexKey(rawKey: string): string {
  return rawKey
    .toLowerCase()
    .replace(/^are_/, "")
    .replace(/2lkhk/gi, "2lk_2hk")
    .replace(/2pp_6hp/gi, "2pp_6p")
    .replace(/2pp_6lp/gi, "2pp_6p")
    .replace(/2pp_hkhk/gi, "2pp_hk_hk")
    .replace(/5mphp/gi, "5mp_hp")
    .replace(/63214ppod/gi, "63214pp")
    .replace(/_6lp/gi, "_6p")
    .replace(/_6hp/gi, "_6p")
    .replace(/_+$/, "");
}

function comboRouteCandidates(key: string): string[] {
  const out: string[] = [];
  const k = normalizeAlexKey(key);

  if (/236hp_63214pp/i.test(k)) {
    addUnique(out, "63214pp");
    addUnique(out, "236hp");
  }
  if (/63214pp.*pp_sa2/i.test(k) || /236hp_63214pp.*pp_sa2/i.test(k)) {
    addUnique(out, "pp_sa2");
    addUnique(out, "63214pp");
  }
  if (/^pp_sa2/i.test(k)) {
    addUnique(out, "pp_sa2");
  }

  return out;
}

function odComboCandidates(key: string): string[] {
  const out: string[] = [];

  if (/ppod$/i.test(key)) {
    addUnique(out, key.replace(/ppod$/i, "pp"));
  }
  if (/kkod$/i.test(key)) {
    addUnique(out, key.replace(/kkod$/i, "kk"));
  }

  return out;
}

export function expandAlexLookupKeys(rawKey: string): string[] {
  const out: string[] = [];
  const add = (k: string) => addUnique(out, k);

  const key = rawKey.toLowerCase().replace(/_+$/, "");
  if (!key) return out;

  add(key);

  const normalized = normalizeAlexKey(key);
  if (normalized !== key) add(normalized);

  for (const candidate of [key, normalized]) {
    if (!candidate) continue;
    const aliases = ALEX_ALIASES[candidate];
    if (aliases) {
      for (const alias of aliases) add(alias);
    }
    for (const od of odComboCandidates(candidate)) add(od);
  }

  for (const candidate of comboRouteCandidates(key)) add(candidate);
  for (const candidate of comboRouteCandidates(normalized)) add(candidate);

  return out;
}

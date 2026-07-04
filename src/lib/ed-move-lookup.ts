/** エド — 236p/k強度表記・ホールド(hld)・Kill Rush(kk)・TC など */

const ED_ALIASES: Record<string, string[]> = {
  "236lp": ["236p"],
  "236mp": ["236p"],
  "236hp": ["236p"],
  "236l": ["236lk", "236p"],
  "236lp_6lp": ["236p_6p"],
  "236hp_6hp": ["236p_6p"],
  "236mp_6mp": ["236pp_6p", "236p_6p"],
  "2hkhp": ["2hk_hp"],
  "4lkmk": ["4lplk"],
  lklklk: ["5lk_lk_lk"],
  mkmkhp: ["5mk_mk_hp"],
  mphp: ["5mp_hp"],
  "5hphld": ["5hp_hold_lv1", "5hp_hold_lv2"],
  kk: ["6kk", "4kk"],
  kk_6lp: ["6kk_6p", "6kk_dl_6p"],
  "623od": ["623pp"],
  sa1: ["236236k"],
  sa2: ["214214p"],
  sa3: ["236236p", "236236p(ca)"],
};

function addUnique(out: string[], key: string) {
  const v = key.toLowerCase();
  if (v && !out.includes(v)) out.push(v);
}

function normalizeEdKey(rawKey: string): string {
  return rawKey
    .toLowerCase()
    .replace(/hkhod_dk/gi, "hk_hold")
    .replace(/hkhod/gi, "hk_hold")
    .replace(/_hld/gi, "_hold")
    .replace(/hphld/gi, "hp_hold")
    .replace(/_6lp/gi, "_6p")
    .replace(/_6hp/gi, "_6p")
    .replace(/_6mp/gi, "_6p")
    .replace(/5hp_hold$/i, "5hp_hold_lv1")
    .replace(/_+$/, "");
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

function holdCandidates(key: string): string[] {
  const out: string[] = [];

  if (/^5hp_hold(?:_\d+)?$/i.test(key)) {
    addUnique(out, "5hp_hold_lv1");
    addUnique(out, "5hp_hold_lv2");
  }
  if (/^236hk_hold/i.test(key)) {
    addUnique(out, "236hk_hold");
  }
  if (/^236lk_hold/i.test(key)) {
    addUnique(out, "236lk_hold");
  }
  if (/^236mk_hold/i.test(key)) {
    addUnique(out, "236mk_hold");
  }

  return out;
}

export function expandEdLookupKeys(rawKey: string): string[] {
  const out: string[] = [];
  const add = (k: string) => addUnique(out, k);

  const key = rawKey.toLowerCase().replace(/_+$/, "");
  if (!key) return out;

  add(key);

  const normalized = normalizeEdKey(key);
  if (normalized !== key) add(normalized);

  for (const candidate of [key, normalized]) {
    if (!candidate) continue;
    const aliases = ED_ALIASES[candidate];
    if (aliases) {
      for (const alias of aliases) add(alias);
    }
    for (const od of odComboCandidates(candidate)) add(od);
    for (const hold of holdCandidates(candidate)) add(hold);
  }

  return out;
}

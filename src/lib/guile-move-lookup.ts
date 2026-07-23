/** ガイル — チャージ表記・ソニック/サマーソルト・TC など */

const GUILE_ALIASES: Record<string, string[]> = {
  "214od": ["214pp"],
  "214lpmpod": ["214pp"],
  "214mphpod": ["214pp"],
  "2146lp": ["214p_6p"],
  "214od6lp": ["214pp_6p"],
  "214lp_6lp": ["214p_6p"],
  "214lp_6mp": ["214p_6p"],
  "214lp_6hp": ["214p_6pp", "214p_6p"],
  "2hk3hk": ["2hk_3hk"],
  "2mk6mp": ["2mk_6mp"],
  "2mpmp": ["2mp_2mp"],
  "5mp4hp": ["5mp_4hp"],
  "4hk": ["3hk"],
  "6mk": ["4mk_or_6mk"],
  lksamaa: ["28lk"],
  mksamaa: ["28mk"],
  odsamaa: ["28kk"],
  sa1: ["4646p"],
  sa2: ["4646k", "4646k(ca)"],
  sa3: ["214214p"],
  "4c-6ppod": ["46pp"],
};

function addUnique(out: string[], key: string) {
  const v = key.toLowerCase();
  if (v && !out.includes(v)) out.push(v);
}

/** 2c-8hk → 28hk、4c-646lk → 4646k など */
function normalizeChargeNotation(key: string): string {
  return key
    .toLowerCase()
    .replace(/4c-646lk/gi, "4646k")
    .replace(/4c-646lp/gi, "4646p")
    .replace(/2c-8/gi, "28")
    .replace(/4c-6/gi, "46")
    .replace(/4-6/gi, "46")
    .replace(/-/g, "")
    .replace(/_+$/, "");
}

function superCandidates(key: string): string[] {
  const out: string[] = [];
  const normalized = normalizeChargeNotation(key);

  if (/4646k_sa\d/i.test(normalized)) {
    addUnique(out, "4646k");
    addUnique(out, "4646k(ca)");
  }
  if (/4646p_sa\d/i.test(normalized)) {
    addUnique(out, "4646p");
  }
  if (/214214lp_sa\d/i.test(normalized)) {
    addUnique(out, "214214p");
  }

  return out;
}

function sonicBladeFollowups(key: string): string[] {
  const out: string[] = [];

  const m = key.match(/^214(?:lp|mp|hp|od|lpmpod|mphpod)(?:_)?6(lp|mp|hp)$/i);
  if (m) {
    const btn = m[1].toLowerCase();
    if (btn === "hp") {
      addUnique(out, "214p_6pp");
      addUnique(out, "214pp_6pp");
    } else {
      addUnique(out, "214p_6p");
      addUnique(out, "214pp_6p");
    }
  }

  return out;
}

export function expandGuileLookupKeys(rawKey: string): string[] {
  const out: string[] = [];
  const add = (k: string) => addUnique(out, k);

  const key = rawKey.toLowerCase().replace(/_+$/, "");
  if (!key) return out;

  add(key);

  const normalized = normalizeChargeNotation(key);
  if (normalized !== key) add(normalized);

  const aliases = GUILE_ALIASES[key] ?? GUILE_ALIASES[normalized];
  if (aliases) {
    for (const alias of aliases) add(alias);
  }

  if (/ppod$/i.test(normalized)) {
    add(normalized.replace(/ppod$/i, "pp"));
  }
  if (/kkod$/i.test(normalized)) {
    add(normalized.replace(/kkod$/i, "kk"));
  }

  if (/samaa$/i.test(normalized)) {
    if (normalized.startsWith("lk")) add("28lk");
    if (normalized.startsWith("mk")) add("28mk");
    if (normalized.startsWith("od")) add("28kk");
  }

  for (const candidate of superCandidates(key)) add(candidate);
  for (const candidate of superCandidates(normalized)) add(candidate);
  for (const candidate of sonicBladeFollowups(key)) add(candidate);

  return out;
}

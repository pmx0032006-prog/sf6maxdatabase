/** E.本田 — チャージ表記・236K派生・pu(百裂強化)・22P/K など */

const EHONDA_ALIASES: Record<string, string[]> = {
  "22lp": ["22p"],
  "22mp": ["22k"],
  "22mk": ["22k"],
  "22hp": ["22k"],
  "236mk": ["236k"],
  "5lpmp": ["5lp_mp"],
  "5mp3hk2hk": ["5mp_3hk"],
  njhp: ["8jhp"],
  lhk: ["5hk"],
  "4c-6od": ["46pp"],
  sa1: ["236236p"],
  sa2: ["4646k"],
  sa3: ["214214p", "214214p(ca)"],
};

function addUnique(out: string[], key: string) {
  const v = key.toLowerCase();
  if (v && !out.includes(v)) out.push(v);
}

function normalizeHondaKey(rawKey: string): string {
  return rawKey
    .toLowerCase()
    .replace(/^pu_/, "")
    .replace(/4c-646lk/gi, "4646k")
    .replace(/4c-646mk/gi, "4646k")
    .replace(/2c-8/gi, "28")
    .replace(/4c-6/gi, "46")
    .replace(/4-6/gi, "46")
    .replace(/236mk/gi, "236k")
    .replace(/236k_lplp/gi, "236k_p_p")
    .replace(/236k_2lp/gi, "236k_2p")
    .replace(/236k_lp/gi, "236k_p")
    .replace(/236kkod_lplp/gi, "236kk_p_p")
    .replace(/236kkod_2lp/gi, "236kk_2p")
    .replace(/236kkod_lp/gi, "236kk_p")
    .replace(/-/g, "")
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

function superCandidates(key: string): string[] {
  const out: string[] = [];
  const k = normalizeHondaKey(key);

  if (/4646k_sa\d/i.test(k)) {
    addUnique(out, "4646k");
  }
  if (/4646lk_sa\d/i.test(k)) {
    addUnique(out, "4646k");
  }
  if (/4646mk_sa\d/i.test(k)) {
    addUnique(out, "4646k");
  }
  if (/236236lp_sa\d/i.test(k)) {
    addUnique(out, "236236p");
  }
  if (/214214lp_sa\d/i.test(k)) {
    addUnique(out, "214214p");
    addUnique(out, "214214p(ca)");
  }

  return out;
}

export function expandEHondaLookupKeys(rawKey: string): string[] {
  const out: string[] = [];
  const add = (k: string) => addUnique(out, k);

  const key = rawKey.toLowerCase().replace(/_+$/, "");
  if (!key) return out;

  add(key);

  const normalized = normalizeHondaKey(key);
  if (normalized !== key) add(normalized);

  for (const candidate of [key, normalized]) {
    if (!candidate) continue;
    const aliases = EHONDA_ALIASES[candidate];
    if (aliases) {
      for (const alias of aliases) add(alias);
    }
    for (const od of odComboCandidates(candidate)) add(od);
  }

  for (const candidate of superCandidates(key)) add(candidate);
  for (const candidate of superCandidates(normalized)) add(candidate);

  return out;
}

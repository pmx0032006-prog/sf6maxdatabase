/** 春麗 — チャージ表記・214-lp・lkmkod OD・SA など */

const CHUNLI_ALIASES: Record<string, string[]> = {
  "214lp": ["214p_lp"],
  "214mp": ["214p_mp"],
  "214hp": ["214p_hp"],
  "214lkmkod": ["214kk"],
  "22lkmkod": ["22kk"],
  "236lkmkod": ["236kk"],
  "j236lkmkod": ["j236kk"],
  "46lpmpod": ["46pp"],
  "4-6p": ["46lp", "46mp", "46hp"],
  "6or4-mp": ["6mp"],
  "sa1": ["236236p"],
  "sa2": ["236236k"],
  "sa3": ["214214k", "214214k(ca)"],
  suijhk: ["walljump", "8jhk", "jhk"],
};

function odSuffixCandidates(key: string): string[] {
  const out: string[] = [];
  if (/lkmkod$/i.test(key)) {
    out.push(key.replace(/lkmkod$/i, "kk"));
  }
  if (/kkod$/i.test(key)) {
    out.push(key.replace(/kkod$/i, "kk"));
  }
  if (/lpmpod$/i.test(key)) {
    out.push(key.replace(/lpmpod$/i, "pp"));
  }
  if (/ppod$/i.test(key)) {
    out.push(key.replace(/ppod$/i, "pp"));
  }
  return out;
}

function addUnique(out: string[], key: string) {
  const v = key.toLowerCase();
  if (v && !out.includes(v)) out.push(v);
}

function normalizeChunLiKey(rawKey: string): string {
  return rawKey
    .toLowerCase()
    .replace(/^(chin|chiu|cyun|chun)_/i, "")
    .replace(/(214|22|236)-([a-z]{2})/gi, "$1$2")
    .replace(/2c-8/gi, "28")
    .replace(/4c-6/gi, "46")
    .replace(/4-6/gi, "46")
    .replace(/-/g, "")
    .replace(/_+$/, "");
}

function odComboCandidates(key: string): string[] {
  const out: string[] = [];
  if (/lkmkod$/i.test(key)) {
    addUnique(out, key.replace(/lkmkod$/i, "kk"));
  }
  if (/lpmpod$/i.test(key)) {
    addUnique(out, key.replace(/lpmpod$/i, "pp"));
  }
  return out;
}

function superCandidates(key: string): string[] {
  const out: string[] = [];
  const k = normalizeChunLiKey(key);

  if (/236236lk_sa\d/i.test(k)) {
    addUnique(out, "236236k");
  }
  if (/236236lp_sa\d/i.test(k)) {
    addUnique(out, "236236p");
  }
  if (/8j236236lp_sa\d/i.test(k)) {
    addUnique(out, "j236236p");
    addUnique(out, "236236p");
  }
  if (/214214lk_sa\d/i.test(k)) {
    addUnique(out, "214214k");
    addUnique(out, "214214k(ca)");
  }

  return out;
}

export function expandChunLiLookupKeys(rawKey: string): string[] {
  const out: string[] = [];
  const add = (k: string) => addUnique(out, k);

  const key = rawKey.toLowerCase().replace(/_+$/, "");
  if (!key) return out;

  add(key);

  const normalized = normalizeChunLiKey(key);
  if (normalized !== key) add(normalized);

  for (const candidate of [key, normalized]) {
    const aliases = CHUNLI_ALIASES[candidate];
    if (aliases) {
      for (const alias of aliases) add(alias);
    }
    for (const od of odComboCandidates(candidate)) add(od);
    for (const od of odSuffixCandidates(candidate)) add(od);
  }

  for (const candidate of superCandidates(key)) add(candidate);
  for (const candidate of superCandidates(normalized)) add(candidate);

  const jump = normalized.match(/^[789]j(.+)$/i) ?? key.match(/^[789]j(.+)$/i);
  if (jump) {
    const jkey = `j${jump[1].toLowerCase()}`;
    add(jkey);
    for (const od of odSuffixCandidates(jkey)) add(od);
    for (const od of odComboCandidates(jkey)) add(od);
    const jAliases = CHUNLI_ALIASES[jkey];
    if (jAliases) {
      for (const alias of jAliases) add(alias);
    }
  }

  return out;
}

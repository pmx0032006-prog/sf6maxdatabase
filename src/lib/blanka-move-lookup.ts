/** ブランカ — チャージ表記・人形(doll)・63214/46 派生など */

const BLANKA_ALIASES: Record<string, string[]> = {
  "214lp": ["214p"],
  "214mp": ["214p"],
  "214hp": ["214p"],
  "22lp": ["22p"],
  "22mp": ["22p"],
  "22hp": ["22p"],
  "2lpmp": ["2pp"],
  "2lpmp_k": ["2pp_k"],
  "2lpmp_p": ["2pp_p"],
  "63214k": ["63214lk", "63214mk", "63214hk"],
  "4lkmkhk": ["63214hk"],
  "6lkmkhk": ["63214hk"],
  "4-6mk": ["46mp", "4mk"],
  "6-4mk": ["63214mk"],
  jnhp: ["8jhp", "jhp"],
  sa1: ["236236p"],
  sa2: ["214214p"],
  sa3: ["236236k"],
};

function addUnique(out: string[], key: string) {
  const v = key.toLowerCase();
  if (v && !out.includes(v)) out.push(v);
}

function normalizeBlankaKey(rawKey: string): string {
  return rawKey
    .toLowerCase()
    .replace(/22lp-blanca-doll/i, "22lp")
    .replace(/ブランカ_test/i, "")
    .replace(/2c-8/gi, "28")
    .replace(/4c-6/gi, "46")
    .replace(/4-6/gi, "46")
    .replace(/7c-6/gi, "j46")
    .replace(/7-6/gi, "j46")
    .replace(/6-4/gi, "63214")
    .replace(/-/g, "")
    .replace(/_+$/, "");
}

function odComboCandidates(key: string): string[] {
  const out: string[] = [];

  if (/lpmpod$/i.test(key)) {
    addUnique(out, key.replace(/lpmpod$/i, "pp"));
  }
  if (/^46.*lkmkod$/i.test(key)) {
    addUnique(out, key.replace(/lkmkod$/i, "pp"));
  } else if (/lkmkod$/i.test(key)) {
    addUnique(out, key.replace(/lkmkod$/i, "kk"));
  }

  return out;
}

function dollCandidates(key: string): string[] {
  const out: string[] = [];

  if (/doll/i.test(key) || /lpmlld/i.test(key)) {
    addUnique(out, "22p");
    addUnique(out, "22p_214p");
    addUnique(out, "22p_214pp");
  }
  if (/doll_elc/i.test(key)) {
    addUnique(out, "22p_214p");
    addUnique(out, "22p_214pp");
    addUnique(out, "22p_236236p");
  }

  return out;
}

function aerialThunderCandidates(key: string): string[] {
  const out: string[] = [];

  if (/^j46/i.test(key)) {
    addUnique(out, "j46p");
    addUnique(out, "j46pp");
    if (/hp/i.test(key)) addUnique(out, "j46p");
    if (/lp/i.test(key)) addUnique(out, "j46p");
    if (/mp/i.test(key)) addUnique(out, "j46p");
    if (/ppod/i.test(key)) addUnique(out, "j46pp");
  }

  return out;
}

function superCandidates(key: string): string[] {
  const out: string[] = [];
  const k = normalizeBlankaKey(key);

  if (/236236lk_sa\d/i.test(k)) {
    addUnique(out, "236236k");
    addUnique(out, "236236k(ca)");
  }
  if (/236236lp_sa\d/i.test(k)) {
    addUnique(out, "236236p");
  }
  if (/214214lp_sa\d/i.test(k)) {
    addUnique(out, "214214p");
  }

  return out;
}

export function expandBlankaLookupKeys(rawKey: string): string[] {
  const out: string[] = [];
  const add = (k: string) => addUnique(out, k);

  const key = rawKey.toLowerCase().replace(/_+$/, "");
  if (!key) return out;

  add(key);

  const normalized = normalizeBlankaKey(key);
  if (normalized && normalized !== key) add(normalized);

  for (const candidate of [key, normalized]) {
    if (!candidate) continue;
    const aliases = BLANKA_ALIASES[candidate];
    if (aliases) {
      for (const alias of aliases) add(alias);
    }
    for (const od of odComboCandidates(candidate)) add(od);
    for (const doll of dollCandidates(candidate)) add(doll);
    for (const air of aerialThunderCandidates(candidate)) add(air);
  }

  for (const candidate of superCandidates(key)) add(candidate);
  for (const candidate of superCandidates(normalized)) add(candidate);

  const jump = key.match(/^[789]j(.+)$/i);
  if (jump) {
    add(jump[1].toLowerCase());
  }

  return out;
}

/** テリー — OD表記(lpmpod/hppod)・TC・Burning Knuckle派生 など */

const TERRY_ALIASES: Record<string, string[]> = {
  "214lpmpod": ["214lpmp"],
  "214mphpod": ["214mphp"],
  "214hppod": ["214mphp", "214hp"],
  lpmpod: ["214lpmp"],
  "214ppod": ["214lpmp"],
  "2mkhk": ["2mk_2hk"],
  "5mphk": ["5mp_hk"],
  "5mphkhk": ["5mp_hk_hk"],
  "5mphp": ["5mp_hp"],
  "5mpkpmp": ["5mp_mk_mp"],
};

function addUnique(out: string[], key: string) {
  const v = key.toLowerCase();
  if (v && !out.includes(v)) out.push(v);
}

function normalizeTerryKey(rawKey: string): string {
  return rawKey
    .toLowerCase()
    .replace(/^ter_/, "")
    .replace(/214lpmpod/gi, "214lpmp")
    .replace(/214mphpod/gi, "214mphp")
    .replace(/214hppod/gi, "214mphp")
    .replace(/214ppod/gi, "214lpmp")
    .replace(/^lpmpod/gi, "214lpmp")
    .replace(/2mkhk/gi, "2mk_2hk")
    .replace(/5mphkhk/gi, "5mp_hk_hk")
    .replace(/5mphk/gi, "5mp_hk")
    .replace(/5mphp/gi, "5mp_hp")
    .replace(/5mpkpmp/gi, "5mp_mk_mp")
    .replace(/_+$/, "");
}

function odComboCandidates(key: string): string[] {
  const out: string[] = [];

  if (/lpmpod$/i.test(key)) {
    addUnique(out, key.replace(/lpmpod$/i, "lpmp"));
  }
  if (/mphpod$/i.test(key)) {
    addUnique(out, key.replace(/mphpod$/i, "mphp"));
  }
  if (/hppod$/i.test(key)) {
    addUnique(out, key.replace(/hppod$/i, "mphp"));
    addUnique(out, key.replace(/hppod$/i, "hp"));
  }
  if (/ppod$/i.test(key)) {
    addUnique(out, key.replace(/ppod$/i, "pp"));
  }
  if (/kkod$/i.test(key)) {
    addUnique(out, key.replace(/kkod$/i, "kk"));
  }

  return out;
}

export function expandTerryLookupKeys(rawKey: string): string[] {
  const out: string[] = [];
  const add = (k: string) => addUnique(out, k);

  const key = rawKey.toLowerCase().replace(/_+$/, "");
  if (!key) return out;

  add(key);

  const normalized = normalizeTerryKey(key);
  if (normalized !== key) add(normalized);

  for (const candidate of [key, normalized]) {
    if (!candidate) continue;
    const aliases = TERRY_ALIASES[candidate];
    if (aliases) {
      for (const alias of aliases) add(alias);
    }
    for (const od of odComboCandidates(candidate)) add(od);
  }

  return out;
}

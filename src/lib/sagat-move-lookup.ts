/** サガット — Tiger Nexus(214K)派生・236ppod・TC など */

const SAGAT_ALIASES: Record<string, string[]> = {
  "214mk_6hk": ["214k_6hk"],
  "214mk_6lk": ["214k_6lk"],
  "214mk_6mk": ["214k_6mk"],
  "236ppod": ["236lpmp", "236mphp"],
  "2mphk": ["2mp_hk"],
  "2mphp": ["2mp_hp"],
  "5hphk": ["5hp_hk"],
  "5mkhk": ["5mk_hk"],
};

function addUnique(out: string[], key: string) {
  const v = key.toLowerCase();
  if (v && !out.includes(v)) out.push(v);
}

function normalizeSagatKey(rawKey: string): string {
  return rawKey
    .toLowerCase()
    .replace(/^sag_/, "")
    .replace(/214mk_6/gi, "214k_6")
    .replace(/2mphk/gi, "2mp_hk")
    .replace(/2mphp/gi, "2mp_hp")
    .replace(/5hphk/gi, "5hp_hk")
    .replace(/5mkhk/gi, "5mk_hk")
    .replace(/_+$/, "");
}

function odComboCandidates(key: string): string[] {
  const out: string[] = [];

  if (/ppod$/i.test(key)) {
    addUnique(out, key.replace(/ppod$/i, "pp"));
    addUnique(out, "236lpmp");
    addUnique(out, "236mphp");
  }
  if (/kkod$/i.test(key)) {
    addUnique(out, key.replace(/kkod$/i, "kk"));
  }

  return out;
}

export function expandSagatLookupKeys(rawKey: string): string[] {
  const out: string[] = [];
  const add = (k: string) => addUnique(out, k);

  const key = rawKey.toLowerCase().replace(/_+$/, "");
  if (!key) return out;

  add(key);

  const normalized = normalizeSagatKey(key);
  if (normalized !== key) add(normalized);

  for (const candidate of [key, normalized]) {
    if (!candidate) continue;
    const aliases = SAGAT_ALIASES[candidate];
    if (aliases) {
      for (const alias of aliases) add(alias);
    }
    for (const od of odComboCandidates(candidate)) add(od);
  }

  return out;
}

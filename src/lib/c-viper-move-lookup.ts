/** C.ヴァイパー — Thunder Dash(214P)・Focus(214K)・Burning Kick派生・Seismic など */

const CVIPER_ALIASES: Record<string, string[]> = {
  "214hk": ["214hp"],
  "214lk": ["214lp"],
  "214mk": ["214k"],
  "214mk_66": ["214k", "214kk"],
  "214lp_lk": ["214p_k"],
  "236mk_kk": ["236k_kk"],
  "236mk_pp": ["236k_pp"],
  "623lp": ["623p"],
  "623mp": ["623p"],
  "623hp": ["623p"],
  "623lp_lk": ["623p_k"],
  sa2: ["214214k", "214214k(ca)"],
};

function addUnique(out: string[], key: string) {
  const v = key.toLowerCase();
  if (v && !out.includes(v)) out.push(v);
}

function normalizeCViperKey(rawKey: string): string {
  return rawKey
    .toLowerCase()
    .replace(/^cv_/, "")
    .replace(/214hk/gi, "214hp")
    .replace(/214lk/gi, "214lp")
    .replace(/214lp_lk/gi, "214p_k")
    .replace(/214mk/gi, "214k")
    .replace(/236mk_kk/gi, "236k_kk")
    .replace(/236mk_pp/gi, "236k_pp")
    .replace(/623lp_lk/gi, "623p_k")
    .replace(/623lp/gi, "623p")
    .replace(/623mp/gi, "623p")
    .replace(/623hp/gi, "623p")
    .replace(/_+$/, "");
}

function superCandidates(key: string): string[] {
  const out: string[] = [];
  const k = normalizeCViperKey(key);

  if (/214214.*sa2/i.test(k)) {
    addUnique(out, "214214k");
    addUnique(out, "214214k(ca)");
  }
  if (/214214.*sa1/i.test(k)) {
    addUnique(out, "214214p");
    addUnique(out, "214214p(ca)");
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

export function expandCViperLookupKeys(rawKey: string): string[] {
  const out: string[] = [];
  const add = (k: string) => addUnique(out, k);

  const key = rawKey.toLowerCase().replace(/_+$/, "");
  if (!key) return out;

  add(key);

  const normalized = normalizeCViperKey(key);
  if (normalized !== key) add(normalized);

  for (const candidate of [key, normalized]) {
    if (!candidate) continue;
    const aliases = CVIPER_ALIASES[candidate];
    if (aliases) {
      for (const alias of aliases) add(alias);
    }
    for (const od of odComboCandidates(candidate)) add(od);
  }

  for (const candidate of superCandidates(key)) add(candidate);
  for (const candidate of superCandidates(normalized)) add(candidate);

  return out;
}

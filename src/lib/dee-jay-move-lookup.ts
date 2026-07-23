/** ディージェイ — チャージ表記・214K派生・TC・接頭辞なし画像など */

const DEEJAY_ALIASES: Record<string, string[]> = {
  "214lk": ["214k"],
  "214mk": ["214k_mk"],
  "214hk": ["214k", "214hp"],
  sa1: ["236236k"],
  sa2: ["236236lp", "236236mp", "236236hp"],
  sa3: ["214214p", "214214p(ca)", "236236lp"],
};

function addUnique(out: string[], key: string) {
  const v = key.toLowerCase();
  if (v && !out.includes(v)) out.push(v);
}

function normalizeDeeJayKey(rawKey: string): string {
  return rawKey
    .toLowerCase()
    .replace(/^sj_/, "dj_")
    .replace(/^dj_/, "")
    .replace(/2c-8/gi, "28")
    .replace(/4c-6/gi, "46")
    .replace(/4c6/gi, "46")
    .replace(/4-6/gi, "46")
    .replace(/214lk/gi, "214k")
    .replace(/_6lp/gi, "_6p")
    .replace(/_4lp/gi, "_4p")
    .replace(/5lpmkmk/gi, "5lp_mk_mk")
    .replace(/5lpmk/gi, "5lp_mk")
    .replace(/5mpmp4hp/gi, "5mp_mp_4hp")
    .replace(/5mpmphp/gi, "5mp_mp_hp")
    .replace(/5mphphk/gi, "5mp_hp_hk")
    .replace(/5mphp/gi, "5mp_hp")
    .replace(/5mpmp/gi, "5mp_mp")
    .replace(/jmphp/gi, "jmp_hp")
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
  const k = normalizeDeeJayKey(key);

  if (/236236lk_sa\d/i.test(k)) {
    addUnique(out, "236236k");
    addUnique(out, "236236k(ca)");
  }
  if (/236236lp_sa\d/i.test(k)) {
    addUnique(out, "236236lp");
  }
  if (/236236mp_sa\d/i.test(k)) {
    addUnique(out, "236236mp");
  }
  if (/236236hp_sa\d/i.test(k)) {
    addUnique(out, "236236hp");
  }
  if (/236236hp_sa\d_hk/i.test(k)) {
    addUnique(out, "236236hp_lp_mp_hp_lk_mk_hk");
    addUnique(out, "236236hp");
  }
  if (/236236mp_sa\d_hp/i.test(k)) {
    addUnique(out, "236236mp_lp_mp_hp");
    addUnique(out, "236236mp");
  }
  if (/214214lp_sa\d/i.test(k)) {
    addUnique(out, "214214p");
    addUnique(out, "214214p(ca)");
  }

  return out;
}

export function expandDeeJayLookupKeys(rawKey: string): string[] {
  const out: string[] = [];
  const add = (k: string) => addUnique(out, k);

  const key = rawKey.toLowerCase().replace(/_+$/, "");
  if (!key) return out;

  add(key);

  const normalized = normalizeDeeJayKey(key);
  if (normalized !== key) add(normalized);

  for (const candidate of [key, normalized]) {
    if (!candidate) continue;
    const aliases = DEEJAY_ALIASES[candidate];
    if (aliases) {
      for (const alias of aliases) add(alias);
    }
    for (const od of odComboCandidates(candidate)) add(od);
  }

  for (const candidate of superCandidates(key)) add(candidate);
  for (const candidate of superCandidates(normalized)) add(candidate);

  return out;
}

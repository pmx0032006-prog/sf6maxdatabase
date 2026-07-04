/** ラシード — 623→236表記・run(66hold)・kyu(強化)・214派生 など */

const RASHID_ALIASES: Record<string, string[]> = {
  "623hp": ["236hp"],
  "623mp": ["236mp"],
  "623od": ["236pp"],
  "623ppod": ["236pp"],
  "236hk": ["236k"],
  "236lk": ["236k"],
  "236mk": ["236mp", "236k"],
  ras236hk: ["236k"],
  "214mp_4lk": ["214p_4k"],
  "214mp_4mk": ["214p_4k"],
  "214mp_6lk": ["214p_6k"],
  "214mp_6mk": ["214p_6k"],
  "214mp_6lklk": ["214p_6k_k"],
  "214mp_6mkmk": ["214p_6k_k"],
  "236lp_kyu": ["236lp_enhanced"],
  "236mp_kyu": ["236mp_enhanced"],
  "236hp_kyu": ["236hp_enhanced"],
  "236lk_hld": ["236k_hold"],
  run_lp: ["66_hold_6p"],
  run_lk: ["66_hold_6k"],
  run_lk_wd: ["66_hold_6k_enhanced"],
  "66-": ["66_hold"],
  "4479": ["walljump"],
  "5mphk": ["5mp_hk"],
  "6kk_4kk": ["6kk_kk", "6kk"],
  "6kk_6kk": ["6kk_kk"],
};

function addUnique(out: string[], key: string) {
  const v = key.toLowerCase();
  if (v && !out.includes(v)) out.push(v);
}

function normalizeRashidKey(rawKey: string): string {
  return rawKey
    .toLowerCase()
    .replace(/^ras-/, "ras_")
    .replace(/^ras236/, "ras_236")
    .replace(/^ras_/, "")
    .replace(/^623/g, "236")
    .replace(/_kyu/gi, "_kyu")
    .replace(/_hld/gi, "_hold")
    .replace(/214mp_4l[km]k/gi, "214p_4k")
    .replace(/214mp_6lklk/gi, "214p_6k_k")
    .replace(/214mp_6mkmk/gi, "214p_6k_k")
    .replace(/214mp_6l[km]k/gi, "214p_6k")
    .replace(/_4lk/gi, "_4k")
    .replace(/_4mk/gi, "_4k")
    .replace(/_6lk/gi, "_6k")
    .replace(/_6mk/gi, "_6k")
    .replace(/_6lklk/gi, "_6k_k")
    .replace(/_6mkmk/gi, "_6k_k")
    .replace(/run_lk_wd/gi, "run_lk_wd")
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

function enhancedCandidates(key: string): string[] {
  const out: string[] = [];

  if (/kyu/i.test(key)) {
    const base = key.replace(/_kyu.*$/i, "");
    if (base) {
      addUnique(out, `${base}_enhanced`);
    }
  }

  return out;
}

export function expandRashidLookupKeys(rawKey: string): string[] {
  const out: string[] = [];
  const add = (k: string) => addUnique(out, k);

  const key = rawKey.toLowerCase().replace(/_+$/, "");
  if (!key) return out;

  add(key);

  const normalized = normalizeRashidKey(key);
  if (normalized !== key) add(normalized);

  for (const candidate of [key, normalized]) {
    if (!candidate) continue;
    const aliases = RASHID_ALIASES[candidate];
    if (aliases) {
      for (const alias of aliases) add(alias);
    }
    for (const od of odComboCandidates(candidate)) add(od);
    for (const enh of enhancedCandidates(candidate)) add(enh);
  }

  const jump = key.match(/^[789]j(.+)$/i);
  if (jump) {
    add(jump[1].toLowerCase());
  }

  return out;
}

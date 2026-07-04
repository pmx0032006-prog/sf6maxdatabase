/** ジュリ — Fuha派生・空中214K・素材 typo など */

const JURI_ALIASES: Record<string, string[]> = {
  "4hl": ["4hk"],
  "5mphphp": ["5mp_4hp_hp"],
  "5mp_hp": ["5mp_4hp", "5mp_4hp_hp"],
  njhk: ["jhk", "8jhk"],
  "623od": ["623pp"],
  "623mk": ["623mp"],
};

function addUnique(out: string[], key: string) {
  const v = key.toLowerCase();
  if (v && !out.includes(v)) out.push(v);
}

function normalizeJuriKey(rawKey: string): string {
  return rawKey
    .toLowerCase()
    .replace(/^jur_/i, "")
    .replace(/^9l/i, "9j")
    .replace(/_+$/, "");
}

/** 214k_236hk 等 — Fuhaストック消費 236K 派生 */
function fuhaStockCancelCandidates(key: string): string[] {
  const out: string[] = [];
  const m = key.match(/^214(?:k|mk)_236(hk|lk|mk|hl)/i);
  if (!m) return out;

  const btn = m[1].toLowerCase() === "hl" ? "hk" : m[1].toLowerCase();
  addUnique(out, `236${btn}_stock`);
  addUnique(out, `236${btn}`);

  return out;
}

/** 214mk_236odlkmk / 236odmkhk — OD 236K 派生 */
function fuhaOdCancelCandidates(key: string): string[] {
  const out: string[] = [];

  if (/214mk_236odlkmk/i.test(key)) {
    addUnique(out, "236lkmk");
    addUnique(out, "236lk_stock");
  }
  if (/214mk_236odmkhk/i.test(key)) {
    addUnique(out, "236mkhk");
    addUnique(out, "236mk_stock");
  }

  return out;
}

/** 9j214od → j214kk、9j214k_lk → j214k~k など */
function airShikuSenCandidates(key: string): string[] {
  const out: string[] = [];

  if (/9j214od/i.test(key) || /^j?214od$/i.test(key)) {
    addUnique(out, "j214kk");
  }

  if (/9j214k_lk/i.test(key) || /9j214lklk/i.test(key)) {
    addUnique(out, "j214k~k");
    addUnique(out, "j214k");
  }

  const jump = key.match(/^[789]j(.+)$/i);
  if (jump) {
    addUnique(out, jump[1].toLowerCase());
  }

  return out;
}

/** 214214lp_sa2 → Feng Shui Engine (SA2) */
function sa2Candidates(key: string): string[] {
  const out: string[] = [];
  if (/214214lp_sa\d/i.test(key)) {
    addUnique(out, "214214p");
    addUnique(out, "214214p_hold");
  }
  return out;
}

export function expandJuriLookupKeys(rawKey: string): string[] {
  const out: string[] = [];
  const add = (k: string) => addUnique(out, k);

  const key = normalizeJuriKey(rawKey);
  if (!key) return out;

  add(key);

  const aliases = JURI_ALIASES[key];
  if (aliases) {
    for (const alias of aliases) add(alias);
  }

  for (const candidate of fuhaStockCancelCandidates(key)) add(candidate);
  for (const candidate of fuhaOdCancelCandidates(key)) add(candidate);
  for (const candidate of airShikuSenCandidates(key)) add(candidate);
  for (const candidate of sa2Candidates(key)) add(candidate);

  if (key.includes("236hl")) {
    add(key.replace(/236hl/g, "236hk"));
  }
  if (key.includes("236od")) {
    add(key.replace(/236odlkmk/g, "236lkmk"));
    add(key.replace(/236odmkhk/g, "236mkhk"));
  }

  return out;
}

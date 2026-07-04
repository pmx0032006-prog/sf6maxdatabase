/** ザンギエフ — 624/投げ(nage)/ダブルラリアット・空中360 など */

const ZANGIEF_ALIASES: Record<string, string[]> = {
  "1nage": ["1lplk"],
  "2nage": ["2lplk"],
  "3nage": ["3lplk"],
  nnagehld: ["360pp"],
  "1sukur": ["360lp", "360mp", "360hp"],
  lpsc: ["360lp"],
  mpsc: ["360mp"],
  hpsc: ["360hp"],
  daburari: ["pp"],
  oddaburari: ["ppp"],
  scppod: ["ppp"],
  borushiri: ["j360k", "j360kk"],
  buruhichi: ["j360k"],
  kin624: ["63214k_close"],
  kin624lk: ["63214k_close"],
  kin624od: ["63214kk_close"],
  "624": ["63214k_close", "63214k_mid", "63214k_far"],
  "624od": ["63214kk_close", "63214kk_mid", "63214kk_far"],
  in63214hk: ["63214k_close"],
  in63214lk: ["63214k_close"],
  in63214mk: ["63214k_mid"],
  in66214mk: ["63214k_mid"],
  out63214hk: ["63214k_far"],
  out63214lk: ["63214k_far"],
  out63214mk: ["63214k_mid"],
  out63214kkod: ["63214kk_far", "63214kk_mid", "63214kk_close"],
  "8jblhk": ["j360k"],
  "8jbllk": ["j360k"],
  "8jblmk": ["j360k"],
  "8jblkkod": ["j360kk"],
  "5ppod": ["ppp"],
  "5mpmpmp": ["5mp_mp_mp"],
  "22mkmkmk": ["22mk_mk_mk"],
  "5hp_hld": ["5hp_hold"],
  "6mp": ["6mk"],
  sa1: ["236236k"],
  sa2: ["236236p", "236236p_hold_p"],
  sa3: ["720p", "720p(ca)"],
};

function addUnique(out: string[], key: string) {
  const v = key.toLowerCase();
  if (v && !out.includes(v)) out.push(v);
}

function normalizeZangiefKey(rawKey: string): string {
  return rawKey
    .toLowerCase()
    .replace(/^zan-/, "zan_")
    .replace(/236236lp-hld-sa2/i, "236236p_hold_p_sa2")
    .replace(/236236k-sa1/i, "236236k_sa1")
    .replace(/236236lp-sa1/i, "236236lp_sa1")
    .replace(/236236lp-sa2/i, "236236lp_sa2")
    .replace(/236236lp-sa3/i, "236236lp_sa3")
    .replace(/-/g, "")
    .replace(/^zan_/, "")
    .replace(/_+$/, "");
}

function odComboCandidates(key: string): string[] {
  const out: string[] = [];

  if (/ppod$/i.test(key)) {
    addUnique(out, key.replace(/ppod$/i, "pp"));
    addUnique(out, "ppp");
  }
  if (/kkod$/i.test(key)) {
    addUnique(out, key.replace(/kkod$/i, "kk"));
  }

  return out;
}

function superCandidates(key: string): string[] {
  const out: string[] = [];
  const k = normalizeZangiefKey(key);

  if (/236236k_sa\d/i.test(k) || /236236lk_sa\d/i.test(k)) {
    addUnique(out, "236236k");
  }
  if (/236236lp_sa\d/i.test(k) || /236236p_hold_p_sa\d/i.test(k)) {
    addUnique(out, "236236p");
    addUnique(out, "236236p_hold_p");
  }
  if (/^sa3(?:_\d+)?$/i.test(k)) {
    addUnique(out, "720p");
    addUnique(out, "720p(ca)");
  }

  return out;
}

export function expandZangiefLookupKeys(rawKey: string): string[] {
  const out: string[] = [];
  const add = (k: string) => addUnique(out, k);

  const key = rawKey.toLowerCase().replace(/_+$/, "");
  if (!key) return out;

  add(key);

  const normalized = normalizeZangiefKey(key);
  if (normalized !== key) add(normalized);

  for (const candidate of [key, normalized]) {
    if (!candidate) continue;
    const aliases = ZANGIEF_ALIASES[candidate];
    if (aliases) {
      for (const alias of aliases) add(alias);
    }
    for (const od of odComboCandidates(candidate)) add(od);
  }

  for (const candidate of superCandidates(key)) add(candidate);
  for (const candidate of superCandidates(normalized)) add(candidate);

  return out;
}

/** ケン — Quick Dash(KK)派生・TC・空中HK など */

const KEN_ALIASES: Record<string, string[]> = {
  "5mkmk": ["5mk_mk"],
  "5mkmkhk": ["5mk_mk_hk"],
  "5mphp": ["5mp_hp"],
  kkds: ["kk"],
  kkdsstp: ["kk_lk"],
  "kkds_6lk": ["kk_lk", "236kk_6lk", "236k_6lk"],
  "kkds_sk": ["kk_hk"],
  "66ds_sk": ["mpmk_66_drc", "mpmk_66_pdr"],
  njhk: ["8jhk", "jhk"],
};

function addUnique(out: string[], key: string) {
  const v = key.toLowerCase();
  if (v && !out.includes(v)) out.push(v);
}

function normalizeKenKey(rawKey: string): string {
  return rawKey
    .toLowerCase()
    .replace(/^ken_/, "")
    .replace(/5mkmkhk/gi, "5mk_mk_hk")
    .replace(/5mkmk/gi, "5mk_mk")
    .replace(/5mphp/gi, "5mp_hp")
    .replace(/kkdsstp/gi, "kk_lk")
    .replace(/kkds_6lk/gi, "kk_lk")
    .replace(/kkds_sk/gi, "kk_hk")
    .replace(/kkds/gi, "kk")
    .replace(/66ds_sk/gi, "mpmk_66_drc")
    .replace(/njhk/gi, "8jhk")
    .replace(/_+$/, "");
}

function quickDashCandidates(key: string): string[] {
  const out: string[] = [];
  const k = normalizeKenKey(key);

  if (/^kkds/i.test(k) || /^kk$/i.test(k)) {
    addUnique(out, "kk");
  }
  if (/kkdsstp|kk_lk$/i.test(k) || /kkds_6lk/i.test(key)) {
    addUnique(out, "kk_lk");
  }
  if (/kkds_sk/i.test(key)) {
    addUnique(out, "kk_hk");
  }
  if (/kkds_mk/i.test(key)) {
    addUnique(out, "kk_mk");
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

export function expandKenLookupKeys(rawKey: string): string[] {
  const out: string[] = [];
  const add = (k: string) => addUnique(out, k);

  const key = rawKey.toLowerCase().replace(/_+$/, "");
  if (!key) return out;

  add(key);

  const normalized = normalizeKenKey(key);
  if (normalized !== key) add(normalized);

  for (const candidate of [key, normalized]) {
    if (!candidate) continue;
    const aliases = KEN_ALIASES[candidate];
    if (aliases) {
      for (const alias of aliases) add(alias);
    }
    for (const od of odComboCandidates(candidate)) add(od);
  }

  for (const candidate of quickDashCandidates(key)) add(candidate);
  for (const candidate of quickDashCandidates(normalized)) add(candidate);

  return out;
}

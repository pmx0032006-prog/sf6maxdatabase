/** 舞 — _hom(炎/flame)・チャージ(hld/ch)・Musasabi・TC など */

const MAI_ALIASES: Record<string, string[]> = {
  "4hkhk": ["4hk_hk"],
  "5lklk": ["5lk_lk"],
  "5lklklk": ["5lk_lk_lk"],
  jnage: ["jlplk"],
  "236ppod6lplp": ["236pp_hold_6p"],
  "236236ppodlplp": ["236pp_hold_6p"],
  ppod_hom: ["236pp_flame", "214pp_flame"],
  "623_3_hom": ["623mk_flame", "623hk_flame"],
  sa1: ["236236p"],
  sa2: ["236236k", "j236236k"],
  sa3: ["214214p", "214214p(ca)"],
};

function addUnique(out: string[], key: string) {
  const v = key.toLowerCase();
  if (v && !out.includes(v)) out.push(v);
}

function normalizeMaiKey(rawKey: string): string {
  return rawKey
    .toLowerCase()
    .replace(/^mai_/, "")
    .replace(/9l/g, "9j")
    .replace(/^8j/, "j")
    .replace(/^9j/, "j")
    .replace(/_hom/gi, "_flame")
    .replace(/236ppod6lplp/gi, "236pp_hold_6p")
    .replace(/236236ppodlplp(?:_flame)?(?:_hold)?/gi, "236pp_hold_6p_flame")
    .replace(/ppod_flame/gi, "236pp_flame")
    .replace(/^ppod/gi, "236pp")
    .replace(/4hkhk/gi, "4hk_hk")
    .replace(/5lklklk/gi, "5lk_lk_lk")
    .replace(/5lklk/gi, "5lk_lk")
    .replace(/jnage/gi, "jlplk")
    .replace(/j214hp/gi, "j214p")
    .replace(/j214lp/gi, "j214p")
    .replace(/j214mp/gi, "j214p")
    .replace(/_hld/gi, "_hold")
    .replace(/236lp_flame_ch/gi, "236p_flame_hold")
    .replace(/236lp_ch/gi, "236p_hold")
    .replace(/236lp_hold/gi, "236p_hold")
    .replace(/236236mk/gi, "236236k")
    .replace(/623_3_flame/gi, "623mk_flame")
    .replace(/_\d+$/, "")
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

function flameCandidates(key: string): string[] {
  const out: string[] = [];
  const k = normalizeMaiKey(key);

  if (/_flame/i.test(k)) {
    const base = k.replace(/_flame.*$/i, "").replace(/_\d+$/, "");
    if (base) {
      addUnique(out, `${base}_flame`);
      addUnique(out, base);
    }
  }

  return out;
}

function superCandidates(key: string): string[] {
  const out: string[] = [];
  const k = normalizeMaiKey(key);

  if (/236236mk_sa\d/i.test(k) || /j236236mk_sa\d/i.test(k)) {
    addUnique(out, "236236k");
    addUnique(out, "236236k_flame");
    addUnique(out, "j236236k");
    addUnique(out, "j236236k_flame");
  }
  if (/236236lk_sa\d/i.test(k) || /j236236lk_sa\d/i.test(k)) {
    addUnique(out, "236236k");
    addUnique(out, "236236k_flame");
    addUnique(out, "j236236k");
    addUnique(out, "j236236k_flame");
  }
  if (/236236lp_sa\d/i.test(k)) {
    addUnique(out, "236236p");
    addUnique(out, "236236p_flame");
  }
  if (/214214lp_sa\d/i.test(k)) {
    addUnique(out, "214214p");
    addUnique(out, "214214p(ca)");
  }

  return out;
}

export function expandMaiLookupKeys(rawKey: string): string[] {
  const out: string[] = [];
  const add = (k: string) => addUnique(out, k);

  const key = rawKey.toLowerCase().replace(/_+$/, "");
  if (!key) return out;

  add(key);

  const normalized = normalizeMaiKey(key);
  if (normalized !== key) add(normalized);

  for (const candidate of [key, normalized]) {
    if (!candidate) continue;
    const aliases = MAI_ALIASES[candidate];
    if (aliases) {
      for (const alias of aliases) add(alias);
    }
    for (const od of odComboCandidates(candidate)) add(od);
    for (const flame of flameCandidates(candidate)) add(flame);
  }

  for (const candidate of superCandidates(key)) add(candidate);
  for (const candidate of superCandidates(normalized)) add(candidate);

  const jump = key.match(/^[89]j(.+)$/i);
  if (jump) {
    add(jump[1].toLowerCase());
    const inner = normalizeMaiKey(jump[1]);
    if (inner !== jump[1].toLowerCase()) add(inner);
  }

  return out;
}

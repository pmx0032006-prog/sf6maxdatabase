/** ジェイミー — drink-level 補完・SA3/OD/空中 など */

const JAMIE_ALIASES: Record<string, string[]> = {
  "214lp6lp_dr4": ["214p_6p", "214pp_6p"],
  "236lpmkmkl": ["236lp_6k_dl2"],
  "236ppod_1_6k": ["236pp_6k_dl2"],
  "236ppod_1_6k_6k": ["236pp_6k_6k_dl2"],
  "max_236p": ["236lp_dl4", "236mp_dl4", "236hp_dl4", "236pp_dl4"],
  "up_236p": ["236lp_dl2", "236mp_dl2", "236hp_dl2", "236pp_dl2"],
  "up4_214p_6p": ["214p_6p"],
  "up4_214ppod_6p": ["214pp_6p", "214p_6p"],
  "up1_9j214kkod": ["j214kk_dl2"],
  "up2_236hk2": ["236hk_dl2"],
  "up2_236kkod": ["236kk_dl2"],
};

function addUnique(out: string[], key: string) {
  const v = key.toLowerCase();
  if (v && !out.includes(v)) out.push(v);
}

function normalizeJamieKey(rawKey: string): string {
  return rawKey
    .toLowerCase()
    .replace(/^je_/, "")
    .replace(/214lp6lp_dr4/gi, "214p_6p")
    .replace(/236lpmkmkl/gi, "236lp_6k_dl2")
    .replace(/236ppod_1_6k_6k/gi, "236pp_6k_6k_dl2")
    .replace(/236ppod_1_6k/gi, "236pp_6k_dl2")
    .replace(/max_236p/gi, "236lp_dl4")
    .replace(/up_236p/gi, "236lp_dl2")
    .replace(/up4_214ppod_6p/gi, "214pp_6p")
    .replace(/up4_214p_6p/gi, "214p_6p")
    .replace(/up1_9j214kkod/gi, "j214kk_dl2")
    .replace(/up2_236hk2/gi, "236hk_dl2")
    .replace(/up2_236kkod/gi, "236kk_dl2")
    .replace(/236236lp_sa3/gi, "236236k_dl2")
    .replace(/ppod/gi, "pp")
    .replace(/_+$/, "");
}

function superCandidates(key: string): string[] {
  const out: string[] = [];
  const k = normalizeJamieKey(key);

  if (/236236.*sa3/i.test(k)) {
    addUnique(out, "236236k_dl2");
    addUnique(out, "236236p_dl2");
  }

  return out;
}

export function expandJamieLookupKeys(rawKey: string): string[] {
  const out: string[] = [];
  const add = (k: string) => addUnique(out, k);

  const key = rawKey.toLowerCase().replace(/_+$/, "");
  if (!key) return out;

  add(key);

  const normalized = normalizeJamieKey(key);
  if (normalized !== key) add(normalized);

  for (const candidate of [key, normalized]) {
    if (!candidate) continue;
    const aliases = JAMIE_ALIASES[candidate];
    if (aliases) {
      for (const alias of aliases) add(alias);
    }
  }

  for (const candidate of superCandidates(key)) add(candidate);
  for (const candidate of superCandidates(normalized)) add(candidate);

  return out;
}

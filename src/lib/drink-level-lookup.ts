/** ジェイミー — 画像 up2_236hk → Wiki 236hk_dl2 など */

import { expandAirSpecialLookupKeys } from "@/lib/air-special-lookup";

const DRINK_PREFIX_DL: Record<string, string> = {
  up1: "dl2",
  up2: "dl2",
  up3: "dl3",
  up4: "dl4",
  max: "dl4",
  up: "dl2",
};

const SIMPLE_NORMAL = /^[245](lp|mp|hp|lk|mk|hk)$/i;
const TC_SKIP = /lplk|lpmp|mkmk|hphk|hk4hk|lplp|lpmk|214lp6lp/i;

function stripDrinkPrefix(key: string): { motion: string; dl: string | null } {
  for (const [prefix, dl] of Object.entries(DRINK_PREFIX_DL)) {
    const m = key.match(new RegExp(`^${prefix}_(.+)$`, "i"));
    if (m) {
      return { motion: m[1], dl };
    }
  }
  return { motion: key, dl: null };
}

function normalizeMotion(motion: string): string {
  return motion
    .replace(/_dr3-$/i, "")
    .replace(/dr3-$/i, "")
    .replace(/_2drink$/i, "")
    .replace(/_3_2hrd$/i, "")
    .replace(/214lp6lp.*/i, "");
}

function withDrinkSuffix(motion: string, dl: string): string {
  if (/_dl[234]$/.test(motion)) return motion;
  return `${motion}_${dl}`;
}

function addUnique(out: string[], key: string) {
  const v = key.toLowerCase();
  if (v && !out.includes(v)) out.push(v);
}

/** 63214LK → 63214k_dl3（天蚕脚） */
function tenshinCandidates(motion: string, dl: string): string[] {
  if (!motion.startsWith("63214")) return [];
  if (/63214kk/i.test(motion)) return [`63214kk_${dl}`];
  return [`63214k_${dl}`];
}

/** 236p_6p / 236p_6p_6p → 236lp_6p_dl2 などフリーフロー */
function freeflowCandidates(motion: string, dl: string): string[] {
  const m = motion.match(/^236p_(6(?:p|k)(?:_6(?:p|k))?)$/i);
  if (!m) return [];
  const follow = m[1].toLowerCase();
  return ["236lp", "236mp", "236hp", "236pp"].map(
    (base) => `${base}_${follow}_${dl}`,
  );
}

/** 6hk4hk_lp → 6hk_4hk_p_close_dl4 */
function ransuiCandidates(motion: string): string[] {
  if (!/^6hk4hk/i.test(motion)) return [];
  if (/lplp/i.test(motion)) {
    return ["6hk_4hk_p_close_dl4", "6hk_4hk_dl4"];
  }
  if (/_?lp$/i.test(motion)) {
    return ["6hk_4hk_p_close_dl4", "6hk_4hk_p_mid_dl4", "6hk_4hk_dl4"];
  }
  if (/hp$/i.test(motion)) {
    return ["6hk_4hk_p_far_dl4", "6hk_4hk_dl4"];
  }
  return ["6hk_4hk_dl4", "6hk_4hk_p_close_dl4"];
}

function saDrinkCandidates(motion: string): string[] {
  if (/236236lk_sa1/i.test(motion)) {
    return ["236236k_drink_dl2", "236236k_dl2"];
  }
  return [];
}

function drinkMotionCandidates(motion: string): string[] {
  if (motion === "22lp_max") return ["22p_4"];
  if (motion === "22lp") return ["22p", "22p_2", "22p_3"];
  if (/^236p$/i.test(motion)) {
    return ["236lp_dl2", "236mp_dl2", "236hp_dl2", "236pp_dl2"];
  }
  if (/^236lplp$/i.test(motion)) {
    return ["236lp_dl2", "236lp_6p_dl2"];
  }
  if (/^236lplplp$/i.test(motion)) {
    return ["236lp_6p_dl2", "236lp_6p_6p_dl2"];
  }
  if (/^236lpmk$/i.test(motion)) {
    return ["236lp_6k_dl2"];
  }
  if (/^236pp(?:od)?mk$/i.test(motion)) {
    return ["236pp_dl2", "236pp_6k_dl2"];
  }
  if (/^236ppmk$/i.test(motion)) {
    return ["236pp_dl2", "236pp_6k_dl2", "236pp_6mk_dl2"];
  }
  if (/^236ppmkmk$/i.test(motion)) {
    return ["236pp_6k_6k_dl2"];
  }
  return [];
}

function targetComboCandidates(motion: string): string[] {
  const map: Record<string, string[]> = {
    "5lplk": ["5lp_lk_dl2"],
    "5lplkmp": ["5lp_lk_mp_dl2"],
    "2hkhk": ["2hk_hk_dl2"],
    "2hkhkhp": ["2hk_hk_p_dl2"],
    "6mkmk": ["6mk_mk_dl2"],
    "6mkmkhp": ["6mk_mk_p_dl2"],
    "6hk4hk": ["6hk_4hk_dl4"],
    "6hk4hkhp": ["6hk_4hk_p_far_dl4", "6hk_4hk_dl4"],
    "6hk4hklp": ["6hk_4hk_p_close_dl4", "6hk_4hk_dl4"],
  };
  return map[motion.toLowerCase()] ?? [];
}

function airDrinkCandidates(motion: string, dl: string): string[] {
  return expandAirSpecialLookupKeys(motion).map((key) =>
    withDrinkSuffix(key, dl),
  );
}

function defaultDrinkFallback(motion: string): string[] {
  if (/_dl[234]$/.test(motion) || TC_SKIP.test(motion)) return [];
  if (SIMPLE_NORMAL.test(motion)) {
    return [`${motion}_dl2`];
  }
  return [`${motion}_dl2`, `${motion}_dl3`, `${motion}_dl4`];
}

function collectPriorityKeys(rawKey: string): string[] {
  const out: string[] = [];
  const key = normalizeMotion(rawKey.toLowerCase());
  if (!key) return out;

  for (const candidate of drinkMotionCandidates(key)) addUnique(out, candidate);
  for (const candidate of saDrinkCandidates(rawKey.toLowerCase())) {
    addUnique(out, candidate);
  }
  for (const candidate of targetComboCandidates(key)) addUnique(out, candidate);

  if (key.endsWith("dr3") || key.includes("dr3")) {
    addUnique(out, key.replace(/_?dr3-?/g, "_dl3").replace(/__+/g, "_"));
  }

  const { motion, dl } = stripDrinkPrefix(key);
  const core = normalizeMotion(motion);
  if (!core || !dl) return out;

  addUnique(out, withDrinkSuffix(core, dl));
  for (const c of tenshinCandidates(core, dl)) addUnique(out, c);
  for (const c of freeflowCandidates(core, dl)) addUnique(out, c);
  for (const c of ransuiCandidates(core)) addUnique(out, c);
  for (const c of airDrinkCandidates(core, dl)) addUnique(out, c);

  return out;
}

function collectFallbackKeys(rawKey: string): string[] {
  const out: string[] = [];
  const key = normalizeMotion(rawKey.toLowerCase());
  if (!key) return out;

  for (const candidate of drinkMotionCandidates(key)) addUnique(out, candidate);
  for (const candidate of targetComboCandidates(key)) addUnique(out, candidate);

  const { motion, dl } = stripDrinkPrefix(key);
  const core = normalizeMotion(motion);
  if (!core || dl) return out;

  for (const c of defaultDrinkFallback(core)) addUnique(out, c);
  for (const c of tenshinCandidates(core, "dl3")) addUnique(out, c);
  for (const c of freeflowCandidates(core, "dl2")) addUnique(out, c);
  for (const c of ransuiCandidates(core)) addUnique(out, c);
  for (const c of airDrinkCandidates(core, "dl2")) addUnique(out, c);

  return out;
}

/** up2_ / max_ など飲み接頭辞付き — 先に試す */
export function expandDrinkPriorityKeys(rawKey: string): string[] {
  return collectPriorityKeys(rawKey);
}

/** 214lp → 214lp_dl2 など — ベースキーの後に試す */
export function expandDrinkFallbackKeys(rawKey: string): string[] {
  return collectFallbackKeys(rawKey);
}

/** @deprecated 互換用 */
export function expandDrinkLookupKeys(rawKey: string): string[] {
  return [...collectPriorityKeys(rawKey), ...collectFallbackKeys(rawKey)];
}

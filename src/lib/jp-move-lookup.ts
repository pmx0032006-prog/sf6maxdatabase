/** JP — 214p/22p 略称・Departure派生・atemi(Amnesia) など */

const JP_ALIASES: Record<string, string[]> = {
  atemi: ["22k", "22k_bomb"],
  atemi_od: ["22kk", "22kk_bomb"],
  "4mpmp": ["4mp_mp"],
  "5hkhp": ["5hk_hp"],
  hkhphk: ["5hk_hp_hk"],
  hkhphp: ["5hk_hp_hp"],
  "236ppod": ["236pp"],
};

const DEPARTURE_BUTTON = /^214(?:lp|mp|hp)$/i;
const EMBRACE_BUTTON = /^214(?:lk|mk|hk)$/i;
const TRIGLAV_BUTTON = /^22(?:lp|mp|hp)$/i;
const AMNESIA_BUTTON = /^22(?:lk|mk|hk)$/i;

function addUnique(out: string[], key: string) {
  const v = key.toLowerCase();
  if (v && !out.includes(v)) out.push(v);
}

function normalizeJpKey(rawKey: string): string {
  return rawKey
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/kk-od/gi, "kkod")
    .replace(/pp-od/gi, "ppod")
    .replace(/-od/g, "od")
    .replace(/_+$/, "");
}

/** 214lp/mp/hp → 214p、214lk/mk/hk → 214k … */
function collapseButtonStrength(key: string): string[] {
  const out: string[] = [];

  if (DEPARTURE_BUTTON.test(key)) addUnique(out, "214p");
  if (EMBRACE_BUTTON.test(key)) addUnique(out, "214k");
  if (TRIGLAV_BUTTON.test(key)) addUnique(out, "22p");
  if (AMNESIA_BUTTON.test(key)) addUnique(out, "22k");

  return out;
}

/** 214lpmpod / 214mphpod / 214od → 214pp、22lpmpod → 22pp … */
function odComboCandidates(key: string): string[] {
  const out: string[] = [];

  const lpmp = key.match(/^(214|22|236)lpmpod/i);
  if (lpmp) addUnique(out, `${lpmp[1]}pp`);

  const mphp = key.match(/^(214|22|236)mphpod/i);
  if (mphp) addUnique(out, `${mphp[1]}pp`);

  const bareOd = key.match(/^(214)od$/i);
  if (bareOd) addUnique(out, "214pp");

  return out;
}

/** 214lp_214hp → 214p_214hp、214od_214hp → 214pp_214hp … */
function departureFollowupCandidates(key: string): string[] {
  const out: string[] = [];

  const shadow = key.match(/^214(?:lp|mp|hp|od|lpmpod|mphpod)_214hp/i);
  if (shadow) {
    const isOd = /(?:od|lpmpod|mphpod)/i.test(shadow[0]);
    addUnique(out, isOd ? "214pp_214hp" : "214p_214hp");
  }

  const window = key.match(
    /^214(?:lp|mp|hp|od|lpmpod|mphpod)_214(?:lp|mp)_jlk/i,
  );
  if (window) {
    addUnique(out, "214p_214lp_mp");
  }

  return out;
}

export function expandJpLookupKeys(rawKey: string): string[] {
  const out: string[] = [];
  const add = (k: string) => addUnique(out, k);

  const key = normalizeJpKey(rawKey);
  if (!key) return out;

  add(key);

  const aliases = JP_ALIASES[key];
  if (aliases) {
    for (const alias of aliases) add(alias);
  }

  for (const candidate of collapseButtonStrength(key)) add(candidate);
  for (const candidate of odComboCandidates(key)) add(candidate);
  for (const candidate of departureFollowupCandidates(key)) add(candidate);

  if (key.endsWith("kkod")) add(key.replace(/kkod$/, "kk"));
  if (key.endsWith("ppod")) add(key.replace(/ppod$/, "pp"));

  if (key.includes("lpmpod")) {
    const motion = key.match(/^(214|22|236)/)?.[1];
    if (motion) add(`${motion}pp`);
  }
  if (key.includes("mphpod")) {
    const motion = key.match(/^(214|22|236)/)?.[1];
    if (motion) add(`${motion}pp`);
  }

  return out;
}

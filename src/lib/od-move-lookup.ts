/** 画像 slug（623ppod, 236kkod …）→ Wiki OD キー候補 */

/** 9j214kkod → j214kk など方向付きジャンプ接頭辞 */
function expandJumpDirectionKeys(key: string): string[] {
  const m = key.match(/^[789](j.+)$/i);
  return m ? [m[1].toLowerCase()] : [];
}

/** 画像名と Wiki キーの派生技差分（236kk_6lk_6lk → 236kk_6lk_6k） */
function expandFollowupKeys(key: string): string[] {
  const out: string[] = [];
  if (/_6lk_6lk$/.test(key)) {
    out.push(key.replace(/_6lk_6lk$/, "_6lk_6k"));
  }

  if (key.endsWith("ppodpp")) {
    out.push(key.replace(/ppodpp$/, "pp_pp"));
  }
  if (key.includes("ppod_")) {
    out.push(key.replace(/ppod_/g, "pp_"));
  }

  const avenger = key.match(/^236(?:kk|mk)_(lp|lk)$/i);
  if (avenger) {
    const follow = avenger[1].toLowerCase() === "lp" ? "p" : "k";
    const prefix = /^236kk/i.test(key) ? "236kk" : "236k";
    out.push(`${prefix}_${follow}`);
  }

  return out;
}

function odBaseKeys(key: string): string[] {
  const out: string[] = [];

  if (key.endsWith("ppod")) {
    out.push(key.replace(/ppod$/, "pp"));
  }
  if (key.endsWith("kkod")) {
    out.push(key.replace(/kkod$/, "kk"));
  }
  if (/ppod/.test(key) && !key.endsWith("ppod")) {
    out.push(key.replace(/ppod/g, "pp"));
  }
  if (/kkod/.test(key) && !key.endsWith("kkod")) {
    out.push(key.replace(/kkod/g, "kk"));
  }

  return out;
}

function collectOdCandidates(key: string): string[] {
  const out: string[] = [key];

  for (const jumpKey of expandJumpDirectionKeys(key)) {
    out.push(jumpKey);
  }

  const charged = key.match(/^(.+)_(ch|charged)$/);
  const motionKey = charged ? charged[1] : key;

  for (const variant of [motionKey, ...expandJumpDirectionKeys(motionKey)]) {
    for (const base of odBaseKeys(variant)) {
      out.push(base);
      out.push(...expandFollowupKeys(base));
      if (charged) {
        out.push(`${base}(charged)`);
        if (base.endsWith("pp")) {
          out.push(`${base.slice(0, -1)}(charged)`);
        }
      }
    }
    out.push(...expandFollowupKeys(variant));
  }

  return out;
}

export function expandOdLookupKeys(rawKey: string): string[] {
  const out: string[] = [];
  const add = (k: string) => {
    const v = k.toLowerCase();
    if (v && !out.includes(v)) out.push(v);
  };

  for (const candidate of collectOdCandidates(rawKey.toLowerCase())) {
    add(candidate);
  }

  return out;
}

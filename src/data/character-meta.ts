export const META_UPDATED = "2026-07" as const;
export const META_DISCLAIMER =
  "Community snapshot — not official Capcom data. Tiers and matchups may be outdated." as const;

export type Tier = "S" | "A" | "B" | "C";
export type MatchupRating = "++" | "+" | "=" | "-" | "--";

export const TIER_ORDER = ["S", "A", "B", "C"] as const satisfies readonly Tier[];

export const TIERS = {
  S: ["luke", "juri", "akuma", "cammy", "mai"],
  A: ["ryu", "ken", "guile", "rashid", "chun-li", "dee-jay", "c-viper"],
  B: ["jamie", "kimberly", "manon", "marisa", "jp", "blanka", "dhalsim", "ed", "terry", "sagat", "elena"],
  C: ["lily", "e-honda", "zangief", "aki", "alex", "m-bison", "ingrid"],
} as const satisfies Record<Tier, readonly string[]>;

export const MATCHUP_CORE = ["luke", "juri", "akuma", "cammy", "ryu", "ken", "guile", "rashid", "chun-li", "jamie"] as const;

export const MATCHUP_LABELS: Record<MatchupRating, string> = {
  "++": "Strong advantage",
  "+": "Slight advantage",
  "=": "Even",
  "-": "Slight disadvantage",
  "--": "Tough matchup",
};

export const MATCHUPS: Record<string, Record<string, MatchupRating>> = {
  "ryu": { "ken": "+", "luke": "-", "juri": "-", "cammy": "=", "guile": "+", "chun-li": "=", "rashid": "-", "akuma": "--", "jamie": "+" },
  "ken": { "ryu": "-", "luke": "-", "juri": "=", "cammy": "=", "guile": "+", "chun-li": "+", "rashid": "-", "akuma": "--", "jamie": "+" },
  "luke": { "ryu": "+", "ken": "+", "juri": "=", "cammy": "+", "guile": "+", "chun-li": "+", "rashid": "+", "akuma": "-", "jamie": "+" },
  "juri": { "ryu": "+", "ken": "=", "luke": "=", "cammy": "-", "guile": "+", "chun-li": "+", "rashid": "=", "akuma": "-", "jamie": "+" },
  "cammy": { "ryu": "=", "ken": "=", "luke": "-", "juri": "+", "guile": "-", "chun-li": "=", "rashid": "=", "akuma": "-", "jamie": "+" },
  "guile": { "ryu": "-", "ken": "-", "luke": "-", "juri": "-", "cammy": "+", "chun-li": "-", "rashid": "=", "akuma": "--", "jamie": "=" },
  "chun-li": { "ryu": "=", "ken": "-", "luke": "-", "juri": "-", "cammy": "=", "guile": "+", "rashid": "-", "akuma": "--", "jamie": "+" },
  "rashid": { "ryu": "+", "ken": "+", "luke": "-", "juri": "=", "cammy": "=", "guile": "=", "chun-li": "+", "akuma": "-", "jamie": "+" },
  "akuma": { "ryu": "++", "ken": "++", "luke": "+", "juri": "+", "cammy": "+", "guile": "++", "chun-li": "++", "rashid": "+", "jamie": "++" },
  "jamie": { "ryu": "-", "ken": "-", "luke": "-", "juri": "-", "cammy": "-", "guile": "=", "chun-li": "-", "rashid": "-", "akuma": "--" },
};

export type HitboxLegendItem = {
  swatchClass: string;
  label: string;
  description: string;
};

/** SuperCombo-style SF6 hitbox colors (compact reference). */
export const HITBOX_LEGEND: HitboxLegendItem[] = [
  { swatchClass: "bg-red-500", label: "Red", description: "Attack hitbox" },
  { swatchClass: "bg-pink-400", label: "Pink", description: "Throw hitbox" },
  {
    swatchClass: "bg-emerald-500",
    label: "Green",
    description: "Hurtbox (strikes / projectiles)",
  },
  { swatchClass: "bg-sky-500", label: "Blue", description: "Throw hurtbox" },
  {
    swatchClass: "bg-teal-400",
    label: "Teal",
    description: "Unique / interaction box",
  },
  {
    swatchClass: "bg-purple-500",
    label: "Purple",
    description: "Armor / counter hitbox",
  },
  {
    swatchClass: "bg-orange-400",
    label: "Orange",
    description: "Projectile clash box",
  },
];

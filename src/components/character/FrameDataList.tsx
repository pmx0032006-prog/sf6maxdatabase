import type { MoveFrameData } from "@/data/characters/cammy";
import { HitboxColorLegend } from "@/components/character/HitboxColorLegend";
import { MoveDataGrid } from "@/components/character/MoveDataGrid";
import { isCharacterFullyReady } from "@/lib/character-roster";

type FrameDataListProps = {
  characterSlug: string;
  moves: MoveFrameData[];
};

export function FrameDataList({ characterSlug, moves }: FrameDataListProps) {
  if (moves.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-surface px-6 py-12 text-center text-sm leading-relaxed text-muted">
        No hitbox images found.
        <br />
        To sync desktop assets, run{" "}
        <code className="text-foreground/80">npm run sync:images</code>.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <HitboxColorLegend />
      {!isCharacterFullyReady(characterSlug) ? (
        <p className="rounded-lg border border-accent/25 bg-accent/5 px-4 py-3 text-center text-xs leading-relaxed text-muted sm:text-sm">
          Hitbox images are live. Frame data (startup, block advantage, etc.) is coming soon.
        </p>
      ) : null}
      <MoveDataGrid characterSlug={characterSlug} moves={moves} />
    </div>
  );
}

import type { MoveFrameData } from "@/data/characters/cammy";
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
        判定画像が見つかりません。
        <br />
        デスクトップ素材を同期するには{" "}
        <code className="text-foreground/80">npm run sync:images</code>{" "}
        を実行してください。
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {!isCharacterFullyReady(characterSlug) ? (
        <p className="rounded-lg border border-accent/25 bg-accent/5 px-4 py-3 text-center text-xs leading-relaxed text-muted sm:text-sm">
          判定画像は公開済みです。フレーム数値（発生・ガード等）は現在制作中です。
        </p>
      ) : null}
      <MoveDataGrid characterSlug={characterSlug} moves={moves} />
    </div>
  );
}

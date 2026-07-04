import Image from "next/image";
import type { MoveFrameData } from "@/data/characters/cammy";
import { characterMoveImagePath } from "@/lib/character-image-path";

type MoveDataCardProps = {
  characterSlug: string;
  move: MoveFrameData;
  priority?: boolean;
};

const frameRows: {
  key: keyof Pick<
    MoveFrameData,
    "startup" | "active" | "total" | "onBlock" | "onHit"
  >;
  labelJa: string;
}[] = [
  { key: "startup", labelJa: "発生" },
  { key: "active", labelJa: "持続" },
  { key: "total", labelJa: "全体" },
  { key: "onBlock", labelJa: "ガード" },
  { key: "onHit", labelJa: "ヒット" },
];

export function MoveDataCard({
  characterSlug,
  move,
  priority = false,
}: MoveDataCardProps) {
  const imageSrc = characterMoveImagePath(
    characterSlug,
    move.imageSlug,
    move.imageExt ?? ".jpg",
  );

  return (
    <article className="move-data-card flex items-center gap-3 rounded-md bg-surface px-3 py-2.5 sm:gap-4 sm:px-4 sm:py-3">
      <div className="flex h-[54px] w-[96px] shrink-0 items-center justify-center overflow-hidden rounded bg-[#0d1210] sm:h-[60px] sm:w-[106px]">
        <Image
          src={imageSrc}
          alt={`${move.nameJa}（${move.nameEn}）`}
          width={160}
          height={90}
          unoptimized
          className="max-h-full max-w-full object-contain"
          sizes="106px"
          priority={priority}
          loading={priority ? "eager" : "lazy"}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <h3 className="text-sm font-bold leading-tight text-foreground sm:text-[15px]">
            {move.nameJa}
          </h3>
          <p className="text-[10px] font-medium tracking-wide text-muted uppercase">
            {move.nameEn}
          </p>
        </div>

        <dl className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 sm:gap-x-4">
          {frameRows.map((row) => (
            <div key={row.key} className="flex items-baseline gap-1">
              <dt className="text-[9px] font-semibold tracking-wide text-muted uppercase">
                {row.labelJa}
              </dt>
              <dd className="text-sm font-semibold leading-none tabular-nums text-foreground">
                {move[row.key]}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}

"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { MoveFrameData, MoveImageFrame } from "@/data/characters/cammy";
import { FrameDataDetailTable } from "@/components/character/FrameDataDetailTable";
import { MoveFilterBar } from "@/components/character/MoveFilterBar";
import { WikiFrameDataCardPreview } from "@/components/character/WikiFrameDataCardPreview";
import { WikiFrameDataTable } from "@/components/character/WikiFrameDataTable";
import { characterMoveImagePath } from "@/lib/character-image-path";
import { hasWikiFullUi } from "@/lib/wiki-full-ui";
import { displayWikiValue, getShortInput } from "@/lib/wiki-markup";
import {
  getBaseSlug,
  getFrameLabel,
  splitMovesIntoSections,
} from "@/lib/move-sort";

function blockImageContextMenu(event: React.MouseEvent) {
  event.preventDefault();
}

function blockImageDrag(event: React.DragEvent) {
  event.preventDefault();
}

type MoveDataGridProps = {
  characterSlug: string;
  moves: MoveFrameData[];
};

function moveMatchesQuery(move: MoveFrameData, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const input = displayWikiValue(move.input);
  const shortInput = getShortInput(move.input);
  const haystack = [
    move.nameJa,
    move.nameEn,
    move.input ?? "",
    input,
    shortInput,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

function getImageFrames(move: MoveFrameData): MoveImageFrame[] {
  if (move.imageFrames && move.imageFrames.length > 0) {
    return move.imageFrames;
  }
  return [{ imageSlug: move.imageSlug, imageExt: move.imageExt }];
};

type MoveCardProps = {
  characterSlug: string;
  move: MoveFrameData;
  priority: boolean;
  onOpen: (move: MoveFrameData, frameIndex: number) => void;
};

function MoveCard({ characterSlug, move, priority, onOpen }: MoveCardProps) {
  const frames = getImageFrames(move);
  const primary = frames[0];
  const imageSrc = characterMoveImagePath(
    characterSlug,
    primary.imageSlug,
    primary.imageExt ?? ".jpg",
  );

  return (
    <li key={getBaseSlug(move.imageSlug)}>
      <button
        type="button"
        onClick={() => onOpen(move, 0)}
        className="move-data-card group flex w-full flex-col overflow-hidden rounded-md bg-surface text-left"
      >
        <span
          className="relative flex aspect-video w-full items-center justify-center bg-[#0d1210] p-1.5 lg:p-2"
          onContextMenu={blockImageContextMenu}
        >
          <Image
            src={imageSrc}
            alt={move.nameEn || move.nameJa}
            width={320}
            height={180}
            unoptimized
            draggable={false}
            onContextMenu={blockImageContextMenu}
            onDragStart={blockImageDrag}
            className="max-h-full max-w-full object-contain"
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 22vw, 220px"
            priority={priority}
            loading={priority ? "eager" : "lazy"}
          />
        </span>

        {frames.length > 1 ? (
          <span className="flex flex-wrap items-center justify-center gap-1.5 border-t border-border/60 bg-[#0a0f0c]/40 px-2 py-2">
            {frames.map((frame, fi) => (
              <span
                key={`${frame.imageSlug}${frame.imageExt ?? ""}`}
                className="flex flex-col items-center gap-0.5"
              >
                <span className="text-[8px] font-bold tabular-nums tracking-wide text-accent">
                  {getFrameLabel(frame.imageSlug, fi)}
                </span>
                <span
                  className="relative flex h-9 w-14 items-center justify-center overflow-hidden rounded bg-[#0d1210] sm:h-10 sm:w-16"
                  onContextMenu={blockImageContextMenu}
                >
                  <Image
                    src={characterMoveImagePath(
                      characterSlug,
                      frame.imageSlug,
                      frame.imageExt ?? ".jpg",
                    )}
                    alt={`${move.nameEn || move.nameJa} ${getFrameLabel(frame.imageSlug, fi)}`}
                    width={64}
                    height={36}
                    unoptimized
                    draggable={false}
                    onContextMenu={blockImageContextMenu}
                    onDragStart={blockImageDrag}
                    className="max-h-full max-w-full object-contain"
                  />
                </span>
              </span>
            ))}
          </span>
        ) : null}

        {hasWikiFullUi(characterSlug) ? (
          <WikiFrameDataCardPreview move={move} />
        ) : (
          <span className="space-y-1 px-2 py-2">
            <span className="block text-[11px] font-bold leading-tight text-foreground group-hover:text-accent">
              {move.nameEn || move.nameJa}
            </span>
            <span className="block truncate text-[9px] font-medium tracking-wide text-muted uppercase">
              {displayWikiValue(move.input) !== "—"
                ? displayWikiValue(move.input)
                : move.nameEn}
            </span>
            <span className="flex flex-wrap gap-x-2 gap-y-0.5 text-[9px] tabular-nums text-muted">
              <span>St {displayWikiValue(move.startup)}</span>
              <span>Bk {displayWikiValue(move.onBlock)}</span>
              {move.damage ? (
                <span>DMG {displayWikiValue(move.damage)}</span>
              ) : null}
            </span>
          </span>
        )}
      </button>
    </li>
  );
}

export function MoveDataGrid({ characterSlug, moves }: MoveDataGridProps) {
  const [query, setQuery] = useState("");
  const filteredMoves = useMemo(
    () => moves.filter((move) => moveMatchesQuery(move, query)),
    [moves, query],
  );
  const sections = useMemo(
    () => splitMovesIntoSections(filteredMoves),
    [filteredMoves],
  );
  const [active, setActive] = useState<MoveFrameData | null>(null);
  const [frameIndex, setFrameIndex] = useState(0);

  const close = useCallback(() => {
    setActive(null);
    setFrameIndex(0);
  }, []);

  const openMove = useCallback((move: MoveFrameData, startFrame = 0) => {
    setActive(move);
    setFrameIndex(startFrame);
  }, []);

  const activeFrames = active ? getImageFrames(active) : [];
  const frameCount = activeFrames.length;

  const goPrev = useCallback(() => {
    setFrameIndex((i) => (i <= 0 ? frameCount - 1 : i - 1));
  }, [frameCount]);

  const goNext = useCallback(() => {
    setFrameIndex((i) => (i >= frameCount - 1 ? 0 : i + 1));
  }, [frameCount]);

  useEffect(() => {
    if (!active) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (frameCount > 1 && event.key === "ArrowLeft") goPrev();
      if (frameCount > 1 && event.key === "ArrowRight") goNext();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active, close, frameCount, goNext, goPrev]);

  const currentFrame = activeFrames[frameIndex] ?? activeFrames[0];
  let cardIndex = 0;

  return (
    <>
      <MoveFilterBar
        value={query}
        onChange={setQuery}
        total={moves.length}
        visible={filteredMoves.length}
      />

      <p className="mt-3 text-[10px] font-semibold tracking-[0.2em] text-muted uppercase">
        {filteredMoves.length} moves — click thumbnail to expand
        {filteredMoves.some((m) => (m.imageFrames?.length ?? 0) > 1)
          ? "(_1 _2 _3 … shown in card / use ← → when expanded)"
          : ""}
      </p>

      {filteredMoves.length === 0 ? (
        <p className="mt-4 rounded-lg border border-dashed border-border bg-surface px-4 py-8 text-center text-sm text-muted">
          No moves match &ldquo;{query.trim()}&rdquo;. Try input (5LP), English name, or Japanese name.
        </p>
      ) : (
      <div className="mt-4 space-y-10">
        {sections.map((section) => (
          <section key={section.id} aria-labelledby={`section-${section.id}`}>
            <h3
              id={`section-${section.id}`}
              className="border-b border-accent/30 pb-2 text-xs font-bold tracking-[0.2em] text-accent uppercase sm:text-sm"
            >
              {section.label}
            </h3>
            <ul
              className={`mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 ${
                hasWikiFullUi(characterSlug)
                  ? "md:grid-cols-3 lg:grid-cols-4"
                  : "md:grid-cols-4 lg:grid-cols-6"
              }`}
            >
              {section.moves.map((move) => {
                const index = cardIndex;
                cardIndex += 1;
                return (
                  <MoveCard
                    key={getBaseSlug(move.imageSlug)}
                    characterSlug={characterSlug}
                    move={move}
                    priority={index < 6}
                    onOpen={openMove}
                  />
                );
              })}
            </ul>
          </section>
        ))}
      </div>
      )}

      {active && currentFrame ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0f0c]/92 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${active.nameEn ?? active.nameJa} hitbox`}
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 z-[101] rounded border border-white/20 px-3 py-1 text-xs font-bold tracking-widest text-white hover:border-accent hover:text-accent"
          >
            CLOSE
          </button>

          <div
            className="max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-lg bg-surface p-4 sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className="relative flex min-h-[200px] items-center justify-center rounded-md bg-[#0d1210] p-3"
              onContextMenu={blockImageContextMenu}
            >
              {frameCount > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    className="absolute left-2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/50 text-lg text-white transition-colors duration-300 hover:border-accent hover:text-accent sm:left-4"
                    aria-label="Previous frame"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    className="absolute right-2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/50 text-lg text-white transition-colors duration-300 hover:border-accent hover:text-accent sm:right-4"
                    aria-label="Next frame"
                  >
                    ›
                  </button>
                </>
              ) : null}

              <Image
                key={`${currentFrame.imageSlug}${currentFrame.imageExt ?? ""}`}
                src={characterMoveImagePath(
                  characterSlug,
                  currentFrame.imageSlug,
                  currentFrame.imageExt ?? ".jpg",
                )}
                alt={`${active.nameEn || active.nameJa} ${getFrameLabel(currentFrame.imageSlug, frameIndex)}`}
                width={960}
                height={540}
                unoptimized
                draggable={false}
                onContextMenu={blockImageContextMenu}
                onDragStart={blockImageDrag}
                className="move-frame-fade max-h-[50vh] w-auto max-w-full object-contain"
              />

              {frameCount > 1 ? (
                <p className="absolute bottom-2 left-1/2 z-10 -translate-x-1/2 rounded bg-black/60 px-2 py-0.5 text-[10px] font-bold tabular-nums tracking-widest text-white">
                  {getFrameLabel(currentFrame.imageSlug, frameIndex)}（
                  {frameIndex + 1} / {frameCount}）
                </p>
              ) : null}
            </div>

            {frameCount > 1 ? (
              <div className="mt-3 flex flex-wrap justify-center gap-2 border-t border-border/50 pt-3">
                {activeFrames.map((frame, fi) => (
                  <button
                    key={`${frame.imageSlug}${frame.imageExt ?? ""}`}
                    type="button"
                    onClick={() => setFrameIndex(fi)}
                    className={`flex flex-col items-center gap-1 rounded border px-2 py-1.5 transition-colors duration-300 ${
                      fi === frameIndex
                        ? "border-accent bg-accent/10"
                        : "border-border/60 hover:border-accent/50"
                    }`}
                  >
                    <span className="text-[9px] font-bold tabular-nums text-accent">
                      {getFrameLabel(frame.imageSlug, fi)}
                    </span>
                    <span
                      className="relative flex h-12 w-20 items-center justify-center bg-[#0d1210]"
                      onContextMenu={blockImageContextMenu}
                    >
                      <Image
                        src={characterMoveImagePath(
                          characterSlug,
                          frame.imageSlug,
                          frame.imageExt ?? ".jpg",
                        )}
                        alt=""
                        width={80}
                        height={45}
                        unoptimized
                        draggable={false}
                        onContextMenu={blockImageContextMenu}
                        onDragStart={blockImageDrag}
                        className="max-h-full max-w-full object-contain"
                      />
                    </span>
                  </button>
                ))}
              </div>
            ) : null}

            {hasWikiFullUi(characterSlug) ? (
              <WikiFrameDataTable move={active} />
            ) : (
              <>
                <div className="mt-4 space-y-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="text-lg font-bold text-foreground">
                      {active.nameEn || active.nameJa}
                    </h3>
                    <span className="font-mono text-sm font-bold tabular-nums text-accent">
                      {displayWikiValue(active.input)}
                    </span>
                    {getShortInput(active.input) !==
                    displayWikiValue(active.input) ? (
                      <span className="font-mono text-xs tabular-nums text-muted">
                        ({getShortInput(active.input)})
                      </span>
                    ) : null}
                  </div>
                  <p className="text-xs font-semibold tracking-[0.15em] text-muted uppercase">
                    {active.nameEn}
                  </p>
                </div>
                <FrameDataDetailTable move={active} />
              </>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}

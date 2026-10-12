"use client";

import Image from "next/image";
import { homePrimeGear, gearHref } from "@/data/affiliate-gear";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MoveFrameData } from "@/data/characters/cammy";
import { characterMoveImagePath } from "@/lib/character-image-path";
import { DESK_RESET_EVENT } from "@/components/character/DeskTitleLink";
import {
  displayWikiValue,
  frameAdvantageClass,
  getFrameAdvantageTone,
} from "@/lib/wiki-markup";
import {
  getBaseSlug,
  getFrameLabel,
  splitMovesIntoSections,
} from "@/lib/move-sort";

type Props = { characterSlug: string; moves: MoveFrameData[] };

const blockMenu = (e: React.MouseEvent) => e.preventDefault();
const blockDrag = (e: React.DragEvent) => e.preventDefault();

const keyOf = (m: MoveFrameData) => getBaseSlug(m.imageSlug);
const firstInt = (v?: string) => {
  const m = /\d+/.exec(v ?? "");
  return m ? parseInt(m[0], 10) : null;
};
const sentence = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();
const prettySlug = (s: string) =>
  s.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

function matches(m: MoveFrameData, q: string) {
  const t = q.trim().toLowerCase();
  if (!t) return true;
  return [m.input, m.nameEn, m.nameJa].join(" ").toLowerCase().includes(t);
}

/** "2(4)2(10)2" → active 2, gap 4, active 2 ... */
function parseActive(a?: string) {
  const out: { kind: "on" | "gap"; n: number }[] = [];
  const re = /\((\d+)\)|(\d+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(a ?? ""))) {
    if (m[1]) out.push({ kind: "gap", n: parseInt(m[1], 10) });
    else out.push({ kind: "on", n: parseInt(m[2], 10) });
  }
  return out;
}

function FrameBar({ move }: { move: MoveFrameData }) {
  const startup = firstInt(move.startup);
  const rec = firstInt(move.recovery);
  const act = parseActive(move.active);
  if (startup === null || rec === null || act.length === 0 || act[0].kind === "gap")
    return null;
  const wait = Math.max(startup - 1, 0);
  const actTotal = act.filter((s) => s.kind === "on").reduce((a, s) => a + s.n, 0);
  return (
    <div className="mt-5">
      <div
        className="flex h-5 w-full overflow-hidden rounded bg-border/60"
        role="img"
        aria-label={`Startup ${startup} frames, active ${actTotal}, recovery ${rec}`}
      >
        {wait > 0 ? (
          <span style={{ flex: `${wait} 1 0`, minWidth: 3 }} className="bg-slate-400/70" />
        ) : null}
        {act.map((s, i) => (
          <span
            key={i}
            style={{ flex: `${s.n} 1 0`, minWidth: 3 }}
            className={s.kind === "on" ? "bg-accent" : "bg-accent/20"}
          />
        ))}
        <span style={{ flex: `${rec} 1 0`, minWidth: 3 }} className="bg-[#2a3a31]" />
      </div>
      <div className="mt-1.5 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5">
          <i className="h-2.5 w-2.5 rounded-sm bg-slate-400/70" /> Startup {startup}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <i className="h-2.5 w-2.5 rounded-sm bg-accent" /> Active {displayWikiValue(move.active)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <i className="h-2.5 w-2.5 rounded-sm bg-[#2a3a31]" /> Recovery {rec}
        </span>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone = false,
  big = false,
}: {
  label: string;
  value?: string;
  tone?: boolean;
  big?: boolean;
}) {
  const v = displayWikiValue(value);
  const cls = tone ? frameAdvantageClass(getFrameAdvantageTone(v)) : "text-foreground";
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted">{label}</dt>
      <dd
        className={`mt-0.5 font-bold tabular-nums leading-tight ${cls} ${
          big ? "text-3xl xl:text-4xl" : "text-lg"
        } break-words`}
      >
        {v}
      </dd>
    </div>
  );
}

export function MoveDesk({ characterSlug, moves }: Props) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string>(() => (moves[0] ? keyOf(moves[0]) : ""));
  const [frameIndex, setFrameIndex] = useState(0);
  const viewerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const visible = useMemo(() => moves.filter((m) => matches(m, query)), [moves, query]);
  const sections = useMemo(() => splitMovesIntoSections(visible), [visible]);

  const active = useMemo(
    () => visible.find((m) => keyOf(m) === selected) ?? visible[0] ?? null,
    [visible, selected],
  );
  const activeKey = active ? keyOf(active) : "";
  const frames = active
    ? active.imageFrames && active.imageFrames.length > 0
      ? active.imageFrames
      : [{ imageSlug: active.imageSlug, imageExt: active.imageExt }]
    : [];
  const frame = frames[Math.min(frameIndex, Math.max(frames.length - 1, 0))];

  const choose = useCallback((m: MoveFrameData, fromList = true) => {
    setSelected(keyOf(m));
    setFrameIndex(0);
    if (fromList && typeof window !== "undefined" && window.innerWidth < 1024) {
      viewerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const backToTop = useCallback(() => {
    setQuery("");
    setSelected(moves[0] ? keyOf(moves[0]) : "");
    setFrameIndex(0);
    listRef.current?.scrollTo({ top: 0 });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [moves]);

  useEffect(() => {
    const onReset = () => {
      setQuery("");
      setSelected(moves[0] ? keyOf(moves[0]) : "");
      setFrameIndex(0);
      listRef.current?.scrollTo({ top: 0 });
    };
    window.addEventListener(DESK_RESET_EVENT, onReset);
    return () => window.removeEventListener(DESK_RESET_EVENT, onReset);
  }, [moves]);

  useEffect(() => {
    // Scroll only the list box, never the window (scrollIntoView would drag the page).
    const list = listRef.current;
    const el = list?.querySelector(`[data-key="${activeKey}"]`);
    if (!list || !el) return;
    const STICKY_HEADER = 32;
    const lr = list.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    if (er.top < lr.top + STICKY_HEADER) list.scrollTop -= lr.top + STICKY_HEADER - er.top;
    else if (er.bottom > lr.bottom) list.scrollTop += er.bottom - lr.bottom;
  }, [activeKey]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const tag = (e.target as HTMLElement).tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    const idx = visible.findIndex((m) => keyOf(m) === activeKey);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      const next = visible[idx + (e.key === "ArrowDown" ? 1 : -1)];
      if (next) {
        e.preventDefault();
        choose(next, false);
      }
    } else if ((e.key === "ArrowRight" || e.key === "ArrowLeft") && frames.length > 1) {
      e.preventDefault();
      setFrameIndex((i) =>
        e.key === "ArrowRight" ? (i + 1) % frames.length : (i - 1 + frames.length) % frames.length,
      );
    }
  };

  return (
    <section
      className="bg-surface"
      onKeyDown={onKeyDown}
      aria-label={`${characterSlug} frame data`}
    >
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-3 py-6 sm:px-5 lg:grid-cols-[21rem_minmax(0,1fr)] lg:px-6 lg:py-8">
        {/* Move list */}
        <aside className="order-2 lg:order-1 lg:sticky lg:top-[calc(var(--site-header-h)+1rem)] lg:self-start">
          <label className="block">
            <span className="sr-only">Search moves</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search move — 5LP, Alon, 236…"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25"
            />
          </label>
          <p className="mt-2 text-xs text-muted">
            {visible.length} of {moves.length} moves · ↑ ↓ to switch
          </p>

          <div
            ref={listRef}
            className="mt-2 overflow-y-auto rounded-lg border border-border lg:max-h-[calc(100vh-var(--site-header-h)-9rem)]"
          >
            <div className="sticky top-0 z-10 grid grid-cols-[3.9rem_minmax(0,1fr)_2.6rem_2.8rem] gap-x-2 border-b border-border bg-background px-3 py-1.5 text-xs text-muted">
              <span>Move</span>
              <span />
              <span className="text-right">Start</span>
              <span className="text-right">Block</span>
            </div>
            {sections.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-muted">
                No move matches &ldquo;{query.trim()}&rdquo;. Try an input like 5LP or a name like Alon.
              </p>
            ) : null}
            {sections.map((section) => (
              <div key={section.id}>
                <h3 className="bg-background/80 px-3 pt-3 pb-1 text-xs font-bold text-accent">
                  {sentence(section.label)}
                </h3>
                <ul>
                  {section.moves.map((m) => {
                    const k = keyOf(m);
                    const on = k === activeKey;
                    const blk = displayWikiValue(m.onBlock);
                    return (
                      <li key={k}>
                        <button
                          type="button"
                          data-key={k}
                          aria-current={on ? "true" : undefined}
                          onClick={() => choose(m)}
                          className={`grid w-full grid-cols-[3.9rem_minmax(0,1fr)_2.6rem_2.8rem] items-baseline gap-x-2 border-l-4 px-3 py-1.5 text-left text-sm transition-colors ${
                            on
                              ? "border-accent bg-accent-soft"
                              : "border-transparent hover:bg-background"
                          }`}
                        >
                          <span className="truncate font-bold text-foreground">
                            {displayWikiValue(m.input)}
                          </span>
                          <span className="truncate text-xs text-muted">{m.nameEn}</span>
                          <span className="text-right font-semibold tabular-nums text-foreground">
                            {displayWikiValue(m.startup)}
                          </span>
                          <span
                            className={`text-right font-semibold tabular-nums ${frameAdvantageClass(
                              getFrameAdvantageTone(blk),
                            )}`}
                          >
                            {blk}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        {/* Viewer */}
        <div ref={viewerRef} className="order-1 min-w-0 scroll-mt-24 lg:order-2">
          {active && frame ? (
            <>
              <button
                type="button"
                onClick={backToTop}
                className="mb-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-semibold text-muted transition hover:border-accent hover:text-accent lg:hidden"
              >
                <span aria-hidden="true">←</span> {prettySlug(characterSlug)} top
              </button>
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h2 className="text-3xl font-black tracking-tight text-foreground">
                  {displayWikiValue(active.input)}
                </h2>
                <p className="text-base text-muted">{active.nameEn}</p>
                {active.guard ? (
                  <span className="rounded border border-border px-2 py-0.5 text-xs font-semibold text-muted">
                    Guard {active.guard}
                  </span>
                ) : null}
              </div>

              <div
                className="mt-3 flex items-center justify-center rounded-xl bg-[#0d1210] p-3"
                onContextMenu={blockMenu}
              >
                <Image
                  key={`${frame.imageSlug}${frame.imageExt ?? ""}`}
                  src={characterMoveImagePath(characterSlug, frame.imageSlug, frame.imageExt ?? ".jpg")}
                  alt={`${active.nameEn} hitbox ${getFrameLabel(frame.imageSlug, frameIndex)}`}
                  width={960}
                  height={540}
                  unoptimized
                  priority
                  draggable={false}
                  onContextMenu={blockMenu}
                  onDragStart={blockDrag}
                  className="max-h-[38vh] w-auto max-w-full object-contain"
                />
              </div>

              {frames.length > 1 ? (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted">Frames · ← → to step</span>
                  {frames.map((f, i) => (
                    <button
                      key={`${f.imageSlug}${f.imageExt ?? ""}`}
                      type="button"
                      onClick={() => setFrameIndex(i)}
                      aria-label={`Frame ${i + 1}`}
                      aria-current={i === frameIndex ? "true" : undefined}
                      className={`overflow-hidden rounded border-2 bg-[#0d1210] transition ${
                        i === frameIndex ? "border-accent" : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                      onContextMenu={blockMenu}
                    >
                      <Image
                        src={characterMoveImagePath(characterSlug, f.imageSlug, f.imageExt ?? ".jpg")}
                        alt=""
                        width={80}
                        height={45}
                        unoptimized
                        draggable={false}
                        onDragStart={blockDrag}
                        className="h-[45px] w-[80px] object-contain"
                      />
                    </button>
                  ))}
                </div>
              ) : null}

              <dl className="mt-4 grid grid-cols-3 gap-6 border-t border-border pt-4">
                <Stat label="Startup" value={active.startup} big />
                <Stat label="On hit" value={active.onHit} tone big />
                <Stat label="On block" value={active.onBlock} tone big />
              </dl>
              <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
                <Stat label="Active" value={active.active} />
                <Stat label="Recovery" value={active.recovery} />
                <Stat label="Total" value={active.total} />
                <Stat label="Damage" value={active.damage} />
                <div className="col-span-2 sm:col-span-4">
                  <Stat label="Cancel" value={active.cancel} />
                </div>
              </dl>

              <FrameBar move={active} />
            </>
          ) : (
            <p className="rounded-lg border border-dashed border-border px-4 py-12 text-center text-sm text-muted">
              Pick a move on the left to see its hitbox and frame data.
            </p>
          )}
          {characterSlug === "yasmine" ? (
            <section aria-label="Controllers for lab work" className="mt-6 rounded-lg border border-border bg-background px-3 py-3">
              <h3 className="text-sm font-semibold text-foreground">Controllers for lab work</h3>
              <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                {homePrimeGear().slice(0, 2).map((item) => (
                  <li key={item.asin}>
                    <a href={gearHref(item.asin)} target="_blank" rel="sponsored noopener noreferrer" className="text-sm font-semibold text-accent hover:text-accent-hover">
                      {item.shortLabel} on Amazon →
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[12px] leading-relaxed text-muted">Affiliate link — we may earn a commission at no extra cost to you.</p>
            </section>
          ) : null}
        </div>
      </div>
    </section>
  );
}

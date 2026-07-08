"use client";

type MoveFilterBarProps = {
  value: string;
  onChange: (value: string) => void;
  total: number;
  visible: number;
};

export function MoveFilterBar({
  value,
  onChange,
  total,
  visible,
}: MoveFilterBarProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <label className="flex min-w-0 flex-1 items-center gap-2">
        <span className="sr-only">Filter moves</span>
        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search move — 5LP, hadoken, shoryu…"
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted/70 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/40"
          autoComplete="off"
          spellCheck={false}
        />
      </label>
      <p className="shrink-0 text-[10px] font-semibold tracking-wide text-muted uppercase">
        {value.trim() ? `${visible} / ${total} moves` : `${total} moves`}
      </p>
    </div>
  );
}

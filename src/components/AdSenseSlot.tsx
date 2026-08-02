/**
 * Layout reservation for Google AdSense (manual slots only).
 * Placeholder until Doc connects unit IDs after approval. Auto ads stay off.
 */
type AdSenseSlotProps = {
  slotId: string;
  className?: string;
  /** Desktop sidebar-style fixed feel; hidden on small screens when true. */
  desktopOnly?: boolean;
  minHeightClassName?: string;
};

export function AdSenseSlot({
  slotId,
  className = "",
  desktopOnly = false,
  minHeightClassName = "min-h-[90px]",
}: AdSenseSlotProps) {
  return (
    <aside
      id={slotId}
      data-adsense-slot={slotId}
      aria-label="Advertisement"
      className={[
        "rounded-lg border border-border/70 bg-[#152038] text-[#f5f8ff]",
        minHeightClassName,
        desktopOnly ? "hidden lg:block" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex h-full min-h-[inherit] flex-col items-center justify-center gap-1 px-3 py-4 text-center">
        <p className="text-[9px] font-bold tracking-[0.28em] text-white/45 uppercase">
          Advertisement
        </p>
        <p className="max-w-[16rem] text-[11px] leading-snug text-white/55">
          Ad slot reserved — connects after AdSense approval
        </p>
      </div>
    </aside>
  );
}

/**
 * Google AdSense slot — currently disabled.
 * No AdSense unit is connected (revenue is Amazon-centric), so nothing is rendered.
 * Call sites stay as they are; to bring ads back later, restore the <aside> markup
 * from git history and connect the unit IDs.
 */
type AdSenseSlotProps = {
  slotId: string;
  className?: string;
  desktopOnly?: boolean;
  minHeightClassName?: string;
};

export function AdSenseSlot(props: AdSenseSlotProps) {
  void props;
  return null;
}

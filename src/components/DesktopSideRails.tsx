import Link from "next/link";

const LEFT_LINK = {
  label: "Street Fighter 6 (PS5)",
  href: "https://www.amazon.com/dp/B0BPJRGNSD?tag=sf6maxdatabas-20",
} as const;

const RIGHT_LINK = {
  label: "8BitDo Arcade Stick",
  href: "https://www.amazon.com/dp/B0BX8N6F5K?tag=sf6maxdatabas-20",
} as const;

function SideCard({
  label,
  href,
}: {
  label: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="block rounded-lg border border-white/10 bg-[#0a0f0c]/95 p-3 text-center shadow-lg backdrop-blur-sm transition hover:border-accent/40"
    >
      <p className="text-[9px] font-bold tracking-[0.28em] text-accent uppercase">
        Recommended
      </p>
      <p className="mt-2 text-xs font-semibold leading-snug text-white/80">
        {label}
      </p>
      <p className="mt-2 text-[10px] font-bold text-accent">Amazon →</p>
    </a>
  );
}

function AdSlotPlaceholder({ side }: { side: "left" | "right" }) {
  return (
    <div
      aria-hidden
      className="mt-3 flex min-h-[250px] items-center justify-center rounded-lg border border-dashed border-white/10 bg-surface/20 px-2 text-center text-[10px] leading-relaxed text-white/30"
    >
      Ad slot ({side})
      <br />
      after AdSense approval
    </div>
  );
}

export function DesktopSideRails() {
  return (
    <>
      <aside
        aria-label="Desktop left rail"
        className="pointer-events-none fixed inset-y-0 left-0 z-20 hidden w-[min(11rem,calc((100vw-80rem)/2))] 2xl:block"
      >
        <div className="pointer-events-auto sticky top-24 px-3 py-6">
          <SideCard label={LEFT_LINK.label} href={LEFT_LINK.href} />
          <AdSlotPlaceholder side="left" />
          <p className="mt-2 text-center text-[9px] text-white/35">
            <Link href="/about#affiliate" className="hover:text-accent">
              Affiliate
            </Link>
          </p>
        </div>
      </aside>

      <aside
        aria-label="Desktop right rail"
        className="pointer-events-none fixed inset-y-0 right-0 z-20 hidden w-[min(11rem,calc((100vw-80rem)/2))] 2xl:block"
      >
        <div className="pointer-events-auto sticky top-24 px-3 py-6">
          <SideCard label={RIGHT_LINK.label} href={RIGHT_LINK.href} />
          <AdSlotPlaceholder side="right" />
          <p className="mt-2 text-center text-[9px] text-white/35">
            <Link href="/about#affiliate" className="hover:text-accent">
              Affiliate
            </Link>
          </p>
        </div>
      </aside>
    </>
  );
}

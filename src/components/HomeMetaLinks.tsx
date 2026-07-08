import Link from "next/link";

const links = [
  {
    href: "/tier",
    badge: "RANK",
    title: "Tier list",
    desc: "Community ranks",
  },
  {
    href: "/matchups",
    badge: "MATCH",
    title: "Matchups",
    desc: "870-cell chart",
  },
] as const;

export function HomeMetaLinks() {
  return (
    <div className="flex w-full flex-row items-stretch gap-2 sm:gap-2.5">
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="meta-hero-card group relative flex min-w-[7.75rem] flex-1 items-stretch overflow-hidden rounded-md border border-white/[0.12] bg-[#0d1410]/80 transition duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-[0_12px_40px_rgba(0,179,104,0.3)] sm:min-w-[9rem]"
          translate="no"
        >
          <div
            className="w-[3px] shrink-0 bg-gradient-to-b from-accent/30 via-accent to-accent/30 transition duration-300 group-hover:from-accent-mint/50 group-hover:via-accent-mint group-hover:to-accent-mint/50"
            aria-hidden
          />
          <div className="relative min-w-0 flex-1 px-2.5 py-2 pr-8 sm:px-3 sm:py-2.5 sm:pr-9">
            <p className="text-[7px] font-bold tracking-[0.28em] text-accent/90 sm:text-[8px]">
              {item.badge}
            </p>
            <p className="meta-hero-title mt-1 whitespace-nowrap text-[0.9rem] font-black leading-none tracking-tight text-white sm:text-[0.95rem]">
              {item.title}
            </p>
            <p className="mt-1 hidden text-[9px] leading-none text-white/40 sm:block">{item.desc}</p>
          </div>
          <div
            className="flex w-7 shrink-0 items-center justify-center border-l border-white/[0.08] bg-white/[0.02] text-xs text-white/45 transition duration-300 group-hover:border-accent/35 group-hover:bg-accent/10 group-hover:text-accent sm:w-8 sm:text-sm"
            aria-hidden
          >
            →
          </div>
        </Link>
      ))}
    </div>
  );
}

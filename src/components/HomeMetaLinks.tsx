import Link from "next/link";

const links = [
  {
    href: "/tier",
    badge: "CHAR RANK",
    title: "キャラランク",
    desc: "30キャラ・ティア順",
  },
  {
    href: "/matchups",
    badge: "MATCHUP",
    title: "キャラ相性",
    desc: "相性表・タップでメモ",
  },
] as const;

export function HomeMetaLinks() {
  return (
    <div className="flex w-full flex-col gap-2.5 sm:flex-row sm:items-stretch sm:gap-3 lg:max-w-[21rem] lg:flex-col">
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="meta-hero-card group relative flex min-w-0 flex-1 items-stretch overflow-hidden rounded-md border border-white/[0.12] bg-[#0d1410]/80 transition duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-[0_12px_40px_rgba(0,179,104,0.3)]"
          translate="no"
        >
          <div
            className="w-[3px] shrink-0 bg-gradient-to-b from-accent/30 via-accent to-accent/30 transition duration-300 group-hover:from-accent-mint/50 group-hover:via-accent-mint group-hover:to-accent-mint/50"
            aria-hidden
          />
          <div className="relative min-w-0 flex-1 px-3.5 py-3 pr-10 sm:px-4 sm:py-3.5">
            <div
              className="pointer-events-none absolute -right-4 top-0 h-full w-24 bg-gradient-to-l from-accent/[0.07] to-transparent opacity-0 transition duration-300 group-hover:opacity-100"
              aria-hidden
            />
            <p className="text-[8px] font-bold tracking-[0.34em] text-accent/90 sm:text-[9px]">
              {item.badge}
            </p>
            <p className="meta-hero-title mt-1.5 whitespace-nowrap text-[1.05rem] font-black leading-none tracking-tight text-white sm:text-lg">
              {item.title}
            </p>
            <p className="mt-2 text-[10px] leading-snug text-white/40">{item.desc}</p>
          </div>
          <div
            className="flex w-9 shrink-0 items-center justify-center border-l border-white/[0.08] bg-white/[0.02] text-sm text-white/45 transition duration-300 group-hover:border-accent/35 group-hover:bg-accent/10 group-hover:text-accent"
            aria-hidden
          >
            →
          </div>
        </Link>
      ))}
    </div>
  );
}

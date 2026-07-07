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
    <div className="grid w-full gap-2.5 sm:grid-cols-2 lg:w-auto lg:min-w-[18rem] lg:max-w-[22rem] lg:gap-3">
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="meta-hero-card group relative block overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-transparent px-4 py-3.5 transition duration-300 hover:-translate-y-0.5 hover:border-accent/55 hover:shadow-[0_8px_32px_rgba(0,179,104,0.28)] sm:min-h-[5.5rem]"
          translate="no"
        >
          <div
            className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent/10 blur-2xl transition duration-300 group-hover:bg-accent/25"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-accent/80 to-transparent transition-all duration-300 group-hover:w-full"
            aria-hidden
          />
          <p className="text-[9px] font-bold tracking-[0.3em] text-accent/85">{item.badge}</p>
          <p className="mt-1 font-display text-xl font-black leading-none tracking-tight text-white sm:text-[1.35rem]">
            {item.title}
          </p>
          <p className="mt-1.5 text-[10px] leading-snug text-white/45">{item.desc}</p>
          <span
            className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/20 text-sm text-white/60 transition duration-300 group-hover:border-accent/70 group-hover:bg-accent/15 group-hover:text-accent"
            aria-hidden
          >
            →
          </span>
        </Link>
      ))}
    </div>
  );
}

import Link from "next/link";
import { FavoriteSlots } from "@/components/FavoriteSlots";
import { HeaderCharacterSearch } from "@/components/HeaderCharacterSearch";
import { HeaderMetaStrip } from "@/components/HeaderMetaStrip";

type SiteHeaderProps = {
  active?: "home" | "characters" | "tier" | "matchups" | "about";
};

const navItems = [
  { href: "/", label: "TOP", key: "home" as const },
  { href: "/characters", label: "CHARACTERS", key: "characters" as const },
  { href: "/tier", label: "CHAR RANK", key: "tier" as const },
  { href: "/matchups", label: "MATCHUPS", key: "matchups" as const },
  { href: "/about", label: "ABOUT", key: "about" as const },
  { href: "/#news", label: "NEWS", key: null },
];

export function SiteHeader({ active }: SiteHeaderProps) {
  return (
    <header className="site-header sticky top-0 z-50 border-b border-accent/40 bg-[#0a0f0c] text-white">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-x-2 gap-y-1 px-4 py-1.5 sm:gap-x-3 sm:px-6 sm:py-2">
        <Link href="/" className="group col-start-1 row-start-1 min-w-0 shrink-0 leading-none justify-self-start">
          <p className="text-[9px] font-bold tracking-[0.32em] text-accent sm:text-[10px]">
            STREET FIGHTER 6
          </p>
          <p className="mt-0.5 truncate font-display text-base font-black uppercase leading-none tracking-tight text-white group-hover:text-accent sm:text-xl lg:text-2xl">
            MAX <span className="text-accent">DATABASE</span>
          </p>
        </Link>

        <div className="col-span-3 row-start-2 flex min-w-0 flex-col items-stretch gap-1 px-0.5 sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:max-w-xs sm:justify-self-center sm:px-2">
          <HeaderCharacterSearch />
          {active !== "home" ? (
            <HeaderMetaStrip className="hidden min-w-0 xl:flex" />
          ) : null}
        </div>

        <div className="col-start-3 row-start-1 flex shrink-0 items-center justify-self-end gap-2">
        <FavoriteSlots />
        <nav
          className="hidden shrink-0 items-center gap-0 border-l border-white/15 pl-4 text-[9px] font-bold tracking-[0.16em] sm:flex sm:pl-5 sm:text-[10px]"
          aria-label="Main navigation"
        >
          {navItems.map((item, index) => (
            <span key={item.href} className="flex items-center">
              {index > 0 ? (
                <span className="mx-2 h-3 w-px bg-white/20 sm:mx-2.5" aria-hidden />
              ) : null}
              <Link
                href={item.href}
                className={
                  active && item.key === active
                    ? "text-accent"
                    : "text-white/75 hover:text-accent"
                }
              >
                {item.label}
              </Link>
            </span>
          ))}
        </nav>

        <nav
          className="flex shrink-0 items-center gap-1.5 text-[9px] font-bold tracking-[0.12em] sm:hidden"
          aria-label="Mobile navigation"
        >
          <Link href="/" className={active === "home" ? "text-accent" : "text-white/75"}>
            TOP
          </Link>
          <Link
            href="/characters"
            className={active === "characters" ? "text-accent" : "text-white/75"}
          >
            CHARA
          </Link>
          <Link href="/tier" className={active === "tier" ? "text-accent" : "text-white/75"}>
            RANK
          </Link>
          <Link
            href="/matchups"
            className={active === "matchups" ? "text-accent" : "text-white/75"}
          >
            MATCH
          </Link>
        </nav>
        </div>
      </div>
    </header>
  );
}

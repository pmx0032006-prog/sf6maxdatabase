import Link from "next/link";
import { siteName } from "@/lib/site";

type SiteHeaderProps = {
  active?: "home" | "characters" | "about";
};

const navItems = [
  { href: "/", label: "TOP", key: "home" as const },
  { href: "/characters", label: "CHARACTERS", key: "characters" as const },
  { href: "/about", label: "ABOUT", key: "about" as const },
  { href: "/#news", label: "NEWS", key: null },
];

export function SiteHeader({ active }: SiteHeaderProps) {
  return (
    <header className="site-header sticky top-0 z-50 border-b border-accent/40 bg-[#0a0f0c] text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2 sm:px-10 sm:py-2.5">
        <Link href="/" className="group min-w-0 shrink leading-tight">
          <p className="text-[9px] font-bold tracking-[0.28em] text-accent sm:text-[10px]">
            STREET FIGHTER 6
          </p>
          <p className="truncate font-display text-sm font-bold tracking-[0.1em] text-white group-hover:text-accent sm:text-base">
            {siteName.replace("SF6 ", "")}
          </p>
        </Link>

        <nav
          className="hidden items-center gap-0 text-[9px] font-bold tracking-[0.18em] sm:flex sm:text-[10px]"
          aria-label="Main navigation"
        >
          {navItems.map((item, index) => (
            <span key={item.href} className="flex items-center">
              {index > 0 ? (
                <span
                  className="mx-3 h-3 w-px bg-white/20"
                  aria-hidden
                />
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
          className="flex items-center gap-3 text-[10px] font-bold tracking-[0.18em] sm:hidden"
          aria-label="Mobile navigation"
        >
          <Link
            href="/"
            className={active === "home" ? "text-accent" : "text-white/75"}
          >
            TOP
          </Link>
          <Link
            href="/characters"
            className={
              active === "characters" ? "text-accent" : "text-white/75"
            }
          >
            CHARA
          </Link>
          <Link
            href="/about"
            className={active === "about" ? "text-accent" : "text-white/75"}
          >
            ABOUT
          </Link>
        </nav>
      </div>
    </header>
  );
}

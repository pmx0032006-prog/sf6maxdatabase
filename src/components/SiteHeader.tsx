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

] as const;



function DesktopNav({ active }: { active?: SiteHeaderProps["active"] }) {

  return (

    <nav

      className="hidden items-center gap-0 text-[9px] font-bold tracking-[0.14em] lg:flex xl:text-[10px]"

      aria-label="Main navigation"

    >

      {navItems.map((item, index) => (

        <span key={item.href} className="flex items-center">

          {index > 0 ? (

            <span className="mx-1.5 h-3 w-px bg-white/20 xl:mx-2" aria-hidden />

          ) : null}

          <Link

            href={item.href}

            className={`whitespace-nowrap py-1 ${

              active && item.key === active

                ? "text-accent"

                : "text-white/75 hover:text-accent"

            }`}

          >

            {item.label}

          </Link>

        </span>

      ))}

    </nav>

  );

}



function MobileNav({ active }: { active?: SiteHeaderProps["active"] }) {

  return (

    <nav

      className="flex shrink-0 items-center gap-2 text-[9px] font-bold tracking-[0.1em] lg:hidden"

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

  );

}



export function SiteHeader({ active }: SiteHeaderProps) {

  return (

    <>

      <header className="site-header fixed inset-x-0 top-0 z-50 border-b border-accent/40 bg-[#0a0f0c]/95 text-white shadow-[0_8px_28px_rgba(0,0,0,0.38)] backdrop-blur-md supports-[backdrop-filter]:bg-[#0a0f0c]/88">

        <div className="site-header-inner mx-auto w-full max-w-7xl px-4 py-2 sm:px-6">

          <div className="flex items-center justify-between gap-3">

            <Link

              href="/"

              className="group min-w-0 shrink-0 leading-none"

            >

              <p className="text-[9px] font-bold tracking-[0.32em] text-accent sm:text-[10px]">

                STREET FIGHTER 6

              </p>

              <p className="mt-0.5 truncate font-display text-base font-black uppercase leading-none tracking-tight text-white group-hover:text-accent sm:text-xl lg:text-2xl">

                MAX <span className="text-accent">DATABASE</span>

              </p>

            </Link>



            <div className="hidden min-w-0 flex-1 items-center justify-end gap-3 lg:flex xl:gap-4">

              <div className="w-full max-w-[11rem] xl:max-w-[13rem]">

                <HeaderCharacterSearch />

              </div>

              {active !== "home" ? (

                <HeaderMetaStrip className="hidden min-w-0 xl:flex" />

              ) : null}

              <FavoriteSlots />

              <div className="shrink-0 border-l border-white/15 pl-3 xl:pl-4">

                <DesktopNav active={active} />

              </div>

            </div>



            <MobileNav active={active} />

          </div>



          <div className="mt-2 lg:hidden">

            <HeaderCharacterSearch />

          </div>

        </div>

      </header>

      <div className="site-header-spacer" aria-hidden="true" />

    </>

  );

}



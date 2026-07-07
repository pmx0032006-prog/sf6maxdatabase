import Link from "next/link";

const sections = [
  { href: "#roster", label: "Roster" },
  { href: "#contents", label: "Features" },
  { href: "#news", label: "News" },
];

const quickLinks = [
  { href: "/characters", label: "All Characters" },
  { href: "/about", label: "About / How to read" },
];

export function HomeNav() {
  return (
    <aside
      aria-label="Section navigation"
      className="hidden lg:sticky lg:top-16 lg:block lg:self-start"
    >
      <nav className="rounded-lg border border-border bg-surface p-3 shadow-sm">
        <p className="text-[10px] font-bold tracking-[0.28em] text-muted uppercase">
          On this page
        </p>
        <ul className="mt-2 flex flex-col gap-1">
          {sections.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="block rounded-md px-2.5 py-1.5 text-sm font-semibold text-foreground transition hover:bg-accent-soft hover:text-accent-hover"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-3 border-t border-border pt-3 text-[10px] font-bold tracking-[0.28em] text-muted uppercase">
          Explore
        </p>
        <ul className="mt-2 flex flex-col gap-1">
          {quickLinks.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block rounded-md px-2.5 py-1.5 text-sm text-muted transition hover:bg-accent-soft hover:text-accent-hover"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

import Link from "next/link";
import { PageMasthead } from "@/components/PageMasthead";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { siteName, siteUrl } from "@/lib/site";

export type LegalSection = {
  id: string;
  title: string;
  body?: string[];
  bullets?: string[];
};

type LegalDocPageProps = {
  title: string;
  subtitle: string;
  path: string;
  crumbName: string;
  effectiveDate?: string;
  sections: LegalSection[];
  footerLinks?: { href: string; label: string; primary?: boolean }[];
};

export function LegalDocPage({
  title,
  subtitle,
  path,
  crumbName,
  effectiveDate,
  sections,
  footerLinks = [
    { href: "/contact", label: "Contact →", primary: true },
    { href: "/", label: "Back to home" },
  ],
}: LegalDocPageProps) {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader active="about" />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: siteUrl },
          { name: crumbName, item: `${siteUrl}${path}` },
        ]}
      />

      <main className="flex-1">
        <PageMasthead
          eyebrow={siteName}
          title={title}
          subtitle={subtitle}
          showBackLink
        />

        <section className="bg-background">
          <div className="mx-auto max-w-3xl space-y-14 px-4 py-12 sm:px-10 sm:py-16">
            {effectiveDate ? (
              <p className="text-xs text-muted/80">Effective date: {effectiveDate}</p>
            ) : null}

            {sections.map((section) => (
              <article key={section.id} id={section.id} className="space-y-4">
                <h2 className="border-l-4 border-accent pl-4 text-lg font-bold tracking-tight text-foreground sm:text-xl">
                  {section.title}
                </h2>
                {section.body?.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="text-sm leading-relaxed text-muted sm:text-base"
                  >
                    {paragraph}
                  </p>
                ))}
                {section.bullets?.length ? (
                  <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted sm:text-base">
                    {section.bullets.map((item) => (
                      <li key={item.slice(0, 40)}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}

            <div className="flex flex-wrap gap-4 border-t border-border/80 pt-8">
              {footerLinks.map((link) => {
                const className = link.primary
                  ? "inline-flex items-center text-sm font-semibold text-accent hover:text-accent-hover"
                  : "inline-flex items-center text-sm text-muted hover:text-foreground";
                const external =
                  link.href.startsWith("mailto:") || link.href.startsWith("http");
                if (external) {
                  return (
                    <a key={link.href + link.label} href={link.href} className={className}>
                      {link.label}
                    </a>
                  );
                }
                return (
                  <Link key={link.href + link.label} href={link.href} className={className}>
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

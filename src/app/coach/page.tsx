import Link from "next/link";
import { AdSenseSlot } from "@/components/AdSenseSlot";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { PageMasthead } from "@/components/PageMasthead";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { siteName, siteNameFull, siteUrl } from "@/lib/site";
import type { Metadata } from "next";

const snapUser = "jpsf6coach";
const snapAdd = `https://www.snapchat.com/add/${snapUser}`;

export const metadata: Metadata = {
  title: "SF6 Coaching",
  description:
    "Street Fighter 6 coaching from Japan. Former Japan national team (King of Fighters 2001). Book on Snapchat.",
  alternates: { canonical: `${siteUrl}/coach` },
  openGraph: {
    title: `SF6 Coaching | ${siteName}`,
    description:
      "Online SF6 coaching from Japan. Former Japan national (KOF 2001). Snapchat: jpsf6coach",
    url: `${siteUrl}/coach`,
  },
  other: {
    google: "notranslate",
  },
};

function Ltr({ children }: { children: string }) {
  return (
    <span dir="ltr" className="inline-block [unicode-bidi:isolate]" translate="no">
      {children}
    </span>
  );
}

export default function CoachPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader active="coach" />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: siteUrl },
          { name: "Coaching", item: `${siteUrl}/coach` },
        ]}
      />

      <main className="flex-1">
        <PageMasthead
          eyebrow={siteName}
          title="SF6 Coaching"
          subtitle="From Japan · online · book on Snapchat"
          showBackLink
        />

        <section className="bg-background">
          <div
            className="notranslate mx-auto max-w-3xl space-y-10 px-4 py-12 sm:px-10 sm:py-16"
            translate="no"
          >
            <article className="space-y-3 text-right" dir="rtl" lang="ar">
              <h2 className="border-r-4 border-accent pr-4 text-xl font-bold tracking-tight text-foreground">
                تدريب ستريت فايتر 6 من اليابان
              </h2>
              <p className="text-base leading-relaxed text-muted">
                تدريب <Ltr>SF6</Ltr> عبر الإنترنت. مقيم في اليابان. لاعب منتخب اليابان سابقاً في
                كينغ أوف فايترز <Ltr>2001</Ltr>.
              </p>
              <ul className="list-disc space-y-2 pr-5 text-sm text-muted">
                <li>
                  منتخب اليابان: <Ltr>KOF 2001</Ltr> — ليس منتخب ستريت فايتر
                </li>
                <li>جلسات أونلاين</li>
                <li>
                  الحجز عبر سناب شات: <Ltr>{snapUser}</Ltr>
                </li>
              </ul>
            </article>

            <article className="space-y-3 text-left" dir="ltr" lang="en">
              <h2 className="border-l-4 border-accent pl-4 text-lg font-bold tracking-tight text-foreground sm:text-xl">
                SF6 coaching from Japan
              </h2>
              <p className="text-sm leading-relaxed text-muted sm:text-base">
                Online Street Fighter 6 coaching. Based in Japan. Former Japan
                national team — King of Fighters 2001 (not Street Fighter national).
              </p>
              <ul className="list-disc space-y-2 pl-5 text-sm text-muted">
                <li>Credential: Japan national, KOF 2001</li>
                <li>Online sessions</li>
                <li>Book on Snapchat: {snapUser}</li>
              </ul>
            </article>

            <a
              href={snapAdd}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-accent px-5 py-3 text-sm font-bold text-black hover:opacity-90"
            >
              Snapchat · {snapUser}
            </a>
            <p className="text-xs text-muted" dir="rtl" lang="ar">
              تواصل على سناب شات: <Ltr>{snapUser}</Ltr>
            </p>

            <AdSenseSlot slotId="adsense-coach-below" className="mt-4" />

            <div className="flex flex-wrap gap-4 border-t border-border/80 pt-8">
              <Link
                href="/characters"
                className="inline-flex items-center text-sm font-semibold text-accent hover:text-accent-hover"
              >
                Character roster →
              </Link>
              <Link
                href="/"
                className="inline-flex items-center text-sm text-muted hover:text-foreground"
              >
                Back to home
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

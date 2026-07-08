import Link from "next/link";
import { PageMasthead } from "@/components/PageMasthead";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { siteDomain, siteName, siteNameFull } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `${siteNameFull} privacy policy — cookies, analytics, ads, and affiliate links`,
};

const sections = [
  {
    id: "overview",
    title: "Overview",
    body: [
      `This privacy policy describes how ${siteNameFull} ("we", "us", "our") at ${siteDomain} collects, uses, and shares information when you use our website.`,
      "We provide Street Fighter 6 frame data and lightweight JPG hitbox images. By using this site, you agree to this policy.",
    ],
  },
  {
    id: "collect",
    title: "Information We Collect",
    body: [
      "We do not ask you to create an account. We may automatically collect limited technical data such as browser type, device type, approximate region, pages viewed, and referral URLs.",
      "We do not knowingly collect sensitive personal information.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies and Similar Technologies",
    body: [
      "We and our partners may use cookies, local storage, and similar technologies to operate the site, remember preferences, measure traffic, and serve ads.",
      "You can control cookies through your browser settings. Disabling cookies may affect some features.",
    ],
  },
  {
    id: "analytics",
    title: "Analytics",
    body: [
      "We use Vercel Analytics to understand how visitors use the site (for example, page views and general traffic patterns).",
      "Analytics helps us improve performance and content. Data is processed according to Vercel's policies.",
    ],
  },
  {
    id: "ads",
    title: "Advertising (Google AdSense)",
    body: [
      "We may display ads through Google AdSense. Google and its partners may use cookies to serve ads based on your visits to this and other websites.",
      "You can learn how Google uses data at https://policies.google.com/technologies/partner-sites and opt out of personalized advertising at https://www.google.com/settings/ads.",
    ],
  },
  {
    id: "affiliate",
    title: "Affiliate Links",
    body: [
      "Some links on this site are Amazon affiliate links. If you click and make a qualifying purchase, we may earn a commission at no extra cost to you.",
      "Affiliate partners may use cookies or similar tools to attribute referrals.",
    ],
  },
  {
    id: "third-party",
    title: "Third-Party Links",
    body: [
      "Our site links to external services (for example, Amazon and ad networks). We are not responsible for their privacy practices.",
      "Please review the privacy policies of any third-party sites you visit.",
    ],
  },
  {
    id: "retention",
    title: "Data Retention",
    body: [
      "We retain information only as long as needed for the purposes described in this policy, unless a longer period is required by law.",
    ],
  },
  {
    id: "rights",
    title: "Your Rights",
    body: [
      "Depending on where you live, you may have rights to access, correct, delete, or restrict processing of your personal information.",
      "To exercise these rights, contact us using the information on our About page.",
    ],
  },
  {
    id: "changes",
    title: "Changes to This Policy",
    body: [
      "We may update this policy from time to time. The updated version will be posted on this page with a revised effective date.",
    ],
  },
  {
    id: "contact",
    title: "Contact",
    body: [
      `For privacy questions about ${siteNameFull}, please refer to our About page or visit ${siteDomain}.`,
    ],
  },
] as const;

export default function PrivacyPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader active="about" />

      <main className="flex-1">
        <PageMasthead
          eyebrow={siteName}
          title="Privacy Policy"
          subtitle="Cookies, analytics, advertising, and affiliate disclosures"
          showBackLink
        />

        <section className="bg-background">
          <div className="mx-auto max-w-3xl space-y-14 px-4 py-12 sm:px-10 sm:py-16">
            <p className="text-xs text-muted/80">Effective date: July 5, 2026</p>

            {sections.map((section) => (
              <article key={section.id} id={section.id} className="space-y-4">
                <h2 className="border-l-4 border-accent pl-4 text-lg font-bold tracking-tight text-foreground sm:text-xl">
                  {section.title}
                </h2>
                {section.body.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 24)}
                    className="text-sm leading-relaxed text-muted sm:text-base"
                  >
                    {paragraph}
                  </p>
                ))}
              </article>
            ))}

            <div className="flex flex-wrap gap-4 border-t border-border/80 pt-8">
              <Link
                href="/about"
                className="inline-flex items-center text-sm font-semibold text-accent hover:text-accent-hover"
              >
                About →
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

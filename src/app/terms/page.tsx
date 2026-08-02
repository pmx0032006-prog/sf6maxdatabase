import { LegalDocPage } from "@/components/LegalDocPage";
import { siteContactEmail, siteName, siteNameFull, siteUrl } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `${siteNameFull} terms of use — frame data reference site rules and regional access`,
  alternates: { canonical: `${siteUrl}/terms` },
  openGraph: {
    title: `Terms of Use | ${siteName}`,
    description: `${siteNameFull} terms of use — frame data reference site rules and regional access`,
    url: `${siteUrl}/terms`,
  },
};

export default function TermsPage() {
  return (
    <LegalDocPage
      title="Terms of Use"
      subtitle="Rules for using this SF6 frame data and hitbox database"
      path="/terms"
      crumbName="Terms"
      effectiveDate="August 2, 2026"
      showAdSlot
      sections={[
        {
          id: "service",
          title: "What we provide",
          body: [
            "We provide a free reference website for Street Fighter 6 frame data and lightweight JPG hitbox images. This site is a database tool. It is not a matchmaking lobby, tournament organizer, or official Capcom service.",
          ],
        },
        {
          id: "region",
          title: "Regional access",
          body: [
            "The public site is oriented toward users in the United States. Access may be blocked in certain countries or regions. Bypass requests that ask us to disable geo restrictions will be declined.",
          ],
        },
        {
          id: "conduct",
          title: "Acceptable use",
          body: ["Please be kind. You may not:"],
          bullets: [
            "harass, threaten, or abuse others in communications with us",
            "attempt to disrupt, scrape abusively, or break the service",
            "use the site for unlawful purposes",
            "encourage clicking ads or otherwise manipulate monetization",
          ],
        },
        {
          id: "accuracy",
          title: "Data accuracy",
          body: [
            "Frame data and hitbox images are provided as a reference. Game patches can change values and visuals. Always confirm important details in your own training. You are responsible for how you use the information.",
          ],
        },
        {
          id: "ip",
          title: "Intellectual property",
          body: [
            "Street Fighter, Street Fighter 6, and related marks are owned by their respective owners (including Capcom). Our site presentation, organization, and tooling belong to us. Do not bulk-redistribute our captured assets or mirror the database without permission.",
          ],
        },
        {
          id: "ads",
          title: "Ads and affiliates",
          body: [
            "We may show advertising and Amazon Associate links in allowed placements. See our Ads & Affiliate Disclosure. Ads are never placed over the hitbox viewer or stuck to the frame-data table header.",
          ],
        },
        {
          id: "disclaimer",
          title: "Disclaimer",
          body: [
            'The site is provided "as is" without warranties of any kind to the fullest extent permitted by law. We are not liable for decisions, match results, purchases, or losses arising from use of the site or its data.',
          ],
        },
        {
          id: "changes",
          title: "Changes",
          body: [
            "We may update these terms. Continued use after changes means you accept the updated terms.",
          ],
        },
        {
          id: "contact",
          title: "Contact",
          body: [
            `Questions about these terms: visit our Contact page or email ${siteContactEmail}.`,
          ],
        },
        {
          id: "governing-law",
          title: "Governing law",
          body: [
            "Governing law and venue will be confirmed by the operator as needed. Until then, disputes should first be raised politely through Contact.",
          ],
        },
      ]}
      footerLinks={[
        { href: "/disclosure", label: "Ads & Affiliates →", primary: true },
        { href: "/contact", label: "Contact →", primary: true },
        { href: "/", label: "Back to home" },
      ]}
    />
  );
}

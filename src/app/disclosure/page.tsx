import { LegalDocPage } from "@/components/LegalDocPage";
import { siteContactEmail, siteName, siteNameFull, siteUrl } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ads & Affiliate Disclosure",
  description: `${siteNameFull} ads and Amazon Associates disclosure — placements and policies`,
  alternates: { canonical: `${siteUrl}/disclosure` },
  openGraph: {
    title: `Ads & Affiliate Disclosure | ${siteName}`,
    description: `${siteNameFull} ads and Amazon Associates disclosure — placements and policies`,
    url: `${siteUrl}/disclosure`,
  },
};

export default function DisclosurePage() {
  return (
    <LegalDocPage
      title="Ads & Affiliate Disclosure"
      subtitle="How advertising and Amazon links appear on this site"
      path="/disclosure"
      crumbName="Disclosure"
      effectiveDate="August 2, 2026"
      showAdSlot
      sections={[
        {
          id: "advertising",
          title: "Advertising",
          body: [
            "We may display ads served by Google AdSense. Ad partners may use cookies or similar technologies as described in our Privacy Policy.",
          ],
        },
        {
          id: "amazon",
          title: "Amazon Associates",
          body: [
            `${siteNameFull} is a participant in the Amazon Services LLC Associates Program. We may earn commissions from qualifying purchases made through our links to Amazon.com at no extra cost to you. Our store tag is sf6maxdatabas-20.`,
          ],
        },
        {
          id: "independence",
          title: "Editorial independence",
          body: [
            "Hitbox images and frame data are not altered to favor a product. Gear recommendations are separate from move-data accuracy.",
          ],
        },
        {
          id: "allowed",
          title: "Where ads and affiliate units may appear",
          body: ["Allowed examples:"],
          bullets: [
            "below the character roster",
            "lower on About and similar pages",
            "on character pages after meaningful scroll (not on top of the viewer)",
          ],
        },
        {
          id: "not-allowed",
          title: "Where they will not appear",
          body: ["Not allowed:"],
          bullets: [
            "overlays on the hitbox image viewer",
            "sticky units attached to the frame-data table header",
            "stacking multiple ads into a single mobile viewport",
            'any "click the ad" style wording',
          ],
        },
        {
          id: "other",
          title: "Other networks",
          body: [
            "We do not list other advertising networks on this page unless the operator adds them later.",
          ],
        },
        {
          id: "questions",
          title: "Questions",
          body: [
            `See our Contact page, or email ${siteContactEmail}.`,
          ],
        },
      ]}
      footerLinks={[
        { href: "/contact", label: "Contact →", primary: true },
        { href: "/privacy", label: "Privacy →" },
        { href: "/", label: "Back to home" },
      ]}
    />
  );
}

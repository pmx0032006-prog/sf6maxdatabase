import { LegalDocPage } from "@/components/LegalDocPage";
import { siteContactEmail, siteName, siteNameFull, siteUrl } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: `${siteNameFull} contact — privacy, terms, ads, and data correction inbox`,
  alternates: { canonical: `${siteUrl}/contact` },
  openGraph: {
    title: `Contact | ${siteName}`,
    description: `${siteNameFull} contact — privacy, terms, ads, and data correction inbox`,
    url: `${siteUrl}/contact`,
  },
};

export default function ContactPage() {
  return (
    <LegalDocPage
      title="Contact"
      subtitle="One inbox for privacy, terms, ads, and data corrections"
      path="/contact"
      crumbName="Contact"
      sections={[
        {
          id: "inbox",
          title: "How to reach us",
          body: [
            `Email: ${siteContactEmail}`,
            `For ${siteNameFull} questions, use that address. Please include enough detail for us to help.`,
          ],
        },
        {
          id: "topics",
          title: "What to write about",
          bullets: [
            "Privacy Policy or Terms of Use",
            "Ads and affiliate disclosure questions",
            "Bug reports and data corrections (character, move, frame, or image issues)",
            "Sponsorship or partnership inquiries",
          ],
        },
        {
          id: "reply",
          title: "Reply expectations",
          body: [
            "We review messages as soon as we can. Response time is not guaranteed.",
          ],
        },
        {
          id: "emergencies",
          title: "Emergencies",
          body: [
            "If you are in personal danger or reporting a crime, contact local authorities first. Do not rely on this inbox for emergencies.",
          ],
        },
        {
          id: "region",
          title: "Regional access",
          body: [
            "If the site is unavailable in your region, that is intentional policy. Please do not email only to request geo-block removal.",
          ],
        },
        {
          id: "tips",
          title: "Sending tips",
          body: [
            "Include the page URL, character name, move name, and what looks wrong. Do not send abuse toward other players.",
          ],
        },
      ]}
      footerLinks={[
        {
          href: `mailto:${siteContactEmail}`,
          label: `Email ${siteContactEmail} →`,
          primary: true,
        },
        { href: "/privacy", label: "Privacy →" },
        { href: "/terms", label: "Terms →" },
        { href: "/", label: "Back to home" },
      ]}
    />
  );
}

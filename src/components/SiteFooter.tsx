import Link from "next/link";
import { AffiliateGearStrip } from "@/components/AffiliateGearStrip";
import { siteDomain, siteName, siteNameFull } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/80 bg-background">
      {/* AFFILIATE-GEAR-STRIP */}
      <div className="mx-auto max-w-6xl px-6 py-10 text-center sm:px-10">
        <p className="text-[10px] font-bold tracking-[0.28em] text-accent uppercase">
          {siteNameFull}
        </p>
        <p className="mt-2 text-xs tracking-wide text-muted">© 2026 {siteName}</p>
        <p className="mt-1 text-xs text-muted/70">{siteDomain}</p>
        <p className="mt-2 text-xs text-muted/80">
          All 30 characters — lightweight JPG hitboxes + frame data (lookup 0 MISS)
        </p>
        <AffiliateGearStrip />
        <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          <Link href="/characters" className="text-accent hover:text-accent-hover">
            Character roster →
          </Link>
          <Link href="/about" className="text-accent hover:text-accent-hover">
            About →
          </Link>
          <Link href="/privacy" className="text-accent hover:text-accent-hover">
            Privacy →
          </Link>
        </div>
      </div>
    </footer>
  );
}

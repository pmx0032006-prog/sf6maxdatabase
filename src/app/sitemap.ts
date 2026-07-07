// SEO-BASICS-APPLIED
import type { MetadataRoute } from "next";
import { roster } from "@/data/characters";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const staticRoutes = ["", "/characters", "/meta", "/about", "/privacy"];

  const pages: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));

  const characterPages: MetadataRoute.Sitemap = roster.map((character) => ({
    url: `${siteUrl}/characters/${character.slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [...pages, ...characterPages];
}

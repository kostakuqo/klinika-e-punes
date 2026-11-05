import type { MetadataRoute } from "next";
import { appPathnames, locales } from "@/i18n/routing";
import { absoluteUrl, languageAlternates } from "@/lib/seo/site-url";

/** /sitemap.xml — every page in all three languages, with hreflang links. */
export default function sitemap(): MetadataRoute.Sitemap {
  return appPathnames.flatMap((href) =>
    locales.map((locale) => ({
      url: absoluteUrl(href, locale),
      lastModified: new Date(),
      changeFrequency: href === "/" ? "weekly" : "monthly",
      priority: href === "/" ? 1 : 0.7,
      alternates: { languages: languageAlternates(href) },
    })),
  );
}

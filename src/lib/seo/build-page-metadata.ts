import type { Metadata } from "next";
import type { AppPathname, Locale } from "@/i18n/routing";
import type { Seo } from "@/lib/content/content-types";
import { absoluteUrl, languageAlternates } from "./site-url";

const ogLocale: Record<Locale, string> = { sq: "sq_AL", en: "en_GB", it: "it_IT" };

export function buildPageMetadata(seo: Seo, href: AppPathname, locale: Locale, image?: string): Metadata {
  const title = seo.title[locale] || seo.title.sq;
  const description = seo.description[locale] || seo.description.sq;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: absoluteUrl(href, locale), languages: languageAlternates(href) },
    openGraph: {
      title,
      description,
      url: absoluteUrl(href, locale),
      siteName: "Klinika e Punës",
      locale: ogLocale[locale],
      type: "website",
      ...(image ? { images: [{ url: image }] } : {}),
    },
  };
}

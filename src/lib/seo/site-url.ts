import { getPathname } from "@/i18n/navigation";
import { locales, type AppPathname, type Locale } from "@/i18n/routing";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://klinikaepunes.al").replace(/\/$/, "");

/** Absolute URL with trailing slash, e.g. https://klinikaepunes.al/en/about/ */
export function absoluteUrl(href: AppPathname, locale: Locale): string {
  const path = getPathname({ href, locale });
  const withSlash = path.endsWith("/") ? path : `${path}/`;
  return `${siteUrl}${withSlash}`;
}

/** hreflang alternates for one page in every language, plus x-default. */
export function languageAlternates(href: AppPathname): Record<string, string> {
  const entries = locales.map((l) => [l, absoluteUrl(href, l)]);
  return { ...Object.fromEntries(entries), "x-default": absoluteUrl(href, "sq") };
}

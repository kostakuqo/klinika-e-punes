import type { Metadata } from "next";
import type { AppPathname, Locale } from "@/i18n/routing";
import type { InnerPageId } from "./content-types";
import { getSiteContent } from "./get-site-content";
import { buildPageMetadata } from "@/lib/seo/build-page-metadata";

export type LocaleParams = { params: Promise<{ locale: Locale }> };

/** generateMetadata factory for an inner page, reading SEO fields from the admin. */
export function innerPageMetadata(id: InnerPageId, href: AppPathname) {
  return async ({ params }: LocaleParams): Promise<Metadata> => {
    const { locale } = await params;
    const { pages } = await getSiteContent();
    return buildPageMetadata(pages[id].seo, href, locale, pages[id].imageUrl || undefined);
  };
}

/** Splits admin text into paragraphs on blank lines. */
export const paragraphs = (text: string) => text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

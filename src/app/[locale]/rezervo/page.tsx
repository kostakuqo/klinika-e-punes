import { setRequestLocale } from "next-intl/server";
import { getSiteContent } from "@/lib/content/get-site-content";
import { innerPageMetadata, type LocaleParams } from "@/lib/content/inner-page-helpers";
import { PageHero } from "@/components/site/page-hero";
import { ContactDetails } from "@/components/site/contact-details";

export const generateMetadata = innerPageMetadata("book", "/rezervo");

// Booking requests are sent with the same form as Kontakto (source "book")
// and appear in Admin → Mesazhet.
export default async function BookPage({ params }: LocaleParams) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { pages, settings } = await getSiteContent();

  return (
    <>
      <PageHero title={pages.book.title[locale]} intro={pages.book.intro[locale]} imageUrl={pages.book.heroImageUrl} />
      <ContactDetails settings={settings} locale={locale} source="book" />
    </>
  );
}

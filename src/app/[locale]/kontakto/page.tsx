import { setRequestLocale } from "next-intl/server";
import { getSiteContent } from "@/lib/content/get-site-content";
import { innerPageMetadata, type LocaleParams } from "@/lib/content/inner-page-helpers";
import { PageHero } from "@/components/site/page-hero";
import { ContactDetails } from "@/components/site/contact-details";

export const generateMetadata = innerPageMetadata("contact", "/kontakto");

export default async function ContactPage({ params }: LocaleParams) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { pages, settings } = await getSiteContent();

  return (
    <>
      <PageHero title={pages.contact.title[locale]} intro={pages.contact.intro[locale]} />
      <ContactDetails settings={settings} locale={locale} />
    </>
  );
}

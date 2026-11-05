import { getTranslations, setRequestLocale } from "next-intl/server";
import { getSiteContent } from "@/lib/content/get-site-content";
import { innerPageMetadata, type LocaleParams } from "@/lib/content/inner-page-helpers";
import { PageHero } from "@/components/site/page-hero";
import { DoctorsGrid } from "@/components/home/doctors-grid";
import { BookingCtaBand } from "@/components/home/booking-cta-band";

export const generateMetadata = innerPageMetadata("doctors", "/mjeket");

export default async function DoctorsPage({ params }: LocaleParams) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { pages, doctors, home, settings } = await getSiteContent();
  const t = await getTranslations();
  const page = pages.doctors;

  return (
    <>
      <PageHero title={page.title[locale]} intro={page.intro[locale]} />
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        {doctors.length > 0 ? (
          <DoctorsGrid doctors={doctors} locale={locale} showBio />
        ) : (
          <p className="text-lg text-steel">{t("common.doctorSoon")}</p>
        )}
      </section>
      <BookingCtaBand title={home.ctaTitle[locale]} text={home.ctaText[locale]} bookLabel={t("nav.book")} phone={settings.phone} />
    </>
  );
}

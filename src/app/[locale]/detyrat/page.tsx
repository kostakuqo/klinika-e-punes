import { getTranslations, setRequestLocale } from "next-intl/server";
import { getSiteContent } from "@/lib/content/get-site-content";
import { innerPageMetadata, type LocaleParams } from "@/lib/content/inner-page-helpers";
import { PageHero } from "@/components/site/page-hero";
import { ServicesPanel } from "@/components/home/services-panel";
import { ProcessTimeline } from "@/components/home/process-timeline";
import { BookingCtaBand } from "@/components/home/booking-cta-band";
import { Reveal } from "@/components/site/reveal";

export const generateMetadata = innerPageMetadata("services", "/detyrat");

export default async function ServicesPage({ params }: LocaleParams) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { pages, services, home, settings } = await getSiteContent();
  const t = await getTranslations("nav");
  const page = pages.services;

  return (
    <>
      <PageHero title={page.title[locale]} intro={page.intro[locale]} imageUrl={page.heroImageUrl} />
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <ServicesPanel services={services} locale={locale} />
      </section>
      <section className="bg-navy-deep text-white">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 py-24 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:gap-20 lg:px-8">
          <Reveal className="lg:sticky lg:top-32 lg:self-start">
            <h2 className="text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] font-semibold">{home.processTitle[locale]}</h2>
            <p className="mt-5 max-w-md text-lg text-white/68">{home.processIntro[locale]}</p>
          </Reveal>
          <ProcessTimeline steps={home.processSteps.map((s) => ({ title: s.title[locale], text: s.text[locale] }))} />
        </div>
      </section>
      <BookingCtaBand title={home.ctaTitle[locale]} text={home.ctaText[locale]} bookLabel={t("book")} phone={settings.phone} />
    </>
  );
}

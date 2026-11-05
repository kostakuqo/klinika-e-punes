import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { getSiteContent } from "@/lib/content/get-site-content";
import { buildPageMetadata } from "@/lib/seo/build-page-metadata";
import { Reveal } from "@/components/site/reveal";
import { HomeHero } from "@/components/home/home-hero";
import { ServicesPanel } from "@/components/home/services-panel";
import { ProcessTimeline } from "@/components/home/process-timeline";
import { IndustriesMarquee } from "@/components/home/industries-marquee";
import { DoctorsGrid } from "@/components/home/doctors-grid";
import { BookingCtaBand } from "@/components/home/booking-cta-band";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { home } = await getSiteContent();
  return buildPageMetadata(home.seo, "/", locale);
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { home, services, industries, doctors, settings } = await getSiteContent();
  const t = await getTranslations();

  return (
    <>
      <HomeHero
        title={home.heroTitle[locale]}
        lead={home.heroLead[locale]}
        phone={settings.phone}
        bookLabel={t("nav.book")}
        dialLabels={{ hours: t("dial.hours"), work: t("dial.work"), day: t("dial.day") }}
        imageUrl={home.heroImageUrl}
      />

      {/* Services */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <Reveal className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] font-semibold text-navy">{home.servicesTitle[locale]}</h2>
            <p className="mt-4 text-lg text-steel">{home.servicesIntro[locale]}</p>
          </div>
          <Link href="/detyrat" className="font-semibold text-navy underline decoration-amber decoration-2 underline-offset-6 hover:decoration-navy">
            {t("common.allServices")}
          </Link>
        </Reveal>
        <ServicesPanel services={services} locale={locale} />
      </section>

      {/* Sectors */}
      <section aria-labelledby="industries-title" className="border-y border-frost bg-white py-14">
        <h2 id="industries-title" className="mx-auto mb-4 max-w-7xl px-4 text-lg text-steel sm:px-6 lg:px-8">
          {home.industriesTitle[locale]}
        </h2>
        <IndustriesMarquee items={industries.map((i) => i.name[locale])} />
      </section>

      {/* Process */}
      <section className="bg-navy-deep text-white">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 py-24 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:gap-20 lg:px-8 lg:py-32">
          <Reveal className="lg:sticky lg:top-32 lg:self-start">
            <h2 className="text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] font-semibold">{home.processTitle[locale]}</h2>
            <p className="mt-5 max-w-md text-lg text-white/68">{home.processIntro[locale]}</p>
          </Reveal>
          <ProcessTimeline steps={home.processSteps.map((s) => ({ title: s.title[locale], text: s.text[locale] }))} />
        </div>
      </section>

      {/* Doctors — appears once profiles are added in the admin panel */}
      {doctors.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <Reveal>
            <h2 className="mb-12 text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] font-semibold text-navy">{home.doctorsTitle[locale]}</h2>
          </Reveal>
          <DoctorsGrid doctors={doctors.slice(0, 4)} locale={locale} />
        </section>
      )}

      {/* Statement */}
      <section className="mx-auto max-w-5xl px-4 pt-24 text-center sm:px-6 lg:px-8">
        <Reveal>
          <p className="font-display text-[clamp(1.9rem,4.4vw,3.6rem)] leading-[1.1] font-medium text-navy">
            {home.quote[locale]}
          </p>
        </Reveal>
      </section>

      <BookingCtaBand title={home.ctaTitle[locale]} text={home.ctaText[locale]} bookLabel={t("nav.book")} phone={settings.phone} />
    </>
  );
}

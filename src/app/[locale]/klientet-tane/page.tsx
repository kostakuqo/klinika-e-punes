import { getTranslations, setRequestLocale } from "next-intl/server";
import { getSiteContent } from "@/lib/content/get-site-content";
import { innerPageMetadata, type LocaleParams } from "@/lib/content/inner-page-helpers";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { BookingCtaBand } from "@/components/home/booking-cta-band";

export const generateMetadata = innerPageMetadata("clients", "/klientet-tane");

export default async function ClientsPage({ params }: LocaleParams) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { pages, industries, home, settings } = await getSiteContent();
  const t = await getTranslations("nav");
  const page = pages.clients;

  return (
    <>
      <PageHero title={page.title[locale]} intro={page.intro[locale]} imageUrl={page.heroImageUrl} />
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <ul className="grid gap-px overflow-hidden rounded-[28px] border border-frost bg-frost sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((ind, i) => (
            <li key={ind.id} className="bg-white">
              <Reveal delay={(i % 3) * 0.06} className="flex items-center gap-4 p-7 sm:p-8">
                <span aria-hidden className="size-3 shrink-0 rotate-45 bg-amber" />
                <span className="font-display text-xl font-medium text-navy sm:text-2xl">{ind.name[locale]}</span>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>
      <BookingCtaBand title={home.ctaTitle[locale]} text={home.ctaText[locale]} bookLabel={t("book")} phone={settings.phone} />
    </>
  );
}

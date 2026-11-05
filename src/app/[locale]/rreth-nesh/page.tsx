import { setRequestLocale } from "next-intl/server";
import { getSiteContent } from "@/lib/content/get-site-content";
import { innerPageMetadata, paragraphs, type LocaleParams } from "@/lib/content/inner-page-helpers";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { IndustriesMarquee } from "@/components/home/industries-marquee";

export const generateMetadata = innerPageMetadata("about", "/rreth-nesh");

export default async function AboutPage({ params }: LocaleParams) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { pages, industries, home } = await getSiteContent();
  const page = pages.about;

  return (
    <>
      <PageHero title={page.title[locale]} intro={page.intro[locale]} />
      <section className="mx-auto grid max-w-7xl gap-14 px-4 py-24 sm:px-6 lg:grid-cols-[1.3fr_1fr] lg:px-8">
        <Reveal className="space-y-6 text-lg leading-[1.75] text-ink/85">
          {paragraphs(page.body[locale]).map((p, i) => (
            <p key={i} className="max-w-[68ch]">{p}</p>
          ))}
        </Reveal>
        {page.imageUrl ? (
          <Reveal delay={0.1}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={page.imageUrl} alt="" className="aspect-[4/5] w-full rounded-[28px] object-cover" />
          </Reveal>
        ) : (
          <Reveal delay={0.1} className="self-start rounded-[28px] bg-navy p-10 text-white">
            <p className="font-display text-3xl leading-tight font-medium">{home.quote[locale]}</p>
          </Reveal>
        )}
      </section>
      <section aria-labelledby="sectors" className="border-t border-frost bg-white py-14">
        <h2 id="sectors" className="mx-auto mb-4 max-w-7xl px-4 text-lg text-steel sm:px-6 lg:px-8">{home.industriesTitle[locale]}</h2>
        <IndustriesMarquee items={industries.map((i) => i.name[locale])} />
      </section>
    </>
  );
}

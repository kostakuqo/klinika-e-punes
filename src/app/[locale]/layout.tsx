import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { familjen, atkinson } from "../site-fonts";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { getSiteContent } from "@/lib/content/get-site-content";
import { siteUrl } from "@/lib/seo/site-url";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { SmoothScrollProvider } from "@/components/site/smooth-scroll-provider";
import "../globals.css";


export const metadata: Metadata = { metadataBase: new URL(siteUrl) };
export const viewport: Viewport = { themeColor: "#0c1b33" };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const { settings } = await getSiteContent();

  // Structured data so Google shows the clinic as a medical business
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: settings.name,
    url: siteUrl,
    telephone: settings.phone,
    email: settings.email,
    medicalSpecialty: "OccupationalMedicine",
    address: { "@type": "PostalAddress", streetAddress: settings.address[locale as Locale], addressCountry: "AL" },
    sameAs: [settings.facebook, settings.instagram, settings.linkedin].filter(Boolean),
  };

  return (
    <html lang={locale} className={`${familjen.variable} ${atkinson.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <NextIntlClientProvider>
          <SmoothScrollProvider>
            <SiteHeader name={settings.name} logoUrl={settings.logoUrl} phone={settings.phone} />
            <main id="content">{children}</main>
            <SiteFooter settings={settings} locale={locale as Locale} />
          </SmoothScrollProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

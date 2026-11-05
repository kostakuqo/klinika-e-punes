import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import type { SiteSettings } from "@/lib/content/content-types";
import { Reveal } from "./reveal";
import { ContactForm } from "./contact-form";
import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from "./contact-icons";

/**
 * Body of Kontakto and Rezervo: the message form, the clinic's contact
 * details (from Admin → Cilësimet) and the map.
 */
export async function ContactDetails({
  settings,
  locale,
  source,
}: {
  settings: SiteSettings;
  locale: Locale;
  source: "contact" | "book";
}) {
  const t = await getTranslations("common");
  const rows: { label: string; value: string; href?: string; icon: ReactNode }[] = [
    { label: t("phone"), value: settings.phone, href: `tel:${settings.phone.replace(/\s/g, "")}`, icon: <PhoneIcon /> },
    { label: "Email", value: settings.email, href: `mailto:${settings.email}`, icon: <MailIcon /> },
    { label: t("address"), value: settings.address[locale], icon: <MapPinIcon /> },
    ...(settings.hours[locale] ? [{ label: t("hours"), value: settings.hours[locale], icon: <ClockIcon /> }] : []),
  ];

  return (
    <>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.35fr_1fr] lg:gap-14 lg:px-8 lg:py-24">
        <Reveal>
          <ContactForm source={source} />
        </Reveal>
        <Reveal delay={0.1}>
          <ul className="space-y-6 lg:pt-6">
            {rows.map((r) => (
              <li key={r.label} className="flex items-start gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-amber-soft text-navy">{r.icon}</span>
                <div>
                  <p className="text-sm text-steel">{r.label}</p>
                  <p className="font-display text-xl font-medium whitespace-pre-line text-navy">
                    {r.href ? (
                      <a href={r.href} className="hover:underline hover:decoration-amber hover:decoration-2 hover:underline-offset-4">{r.value}</a>
                    ) : (
                      r.value
                    )}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal className="overflow-hidden rounded-[28px] border border-frost bg-frost">
          <iframe
            title={settings.address[locale]}
            src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.mapQuery)}&t=m&z=15&output=embed`}
            className="h-[420px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Reveal>
      </section>
    </>
  );
}

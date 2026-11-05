import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import type { SiteSettings } from "@/lib/content/content-types";
import { Reveal } from "./reveal";

/** Phone, email, address and the map. Shared by Kontakto and Rezervo. */
export async function ContactDetails({ settings, locale }: { settings: SiteSettings; locale: Locale }) {
  const t = await getTranslations("common");
  const rows = [
    { label: t("phone"), value: settings.phone, href: `tel:${settings.phone.replace(/\s/g, "")}` },
    { label: "Email", value: settings.email, href: `mailto:${settings.email}` },
    { label: t("address"), value: settings.address[locale] },
    ...(settings.hours[locale] ? [{ label: t("hours"), value: settings.hours[locale] }] : []),
  ];

  return (
    <section className="mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[1fr_1.3fr] lg:px-8">
      <Reveal>
        <dl className="divide-y divide-frost border-y border-frost">
          {rows.map((r) => (
            <div key={r.label} className="grid gap-1 py-6 sm:grid-cols-[9rem_1fr]">
              <dt className="text-steel">{r.label}</dt>
              <dd className="font-display text-xl font-medium whitespace-pre-line text-navy sm:text-2xl">
                {r.href ? <a href={r.href} className="hover:underline hover:decoration-amber hover:decoration-2 hover:underline-offset-4">{r.value}</a> : r.value}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
      <Reveal delay={0.1} className="overflow-hidden rounded-[28px] border border-frost bg-frost">
        <iframe
          title={settings.address[locale]}
          src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.mapQuery)}&t=m&z=15&output=embed`}
          className="aspect-[4/3] h-full min-h-80 w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </Reveal>
    </section>
  );
}

import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { SiteSettings } from "@/lib/content/content-types";
import { BrandMark } from "./brand-mark";

export async function SiteFooter({ settings, locale }: { settings: SiteSettings; locale: Locale }) {
  const t = await getTranslations("nav");
  const c = await getTranslations("common");
  const tel = settings.phone.replace(/\s/g, "");
  const socials = [
    { label: "Facebook", href: settings.facebook },
    { label: "Instagram", href: settings.instagram },
    { label: "LinkedIn", href: settings.linkedin },
  ].filter((s) => s.href);

  return (
    <footer className="bg-navy-deep text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div className="space-y-5">
          <BrandMark name={settings.name} logoUrl={settings.logoUrl} tone="light" />
          <p className="max-w-sm text-white/65">{settings.address[locale]}</p>
          {settings.hours[locale] && <p className="max-w-sm whitespace-pre-line text-white/65">{settings.hours[locale]}</p>}
        </div>

        <nav aria-label="Footer">
          <ul className="space-y-2.5 text-white/75">
            <li><Link href="/rreth-nesh" className="hover:text-white">{t("about")}</Link></li>
            <li><Link href="/detyrat" className="hover:text-white">{t("services")}</Link></li>
            <li><Link href="/mjeket" className="hover:text-white">{t("doctors")}</Link></li>
            <li><Link href="/klientet-tane" className="hover:text-white">{t("clients")}</Link></li>
            <li><Link href="/kontakto" className="hover:text-white">{t("contact")}</Link></li>
          </ul>
        </nav>

        <div className="space-y-2.5">
          <a href={`tel:${tel}`} className="block font-display text-2xl font-medium hover:text-amber">{settings.phone}</a>
          <a href={`mailto:${settings.email}`} className="block text-white/75 hover:text-white">{settings.email}</a>
          {socials.length > 0 && (
            <ul className="flex gap-4 pt-3 text-white/75">
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:text-white hover:underline">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-6 text-sm text-white/50 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} {settings.name}. {c("rights")}
        </p>
      </div>
    </footer>
  );
}

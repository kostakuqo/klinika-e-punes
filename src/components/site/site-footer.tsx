import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { SiteSettings } from "@/lib/content/content-types";
import { BrandMark } from "./brand-mark";
import { ClockIcon, FacebookIcon, InstagramIcon, LinkedInIcon, MailIcon, MapPinIcon, PhoneIcon } from "./contact-icons";

/** All contact data comes from Admin → Cilësimet. */
export async function SiteFooter({ settings, locale }: { settings: SiteSettings; locale: Locale }) {
  const t = await getTranslations("nav");
  const c = await getTranslations("common");
  const tel = settings.phone.replace(/\s/g, "");
  const socials = [
    { label: "Facebook", href: settings.facebook, icon: <FacebookIcon /> },
    { label: "Instagram", href: settings.instagram, icon: <InstagramIcon /> },
    { label: "LinkedIn", href: settings.linkedin, icon: <LinkedInIcon /> },
  ].filter((s) => s.href);

  return (
    <footer className="bg-navy-deep text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.3fr_1fr_1.2fr] lg:px-8">
        <div className="space-y-6">
          <BrandMark name={settings.name} logoUrl={settings.logoUrl} tone="light" />
          {socials.length > 0 && (
            <ul className="flex gap-2.5" aria-label={c("followUs")}>
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    title={s.label}
                    className="grid size-11 place-items-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-amber hover:bg-amber hover:text-navy-deep"
                  >
                    {s.icon}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav aria-label="Footer">
          <ul className="space-y-2.5 text-white/75">
            <li><Link href="/" className="hover:text-white">{t("home")}</Link></li>
            <li><Link href="/rreth-nesh" className="hover:text-white">{t("about")}</Link></li>
            <li><Link href="/detyrat" className="hover:text-white">{t("services")}</Link></li>
            <li><Link href="/mjeket" className="hover:text-white">{t("doctors")}</Link></li>
            <li><Link href="/klientet-tane" className="hover:text-white">{t("clients")}</Link></li>
            <li><Link href="/kontakto" className="hover:text-white">{t("contact")}</Link></li>
          </ul>
        </nav>

        <ul className="space-y-4">
          <ContactRow icon={<PhoneIcon />}>
            <a href={`tel:${tel}`} className="font-display text-xl font-medium tabular-nums hover:text-amber">{settings.phone}</a>
          </ContactRow>
          <ContactRow icon={<MailIcon />}>
            <a href={`mailto:${settings.email}`} className="text-white/80 hover:text-white">{settings.email}</a>
          </ContactRow>
          {settings.address[locale] && (
            <ContactRow icon={<MapPinIcon />}>
              <span className="text-white/80">{settings.address[locale]}</span>
            </ContactRow>
          )}
          {settings.hours[locale] && (
            <ContactRow icon={<ClockIcon />}>
              <span className="whitespace-pre-line text-white/80">{settings.hours[locale]}</span>
            </ContactRow>
          )}
        </ul>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-6 text-sm text-white/50 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} {settings.name}. {c("rights")}
        </p>
      </div>
    </footer>
  );
}

function ContactRow({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-white/8 text-amber">{icon}</span>
      <span className="pt-1.5">{children}</span>
    </li>
  );
}

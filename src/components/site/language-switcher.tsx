"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { clsx } from "clsx";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";

const labels: Record<Locale, string> = { sq: "SQ", en: "EN", it: "IT" };
const names: Record<Locale, string> = { sq: "Shqip", en: "English", it: "Italiano" };

export function LanguageSwitcher({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const t = useTranslations("nav");
  const current = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div role="group" aria-label={t("language")} className={clsx("flex items-center gap-0.5 rounded-full p-1", tone === "light" ? "bg-white/10" : "bg-navy/5")}>
      {locales.map((locale) => (
        <button
          key={locale}
          type="button"
          lang={locale}
          title={names[locale]}
          aria-current={locale === current ? "true" : undefined}
          disabled={pending}
          onClick={() =>
            startTransition(() => {
              router.replace(pathname, { locale, scroll: false });
            })
          }
          className={clsx(
            "rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
            locale === current
              ? "bg-amber text-navy-deep"
              : tone === "light"
                ? "text-white/70 hover:text-white"
                : "text-steel hover:text-navy",
          )}
        >
          {labels[locale]}
        </button>
      ))}
    </div>
  );
}

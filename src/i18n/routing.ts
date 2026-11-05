import { defineRouting } from "next-intl/routing";

export const locales = ["sq", "en", "it"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "sq";

/**
 * Albanian lives on the root and keeps the exact slugs of the old WordPress
 * site, so existing Google results keep working. English and Italian get
 * their own translated slugs under /en and /it.
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
  localeDetection: false,
  pathnames: {
    "/": "/",
    "/rreth-nesh": { sq: "/rreth-nesh", en: "/about", it: "/chi-siamo" },
    "/detyrat": { sq: "/detyrat", en: "/services", it: "/servizi" },
    "/mjeket": { sq: "/mjeket", en: "/doctors", it: "/medici" },
    "/klientet-tane": { sq: "/klientet-tane", en: "/clients", it: "/clienti" },
    "/kontakto": { sq: "/kontakto", en: "/contact", it: "/contatti" },
    "/rezervo": { sq: "/rezervo", en: "/book", it: "/prenota" },
  },
});

export type AppPathname = keyof typeof routing.pathnames;
export const appPathnames = Object.keys(routing.pathnames) as AppPathname[];

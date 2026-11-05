import type { Locale } from "@/i18n/routing";

/** A text field translated into every site language. */
export type Localized = Record<Locale, string>;

export type Seo = { title: Localized; description: Localized };

export type SiteSettings = {
  name: string;
  phone: string;
  email: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  address: Localized;
  hours: Localized;
  /** Google Maps search used for the embedded map */
  mapQuery: string;
  /** Cloudinary URL; empty = built-in logo mark */
  logoUrl: string;
};

export type ProcessStep = { title: Localized; text: Localized };

export type HomePage = {
  seo: Seo;
  heroTitle: Localized;
  heroLead: Localized;
  servicesTitle: Localized;
  servicesIntro: Localized;
  processTitle: Localized;
  processIntro: Localized;
  processSteps: ProcessStep[];
  industriesTitle: Localized;
  doctorsTitle: Localized;
  quote: Localized;
  ctaTitle: Localized;
  ctaText: Localized;
};

/** Generic inner page (Rreth nesh, Detyrat, Klientët, Kontakto, Mjekët). */
export type InnerPage = {
  seo: Seo;
  title: Localized;
  intro: Localized;
  /** Paragraphs separated by a blank line */
  body: Localized;
  imageUrl: string;
};

export type InnerPageId = "about" | "services" | "doctors" | "clients" | "contact" | "book";

export type ServiceIcon = "shield" | "gauge" | "pulse" | "certificate" | "clipboard" | "flask";

export type Service = {
  id: string;
  order: number;
  icon: ServiceIcon;
  title: Localized;
  text: Localized;
};

export type Doctor = {
  id: string;
  order: number;
  name: string;
  role: Localized;
  bio: Localized;
  photoUrl: string;
};

export type Industry = { id: string; order: number; name: Localized };

export type SiteContent = {
  settings: SiteSettings;
  home: HomePage;
  pages: Record<InnerPageId, InnerPage>;
  services: Service[];
  doctors: Doctor[];
  industries: Industry[];
};
